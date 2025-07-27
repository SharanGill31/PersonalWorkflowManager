# Heroku Deployment Guide for Personal Workflow Manager

This guide will walk you through deploying the Personal Workflow Manager (a full-stack MERN application) to Heroku step by step.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Pre-deployment Setup](#pre-deployment-setup)
4. [Heroku Account & CLI Setup](#heroku-account--cli-setup)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Deployment Process](#deployment-process)
7. [Post-deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)
9. [Common Issues & Solutions](#common-issues--solutions)

## Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher) installed
- Git installed and configured
- A MongoDB Atlas account with a database
- Basic knowledge of terminal/command line
- A code editor (VS Code recommended)

## Project Overview

This is a full-stack MERN application with:
- **Frontend**: React.js (built with Vite)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT tokens
- **Deployment**: Heroku

### Project Structure
```
PersonalWorkflowManager/
├── package.json              # Root package.json for Heroku deployment
├── backend/                  # Node.js/Express server
│   ├── package.json
│   ├── server.js
│   ├── .env                 # Environment variables (NOT committed)
│   └── ...
├── frontend/                # React application
│   ├── package.json
│   ├── vite.config.js
│   └── ...
└── DEPLOYMENT.md           # This file
```

## Pre-deployment Setup

### 1. Verify Project Configuration

**Root package.json** should contain these scripts:
```json
{
  "scripts": {
    "heroku-postbuild": "npm run build-frontend && npm run copy-frontend",
    "build-frontend": "cd frontend && npm install && npm run build",
    "copy-frontend": "node -e \"const fs = require('fs'); const path = require('path'); const src = path.join(__dirname, 'frontend', 'dist'); const dest = path.join(__dirname, 'backend', 'public'); if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true }); } fs.cpSync(src, dest, { recursive: true }); console.log('Frontend built and copied to backend/public');\"",
    "start": "cd backend && npm start"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Backend server.js** should include:
```javascript
// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing, return all requests to React app
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}
```

**Frontend API configuration** (`frontend/src/config/api.js`):
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:4000/api';

export default API_BASE_URL;
```

### 2. Verify .gitignore Configuration

Ensure your `.gitignore` includes:
```
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env

# Build outputs
build/
dist/
backend/public/
```

## Heroku Account & CLI Setup

### 1. Create Heroku Account
1. Go to [heroku.com](https://heroku.com)
2. Sign up for a free account
3. Verify your email address

### 2. Install Heroku CLI

**Windows:**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use chocolatey
choco install heroku-cli
```

**macOS:**
```bash
# Using Homebrew
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh
```

### 3. Login to Heroku
```bash
heroku login
```

## Environment Variables Configuration

### 1. Prepare Environment Variables

Create a list of the environment variables you'll need on Heroku:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=4000
```

### 2. Generate a Secure JWT Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. MongoDB Atlas Setup
1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to your cluster → Connect → Connect your application
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with your database name

## Deployment Process

### 1. Create Heroku Application
```bash
# Navigate to your project directory
cd path/to/PersonalWorkflowManager

# Create Heroku app (replace 'your-app-name' with a unique name)
heroku create your-app-name

# Or let Heroku generate a random name
heroku create
```

### 2. Set Environment Variables on Heroku
```bash
# Set all required environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-generated-secret-here
heroku config:set MONGODB_URI=your-mongodb-atlas-connection-string
heroku config:set PORT=4000

# Verify environment variables
heroku config
```

### 3. Configure MongoDB Atlas for Heroku
1. In MongoDB Atlas, go to Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 4. Deploy to Heroku
```bash
# Ensure you're on the main branch
git status
git branch

# Add Heroku remote (if not already added)
heroku git:remote -a your-app-name

# Deploy to Heroku
git push heroku main
```

### 5. Monitor Deployment
```bash
# Watch the build process
heroku logs --tail

# Check if app is running
heroku ps:scale web=1
heroku ps
```

## Post-deployment Verification

### 1. Open Your Application
```bash
# Open in browser
heroku open

# Or get the URL
heroku info
```

### 2. Test Application Functionality
1. **Homepage**: Verify the React app loads
2. **API Health**: Check if `/api/health` endpoint responds
3. **Authentication**: Test user registration/login
4. **Database**: Verify data can be created/read/updated/deleted

### 3. Check Application Logs
```bash
# View recent logs
heroku logs

# Follow logs in real-time
heroku logs --tail

# View specific number of lines
heroku logs -n 200
```

## Troubleshooting

### Common Commands

```bash
# Restart the application
heroku restart

# Scale dynos
heroku ps:scale web=1

# Run one-off commands
heroku run node --version

# Access Heroku bash
heroku run bash

# View environment variables
heroku config

# View build logs
heroku logs --tail

# View app info
heroku info
```

### Environment Variable Management
```bash
# Set a variable
heroku config:set VARIABLE_NAME=value

# Remove a variable
heroku config:unset VARIABLE_NAME

# View all variables
heroku config
```

## Common Issues & Solutions

### Issue 1: "Application Error" Page
**Symptoms**: Heroku shows "Application Error"
**Solution**:
1. Check logs: `heroku logs --tail`
2. Verify environment variables: `heroku config`
3. Ensure PORT is set correctly
4. Check if all dependencies are in package.json

### Issue 2: Build Failures
**Symptoms**: Deployment fails during build
**Solutions**:
- Ensure all `package.json` files have correct dependencies
- Check Node.js version compatibility
- Verify build scripts work locally: `npm run heroku-postbuild`

### Issue 3: Frontend Not Loading
**Symptoms**: API works but React app doesn't load
**Solutions**:
- Verify `heroku-postbuild` script runs successfully
- Check if static files are served correctly
- Ensure Express serves React build in production

### Issue 4: Database Connection Issues
**Symptoms**: 500 errors, can't connect to MongoDB
**Solutions**:
- Verify MONGODB_URI is set correctly
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Issue 5: CORS Issues
**Symptoms**: Frontend can't make API calls
**Solutions**:
- Verify API base URL configuration
- Check CORS settings in Express
- Ensure frontend builds with correct API endpoints

### Issue 6: Express 5.x Route Issues
**Symptoms**: "Missing parameter name" error
**Solutions**:
- Use `app.get('/*', ...)` instead of `app.get('*', ...)`
- Update to Express 5.x compatible route patterns

## Additional Resources

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Deployment Documentation](https://create-react-app.dev/docs/deployment/)

## Support

If you encounter issues:
1. Check the logs first: `heroku logs --tail`
2. Review this documentation
3. Search [Stack Overflow](https://stackoverflow.com) for similar issues
4. Check [Heroku Status](https://status.heroku.com/) for platform issues

---

**Note**: This deployment guide is specifically for the Personal Workflow Manager project. Adapt the steps as needed for different project structures or requirements.
