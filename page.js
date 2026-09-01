try{const introKey='alpenchaletsIntroSeenV2';sessionStorage.setItem(introKey,'true');if(!window.name.includes(introKey))window.name=((window.name||'')+' '+introKey).trim()}catch{}
const h=document.querySelector('.page-header');
const m=document.querySelector('.mobile-menu');
m?.addEventListener('click',()=>h?.classList.toggle('open'));

function viennaSeason(){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Vienna',month:'numeric'}).formatToParts(new Date());
  const month=Number(parts.find(part=>part.type==='month')?.value||1);
  return month>=11||month<=4?'winter':'summer';
}
const seasonalPage=location.pathname.split('/').pop()||'index.html';
const seasonalPreview=new URLSearchParams(location.search).get('season');
const forcedSeason=seasonalPage==='sommer.html'?'summer':seasonalPage==='winter.html'?'winter':null;
const activeSeason=forcedSeason||(['summer','winter'].includes(seasonalPreview)?seasonalPreview:viennaSeason());
if(['summer','winter'].includes(seasonalPreview)){
  document.querySelectorAll('a[href]').forEach(link=>{
    const raw=link.getAttribute('href');
    if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:'))return;
    const url=new URL(raw,location.href);
    const last=url.pathname.split('/').pop()||'';
    if(url.origin!==location.origin||(!url.pathname.endsWith('.html')&&last.includes('.')))return;
    url.searchParams.set('season',seasonalPreview);
    link.href=url.pathname+url.search+url.hash;
  });
}
const seasonalHeroes={
  'faq.html':{summer:'assets/images/faq-header-planning-v1.webp',winter:'assets/images/faq-header-planning-winter-v2.webp'},
  'galerie.html':{summer:'assets/images/gallery-hero-collage.webp',winter:'assets/images/hero-winter.webp'},
  'kontakt.html':{summer:'assets/images/kontakt-header-modern-summer-v2.webp',winter:'assets/images/kontakt-header-modern-winter-v2.webp'},
  'lage.html':{summer:'assets/images/lage-header-sign-v1.webp',winter:'assets/images/lage-header-sign-winter-v2.webp'},
  'restaurant.html':{summer:'assets/images/restaurant-gutshof-sommer.webp',winter:'assets/images/restaurant-gutshof-winter-v2.webp'},
  'sommer.html':{summer:'assets/images/sommer-header-terrasse.webp',winter:'assets/images/sommer-header-terrasse.webp'},
  'urlaubsanfrage.html':{summer:'assets/images/urlaubsanfrage-header-suitcase-summer-v2.webp',winter:'assets/images/urlaubsanfrage-header-suitcase-winter-v2.webp'},
  'winter.html':{summer:'assets/images/winter-page-hero.webp',winter:'assets/images/winter-page-hero.webp'}
};
const seasonalMobileAssets=new Set([
  "assets/images/faq-header-planning-v1-mobile.webp","assets/images/faq-header-planning-winter-v2-mobile.webp",
  "assets/images/gallery-hero-collage-mobile.webp","assets/images/hero-winter-mobile.webp",
  "assets/images/kontakt-header-modern-summer-v2-mobile.webp","assets/images/kontakt-header-modern-winter-v2-mobile.webp",
  "assets/images/lage-header-sign-v1-mobile.webp","assets/images/lage-header-sign-winter-v2-mobile.webp",
  "assets/images/restaurant-gutshof-sommer-mobile.webp","assets/images/restaurant-gutshof-winter-v2-mobile.webp",
  "assets/images/sommer-header-terrasse-mobile.webp",
  "assets/images/summer-header-generated-mobile.webp","assets/images/urlaubsanfrage-header-suitcase-summer-v2-mobile.webp",
  "assets/images/urlaubsanfrage-header-suitcase-winter-v2-mobile.webp","assets/images/winter-page-hero-mobile.webp"
]);
const seasonalHero=document.querySelector('.page-hero');
const seasonalDesktopImage=seasonalHeroes[seasonalPage]?.[activeSeason];
const seasonalMobileImage=seasonalDesktopImage?.replace(/\.webp$/,'-mobile.webp');
const seasonalImage=innerWidth<=700&&seasonalMobileAssets.has(seasonalMobileImage)?seasonalMobileImage:seasonalDesktopImage;
if(seasonalHero&&seasonalImage){
  seasonalHero.style.setProperty('background-image',`url("${seasonalImage}")`,'important');
  seasonalHero.dataset.season=activeSeason;
}
document.documentElement.dataset.season=activeSeason;

if(location.pathname.endsWith('/sommer.html')||location.pathname.endsWith('sommer.html')){
  const summerHeroTitle=document.querySelector('.page-hero h1');
  const summerHeroText=document.querySelector('.page-hero h1 + p');
  if(summerHeroTitle){
    summerHeroTitle.dataset.de='Gemeinsam den Sommer genießen';
    summerHeroTitle.dataset.en='Enjoy summer together';
    summerHeroTitle.dataset.nl='Samen van de zomer genieten';
  }
  if(summerHeroText){
    summerHeroText.dataset.de='Draußen Neues erleben und sich danach im eigenen Chalet wie zu Hause fühlen.';
    summerHeroText.dataset.en='Discover new experiences outdoors, then feel at home in your own chalet.';
    summerHeroText.dataset.nl='Beleef buiten iets nieuws en voel u daarna thuis in uw eigen chalet.';
  }
}

const langBtns=document.querySelectorAll('[data-lang]');
const supportedLangs=['de','en'];
const languageStorageKey='alpenchalets-language';
function readSavedLanguage(){
  try{const value=localStorage.getItem(languageStorageKey);if(value)return value}catch{}
  const match=document.cookie.match(/(?:^|;\s*)alpenchalets-language=(de|en)(?:;|$)/);
  return match?match[1]:'de';
}
function saveLanguage(value){
  try{localStorage.setItem(languageStorageKey,value)}catch{}
  try{document.cookie=`alpenchalets-language=${value};path=/;max-age=31536000;SameSite=Lax`}catch{}
}
function setTranslatedContent(e,val){
  const field=e.querySelector('input,select,textarea');
  if(e.tagName==='LABEL'&&field){
    let node=[...e.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
    if(!node){node=document.createTextNode('');e.insertBefore(node,field)}
    node.textContent=val;
    return;
  }
  e.innerHTML=val;
}
function translatedDataset(e,active,prefix=''){
  return e.dataset[prefix+active.charAt(0).toUpperCase()+active.slice(1)]||e.dataset[prefix+'De'];
}
function translateAttributes(active){
  document.querySelectorAll('[data-aria-de]').forEach(e=>e.setAttribute('aria-label',translatedDataset(e,active,'aria')));
  document.querySelectorAll('[data-alt-de]').forEach(e=>e.setAttribute('alt',translatedDataset(e,active,'alt')));
  document.querySelectorAll('[data-title-de]').forEach(e=>e.setAttribute('title',translatedDataset(e,active,'title')));
  document.querySelectorAll('[data-placeholder-de]').forEach(e=>e.setAttribute('placeholder',translatedDataset(e,active,'placeholder')));
  document.querySelectorAll('[data-value-de]').forEach(e=>e.setAttribute('value',translatedDataset(e,active,'value')));
  document.querySelectorAll('[data-content-de]').forEach(e=>e.setAttribute('content',translatedDataset(e,active,'content')));
  const title=document.querySelector('[data-page-title-de]');
  if(title)document.title=translatedDataset(title,active,'pageTitle');
}
function lang(l){
  const active=supportedLangs.includes(l)?l:'de';
  document.documentElement.lang=active;
  document.querySelectorAll('[data-de]').forEach(e=>setTranslatedContent(e,e.dataset[active]||e.dataset.de));
  translateAttributes(active);
  langBtns.forEach(b=>b.classList.toggle('active',b.dataset.lang===active));
  saveLanguage(active);
  document.documentElement.classList.remove('language-pending');
}
if(seasonalPage==='winter.html'){
  const winterHeading=document.querySelector('.page-hero h1');
  if(winterHeading){
    winterHeading.dataset.de='Schneetage<br>Kaminabende';
    winterHeading.dataset.en='Snowy days<br>Fireside evenings';
    winterHeading.dataset.nl='Sneeuwdagen<br>Avonden bij de haard';
    winterHeading.innerHTML=winterHeading.dataset.de;
  }
}
langBtns.forEach(b=>b.addEventListener('click',()=>lang(b.dataset.lang)));
lang(readSavedLanguage());
window.addEventListener('storage',event=>{if(event.key===languageStorageKey&&supportedLangs.includes(event.newValue))lang(event.newValue)});

const modal=document.querySelector('.modal');
if(modal){
  const galleryButtons=[...document.querySelectorAll('[data-full]:not([data-plan="true"])')];
  let galleryIndex=-1;
  const modalImage=modal.querySelector('img');
  const prev=document.createElement('button'),next=document.createElement('button');
  prev.type=next.type='button';prev.className='modal-nav modal-prev';next.className='modal-nav modal-next';
  prev.innerHTML='&#10094;';next.innerHTML='&#10095;';
  prev.setAttribute('aria-label','Previous image');next.setAttribute('aria-label','Next image');
  modal.append(prev,next);
  const showGalleryImage=index=>{
    galleryIndex=(index+galleryButtons.length)%galleryButtons.length;
    modalImage.src=galleryButtons[galleryIndex].dataset.full;
  };
  document.querySelectorAll('[data-full]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    modal.classList.toggle('plan-modal',b.dataset.plan==='true');
    modal.classList.toggle('is-rotated-right',b.dataset.rotate==='right');
    galleryIndex=galleryButtons.indexOf(b);
    if(galleryIndex>=0)showGalleryImage(galleryIndex);else modalImage.src=b.dataset.full;
    modal.classList.toggle('has-gallery-nav',galleryIndex>=0&&galleryButtons.length>1);
    modal.classList.add('open');
  }));
  prev.addEventListener('click',()=>showGalleryImage(galleryIndex-1));
  next.addEventListener('click',()=>showGalleryImage(galleryIndex+1));
  modal.querySelector('button:not(.modal-nav)')?.addEventListener('click',()=>modal.classList.remove('open','plan-modal','is-rotated-right','has-gallery-nav'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open','plan-modal','is-rotated-right','has-gallery-nav')});
  document.addEventListener('keydown',e=>{if(!modal.classList.contains('open')||galleryIndex<0)return;if(e.key==='ArrowLeft')showGalleryImage(galleryIndex-1);if(e.key==='ArrowRight')showGalleryImage(galleryIndex+1)});
}

// FAQ accordion: start closed and keep at most one answer open.
const faqItems=[...document.querySelectorAll('.faq details')];
faqItems.forEach(item=>{
  item.open=false;
  item.addEventListener('toggle',()=>{
    if(!item.open)return;
    faqItems.forEach(other=>{if(other!==item)other.open=false});
  });
});

const form=document.querySelector('#contactForm');
if(form){
  const params=new URLSearchParams(location.search);
  if(params.get('season')==='summer') form.elements.season.selectedIndex=0;
  const requestedChalet=params.get('chalet');
  if(requestedChalet&&form.elements.chalet){
    form.elements.chalet.value=requestedChalet;
  }
  const arrival=form.elements.arrival;
  const departure=form.elements.departure;
  const today=new Date();
  const todayIso=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  if(arrival&&departure){
    arrival.min=todayIso;
    departure.min=todayIso;
    const syncDeparture=()=>{
      const nextDay=arrival.value?new Date(arrival.value+'T12:00:00'):null;
      if(nextDay)nextDay.setDate(nextDay.getDate()+1);
      departure.min=nextDay?nextDay.toISOString().slice(0,10):todayIso;
      if(departure.value&&departure.value<departure.min)departure.value='';
    };
    arrival.addEventListener('change',syncDeparture);
    syncDeparture();
  }
  const winterUrl='https://www.sunweb.de/skiurlaub/osterreich/ski-amade/salzburger-sportwelt-ski-amade/flachau/alpenchalets-flachauer-gutshof-kurz-und-wochenreisen';
  const winterCopy={
    de:{title:'Winterurlaub über Sunweb buchen',text:'Winteraufenthalte in unseren Alpenchalets werden ausschließlich über Sunweb gebucht.',button:'Jetzt buchen ↗',back:'Zur Sommeranfrage'},
    en:{title:'Book your winter holiday through Sunweb',text:'Winter stays at our Alpenchalets are booked exclusively through Sunweb.',button:'Book now ↗',back:'Back to summer enquiry'},
    nl:{title:'Boek uw wintervakantie via Sunweb',text:'Winterverblijven in onze Alpenchalets worden uitsluitend via Sunweb geboekt.',button:'Nu boeken ↗',back:'Terug naar zomeraanvraag'}
  };
  const winterMessage=document.createElement('div');
  winterMessage.className='winter-booking-message';
  function showWinterOption(){
    if(!/winter/i.test(String(form.elements.season?.value||'')))return;
    const copy=winterCopy[document.documentElement.lang]||winterCopy.de;
    winterMessage.innerHTML=`<h3 data-de="${winterCopy.de.title}" data-en="${winterCopy.en.title}" data-nl="${winterCopy.nl.title}">${copy.title}</h3><p data-de="${winterCopy.de.text}" data-en="${winterCopy.en.text}" data-nl="${winterCopy.nl.text}">${copy.text}</p><div class="winter-booking-actions"><a class="btn primary" href="${winterUrl}" target="_blank" rel="noopener" data-de="${winterCopy.de.button}" data-en="${winterCopy.en.button}" data-nl="${winterCopy.nl.button}">${copy.button}</a><button class="btn winter-back" type="button" data-de="${winterCopy.de.back}" data-en="${winterCopy.en.back}" data-nl="${winterCopy.nl.back}">${copy.back}</button></div>`;
    form.appendChild(winterMessage);
    form.classList.add('winter-selected');
    winterMessage.querySelector('.winter-back')?.addEventListener('click',()=>{
      form.classList.remove('winter-selected');
      winterMessage.remove();
      form.elements.season.selectedIndex=0;
      form.elements.season.focus();
    });
  }
  form.elements.season?.addEventListener('change',showWinterOption);
  form.addEventListener('submit',e=>{
    const d=new FormData(form);
    const selectedSeason=String(d.get('season')||'').toLowerCase();
    if(/winter/.test(selectedSeason)){
      e.preventDefault();
      location.href=winterUrl;
      return;
    }
    const localHosts=['','localhost','127.0.0.1','0.0.0.0','::1'];
    const serverDeliveryAvailable=/^https?:$/.test(location.protocol)&&!localHosts.includes(location.hostname.toLowerCase());
    if(form.dataset.serverSubmit==='true'&&serverDeliveryAvailable){
      form.action=form.dataset.serverAction||'contact-send.php';
      const button=form.querySelector('[type="submit"]');
      if(button){
        button.disabled=true;
        button.textContent=document.documentElement.lang==='en'?'Sending…':document.documentElement.lang==='nl'?'Verzenden…':'Wird gesendet…';
      }
      return;
    }
    e.preventDefault();
    const sub=encodeURIComponent('Anfrage Alpenchalets Flachau - '+(d.get('season')||''));
    const body=encodeURIComponent(
      'Name: '+d.get('name')+'\n'+
      'E-Mail: '+d.get('email')+'\n'+
      'Telefon: '+(d.get('phone')||'')+'\n'+
      'Saison: '+(d.get('season')||'')+'\n'+
      'Chalet: '+(d.get('chalet')==='4-zimmer'?'4-Zimmer-Chalet':d.get('chalet')==='5-zimmer'?'5-Zimmer-Chalet':'')+'\n'+
      'Anreise: '+(d.get('arrival')||'')+'\n'+
      'Abreise: '+(d.get('departure')||'')+'\n'+
      'Personen: '+(d.get('guests')||'')+'\n\n'+
      (d.get('message')||'')
    );
    location.href='mailto:info@alpenchalets.at?subject='+sub+'&body='+body;
  });

  const contactStatus=params.get('contact');
  const statusCopy={
    sent:{type:'success',de:'Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.',en:'Thank you. Your enquiry has been sent successfully.',nl:'Bedankt. Uw aanvraag is succesvol verzonden.'},
    failed:{type:'error',de:'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an info@alpenchalets.at.',en:'The message could not be sent. Please try again or email info@alpenchalets.at.',nl:'Het bericht kon niet worden verzonden. Probeer het opnieuw of mail naar info@alpenchalets.at.'},
    invalid:{type:'error',de:'Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.',en:'Please check your details and try again.',nl:'Controleer uw gegevens en probeer het opnieuw.'},
    limited:{type:'error',de:'Zu viele Versuche. Bitte warten Sie 15 Minuten und versuchen Sie es erneut.',en:'Too many attempts. Please wait 15 minutes and try again.',nl:'Te veel pogingen. Wacht 15 minuten en probeer het opnieuw.'}
  };
  if(statusCopy[contactStatus]){
    const copy=statusCopy[contactStatus];
    const notice=document.createElement('div');
    notice.className='contact-status '+copy.type;
    notice.setAttribute('role','status');
    notice.dataset.de=copy.de;
    notice.dataset.en=copy.en;
    notice.dataset.nl=copy.nl;
    notice.textContent=copy[document.documentElement.lang]||copy.de;
    form.before(notice);
  }
}

// Same-page nav clicks always return to the top of that page/card.
document.querySelectorAll('.page-nav a').forEach(link=>{
  link.addEventListener('click',event=>{
    const url=new URL(link.href,location.href);
    if(url.pathname===location.pathname&&url.hash===''){
      event.preventDefault();
      window.scrollTo({top:0,behavior:'auto'});
      h?.classList.remove('open');
    }
  });
});

// Google Maps is loaded only after explicit consent.
document.querySelectorAll('.map-consent').forEach(box=>{
  box.querySelector('.map-load')?.addEventListener('click',()=>{
    const frame=document.createElement('iframe');
    frame.title='Google Map Flachauer Alpenchalets';
    frame.loading='lazy';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.allowFullscreen=true;
    frame.src=box.dataset.mapSrc;
    box.replaceWith(frame);
  });
});

function updatePageHeader(){h?.classList.toggle('scrolled',window.scrollY>30)}
window.addEventListener('scroll',updatePageHeader,{passive:true});updatePageHeader();

const mobileBackToTop=document.createElement('a');
mobileBackToTop.className='mobile-back-to-top';
mobileBackToTop.href='#';
mobileBackToTop.innerHTML='&#8593;';
mobileBackToTop.dataset.ariaDe='Zurück nach oben';
mobileBackToTop.dataset.ariaEn='Back to top';
mobileBackToTop.dataset.ariaNl='Terug naar boven';
mobileBackToTop.setAttribute('aria-label',{de:'Zurück nach oben',en:'Back to top',nl:'Terug naar boven'}[document.documentElement.lang]||'Zurück nach oben');
document.body.append(mobileBackToTop);
let mobileBackIdleTimer;
function updateMobileBackToTop(){
  const visible=window.scrollY>450&&document.documentElement.scrollHeight>innerHeight*1.35;
  mobileBackToTop.classList.toggle('is-visible',visible);
  document.body.classList.toggle('mobile-back-active',visible);
  clearTimeout(mobileBackIdleTimer);
  if(visible)mobileBackIdleTimer=setTimeout(()=>{
    mobileBackToTop.classList.remove('is-visible');
    document.body.classList.remove('mobile-back-active');
  },700);
}
window.addEventListener('scroll',updateMobileBackToTop,{passive:true});
mobileBackToTop.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});

function mountFunspace(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const main=document.querySelector('main');
  if(page!=='sommer.html'||!main||document.querySelector('.funspace-section'))return;
  const section=document.createElement('section');
  section.className='section funspace-section';
  section.id='funspace';
  section.innerHTML=`<div class="container funspace-shell"><div class="funspace-visual" aria-hidden="true"><span class="funspace-orbit orbit-one"></span><span class="funspace-orbit orbit-two"></span><span class="funspace-mark">FUN<br>SPACE</span><span class="funspace-place">FLACHAU</span></div><div class="funspace-copy"><p class="kicker" data-de="NEU IN FLACHAU" data-en="NEW IN FLACHAU" data-nl="NIEUW IN FLACHAU">NEU IN FLACHAU</p><h2 data-de="Drau&szlig;en spielen. Gemeinsam staunen." data-en="Play outside. Discover together." data-nl="Buiten spelen. Samen ontdekken.">Drau&szlig;en spielen. Gemeinsam staunen.</h2><p data-de="Der FUNSPACE Flachau verbindet Natur, Bewegung und Spiel zu einem besonderen Erlebnis f&uuml;r Kinder, Jugendliche und Erwachsene. Wasserspa&szlig;, sportliche Herausforderungen und gemeinsame Abenteuer machen ihn zu einem abwechslungsreichen Ziel f&uuml;r den Sommertag." data-en="FUNSPACE Flachau combines nature, movement and play in a special experience for children, teenagers and adults. Water fun, sporting challenges and shared adventures make it an exciting destination for a summer day." data-nl="FUNSPACE Flachau combineert natuur, beweging en spel tot een bijzondere belevenis voor kinderen, jongeren en volwassenen. Waterpret, sportieve uitdagingen en gezamenlijke avonturen maken het een veelzijdige bestemming voor een zomerdag.">Der FUNSPACE Flachau verbindet Natur, Bewegung und Spiel zu einem besonderen Erlebnis f&uuml;r Kinder, Jugendliche und Erwachsene. Wasserspa&szlig;, sportliche Herausforderungen und gemeinsame Abenteuer machen ihn zu einem abwechslungsreichen Ziel f&uuml;r den Sommertag.</p><div class="funspace-benefit"><span aria-hidden="true">&#10003;</span><strong data-de="Mit der Flachau Sommer Card ist der Eintritt kostenlos." data-en="Admission is free with the Flachau Summer Card." data-nl="Met de Flachau Summer Card is de toegang gratis.">Mit der Flachau Sommer Card ist der Eintritt kostenlos.</strong></div><div class="funspace-tags"><span data-de="F&uuml;r alle Generationen" data-en="For all generations" data-nl="Voor alle generaties">F&uuml;r alle Generationen</span><span data-de="Natur &amp; Bewegung" data-en="Nature &amp; activity" data-nl="Natuur &amp; beweging">Natur &amp; Bewegung</span><span>Unterberggasse, Flachau</span></div><div class="actions"><a class="btn outline funspace-link" href="https://www.flachau.com/de/sommer/action-fun/fun-space-flachau.html" target="_blank" rel="noopener noreferrer" data-de="FUNSPACE entdecken &#8599;" data-en="Discover FUNSPACE &#8599;" data-nl="Ontdek FUNSPACE &#8599;">FUNSPACE entdecken &#8599;</a></div><p class="funspace-note" data-de="Aktuelle &Ouml;ffnungszeiten und saisonale Hinweise finden Sie auf der offiziellen FUNSPACE-Seite." data-en="Current opening hours and seasonal information are available on the official FUNSPACE website." data-nl="Actuele openingstijden en seizoensinformatie vindt u op de offici&euml;le FUNSPACE-website.">Aktuelle &Ouml;ffnungszeiten und saisonale Hinweise finden Sie auf der offiziellen FUNSPACE-Seite.</p></div></div>`;
  main.append(section);
  lang(document.documentElement.lang);
}
mountFunspace();

function mountNewsletter(){
  const footer=document.querySelector('.site-footer');
  if(!footer||document.querySelector('.newsletter-signup'))return;
  const status=new URLSearchParams(location.search).get('newsletter');
  const block=document.createElement('section');
  block.className='newsletter-signup';block.id='newsletter';
  block.innerHTML=`<div class="newsletter-inner"><div class="newsletter-copy"><p class="newsletter-kicker" data-de="Post aus Flachau" data-en="News from Flachau" data-nl="Nieuws uit Flachau">Post aus Flachau</p><h2 data-de="Alpenmomente im Postfach" data-en="Alpine moments in your inbox" data-nl="Alpenmomenten in uw inbox">Alpenmomente im Postfach</h2><p data-de="Erhalten Sie ausgewählte Neuigkeiten, saisonale Tipps und besondere Angebote der Alpenchalets." data-en="Receive selected news, seasonal tips and special offers from the Alpenchalets." data-nl="Ontvang geselecteerd nieuws, seizoenstips en bijzondere aanbiedingen van de Alpenchalets.">Erhalten Sie ausgewählte Neuigkeiten, saisonale Tipps und besondere Angebote der Alpenchalets.</p></div><form class="newsletter-form" action="newsletter-subscribe.php" method="post"><div class="newsletter-row"><label class="sr-only" for="newsletterEmail" data-de="E-Mail-Adresse" data-en="Email address" data-nl="E-mailadres">E-Mail-Adresse</label><input id="newsletterEmail" type="email" name="email" autocomplete="email" required data-placeholder-de="Ihre E-Mail-Adresse" data-placeholder-en="Your email address" data-placeholder-nl="Uw e-mailadres" placeholder="Ihre E-Mail-Adresse"><button type="submit" data-de="Anmelden" data-en="Subscribe" data-nl="Aanmelden">Anmelden</button></div><label class="newsletter-consent"><input type="checkbox" name="consent" value="yes" required><span data-de="Ich möchte den Newsletter erhalten und akzeptiere die Datenschutzerklärung. Die Abmeldung ist jederzeit möglich." data-en="I would like to receive the newsletter and accept the privacy policy. I can unsubscribe at any time." data-nl="Ik wil de nieuwsbrief ontvangen en accepteer het privacybeleid. Afmelden kan op elk moment.">Ich möchte den Newsletter erhalten und akzeptiere die Datenschutzerklärung. Die Abmeldung ist jederzeit möglich.</span></label><a class="newsletter-privacy" href="datenschutz.html" data-de="Datenschutz ansehen" data-en="View privacy policy" data-nl="Privacybeleid bekijken">Datenschutz ansehen</a><input class="newsletter-trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"></form></div>`;
  if(status){
    const messages={
      success:{de:'Fast geschafft: Bitte bestätigen Sie die Anmeldung über den Link in Ihrer E-Mail.',en:'Almost done: please confirm your subscription using the link in your email.',nl:'Bijna klaar: bevestig uw aanmelding via de link in uw e-mail.'},
      invalid:{de:'Bitte geben Sie eine gültige E-Mail-Adresse ein und bestätigen Sie die Einwilligung.',en:'Please enter a valid email address and confirm your consent.',nl:'Vul een geldig e-mailadres in en bevestig uw toestemming.'},
      unavailable:{de:'Die Newsletter-Anmeldung wird gerade eingerichtet. Bitte versuchen Sie es später erneut.',en:'Newsletter signup is currently being configured. Please try again later.',nl:'De nieuwsbriefaanmelding wordt momenteel ingesteld. Probeer het later opnieuw.'},
      failed:{de:'Die Anmeldung konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.',en:'Signup could not be completed. Please try again later.',nl:'De aanmelding kon niet worden voltooid. Probeer het later opnieuw.'}
    };
    const msg=messages[status]||messages.failed;
    const note=document.createElement('p');
    note.className=`newsletter-status ${status==='success'?'is-success':'is-error'}`;
    note.dataset.de=msg.de;note.dataset.en=msg.en;note.dataset.nl=msg.nl;note.textContent=msg.de;
    block.querySelector('.newsletter-form').prepend(note);
  }
  block.querySelector('.newsletter-form').action=window.acNewsletterEndpoint||'newsletter-subscribe.php';
  if(window.acNewsletterEndpoint)block.querySelector('.newsletter-form').insertAdjacentHTML('beforeend','<input type="hidden" name="action" value="ac_newsletter_subscribe">');
  const details=document.createElement('details');
  details.className='newsletter-details';details.id='newsletter';
  details.innerHTML='<summary data-de="Newsletter" data-en="Newsletter" data-nl="Nieuwsbrief">Newsletter</summary>';
  details.append(block.querySelector('.newsletter-form'));
  details.querySelector('.newsletter-form').insertAdjacentHTML('afterbegin','<div class="newsletter-modal-heading"><h3 data-de="Newsletter anmelden" data-en="Subscribe to our newsletter" data-nl="Aanmelden voor de nieuwsbrief">Newsletter anmelden</h3><p data-de="Neuigkeiten, saisonale Tipps und besondere Angebote direkt per E-Mail." data-en="News, seasonal tips and special offers delivered directly by email." data-nl="Nieuws, seizoenstips en bijzondere aanbiedingen rechtstreeks per e-mail.">Neuigkeiten, saisonale Tipps und besondere Angebote direkt per E-Mail.</p></div>');
  (footer.querySelector('.footer-top>div:last-child')||footer).append(details);
  details.addEventListener('click',event=>{if(event.target===details)details.open=false});
  document.addEventListener('click',event=>{if(details.open&&!details.querySelector('.newsletter-form').contains(event.target)&&event.target!==details.querySelector('summary'))details.open=false});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')details.open=false});
  if(location.hash==='#newsletter')details.open=true;
  lang(document.documentElement.lang);
}
mountNewsletter();

/* Shared production polish for desktop and mobile. */
if(!document.querySelector('script[data-ac-final-polish]')){const acPolish=document.createElement('script');acPolish.src='final-polish.js?v=20260823-33';acPolish.defer=true;acPolish.dataset.acFinalPolish='';document.head.append(acPolish)}
