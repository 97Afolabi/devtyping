# Contributing

Thanks for contributing an exercise. This repo is MIT-licensed, so every exercise needs a clear, compatible licence trail — that's what this document covers.

## Content sourcing policy

### Permitted sources

| Source | Licence | Use |
|---|---|---|
| Your own implementation | original | Preferred. No obligations. |
| TheAlgorithms/* | MIT | Code only — **not** the docs (some of those repos' docs are CC BY-SA). Retain the notice. |
| Exercism track repos | MIT | Exercise names and stubs. Retain the notice. |
| Permissive OSS (MIT/Apache-2.0) | per repo | Real-world code samples. Retain the notice. |
| Algorithm *names* (Wikipedia list, cp-algorithms nav, CLRS TOC) | n/a — ideas | Names and taxonomy only, never the prose. |

### Prohibited sources

- **Problem statements from LeetCode / HackerRank / Codewars.** Their ToS claims questions and solutions as their property. Never reproduce them — link out instead (see `practiceLinks` below).
- **Project Euler content.** CC BY-NC-SA 4.0 — the NonCommercial term forecloses monetisation permanently, and ShareAlike conflicts with this repo's MIT licence.
- **Verbatim cp-algorithms prose or code.** CC BY-SA 4.0 — ShareAlike would infect the exercise. Reimplement from the algorithm's description instead.
- **Any GPL / GFDL / CC-\*-SA content** copied into the repo — incompatible with MIT.
- **Scraping third-party problem catalogues.** Curate practice links by hand or from public indexes.

### The three-layer rule

Every exercise is made of three independently-safe layers:

1. **Title** — the established name of the algorithm/pattern. Not owned by anyone.
2. **Code** — written by you, or copied under a permissive licence with attribution.
3. **Problem statement** — *never reproduced*. Use `practiceLinks` to point at where the problem actually lives (LeetCode, HackerRank, Codewars, etc.) instead of copying it in.

## Submitting an exercise

Every exercise requires a `source` block declaring where the code came from:

- `kind`: `"original"` (you wrote it), `"derived"` (adapted from a permissively-licensed source), or `"verbatim"` (copied as-is from a permissively-licensed source)
- `origin`: `"self"` for original work, or the upstream repo/project (e.g. `"TheAlgorithms/Go"`, `"exercism/python"`)
- `url` (optional): link to the upstream file, if `kind` isn't `"original"`
- `license`: `"MIT"`, `"CC-BY-SA-4.0"`, `"Apache-2.0"`, or `"original"`
- `attribution` (optional, required when `license` isn't `"original"`): the notice text to carry over

If you're linking to an external practice problem (LeetCode/HackerRank/Codewars/etc.), use the `practiceLinks` field rather than pasting the problem statement into the exercise itself:

- `label`: the problem title only — no description, difficulty rating, or acceptance rate
- `url`: link to the problem
- `provider`: `"leetcode"`, `"hackerrank"`, `"codewars"`, or `"other"`
- `free`: whether the problem is free to access — prefer free problems as the primary link
