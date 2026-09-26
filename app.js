const I={
ru:{tag:"УБОРКА. ПО ПОЛОЧКАМ.",title:"Калькулятор уборки",lead:"От площади до готового предложения — за пару минут.",calc:"Расчёт",history:"История",rates:"Тарифы",cleanType:"Какая уборка нужна?",area:"Площадь помещения",extras:"Дополнительные услуги",estimate:"Предварительная стоимость",book:"Оформить заказ",details:"Детали заказа",name:"Имя",phone:"Телефон",address:"Адрес",date:"Дата",time:"Время",comment:"Комментарий",confirm:"Подтвердить заявку",localNote:"Демо v3: заявка сохраняется только на этом устройстве.",historyTitle:"Мои заявки",ratesTitle:"Тарифы",saved:"Заявка сохранена",empty:"Пока заявок нет",daily:"Поддерживающая",dailyD:"Чистота на каждый день",deep:"Генеральная",deepD:"Внимание к каждой детали",reno:"После ремонта",renoD:"Готово к новому началу",windows:"Мытьё окон",oven:"Духовка",fridge:"Холодильник",balcony:"Балкон",order:"Заказ"},
en:{tag:"CLEANING. MADE SIMPLE.",title:"Cleaning calculator",lead:"From floor area to a ready quote in a couple of minutes.",calc:"Quote",history:"History",rates:"Rates",cleanType:"What cleaning do you need?",area:"Property area",extras:"Extra services",estimate:"Estimated price",book:"Book cleaning",details:"Order details",name:"Name",phone:"Phone",address:"Address",date:"Date",time:"Time",comment:"Comment",confirm:"Confirm booking",localNote:"v3 demo: this booking is stored only on this device.",historyTitle:"My bookings",ratesTitle:"Rates",saved:"Booking saved",empty:"No bookings yet",daily:"Maintenance",dailyD:"Everyday cleanliness",deep:"Deep cleaning",deepD:"Attention to every detail",reno:"Post-renovation",renoD:"Ready for a fresh start",windows:"Window cleaning",oven:"Oven",fridge:"Fridge",balcony:"Balcony",order:"Booking"},
ka:{tag:"დალაგება. მარტივად.",title:"დალაგების კალკულატორი",lead:"ფართობიდან მზა შეთავაზებამდე — რამდენიმე წუთში.",calc:"გამოთვლა",history:"ისტორია",rates:"ტარიფები",cleanType:"რომელი დალაგება გჭირდებათ?",area:"ფართობი",extras:"დამატებითი სერვისები",estimate:"სავარაუდო ღირებულება",book:"შეკვეთა",details:"შეკვეთის დეტალები",name:"სახელი",phone:"ტელეფონი",address:"მისამართი",date:"თარიღი",time:"დრო",comment:"კომენტარი",confirm:"შეკვეთის დადასტურება",localNote:"v3 დემო: შეკვეთა ინახება მხოლოდ ამ მოწყობილობაზე.",historyTitle:"ჩემი შეკვეთები",ratesTitle:"ტარიფები",saved:"შეკვეთა შენახულია",empty:"შეკვეთები ჯერ არ არის",daily:"სტანდარტული",dailyD:"ყოველდღიური სისუფთავე",deep:"გენერალური",deepD:"ყურადღება ყველა დეტალს",reno:"რემონტის შემდეგ",renoD:"ახალი დასაწყისისთვის",windows:"ფანჯრების წმენდა",oven:"ღუმელი",fridge:"მაცივარი",balcony:"აივანი",order:"შეკვეთა"}};
const types=[["daily","dailyD",2],["deep","deepD",4],["reno","renoD",5]];
const extras=[["windows",25],["oven",20],["fridge",20],["balcony",30]];
let lang="ru",currency="GEL",type=0;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function rate(){return currency==="USD"?1/2.7:1}
function money(v){return `${Math.round(v*rate())} ${currency==="USD"?"$":"₾"}`}
function total(){let v=+$("#area").value*types[type][2]; $$("#extrasList input:checked").forEach(x=>v+=+x.dataset.price);return v}
function render(){
 document.documentElement.lang=lang; $$("[data-i]").forEach(e=>e.textContent=I[lang][e.dataset.i]);
 $("#types").innerHTML=types.map((x,i)=>`<div class="choice ${i===type?"selected":""}" data-type="${i}"><b>${I[lang][x[0]]}</b><small>${I[lang][x[1]]}</small><span class="money">${money(x[2])} / m²</span></div>`).join("");
 $("#extrasList").innerHTML=extras.map(x=>`<div class="extra"><input type="checkbox" data-price="${x[1]}" id="${x[0]}"><label for="${x[0]}">${I[lang][x[0]]}</label><b>+${money(x[1])}</b></div>`).join("");
 $("#rateCards").innerHTML=types.map(x=>`<div class="choice"><b>${I[lang][x[0]]}</b><small>${I[lang][x[1]]}</small><strong>${money(x[2])} / m²</strong></div>`).join("");
 bind(); update(); showOrders();
}
function bind(){
 $$("#types .choice").forEach(e=>e.onclick=()=>{type=+e.dataset.type;render()});
 $$("#extrasList input").forEach(e=>e.onchange=update);
}
function update(){ $("#areaOut").textContent=$("#area").value+" m²";$("#price").textContent=money(total()); summary()}
function summary(){if(!$("#summary"))return;let ex=[...$$("#extrasList input:checked")].map(x=>I[lang][x.id]).join(", ");$("#summary").innerHTML=`<b>${I[lang][types[type][0]]}</b><br>${$("#area").value} m²${ex?"<br>"+ex:""}<br><strong>${money(total())}</strong>`}
$("#area").oninput=update;
$("#lang").onchange=e=>{lang=e.target.value;render()};
$("#currency").onchange=e=>{currency=e.target.value;render()};
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");if(b.dataset.tab==="history")showOrders()});
$("#book").onclick=()=>{$("#orderForm").classList.remove("hidden");summary();$("#orderForm").scrollIntoView({behavior:"smooth"})};
$("#orderForm").onsubmit=e=>{e.preventDefault();let orders=JSON.parse(localStorage.getItem("clearlyOrders")||"[]");orders.unshift({id:Date.now(),type:I[lang][types[type][0]],area:$("#area").value,price:money(total()),name:$("#name").value,phone:$("#phone").value,address:$("#address").value,date:$("#date").value,time:$("#time").value});localStorage.setItem("clearlyOrders",JSON.stringify(orders));$("#toast").textContent=I[lang].saved;$("#toast").style.display="block";setTimeout(()=>$("#toast").style.display="none",2200);e.target.reset();$("#orderForm").classList.add("hidden");showOrders()};
function showOrders(){let a=JSON.parse(localStorage.getItem("clearlyOrders")||"[]");$("#orders").innerHTML=a.length?a.map(o=>`<div class="order"><b>${o.type} · ${o.price}</b><div>${o.date} ${o.time} · ${o.area} m²</div><div class="muted">${o.name} · ${o.phone}<br>${o.address}</div></div>`).join(""):`<p class="empty">${I[lang].empty}</p>`}
render();