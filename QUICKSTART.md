# 🎯 Quick Start - Get Your App Live in 5 Minutes!

## ⚡ Fastest Way to Deploy

### Option 1: One-Command Deploy (Recommended)

```bash
# Run this script - it does everything for you!
./deploy.sh
```

That's it! The script will:
1. Install Vercel CLI if needed
2. Install dependencies
3. Build your project
4. Deploy to Vercel
5. Give you a live URL

### Option 2: Manual Vercel Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 3: GitHub + Vercel (No CLI needed)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Click "Deploy"
   - Done! ✅

## 📱 Your URL

After deployment, you'll get a URL like:
```
https://smart-habit-tracker-xxxxx.vercel.app
```

## 🎉 What's Next?

1. **Open the URL** in your browser
2. **Install on your phone**:
   - iPhone: Safari → Share → Add to Home Screen
   - Android: Chrome → Install
3. **Start tracking habits!**

## 🔑 Already Configured

✅ Supabase backend (no setup needed)  
✅ PWA features (works offline)  
✅ AI coaching (ready to use)  
✅ All dependencies (just run npm install)

## 📖 More Info

- Full deployment guide: See `DEPLOY.md`
- PWA installation: See `PWA_INSTALL_GUIDE.md`
- Project details: See `README.md`

## 💡 Pro Tip

The fastest way is to run `./deploy.sh` - it handles everything automatically!

---

**Ready? Let's deploy! 🚀**

```bash
./deploy.sh
```
