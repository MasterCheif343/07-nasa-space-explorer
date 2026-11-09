const CACHE_NAME = 'nasa-space-explorer-cache';

const app_shell = [
"./",
"./index.html",
"./style.css",
"./js/manifest.js",
"./js/dateRange.js",
"./js/script.js",
"./img/nasa-worm-logo.png",
"./icons/icon-192.png",
"./icons/icon-512.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    console.log("[Service Worker] Installing..."),
    caches.open(CACHE_NAME).then((cache) => cache.addAll(app_shell))
  );
});

self.addEventListener('activate', (event) =>{
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  const isApiCall = url.hostname === 'api.nasa.gov';

  if(isApiCall){
    event.respondWith(networkFirst(event.request));
  }
  else{
    event.respondWith(cacheFirst(event.request));
  }
});

async function networkFirst(request){
  const cache = await caches.open(CACHE_NAME);

  try{
    const response = await fetch(request);

    cache.put(request, response.clone());
    return response;
  }
  catch(error){
    console.log("Service worker Network failed, trying cache for:" ,request.url);
    const cached = await cache.match(request);
    if(cached){
      return cached;
    }
    throw error;
  }
}

async function cacheFirst(request){
  const cached = await caches.open(CACHE_NAME);

if(cached){
  return cached;
}

const response = await fetch(request);

const cache = await caches.open(CACHE_NAME);
cache.put(request, response.clone());
return response;
}