(()=>{
  const links=[...document.querySelectorAll('a[href="urlaubsanfrage.html?season=summer"]')];
  if(!links.length)return;
  const panel=document.createElement('section');
  panel.className='home-summer-booking-panel';panel.hidden=true;
  panel.innerHTML='<div class="home-summer-booking-bar"><button class="btn btn-outline" type="button"></button></div><iframe title="Summer booking" loading="lazy"></iframe>';
  const css=document.createElement('style');
  css.textContent='.home-summer-booking-panel{position:fixed;inset:0;z-index:9999;background:#fff;display:grid;grid-template-rows:auto 1fr}.home-summer-booking-panel[hidden]{display:none}.home-summer-booking-bar{padding:1rem clamp(1rem,4vw,4rem);background:#fff;border-bottom:1px solid rgba(40,45,31,.2)}.home-summer-booking-panel iframe{width:100%;height:100%;border:0;background:#fff}@media(max-width:640px){.home-summer-booking-bar{padding:.75rem 1rem}.home-summer-booking-panel .btn{width:100%}}';
  document.head.append(css);document.body.append(panel);
  const close=panel.querySelector('button'),frame=panel.querySelector('iframe');
  const english=()=>document.documentElement.lang==='en'||localStorage.getItem('site-language')==='en';
  const label=()=>close.textContent=english()?'Back to homepage':'Zurück zur Homepage';
  links.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();label();frame.src='https://booking.s15.hotellogin.cloud/customer/alpenchalets/booking.php?';panel.hidden=false;document.body.style.overflow='hidden';}));
  close.addEventListener('click',()=>{panel.hidden=true;frame.src='about:blank';document.body.style.overflow='';document.querySelector('#home').scrollIntoView({block:'start'});});
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(label,0)));label();
})();
