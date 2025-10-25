# DigitalOcean Deployment Guide - Wichita to the Moon

This guide will help you deploy the game to a single DigitalOcean droplet using Docker.

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites

1. **DigitalOcean Account** - [Sign up here](https://www.digitalocean.com/)
2. **Anthropic API Key** - [Get one here](https://console.anthropic.com/)
3. **Domain Name** (optional but recommended)

### Step 1: Create a Droplet

1. **Log into DigitalOcean**
2. **Create Droplet**:
   - **Image**: Docker on Ubuntu 22.04
   - **Plan**: Basic ($6/month - 1GB RAM, 1 vCPU, 25GB SSD)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH key (recommended) or password
   - **Hostname**: `wichita-moon-game`

3. **Wait for droplet creation** (~60 seconds)

4. **Note your droplet's IP address**

### Step 2: Connect to Your Droplet

```bash
ssh root@your_droplet_ip
```

### Step 3: Clone and Setup

```bash
# Install git (if not already installed)
apt update && apt install -y git

# Clone your repository
git clone https://github.com/yourusername/icttothemoon.git
cd icttothemoon

# Create environment file
cp .env.production .env

# Edit environment file
nano .env
```

**Add your Anthropic API key:**
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 4: Deploy with Docker

```bash
# Build and start all services
docker-compose up -d --build

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Configure Firewall

```bash
# Allow HTTP traffic
ufw allow 80/tcp

# Allow HTTPS traffic (for SSL later)
ufw allow 443/tcp

# Allow SSH (IMPORTANT!)
ufw allow 22/tcp

# Enable firewall
ufw enable
```

### Step 6: Access Your Game

Open your browser and navigate to:
```
http://your_droplet_ip
```

🎉 **The game should now be running!**

---

## 🌐 Add a Custom Domain (Optional)

### Step 1: Configure DNS

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Add an **A Record**:
   - Host: `@` (or your subdomain like `game`)
   - Value: `your_droplet_ip`
   - TTL: 3600

2. Wait for DNS propagation (~5-60 minutes)

### Step 2: Add SSL with Let's Encrypt

```bash
# Install certbot
apt install -y certbot

# Stop nginx temporarily
docker-compose stop nginx

# Get SSL certificate
certbot certonly --standalone -d your-domain.com

# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem

# Update nginx config for HTTPS
nano nginx/nginx.conf
```

**Uncomment the HTTPS server block** and update `your-domain.com`

```bash
# Restart services
docker-compose up -d
```

### Step 3: Auto-Renew SSL

```bash
# Add to crontab
crontab -e

# Add this line (renew at 2am daily)
0 2 * * * certbot renew --quiet && docker-compose restart nginx
```

---

## 📊 Monitoring & Maintenance

### Check Service Status

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
```

### Update the Game

```bash
cd /root/icttothemoon

# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🔧 Troubleshooting

### Services Won't Start

```bash
# Check logs for errors
docker-compose logs

# Check if ports are in use
netstat -tlnp | grep :80
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
```

### Backend API Errors

```bash
# Check backend logs
docker-compose logs backend

# Verify API key is set
docker-compose exec backend printenv | grep ANTHROPIC
```

### AI Crew Not Responding

1. **Check API Key**: Make sure `ANTHROPIC_API_KEY` is set correctly in `.env`
2. **Check Backend Logs**: `docker-compose logs backend`
3. **Test API**: `curl http://localhost:3001/health`
4. **Check Credits**: Verify you have Anthropic API credits

### Out of Memory

If your droplet runs out of memory:

```bash
# Add swap space
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

Or upgrade to a larger droplet ($12/month for 2GB RAM)

### Database/Persistence (if needed)

Currently, the game doesn't persist data. To add persistence:

```bash
# Add volumes to docker-compose.yml
volumes:
  - ./data:/app/data
```

---

## 💰 Cost Breakdown

**Minimum Setup:**
- **Droplet**: $6/month (1GB RAM)
- **Anthropic API**: Pay-as-you-go (~$0.003 per conversation)
- **Domain** (optional): ~$12/year
- **SSL**: Free (Let's Encrypt)

**Total**: ~$6-8/month

**Recommended Setup:**
- **Droplet**: $12/month (2GB RAM - better performance)
- **Total**: ~$12-14/month

---

## 🔐 Security Best Practices

### 1. Use SSH Keys (Not Passwords)

```bash
# On your local machine
ssh-keygen -t rsa -b 4096

# Copy public key to droplet
ssh-copy-id root@your_droplet_ip
```

### 2. Create Non-Root User

```bash
# On droplet
adduser gameadmin
usermod -aG sudo gameadmin
usermod -aG docker gameadmin

# Copy SSH keys
rsync --archive --chown=gameadmin:gameadmin ~/.ssh /home/gameadmin

# Test login
ssh gameadmin@your_droplet_ip

# Disable root login
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
systemctl restart sshd
```

### 3. Enable Automatic Security Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. Install Fail2Ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📈 Scaling & Performance

### Vertical Scaling (Upgrade Droplet)

If you need more resources:
1. Go to DigitalOcean dashboard
2. Select your droplet
3. Click "Resize"
4. Choose larger plan
5. Restart droplet

### Horizontal Scaling (Multiple Servers)

For high traffic:
1. Use DigitalOcean Load Balancer
2. Create multiple droplets
3. Use managed database for state
4. Use Redis for sessions

### CDN (Content Delivery Network)

For global users:
1. Enable DigitalOcean Spaces CDN
2. Serve static assets from CDN
3. Reduce server load

---

## 🎯 Production Checklist

Before going live:

- [ ] API key is set correctly
- [ ] Firewall is enabled
- [ ] SSL certificate installed (if using domain)
- [ ] Auto-renewal for SSL configured
- [ ] Backups enabled (DigitalOcean backups or snapshots)
- [ ] Monitoring enabled (DigitalOcean monitoring or external)
- [ ] Rate limiting configured (already in nginx.conf)
- [ ] Error tracking setup (optional: Sentry)
- [ ] Analytics setup (optional: Google Analytics)

---

## 🛟 Support Resources

- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **Docker Docs**: https://docs.docker.com/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Anthropic Support**: https://support.anthropic.com/

---

## 🚨 Emergency Commands

```bash
# Stop everything
docker-compose down

# Remove all containers and volumes (CAREFUL!)
docker-compose down -v

# Check disk space
df -h

# Clean up Docker
docker system prune -a

# Restart Docker daemon
systemctl restart docker

# Reboot server (last resort)
reboot
```

---

## 📝 One-Line Deploy Command

For quick re-deploys after code changes:

```bash
cd /root/icttothemoon && git pull && docker-compose down && docker-compose up -d --build
```

---

**You're all set! Your Wichita to the Moon game should now be live on DigitalOcean! 🚀🌙**

For questions or issues, check the troubleshooting section or review the logs with `docker-compose logs`.
