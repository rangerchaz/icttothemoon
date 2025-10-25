#!/bin/bash

echo "🚀 Wichita to the Moon - Docker Build & Run"
echo "==========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Create .env file with:"
    echo "  ANTHROPIC_API_KEY=your-key-here"
    echo ""
    exit 1
fi

# Build image
echo "🔨 Building Docker image..."
docker build -t wichita-moon-game .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Stop and remove old container if exists
echo ""
echo "🧹 Cleaning up old container..."
docker stop wichita-game 2>/dev/null
docker rm wichita-game 2>/dev/null

# Run new container
echo ""
echo "🚢 Starting container..."
docker run -d \
  --name wichita-game \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  wichita-moon-game

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container!"
    exit 1
fi

# Wait a moment
sleep 3

# Show status
echo ""
echo "📊 Container Status:"
docker ps | grep wichita-game

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your game at:"
echo "   http://localhost:8080"
echo ""
echo "📝 View logs:"
echo "   docker logs -f wichita-game"
echo ""
echo "🛑 Stop game:"
echo "   docker stop wichita-game"
echo ""
