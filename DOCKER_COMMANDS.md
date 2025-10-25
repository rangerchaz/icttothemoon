# Docker Commands Quick Reference

## 🚀 Deployment Commands

### First-Time Setup
```bash
# Copy environment template
cp .env.production .env

# Edit and add your API key
nano .env

# Deploy everything
./deploy.sh
```

### Manual Deploy
```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# Start services with build
docker-compose up -d --build
```

---

## 📊 Monitoring Commands

### View Status
```bash
# List all containers
docker-compose ps

# View resource usage
docker stats

# Check if services are healthy
docker-compose ps
```

### View Logs
```bash
# All services (follow mode)
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 30m
```

---

## 🔧 Management Commands

### Start/Stop/Restart
```bash
# Stop all services
docker-compose stop

# Start all services
docker-compose start

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Shutdown
```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v

# Stop, remove everything including images
docker-compose down --rmi all -v
```

---

## 🐛 Debugging Commands

### Execute Commands in Container
```bash
# Open shell in backend
docker-compose exec backend sh

# Open shell in frontend
docker-compose exec frontend sh

# Run command in backend
docker-compose exec backend npm run test
```

### Inspect Container
```bash
# View container details
docker inspect wichita-backend

# View container logs
docker logs wichita-backend

# View environment variables
docker-compose exec backend printenv
```

### Network Debugging
```bash
# List networks
docker network ls

# Inspect network
docker network inspect icttothemoon_wichita-network

# Test connectivity
docker-compose exec frontend ping backend
docker-compose exec backend ping frontend
```

---

## 🧹 Cleanup Commands

### Remove Unused Resources
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused (CAREFUL!)
docker system prune -a

# Remove everything including volumes (VERY CAREFUL!)
docker system prune -a --volumes
```

### Rebuild From Scratch
```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Rebuild and start
docker-compose up -d --build
```

---

## 📦 Update & Redeploy

### Update Code
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# One-liner
git pull && docker-compose down && docker-compose up -d --build
```

### Update Dependencies Only
```bash
# Rebuild images without cache
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

---

## 🔍 Troubleshooting

### Services Won't Start
```bash
# Check logs for errors
docker-compose logs

# Check disk space
df -h

# Check if ports are in use
netstat -tlnp | grep :80
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001
```

### Backend API Not Working
```bash
# Check backend is running
docker-compose ps backend

# View backend logs
docker-compose logs backend

# Test backend health
curl http://localhost:3001/health

# Check environment variables
docker-compose exec backend printenv | grep ANTHROPIC
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $(whoami):$(whoami) .

# Fix permissions on deploy script
chmod +x deploy.sh
```

---

## 🎯 Production Commands

### Backup Data
```bash
# Create backup directory
mkdir -p backups

# Backup volumes
docker run --rm -v icttothemoon_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/data-$(date +%Y%m%d).tar.gz /data
```

### View Resource Limits
```bash
# Check container resource usage
docker stats --no-stream

# Check specific container
docker stats wichita-frontend --no-stream
```

### Scale Services (if needed)
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

---

## 💡 Development Commands

### Use Development Compose
```bash
# Start in development mode with hot reload
docker-compose -f docker-compose.dev.yml up

# Build dev images
docker-compose -f docker-compose.dev.yml build
```

### Run Tests
```bash
# Run backend tests
docker-compose exec backend npm test

# Run frontend tests
docker-compose exec frontend npm test
```

---

## 🚨 Emergency Commands

### Quick Fixes
```bash
# Restart everything
docker-compose restart

# Force recreate containers
docker-compose up -d --force-recreate

# Reset everything (CAREFUL!)
docker-compose down -v
docker-compose up -d --build
```

### When All Else Fails
```bash
# Stop Docker daemon
sudo systemctl stop docker

# Start Docker daemon
sudo systemctl start docker

# Restart Docker daemon
sudo systemctl restart docker

# Reboot server (last resort)
sudo reboot
```

---

## 📝 Useful Aliases

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'
alias dcr='docker-compose restart'
alias dcb='docker-compose up -d --build'
```

Then reload: `source ~/.bashrc`

---

## 📚 More Information

- Docker Compose Docs: https://docs.docker.com/compose/
- Docker CLI Reference: https://docs.docker.com/engine/reference/commandline/cli/
- Full Deployment Guide: [DEPLOY_DIGITALOCEAN.md](DEPLOY_DIGITALOCEAN.md)
