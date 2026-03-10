# Generate 16 New SEO Articles Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and publish 16 new SEO-optimized MDX articles to the resume-blog GitHub repository without touching existing articles.

**Architecture:** Use the existing `tools/generate.py` script for 15 standard articles. Add a `--prompt-file` flag to `generate.py` so the Resume Skills List article can use a custom prompt targeting 1500+ words and 500+ skills. All articles are committed directly to GitHub via the script.

**Tech Stack:** Python 3, Anthropic Claude API, PyGithub, python-slugify, Next.js/MDX

---

## Chunk 1: Environment + Skills Prompt + generate.py flag

### Task 1: Verify environment is ready

**Files:**
- Read: `tools/requirements.txt`
- Read: `.env` (project root — must exist with required keys)

- [ ] **Step 1: Check .env exists and has required keys**

Run from project root:
```bash
grep -E "ANTHROPIC_API_KEY|GITHUB_TOKEN|GITHUB_REPO" .env
```
Expected output: 3 lines, one per key, each with a value after `=`.

If `.env` is missing or any key is absent, stop and ask the user to provide it. Do not proceed until all 3 are present.

- [ ] **Step 2: Verify virtualenv and dependencies**

```bash
source tools/.venv/bin/activate
pip show anthropic PyGithub python-slugify python-dotenv | grep Name
```
Expected: 4 lines starting with `Name:` for each package.

If any are missing:
```bash
pip install -r tools/requirements.txt
```

- [ ] **Step 3: Smoke-test the script**

```bash
source tools/.venv/bin/activate
cd tools && python generate.py --dry-run "Test Article Topic"
```
Expected: prints `--- DRY RUN: MDX output (not committed) ---` followed by frontmatter and content.

If it fails, read the error and fix the environment before continuing.

---

### Task 2: Add --prompt-file flag to generate.py

**Files:**
- Modify: `tools/generate.py`

This change lets the skills list article use a custom prompt without altering the default template.

- [ ] **Step 1: Read current generate.py**

Read `tools/generate.py` lines 1–50 (argument parsing and prompt reading sections).

- [ ] **Step 2: Add --prompt-file argument**

In the `main()` function, add `--prompt-file` to the argparse setup:

```python
parser.add_argument('--prompt-file', default=None,
                    help='Path to a custom prompt template file (overrides default)')
```

- [ ] **Step 3: Pass prompt-file into generate_article**

Change `generate_article(topic)` signature to `generate_article(topic, prompt_file=None)` and update `read_prompt_template` call:

```python
def generate_article(topic: str, prompt_file: str = None) -> dict:
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    if prompt_file:
        with open(prompt_file) as f:
            tmpl = f.read()
    else:
        tmpl = read_prompt_template()
    prompt = tmpl.replace('{topic}', topic)
    # ... rest unchanged
```

Update the `main()` call:
```python
article = generate_article(topic, prompt_file=args.prompt_file)
```

- [ ] **Step 4: Verify dry-run still works without flag**

```bash
source tools/.venv/bin/activate
cd tools && python generate.py --dry-run "Test Article Topic"
```
Expected: same output as before. No regression.

- [ ] **Step 5: Commit**

```bash
git add tools/generate.py
git commit -m "feat: add --prompt-file flag to generate.py for custom prompts"
```

---

### Task 3: Create skills list prompt

**Files:**
- Create: `tools/prompt_skills_list.txt`

- [ ] **Step 1: Create the custom prompt file**

Create `tools/prompt_skills_list.txt` with this content:

```
You are an expert SEO content writer specializing in career advice and resume writing.

Write a complete, SEO-optimized blog article in MDX format for the following topic:

TOPIC: {topic}

REQUIREMENTS:
- Length: 1500–2000 words
- Structure: H2 sections by skill category (use ## in markdown), H3 for sub-categories
- Keyword placement: include topic keywords naturally in the intro paragraph and H2s
- Tone: practical, scannable, authoritative
- Include a compelling intro paragraph (no H2 heading) explaining why a strong skills section matters
- Organize skills into these categories: Technical Skills, Soft Skills, Management & Leadership Skills, Industry-Specific Skills, Computer & Digital Skills, Communication Skills
- Each category must list at least 60–80 skills as a comma-separated inline list or a compact bullet list
- Total skills across all categories must be 500 or more
- Do NOT include the frontmatter — that will be added separately
- Do NOT include any Etsy CTAs — those are added automatically
- End with a brief paragraph on how to choose which skills to include on a resume

Output ONLY the markdown body content. No frontmatter. No explanation. Just the article.
```

- [ ] **Step 2: Verify the file was created**

```bash
wc -l tools/prompt_skills_list.txt
```
Expected: 25+ lines.

- [ ] **Step 3: Smoke-test with dry-run**

```bash
source tools/.venv/bin/activate
cd tools && python generate.py --dry-run --prompt-file prompt_skills_list.txt "Resume Skills List (500+ Skills)"
```
Expected: prints MDX output. Verify the content contains multiple H2 skill category headings.

- [ ] **Step 4: Commit**

```bash
git add tools/prompt_skills_list.txt
git commit -m "feat: add custom prompt for skills list article"
```

---

## Chunk 2: Generate Resume Tips Articles (5 topics)

All commands run from the project root. Activate venv first:
```bash
source tools/.venv/bin/activate
```

### Task 4: Generate "How to Write a Resume (Step-by-Step)"

**Files:**
- Create: `content/blog/how-to-write-a-resume-step-by-step.mdx` (via GitHub API)

- [ ] **Step 1: Confirm article does not already exist**

```bash
ls content/blog/how-to-write-a-resume*.mdx
```
Expected: `ls: cannot access ...` (file does not exist). If it exists, skip this task.

- [ ] **Step 2: Generate and publish**

```bash
cd tools && python generate.py "How to Write a Resume (Step-by-Step)"
```
Expected output ends with: `Done! Article will be live at: .../blog/how-to-write-a-resume-step-by-step`

- [ ] **Step 3: Pull and verify**

```bash
cd .. && git pull && ls content/blog/how-to-write-a-resume-step-by-step.mdx
```
Expected: file exists.

---

### Task 5: Generate "Resume vs CV (Key Differences)"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Resume vs CV (Key Differences)"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/resume-vs-cv-key-differences.mdx
```

---

### Task 6: Generate "Resume Summary Examples"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Resume Summary Examples"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/resume-summary-examples.mdx
```

---

### Task 7: Generate "How to Write Work Experience"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "How to Write Work Experience"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/how-to-write-work-experience.mdx
```

---

### Task 8: Generate "How to Make a Resume with No Experience"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "How to Make a Resume with No Experience"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/how-to-make-a-resume-with-no-experience.mdx
```

---

## Chunk 3: Generate Entry-Level & Example Articles (6 topics)

### Task 9: Generate "Entry Level Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Entry Level Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/entry-level-resume-example.mdx
```

---

### Task 10: Generate "Student Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Student Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/student-resume-example.mdx
```

---

### Task 11: Generate "Marketing Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Marketing Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/marketing-resume-example.mdx
```

---

### Task 12: Generate "Customer Service Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Customer Service Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/customer-service-resume-example.mdx
```

---

### Task 13: Generate "Software Developer Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Software Developer Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/software-developer-resume-example.mdx
```

---

### Task 14: Generate "Project Manager Resume Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Project Manager Resume Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/project-manager-resume-example.mdx
```

---

## Chunk 4: Generate Specialized Articles (4 topics) + Skills List

### Task 15: Generate "How to Beat ATS Resume Scanners"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "How to Beat ATS Resume Scanners"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/how-to-beat-ats-resume-scanners.mdx
```

---

### Task 16: Generate "Best Resume Templates for 2026"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Best Resume Templates for 2026"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/best-resume-templates-for-2026.mdx
```

---

### Task 17: Generate "How to Write a Cover Letter"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "How to Write a Cover Letter"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/how-to-write-a-cover-letter.mdx
```

---

### Task 18: Generate "Cover Letter Example"

- [ ] **Step 1: Generate and publish**

```bash
cd tools && python generate.py "Cover Letter Example"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/cover-letter-example.mdx
```

---

### Task 19: Generate "Resume Skills List (500+ Skills)"

**Files:**
- Read: `tools/prompt_skills_list.txt` (custom prompt — must exist from Task 3)

- [ ] **Step 1: Generate and publish with custom prompt**

```bash
cd tools && python generate.py --prompt-file prompt_skills_list.txt "Resume Skills List (500+ Skills)"
```

- [ ] **Step 2: Pull and verify**

```bash
cd .. && git pull && ls content/blog/resume-skills-list-500-skills.mdx
```

- [ ] **Step 3: Spot-check word count**

```bash
wc -w content/blog/resume-skills-list-500-skills.mdx
```
Expected: 1500+ words.

---

## Chunk 5: Final Verification

### Task 20: Verify all 16 articles exist

- [ ] **Step 1: Pull latest**

```bash
git pull
```

- [ ] **Step 2: Check all 16 files**

```bash
ls content/blog/ | grep -E \
  "how-to-write-a-resume-step-by-step|resume-vs-cv|entry-level-resume-example|\
student-resume-example|marketing-resume-example|customer-service-resume-example|\
software-developer-resume-example|project-manager-resume-example|\
how-to-beat-ats|best-resume-templates-for-2026|how-to-write-a-cover-letter|\
cover-letter-example|resume-summary-examples|resume-skills-list|\
how-to-write-work-experience|how-to-make-a-resume-with-no-experience"
```
Expected: 16 matching filenames.

- [ ] **Step 3: Verify no existing articles were touched**

```bash
git log --oneline content/blog/best-resume-format-in-2026.mdx
git log --oneline content/blog/how-long-should-a-resume-be.mdx
git log --oneline content/blog/what-recruiters-look-for-in-a-resume.mdx
git log --oneline content/blog/10-resume-mistakes-that-get-you-rejected.mdx
git log --oneline content/blog/how-to-write-a-resume-that-gets-interviews.mdx
```
Expected: each shows only its original commit — no new commits touching these files.
