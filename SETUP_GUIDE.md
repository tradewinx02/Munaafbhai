# 🚀 MUNAF TRADING - COMPLETE SETUP GUIDE

## 📋 QUICK OVERVIEW

```
Landing Page (HTML) ─→ Browser Tracking (Facebook Pixel)
                     └→ Server Tracking (Backend API)
                     └→ Analytics Dashboard
```

---

## **STEP 1: GITHUB REPOSITORY SETUP** 

### Option A: Using GitHub Desktop (Easy)
```
1. Go to https://github.com/new
2. Create new repository name: "munaf-trading-landing"
3. Clone to your computer
4. Copy these files into the folder:
   - index.html
   - server.js
   - package.json
   - .env.example (rename to .env)
   - README.md
5. Right-click → Git → Push
```

### Option B: Using Git Command Line
```bash
# Create folder
mkdir munaf-trading
cd munaf-trading

# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/munaf-trading-landing.git

# Add all files
git add .
git commit -m "Initial commit: Landing page + Backend"
git push -u origin main
```

---

## **STEP 2: FACEBOOK PIXEL SETUP**

### Get Your Access Token:
1. Go to: https://developers.facebook.com/
2. Login with your Facebook account
3. Click "My Apps" → "Create App"
4. Select "Business" → "Analytics"
5. Name: "Munaf Trading"
6. Go to "Settings" → "Basic" → Copy "App ID"
7. Go to "Tools" → "Graph API Explorer"
8. Select your app
9. Click "Get Token" → "Get Access Token"
10. Copy the long token

### Update Backend:
Create `.env` file (copy from `.env.example`):
```
FACEBOOK_PIXEL_ID=4485308965034244
FACEBOOK_ACCESS_TOKEN=YOUR_VERY_LONG_TOKEN_HERE
PORT=3000
```

### Verify Pixel:
1. Install "Facebook Pixel Helper" Chrome extension
2. Open your landing page
3. Extension should show: ✅ Pixel firing correctly

---

## **STEP 3: LANDING PAGE DEPLOYMENT ON VERCEL**

### For Frontend (HTML Only):

**Option A: Vercel Dashboard (Easiest)**
```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your "munaf-trading-landing" repository
5. Framework: "Other"
6. Root Directory: (leave empty)
7. Click "Deploy"
8. Done! Your site is live at: munaf-trading-*.vercel.app
```

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# You'll get a URL like: https://munaf-trading.vercel.app
```

---

## **STEP 4: BACKEND DEPLOYMENT**

### Option A: Vercel (Recommended)
```
Create: vercel.json in root
```
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "FACEBOOK_PIXEL_ID": "@facebook-pixel-id",
    "FACEBOOK_ACCESS_TOKEN": "@facebook-access-token"
  }
}
```

Deploy:
```bash
vercel --prod
```

### Option B: Heroku (Alternative)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create munaf-trading-backend

# Set environment variables
heroku config:set FACEBOOK_PIXEL_ID=4485308965034244
heroku config:set FACEBOOK_ACCESS_TOKEN=your_token_here

# Deploy
git push heroku main
```

### Option C: Railway (Alternative)
```
1. Go to: https://railway.app
2. Connect GitHub
3. Select your repository
4. Add environment variables
5. Deploy
```

---

## **STEP 5: UPDATE YOUR HTML FILE**

In `index.html`, find this line and replace:
```javascript
const CONFIG = {
    TELEGRAM_URL: 'https://t.me/+A2Fk8Csubz0zNWQ1',
    BACKEND_URL: 'https://your-backend-url.com', // ← REPLACE THIS
    PIXEL_ID: '4485308965034244'
};
```

Replace with your actual backend URL:
```javascript
const CONFIG = {
    TELEGRAM_URL: 'https://t.me/+A2Fk8Csubz0zNWQ1',
    BACKEND_URL: 'https://munaf-trading-backend.vercel.app', // ← Your backend URL
    PIXEL_ID: '4485308965034244'
};
```

---

## **STEP 6: TEST EVERYTHING**

### Test Tracking:
1. Open your landing page
2. Open Browser DevTools (F12)
3. Go to "Console" tab
4. You should see:
   ```
   ✅ Hero button tracking attached
   ✅ Footer button tracking attached
   ```

5. Click "JOIN TELEGRAM" button
6. Should see:
   ```
   ✅ Pixel tracked: Lead
   ✅ Server tracked: {success: true}
   ```

### Test Analytics:
Visit: `https://your-backend-url.com/api/analytics`

You should see:
```json
{
  "success": true,
  "data": {
    "totalEvents": 5,
    "eventsByType": {"TelegramClick": 5},
    "eventsBySection": {"hero": 2, "footer": 3},
    "recentEvents": [...]
  }
}
```

---

## **STEP 7: TELEGRAM NOTIFICATIONS (Optional)**

To get instant notifications when someone clicks JOIN:

1. Open Telegram → Search "@BotFather"
2. Send: `/newbot`
3. Follow prompts (Name: "Munaf Tracker")
4. Copy the token

5. Create a channel (private)
6. Add bot to channel
7. Right-click channel → Copy channel ID

8. Update `.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_channel_id_here
```

---

## **STEP 8: FACEBOOK PIXEL VERIFICATION**

After deployment:

1. Go to Facebook Pixel Dashboard
2. You should see live traffic
3. Look for "Lead" events
4. Check conversion count increases

---

## **MONITORING & ANALYTICS**

### View Real-time Analytics:
```
https://your-backend-url.com/api/analytics
```

### Monitor with Chrome:
1. Install: "Facebook Pixel Helper"
2. Install: "Redux DevTools"
3. Open landing page
4. See all pixel events in real-time

### Facebook Business Suite:
1. Go to: https://business.facebook.com
2. Click your app
3. View events dashboard
4. Check conversion tracking

---

## **OPTIMIZATION TIPS FOR LOWER CPC**

### 1. Quality Score:
- ✅ Landing page loads in <2 seconds (yours does!)
- ✅ Mobile responsive (yours is!)
- ✅ Clear call-to-action (yours has!)

### 2. Tracking Setup:
- ✅ Server-side tracking (you have it!)
- ✅ Pixel + API tracking (redundancy!)
- ✅ Proper event naming (you have it!)

### 3. Audience Insights:
```javascript
// Enhance tracking with custom data
fbq('track', 'Lead', {
    value: 1,
    currency: 'USD',
    content_name: 'Telegram Premium',
    content_category: 'Trading',
    content_ids: ['telegram_premium'],
    predicted_ltv: 50 // Lifetime value estimate
});
```

### 4. Frequency Capping:
```javascript
// Don't track same person multiple times
if (!sessionStorage.getItem('tracked')) {
    trackPixel('Lead');
    sessionStorage.setItem('tracked', 'true');
}
```

---

## **TROUBLESHOOTING**

### Issue: Pixel not firing
**Solution:**
```bash
# Check browser console for errors
# Install Facebook Pixel Helper extension
# Verify Pixel ID is correct in HTML
# Check HTTPS is enabled
```

### Issue: Server not responding
**Solution:**
```bash
# Check: https://your-backend-url.com/health
# Should return: {"status": "online"}
# If 404: Backend URL is wrong in HTML
```

### Issue: CPC still high
**Solutions:**
1. Ensure proper audience targeting
2. Use lookalike audiences
3. Test different ad creatives
4. Optimize landing page load time
5. Improve ad relevance score

---

## **FILE STRUCTURE**

```
munaf-trading/
├── index.html           (Landing page)
├── server.js            (Backend API)
├── package.json         (Dependencies)
├── .env                 (Secrets - don't commit!)
├── .env.example         (Template)
├── vercel.json          (Vercel config)
├── .gitignore           (Ignore .env)
└── README.md            (Documentation)
```

---

## **QUICK DEPLOYMENT CHECKLIST**

- [ ] Created GitHub repository
- [ ] Added all files to GitHub
- [ ] Deployed frontend to Vercel
- [ ] Deployed backend to Vercel/Heroku
- [ ] Updated BACKEND_URL in HTML
- [ ] Set .env variables
- [ ] Tested pixel firing
- [ ] Tested server tracking
- [ ] Checked analytics dashboard
- [ ] Verified conversion tracking
- [ ] Tested on mobile devices
- [ ] Set up Telegram notifications

---

## **USEFUL LINKS**

- Facebook Developers: https://developers.facebook.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com
- Telegram BotFather: https://t.me/BotFather
- Redux DevTools: https://github.com/reduxjs/redux-devtools

---

## **SUPPORT**

**Questions?**
- Check console for errors (F12)
- Visit: https://developers.facebook.com/docs
- Check backend health: /health endpoint
- View analytics: /api/analytics endpoint

**Made with ❤️ by @adbagency**

---

## **NEXT STEPS**

1. ✅ Deploy on Vercel (today)
2. ✅ Set up Facebook Pixel (today)
3. ✅ Create ad campaigns
4. ✅ Monitor results
5. ✅ Optimize based on data

**Estimated setup time: 30-45 minutes**
**First leads coming in: Within hours!**
