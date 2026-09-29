/* Starts the existing protected script only after the public CMS bridge. */
(() => {
  const source=document.currentScript?.dataset.script;if(!source)return;
  window.acCmsProtectedReady=Promise.resolve(window.acCmsReady).catch(()=>{}).then(()=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=source;script.onload=resolve;script.onerror=reject;document.body.append(script);
  }));
})();
