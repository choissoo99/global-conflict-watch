const countryFilter=document.getElementById("countryFilter");
const typeFilter=document.getElementById("typeFilter");
const detail=document.getElementById("detail");

function optionValues(selector){
  return [...document.querySelectorAll(selector)].map(el=>el.textContent.split(" · "));
}
function rebuildFilters(){
  const rows=optionValues("#feed .event small");
  const countries=[...new Set(rows.map(r=>r[0]).filter(Boolean))].sort();
  const types=[...new Set(rows.map(r=>r[1]).filter(Boolean))].sort();
  countryFilter.innerHTML='<option value="">전체 국가</option>'+countries.map(v=>'<option>'+v+'</option>').join("");
  typeFilter.innerHTML='<option value="">전체 유형</option>'+types.map(v=>'<option>'+v+'</option>').join("");
}
function applyFilters(){
  document.querySelectorAll("#feed .event").forEach(el=>{
    const parts=el.querySelector("small").textContent.split(" · ");
    const countryOk=!countryFilter.value||parts[0]===countryFilter.value;
    const typeOk=!typeFilter.value||parts[1]===typeFilter.value;
    el.style.display=countryOk&&typeOk?"":"none";
  });
}
countryFilter.addEventListener("change",applyFilters);
typeFilter.addEventListener("change",applyFilters);
document.getElementById("feed").addEventListener("click",e=>{
  const item=e.target.closest(".event");
  if(!item)return;
  const title=item.querySelector("b").textContent;
  const meta=item.querySelector("small").textContent;
  detail.innerHTML="<b>"+title+"</b><p>"+meta+"</p>";
});
setTimeout(rebuildFilters,1200);
