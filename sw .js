const CACHE='nerissa-v3';
const LEAF=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>Promise.all(
  ['./','./index.html'].map(u=>c.add(u).catch(()=>{})).concat(LEAF.map(u=>fetch(new Request(u,{mode:'no-cors'})).then(r=>c.put(u,r)).catch(()=>{})))
 )).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin&&u.hostname!=='cdnjs.cloudflare.com')return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
  return r;
 }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
