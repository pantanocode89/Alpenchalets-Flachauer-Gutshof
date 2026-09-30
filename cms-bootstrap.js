/* Starts the existing protected script only after the public CMS bridge. */
(() => {
  const footer=document.querySelector('footer'),host=footer?.querySelector('.footer-contact')||footer?.querySelector('.footer-top>div:last-child');
  if(host&&!footer.querySelector('a[href$="#newsletter"]'))host.insertAdjacentHTML('beforeend','<br><a href="#newsletter" data-de="Newsletter" data-en="Newsletter">Newsletter</a>');
  document.addEventListener('click',event=>{const link=event.target.closest('a[href$="#newsletter"],.newsletter-details>summary');if(!link)return;event.preventDefault();alert(document.documentElement.lang==='en'?'The newsletter will be available soon.':'Der Newsletter ist in Kürze verfügbar.')});
  const source=document.currentScript?.dataset.script;if(!source)return;
  window.acCmsProtectedReady=Promise.resolve(window.acCmsReady).catch(()=>{}).then(()=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=source;script.onload=resolve;script.onerror=reject;document.body.append(script);
  }));
})();
