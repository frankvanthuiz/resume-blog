#!/usr/bin/env python3
"""
Add TL;DR and FAQ sections to existing blog articles.

Usage:
  python add_tldr_faq.py               # Process all articles
  python add_tldr_faq.py --dry-run     # Preview without committing
  python add_tldr_faq.py --slug some-slug  # Process one article only
"""

import os
import sys
import re
import argparse
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

SKIP = {'sample-post.mdx'}


def generate_tldr_and_faq(article_text: str, title: str) -> tuple[str, str]:
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

    prompt = f"""You are an SEO content editor improving a blog article for AI comprehension and featured snippets.

Article title: {title}

Article content (first 3000 chars):
{article_text[:3000]}

Generate two sections:

1. TL;DR — exactly 4 bullet points summarizing the key takeaways. Each bullet is one clear, actionable sentence.

2. FAQ — exactly 6 question-and-answer pairs. Questions should match how real users search (e.g. "What is...", "How do I...", "Does..."). Answers should be 1–2 sentences, direct and specific.

Output in this EXACT format (no extra text, no explanation):

TLDR:
- [bullet 1]
- [bullet 2]
- [bullet 3]
- [bullet 4]

FAQ:
### [Question 1]
[Answer 1]

### [Question 2]
[Answer 2]

### [Question 3]
[Answer 3]

### [Question 4]
[Answer 4]

### [Question 5]
[Answer 5]

### [Question 6]
[Answer 6]"""

    message = client.messages.create(
        model='claude-haiku-4-5-20251001',
        max_tokens=1200,
        messages=[{'role': 'user', 'content': prompt}],
    )
    response = message.content[0].text.strip()

    tldr_match = re.search(r'TLDR:\n(.*?)(?=\nFAQ:)', response, re.DOTALL)
    faq_match = re.search(r'FAQ:\n(.*)', response, re.DOTALL)

    tldr = tldr_match.group(1).strip() if tldr_match else ''
    faq = faq_match.group(1).strip() if faq_match else ''
    return tldr, faq


def insert_sections(mdx: str, tldr: str, faq: str) -> str:
    """Insert TL;DR after intro (before first ##) and FAQ before conclusion."""
    # Split frontmatter from body
    parts = mdx.split('---', 2)
    if len(parts) < 3:
        return mdx  # Unexpected format
    frontmatter = '---' + parts[1] + '---'
    body = parts[2]

    # Insert TL;DR before the first H2
    tldr_block = f'\n## TL;DR\n\n{tldr}\n'
    body_with_tldr = re.sub(r'\n(## )', lambda m: tldr_block + '\n' + m.group(1), body, count=1)

    # Insert FAQ before the last paragraph (conclusion)
    faq_block = f'## Frequently Asked Questions\n\n{faq}'
    paragraphs = body_with_tldr.strip().split('\n\n')
    # Find last paragraph that looks like a plain conclusion (not a heading, blockquote, or list)
    last_para_idx = None
    for i in range(len(paragraphs) - 1, -1, -1):
        p = paragraphs[i].strip()
        if p and not p.startswith('#') and not p.startswith('>') and not p.startswith('-') and not p.startswith('|') and not p.startswith('*'):
            last_para_idx = i
            break

    if last_para_idx is not None:
        paragraphs.insert(last_para_idx, faq_block)
    else:
        paragraphs.append(faq_block)

    new_body = '\n\n'.join(paragraphs)
    return frontmatter + '\n' + new_body + '\n'


def process_article(repo, file_obj, dry_run: bool):
    content = file_obj.decoded_content.decode('utf-8')

    if '## TL;DR' in content or '## Frequently Asked Questions' in content:
        print(f'  Skipping (already patched)')
        return

    title = ''
    for line in content.split('\n'):
        if line.startswith('title:'):
            title = line.replace('title:', '').strip().strip('"')
            break

    print(f'  Generating TL;DR + FAQ for: {title}')
    tldr, faq = generate_tldr_and_faq(content, title)

    if not tldr or not faq:
        print(f'  ERROR: Failed to generate content, skipping')
        return

    new_content = insert_sections(content, tldr, faq)

    if dry_run:
        print(f'  DRY RUN — TL;DR preview:\n{tldr[:200]}')
        print(f'  FAQ preview:\n{faq[:300]}')
        return

    repo.update_file(
        path=file_obj.path,
        message=f'content: add TL;DR and FAQ to "{title}"',
        content=new_content,
        sha=file_obj.sha,
    )
    print(f'  Updated: {file_obj.path}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--slug', default=None, help='Process only this slug (filename without .mdx)')
    args = parser.parse_args()

    from github import Github
    g = Github(os.getenv('GITHUB_TOKEN'))
    repo = g.get_repo(os.getenv('GITHUB_REPO'))

    files = repo.get_contents('content/blog')
    mdx_files = [f for f in files if f.name.endswith('.mdx') and f.name not in SKIP]

    if args.slug:
        mdx_files = [f for f in mdx_files if f.name == f'{args.slug}.mdx']
        if not mdx_files:
            print(f'ERROR: {args.slug}.mdx not found')
            sys.exit(1)

    print(f'Processing {len(mdx_files)} articles...')
    for f in mdx_files:
        print(f'\n{f.name}')
        process_article(repo, f, dry_run=args.dry_run)

    print('\nDone!')


if __name__ == '__main__':
    main()
