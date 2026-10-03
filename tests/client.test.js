import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const code=await readFile(new URL('../app.js',import.meta.url),'utf8');

test('browser keeps selected extras across language, currency and type changes; legacy data is escaped',async()=>{
  const dom=new JSDOM(html,{url:'https://clearly.example',runScripts:'outside-only'});
  const w=dom.window;
  w.fetch=async()=>new Response(JSON.stringify({error:'UNAUTHORIZED'}),{status:401});
  w.localStorage.setItem('clearlyOrders',JSON.stringify([{type:'<img src=x onerror=alert(1)>',name:'<script>bad()</script>',price:'120 GEL'}]));
  try {
    w.eval(code);await new Promise(resolve=>setImmediate(resolve));
    const q=s=>w.document.querySelector(s);
    q('#oven').click();assert.equal(q('#price').textContent,'140 ₾');
    q('#lang').value='en';q('#lang').dispatchEvent(new w.Event('change'));assert.equal(q('#oven').checked,true);
    q('#currency').value='USD';q('#currency').dispatchEvent(new w.Event('change'));assert.equal(q('#oven').checked,true);assert.equal(q('#price').textContent,'52 $');assert.match(q('#types').textContent,/0.74 \$ \/ m²/);assert.match(q('#rateCards').textContent,/1.48 \$ \/ m²/);
    q('[data-type="1"]').click();assert.equal(q('#oven').checked,true);assert.equal(q('#price').textContent,'96 $');
    assert.equal(q('#legacyOrders img'),null);assert.equal(q('#legacyOrders script'),null);
    assert.ok(q('#legacyOrders').textContent.includes('<script>bad()</script>'));
    assert.equal(q('#authForm').classList.contains('hidden'),false);
    q('#authMode').value='register';q('#authMode').dispatchEvent(new w.Event('change'));assert.equal(q('#authName').required,true);
    q('#lang').value='ka';q('#lang').dispatchEvent(new w.Event('change'));assert.equal(w.document.documentElement.lang,'ka');
    assert.equal(q('#authSubmit').textContent,'რეგისტრაცია');
  }finally { w.close(); }
});

test('unavailable backend is clearly reported and does not save new local bookings',async()=>{
  const dom=new JSDOM(html,{url:'https://clearly.example',runScripts:'outside-only'});
  dom.window.fetch=async()=>new Response(JSON.stringify({error:'SETUP_REQUIRED'}),{status:503});
  try {dom.window.eval(code);await new Promise(resolve=>setImmediate(resolve));assert.match(dom.window.document.querySelector('#connection').textContent,/настраивается/);assert.equal(dom.window.localStorage.getItem('clearlyOrders'),null);}finally{dom.window.close();}
});

test('restores language/currency and prepares a printable quote',async()=>{
  const dom=new JSDOM(html,{url:'https://clearly.example',runScripts:'outside-only'});const w=dom.window;
  w.localStorage.setItem('clearlyPreferences',JSON.stringify({lang:'en',currency:'USD'}));w.fetch=async()=>new Response('{"error":"UNAUTHORIZED"}',{status:401});let printed=false;w.print=()=>{printed=true;};
  try{w.eval(code);await new Promise(resolve=>setImmediate(resolve));assert.equal(w.document.documentElement.lang,'en');assert.equal(w.document.querySelector('#currency').value,'USD');w.document.querySelector('#printQuote').click();assert.ok(printed);assert.match(w.document.querySelector('#printDetails').textContent,/44 \$/);assert.match(w.document.querySelector('#printDetails').textContent,/Estimate only/);}finally{w.close();}
});

test('CSV export ignores a response arriving after administrator logout',async()=>{
  const dom=new JSDOM(html,{url:'https://clearly.example',runScripts:'outside-only'});const w=dom.window;
  let exportResponse;let downloaded=false;
  w.URL.createObjectURL=()=>{downloaded=true;return 'blob:test';};
  w.fetch=async path=>{
    if(path==='/api/me')return new Response(JSON.stringify({user:{id:'admin',name:'Admin',email:'admin@example.com'},admin:true}));
    if(path==='/api/admin/bookings')return new Promise(resolve=>{exportResponse=resolve;});
    return new Response(JSON.stringify(path==='/api/bookings'?{bookings:[]}:{success:true}));
  };
  try{
    w.eval(code);await new Promise(resolve=>setImmediate(resolve));
    const pending=w.document.querySelector('#exportCSV').onclick();
    await w.document.querySelector('#logout').onclick();
    exportResponse(new Response(JSON.stringify({bookings:[]})));await pending;
    assert.equal(downloaded,false);
  }finally{w.close();}
});
