# PWA Installation Guide - Smart Habit Tracker

Smart Habit Tracker is now a **Progressive Web App (PWA)**! This means you can install it on your phone like a native app.

## 🚀 How to Install on Your Phone

### For iPhone/iPad (iOS/Safari)

1. **Open Safari** and navigate to your app URL
2. Tap the **Share button** (square with arrow pointing up) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (default: "Habits")
5. Tap **"Add"** in the top right corner
6. The app icon will appear on your home screen!

**Important for iOS:**

- Must use Safari browser (Chrome/Firefox won't work for installation)
- The app will open in standalone mode without browser UI
- All your data is saved and synced via Supabase

### For Android (Chrome)

1. **Open Chrome** and navigate to your app URL
2. You'll see an **"Install"** prompt at the bottom
   - Or tap the **three dots menu** (⋮) in the top right
   - Select **"Add to Home Screen"** or **"Install app"**
3. Tap **"Install"** to confirm
4. The app will be added to your home screen and app drawer!

**Alternative for Android:**

- In Chrome, tap three dots menu → "Add to Home Screen"
- Name your app and tap "Add"

## ✨ PWA Features Included

### 📱 Native App Experience

- **Standalone Mode**: Opens without browser UI
- **Custom Splash Screen**: Beautiful loading screen with your app icon
- **Home Screen Icon**: Purple gradient with checkmark icon
- **Theme Color**: Matches your app's purple branding

### 💾 Offline Support

- **Service Worker**: Caches essential resources
- **Network-First Strategy**: Always tries to fetch fresh data
- **Fallback to Cache**: Works offline when network is unavailable
- **Auto-Sync**: Syncs data when you come back online

### 🔔 Future-Ready Features

The service worker is configured to support:

- **Push Notifications**: For habit reminders (when you enable notifications)
- **Background Sync**: Automatically sync habit data
- **Notification Actions**: Quick actions from notifications

### 🎨 Mobile Optimizations

- **Safe Area Support**: Works perfectly with notched devices
- **Prevents Pull-to-Refresh**: Smooth scrolling experience
- **No Double-Tap Zoom**: Native app feel
- **Responsive Design**: Optimized for all mobile screens

## 🔧 Technical Details

### Files Added

```
/public/manifest.json       - PWA configuration
/public/sw.js              - Service worker for offline support
/public/icon-192.png       - App icon (192x192)
/public/icon-512.png       - App icon (512x512)
/index.html                - Updated with PWA meta tags
/components/PWAInstallPrompt.tsx - In-app install prompt
```

### Browser Support

- ✅ **iOS Safari** 11.3+ (iPhone/iPad)
- ✅ **Android Chrome** 40+
- ✅ **Samsung Internet** 4+
- ✅ **Edge** (Windows/Android)
- ⚠️ **iOS Chrome/Firefox** (Can browse but can't install - iOS limitation)

### What's Cached

- App shell (main UI)
- Static resources
- API responses (with network-first strategy)

### Security

- HTTPS required for PWA features (automatically handled by Supabase/hosting)
- Secure authentication tokens
- Private data remains encrypted

## 📊 How to Check Installation Status

### On Your Phone

**iOS:**

- Look for the app icon on your home screen
- When opened, no Safari UI should be visible
- Check: no URL bar, no back/forward buttons

**Android:**

- App appears in app drawer
- Long-press icon to see app info shows "Installed app"
- Opens in standalone window

### Developer Check (Optional)

Open browser DevTools:

1. **Application tab** → **Manifest**: Should show all PWA details
2. **Service Workers**: Should show "activated and running"
3. **Storage**: Check cached resources

## 🎯 Current App URL

Your app is hosted at:

```
https://[your-project-id].supabase.co/functions/v1/make-app
```

Or if using a custom domain, use that URL instead.

## 💡 Tips for Best Experience

1. **Install After Signup**: Create your account first, then install
2. **Enable Notifications**: Go to Profile → Settings → Enable reminders
3. **Add to Today View**: On iOS, you can add widgets (future feature)
4. **Share with Friends**: Installed apps can share content easier
5. **Always Online**: The app works offline but syncs when online

## 🐛 Troubleshooting

### "Add to Home Screen" not showing?

- Ensure you're using the correct browser (Safari for iOS, Chrome for Android)
- Check that you're on HTTPS (not HTTP)
- Try refreshing the page
- Clear browser cache and try again

### App won't work offline?

- The service worker needs to cache resources first
- Use the app online for a few minutes before going offline
- Check browser console for service worker errors

### Installation prompt dismissed?

- The in-app prompt only shows once
- Clear localStorage and refresh to see it again
- Or use browser's native install option (menu → Add to Home Screen)

### iOS specific issues?

- Must use Safari browser
- Requires iOS 11.3 or later
- Check Settings → Safari → Advanced → Experimental Features → Service Workers is enabled

### Android specific issues?

- Update Chrome to latest version
- Check Chrome flags: chrome://flags → enable "Progressive Web Apps"
- Ensure "Add to Home Screen" is not blocked in site settings

## 🔄 Updates

When you update the app:

- Service worker automatically updates in the background
- Users get the new version on next app launch
- Cached data is preserved
- No need to reinstall

## 📱 Uninstalling

**iOS:**

- Long-press the app icon → Remove App → Delete App

**Android:**

- Long-press app icon → App info → Uninstall
- Or drag icon to "Uninstall" in app drawer

---

## 🎉 You're All Set!

Your Smart Habit Tracker is now a fully-functional Progressive Web App with:

- ✅ Installable on home screen
- ✅ Offline support
- ✅ Native app experience
- ✅ Fast loading with caching
- ✅ Background sync ready
- ✅ Push notification ready

Enjoy tracking your habits with the power of a native app! 🚀

---

**Need Help?** Check the browser console for detailed logs about service worker registration and caching.