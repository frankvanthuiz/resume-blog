# Design: Add 16 New SEO Articles

**Date:** 2026-03-10
**Status:** Approved

## Goal

Add 16 new high-traffic SEO articles to the resume-blog. Do not modify or replace existing articles.

## Articles to Generate

| # | Topic | Category |
|---|-------|----------|
| 1 | How to Write a Resume (Step-by-Step) | resume-tips |
| 2 | Resume vs CV (Key Differences) | resume-tips |
| 3 | Entry Level Resume Example | entry-level |
| 4 | Student Resume Example | entry-level |
| 5 | Marketing Resume Example | resume-examples |
| 6 | Customer Service Resume Example | resume-examples |
| 7 | Software Developer Resume Example | resume-examples |
| 8 | Project Manager Resume Example | resume-examples |
| 9 | How to Beat ATS Resume Scanners | ats-optimization |
| 10 | Best Resume Templates for 2026 | resume-formats |
| 11 | How to Write a Cover Letter | cover-letters |
| 12 | Cover Letter Example | cover-letters |
| 13 | Resume Summary Examples | resume-tips |
| 14 | Resume Skills List (500+ Skills) | resume-tips |
| 15 | How to Write Work Experience | resume-tips |
| 16 | How to Make a Resume with No Experience | entry-level |

## Generation Approach

- **Topics 1–13, 15–16**: Use existing `tools/generate.py` unchanged. Prompt targets 800–1200 words, narrative SEO format.
- **Topic 14 (Resume Skills List)**: Use a modified prompt requesting list-heavy format, 1500+ words, 500+ skills organized by category (technical, soft, industry-specific, etc.).
- All articles committed directly to GitHub via `tools/generate.py`.

## Constraints

- Do not delete or overwrite existing articles.
- Run from `tools/` using the existing virtualenv.
- Requires `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO` in `.env`.
