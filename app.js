const SUPABASE_URL="https://zshtlatitnwcovkxzftv.supabase.co";
const SUPABASE_KEY="sb_publishable_srMFnmLm1bCg9evU_X3Blw_T9vTcQwH";
const map=L.map("map",{worldCopyJump:true}).setView([20,0],2);
window.eventMarkers=[];
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"&copy; OpenStreetMap"}).addTo(map);
const typeLabel=t=>({ASSAULT:"공격",FIGHT:"무력충돌",MASS_VIOLENCE:"대규모 폭력",ARMED:"무장 사건"}[t]||t||"기타");
const relativeTime=value=>{
 if(!value)return "시간 정보 없음";
 const ms=Date.now()-new Date(value).getTime();
 if(!Number.isFinite(ms))return "시간 정보 없음";
 const min=Math.max(0,Math.floor(ms/60000));
 if(min<1)return "방금 전";
 if(min<60)return min+"분 전";
 const hr=Math.floor(min/60);
 if(hr<24)return hr+"시간 전";
 const day=Math.floor(hr/24);
 if(day<30)return day+"일 전";
 return new Date(value).toLocaleDateString("ko-KR");
};
const displayTitle=e=>{
 const place=e.city||e.country||"위치 미상";
 const label=typeLabel(e.event_type);
 return e.title&& !e.title.startsWith("GDELT conflict event") ? e.title : place+" · "+label;
};
const markerClass=t=>({ASSAULT:"assault",FIGHT:"fight",MASS_VIOLENCE:"mass",ARMED:"armed"}[t]||"other");
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
    .bindPopup("<b>"+esc(displayTitle(e))+"</b><br>"+esc(place)+"<br><small>"+esc(e.event_time||"")+"</small>");
   const div=document.createElement("div"); div.className="event"; div.eventData=e;
   div.innerHTML="<b>"+esc(displayTitle(e))+"</b><small>"+esc(place)+" · "+esc(typeLabel(e.event_type))+" · "+esc(relativeTime(e.event_time))+"</small>"; div.addEventListener("click",()=>map.setView([e.latitude,e.longitude],6)); feed.appendChild(div);
 });
}
loadEvents().catch(err=>{document.getElementById("stats").textContent="데이터 연결 오류";console.error(err)});