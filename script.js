(() => {
  const releaseIntro = () => {
    document.body?.classList.remove('is-loading');
    document.body?.classList.add('hero-ready');
    const intro = document.getElementById('siteIntro');
    if(intro){
      intro.classList.add('is-hidden');
      setTimeout(() => intro.remove(), 900);
    }
  };
  window.addEventListener('error', () => setTimeout(releaseIntro, 3600), {once:true});
  setTimeout(releaseIntro, 6500);
})();
function viennaSeason(){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Vienna',month:'numeric'}).formatToParts(new Date());
  const month=Number(parts.find(part=>part.type==='month')?.value||1);
  return month>=11||month<=4?'winter':'summer';
}
const seasonalPreview=new URLSearchParams(location.search).get('season');
const activeSeason=['summer','winter'].includes(seasonalPreview)?seasonalPreview:viennaSeason();
document.documentElement.dataset.season=activeSeason;
if(activeSeason==='winter'){
  const mobileSeason=innerWidth<=700;
  const chaletHeader=document.querySelector('.chalets-header');
  const comfortHeader=document.querySelector('.comfort-header');
  const restaurantImage=document.querySelector('.restaurant-main-img');
  if(chaletHeader)chaletHeader.style.setProperty('background-image',`url("assets/images/chalets-header-real-room-winter-v2${mobileSeason?'-mobile':''}.webp")`,'important');
  if(comfortHeader)comfortHeader.style.setProperty('background-image',`url("assets/images/comfort-header-chalet-winter-v2${mobileSeason?'-mobile':''}.webp")`,'important');
  if(restaurantImage)restaurantImage.src=`assets/images/restaurant-gutshof-winter-v2${mobileSeason?'-mobile':''}.webp`;
}
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
const homeSlides=document.querySelectorAll('.hero-slide');
if(activeSeason==='winter'&&homeSlides.length){
  homeSlides[0].style.setProperty('background-image',innerWidth<=700?"url('assets/images/hero-option-winter-mobile.webp')":"url('assets/images/hero-option-winter.webp')",'important');
  if(homeSlides[1])homeSlides[1].style.setProperty('background-image',innerWidth<=700?"url('assets/images/winter-generated-wide-final-mobile.webp')":"url('assets/images/winter-generated-wide-final.webp')",'important');
}
const translations={"de":{"nav.home":"Home","nav.chalets":"Unsere Chalets","nav.seasons":"Sommer & Winter","nav.summer":"Sommer","nav.winter":"Winter","nav.gallery":"Galerie","nav.location":"Lage &amp; Anfahrt","nav.enquiry":"Urlaubsanfrage","nav.contact":"Kontakt","nav.comfort":"Komfort","nav.restaurant":"Restaurant","nav.faq":"FAQ","nav.book":"Winter buchen","hero.title":"Ankommen<br>Wohlf&uuml;hlen","hero.text":"Ein Ort f&uuml;r besondere Urlaubsmomente.","hero.summerBook":"Sommer anfragen","hero.winterBook":"Winter buchen","hero.bookingNote":"Sommeranfragen direkt bei uns. Winterbuchungen sind ausschlie&szlig;lich &uuml;ber Sunweb m&ouml;glich.","intro.kicker":"Willkommen bei Alpenchalets","intro.title":"Holz, W&auml;rme und viel Raum f&uuml;r gemeinsame Zeit","intro.text":"Unsere gem&uuml;tlichen Chalets mit Sauna, Kamin und voll ausgestatteter K&uuml;che bieten den idealen Ort f&uuml;r entspannte Tage in Flachau.","intro.f1":"Private Sauna","intro.f2":"Kamin","intro.f3":"Zentrale Lage","chalets.kicker":"Unsere Unterk&uuml;nfte","chalets.title":"Private Chalets f&uuml;r unvergessliche Urlaubstage","chalets.lead":"Zwei Chalet-Typen, private R&uuml;ckzugsr&auml;ume und ein warmes Zuhause auf Zeit f&uuml;r kleine und gro&szlig;e Gruppen.","chalet4.kicker":"F&uuml;r bis zu 12 Personen","chalet4.title":"4-Zimmer-Chalet","chalet4.text":"Gro&szlig;z&uuml;giges Chalet auf zwei Ebenen mit viel Raum f&uuml;r gemeinsame Abende, R&uuml;ckzug und entspannte Urlaubstage.","chalet4.sleeping":"3 Schlafzimmer: 2x Doppelbett mit Bankbett, 1x Doppelbett sowie Schlafsofa f&uuml;r 2 Personen","chalet4.bathrooms":"3 Badezimmer, private Sauna und separates WC","chalet4.living":"Gro&szlig;er Wohn- und Essbereich mit Kamin und voll ausgestatteter K&uuml;che","chalet4.outdoor":"Terrasse, Garderobe, eigener Abstellraum / Skiraum und Br&ouml;tchenservice auf Wunsch","chalet5.kicker":"F&uuml;r bis zu 10 Personen","chalet5.title":"5-Zimmer-Chalet","chalet5.text":"Ein ruhiges, komfortables Chalet mit vier separaten Schlafzimmern, privater Sauna und erwachsenem Wohngef&uuml;hl.","chalet5.sleeping":"4 separate Schlafzimmer sowie Schlafsofa f&uuml;r 2 Personen &ndash; keine Stockbetten","chalet5.bathrooms":"2 Badezimmer, private Sauna und 2 separate WCs","chalet5.living":"Gem&uuml;tlicher Wohn- und Essbereich mit Kamin und voll ausgestatteter K&uuml;che","chalet5.outdoor":"Terrasse, Garderobe, eigener Abstellraum / Skiraum und Br&ouml;tchenservice; zwei gekoppelte Chalets bis 20 Personen","common.sleeping":"Schlafen","common.bathrooms":"Bad & Wellness","common.living":"Wohnen","common.outdoor":"Au&szlig;en & praktisch","common.guests12":"Bis 12 Personen","common.guests10":"Bis 10 Personen","common.noBunks":"Keine Stockbetten","common.connected":"Gekoppelt bis 20 Personen","common.sauna":"Private Sauna","common.fireplace":"Kamin","common.kitchen":"Eigene K&uuml;che","common.terrace":"Terrasse","common.groups":"Ideal f&uuml;r Gruppen","common.floorplan":"Grundriss ansehen","common.details":"Alle Details","common.breadService":"Br&ouml;tchenservice","common.skiRoom":"Eigener Skiraum","summer.kicker":"Sommer in Flachau","summer.title":"Berge, Bewegung und viel Zeit drau&szlig;en","summer.text":"Wandern, Radfahren und Familienerlebnisse &ndash; direkt vor der Haust&uuml;r.","summer.status":"Direktbuchung ab September","summer.inquiry":"Sommerurlaub anfragen","summer.cardCta":"Vorteile entdecken","winter.kicker":"Winter in Flachau","winter.title":"Schneetage, Skivergn&uuml;gen und W&auml;rme am Kamin","winter.text":"Kurze Wege ins Skigebiet und ein gem&uuml;tliches Chalet f&uuml;r den Abend.","winter.book":"Winterurlaub buchen","atmosphere.kicker":"Gemeinsam genie&szlig;en","atmosphere.title":"Abende, die nach Holz, W&auml;rme und gutem Essen klingen","atmosphere.text":"Fr&uuml;hst&uuml;ck vor dem ersten Ausflug, gemeinsames Kochen am Abend oder ein Glas Wein am Kamin: Die Chalets sind gemacht f&uuml;r diese leisen, wertvollen Momente, die bleiben.","services.kicker":"Mehr Komfort","services.title":"Praktische Extras f&uuml;r entspannte Urlaubstage","services.lead":"Kleine Dinge machen den Aufenthalt leichter &ndash; vom frischen Fr&uuml;hst&uuml;cksgeb&auml;ck bis zum eigenen Raum f&uuml;r Ski und Ausr&uuml;stung.","services.breadTitle":"Br&ouml;tchenservice","services.breadText":"G&auml;ste k&ouml;nnen t&auml;glich bis 17:00 Uhr Brot und Geb&auml;ck f&uuml;r den n&auml;chsten Morgen bestellen. Die Lieferung erfolgt zwischen 07:30 und 08:00 Uhr direkt vor das Chalet.","services.skiTitle":"Abstellraum / Skiraum","services.skiText":"Jedes Chalet verf&uuml;gt &uuml;ber einen eigenen Abstellraum bzw. Skiraum &ndash; praktisch f&uuml;r Ski, Schuhe, Sportausr&uuml;stung und alles, was nach einem aktiven Tag gut verstaut sein soll.","services.laundryTitle":"W&auml;schek&uuml;che","services.laundryText":"An der Rezeption steht eine W&auml;schek&uuml;che mit Waschmaschine und Trockner zur Verf&uuml;gung.","services.garageTitle":"Tiefgarage","services.garageText":"F&uuml;r eine entspannte Anreise stehen Parkm&ouml;glichkeiten in der Anlage sowie eine Tiefgarage zur Verf&uuml;gung.","services.playgroundTitle":"Spielplatz beim Gutshof","services.playgroundText":"Vor dem Flachauer Gutshof befindet sich ein gro&szlig;er Spielplatz mit verschiedenen Aktivit&auml;ten f&uuml;r Kinder. Von der Restaurantterrasse haben Eltern den Spielbereich direkt im Blick.","services.chargingTitle":"E-Ladestationen in Flachau","services.chargingText":"In Flachau befinden sich mehrere Ladestationen f&uuml;r Elektroautos, unter anderem an der Reitdorfer Stra&szlig;e, Wagrainer Stra&szlig;e, Flachauer Stra&szlig;e und Unterberggasse.","restaurant.kicker":"Unser Restaurant","restaurant.title":"Flachauer Gutshof &ndash; essen, tanzen, feiern","restaurant.text":"Direkt in Flachau erwartet Sie der Flachauer Gutshof mit regionalen und internationalen Spezialit&auml;ten, urigen R&auml;umlichkeiten im Altholz-Stil, gro&szlig;er Terrasse und Spielplatz.","restaurant.cta":"Restaurant Website &ouml;ffnen","restaurant.more":"Mehr auf dieser Website","restaurant.fact1Title":"K&uuml;che","restaurant.fact1Text":"Regionale und internationale Spezialit&auml;ten","restaurant.fact2Title":"Atmosph&auml;re","restaurant.fact2Text":"Gutshof Stubn, Musistadl und Heuboden","restaurant.fact3Title":"F&uuml;r Familien","restaurant.fact3Text":"Gro&szlig;e Terrasse und Spielplatz","restaurant.fact4Title":"Adresse Restaurant","restaurant.fact4Text":"Pichlgasse 15, 5542 Flachau","gallery.kicker":"Einblicke","gallery.title":"So f&uuml;hlt sich Urlaub bei uns an","gallery.all":"Alle Bilder ansehen","location.kicker":"Alles in der N&auml;he","location.title":"Mitten in Flachau &ndash; und schnell dort, wo der Urlaub beginnt","location.text":"Der Lageplan zeigt Chalets, Rezeption, Parkfl&auml;chen, den Weg zum Flachauer Gutshof sowie den Fu&szlig;weg zum 8er-Jet. Darunter finden Sie die Google Karte f&uuml;r die Anreise.","location.map":"Lageplan &ouml;ffnen","location.enlarge":"Plan vergr&ouml;&szlig;ern","finalBooking.kicker":"Urlaub buchen","finalBooking.title":"Bereit f&uuml;r Ihren Urlaub in Flachau","finalBooking.text":"W&auml;hlen Sie Ihre Saison und entdecken Sie Ihren Aufenthalt in den Alpenchalets Flachauer Gutshof.","finalBooking.summer":"Sommer anfragen","finalBooking.winter":"Winter buchen","booking.kicker":"Urlaub buchen","booking.title":"Sommer direkt bei uns. Winter ausschlie&szlig;lich &uuml;ber Sunweb.","booking.lead":"Je nach Saison f&uuml;hrt der passende Weg schnell und &uuml;bersichtlich zu Ihrem Aufenthalt.","booking.summerLabel":"Sommerurlaub","booking.summerTitle":"Sommeranfragen direkt bei uns.","booking.summerText":"Sommeraufenthalte k&ouml;nnen k&uuml;nftig direkt &uuml;ber Alpenchalets Flachau gebucht werden. Bis zur Freischaltung nehmen wir Ihre Anfrage gerne per E-Mail entgegen.","booking.summerCta":"Sommer anfragen","booking.winterLabel":"Winterurlaub","booking.winterTitle":"Winterreisen buchen Sie ausschlie&szlig;lich &uuml;ber Sunweb.","booking.winterText":"F&uuml;r die Wintersaison sind Reservierungen ausschlie&szlig;lich &uuml;ber unseren Partner Sunweb m&ouml;glich. Verf&uuml;gbarkeit, Reisedaten und Buchung werden dort vollst&auml;ndig abgewickelt.","booking.winterCta":"Bei Sunweb buchen","contact.kicker":"Bereit f&uuml;r Flachau","contact.title":"Wir freuen uns auf Ihre Anfrage","contact.text":"F&uuml;r Fragen zu den Chalets und Ihrem Aufenthalt erreichen Sie uns telefonisch oder per E-Mail.","contact.phone":"Telefon","contact.book":"Winterurlaub buchen","footer.tagline":"wohlf&uuml;hlen | genie&szlig;en"},"en":{"nav.home":"Home","nav.chalets":"Our chalets","nav.seasons":"Summer & winter","nav.summer":"Summer","nav.winter":"Winter","nav.gallery":"Gallery","nav.location":"Location &amp; Directions","nav.enquiry":"Holiday enquiry","nav.contact":"Contact","nav.comfort":"Comfort","nav.comfort":"Comfort","nav.restaurant":"Restaurant","nav.faq":"FAQ","nav.book":"Book winter","hero.title":"Arrive<br>Feel at home","hero.text":"A place for special holiday moments.","hero.summerBook":"Enquire for Summer","hero.winterBook":"Book Winter","hero.bookingNote":"Summer enquiries directly with us. Winter bookings are available exclusively through Sunweb.","intro.kicker":"Welcome to Alpenchalets","intro.title":"Wood, warmth and plenty of space for time together","intro.text":"Our cozy chalets with sauna, fireplace and fully equipped kitchen offer the ideal place for relaxed days in Flachau.","intro.f1":"Private sauna","intro.f2":"Cozy fireplace","intro.f3":"Central location","chalets.kicker":"Our accommodation","chalets.title":"Private chalets for unforgettable holidays","chalets.lead":"Two chalet types, private spaces to retreat and a warm home for both small and larger groups.","chalet4.kicker":"For up to 12 guests","chalet4.title":"4-room chalet","chalet4.text":"A generous two-level chalet with plenty of room for shared evenings, privacy and relaxed holiday days.","chalet4.sleeping":"3 bedrooms: 2x double bed with bunk bed, 1x double bed, plus a sofa bed for 2 guests","chalet4.bathrooms":"3 bathrooms, private sauna and a separate WC","chalet4.living":"Large living and dining area with fireplace and fully equipped kitchen","chalet4.outdoor":"Terrace, cloakroom, private storage / ski room and bread roll service on request","chalet5.kicker":"For up to 10 guests","chalet5.title":"5-room chalet","chalet5.text":"A calm, comfortable chalet with four separate bedrooms, a private sauna and a grown-up living feel.","chalet5.sleeping":"4 separate bedrooms plus a sofa bed for 2 guests &ndash; no bunk beds","chalet5.bathrooms":"2 bathrooms, private sauna and 2 separate WCs","chalet5.living":"Cozy living and dining area with fireplace and fully equipped kitchen","chalet5.outdoor":"Terrace, cloakroom, private storage / ski room and bread roll service; two connected chalets for up to 20 guests","common.sleeping":"Sleeping","common.bathrooms":"Bath & wellness","common.living":"Living","common.outdoor":"Outdoor & practical","common.guests12":"Up to 12 guests","common.guests10":"Up to 10 guests","common.noBunks":"No bunk beds","common.connected":"Connected for up to 20","common.sauna":"Private sauna","common.fireplace":"Fireplace","common.kitchen":"Private kitchen","common.terrace":"Terrace","common.groups":"Ideal for groups","common.floorplan":"View floor plan","common.details":"View all details","common.breadService":"Bread roll service","common.skiRoom":"Private ski room","summer.kicker":"Summer in Flachau","summer.title":"Mountains, movement and plenty of time outdoors","summer.text":"Hiking, cycling and family adventures &ndash; right outside your door.","summer.status":"Direct booking from September","summer.inquiry":"Enquire about summer","summer.cardCta":"Discover the benefits","winter.kicker":"Winter in Flachau","winter.title":"Snowy days, skiing and warmth by the fire","winter.text":"Short distances to the ski area and a cozy chalet to return to in the evening.","winter.book":"Book your winter stay","atmosphere.kicker":"Enjoy together","atmosphere.title":"Evenings that feel like wood, warmth and good food","atmosphere.text":"Breakfast before the first adventure, cooking together in the evening or a glass of wine by the fire: the chalets are made for these quiet, valuable moments that stay with you.","services.kicker":"More comfort","services.title":"Practical extras for relaxed holiday days","services.lead":"Small details make the stay easier &ndash; from fresh breakfast rolls to your own room for skis and equipment.","services.breadTitle":"Bread roll service","services.breadText":"Guests can order bread and pastries for the next morning every day until 17:00. Delivery is made between 07:30 and 08:00 directly in front of the chalet.","services.skiTitle":"Storage / ski room","services.skiText":"Each chalet has its own storage or ski room &ndash; practical for skis, boots, sports equipment and everything that should be neatly stored after an active day.","services.laundryTitle":"Laundry room","services.laundryText":"A laundry room with washing machine and dryer is available at reception.","services.garageTitle":"Underground garage","services.garageText":"Parking spaces in the resort and an underground garage make arrival comfortable.","services.playgroundTitle":"Playground by the Gutshof","services.playgroundText":"A large playground with varied activities for children is located in front of Flachauer Gutshof. Parents have a direct view of the play area from the restaurant terrace.","services.chargingTitle":"EV charging in Flachau","services.chargingText":"Several electric car charging stations are located in Flachau, including Reitdorfer Strasse, Wagrainer Strasse, Flachauer Strasse and Unterberggasse.","restaurant.kicker":"Our restaurant","restaurant.title":"Flachauer Gutshof &ndash; eat, dance, celebrate","restaurant.text":"In Flachau, the Flachauer Gutshof welcomes you with regional and international specialties, rustic rooms in reclaimed-wood style, a large terrace and a playground.","restaurant.cta":"Open restaurant website","restaurant.more":"More on this website","restaurant.fact1Title":"Cuisine","restaurant.fact1Text":"Regional and international specialties","restaurant.fact2Title":"Atmosphere","restaurant.fact2Text":"Gutshof Stubn, Musistadl and Heuboden","restaurant.fact3Title":"For families","restaurant.fact3Text":"Large terrace and playground","restaurant.fact4Title":"Restaurant address","restaurant.fact4Text":"Pichlgasse 15, 5542 Flachau","gallery.kicker":"A glimpse inside","gallery.title":"This is what a holiday with us feels like","gallery.all":"View all photos","location.kicker":"Everything nearby","location.title":"In the heart of Flachau &ndash; close to everything your holiday needs","location.text":"The site map shows the chalets, reception, parking, the route to Flachauer Gutshof and the footpath to the 8er-Jet lift. Below you will find the Google map for arrival.","location.map":"Open site map","location.enlarge":"Enlarge map","finalBooking.kicker":"Book your holiday","finalBooking.title":"Ready for your holiday in Flachau","finalBooking.text":"Choose your preferred season and enjoy your stay at Alpenchalets Flachauer Gutshof.","finalBooking.summer":"Enquire for Summer","finalBooking.winter":"Book Winter","booking.kicker":"Book your holiday","booking.title":"Summer directly with us. Winter exclusively through Sunweb.","booking.lead":"The booking route is clear and simple for each season.","booking.summerLabel":"Summer holiday","booking.summerTitle":"Summer enquiries directly with us.","booking.summerText":"Summer stays will soon be bookable directly with Alpenchalets Flachau. Until booking opens, we are happy to receive your enquiry by email.","booking.summerCta":"Enquire about summer","booking.winterLabel":"Winter holiday","booking.winterTitle":"Book winter stays exclusively through Sunweb.","booking.winterText":"For the winter season, reservations are available exclusively through our partner Sunweb. Availability, travel dates and booking are handled there in full.","booking.winterCta":"Book with Sunweb","contact.kicker":"Ready for Flachau","contact.title":"We look forward to hearing from you","contact.text":"For questions about the chalets and your stay, contact us by phone or email.","contact.phone":"Phone","contact.book":"Book your winter stay","footer.tagline":"feel good | enjoy"},"nl":{"nav.home":"Home","nav.chalets":"Onze chalets","nav.seasons":"Zomer & winter","nav.summer":"Zomer","nav.winter":"Winter","nav.gallery":"Galerij","nav.location":"Ligging &amp; Route","nav.enquiry":"Vakantieaanvraag","nav.contact":"Contact","nav.comfort":"Comfort","nav.comfort":"Comfort","nav.restaurant":"Restaurant","nav.faq":"FAQ","nav.book":"Winter boeken","hero.title":"Aankomen<br>Genieten","hero.text":"Een plek voor bijzondere vakantiemomenten.","hero.summerBook":"Zomer aanvragen","hero.winterBook":"Winter boeken","hero.bookingNote":"Zomeraanvragen direct bij ons. Winterboekingen zijn uitsluitend mogelijk via Sunweb.","intro.kicker":"Welkom bij Alpenchalets","intro.title":"Hout, warmte en veel ruimte voor tijd samen","intro.text":"Onze gezellige chalets met sauna, open haard en volledig uitgeruste keuken bieden de ideale plek voor ontspannen dagen in Flachau.","intro.f1":"Prive sauna","intro.f2":"Gezellige open haard","intro.f3":"Centrale ligging","chalets.kicker":"Onze accommodaties","chalets.title":"Private chalets voor onvergetelijke vakantiedagen","chalets.lead":"Twee chalettypes, private plekken om u terug te trekken en een warm vakantiehuis voor kleine en grotere groepen.","chalet4.kicker":"Voor maximaal 12 personen","chalet4.title":"4-kamerchalet","chalet4.text":"Een ruim chalet op twee verdiepingen met veel plaats voor avonden samen, rust en ontspannen vakantiedagen.","chalet4.sleeping":"3 slaapkamers: 2x tweepersoonsbed met stapelbed, 1x tweepersoonsbed en een slaapbank voor 2 personen","chalet4.bathrooms":"3 badkamers, prive sauna en een apart toilet","chalet4.living":"Grote woon- en eetruimte met open haard en volledig uitgeruste keuken","chalet4.outdoor":"Terras, garderobe, eigen berging / skiruimte en broodjesservice op aanvraag","chalet5.kicker":"Voor maximaal 10 personen","chalet5.title":"5-kamerchalet","chalet5.text":"Een rustig, comfortabel chalet met vier aparte slaapkamers, prive sauna en een volwassen woongevoel.","chalet5.sleeping":"4 aparte slaapkamers en een slaapbank voor 2 personen &ndash; geen stapelbedden","chalet5.bathrooms":"2 badkamers, prive sauna en 2 aparte toiletten","chalet5.living":"Gezellige woon- en eetruimte met open haard en volledig uitgeruste keuken","chalet5.outdoor":"Terras, garderobe, eigen berging / skiruimte en broodjesservice; twee gekoppelde chalets voor maximaal 20 personen","common.sleeping":"Slapen","common.bathrooms":"Bad & wellness","common.living":"Wonen","common.outdoor":"Buiten & praktisch","common.guests12":"Maximaal 12 personen","common.guests10":"Maximaal 10 personen","common.noBunks":"Geen stapelbedden","common.connected":"Gekoppeld tot 20 personen","common.sauna":"Prive sauna","common.fireplace":"Open haard","common.kitchen":"Eigen keuken","common.terrace":"Terras","common.groups":"Ideaal voor groepen","common.floorplan":"Plattegrond bekijken","common.details":"Alle details","common.breadService":"Broodjesservice","common.skiRoom":"Eigen skiruimte","summer.kicker":"Zomer in Flachau","summer.title":"Bergen, beweging en volop tijd buiten","summer.text":"Wandelen, fietsen en familie-avonturen &ndash; direct voor de deur.","summer.status":"Direct boeken vanaf september","summer.inquiry":"Zomerverblijf aanvragen","summer.cardCta":"Ontdek de voordelen","winter.kicker":"Winter in Flachau","winter.title":"Sneeuwdagen, skiplezier en warmte bij de haard","winter.text":"Dicht bij het skigebied en een gezellig chalet om s avonds thuis te komen.","winter.book":"Boek uw winterverblijf","atmosphere.kicker":"Samen genieten","atmosphere.title":"Avonden die voelen als hout, warmte en lekker eten","atmosphere.text":"Ontbijt voor het eerste avontuur, samen koken in de avond of een glas wijn bij de haard: de chalets zijn gemaakt voor deze stille, waardevolle momenten die bijblijven.","services.kicker":"Meer comfort","services.title":"Praktische extras voor ontspannen vakantiedagen","services.lead":"Kleine dingen maken het verblijf makkelijker &ndash; van verse broodjes tot een eigen ruimte voor skis en uitrusting.","services.breadTitle":"Broodjesservice","services.breadText":"Gasten kunnen dagelijks tot 17:00 uur brood en gebak voor de volgende ochtend bestellen. De levering gebeurt tussen 07:30 en 08:00 uur direct voor het chalet.","services.skiTitle":"Berging / skiruimte","services.skiText":"Elk chalet heeft een eigen berging of skiruimte &ndash; praktisch voor skis, schoenen, sportuitrusting en alles wat na een actieve dag netjes opgeborgen moet worden.","services.laundryTitle":"Wasruimte","services.laundryText":"Bij de receptie is een wasruimte met wasmachine en droger beschikbaar.","services.garageTitle":"Ondergrondse garage","services.garageText":"Parkeerplaatsen in het resort en een ondergrondse garage maken aankomen ontspannen.","services.playgroundTitle":"Speeltuin bij de Gutshof","services.playgroundText":"Voor de Flachauer Gutshof ligt een grote speeltuin met verschillende activiteiten voor kinderen. Vanaf het restaurantterras hebben ouders direct zicht op de speelruimte.","services.chargingTitle":"Laadstations in Flachau","services.chargingText":"In Flachau zijn meerdere laadstations voor elektrische autos, onder andere aan de Reitdorfer Strasse, Wagrainer Strasse, Flachauer Strasse en Unterberggasse.","restaurant.kicker":"Ons restaurant","restaurant.title":"Flachauer Gutshof &ndash; eten, dansen, vieren","restaurant.text":"In Flachau verwelkomt de Flachauer Gutshof u met regionale en internationale specialiteiten, gezellige ruimtes in oud-houtstijl, een groot terras en een speeltuin.","restaurant.cta":"Open restaurantwebsite","restaurant.more":"Meer op deze website","restaurant.fact1Title":"Keuken","restaurant.fact1Text":"Regionale en internationale specialiteiten","restaurant.fact2Title":"Sfeer","restaurant.fact2Text":"Gutshof Stubn, Musistadl en Heuboden","restaurant.fact3Title":"Voor families","restaurant.fact3Text":"Groot terras en speeltuin","restaurant.fact4Title":"Adres restaurant","restaurant.fact4Text":"Pichlgasse 15, 5542 Flachau","gallery.kicker":"Een kijkje binnen","gallery.title":"Zo voelt een vakantie bij ons","gallery.all":"Alle fotos bekijken","location.kicker":"Alles dichtbij","location.title":"Midden in Flachau &ndash; dicht bij alles wat uw vakantie nodig heeft","location.text":"De plattegrond toont de chalets, receptie, parkeerplaatsen, de route naar Flachauer Gutshof en het wandelpad naar de 8er-Jet. Hieronder vindt u de Google-kaart voor de aankomst.","location.map":"Plattegrond openen","location.enlarge":"Vergroot de kaart","finalBooking.kicker":"Vakantie boeken","finalBooking.title":"Klaar voor uw vakantie in Flachau","finalBooking.text":"Kies uw seizoen en geniet van uw verblijf in Alpenchalets Flachauer Gutshof.","finalBooking.summer":"Zomer aanvragen","finalBooking.winter":"Winter boeken","booking.kicker":"Vakantie boeken","booking.title":"Zomer rechtstreeks bij ons. Winter uitsluitend via Sunweb.","booking.lead":"Voor elk seizoen is de boekingsroute duidelijk en eenvoudig.","booking.summerLabel":"Zomervakantie","booking.summerTitle":"Zomeraanvragen direct bij ons.","booking.summerText":"Zomerverblijven zijn binnenkort rechtstreeks bij Alpenchalets Flachau te boeken. Tot de boeking opent, ontvangen wij uw aanvraag graag per e-mail.","booking.summerCta":"Zomer aanvragen","booking.winterLabel":"Wintervakantie","booking.winterTitle":"Boek winterverblijven uitsluitend via Sunweb.","booking.winterText":"Voor het winterseizoen zijn reserveringen uitsluitend mogelijk via onze partner Sunweb. Beschikbaarheid, reisdata en boeking worden daar volledig afgehandeld.","booking.winterCta":"Boek bij Sunweb","contact.kicker":"Klaar voor Flachau","contact.title":"We horen graag van u","contact.text":"Voor vragen over de chalets en uw verblijf kunt u ons telefonisch of per e-mail bereiken.","contact.phone":"Telefoon","contact.book":"Boek uw winterverblijf","footer.tagline":"ontspannen | genieten"}};
translations.de['hero.title']='Wohlf&uuml;hlen<br>Genie&szlig;en';
translations.en['hero.title']='Feel good<br>Enjoy';
translations.nl['hero.title']='Ontspannen<br>Genieten';
translations.de['intro.title']='Natur, Komfort und unvergessliche Momente';
translations.en['intro.title']='Nature, comfort and unforgettable moments';
translations.nl['intro.title']='Natuur, comfort en onvergetelijke momenten';
// Accommodation facts: there is no separate cloakroom, only wardrobes and shelves.
translations.de['chalet4.outdoor']='Terrasse, Schränke und Regale, eigener Abstellraum / Skiraum und Brötchenservice auf Wunsch';
translations.de['chalet5.outdoor']='Terrasse, Schränke und Regale, eigener Abstellraum / Skiraum und Brötchenservice; zwei gekoppelte Chalets bis 20 Personen';
translations.en['chalet4.outdoor']='Terrace, wardrobes and shelves, private storage / ski room and bread roll service on request';
translations.en['chalet5.outdoor']='Terrace, wardrobes and shelves, private storage / ski room and bread roll service; two connected chalets for up to 20 guests';
translations.nl['chalet4.outdoor']='Terras, kasten en planken, eigen berging / skiruimte en broodjesservice op aanvraag';
translations.nl['chalet5.outdoor']='Terras, kasten en planken, eigen berging / skiruimte en broodjesservice; twee gekoppelde chalets voor maximaal 20 personen';
translations.de['common.kitchen']='Eigene Küche · Filterkaffeemaschine';
translations.en['common.kitchen']='Private kitchen · filter coffee maker';
translations.nl['common.kitchen']='Eigen keuken · filterkoffiezetapparaat';
translations.de['chalet4.living']='Großer Wohn- und Essbereich mit Kamin, voll ausgestatteter Küche und Filterkaffeemaschine';
translations.de['chalet5.living']='Gemütlicher Wohn- und Essbereich mit Kamin, voll ausgestatteter Küche und Filterkaffeemaschine';
translations.en['chalet4.living']='Large living and dining area with fireplace, fully equipped kitchen and filter coffee maker';
translations.en['chalet5.living']='Cozy living and dining area with fireplace, fully equipped kitchen and filter coffee maker';
translations.nl['chalet4.living']='Grote woon- en eetruimte met open haard, volledig uitgeruste keuken en filterkoffiezetapparaat';
translations.nl['chalet5.living']='Gezellige woon- en eetruimte met open haard, volledig uitgeruste keuken en filterkoffiezetapparaat';
translations.de['atmosphere.title']='Gemeinsame Zeit, die in Erinnerung bleibt';
translations.de['atmosphere.text']='Fr&uuml;hst&uuml;ck vor dem ersten Ausflug, gemeinsames Kochen am Abend oder ein Glas Wein am Kamin: Die Chalets sind gemacht f&uuml;r entspannte Momente mit Familie und Freunden.';
translations.en['atmosphere.title']='Time together that stays with you';
translations.en['atmosphere.text']='Breakfast before the first outing, cooking together in the evening or a glass of wine by the fire: the chalets are made for relaxed moments with family and friends.';
translations.nl['atmosphere.title']='Samen genieten van momenten die bijblijven';
translations.nl['atmosphere.text']='Ontbijt voor het eerste uitstapje, samen koken in de avond of een glas wijn bij de open haard: de chalets zijn gemaakt voor ontspannen momenten met familie en vrienden.';
const header=document.getElementById('siteHeader');
const backToHero=document.querySelector('.back-to-hero');
const menuToggle=document.getElementById('menuToggle');
const nav=document.getElementById('mainNav');
const langButtons=document.querySelectorAll('.lang-btn');
const languageStorageKey='alpenchalets-language';
function readSavedLanguage(){
  try{const value=localStorage.getItem(languageStorageKey);if(value)return value}catch{}
  const match=document.cookie.match(/(?:^|;\s*)alpenchalets-language=(de|en|nl)(?:;|$)/);
  return match?match[1]:'de';
}
function saveLanguage(value){
  try{localStorage.setItem(languageStorageKey,value)}catch{}
  try{document.cookie=`alpenchalets-language=${value};path=/;max-age=31536000;SameSite=Lax`}catch{}
}
const slides=[...document.querySelectorAll('.hero-slide')];
const slideNumber=document.getElementById('slideNumber');
let slideIndex=0;
function updateHeader(){const scrolled=window.scrollY>30;header.classList.toggle('scrolled',scrolled)}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const mobileBackToTop=document.createElement('a');
mobileBackToTop.className='mobile-back-to-top';
mobileBackToTop.href='#';
mobileBackToTop.innerHTML='&#8593;';
mobileBackToTop.dataset.ariaDe='Zurück nach oben';
mobileBackToTop.dataset.ariaEn='Back to top';
mobileBackToTop.dataset.ariaNl='Terug naar boven';
mobileBackToTop.setAttribute('aria-label',{de:'Zurück nach oben',en:'Back to top',nl:'Terug naar boven'}[document.documentElement.lang]||'Zurück nach oben');
document.body.append(mobileBackToTop);
let backToTopIdleTimer;
function updateMobileBackToTop(){
  const onScrollingHome=!document.body.classList.contains('section-view')&&window.scrollY>24;
  const showHomeArrow=onScrollingHome;
  const showMobileArrow=(backToHero?onScrollingHome:window.scrollY>450)&&document.documentElement.scrollHeight>innerHeight*1.35;
  backToHero.classList.toggle('is-visible',showHomeArrow);
  mobileBackToTop.classList.toggle('is-visible',showMobileArrow);
  document.body.classList.toggle('mobile-back-active',showMobileArrow);
  clearTimeout(backToTopIdleTimer);
  if(showHomeArrow||showMobileArrow)backToTopIdleTimer=setTimeout(()=>{
    backToHero.classList.remove('is-visible');
    mobileBackToTop.classList.remove('is-visible');
    document.body.classList.remove('mobile-back-active');
  },700);
}
window.addEventListener('scroll',updateMobileBackToTop,{passive:true});
mobileBackToTop.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});
menuToggle.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menuToggle.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false')}));
let heroTimer;
function heroViennaTime(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vienna',month:'numeric',hour:'numeric',hourCycle:'h23'}).formatToParts(new Date());
  const read=type=>Number(parts.find(part=>part.type===type)?.value||0);
  return{month:read('month'),hour:read('hour')};
}
function updateHeroImages(){
  const mobile=innerWidth<=700;
  slides.forEach(slide=>{
    const source=mobile?slide.dataset.mobile:slide.dataset.desktop;
    if(source)slide.style.backgroundImage=`url("${source}")`;
  });
}
function showTimedHero(){
  if(!slides.length)return;
  const preview=new URLSearchParams(location.search);
  const vienna=heroViennaTime();
  const forcedSeason=preview.get('season');
  const winter=forcedSeason==='winter'||(forcedSeason!=='summer'&&(vienna.month>=11||vienna.month<=4));
  const period=winter?'winter':'day';
  updateHeroImages();
  let next=slides.findIndex(slide=>slide.dataset.period===period);
  if(next<0)next=0;
  slides.forEach((slide,index)=>slide.classList.toggle('active',index===next));
  document.documentElement.dataset.heroPeriod=period;
  slideIndex=next;
  if(slideNumber)slideNumber.textContent=period.toUpperCase();
}
function startHero(){clearInterval(heroTimer);showTimedHero();heroTimer=setInterval(showTimedHero,60000)}
startHero();
window.addEventListener('resize',updateHeroImages,{passive:true});
function translatedDataset(e,active,prefix=''){return e.dataset[prefix+active.charAt(0).toUpperCase()+active.slice(1)]||e.dataset[prefix+'De']}function setTranslatedContent(e,val){const field=e.querySelector('input,select,textarea');if(e.tagName==='LABEL'&&field){let node=[...e.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(!node){node=document.createTextNode('');e.insertBefore(node,field)}node.textContent=val;return}e.innerHTML=val}function translateAttributes(active){document.querySelectorAll('[data-aria-de]').forEach(e=>e.setAttribute('aria-label',translatedDataset(e,active,'aria')));document.querySelectorAll('[data-alt-de]').forEach(e=>e.setAttribute('alt',translatedDataset(e,active,'alt')));document.querySelectorAll('[data-title-de]').forEach(e=>e.setAttribute('title',translatedDataset(e,active,'title')));document.querySelectorAll('[data-placeholder-de]').forEach(e=>e.setAttribute('placeholder',translatedDataset(e,active,'placeholder')));document.querySelectorAll('[data-value-de]').forEach(e=>e.setAttribute('value',translatedDataset(e,active,'value')));document.querySelectorAll('[data-content-de]').forEach(e=>e.setAttribute('content',translatedDataset(e,active,'content')));const title=document.querySelector('[data-page-title-de]');if(title)document.title=translatedDataset(title,active,'pageTitle')}function setLanguage(lang){const active=translations[lang]?lang:"de";document.documentElement.lang=active;document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;const val=translations[active][key]??translations.de[key];if(val!==undefined)el.innerHTML=val});document.querySelectorAll('[data-de]').forEach(el=>setTranslatedContent(el,el.dataset[active]||el.dataset.de));translateAttributes(active);langButtons.forEach(b=>b.classList.toggle('active',b.dataset.lang===active));saveLanguage(active)}
langButtons.forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
setLanguage(readSavedLanguage());
window.addEventListener('storage',event=>{if(event.key===languageStorageKey&&translations[event.newValue])setLanguage(event.newValue)});
const modal=document.getElementById('imageModal'),modalImage=document.getElementById('modalImage'),modalTitle=document.getElementById('modalTitle');
const modalGalleryItems=[...document.querySelectorAll('.gallery-item')];
let modalGalleryIndex=-1;
const modalPrev=document.createElement('button'),modalNext=document.createElement('button');
modalPrev.type=modalNext.type='button';
modalPrev.className='modal-nav modal-prev';modalNext.className='modal-nav modal-next';
modalPrev.innerHTML='&#10094;';modalNext.innerHTML='&#10095;';
modalPrev.setAttribute('aria-label','Previous image');modalNext.setAttribute('aria-label','Next image');
modal.append(modalPrev,modalNext);
function showModalGalleryImage(index){
  modalGalleryIndex=(index+modalGalleryItems.length)%modalGalleryItems.length;
  const item=modalGalleryItems[modalGalleryIndex];
  modalImage.src=item.dataset.src;
  modalImage.alt=item.querySelector('img')?.alt||'';
}
function openModal(src,title='',rotate=false){
  modal.classList.toggle('is-map-plan',rotate);
  modalGalleryIndex=rotate?-1:modalGalleryItems.findIndex(item=>item.dataset.src===src);
  if(modalGalleryIndex>=0)showModalGalleryImage(modalGalleryIndex);else modalImage.src=src;
  modal.classList.toggle('has-gallery-nav',modalGalleryIndex>=0&&modalGalleryItems.length>1);
  modalTitle.hidden=true;modalTitle.textContent='';
  modal.showModal();
}
modalGalleryItems.forEach((b,index)=>b.addEventListener('click',()=>{modalGalleryIndex=index;openModal(b.dataset.src)}));
modalPrev.addEventListener('click',()=>showModalGalleryImage(modalGalleryIndex-1));
modalNext.addEventListener('click',()=>showModalGalleryImage(modalGalleryIndex+1));
document.querySelectorAll('.open-floorplan').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.image,b.dataset.title,b.dataset.rotate==='right')));
document.getElementById('openGallery')?.addEventListener('click',()=>openModal('assets/images/exterior-wide.webp','Flachauer Alpenchalets'));
modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});modal.addEventListener('close',()=>{modal.classList.remove('is-map-plan','has-gallery-nav')});
document.addEventListener('keydown',e=>{if(!modal.open)return;if(e.key==='Escape')modal.close();if(e.key==='ArrowLeft'&&modalGalleryIndex>=0)showModalGalleryImage(modalGalleryIndex-1);if(e.key==='ArrowRight'&&modalGalleryIndex>=0)showModalGalleryImage(modalGalleryIndex+1)});
document.getElementById('year').textContent=new Date().getFullYear();

const butlerWidget=document.getElementById('butlerWidget');
const butlerToggle=document.getElementById('butlerToggle');
const butlerPrivacyClose=document.getElementById('butlerPrivacyClose');
const butlerForm=document.getElementById('butlerForm');
const butlerInput=document.getElementById('butlerInput');
const butlerMessages=document.getElementById('butlerMessages');
function updateButlerToggleLabel(){
  if(!butlerToggle||!butlerWidget)return;
  const lang=(document.documentElement.lang in conciergeAnswers)?document.documentElement.lang:'de';
  const labels={
    de:butlerWidget.classList.contains('is-open')?'Virtuelle Rezeption schließen':'Virtuelle Rezeption öffnen',
    en:butlerWidget.classList.contains('is-open')?'Close Virtual Reception':'Open Virtual Reception',
    nl:butlerWidget.classList.contains('is-open')?'Virtuele receptie sluiten':'Virtuele receptie openen'
  };
  butlerToggle.setAttribute('aria-label',labels[lang].replace(/&ouml;/g,'ö').replace(/&szlig;/g,'ß'));
}
butlerToggle.addEventListener('click',()=>{butlerWidget.classList.toggle('is-open');updateButlerToggleLabel()});
butlerPrivacyClose.addEventListener('click',()=>butlerWidget.classList.add('privacy-hidden'));
function syncButlerVisibility(){
  if(!butlerWidget)return;
  const heroIsActive=!document.body.classList.contains('section-view')&&window.scrollY<24;
  butlerWidget.classList.toggle('is-hidden',!heroIsActive);
  if(!heroIsActive&&butlerWidget.classList.contains('is-open')){
    butlerWidget.classList.remove('is-open');
    updateButlerToggleLabel();
  }
}
window.addEventListener('scroll',syncButlerVisibility,{passive:true});
const conciergeAnswers={
  de:{
    greeting:'Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?',
    smalltalk:'Hallo! Danke, mir geht es gut. Ich hoffe, Ihnen auch. Wie kann ich Ihnen bei Ihrem Aufenthalt in den Alpenchalets helfen?',
    help:'Gern. Fragen Sie mich zum Beispiel nach Check-in, Check-out, Sauna, Parken, Brötchenservice, Restaurant, Lage, Sommer Card, Winterbuchung, WLAN, Haustieren oder Kontakt.',
    thanks:'Sehr gern. Wenn noch etwas offen ist, bin ich hier.',
    bye:'Sehr gern. Wir wünschen Ihnen schon jetzt eine schöne Zeit in Flachau.',
    checkin:'Der Check-in ist an der Rezeption täglich von 08:00 bis 12:00 Uhr und von 15:00 bis 20:00 Uhr möglich. Bei Anreise nach 20:00 Uhr bitte bis spätestens 18:00 Uhr kurz Bescheid geben.',
    checkout:'Eine genaue Check-out-Zeit ist auf der Website nicht separat angegeben. Am besten kurz bei der Rezeption bestätigen lassen: +43 6457 33971 oder info@alpenchalets.at.',
    parking:'Parkmöglichkeiten befinden sich direkt in der Anlage. Zusätzlich steht eine Tiefgarage zur Verfügung.',
    sauna:'Ja, jedes Chalet verfügt über eine private Sauna. Das 4-Zimmer-Chalet hat 3 Badezimmer und ein separates WC. Das 5-Zimmer-Chalet hat 2 Badezimmer und 2 separate WCs.',
    restaurant:'Der Flachauer Gutshof liegt direkt beim Chaletdorf. Für Öffnungszeiten, Veranstaltungen und Reservierungen bitte die Restaurant-Website öffnen.',
    location:'Die Alpenchalets liegen zentral in Flachau am Grießenkarweg 417. Der Lageplan zeigt Rezeption, Parkflächen, den Weg zum Gutshof und den Fußweg zum 8er-Jet.',
    summerCard:'Die Flachau Sommer Card ist bei Ihrem Sommeraufenthalt inklusive. Ihre digitale Karte erhalten Sie nach dem Check-in.',
    winter:'Winteraufenthalte werden ausschließlich über Sunweb gebucht. Den passenden Winter-Button finden Sie im Hero und unten im Buchungsbereich.',
    booking:'Für die Buchung wählen Sie einfach die passende Saison: Sommer buchen oder Winter buchen. Sommer läuft über die Alpenchalets, Winter über Sunweb.',
    bread:'Der Brötchenservice kann täglich bis 17:00 Uhr für den nächsten Morgen bestellt werden. Die Lieferung erfolgt zwischen 07:30 und 08:00 Uhr direkt vor das Chalet.',
    laundry:'An der Rezeption steht eine Wäscheküche mit Waschmaschine und Trockner zur Verfügung.',
    wifi:'Informationen zu WLAN-Zugangsdaten erhalten Sie am besten direkt bei der Anreise an der Rezeption.',
    pets:'Zu Haustieren finde ich auf der Website keine verbindliche Angabe. Bitte fragen Sie vor der Buchung kurz bei der Rezeption nach: +43 6457 33971 oder info@alpenchalets.at.',
    price:'Preise und Verfügbarkeiten hängen von Saison, Chaletgröße und Reisedatum ab. Bitte nutzen Sie die Sommer- oder Winterbuchung oder kontaktieren Sie die Rezeption.',
    playground:'Für Kinder gibt es Spielbereiche und viel Platz rund um das Chaletdorf. Details dazu finden Sie im Komfort-Bereich der Website.',
    contact:'Sie erreichen die Alpenchalets telefonisch unter +43 6457 33971 oder per E-Mail an info@alpenchalets.at.',
    fallback:'Entschuldigung, ich habe Ihre Frage noch nicht ganz verstanden. Formulieren Sie sie gern noch einmal kurz – ich helfe Ihnen zum Beispiel bei Fragen zu Check-in, Sauna, Parken, Restaurant, Sommer Card oder Buchung.'
  },
  en:{
    greeting:'Hello and welcome! How can I help you?',
    smalltalk:'Hello! I am doing well, thank you. I hope you are too. How can I help with your stay at the Alpenchalets?',
    help:'Of course. You can ask me about check-in, check-out, sauna, parking, bread service, restaurant, location, Summer Card, winter booking, Wi-Fi, pets or contact details.',
    thanks:'You are very welcome. I am here if anything else comes up.',
    bye:'You are very welcome. We already wish you a wonderful time in Flachau.',
    checkin:'Check-in is available at reception daily from 08:00 to 12:00 and from 15:00 to 20:00. For arrivals after 20:00, please let us know by 18:00 at the latest.',
    checkout:'The website does not list a separate exact check-out time. Please confirm directly with reception: +43 6457 33971 or info@alpenchalets.at.',
    parking:'Parking is available within the resort. An underground garage is also available.',
    sauna:'Yes, every chalet has a private sauna. The 4-room chalet has 3 bathrooms and a separate WC. The 5-room chalet has 2 bathrooms and 2 separate WCs.',
    restaurant:'Flachauer Gutshof is located right by the chalet village. For opening times, events and reservations, please open the restaurant website.',
    location:'The Alpenchalets are centrally located in Flachau at Grießenkarweg 417. The site map shows reception, parking, the route to the Gutshof and the footpath to the 8er-Jet.',
    summerCard:'The Flachau Summer Card is included with your summer stay. You receive your digital card after check-in.',
    winter:'Winter stays are booked exclusively through Sunweb. You will find the winter booking button in the hero and in the final booking section.',
    booking:'To book, simply choose the right season: Book Summer or Book Winter. Summer is booked with Alpenchalets, winter through Sunweb.',
    bread:'Bread rolls can be ordered daily until 17:00 for the next morning. Delivery is between 07:30 and 08:00 directly in front of the chalet.',
    laundry:'A laundry room with washing machine and dryer is available at reception.',
    wifi:'For Wi-Fi access details, please ask reception directly when you arrive.',
    pets:'I cannot find a binding pet policy on the website. Please check with reception before booking: +43 6457 33971 or info@alpenchalets.at.',
    price:'Prices and availability depend on season, chalet size and travel dates. Please use the summer or winter booking option or contact reception.',
    playground:'For children, there are play areas and plenty of space around the chalet village. You will find more details in the comfort section of the website.',
    contact:'You can reach Alpenchalets by phone at +43 6457 33971 or by email at info@alpenchalets.at.',
    fallback:'Sorry, I did not quite understand your question. Please try asking it again briefly – I can help with check-in, sauna, parking, the restaurant, Summer Card or booking.'
  },
  nl:{
    greeting:'Hallo en welkom! Waarmee kan ik u helpen?',
    smalltalk:'Hallo! Met mij gaat het goed, dank u. Ik hoop met u ook. Waarmee kan ik u helpen tijdens uw verblijf in de Alpenchalets?',
    help:'Graag. U kunt mij bijvoorbeeld vragen stellen over inchecken, uitchecken, sauna, parkeren, broodjesservice, restaurant, ligging, Summer Card, winterboeking, wifi, huisdieren of contact.',
    thanks:'Graag gedaan. Als er nog iets is, ben ik hier.',
    bye:'Graag gedaan. Wij wensen u alvast een mooie tijd in Flachau.',
    checkin:'Inchecken kan dagelijks bij de receptie van 08:00 tot 12:00 en van 15:00 tot 20:00. Bij aankomst na 20:00 graag uiterlijk om 18:00 informeren.',
    checkout:'Op de website staat geen aparte exacte uitchecktijd. Bevestig dit het best direct bij de receptie: +43 6457 33971 of info@alpenchalets.at.',
    parking:'Parkeren is mogelijk in het resort. Er is ook een ondergrondse garage beschikbaar.',
    sauna:'Ja, elk chalet heeft een privésauna. Het 4-kamerchalet heeft 3 badkamers en een apart toilet. Het 5-kamerchalet heeft 2 badkamers en 2 aparte toiletten.',
    restaurant:'De Flachauer Gutshof ligt direct bij het chaletpark. Voor openingstijden, evenementen en reserveringen opent u de restaurantwebsite.',
    location:'De Alpenchalets liggen centraal in Flachau aan Grießenkarweg 417. De plattegrond toont receptie, parkeerplaatsen, de route naar de Gutshof en het wandelpad naar de 8er-Jet.',
    summerCard:'De Flachau Summer Card is inbegrepen bij uw zomerverblijf. U ontvangt uw digitale kaart na het inchecken.',
    winter:'Winterverblijven worden uitsluitend via Sunweb geboekt. De winterboekingsknop staat in de hero en onderaan bij boeken.',
    booking:'Voor boeken kiest u eenvoudig het juiste seizoen: Zomer boeken of Winter boeken. Zomer loopt via Alpenchalets, winter via Sunweb.',
    bread:'Broodjes kunnen dagelijks tot 17:00 uur voor de volgende ochtend worden besteld. Levering gebeurt tussen 07:30 en 08:00 direct voor het chalet.',
    laundry:'Bij de receptie is een wasruimte met wasmachine en droger beschikbaar.',
    wifi:'Voor wifi-gegevens vraagt u dit het best direct bij aankomst aan de receptie.',
    pets:'Over huisdieren vind ik op de website geen bindende informatie. Vraag dit voor het boeken even na bij de receptie: +43 6457 33971 of info@alpenchalets.at.',
    price:'Prijzen en beschikbaarheid hangen af van seizoen, chaletgrootte en reisdatum. Gebruik de zomer- of winterboeking of neem contact op met de receptie.',
    playground:'Voor kinderen zijn er speelplekken en veel ruimte rondom het chaletpark. Meer details vindt u in het comfortgedeelte van de website.',
    contact:'U bereikt Alpenchalets telefonisch via +43 6457 33971 of per e-mail via info@alpenchalets.at.',
    fallback:'Sorry, ik heb uw vraag nog niet helemaal begrepen. Stel de vraag gerust nog een keer kort – ik help bijvoorbeeld met inchecken, sauna, parkeren, het restaurant, Summer Card of boeken.'
  }
};
function normalizeConciergeText(message){
  return message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function detectConciergeLanguage(message){
  const text=normalizeConciergeText(message);
  const ui=(document.documentElement.lang in conciergeAnswers)?document.documentElement.lang:'de';
  if(/\b(bread|cards)\b/.test(text))return'en';
  if(/\b(zomer|broodjes|broodjesservice)\b/.test(text))return'nl';
  const scores={de:0,en:0,nl:0};
  const count=(pattern,lang,weight=1)=>{const matches=text.match(pattern);if(matches)scores[lang]+=matches.length*weight};
  count(/\b(hello|hi|hey|bread|rolls?|summer|cards?|what|where|how|when|booking|book|checkout|arrival|available|price|thanks|please)\b/g,'en',2);
  count(/\b(brood|broodjes|zomer|zomerkaart|kaart|hoe|waar|wanneer|boeken|uitchecken|aankomst|beschikbaar|prijzen|bedankt|alstublieft)\b/g,'nl',2);
  count(/\b(servus|brot|brotchen|sommer|karte|wie|was|wo|wann|buchen|abreise|anreise|verfugbar|preise|danke|bitte)\b/g,'de',2);
  count(/\b(the|is|are|can|do|does|my|your|our|with|for)\b/g,'en');
  count(/\b(het|een|zijn|kan|mijn|uw|onze|met|voor)\b/g,'nl');
  count(/\b(der|die|das|ist|sind|kann|mein|ihre|unser|mit|fur)\b/g,'de');
  const best=Math.max(...Object.values(scores));
  if(best===0)return ui;
  const winners=Object.keys(scores).filter(lang=>scores[lang]===best);
  return winners.includes(ui)?ui:winners[0];
}
function pickConciergeAnswer(message){
  const lang=detectConciergeLanguage(message);
  const text=normalizeConciergeText(message);
  const words=text.replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);
  const compact=words.join(' ');
  const a=conciergeAnswers[lang];
  if(/wie geht|wie gehts|how are you|how are things|hoe gaat het|alles goed/.test(text))return a.smalltalk;
  if(words.length<=3&&/^(hallo|hello|hi|hey|servus|gruss gott|guten tag|guten morgen|guten abend|hoi|goedemorgen|goedenavond)$/.test(compact))return a.greeting;
  if(/\b(danke|vielen dank|thanks|thank you|bedankt)\b/.test(text))return a.thanks;
  if(/\b(tschuss|ciao|bye|goodbye|tot ziens)\b/.test(text))return a.bye;
  if(/hilfe|help|was kannst|what can|waarmee|themen|frage|fragen/.test(text))return a.help;
  if(/check.in|anreise|ankunft|incheck|aankomst|arrival/.test(text))return a.checkin;
  if(/check.out|abreise|uitcheck|departure/.test(text))return a.checkout;
  if(/buch|buchen|booking|book |reserve|reservier|reserver|verfugbar|available|beschikbaar/.test(text))return a.booking;
  if(/preis|preise|kosten|price|cost|tarif|tarief|prijs/.test(text))return a.price;
  if(/park|garage|auto|car|parking/.test(text))return a.parking;
  if(/sauna|wellness/.test(text))return a.sauna;
  if(/restaurant|gutshof|essen|dinner|food|eten|reservierung|reservation/.test(text))return a.restaurant;
  if(/lage|adresse|anfahrt|location|address|ligging|waar|where|8er|jet|lift/.test(text))return a.location;
  if(/summer cards?|sommer cards?|sommercards?|sommer karte|sommerkarte|zomer ?kaarten?|zomerkaarten?|cards?/.test(text))return a.summerCard;
  if(/winter|sunweb|ski|schnee|snow|skipiste|piste/.test(text))return a.winter;
  if(/brot|brotchen|brotchenservice|brood|broodjes|broodjesservice|bread|bread rolls?|bread service|breakfast|fruhstuck|ontbijt/.test(text))return a.bread;
  if(/wasch|wasche|laundry|washing|wasmachine|droger|trockner/.test(text))return a.laundry;
  if(/wlan|wi.fi|internet/.test(text))return a.wifi;
  if(/hund|haustier|pet|dog|huisdier|hond/.test(text))return a.pets;
  if(/kind|kinder|spiel|playground|children|speel/.test(text))return a.playground;
  if(/kontakt|telefon|email|e-mail|mail|phone|contact|rezeption|reception|receptie/.test(text))return a.contact;
  return a.fallback;
}
function addConciergeMessage(text,type='bot'){
  if(!butlerMessages)return;
  const bubble=document.createElement('div');
  bubble.className='butler-bubble '+(type==='user'?'is-user':'is-bot');
  bubble.textContent=text;
  butlerMessages.appendChild(bubble);
  butlerMessages.scrollTop=butlerMessages.scrollHeight;
}
butlerForm.addEventListener('submit',e=>{
  e.preventDefault();
  const message=butlerInput.value.trim();
  if(!message)return;
  addConciergeMessage(message,'user');
  butlerInput.value='';
  setTimeout(()=>addConciergeMessage(pickConciergeAnswer(message),'bot'),350);
});


// Brand entrance appears only on a fresh browser entry, not during in-site navigation.
const siteIntro=document.getElementById('siteIntro');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const introKey='alpenchaletsIntroSeenV2';
const forceIntro=new URLSearchParams(location.search).get('intro')==='1';
let introClosing=false;
function closeIntro(immediate=false){
  if(introClosing)return;
  introClosing=true;
  document.body.classList.remove('is-loading');
  document.documentElement.classList.add('intro-seen');
  if(siteIntro){siteIntro.classList.add('is-hidden');setTimeout(()=>siteIntro.remove(),900)}
  if(immediate)document.body.classList.add('hero-ready');
  else setTimeout(()=>document.body.classList.add('hero-ready'),500);
}
function hasSeenIntro(){try{return !forceIntro&&(sessionStorage.getItem(introKey)==='true'||window.name.includes(introKey))}catch{return !forceIntro}}
function markIntroSeen(){try{sessionStorage.setItem(introKey,'true');if(!window.name.includes(introKey))window.name=`${window.name||''} ${introKey}`.trim()}catch{}}
if(forceIntro)document.documentElement.classList.remove('intro-seen');
if(!siteIntro||reduceMotion||hasSeenIntro()){closeIntro(true)}else{markIntroSeen();setTimeout(()=>closeIntro(false),3200)}
updateButlerToggleLabel();






const homeContactForm=document.querySelector('#contactForm');
if(homeContactForm){
  homeContactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(homeContactForm);
    const sub=encodeURIComponent('Anfrage Alpenchalets Flachau - '+(d.get('season')||''));
    const body=encodeURIComponent(
      'Name: '+d.get('name')+'\n'+
      'E-Mail: '+d.get('email')+'\n'+
      'Telefon: '+(d.get('phone')||'')+'\n'+
      'Saison: '+(d.get('season')||'')+'\n'+
      'Zeitraum: '+(d.get('dates')||'')+'\n'+
      'Personen: '+(d.get('guests')||'')+'\n\n'+
      (d.get('message')||'')
    );
    location.href='mailto:info@alpenchalets.at?subject='+sub+'&body='+body;
  });
}

// Home behaves like a set of focused pages: only the selected section is visible.
const homeSections=[...document.querySelectorAll('main > section[id]')];
function showHomeSection(hash=location.hash){
  const id=(hash||'#home').slice(1);
  const target=homeSections.find(section=>section.id===id)||document.getElementById('home');
  if(target?.id==='home'){
    homeSections.forEach(section=>section.classList.remove('active-section'));
    document.body.classList.remove('section-view','menu-open');
    menuToggle?.setAttribute('aria-expanded','false');
    window.scrollTo(0,0);
    syncButlerVisibility();
    return;
  }
  homeSections.forEach(section=>section.classList.toggle('active-section',section===target));
  document.body.classList.add('section-view');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded','false');
  window.scrollTo(0,0);
  syncButlerVisibility();
}
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const hash=link.getAttribute('href');
    if(!document.querySelector(hash))return;
    // The hero cue only moves down within the complete home page. It must not
    // switch to the single-section navigation mode used by the menu tabs.
    if(link.classList.contains('scroll-cue')){
      event.preventDefault();
      homeSections.forEach(section=>section.classList.remove('active-section'));
      document.body.classList.remove('section-view','menu-open');
      menuToggle?.setAttribute('aria-expanded','false');
      history.replaceState(null,'',location.pathname+location.search);
      document.querySelector(hash).scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
      return;
    }
    event.preventDefault();
    history.pushState(null,'',hash);
    showHomeSection(hash);
  });
});
window.addEventListener('popstate',()=>showHomeSection());
showHomeSection();
syncButlerVisibility();

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

function mountNewsletter(){
  const footer=document.querySelector('.site-footer, footer');
  if(!footer||document.querySelector('.newsletter-signup'))return;
  const status=new URLSearchParams(location.search).get('newsletter');
  const block=document.createElement('section');
  block.className='newsletter-signup';block.id='newsletter';
  block.innerHTML=`<div class="newsletter-inner"><div class="newsletter-copy"><p class="newsletter-kicker" data-de="Post aus Flachau" data-en="News from Flachau" data-nl="Nieuws uit Flachau">Post aus Flachau</p><h2 data-de="Alpenmomente im Postfach" data-en="Alpine moments in your inbox" data-nl="Alpenmomenten in uw inbox">Alpenmomente im Postfach</h2><p data-de="Erhalten Sie ausgewählte Neuigkeiten, saisonale Tipps und besondere Angebote der Alpenchalets." data-en="Receive selected news, seasonal tips and special offers from the Alpenchalets." data-nl="Ontvang geselecteerd nieuws, seizoenstips en bijzondere aanbiedingen van de Alpenchalets.">Erhalten Sie ausgewählte Neuigkeiten, saisonale Tipps und besondere Angebote der Alpenchalets.</p></div><form class="newsletter-form" action="newsletter-subscribe.php" method="post"><div class="newsletter-row"><label class="sr-only" for="newsletterEmail" data-de="E-Mail-Adresse" data-en="Email address" data-nl="E-mailadres">E-Mail-Adresse</label><input id="newsletterEmail" type="email" name="email" autocomplete="email" required data-placeholder-de="Ihre E-Mail-Adresse" data-placeholder-en="Your email address" data-placeholder-nl="Uw e-mailadres" placeholder="Ihre E-Mail-Adresse"><button type="submit" data-de="Anmelden" data-en="Subscribe" data-nl="Aanmelden">Anmelden</button></div><label class="newsletter-consent"><input type="checkbox" name="consent" value="yes" required><span data-de="Ich möchte den Newsletter erhalten und akzeptiere die Datenschutzerklärung. Die Abmeldung ist jederzeit möglich." data-en="I would like to receive the newsletter and accept the privacy policy. I can unsubscribe at any time." data-nl="Ik wil de nieuwsbrief ontvangen en accepteer het privacybeleid. Afmelden kan op elk moment.">Ich möchte den Newsletter erhalten und akzeptiere die Datenschutzerklärung. Die Abmeldung ist jederzeit möglich.</span></label><a class="newsletter-privacy" href="datenschutz.html" data-de="Datenschutz ansehen" data-en="View privacy policy" data-nl="Privacybeleid bekijken">Datenschutz ansehen</a><input class="newsletter-trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"></form></div>`;
  if(status){
    const messages={success:{de:'Fast geschafft: Bitte bestätigen Sie die Anmeldung über den Link in Ihrer E-Mail.',en:'Almost done: please confirm your subscription using the link in your email.',nl:'Bijna klaar: bevestig uw aanmelding via de link in uw e-mail.'},invalid:{de:'Bitte geben Sie eine gültige E-Mail-Adresse ein und bestätigen Sie die Einwilligung.',en:'Please enter a valid email address and confirm your consent.',nl:'Vul een geldig e-mailadres in en bevestig uw toestemming.'},unavailable:{de:'Die Newsletter-Anmeldung wird gerade eingerichtet. Bitte versuchen Sie es später erneut.',en:'Newsletter signup is currently being configured. Please try again later.',nl:'De nieuwsbriefaanmelding wordt momenteel ingesteld. Probeer het later opnieuw.'},failed:{de:'Die Anmeldung konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.',en:'Signup could not be completed. Please try again later.',nl:'De aanmelding kon niet worden voltooid. Probeer het later opnieuw.'}};
    const msg=messages[status]||messages.failed,note=document.createElement('p');
    note.className=`newsletter-status ${status==='success'?'is-success':'is-error'}`;note.dataset.de=msg.de;note.dataset.en=msg.en;note.dataset.nl=msg.nl;note.textContent=msg.de;
    block.querySelector('.newsletter-form').prepend(note);
  }
  block.querySelector('.newsletter-form').action=window.acNewsletterEndpoint||'newsletter-subscribe.php';
  if(window.acNewsletterEndpoint)block.querySelector('.newsletter-form').insertAdjacentHTML('beforeend','<input type="hidden" name="action" value="ac_newsletter_subscribe">');
  const details=document.createElement('details');
  details.className='newsletter-details';details.id='newsletter';
  details.innerHTML='<summary data-de="Newsletter" data-en="Newsletter" data-nl="Nieuwsbrief">Newsletter</summary>';
  details.append(block.querySelector('.newsletter-form'));
  details.querySelector('.newsletter-form').insertAdjacentHTML('afterbegin','<div class="newsletter-modal-heading"><h3 data-de="Newsletter anmelden" data-en="Subscribe to our newsletter" data-nl="Aanmelden voor de nieuwsbrief">Newsletter anmelden</h3><p data-de="Neuigkeiten, saisonale Tipps und besondere Angebote direkt per E-Mail." data-en="News, seasonal tips and special offers delivered directly by email." data-nl="Nieuws, seizoenstips en bijzondere aanbiedingen rechtstreeks per e-mail.">Neuigkeiten, saisonale Tipps und besondere Angebote direkt per E-Mail.</p></div>');
  (footer.querySelector('.footer-contact')||footer).append(details);
  details.addEventListener('click',event=>{if(event.target===details)details.open=false});
  document.addEventListener('click',event=>{if(details.open&&!details.querySelector('.newsletter-form').contains(event.target)&&event.target!==details.querySelector('summary'))details.open=false});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')details.open=false});
  if(location.hash==='#newsletter')details.open=true;
  setLanguage(document.documentElement.lang);
}
mountNewsletter();
