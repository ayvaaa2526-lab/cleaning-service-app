const data={
 ru:{title:"Калькулятор уборки",subtitle:"От площади до готового предложения — за пару минут.",cleaning:"Какая уборка нужна?",area:"Площадь помещения",extras:"Добавим детали",client:"Для кого считаем?",terms:"Условия предложения",discount:"Скидка, %",valid:"Срок действия, дней",yourcalc:"ВАШ РАСЧЁТ",save:"Сохранить расчёт",proposal:"Предложение / PDF",disclaimer:"Предварительная стоимость. Финальные условия согласуются с клиентом.",history:"История",footer:"Меньше расчётов. Больше ясности.",name:"Имя клиента",address:"Адрес уборки",note:"Примечание для клиента",types:[["Поддерживающая","Чистота на каждый день",2],["Генеральная","Внимание к каждой детали",4],["После ремонта","Готово к новому началу",5]],extras:[["Мытьё окон","С двух сторон, за створку",15],["Химчистка дивана","До 3 посадочных мест",80],["Духовой шкаф","Внутри и снаружи",25],["Холодильник","Внутри и снаружи",20]]},
 en:{title:"Cleaning calculator",subtitle:"From area to a ready quote in minutes.",cleaning:"What cleaning do you need?",area:"Property area",extras:"Add details",client:"Who is the quote for?",terms:"Quote terms",discount:"Discount, %",valid:"Valid for, days",yourcalc:"YOUR QUOTE",save:"Save quote",proposal:"Quote / PDF",disclaimer:"Estimated price. Final terms are agreed with the client.",history:"History",footer:"Less calculating. More clarity.",name:"Client name",address:"Cleaning address",note:"Note for client",types:[["Maintenance","Everyday cleanliness",2],["Deep cleaning","Attention to every detail",4],["Post-renovation","Ready for a fresh start",5]],extras:[["Window cleaning","Both sides, per sash",15],["Sofa cleaning","Up to 3 seats",80],["Oven","Inside and outside",25],["Refrigerator","Inside and outside",20]]},
 ka:{title:"დასუფთავების კალკულატორი",subtitle:"ფართობიდან მზა შეთავაზებამდე — რამდენიმე წუთში.",cleaning:"რომელი დასუფთავება გჭირდებათ?",area:"ფართობი",extras:"დამატებითი მომსახურება",client:"ვისთვის ვითვლით?",terms:"შეთავაზების პირობები",discount:"ფასდაკლება, %",valid:"მოქმედების ვადა, დღე",yourcalc:"თქვენი გაანგარიშება",save:"შენახვა",proposal:"შეთავაზება / PDF",disclaimer:"სავარაუდო ღირებულება. საბოლოო პირობები შეთანხმდება კლიენტთან.",history:"ისტორია",footer:"ნაკლები გამოთვლა. მეტი სიცხადე.",name:"კლიენტის სახელი",address:"დასუფთავების მისამართი",note:"შენიშვნა კლიენტისთვის",types:[["მხარდამჭერი","ყოველდღიური სისუფთავე",2],["გენერალური","ყურადღება ყველა დეტალზე",4],["რემონტის შემდეგ","მზად ახალი დასაწყისისთვის",5]],extras:[["ფანჯრების წმენდა","ორივე მხრიდან",15],["დივნის ქიმწმენდა","3 ადგილამდე",80],["ღუმელი","შიგნიდან და გარედან",25],["მაცივარი","შიგნიდან და გარედან",20]]}
};
let state={lang:"ru",currency:"GEL",type:0,extras:[]};
const rate={GEL:1,USD:1/2.7}, symbol={GEL:"₾",USD:"$"};
const $=id=>document.getElementById(id);
function money(v){return state.currency==="GEL"?`${Math.round(v)} ₾`:`$${(v*rate.USD).toFixed(2)}`}
function render(){
 const d=data[state.lang]; document.documentElement.lang=state.lang;
 document.querySelectorAll("[data-t]").forEach(e=>e.textContent=d[e.dataset.t]);
 document.querySelectorAll("[data-ph]").forEach(e=>e.placeholder=d[e.dataset.ph]);
 $("types").innerHTML=d.types.map((x,i)=>`<div class="option ${i===state.type?"active":""}" onclick="state.type=${i};render()"><b>${x[0]}</b><small>${x[1]}</small><span>${money(x[2])} / m²</span></div>`).join("");
 $("extras").innerHTML=d.extras.map((x,i)=>`<div class="option ${state.extras.includes(i)?"active":""}" onclick="toggleExtra(${i})"><b>${x[0]}</b><small>${x[1]}</small><span>+ ${money(x[2])}</span></div>`).join("");
 calculate(); renderHistory();
}
function toggleExtra(i){state.extras=state.extras.includes(i)?state.extras.filter(x=>x!==i):[...state.extras,i];render()}
function calculate(){
 const d=data[state.lang], area=+$("area").value, base=area*d.types[state.type][2], extras=state.extras.reduce((s,i)=>s+d.extras[i][2],0), sub=base+extras, disc=Math.min(100,Math.max(0,+$("discount").value||0)), total=sub*(1-disc/100);
 $("areaValue").textContent=`${area} m²`; $("total").textContent=money(total);
 $("breakdown").innerHTML=`<div class="line"><span>${d.types[state.type][0]} · ${area} m²</span><b>${money(base)}</b></div>`+state.extras.map(i=>`<div class="line"><span>${d.extras[i][0]}</span><b>${money(d.extras[i][2])}</b></div>`).join("")+(disc?`<div class="line"><span>-${disc}%</span><b>-${money(sub-total)}</b></div>`:"");
 return total;
}
function renderHistory(){const h=JSON.parse(localStorage.getItem("clearlyHistory")||"[]");$("historyList").innerHTML=h.length?h.map(x=>`<div><b>${x.total}</b> · ${x.name||"—"}<br><small>${x.date}</small></div>`).join(""):"—"}
$("area").oninput=calculate;$("discount").oninput=calculate;
$("lang").onchange=e=>{state.lang=e.target.value;render()};$("currency").onchange=e=>{state.currency=e.target.value;render()};
$("save").onclick=()=>{let h=JSON.parse(localStorage.getItem("clearlyHistory")||"[]");h.unshift({total:$("total").textContent,name:$("name").value,date:new Date().toLocaleString()});localStorage.setItem("clearlyHistory",JSON.stringify(h.slice(0,30)));renderHistory()};
$("print").onclick=()=>window.print();
render();