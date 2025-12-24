# Vercel Deployment Guide

## Step 1: Initialize Git Repository

```bash
cd backend
git init
git add .
git commit -m "Initial backend setup with Better Auth"
```

## Step 2: Push to GitHub

1. Create new repository on GitHub: `sidebar-notepads-backend`
2. Push code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sidebar-notepads-backend.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

## Step 4: Add Vercel Postgres

1. In your Vercel project, go to "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Click "Continue"
5. Vercel automatically adds `DATABASE_URL` to your environment variables

## Step 5: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
BETTER_AUTH_URL=https://your-project.vercel.app
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

## Step 6: Redeploy

After adding env vars, click "Redeploy" to apply changes.

## Step 7: Test

Visit: `https://your-project.vercel.app/api/auth/signin/google`

Should redirect to Google OAuth.

---

## Quick Commands

```bash
# Generate secret
openssl rand -base64 32

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sidebar-notepads-backend.git
git push -u origin main
```
