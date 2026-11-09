const manifest = {
  "name": "NASA Space Explorer",
  "short_name" : "Space Explorer" , 
  "description": "Explore NASA's space data and imagery.",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "linear-gradient(135deg, var(--space-black), #0b1c3d)",
  "theme_color": "#f5f7ff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}