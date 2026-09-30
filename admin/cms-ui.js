/* Small presentation-only helper for the production Decap editor. */
(()=>{
  const home=()=>location.hash.includes('/entries/home');
  const sections=()=>[...document.querySelectorAll('[class*="ControlPaneContainer"] > [class*="ControlContainer"]')].map(row=>{
    const field=row.querySelector(':scope > [id]');
    const button=field?.querySelector(':scope > [class*="TopBarContainer"] button[data-testid="expand-button"]');
    return button&&field?.children[1]?{button,content:field.children[1]}:null;
  }).filter(Boolean);
  let initialized=false;
  const tidy=()=>{
    if(!home()){initialized=false;return;}
    document.querySelectorAll('label').forEach(label=>{
      if(!/^Navigation\s*–\s*/i.test(label.textContent.trim()))return;
      const field=document.getElementById(label.htmlFor);
      const row=field?.closest('[class*="ControlContainer"]');
      if(row)row.hidden=true;
    });
    const hero=document.querySelector('[id^="hero.title-field-"]');
    const translations=document.querySelector('[id^="translations-field-"] > :last-child');
    if(hero&&translations&&translations.firstElementChild!==hero)translations.prepend(hero);
    const items=sections();
    items.forEach(({button,content})=>{
      if(button.dataset.cmsAccordion)return;
      button.dataset.cmsAccordion='1';
      button.addEventListener('click',event=>{
        event.preventDefault();event.stopImmediatePropagation();
        const opening=content.hidden;
        sections().forEach(item=>{item.content.hidden=true;});
        if(opening)content.hidden=false;
      },true);
    });
    if(!initialized&&items.length){items.forEach(item=>{item.content.hidden=true;});initialized=true;}
  };
  new MutationObserver(tidy).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',tidy);tidy();
})();
