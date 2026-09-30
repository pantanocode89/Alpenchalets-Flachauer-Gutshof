/* Small presentation-only helper for the production Decap editor. */
(()=>{
  const nav=/^Navigation – /;
  const tidy=()=>{
    const home=location.hash.includes('/entries/home');
    document.querySelectorAll('label,div').forEach(el=>{
      if(el.children.length||!nav.test(el.textContent.trim()))return;
      const row=el.closest('[class*="field"], [class*="Field"]')||el.parentElement;
      if(row)row.hidden=true;
    });
    if(!home)return;
    const hero=[...document.querySelectorAll('*')].find(el=>el.children.length===0&&el.textContent.trim()==='HERO – TITEL');
    const title=hero?.closest('[class*="field"], [class*="Field"]');
    const editor=document.querySelector('[class*="EditorControl"], main')||document.body;
    if(title&&editor.firstElementChild!==title)editor.prepend(title);
    document.querySelectorAll('details').forEach(detail=>{
      if(!detail.dataset.cmsAccordion){detail.dataset.cmsAccordion='1';detail.open=false;detail.addEventListener('toggle',()=>{if(detail.open)detail.parentElement?.querySelectorAll(':scope > details[open]').forEach(other=>{if(other!==detail)other.open=false})})}
    });
  };
  new MutationObserver(tidy).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',tidy);tidy();
})();
