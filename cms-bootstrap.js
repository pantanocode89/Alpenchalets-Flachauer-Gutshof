/* Starts the existing protected script only after the public CMS bridge. */
(() => {
  document.addEventListener('click',event=>{const link=event.target.closest('a[href$="#newsletter"],.newsletter-details>summary');if(!link)return;event.preventDefault();alert(document.documentElement.lang==='en'?'The newsletter will be available soon.':'Der Newsletter ist in Kürze verfügbar.')});
  const source=document.currentScript?.dataset.script;if(!source)return;
  window.acCmsProtectedReady=Promise.resolve(window.acCmsReady).catch(()=>{}).then(()=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=source;script.onload=resolve;script.onerror=reject;document.body.append(script);
  })).then(()=>document.querySelectorAll('.newsletter-details .newsletter-form').forEach(form=>form.remove()));
})();
