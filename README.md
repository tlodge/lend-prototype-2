# Adaptive Health Narrative Interface

A prototype interface created with Figma Make and Vite.

## Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. Push this code to a GitHub repository
2. Go to your repository Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy when you push to the main branch

### Option 2: Manual Deployment

1. Build the project: `npm run build`
2. Go to your repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Select the branch and set the folder to `/dist` (or `/build` if you haven't changed it)

### Important: Update Base Path

Before deploying, update the `base` path in `vite.config.ts`:

- If your repo is `username.github.io`, set `base: '/'`
- Otherwise, set `base: '/your-repo-name/'` (replace `your-repo-name` with your actual repository name)

The site will be available at:
- `https://username.github.io/your-repo-name/` (if not a user/organization page)
- `https://username.github.io/` (if it's a user/organization page)
