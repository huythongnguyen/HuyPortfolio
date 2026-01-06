---
description: Deploy portfolio to GitHub Pages
---

# Deploy to GitHub Pages Workflow

This workflow automates the deployment of your portfolio to GitHub Pages.

## Initial Setup (One-time only)

### 1. Create GitHub Repository
If you haven't already, create a repository on GitHub:
- Go to https://github.com/new
- Name: `HuyPortfolio` (or your preferred name)
- Visibility: Public (required for free GitHub Pages)
- Do NOT initialize with README, .gitignore, or license

### 2. Configure Repository Settings
After creating the repository:
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
4. Save the settings

### 3. Initial Git Setup and Push
Run these commands in your project directory:

```powershell
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio with auto-deployment"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/HuyPortfolio.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

## Automatic Deployment

Once the initial setup is complete, deployment is automatic:

### Every time you push changes:
```powershell
git add .
git commit -m "Your commit message describing changes"
git push
```

The GitHub Actions workflow will automatically:
1. Detect the push to the main branch
2. Build and deploy your site to GitHub Pages
3. Make it available at: `https://YOUR_USERNAME.github.io/HuyPortfolio/`

### Monitor Deployment
- Go to your repository on GitHub
- Click the **Actions** tab
- You'll see the deployment progress
- Deployment typically takes 1-3 minutes

## Manual Deployment Trigger

You can also manually trigger a deployment:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow** button
5. Select the `main` branch
6. Click **Run workflow**

## Troubleshooting

### If deployment fails:
1. Check the **Actions** tab for error messages
2. Ensure GitHub Pages is enabled in repository Settings
3. Verify the source is set to **GitHub Actions**
4. Check that your repository is public

### If the site doesn't update:
1. Wait 1-2 minutes after deployment completes
2. Hard refresh your browser (Ctrl + Shift + R)
3. Check the Actions tab to ensure deployment succeeded

## Your Website URL

After successful deployment, your portfolio will be live at:
```
https://YOUR_USERNAME.github.io/HuyPortfolio/
```

Replace `YOUR_USERNAME` with your GitHub username.
