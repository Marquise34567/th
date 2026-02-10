# auto-editor backend

Minimal scaffold to run the server-side code moved into `backend/src`.

Quick start:

1. Copy required environment variables to `.env` (service account, Stripe keys, etc.).
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

4. Build and start:

```bash
npm run build
npm start
```

Notes:
- This scaffold expects `ffmpeg`/`ffprobe` to be available on the host system PATH for video processing.
- Do not place secrets in the repo. Use environment variables or a secret manager.
