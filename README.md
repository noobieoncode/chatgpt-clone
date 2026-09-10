# CSS Lab Academy

Interactive educational website for learning CSS through experimentation.

## Run locally

Because this is a static HTML/CSS/JS app, open `/home/runner/work/chatgpt-clone/chatgpt-clone/index.html` in a browser.

For best experience, run a local static server from the repo root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features

- Interactive landing page with live CSS demo
- Data-driven lesson architecture with searchable sidebar and category navigation
- Lesson panel with beginner explanations, syntax, common mistakes, related topics, previous/next navigation
- Live playground with HTML + CSS editors, line numbers, instant iframe preview, reset, run, copy, fullscreen preview, responsive viewport controls
- "See the Difference" split view (unstyled vs styled)
- Try-It-Yourself value explorer for enumerable properties
- Interactive box-model diagram controls
- CSS Functions explorer (clamp, calc, minmax, color-mix)
- Mini challenge with automated solution validation
- Quiz with instant feedback
- Progress tracking (completed lessons, current lesson, bookmarks, quiz/challenge progress) using localStorage
- Dark/light theme toggle
- Responsive layout with collapsible mobile sidebar drawer
- Accessibility-focused semantics, keyboard support, visible focus states, reduced-motion support

## Project structure

```
/home/runner/work/chatgpt-clone/chatgpt-clone/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
```
