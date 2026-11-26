(()=>{
  try{
    const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const month=Number(new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Vienna',month:'numeric'}).format(new Date()));
    const forced=page==='sommer.html'?'summer':page==='winter.html'?'winter':null;
    const season=forced||(month>=11||month<=4?'winter':'summer');
    document.documentElement.dataset.season=season;    const stored=localStorage.getItem('alpenchalets-language');
    const cookie=document.cookie.match(/(?:^|;\s*)alpenchalets-language=(de|en)(?:;|$)/)?.[1];
    const lang=stored==='en'||stored==='de'?stored:(cookie||'de');
    document.documentElement.lang=lang;
    document.documentElement.classList.add('language-pending');
    const mobile=innerWidth<=700?'-mobile':'';
    const heroes={
      'index.html':{summer:'assets/images/hero-option-summer.webp',winter:`assets/images/hero-option-winter${mobile}.webp`},
      'chalet-4-zimmer.html':{summer:'assets/images/living.webp',winter:`assets/images/winter-header-real-chalet${mobile}.webp`},
      'chalet-5-zimmer.html':{summer:'assets/images/exterior-main.webp',winter:`assets/images/winter-header-real-chalet${mobile}.webp`},
      'faq.html':{summer:'assets/images/faq-header-planning-v1.webp',winter:`assets/images/faq-header-planning-winter-v2${mobile}.webp`},
      'impressum.html':{summer:'assets/images/66261ce3-38b5-435d-9c1c-84d8aa9afd0d.png',winter:'assets/images/WinterImpressum.png'},
      'kontakt.html':{summer:'assets/images/kontakt-header-modern-summer-v2.webp',winter:`assets/images/kontakt-header-modern-winter-v2${mobile}.webp`},
      'lage.html':{summer:'assets/images/26-flachau-sommer-wandern-hüttenwanderung-franzfischerhütte-21.jpg',winter:'assets/images/lage.jpg'},
      'datenschutz.html':{summer:'assets/images/057becf1-c300-402d-aaba-e86d9ee57cdc.png',winter:'assets/images/0ab298b4-42ad-4d80-ab23-e68aa2d97c0d.png'},
      'restaurant.html':{summer:'assets/images/restaurant-gutshof-sommer.webp',winter:`assets/images/restaurant-gutshof-winter-v2${mobile}.webp`},
      'urlaubsanfrage.html':{summer:'assets/images/urlaubsanfrage-header-suitcase-summer-v2.webp',winter:`assets/images/urlaubsanfrage-header-suitcase-winter-v2${mobile}.webp`},
      'winter.html':{summer:'assets/images/winter-page-hero.webp',winter:`assets/images/winter-page-hero${mobile}.webp`},
      'sommer.html':{summer:`assets/images/sommer-header-terrasse${mobile}.webp`,winter:`assets/images/sommer-header-terrasse${mobile}.webp`}
    };
    const hero=heroes[page]?.[season];
    if(hero){
      const preload=document.createElement('link');preload.rel='preload';preload.as='image';preload.href=hero;preload.fetchPriority='high';document.head.append(preload);
      const early=document.createElement('style');early.id='ac-season-first-frame';early.textContent=`.hero .hero-slide,.page-hero,.legal-hero,.detail-hero{background-image:url("${hero}")!important}`;document.head.append(early);
    }
    if(page==='galerie.html'&&season==='winter'){
      const early=document.createElement('style');early.id='ac-season-gallery';early.textContent='.tile-1{background-image:url("assets/images/winter-page-hero.jpg")!important}.tile-2{background-image:url("assets/images/IMG_5188.JPG")!important}.tile-3{background-image:url("assets/images/IMG_5174.JPG")!important}.tile-4{background-image:url("assets/images/25-flachau-winter-ski-urlaub-outdoor-4.jpg")!important}.tile-5{background-image:url("assets/images/hero-winter.webp")!important}';document.head.append(early);
    }
    setTimeout(()=>document.documentElement.classList.remove('language-pending'),1800);
  }catch{
    document.documentElement.lang='de';
  }
})();
