try{const introKey='alpenchaletsIntroSeenV2';sessionStorage.setItem(introKey,'true');if(!window.name.includes(introKey))window.name=((window.name||'')+' '+introKey).trim()}catch{}
function viennaSeason(){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Vienna',month:'numeric'}).formatToParts(new Date());
  const month=Number(parts.find(part=>part.type==='month')?.value||1);
  return month>=11||month<=4?'winter':'summer';
}
const seasonalPreview=new URLSearchParams(location.search).get('season');
const activeSeason=['summer','winter'].includes(seasonalPreview)?seasonalPreview:viennaSeason();
document.documentElement.dataset.season=activeSeason;
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
const detailPage=location.pathname.split('/').pop();
const detailSeasonalHeroes={
  'chalet-4-zimmer.html':{summer:'assets/images/living.webp',winter:'assets/images/winter-header-real-chalet.webp'},
  'chalet-5-zimmer.html':{summer:'assets/images/exterior-main.webp',winter:'assets/images/winter-header-real-chalet.webp'}
};
const detailHero=document.querySelector('.detail-hero');
const detailSeasonalDesktopImage=detailSeasonalHeroes[detailPage]?.[activeSeason];
const detailMobileAssets=new Set(["assets/images/living-mobile.webp","assets/images/exterior-main-mobile.webp","assets/images/winter-header-real-chalet-mobile.webp"]);
const detailSeasonalMobileImage=detailSeasonalDesktopImage?.replace(/\.webp$/,'-mobile.webp');
const detailSeasonalImage=innerWidth<=700&&detailMobileAssets.has(detailSeasonalMobileImage)?detailSeasonalMobileImage:detailSeasonalDesktopImage;
if(detailHero&&detailSeasonalImage){
  detailHero.style.backgroundImage=`url("${detailSeasonalImage}")`;
  detailHero.dataset.season=activeSeason;
}

const amenityIconPaths=[
  '<path d="M5 4v16M9 4v5a2 2 0 0 1-4 0V4M16 4v16M16 4c4 2 4 7 0 9"/>',
  '<path d="M12 3c1 4-3 5-3 9a4 4 0 0 0 8 0c0-3-2-5-5-9ZM8 16c-1 3 1 5 4 5s5-2 4-5"/>',
  '<path d="M4 17h16v3H4zM7 13h10M8 10c-2-2 2-3 0-5M12 10c-2-2 2-3 0-5M16 10c-2-2 2-3 0-5"/>',
  '<circle cx="17" cy="6" r="3"/><path d="M3 13h18M6 13v7M18 13v7M8 13V9h8v4"/>',
  '<path d="M3 9c5-4 13-4 18 0M6 13c3-3 9-3 12 0M9 17c2-2 4-2 6 0"/><circle cx="12" cy="20" r="1"/>',
  '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  '<path d="M7 3l4 18M17 3l-4 18M5 7l5-2M14 19l5-2M4 21h5M15 3h5"/>',
  '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 7h.01M10 7h.01"/>',
  '<path d="M5 20V8h14v12M3 20h18M8 8l4-5 4 5M9 13h6M12 13v7"/>',
  '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  '<path d="M4 12c0-4 3-7 8-7 4 0 7 2 8 6-2 0-3 1-3 3H7c0-2-1-2-3-2ZM7 14v5M17 14v5M5 19h14"/>',
  '<path d="M4 9h16l-2 11H6L4 9ZM3 6h18M8 6l2-3h4l2 3M8 13h8"/>'
];
document.querySelectorAll('.amenity').forEach((card,index)=>{
  const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');
  icon.setAttribute('class','amenity-icon');
  icon.setAttribute('viewBox',index===2?'0 0 64 48':'0 0 24 24');
  icon.setAttribute('aria-hidden','true');
  icon.innerHTML=index===2?'<use href="#icon-sauna"/>':amenityIconPaths[index%amenityIconPaths.length];
  card.prepend(icon);
});

const detailTranslations={
 de:{
  'nav.home':'Home','nav.chalets':'Unsere Chalets','nav.summer':'Sommer','nav.winter':'Winter','nav.gallery':'Galerie','nav.location':'Lage','nav.comfort':'Komfort','nav.restaurant':'Restaurant','nav.faq':'FAQ','nav.enquiry':'Urlaubsanfrage','nav.contact':'Kontakt','nav.book':'Winter buchen',
  'common.back':'Zurück zur Startseite','common.summer':'Sommer anfragen','common.winter':'Winter über Sunweb buchen','common.floor':'Grundriss vergrößern','common.gallery':'Bildergalerie','common.amenities':'Ausstattung im überblick','common.rooms':'Raumaufteilung','common.goodToKnow':'Gut zu wissen','common.contact':'Fragen zu diesem Chalet','common.contactText':'Wir helfen Ihnen gerne telefonisch oder per E-Mail weiter.','footer.tagline':'wohlfühlen | genießen',
  'c4.kicker':'4-Zimmer-Chalet &middot; bis 12 Personen','c4.title':'Viel Platz für gemeinsame Urlaubstage','c4.lead':'Drei Schlafzimmer, großzügiger Wohnbereich, private Sauna und eine große Terrasse ? ideal für Familien und Freundesgruppen, die ihren Urlaub zusammen genießen möchten.','c4.fact1':'bis 12 Personen','c4.fact2':'3 Schlafzimmer','c4.fact3':'3 Bäder + WC','c4.fact4':'Private Sauna','c4.fact5':'2 Etagen',
  'c4.introKicker':'Gemütlich wohnen','c4.introTitle':'Ein Chalet, das Gemeinschaft und Rückzug verbindet','c4.introText':'Im Erdgeschoss treffen sich alle im offenen Wohn- und Essbereich mit Küche, Kamin und direktem Zugang zur Terrasse. Im Obergeschoss liegen die Schlafzimmer, Badezimmer und der private Wellnessbereich. So bleibt genug Raum für gemeinsame Zeit und ruhige Momente.','c4.note':'Schlafmöglichkeiten: Schlafzimmer 1 mit Doppelbett, Schlafzimmer 2 und 3 jeweils mit Doppelbett und Stockbett sowie ein Schlafsofa für zwei Personen im Wohnbereich.','c4.room1':'Schlafzimmer 1','c4.room1t':'Doppelbett','c4.room1d':'Geräumiges Schlafzimmer mit Doppelbett.','c4.room2':'Schlafzimmer 2','c4.room2t':'Doppelbett + Stockbett','c4.room2d':'Zweites Schlafzimmer mit Doppelbett und Stockbett.','c4.room3':'Schlafzimmer 3','c4.room3t':'Doppelbett + Stockbett','c4.room3d':'Drittes Schlafzimmer mit Doppelbett und Stockbett.','c4.room4':'Wohnbereich','c4.room4t':'Schlafsofa für 2','c4.room4d':'Zusätzliche Schlafmöglichkeit im Wohnbereich.','c4.room5':'Bad & Wellness','c4.room5t':'3 Bäder + Sauna','c4.room5d':'Private Sauna und mehrere Bäder für entspannte Morgen.','c4.room6':'Eingangsbereich','c4.room6t':'Extra WC & Skiraum','c4.room6d':'Garderobe, separates WC und praktischer Stauraum.','c4.good':'Das Chalet erstreckt sich über zwei Ebenen. Die konkrete Raumaufteilung kann je nach Chalet leicht abweichen. Der Grundriss zeigt den typischen Aufbau des 4-Zimmer-Chalets.',
  'c5.kicker':'5-Zimmer-Chalet &middot; bis 10 Personen','c5.title':'Vier separate Schlafzimmer Keine Stockbetten Viel Komfort','c5.lead':'Das 5-Zimmer-Chalet ist besonders angenehm für Gruppen, die vier separate Schlafzimmer wünschen. Dieser Chalet-Typ hat vier separate Schlafzimmer; Stockbetten gibt es hier nicht.','c5.fact1':'bis 10 Personen','c5.fact2':'4 Schlafzimmer','c5.fact3':'2 Bäder + 2 WCs','c5.fact4':'Private Sauna','c5.fact5':'bis 20 gekoppelt',
  'c5.introKicker':'Mehr Privatsphäre','c5.introTitle':'Vier echte Schlafzimmer für entspannte Nächte','c5.introText':'Im Erdgeschoss befinden sich der Wohn- und Essbereich, die voll ausgestattete Küche, ein Schlafzimmer sowie der Zugang zur Terrasse. Im Obergeschoss liegen drei weitere Schlafzimmer, der Wellnessbereich und die private Sauna.','c5.note':'Jedes der vier separaten Schlafzimmer bietet zwei Schlafplätze. Zusammen mit dem Schlafsofa für zwei Personen im Wohnbereich bietet das Chalet Platz für bis zu zehn Gäste.','c5.room1':'Schlafzimmer 1','c5.room1t':'2 Schlafplätze','c5.room1d':'Separates Schlafzimmer im Erdgeschoss für zwei Personen.','c5.room2':'Schlafzimmer 2','c5.room2t':'2 Schlafplätze','c5.room2d':'Ruhiges Schlafzimmer im Obergeschoss für zwei Personen.','c5.room3':'Schlafzimmer 3','c5.room3t':'2 Schlafplätze','c5.room3d':'Separates Schlafzimmer für zwei Personen.','c5.room4':'Schlafzimmer 4','c5.room4t':'2 Schlafplätze','c5.room4d':'Viertes separates Schlafzimmer für zwei Personen.','c5.room5':'Wohnbereich','c5.room5t':'Schlafsofa für 2','c5.room5d':'Zusätzliche Schlafmöglichkeit im Wohnbereich.','c5.room6':'Für große Gruppen','c5.room6t':'Gekoppelt bis 20','c5.room6d':'Zwei verbundene Chalets können gemeinsam genutzt werden.','c5.good':'Zwei 5-Zimmer-Chalets können über eine Verbindungstür kombiniert werden. Damit entsteht eine besonders praktische Unterkunft für Gruppen mit bis zu 20 Personen.',
  'amenity.kitchen':'Voll ausgestattete Küche','amenity.kitchenD':'Voll ausgestattet mit Backofen, Kochfeld, Kühlschrank, Kaffeemaschine, Wasserkocher, Toaster, Geschirr, Gläsern, Töpfen und Pfannen.','amenity.fire':'Kamin','amenity.fireD':'Für gemütliche Abende nach einem Tag in den Bergen.','amenity.sauna':'Private Sauna','amenity.saunaD':'Wellnessbereich direkt im eigenen Chalet.','amenity.terrace':'Eigene Terrasse','amenity.terraceD':'Platz zum Frühstücken, Entspannen und Zusammensitzen.','amenity.wifi':'Kostenloses WLAN','amenity.wifiD':'Internetverbindung im gesamten Chalet.','amenity.parking':'Parkmöglichkeiten','amenity.parkingD':'Parkflächen befinden sich in der Chalet-Anlage; zusätzlich steht eine Tiefgarage zur Verfügung.','amenity.storage':'Ski- & Abstellraum','amenity.storageD':'Eigener Abstellraum mit Skiständer für Ski, Schuhe und Ausrüstung.','amenity.location':'Zentrale Lage','amenity.laundry':'Wäscheküche','amenity.laundryD':'Waschmaschine und Trockner stehen an der Rezeption zur Verfügung.','amenity.kids':'Spielplatz','amenity.kidsD':'Großer Spielplatz vor dem Flachauer Gutshof, von der Restaurantterrasse gut einsehbar.','amenity.locationD':'Kurze Wege zu Flachauer Gutshof und 8er-Jet.'
 },
 en:{
  'nav.home':'Home','nav.chalets':'Our Chalets','nav.summer':'Summer','nav.winter':'Winter','nav.gallery':'Gallery','nav.location':'Location & Directions','nav.comfort':'Comfort','nav.restaurant':'Restaurant','nav.faq':'FAQ','nav.enquiry':'Holiday Enquiry','nav.contact':'Contact','nav.book':'Book winter','common.back':'Back to homepage','common.summer':'Enquire about summer','common.winter':'Book winter via Sunweb','common.floor':'Enlarge floor plan','common.gallery':'Photo gallery','common.amenities':'Amenities at a glance','common.rooms':'Room layout','common.goodToKnow':'Good to know','common.contact':'Questions about this chalet','common.contactText':'We are happy to help by phone or email.','footer.tagline':'feel good | enjoy',
  'c4.kicker':'4-room chalet &middot; up to 12 guests','c4.title':'Plenty of room for holidays together','c4.lead':'Three bedrooms, a spacious living area, private sauna and large terrace ? ideal for families and groups of friends who want to enjoy their holiday together.','c4.fact1':'up to 12 guests','c4.fact2':'3 bedrooms','c4.fact3':'3 baths + WC','c4.fact4':'Private sauna','c4.fact5':'2 floors','c4.introKicker':'Cozy living','c4.introTitle':'A chalet combining shared space and privacy','c4.introText':'The ground floor brings everyone together in the open living and dining area with kitchen, fireplace and direct terrace access. Upstairs are the bedrooms, bathrooms and private wellness area.','c4.note':'Sleeping: bedroom 1 has a double bed; bedrooms 2 and 3 each have a double bed and bunk bed, plus a sofa bed for two in the living area.','c4.room1':'Bedroom 1','c4.room1t':'Double bed','c4.room1d':'Spacious bedroom with double bed.','c4.room2':'Bedroom 2','c4.room2t':'Double bed + bunk bed','c4.room2d':'Second bedroom with double bed and bunk bed.','c4.room3':'Bedroom 3','c4.room3t':'Double bed + bunk bed','c4.room3d':'Bedroom with a double bed and bunk bed.','c4.room4':'Living area','c4.room4t':'Sofa bed for 2','c4.room4d':'Additional sleeping space in the living area.','c4.room5':'Bath & wellness','c4.room5t':'3 baths + sauna','c4.room5d':'Private sauna and several bathrooms for relaxed mornings.','c4.room6':'Entrance area','c4.room6t':'Extra WC & storage','c4.room6d':'Cloakroom, separate toilet and practical storage.','c4.good':'The chalet is arranged over two levels. The exact layout may vary slightly. The floor plan shows the typical 4-room chalet configuration.',
  'c5.kicker':'5-room chalet &middot; up to 10 guests','c5.title':'Four separate bedrooms No bunk beds Plenty of comfort','c5.lead':'The 5-room chalet is especially comfortable for groups wanting four separate bedrooms. This chalet type has four separate bedrooms; there are no bunk beds here.','c5.fact1':'up to 10 guests','c5.fact2':'4 bedrooms','c5.fact3':'2 baths + 2 WCs','c5.fact4':'Private sauna','c5.fact5':'up to 20 connected','c5.introKicker':'More privacy','c5.introTitle':'Four proper bedrooms for restful nights','c5.introText':'The ground floor includes the living and dining area, fully equipped kitchen, one bedroom and terrace access. Upstairs are three more bedrooms, the wellness area and private sauna.','c5.note':'Each of the four separate bedrooms sleeps two guests. Together with the sofa bed for two in the living area, the chalet accommodates up to ten guests.','c5.room1':'Bedroom 1','c5.room1t':'Sleeps 2','c5.room1d':'Separate ground-floor bedroom for two guests.','c5.room2':'Bedroom 2','c5.room2t':'Sleeps 2','c5.room2d':'Quiet upstairs bedroom for two guests.','c5.room3':'Bedroom 3','c5.room3t':'Sleeps 2','c5.room3d':'Separate bedroom for two guests.','c5.room4':'Bedroom 4','c5.room4t':'Sleeps 2','c5.room4d':'Fourth separate bedroom for two guests.','c5.room5':'Living area','c5.room5t':'Sofa bed for 2','c5.room5d':'Additional sleeping space in the living area.','c5.room6':'For larger groups','c5.room6t':'Connected for up to 20','c5.room6d':'Two linked chalets can be used together.','c5.good':'Two 5-room chalets can be combined through a connecting door, creating a practical option for groups of up to 20 guests.',
  'amenity.kitchen':'Fully equipped kitchen','amenity.kitchenD':'Hob, oven, refrigerator, tableware and dining area.','amenity.fire':'Fireplace','amenity.fireD':'For cozy evenings after a day in the mountains.','amenity.sauna':'Private sauna','amenity.saunaD':'Your own wellness area inside the chalet.','amenity.terrace':'Private terrace','amenity.terraceD':'Space for breakfast, relaxing and spending time together.','amenity.wifi':'Free Wi-Fi','amenity.wifiD':'Internet access throughout the chalet.','amenity.parking':'Parking','amenity.parkingD':'Parking spaces are available within the chalet complex.','amenity.storage':'Ski & storage room','amenity.storageD':'Practical space for footwear and equipment.','amenity.laundry':'Laundry room','amenity.laundryD':'Washing machine and dryer are available at reception.','amenity.kids':'Playground','amenity.kidsD':'Large playground in front of Flachauer Gutshof, clearly visible from the restaurant terrace.','amenity.location':'Central location','amenity.locationD':'Short walks to Flachauer Gutshof and the 8er-Jet.'
 },
 nl:{
  'nav.home':'Startpagina','nav.chalets':'Onze chalets','nav.summer':'Zomer','nav.winter':'Winter','nav.gallery':'Galerij','nav.location':'Ligging','nav.comfort':'Comfort','nav.restaurant':'Restaurant','nav.faq':'FAQ','nav.enquiry':'Vakantieaanvraag','nav.contact':'Contact','nav.book':'Winter boeken','common.back':'Terug naar startpagina','common.summer':'Zomer aanvragen','common.winter':'Winter via Sunweb boeken','common.floor':'Plattegrond vergroten','common.gallery':'Fotogalerij','common.amenities':'Voorzieningen in één oogopslag','common.rooms':'Indeling','common.goodToKnow':'Goed om te weten','common.contact':'Vragen over dit chalet','common.contactText':'Wij helpen u graag telefonisch of per e-mail.','footer.tagline':'ontspannen | genieten',
  'c4.kicker':'4-kamerchalet &middot; maximaal 12 personen','c4.title':'Veel ruimte voor een vakantie samen','c4.lead':'Drie slaapkamers, een ruime woonkamer, privésauna en groot terras - ideaal voor families en vriendengroepen.','c4.fact1':'max. 12 personen','c4.fact2':'3 slaapkamers','c4.fact3':'3 badkamers + wc','c4.fact4':'Privésauna','c4.fact5':'2 verdiepingen','c4.introKicker':'Gezellig wonen','c4.introTitle':'Een chalet voor samen zijn én privacy','c4.introText':'Op de begane grond komt iedereen samen in de open woon- en eetruimte met keuken, open haard en directe toegang tot het terras. Boven bevinden zich de slaapkamers, badkamers en privéwellness.','c4.note':'Slaapplaatsen: slaapkamer 1 heeft een tweepersoonsbed; slaapkamers 2 en 3 hebben elk een tweepersoonsbed en stapelbed, plus een slaapbank voor twee personen.','c4.room1':'Slaapkamer 1','c4.room1t':'Tweepersoonsbed','c4.room1d':'Ruime slaapkamer met tweepersoonsbed.','c4.room2':'Slaapkamer 2','c4.room2t':'Tweepersoonsbed + stapelbed','c4.room2d':'Tweede slaapkamer met tweepersoonsbed en stapelbed.','c4.room3':'Slaapkamer 3','c4.room3t':'Tweepersoonsbed + stapelbed','c4.room3d':'Slaapkamer met tweepersoonsbed en stapelbed.','c4.room4':'Woonruimte','c4.room4t':'Slaapbank voor 2','c4.room4d':'Extra slaapmogelijkheid in de woonkamer.','c4.room5':'Bad & wellness','c4.room5t':'3 badkamers + sauna','c4.room5d':'Privésauna en meerdere badkamers.','c4.room6':'Entree','c4.room6t':'Extra wc & berging','c4.room6d':'Garderobe, apart toilet en praktische opslag.','c4.good':'Het chalet bestaat uit twee verdiepingen. De exacte indeling kan licht verschillen. De plattegrond toont de gebruikelijke indeling van het 4-kamerchalet.',
  'c5.kicker':'5-kamerchalet &middot; maximaal 10 personen','c5.title':'Vier aparte slaapkamers Geen stapelbedden Veel comfort','c5.lead':'Het 5-kamerchalet is bijzonder prettig voor groepen die vier aparte slaapkamers willen. Dit chalettype heeft vier aparte slaapkamers; er zijn geen stapelbedden.','c5.fact1':'max. 10 personen','c5.fact2':'4 slaapkamers','c5.fact3':'2 badkamers + 2 toiletten','c5.fact4':'Privésauna','c5.fact5':'gekoppeld tot 20','c5.introKicker':'Meer privacy','c5.introTitle':'Vier volwaardige slaapkamers voor rustige nachten','c5.introText':'Op de begane grond bevinden zich de woon- en eetruimte, volledig uitgeruste keuken, één slaapkamer en toegang tot het terras. Boven liggen drie extra slaapkamers, de wellnessruimte en privésauna.','c5.note':'Elk van de vier aparte slaapkamers biedt twee slaapplaatsen. Samen met de slaapbank voor twee in de woonkamer biedt het chalet plaats aan maximaal tien gasten.','c5.room1':'Slaapkamer 1','c5.room1t':'2 slaapplaatsen','c5.room1d':'Aparte slaapkamer op de begane grond voor twee gasten.','c5.room2':'Slaapkamer 2','c5.room2t':'2 slaapplaatsen','c5.room2d':'Rustige slaapkamer boven voor twee gasten.','c5.room3':'Slaapkamer 3','c5.room3t':'2 slaapplaatsen','c5.room3d':'Derde aparte slaapkamer voor twee gasten.','c5.room4':'Slaapkamer 4','c5.room4t':'2 slaapplaatsen','c5.room4d':'Vierde aparte slaapkamer voor twee gasten.','c5.room5':'Woonruimte','c5.room5t':'Slaapbank voor 2','c5.room5d':'Extra slaapmogelijkheid in de woonkamer.','c5.room6':'Voor grotere groepen','c5.room6t':'Gekoppeld tot 20','c5.room6d':'Twee verbonden chalets kunnen samen worden gebruikt.','c5.good':'Twee 5-kamerchalets kunnen via een verbindingsdeur worden gecombineerd, ideaal voor groepen tot 20 personen.',
  'amenity.kitchen':'Volledig uitgeruste keuken','amenity.kitchenD':'Volledig uitgerust met oven, kookplaat, koelkast, koffiemachine, waterkoker, toaster, servies, glazen, potten en pannen.','amenity.fire':'Open haard','amenity.fireD':'Voor gezellige avonden na een dag in de bergen.','amenity.sauna':'Privésauna','amenity.saunaD':'Eigen wellnessruimte in het chalet.','amenity.terrace':'Eigen terras','amenity.terraceD':'Ruimte voor ontbijt, ontspanning en samenzijn.','amenity.wifi':'Gratis wifi','amenity.wifiD':'Internet in het hele chalet.','amenity.parking':'Parkeren','amenity.parkingD':'Parkeerplaatsen bevinden zich op het chaletpark.','amenity.storage':'Ski- & bergruimte','amenity.storageD':'Praktische opslag voor schoenen en materiaal.','amenity.laundry':'Wasruimte','amenity.laundryD':'Wasmachine en droger zijn beschikbaar bij de receptie.','amenity.kids':'Speeltuin','amenity.kidsD':'Grote speeltuin voor de Flachauer Gutshof, goed zichtbaar vanaf het restaurantterras.','amenity.location':'Centrale ligging','amenity.locationD':'Korte afstand tot Flachauer Gutshof en de 8er-Jet.'
 }
};
// The entrance has wardrobes and shelves, not a separate cloakroom.
detailTranslations.de['common.back']='Zurück zu unseren Chalets';
detailTranslations.en['common.back']='Back to our chalets';
detailTranslations.nl['common.back']='Terug naar onze chalets';
detailTranslations.de['common.galleryTitle']='Einblicke in unsere Chalets';
detailTranslations.en['common.galleryTitle']='A look inside our chalets';
detailTranslations.nl['common.galleryTitle']='Een kijkje in onze chalets';
detailTranslations.de['amenity.kitchenD']='Voll ausgestattet mit Backofen, Kochfeld, Kühlschrank, Filterkaffeemaschine, Wasserkocher, Toaster, Geschirr, Gläsern, Töpfen und Pfannen. Es ist ausschließlich eine Filterkaffeemaschine vorhanden.';
detailTranslations.en['amenity.kitchenD']='Fully equipped with oven, hob, refrigerator, filter coffee maker, kettle, toaster, crockery, glasses, pots and pans. Only a filter coffee maker is provided.';
detailTranslations.nl['amenity.kitchenD']='Volledig uitgerust met oven, kookplaat, koelkast, filterkoffiezetapparaat, waterkoker, broodrooster, servies, glazen, potten en pannen. Er is uitsluitend een filterkoffiezetapparaat aanwezig.';
detailTranslations.de['amenity.bread']='Brötchenservice';
detailTranslations.de['amenity.breadD']='Brot und Gebäck können täglich bis 17:00 Uhr für den nächsten Morgen bestellt werden. Die Lieferung erfolgt zwischen 07:30 und 08:00 Uhr direkt vor das Chalet.';
detailTranslations.de['amenity.takeaway']='Take-away im Winter';
detailTranslations.de['amenity.takeawayD']='Im Winter können Gäste Speisen in unserem Restaurant Flachauer Gutshof als Take-away bestellen und dort abholen.';
detailTranslations.en['amenity.bread']='Bread roll service';
detailTranslations.en['amenity.breadD']='Bread and pastries can be ordered daily until 5:00 PM for the following morning. Delivery is made between 7:30 and 8:00 AM directly in front of the chalet.';
detailTranslations.en['amenity.takeaway']='Winter takeaway';
detailTranslations.en['amenity.takeawayD']='In winter, guests can order takeaway meals from our Flachauer Gutshof restaurant and collect them there.';
detailTranslations.nl['amenity.bread']='Broodjesservice';
detailTranslations.nl['amenity.breadD']='Brood en gebak kunnen dagelijks tot 17:00 uur voor de volgende ochtend worden besteld. De levering gebeurt tussen 07:30 en 08:00 uur direct voor het chalet.';
detailTranslations.nl['amenity.takeaway']='Take-away in de winter';
detailTranslations.nl['amenity.takeawayD']='In de winter kunnen gasten afhaalgerechten bestellen bij ons restaurant Flachauer Gutshof en deze daar ophalen.';
detailTranslations.de['common.contactKicker']='Persönlich für Sie da';
detailTranslations.en['common.contactKicker']='Here for you';
detailTranslations.nl['common.contactKicker']='Persoonlijk voor u bereikbaar';
detailTranslations.de['c4.room6t']='Extra WC & Stauraum';
detailTranslations.de['c4.room6d']='Schränke, Regale, separates WC und praktischer Stauraum.';
detailTranslations.en['c4.room6t']='Extra WC & storage';
detailTranslations.en['c4.room6d']='Wardrobes, shelves, a separate toilet and practical storage.';
detailTranslations.nl['c4.room6t']='Extra wc & opbergruimte';
detailTranslations.nl['c4.room6d']='Kasten, planken, een apart toilet en praktische opbergruimte.';
const buttons=document.querySelectorAll('.lang-btn');
const supportedLangs=['de','en'];
const languageStorageKey='alpenchalets-language';
function readSavedLanguage(){try{const value=localStorage.getItem(languageStorageKey);if(value)return value}catch{}const match=document.cookie.match(/(?:^|;\s*)alpenchalets-language=(de|en)(?:;|$)/);return match?match[1]:'de'}
function saveLanguage(value){try{localStorage.setItem(languageStorageKey,value)}catch{}try{document.cookie=`alpenchalets-language=${value};path=/;max-age=31536000;SameSite=Lax`}catch{}}
function translatedDataset(e,active,prefix=''){return e.dataset[prefix+active.charAt(0).toUpperCase()+active.slice(1)]||e.dataset[prefix+'De']}
function setTranslatedContent(e,val){e.innerHTML=val}
function translateAttributes(active){document.querySelectorAll('[data-aria-de]').forEach(e=>e.setAttribute('aria-label',translatedDataset(e,active,'aria')));document.querySelectorAll('[data-alt-de]').forEach(e=>e.setAttribute('alt',translatedDataset(e,active,'alt')));document.querySelectorAll('[data-title-de]').forEach(e=>e.setAttribute('title',translatedDataset(e,active,'title')));document.querySelectorAll('[data-content-de]').forEach(e=>e.setAttribute('content',translatedDataset(e,active,'content')));const title=document.querySelector('[data-page-title-de]');if(title)document.title=translatedDataset(title,active,'pageTitle')}
function setLang(lang){const active=supportedLangs.includes(lang)?lang:'de';document.documentElement.lang=active;document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;const v=detailTranslations[active][key]??detailTranslations.de[key];if(v!==undefined)el.innerHTML=v});document.querySelectorAll('[data-de]').forEach(el=>setTranslatedContent(el,el.dataset[active]||el.dataset.de));translateAttributes(active);buttons.forEach(b=>b.classList.toggle('active',b.dataset.lang===active));saveLanguage(active)}
buttons.forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));setLang(readSavedLanguage());
window.addEventListener('storage',event=>{if(event.key===languageStorageKey&&supportedLangs.includes(event.newValue))setLang(event.newValue)});
function setDetailGalleryTitle(active){
  const heading=document.querySelector('#gallery h2');
  if(heading)heading.textContent=detailTranslations[active]?.['common.galleryTitle']||detailTranslations.de['common.galleryTitle'];
}
setDetailGalleryTitle(document.documentElement.lang);
buttons.forEach(button=>button.addEventListener('click',()=>setDetailGalleryTitle(button.dataset.lang)));
window.addEventListener('storage',event=>{if(event.key===languageStorageKey&&supportedLangs.includes(event.newValue))setDetailGalleryTitle(event.newValue)});
const menuToggle=document.getElementById('menuToggle');if(menuToggle)menuToggle.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menuToggle.setAttribute('aria-expanded',String(open))});
const detailGalleryItems=[...document.querySelectorAll('.gallery-item')];
const modal=document.getElementById('imageModal'),modalImage=document.getElementById('modalImage'),modalTitle=document.getElementById('modalTitle');
let detailGalleryIndex=-1;
const detailModalPrev=document.createElement('button'),detailModalNext=document.createElement('button');
detailModalPrev.type=detailModalNext.type='button';
detailModalPrev.className='modal-nav modal-prev';detailModalNext.className='modal-nav modal-next';
detailModalPrev.innerHTML='&#10094;';detailModalNext.innerHTML='&#10095;';
detailModalPrev.setAttribute('aria-label','Previous image');detailModalNext.setAttribute('aria-label','Next image');
modal.append(detailModalPrev,detailModalNext);
function showDetailGalleryImage(index){detailGalleryIndex=(index+detailGalleryItems.length)%detailGalleryItems.length;const item=detailGalleryItems[detailGalleryIndex];modalImage.src=item.dataset.src;modalImage.alt=item.querySelector('img')?.alt||''}
function openModal(src,title='',galleryIndex=-1){detailGalleryIndex=galleryIndex;if(detailGalleryIndex>=0)showDetailGalleryImage(detailGalleryIndex);else modalImage.src=src;modalTitle.textContent='';modal.classList.toggle('has-gallery-nav',detailGalleryIndex>=0&&detailGalleryItems.length>1);modal.showModal()}
detailGalleryItems.forEach((b,index)=>b.addEventListener('click',()=>openModal(b.dataset.src,'',index)));
detailModalPrev.addEventListener('click',()=>showDetailGalleryImage(detailGalleryIndex-1));
detailModalNext.addEventListener('click',()=>showDetailGalleryImage(detailGalleryIndex+1));
document.querySelectorAll('.open-floorplan').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.image)));
modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});modal.addEventListener('close',()=>modal.classList.remove('has-gallery-nav'));document.addEventListener('keydown',e=>{if(!modal.open||detailGalleryIndex<0)return;if(e.key==='ArrowLeft')showDetailGalleryImage(detailGalleryIndex-1);if(e.key==='ArrowRight')showDetailGalleryImage(detailGalleryIndex+1)});document.getElementById('year').textContent=new Date().getFullYear();
const detailBackToTop=document.createElement('a');
detailBackToTop.className='detail-back-to-top';
detailBackToTop.href='#main';
detailBackToTop.innerHTML='&#8593;';
detailBackToTop.dataset.ariaDe='Zurück nach oben';
detailBackToTop.dataset.ariaEn='Back to top';
detailBackToTop.dataset.ariaNl='Terug naar boven';
detailBackToTop.setAttribute('aria-label',{de:'Zurück nach oben',en:'Back to top',nl:'Terug naar boven'}[document.documentElement.lang]||'Zurück nach oben');
document.body.append(detailBackToTop);
let detailBackIdleTimer;
const updateBackToTop=()=>{
  const visible=window.scrollY>420;
  detailBackToTop.classList.toggle('is-visible',visible);
  document.body.classList.toggle('mobile-back-active',visible);
  clearTimeout(detailBackIdleTimer);
  if(visible)detailBackIdleTimer=setTimeout(()=>{
    detailBackToTop.classList.remove('is-visible');
    document.body.classList.remove('mobile-back-active');
  },700);
};
window.addEventListener('scroll',updateBackToTop,{passive:true});
detailBackToTop.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});

/* Shared production polish for desktop and mobile. */
if(!document.querySelector('script[data-ac-final-polish]')){const acPolish=document.createElement('script');acPolish.src='final-polish.js?v=20260812-24';acPolish.defer=true;acPolish.dataset.acFinalPolish='';document.head.append(acPolish)}
