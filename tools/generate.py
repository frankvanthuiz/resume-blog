#!/usr/bin/env python3
"""
Generate and publish SEO articles to the resume blog.

Usage:
  python generate.py "10 ways to write a great resume"
  python generate.py --dry-run "10 ways to write a great resume"

Required env vars (in ../.env):
  ANTHROPIC_API_KEY, GITHUB_TOKEN, GITHUB_REPO

Optional:
  NEXT_PUBLIC_SITE_URL
"""

import sys
import os
import json
import argparse
from datetime import date
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

REQUIRED_ENV = ['ANTHROPIC_API_KEY', 'GITHUB_TOKEN', 'GITHUB_REPO']

# Stop-words to skip when extracting meaningful tags
_STOP = {
    'a', 'an', 'the', 'to', 'for', 'of', 'in', 'on', 'how', 'your',
    'with', 'and', 'or', 'that', 'is', 'are', 'ways', 'do', 'get',
    'make', 'write', 'build', 'use', 'using', 'my', 'you', 'its',
}


def validate_env():
    missing = [k for k in REQUIRED_ENV if not os.getenv(k)]
    if missing:
        print(f"ERROR: Missing env vars: {', '.join(missing)}")
        sys.exit(1)


def read_prompt_template() -> str:
    tmpl_path = os.path.join(os.path.dirname(__file__), 'prompt_template.txt')
    with open(tmpl_path) as f:
        return f.read()


def detect_category(topic: str) -> str:
    t = topic.lower()
    if 'ats' in t or 'applicant tracking' in t:
        return 'ats-optimization'
    if 'cover letter' in t:
        return 'cover-letters'
    if 'entry level' in t or 'graduate' in t or 'no experience' in t:
        return 'entry-level'
    if 'career change' in t or 'switching' in t:
        return 'career-change'
    if 'linkedin' in t:
        return 'linkedin'
    if 'format' in t or 'template' in t or 'layout' in t:
        return 'resume-formats'
    if 'example' in t or 'sample' in t:
        return 'resume-examples'
    return 'resume-tips'


def _extract_tags(topic: str) -> list:
    words = [w for w in topic.lower().split() if w not in _STOP and len(w) > 2]
    tags = words[:3] + [topic.lower()] if len(words) >= 3 else words + [topic.lower()]
    # Deduplicate while preserving order, max 4
    seen = set()
    result = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            result.append(t)
        if len(result) == 4:
            break
    return result


def estimate_reading_time(content: str) -> int:
    words = len(content.split())
    return max(1, round(words / 200))


def generate_article(topic: str, prompt_file: str = None) -> dict:
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    if prompt_file:
        with open(prompt_file) as f:
            tmpl = f.read()
    else:
        tmpl = read_prompt_template()
    prompt = tmpl.replace('{topic}', topic)

    print(f"Generating article: {topic}")
    message = client.messages.create(
        model='claude-sonnet-4-6',
        max_tokens=4096,
        messages=[{'role': 'user', 'content': prompt}],
    )
    content = message.content[0].text.strip()

    from slugify import slugify
    slug = slugify(topic)
    today = date.today().isoformat()
    category = detect_category(topic)
    reading_time = estimate_reading_time(content)

    # SEO description from first non-heading paragraph
    first_para = next(
        (line for line in content.split('\n') if line.strip() and not line.startswith('#')),
        topic
    )
    description = (first_para[:157].rstrip() + '...') if len(first_para) > 157 else first_para

    frontmatter = f"""---
title: "{topic}"
description: "{description}"
slug: "{slug}"
date: "{today}"
category: "{category}"
tags: {json.dumps(_extract_tags(topic))}
readingTime: {reading_time}
---"""

    mdx_content = f"{frontmatter}\n\n{content}"
    return {'slug': slug, 'mdx': mdx_content, 'title': topic}


def commit_to_github(slug: str, mdx_content: str, title: str):
    from github import Github, GithubException
    g = Github(os.getenv('GITHUB_TOKEN'))
    repo = g.get_repo(os.getenv('GITHUB_REPO'))
    file_path = f'content/blog/{slug}.mdx'

    try:
        existing = repo.get_contents(file_path)
        repo.update_file(
            path=file_path,
            message=f'content: update article "{title}"',
            content=mdx_content,
            sha=existing.sha,
        )
        print(f"Updated: {file_path}")
    except GithubException as e:
        if e.status != 404:
            print(f"ERROR: GitHub API error {e.status}: {e.data}")
            sys.exit(1)
        repo.create_file(
            path=file_path,
            message=f'content: add article "{title}"',
            content=mdx_content,
        )
        print(f"Created: {file_path}")


def main():
    parser = argparse.ArgumentParser(description='Generate SEO articles for the resume blog')
    parser.add_argument('topic', nargs='+', help='Article topic')
    parser.add_argument('--dry-run', action='store_true', help='Print MDX without committing to GitHub')
    parser.add_argument('--prompt-file', default=None,
                        help='Path to a custom prompt template file (overrides default)')
    args = parser.parse_args()

    topic = ' '.join(args.topic)

    if not args.dry_run:
        validate_env()

    article = generate_article(topic, prompt_file=args.prompt_file)

    if args.dry_run:
        print('\n--- DRY RUN: MDX output (not committed) ---\n')
        print(article['mdx'][:2000])
        return

    commit_to_github(article['slug'], article['mdx'], article['title'])

    site_url = os.getenv('NEXT_PUBLIC_SITE_URL', 'https://your-domain.com')
    print(f"\nDone! Article will be live at:")
    print(f"{site_url}/blog/{article['slug']}")


if __name__ == '__main__':
    main()
