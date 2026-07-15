
const h=document.querySelector('.page-header'),m=document.querySelector('.mobile-menu');m?.addEventListener('click',()=>h.classList.toggle('open'));
const langBtns=document.querySelectorAll('[data-lang]');function lang(l){document.documentElement.lang=l;document.querySelectorAll('[data-de]').forEach(e=>{e.innerHTML=e.dataset[l]||e.dataset.de});langBtns.forEach(b=>b.classList.toggle('active',b.dataset.lang===l));localStorage.setItem('alpenchalets-language',l)}langBtns.forEach(b=>b.addEventListener('click',()=>lang(b.dataset.lang)));lang(localStorage.getItem('alpenchalets-language')||'de');
const modal=document.querySelector('.modal');document.querySelectorAll('[data-full]').forEach(b=>b.addEventListener('click',()=>{modal.querySelector('img').src=b.dataset.full;modal.classList.add('open')}));modal?.querySelector('button')?.addEventListener('click',()=>modal.classList.remove('open'));modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
const form=document.querySelector('#contactForm');
form?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form);
  const sub=encodeURIComponent('Anfrage Alpenchalets Flachau – '+(d.get('season')||''));
  const body=encodeURIComponent(
    'Name: '+d.get('name')+'\n'+
    'E-Mail: '+d.get('email')+'\n'+
    'Telefon: '+(d.get('phone')||'')+'\n'+
    'Saison: '+d.get('season')+'\n'+
    'Zeitraum: '+(d.get('dates')||'')+'\n'+
    'Personen: '+(d.get('guests')||'')+'\n\n'+
    d.get('message')
  );
  location.href='mailto:info@alpenchalets.at?subject='+sub+'&body='+body;
});
