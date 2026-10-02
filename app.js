const I={
ru:{tag:"УБОРКА. ПО ПОЛОЧКАМ.",title:"Калькулятор уборки",lead:"От площади до готового предложения — за пару минут.",calc:"Расчёт",history:"История",rates:"Тарифы",cleanType:"Какая уборка нужна?",area:"Площадь помещения",extras:"Дополнительные услуги",estimate:"Предварительная стоимость",book:"Оформить заказ",details:"Детали заказа",name:"Имя",phone:"Телефон",address:"Адрес",date:"Дата",time:"Время",comment:"Комментарий",confirm:"Подтвердить заявку",localNote:"Демо v3: заявка сохраняется только на этом устройстве.",historyTitle:"Мои заявки",ratesTitle:"Тарифы",saved:"Заявка сохранена",empty:"Пока заявок нет",daily:"Поддерживающая",dailyD:"Чистота на каждый день",deep:"Генеральная",deepD:"Внимание к каждой детали",reno:"После ремонта",renoD:"Готово к новому началу",windows:"Мытьё окон",oven:"Духовка",fridge:"Холодильник",balcony:"Балкон",order:"Заказ"},
en:{tag:"CLEANING. MADE SIMPLE.",title:"Cleaning calculator",lead:"From floor area to a ready quote in a couple of minutes.",calc:"Quote",history:"History",rates:"Rates",cleanType:"What cleaning do you need?",area:"Property area",extras:"Extra services",estimate:"Estimated price",book:"Book cleaning",details:"Order details",name:"Name",phone:"Phone",address:"Address",date:"Date",time:"Time",comment:"Comment",confirm:"Confirm booking",localNote:"v3 demo: this booking is stored only on this device.",historyTitle:"My bookings",ratesTitle:"Rates",saved:"Booking saved",empty:"No bookings yet",daily:"Maintenance",dailyD:"Everyday cleanliness",deep:"Deep cleaning",deepD:"Attention to every detail",reno:"Post-renovation",renoD:"Ready for a fresh start",windows:"Window cleaning",oven:"Oven",fridge:"Fridge",balcony:"Balcony",order:"Booking"},
ka:{tag:"დალაგება. მარტივად.",title:"დალაგების კალკულატორი",lead:"ფართობიდან მზა შეთავაზებამდე — რამდენიმე წუთში.",calc:"გამოთვლა",history:"ისტორია",rates:"ტარიფები",cleanType:"რომელი დალაგება გჭირდებათ?",area:"ფართობი",extras:"დამატებითი სერვისები",estimate:"სავარაუდო ღირებულება",book:"შეკვეთა",details:"შეკვეთის დეტალები",name:"სახელი",phone:"ტელეფონი",address:"მისამართი",date:"თარიღი",time:"დრო",comment:"კომენტარი",confirm:"შეკვეთის დადასტურება",localNote:"v3 დემო: შეკვეთა ინახება მხოლოდ ამ მოწყობილობაზე.",historyTitle:"ჩემი შეკვეთები",ratesTitle:"ტარიფები",saved:"შეკვეთა შენახულია",empty:"შეკვეთები ჯერ არ არის",daily:"სტანდარტული",dailyD:"ყოველდღიური სისუფთავე",deep:"გენერალური",deepD:"ყურადღება ყველა დეტალს",reno:"რემონტის შემდეგ",renoD:"ახალი დასაწყისისთვის",windows:"ფანჯრების წმენდა",oven:"ღუმელი",fridge:"მაცივარი",balcony:"აივანი",order:"შეკვეთა"}};
const extraText = {
  ru: { account:'Аккаунт', accountAction:'Действие', login:'Войти', register:'Зарегистрироваться', logout:'Выйти', password:'Пароль', passwordHelp:'Минимум 12 символов. Восстановление пароля по почте пока не подключено.', loading:'Подключение…', retry:'Повторить', refresh:'Обновить', admin:'Управление', legacy:'Старые демозаявки на этом устройстве', needLogin:'Войдите или зарегистрируйтесь, чтобы сохранить заявку.', connected:'Заявки сохраняются в вашем аккаунте.', offline:'Не удалось подключиться. Проверьте интернет и повторите.', setup:'Сервер ещё настраивается. Расчёт стоимости доступен.', genericError:'Не удалось выполнить действие. Проверьте данные и повторите.', authFailed:'Не удалось войти или создать аккаунт. Проверьте email и пароль; возможно, такой аккаунт уже существует.', tooMany:'Слишком много попыток. Подождите минуту.', invalidDate:'Выберите будущие дату и время по Тбилиси.', saved:'Заявка сохранена в аккаунте', localNote:'Заявка сохраняется в аккаунте. Ожидайте отдельного подтверждения уборки.', new:'Новая', confirmed:'Подтверждена', completed:'Выполнена', cancelled:'Отменена', save:'Сохранить статус', rateNote:'Расчёт в USD: 1 USD = 2,7 GEL. Это фиксированный расчётный курс.', timezone:'Дата и время — по Тбилиси.', limitNote:'Показаны последние 200 заявок.' },
  en: { account:'Account', accountAction:'Action', login:'Sign in', register:'Create account', logout:'Sign out', password:'Password', passwordHelp:'At least 12 characters. Email password recovery is not connected yet.', loading:'Connecting…', retry:'Retry', refresh:'Refresh', admin:'Manage', legacy:'Old demo bookings on this device', needLogin:'Sign in or create an account to save a booking.', connected:'Bookings are saved in your account.', offline:'Could not connect. Check your connection and retry.', setup:'The server is being set up. You can still calculate a quote.', genericError:'Could not complete this action. Check the details and retry.', authFailed:'Could not sign in or create an account. Check your email and password; this account may already exist.', tooMany:'Too many attempts. Please wait a minute.', invalidDate:'Choose a future date and time in Tbilisi.', saved:'Booking saved to your account', localNote:'Saved to your account. Cleaning requires a separate confirmation.', new:'New', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled', save:'Save status', rateNote:'USD estimates use a fixed rate: 1 USD = 2.7 GEL.', timezone:'Dates and times are in Tbilisi time.', limitNote:'Showing the latest 200 bookings.' },
  ka: { account:'ანგარიში', accountAction:'მოქმედება', login:'შესვლა', register:'რეგისტრაცია', logout:'გასვლა', password:'პაროლი', passwordHelp:'მინიმუმ 12 სიმბოლო. ელფოსტით პაროლის აღდგენა ჯერ არ არის ჩართული.', loading:'დაკავშირება…', retry:'ხელახლა ცდა', refresh:'განახლება', admin:'მართვა', legacy:'ძველი დემო შეკვეთები ამ მოწყობილობაზე', needLogin:'შეკვეთის შესანახად შედით ან დარეგისტრირდით.', connected:'შეკვეთები ინახება თქვენს ანგარიშში.', offline:'დაკავშირება ვერ მოხერხდა. შეამოწმეთ ინტერნეტი და სცადეთ ხელახლა.', setup:'სერვერი მზადდება. ფასის გამოთვლა ხელმისაწვდომია.', genericError:'მოქმედება ვერ შესრულდა. შეამოწმეთ მონაცემები და სცადეთ ხელახლა.', authFailed:'შესვლა ან რეგისტრაცია ვერ მოხერხდა. შეამოწმეთ ელფოსტა და პაროლი; ანგარიში შესაძლოა უკვე არსებობს.', tooMany:'ძალიან ბევრი მცდელობა. დაელოდეთ ერთ წუთს.', invalidDate:'აირჩიეთ მომავალი თარიღი და დრო თბილისის დროით.', saved:'შეკვეთა შენახულია ანგარიშში', localNote:'შეკვეთა ინახება ანგარიშში. დალაგებას ცალკე დადასტურება სჭირდება.', new:'ახალი', confirmed:'დადასტურებული', completed:'შესრულებული', cancelled:'გაუქმებული', save:'სტატუსის შენახვა', rateNote:'USD შეფასებისთვის ფიქსირებული კურსია: 1 USD = 2,7 GEL.', timezone:'თარიღი და დრო — თბილისის დროით.', limitNote:'ნაჩვენებია ბოლო 200 შეკვეთა.' },
};
for (const key of Object.keys(extraText)) Object.assign(I[key], extraText[key]);
const types = [['daily','dailyD',2], ['deep','deepD',4], ['reno','renoD',5]];
const extras = [['windows',25], ['oven',20], ['fridge',20], ['balcony',30]];
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let preferences={};try { preferences=JSON.parse(localStorage.getItem('clearlyPreferences')||'{}')||{}; } catch {}
let lang = ['ru','en','ka'].includes(preferences.lang)?preferences.lang:'ru', currency = ['GEL','USD'].includes(preferences.currency)?preferences.currency:'GEL', type = 0, selectedExtras = new Set(), me = null, connection = 'loading';
let adminVersion = 0;
let historyVersion = 0, requestId = crypto.randomUUID(), toastTimer;
const t = key => I[lang][key] || key;
const money = (value, unitRate = false) => {
  const amount = value / (currency === 'USD' ? 2.7 : 1);
  return `${unitRate && currency === 'USD' ? amount.toFixed(2) : Math.round(amount)} ${currency === 'USD' ? '$' : '₾'}`;
};
function total() { return Number($('#area').value) * types[type][2] + extras.filter(x => selectedExtras.has(x[0])).reduce((s,x) => s+x[1],0); }
function setHidden(selector, hidden) { $(selector).classList.toggle('hidden', hidden); }
function failure(e) {
  if(e.status===429) return t('tooMany');
  if(e.status===401) return t('needLogin');
  if(e.code==='INVALID_DATE') return t('invalidDate');
  if(e.code==='SETUP_REQUIRED') return t('setup');
  if(e.status>=500 || !e.status) return t('offline');
  return t('genericError');
}
async function api(path, options = {}) {
  const response = await fetch(path, { credentials:'same-origin', ...options,
    headers: { 'Content-Type':'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if(!response.ok || !body) { const e=new Error(body?.error || body?.message || 'SERVER_ERROR');e.status=response.status;e.code=body?.error;throw e; }
  return body;
}
function authUI() {
  $('#connection').textContent=t(connection==='ready' ? (me?'connected':'needLogin') : connection);
  setHidden('#authForm', connection!=='ready' || !!me); setHidden('#signedIn', !me);
  setHidden('#retry', !['offline','setup'].includes(connection)); setHidden('#adminTab', !me?.admin);
  $('#userInfo').textContent=me ? `${me.user.name} · ${me.user.email}` : '';
  const signup=$('#authMode').value==='register';
  setHidden('#registerName', !signup); $('#authName').required=signup;
  $('#password').autocomplete=signup?'new-password':'current-password';
  $('#authSubmit').textContent=t(signup?'register':'login');
}
function render() {
  document.documentElement.lang=lang;
  $('#lang').value=lang;$('#currency').value=currency;
  $$('[data-i]').forEach(e => e.textContent=t(e.dataset.i));
  $('#types').innerHTML=types.map((x,i)=>`<button type="button" class="choice ${i===type?'selected':''}" data-type="${i}" aria-pressed="${i===type}"><b>${t(x[0])}</b><small>${t(x[1])}</small><span class="money">${money(x[2],true)} / m²</span></button>`).join('');
  $('#extrasList').innerHTML=extras.map(x=>`<div class="extra"><input type="checkbox" id="${x[0]}" ${selectedExtras.has(x[0])?'checked':''}><label for="${x[0]}">${t(x[0])}</label><b>+${money(x[1])}</b></div>`).join('');
  $('#rateCards').innerHTML=types.map(x=>`<div class="choice"><b>${t(x[0])}</b><small>${t(x[1])}</small><strong>${money(x[2],true)} / m²</strong></div>`).join('')+`<p class="note">${t('rateNote')}</p>`;
  $$('#types button').forEach(b => b.onclick=()=>{type=Number(b.dataset.type);requestId=crypto.randomUUID();render();});
  $$('#extrasList input').forEach(e=>e.onchange=()=>{e.checked?selectedExtras.add(e.id):selectedExtras.delete(e.id);requestId=crypto.randomUUID();update();});
  $('#date').min=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tbilisi'}).format(new Date());
  authUI(); update(); showOrders();
  if ($('#admin').classList.contains('active')) showAdmin();
}
function update() {
  $('#areaOut').textContent=$('#area').value+' m²'; $('#price').textContent=money(total());
  $('#summary').innerHTML=`<b>${t(types[type][0])}</b><br>${Number($('#area').value)} m²<br>${[...selectedExtras].map(t).join(', ')}<br><strong>${money(total())}</strong><p class="note">${t('timezone')}${currency==='USD'?'<br>'+t('rateNote'):''}</p>`;
}
function toast(message) { $('#toast').textContent=message;setHidden('#toast',false);clearTimeout(toastTimer);toastTimer=setTimeout(()=>setHidden('#toast',true),3000); }
function bookingHTML(o, admin=false) {
  const controls=admin?`<label for="status-${esc(o.id)}">${t('save')}</label><select id="status-${esc(o.id)}">${['new','confirmed','completed','cancelled'].map(s=>`<option value="${s}" ${s===o.status?'selected':''}>${t(s)}</option>`).join('')}</select><button class="secondary statusSave" data-id="${esc(o.id)}">${t('save')}</button>`:'';
  let items=[];try { items=JSON.parse(o.extras); } catch {}
  return `<article class="order"><b>${esc(t(o.type))} · ${esc(o.amount)} ${esc(o.currency)}</b><p>${esc(t(o.status))} · ${esc(o.date)} ${esc(o.time)} · ${esc(o.area)} m²</p><p>${esc(items.map(t).join(', '))}</p><p>${esc(o.name)} · ${esc(o.phone)}<br>${esc(o.address)}</p>${o.comment?`<p>${esc(o.comment)}</p>`:''}${controls}</article>`;
}
function showLegacy() {
  let old=[];try { const parsed=JSON.parse(localStorage.getItem('clearlyOrders')||'[]'); if(Array.isArray(parsed))old=parsed.filter(o=>o&&typeof o==='object'); } catch {}
  setHidden('#legacySection',!old.length);
  $('#legacyOrders').innerHTML=old.map(o=>`<article class="order"><b>${esc(o.type)} · ${esc(o.price)}</b><p>${esc(o.date)} ${esc(o.time)} · ${esc(o.area)} m²</p><p>${esc(o.name)} · ${esc(o.phone)}<br>${esc(o.address)}</p></article>`).join('');
}
async function showOrders() {
  const version=++historyVersion;showLegacy();
  if(!me) { $('#orders').textContent=t(connection==='ready'?'needLogin':connection);return; }
  $('#orders').textContent=t('loading');
  try { const result=await api('/api/bookings');if(version!==historyVersion)return;
    $('#orders').innerHTML=result.bookings.length?result.bookings.map(o=>bookingHTML(o)).join(''):`<p>${t('empty')}</p>`;
    if(result.bookings.length===200) $('#orders').insertAdjacentHTML('beforeend',`<p>${t('limitNote')}</p>`);
  } catch(e) { if(version===historyVersion)$('#orders').textContent=failure(e); }
}
async function showAdmin() {
  if(!me?.admin)return;const current=me.user.id, version=++adminVersion;
  $('#adminOrders').textContent=t('loading');
  try { const result=await api('/api/admin/bookings');if(version!==adminVersion||!me?.admin||me.user.id!==current)return;
    $('#adminOrders').innerHTML=result.bookings.length?result.bookings.map(o=>bookingHTML(o,true)).join(''):`<p>${t('empty')}</p>`;
    $$('.statusSave').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await api('/api/admin/bookings/'+b.dataset.id,{method:'PATCH',body:JSON.stringify({status:$('#status-'+b.dataset.id).value})});await showAdmin();}catch(e){toast(failure(e));}finally{b.disabled=false;}});
  } catch(e) { if(version===adminVersion&&me?.admin)$('#adminOrders').textContent=failure(e); }
}
async function loadSession() {
  connection='loading';authUI();
  try { me=await api('/api/me');connection='ready'; }
  catch(e) { me=null;connection=e.status===401?'ready':e.code==='SETUP_REQUIRED'?'setup':'offline'; }
  authUI();showOrders();
}
$('#authMode').onchange=authUI; $('#retry').onclick=loadSession;
$('#authForm').onsubmit=async e=>{
  e.preventDefault();$('#authError').textContent='';$('#authSubmit').disabled=true;
  const signup=$('#authMode').value==='register';
  try { await api('/api/auth/'+(signup?'sign-up':'sign-in')+'/email',{method:'POST',body:JSON.stringify({email:$('#email').value.trim(),password:$('#password').value,...(signup?{name:$('#authName').value.trim()}:{})})});$('#password').value='';await loadSession(); }
  catch(error) { $('#authError').textContent=error.status===429?t('tooMany'):error.status>=500||!error.status?failure(error):t('authFailed'); }
  finally { $('#authSubmit').disabled=false; }
};
$('#logout').onclick=async()=>{
  $('#logout').disabled=true;
  try { await api('/api/auth/sign-out',{method:'POST',body:'{}'});me=null;historyVersion++;adminVersion++;$('#adminOrders').textContent='';$('#orderForm').reset();setHidden('#orderForm',true);connection='ready';authUI();showOrders();$('[data-tab="calc"]').click(); }
  catch(e) { toast(failure(e)); } finally { $('#logout').disabled=false; }
};
$('#area').oninput=()=>{requestId=crypto.randomUUID();update();};
$('#lang').onchange=e=>{lang=e.target.value;savePreferences();render();};
$('#currency').onchange=e=>{currency=e.target.value;savePreferences();requestId=crypto.randomUUID();render();};
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active');if(b.dataset.tab==='history')showOrders();if(b.dataset.tab==='admin')showAdmin();});
$('#book').onclick=()=>{if(!me){$('#accountCard').scrollIntoView({behavior:'smooth'});toast(t('needLogin'));return;}setHidden('#orderForm',false);update();$('#orderForm').scrollIntoView({behavior:'smooth'});};
$('#orderForm').oninput=()=>{requestId=crypto.randomUUID();};
$('#orderForm').onsubmit=async e=>{
  e.preventDefault();$('#orderError').textContent='';$('#confirmOrder').disabled=true;
  const body={requestId,type:types[type][0],area:Number($('#area').value),extras:[...selectedExtras],currency};
  for(const key of ['name','phone','address','date','time','comment'])body[key]=$('#'+key).value;
  try { await api('/api/bookings',{method:'POST',body:JSON.stringify(body)});toast(t('saved'));e.target.reset();setHidden('#orderForm',true);requestId=crypto.randomUUID();showOrders(); }
  catch(error) { $('#orderError').textContent=failure(error); }
  finally { $('#confirmOrder').disabled=false; }
};
$('#refreshOrders').onclick=showOrders;$('#refreshAdmin').onclick=showAdmin;
function savePreferences() { try { localStorage.setItem('clearlyPreferences',JSON.stringify({lang,currency})); } catch {} }
const additions={ru:{printQuote:'Распечатать расчёт / PDF',exportCSV:'Экспорт заявок (CSV)',quoteNotice:'Предварительный расчёт. Уборка и оплата согласуются отдельно.'},en:{printQuote:'Print quote / PDF',exportCSV:'Export bookings (CSV)',quoteNotice:'Estimate only. Cleaning and payment require separate agreement.'},ka:{printQuote:'შეფასების ბეჭდვა / PDF',exportCSV:'შეკვეთების ექსპორტი (CSV)',quoteNotice:'წინასწარი შეფასება. დალაგება და გადახდა ცალკე შეთანხმებას საჭიროებს.'}};
for(const key of Object.keys(additions))Object.assign(I[key],additions[key]);
$('#printQuote').onclick=()=>{ $('#printDetails').textContent=[t(types[type][0]),$('#area').value+' m²',[...selectedExtras].map(t).join(', '),money(total()),t('quoteNotice'),currency==='USD'?t('rateNote'):''].filter(Boolean).join('\n');window.print(); };
$('#exportCSV').onclick=async()=>{
  if(!me?.admin)return;const current=me.user.id, version=adminVersion;
  const button=$('#exportCSV');button.disabled=true;
  try {const {bookings}=await api('/api/admin/bookings');
    if(version!==adminVersion||!me?.admin||me.user.id!==current)return;
    const columns=['id','name','phone','address','type','area','extras','currency','amount','date','time','comment','status'];
    const cell=value=>'"'+String(value??'').replace(/^[=+@\-\t\r]/,m=>"'"+m).replace(/"/g,'""')+'"';
    const csv='\uFEFF'+[columns,...bookings.map(b=>columns.map(k=>b[k]))].map(row=>row.map(cell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='clearly-bookings.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){toast(failure(e));}finally{button.disabled=false;}
};
render();loadSession();
