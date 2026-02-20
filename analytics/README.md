---
title: DericBI Analytics
emoji: 📊
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# DericBI Analytics

This Space runs the DericBI analytics module (Dash app) using Docker.

## Local run

```bash
pip install -r requirements.txt
python app.py
```

Open `http://localhost:7860`.

## Notes

- Main entrypoint: `app.py`
- Dash server object exposed as: `server`
- Space runtime uses port `7860`
