const countryFilter=document.getElementById("countryFilter");
const typeFilter=document.getElementById("typeFilter");
const detail=document.getElementById("detail");

function rebuildFilters(){
 const items=[...document.querySelectorAll("#feed .event")];
 const countries=[...new Set(items.map(x=>x.dataset.country).filter(Boolean))].sort();
 const types=[...new Set(items.map(x=>x.dataset.type).filter(Boolean))].sort();
 countryFilter.innerHTML='<option value="">전체 국가</option>'+countries.map(v=>'<option value="'+v+'">'+v+'</option>').join("");
 typeFilter.innerHTML='<option value="">전체 유형</option>'+types.map(v=>'<option value="'+v+'">'+typeLabel(v)+'</option>').join("");
}
function applyFilters(){
 const country=countryFilter.value,type=typeFilter.value;
 document.querySelectorAll("#feed .event").forEach(el=>{
  const ok=(!country||el.dataset.country===country)&&(!type||el.dataset.type===type);
  el.style.display=ok?"":"none";
 });
 (window.eventMarkers||[]).forEach(marker=>{
  const e=marker.eventData||{};
  const ok=(!country||e.country===country)&&(!type||e.event_type===type);
  if(ok){if(!map.hasLayer(marker))marker.addTo(map)}else if(map.hasLayer(marker))map.removeLayer(marker);
 });
}
function showDetail(item){
 const d=item.eventData||{};
 detail.replaceChildren();
 const head=document.createElement("b"); head.textContent=displayTitle(d); detail.appendChild(head);
 const p=document.createElement("p"); p.textContent=(d.city||d.country||"위치 미상")+" · "+typeLabel(d.event_type)+" · "+relativeTime(d.event_time)+" · "+(d.status||"unverified"); detail.appendChild(p);
 if(d.source_url){try{const u=new URL(d.source_url);if(["http:","https:"].includes(u.protocol)){const a=document.createElement("a");a.href=u.href;a.target="_blank";a.rel="noopener noreferrer";a.textContent="원문 출처 보기";detail.appendChild(a)}}catch(_){}}
}
countryFilter.addEventListener("change",applyFilters);
typeFilter.addEventListener("change",applyFilters);
document.getElementById("feed").addEventListener("click",e=>{const item=e.target.closest(".event");if(item)showDetail(item)});
setTimeout(rebuildFilters,800);
