# GitHub Pages Deployment Guide

## Step 1: Update Vite Configuration

Add this to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/FreshCart/', // Your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

## Step 2: Build for Production

```bash
npm run build
```

## Step 3: Deploy to GitHub Pages

### Method A: Using GitHub CLI
```bash
gh pages deploy dist
```

### Method B: Manual Setup
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / folder: /dist
5. Save

## Step 4: Environment Variables

Add these in GitHub Settings → Secrets and variables → Actions:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` (your GitHub Pages URL)

## Step 5: Access Your Site

Your site will be available at:
`https://peetlamahesh123.github.io/FreshCart/`
```

<arg_key>EmptyFile</arg_key>
<arg_value>false
