const SUPABASE_URL="https://zshtlatitnwcovkxzftv.supabase.co";
const SUPABASE_KEY="sb_publishable_srMFnmLm1bCg9evU_X3Blw_T9vTcQwH";
const map=L.map("map",{worldCopyJump:true}).setView([20,0],2);
window.eventMarkers=[];
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"&copy; OpenStreetMap"}).addTo(map);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function loadEvents(){
 const url=SUPABASE_URL+"/rest/v1/events?select=id,event_type,title,country,city,latitude,longitude,event_time,status,source_url&latitude=not.is.null&longitude=not.is.null&order=event_time.desc&limit=200";
 const res=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY}});
 if(!res.ok)throw new Error("Supabase "+res.status);
 const events=await res.json();
 document.getElementById("stats").textContent="지도 사건 "+events.length+"건 · 국가 "+new Set(events.map(e=>e.country).filter(Boolean)).size+"곳";
 const feed=document.getElementById("feed"); feed.innerHTML="";
 events.forEach(e=>{
   const place=e.city||e.country||"위치 미상";
   L.circleMarker([e.latitude,e.longitude],{radius:6,weight:1,fillOpacity:.8}).addTo(map)
    .bindPopup("<b>"+esc(e.title)+"</b><br>"+esc(place)+"<br><small>"+esc(e.event_time||"")+"</small>");
   const div=document.createElement("div"); div.className="event";
   div.innerHTML="<b>"+esc(e.title)+"</b><small>"+esc(place)+" · "+esc(e.event_type)+"</small>"; div.addEventListener("click",()=>map.setView([e.latitude,e.longitude],6)); feed.appendChild(div);
 });
}
loadEvents().catch(err=>{document.getElementById("stats").textContent="데이터 연결 오류";console.error(err)});