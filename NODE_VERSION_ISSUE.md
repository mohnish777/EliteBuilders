# ⚠️ Node.js Version Issue

## The Problem

You're currently running **Node.js v14.15.5**, but this project requires **Node.js 16+** to run properly.

The error you're seeing:
```
SyntaxError: Unexpected token '??='
```

This is because Vite 5 uses modern JavaScript features that aren't supported in Node 14.

## The Solution

You need to upgrade Node.js. Here are your options:

### Option 1: Using NVM (Recommended)

If you have NVM (Node Version Manager) installed:

```bash
# Install Node 18 (LTS)
nvm install 18

# Use Node 18
nvm use 18

# Verify
node --version  # Should show v18.x.x

# Start the app
npm run dev
```

### Option 2: Using NVM (If Not Installed)

Install NVM first:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal, then:
nvm install 18
nvm use 18
node --version
npm run dev
```

### Option 3: Direct Download

1. Go to https://nodejs.org/
2. Download the **LTS version** (18.x or 20.x)
3. Install it
4. Restart your terminal
5. Verify: `node --version`
6. Run: `npm run dev`

### Option 4: Using Homebrew (macOS)

```bash
# Update Homebrew
brew update

# Install Node
brew install node@18

# Link it
brew link node@18

# Verify
node --version

# Start the app
npm run dev
```

## After Upgrading

Once you have Node 16+:

1. **Clean install** (recommended):
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - The app should open automatically at `http://localhost:3000`
   - If not, manually navigate to that URL

## Verify Everything Works

After upgrading and starting the server, you should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Why This Matters

Modern tools like Vite 5 require newer Node versions because:
- Better performance
- Modern JavaScript features
- Security updates
- Better developer experience

Node 14 reached end-of-life in April 2023, so upgrading is recommended anyway.

## Still Having Issues?

### Check Your Node Version
```bash
node --version
```

Should show: `v16.x.x`, `v18.x.x`, or `v20.x.x`

### Check NPM Version
```bash
npm --version
```

Should show: `8.x.x` or higher

### Clear Everything and Reinstall
```bash
# Remove old files
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Start
npm run dev
```

### Alternative: Use Older Vite Version

If you absolutely cannot upgrade Node, you can downgrade Vite (not recommended):

```bash
npm install vite@4.5.0 --save-dev
npm run dev
```

But this is a temporary workaround. You should upgrade Node for the best experience.

## Summary

**Current**: Node v14.15.5 ❌
**Required**: Node v16+ ✅
**Recommended**: Node v18 (LTS) ⭐

**Action**: Upgrade Node, then run `npm run dev`

Once upgraded, everything will work perfectly! 🚀

