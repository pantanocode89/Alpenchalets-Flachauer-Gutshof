(()=>{
  const link=document.querySelector('a[href="urlaubsanfrage.html?season=summer"]');
  if(!link)return;
  const bookingUrl='https://booking.s15.hotellogin.cloud/customer/alpenchalets/booking.php?';
  const panel=document.createElement('section');
  panel.className='summer-booking-panel';
  panel.hidden=true;
  panel.innerHTML='<div class="summer-booking-bar"><button class="btn outline" type="button"></button></div><iframe title="Summer booking" loading="lazy"></iframe>';
  const css=document.createElement('style');
  css.textContent='.summer-booking-panel{position:fixed;inset:0;z-index:9999;background:#faf8f3;display:grid;grid-template-rows:auto 1fr}.summer-booking-panel[hidden]{display:none}.summer-booking-bar{padding:1rem clamp(1rem,4vw,4rem);background:#faf8f3;border-bottom:1px solid #d8d2c4}.summer-booking-panel iframe{width:100%;height:100%;border:0;background:#fff}.summer-booking-panel .btn{min-width:0}@media(max-width:640px){.summer-booking-bar{padding:.75rem 1rem}.summer-booking-panel .btn{width:100%}}';
  document.head.append(css);document.body.append(panel);
  const close=panel.querySelector('button'),frame=panel.querySelector('iframe');
  const english=()=>document.documentElement.lang==='en'||localStorage.getItem('site-language')==='en';
  const label=()=>close.textContent=english()?'Back to summer page':'Zurück zur Sommerseite';
  link.addEventListener('click',event=>{event.preventDefault();label();frame.src=bookingUrl;panel.hidden=false;document.body.style.overflow='hidden';});
  close.addEventListener('click',()=>{panel.hidden=true;frame.src='about:blank';document.body.style.overflow='';link.scrollIntoView({block:'center'});});
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(label,0)));
  label();
})();
