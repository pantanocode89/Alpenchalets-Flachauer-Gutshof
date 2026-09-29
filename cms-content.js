/* Public content bridge. It accepts only content records and finishes before
 * protected page scripts start, so Decap content cannot alter layout or JS. */
(() => {
  const page=(location.pathname.split('/').pop()||'index.html').replace('.html','')||'index';
  const slug={index:'home','chalet-4-zimmer':'chalet-4','chalet-5-zimmer':'chalet-5'}[page]||page;
  const guard=document.createElement('style');guard.textContent='html.cms-content-pending body{visibility:hidden}';document.head.append(guard);
  document.documentElement.classList.add('cms-content-pending');
  const get=path=>fetch(path,{credentials:'same-origin',cache:'no-cache'}).then(response=>response.ok?response.json():null).catch(()=>null);
  const safe=value=>String(value||'').replace(/<(?!br\s*\/?\s*>)/gi,'&lt;').replace(/<\/(?!br\s*>)/gi,'&lt;/');
  const apply=(global,data)=>{
    global=global||{};data=data||{};window.acCmsPageData=data;window.acCmsGlobal=global;
    const cmsGalleries=()=>{if(Array.isArray(data.galleries))return data.galleries;if(data.gallery)return [data.gallery];if(data.main_gallery)return [data.main_gallery];return [data.chalet4_gallery,data.chalet5_gallery].filter(Boolean)};
    window.acCmsHero=(id,fallback)=>{const hero=Array.isArray(data.heroes)?data.heroes.find(item=>item.id===id)?.image:data.heroes?.[id];return hero||fallback};
    window.acCmsGallery=(id,fallback=[])=>{const gallery=cmsGalleries().find(item=>item.id===id);const images=(gallery?.images||[]).map(item=>typeof item==='string'?item:item.image).filter(Boolean);return images.length?images:fallback};
    window.acCmsTranslations={de:{},en:{}};
    const cmsPairs=value=>Array.isArray(value)?value:Object.entries(value||{}).map(([id,item])=>({id,...item}));
    const cmsImages=value=>Array.isArray(value)?value:Object.entries(value||{}).map(([id,item])=>({id,...item}));
    const cmsLinks=value=>Array.isArray(value)?value:Object.entries(value||{}).map(([id,item])=>({id,...item}));
    for(const item of cmsPairs(data.translations)){window.acCmsTranslations.de[item.id]=item.de;window.acCmsTranslations.en[item.id]=item.en}
    const setText=(el,value)=>{const field=el.querySelector('input,select,textarea');if(el.tagName==='LABEL'&&field){let node=[...el.childNodes].find(child=>child.nodeType===Node.TEXT_NODE);if(!node){node=document.createTextNode('');el.insertBefore(node,field)}node.textContent=value.replace(/<br\s*\/?\s*>/gi,' ');return}el.innerHTML=value};
    const cmsTexts=cmsPairs(data.texts);
    for(const item of cmsTexts){const el=document.querySelector(`[data-cms-text="${CSS.escape(item.id)}"]`);if(!el)continue;el.dataset.de=safe(item.de);el.dataset.en=safe(item.en);const active=localStorage.getItem('alpenchalets-language')==='en'?'en':'de';setText(el,el.dataset[active]||el.dataset.de||'')}
    for(const item of cmsImages(data.media)){const el=document.querySelector(`[data-cms-media="${CSS.escape(item.id)}"]`);if(!el||!item.image)continue;el.setAttribute(el.dataset.cmsAttr||'src',item.image)}
    for(const item of cmsLinks(data.links)){const el=document.querySelector(`[data-cms-url="${CSS.escape(item.id)}"]`);if(el&&item.url)el.href=item.url}
    document.querySelectorAll('[data-cms-gallery]').forEach(host=>{const gallery=cmsGalleries().find(item=>item.id===host.dataset.cmsGallery);if(!gallery?.images?.length)return;const images=gallery.images.map(item=>typeof item==='string'?item:item.image).filter(Boolean);if(host.matches('.detail-gallery'))host.innerHTML=images.map(image=>`<button class="gallery-item" data-src="${image}"><img loading="lazy" decoding="async" src="${image}" alt="Chalet"></button>`).join('');});
    const faqHost=document.querySelector('.faq .legal');if(faqHost&&(data.faqs||[]).length){faqHost.querySelectorAll('details').forEach(item=>item.remove());for(const item of data.faqs){const detail=document.createElement('details'),summary=document.createElement('summary'),answer=document.createElement('p');summary.dataset.de=safe(item.question_de);summary.dataset.en=safe(item.question_en);summary.innerHTML=summary.dataset[localStorage.getItem('alpenchalets-language')==='en'?'en':'de'];answer.dataset.de=safe(item.answer_de);answer.dataset.en=safe(item.answer_en);answer.innerHTML=answer.dataset[localStorage.getItem('alpenchalets-language')==='en'?'en':'de'];detail.append(summary,answer);faqHost.append(detail)}}
    document.querySelectorAll('[data-cms-carousel]').forEach(host=>{const gallery=cmsGalleries().find(item=>item.id===host.dataset.cmsCarousel);if(!gallery?.floorplan||!gallery?.images?.length)return;const slides=host.querySelector('.chalet-carousel-slides');if(!slides)return;const images=gallery.images.map(item=>typeof item==='string'?item:item.image).filter(Boolean);slides.innerHTML=`<figure class="is-active is-floorplan"><img loading="lazy" decoding="async" src="${gallery.floorplan}" alt="Grundriss"></figure>`+images.map(image=>`<figure><img loading="lazy" decoding="async" src="${image}" alt="Chalet"></figure>`).join('');const count=host.querySelector('.chalet-carousel-count');if(count)count.textContent=`1 / ${images.length+1}`;});
    document.querySelectorAll('a[href^="tel:"]').forEach(el=>{el.href=`tel:${(global.contact?.phone||'').replace(/[^+\d]/g,'')}`;el.textContent=global.contact?.phone||el.textContent});
    document.querySelectorAll('a[href^="mailto:"]').forEach(el=>{el.href=`mailto:${global.contact?.email||''}`;el.textContent=global.contact?.email||el.textContent});
  };
  window.acCmsReady=Promise.all([get('content/global.json'),get(`content/${slug}.json`)]).then(([global,data])=>apply(global,data)).finally(()=>{document.documentElement.classList.remove('cms-content-pending');guard.remove()});
})();
