# Simple DigitalOcean Deployment - Single Docker Container

Deploy "Wichita to the Moon" as a single Docker container on DigitalOcean in **5 minutes**!

## 🚀 Quick Deploy

### Prerequisites
- DigitalOcean account
- Anthropic API key ([get one free](https://console.anthropic.com/))

---

## Option 1: DigitalOcean App Platform (Easiest) ⭐

**Perfect for:** Zero-ops deployment, automatic scaling, built-in CI/CD

### Steps:

1. **Fork/Push to GitHub**
   - Your code is already at: `https://github.com/rangerchaz/icttothemoon`

2. **Create App on DigitalOcean**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Choose "GitHub" and select your repository
   - Branch: `main`

3. **Configure Build Settings**
   - **Type:** Web Service
   - **Build Command:** (leave default or blank)
   - **Run Command:** `node server.js`
   - **HTTP Port:** `8080`

4. **Add Environment Variable**
   - Click "Edit" on your app
   - Go to "Environment Variables"
   - Add:
     ```
     ANTHROPIC_API_KEY=sk-ant-your-key-here
     ```

5. **Deploy!**
   - Click "Save" and wait for deployment (~3-5 minutes)
   - Your app will be at: `https://your-app-name.ondigitalocean.app`

**Cost:** $5/month (Basic plan)

---

## Option 2: Docker Droplet (More Control)

**Perfect for:** Full server control, SSH access, custom domain

### Step 1: Create Droplet

1. **Go to DigitalOcean** → Droplets → Create Droplet
2. **Image:** Docker on Ubuntu 22.04
3. **Plan:** Basic - $6/month (1GB RAM) or $12/month (2GB recommended)
4. **Add SSH Key** (recommended)
5. **Hostname:** `wichita-moon-game`
6. **Create Droplet**

### Step 2: Connect and Deploy

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Clone repository
git clone https://github.com/rangerchaz/icttothemoon.git
cd icttothemoon

# Create environment file
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=8080
NODE_ENV=production
EOF

# Build Docker image
docker build -t wichita-moon-game .

# Run container
docker run -d \
  --name wichita-game \
  --restart unless-stopped \
  -p 80:8080 \
  --env-file .env \
  wichita-moon-game

# Check status
docker ps
docker logs wichita-game
```

### Step 3: Open Firewall

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### Step 4: Access Your Game

```
http://YOUR_DROPLET_IP
```

**Done!** 🎉

**Cost:** $6-12/month

---

## 📊 Comparison

| Feature | App Platform | Docker Droplet |
|---------|--------------|----------------|
| **Setup Time** | 5 minutes | 10 minutes |
| **Cost/Month** | $5 | $6-12 |
| **Scaling** | Automatic | Manual |
| **SSH Access** | No | Yes |
| **SSL** | Automatic | Manual |
| **Best For** | Quick deploy | Full control |

---

## 🔧 Management Commands

### App Platform
```bash
# View logs
doctl apps logs YOUR_APP_ID

# Restart app
doctl apps create-deployment YOUR_APP_ID
```

### Docker Droplet
```bash
# View logs
docker logs -f wichita-game

# Restart container
docker restart wichita-game

# Stop container
docker stop wichita-game

# Update and redeploy
cd icttothemoon
git pull
docker build -t wichita-moon-game .
docker stop wichita-game
docker rm wichita-game
docker run -d \
  --name wichita-game \
  --restart unless-stopped \
  -p 80:8080 \
  --env-file .env \
  wichita-moon-game
```

---

## 🌐 Add Custom Domain (Optional)

### For App Platform:
1. Go to your app in DO dashboard
2. Settings → Domains
3. Add your domain
4. Update DNS at your registrar:
   - Add CNAME record pointing to DO app URL

### For Droplet:
1. **Add DNS A Record**:
   - Host: `@` or `game`
   - Value: `YOUR_DROPLET_IP`

2. **Install SSL** (Let's Encrypt):
```bash
# Install certbot
apt update && apt install -y certbot

# Stop container temporarily
docker stop wichita-game

# Get certificate
certbot certonly --standalone -d yourdomain.com

# Install nginx for SSL termination
apt install -y nginx

# Configure nginx (see full guide for config)
nano /etc/nginx/sites-available/default

# Restart
systemctl restart nginx
docker start wichita-game
```

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs wichita-game

# Check if port is in use
netstat -tlnp | grep :80

# Rebuild from scratch
docker stop wichita-game
docker rm wichita-game
docker rmi wichita-moon-game
docker build -t wichita-moon-game .
```

### AI Not Working
```bash
# Check environment variables
docker exec wichita-game printenv | grep ANTHROPIC

# Verify API key is set
cat .env
```

### Can't Access Game
```bash
# Check container is running
docker ps

# Check firewall
ufw status

# Check if app is listening
docker exec wichita-game netstat -tlnp
```

---

## 💰 Cost Summary

### App Platform (Recommended for Simplicity)
- **$5/month** - Basic tier
- **Free SSL** included
- **Auto-scaling** included
- **Zero-ops** maintenance

### Droplet (Recommended for Control)
- **$6/month** - 1GB RAM droplet
- **$12/month** - 2GB RAM (recommended)
- **Free SSL** with Let's Encrypt
- **Full control** over server

### API Costs (Both Options)
- **Anthropic API:** ~$0.003 per AI conversation
- **Very low cost** for personal/demo use

---

## ✅ Quick Deployment Checklist

**Before Deploy:**
- [ ] Code pushed to GitHub
- [ ] Anthropic API key obtained
- [ ] DigitalOcean account created
- [ ] Payment method added

**After Deploy:**
- [ ] Environment variables set
- [ ] Game accessible at URL
- [ ] AI crew responds correctly
- [ ] All 3 phases playable
- [ ] Resources tracking works

---

## 🎮 Test Your Deployment

1. **Home Page**: Should load with "Start Mission" button
2. **Instructions**: `/instructions` page works
3. **Technical Docs**: `/technical` page works
4. **Game Loads**: Click "Start Mission"
5. **Wichita Phase**: Can move player with WASD/arrows
6. **AI Crew**: Click "TALK TO CREW" button (in moonbase phase)
7. **AI Responds**: NPCs give contextual responses
8. **Full Playthrough**: Can complete from start to win/lose

---

## 📝 Post-Deployment

### Share Your Game
```
🎮 Play "Wichita to the Moon"
🌐 URL: https://your-app.ondigitalocean.app
🚀 Wichita's first AI-powered moon colonization game!
```

### Monitor Performance
- **App Platform**: Built-in metrics dashboard
- **Droplet**: `docker stats wichita-game`

### Update Game
```bash
# App Platform: Just git push!
git push origin main
# Auto-deploys in ~3 minutes

# Droplet: Pull and rebuild
ssh root@YOUR_DROPLET_IP
cd icttothemoon
git pull
docker build -t wichita-moon-game .
docker stop wichita-game && docker rm wichita-game
docker run -d --name wichita-game --restart unless-stopped -p 80:8080 --env-file .env wichita-moon-game
```

---

## 🎯 Recommended: App Platform

For this challenge, **App Platform** is recommended because:

✅ Simplest deployment (5 minutes)
✅ Automatic HTTPS
✅ Auto-deploys on git push
✅ Built-in monitoring
✅ Lowest cost ($5/month)
✅ Professional URL
✅ Perfect for demos

**Deploy now:** https://cloud.digitalocean.com/apps

---

**Your game will be live in minutes! 🚀🌙**
