# Sidebar Notepads PRO - Backend

Backend for Sidebar Notepads PRO Chrome extension with Better Auth integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your environment variables to `.env`:
- `BETTER_AUTH_URL` - Your Vercel deployment URL
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

4. Run development server:
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Features

- ✅ Better Auth with Google OAuth
- ✅ Google Drive API scope
- ✅ Extension ID whitelisting
- ✅ Refresh tokens for offline sync
