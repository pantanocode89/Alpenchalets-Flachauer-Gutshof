/* Generates the editable DE/EN content inventory from the current static pages.
 * Run after deliberately adding a new public content field to HTML. It never
 * touches the protected style or interaction files. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const pages=[
  ['index.html','home','Startseite'],['chalet-4-zimmer.html','chalet-4','4-Zimmer-Chalet'],['chalet-5-zimmer.html','chalet-5','5-Zimmer-Chalet'],
  ['sommer.html','sommer','Sommer'],['winter.html','winter','Winter'],['restaurant.html','restaurant','Restaurant / Flachauer Gutshof'],
  ['lage.html','lage','Lage & Anfahrt'],['galerie.html','galerie','Galerie'],['faq.html','faq','FAQ'],['kontakt.html','kontakt','Kontakt'],
  ['urlaubsanfrage.html','urlaubsanfrage','Urlaubsanfrage'],['impressum.html','impressum','Impressum'],['datenschutz.html','datenschutz','Datenschutz']
];
const esc=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const attr=(s,n)=>{const m=s.match(new RegExp('\\b'+n+'="([^"]*)"'));return m?esc(m[1]):''};
const label=(value,fallback)=>value.replace(/<[^>]+>/g,' ').replace(/&(?:[a-z]+|#\d+);/gi,' ').replace(/\s+/g,' ').trim().slice(0,88)||fallback;
const mediaLabel=(src,index)=>`Bild ${index+1}: ${path.basename(src)}`;
function annotate(source,slug){
  let textIndex=0,mediaIndex=0,urlIndex=0, texts=[],media=[],urls=[];
  let html=source.replace(/<([a-z][\w-]*)([^>]*\bdata-de="[^"]*"[^>]*\bdata-en="[^"]*"[^>]*)>/gi,(full,tag,attrs)=>{
    if(/\bdata-cms-text=/.test(attrs))return full;
    const id=`${slug}-text-${String(++textIndex).padStart(3,'0')}`,de=attr(attrs,'data-de'),en=attr(attrs,'data-en');
    texts.push({id,label:label(de,`Text ${textIndex}`),de,en});return `<${tag}${attrs} data-cms-text="${id}">`;
  });
  html=html.replace(/<img\b([^>]*\bsrc="assets\/images\/([^"]+)"[^>]*)>/gi,(full,attrs,src)=>{
    if(/\bdata-cms-media=/.test(attrs))return full;
    const id=`${slug}-image-${String(++mediaIndex).padStart(3,'0')}`;media.push({id,label:mediaLabel(src,mediaIndex),image:`assets/images/${src}`});return `<img${attrs} data-cms-media="${id}" data-cms-attr="src">`;
  });
  html=html.replace(/<([a-z][\w-]*)([^>]*\bhref="https?:\/\/[^"']+"[^>]*)>/gi,(full,tag,attrs)=>{
    if(/\bdata-cms-url=/.test(attrs))return full;
    const href=attr(attrs,'href'),id=`${slug}-url-${String(++urlIndex).padStart(3,'0')}`;urls.push({id,label:`Link ${urlIndex}: ${href.replace(/^https?:\/\//,'').slice(0,70)}`,url:href});return `<${tag}${attrs} data-cms-url="${id}">`;
  });
  const keys=[...new Set([...source.matchAll(/\bdata-i18n="([^"]+)"/g)].map(m=>m[1]))];
  return {html,texts,media,urls,keys};
}
function translationsFor(file,keys){
  const js=fs.readFileSync(path.join(root,file),'utf8');const match=js.match(/const (?:translations|detailTranslations)=(\{[\s\S]*?\});/);
  if(!match)return [];
  let obj;try{obj=JSON.parse(match[1])}catch{return []}
  return keys.filter(key=>obj.de?.[key]!==undefined||obj.en?.[key]!==undefined).map(key=>({id:key,label:label(obj.de?.[key]||obj.en?.[key],key),de:obj.de?.[key]||'',en:obj.en?.[key]||''}));
}
fs.mkdirSync(path.join(root,'content'),{recursive:true});
for(const [file,slug,title] of pages){
  const source=fs.readFileSync(path.join(root,file),'utf8'),out=annotate(source,slug);
  fs.writeFileSync(path.join(root,file),out.html);
  const dict=slug==='home'?'script.js':slug.startsWith('chalet-')?'chalet-detail.js':null;
  const i18n=dict?translationsFor(dict,out.keys):[];
  fs.writeFileSync(path.join(root,'content',`${slug}.json`),JSON.stringify({title,texts:out.texts,translations:i18n,media:out.media,links:out.urls,galleries:[]},null,2)+'\n');
}
const global={title:'Globale Inhalte',contact:{phone:'+43 6457 33971',email:'info@alpenchalets.at',address:'Grießenkarweg 417, 5542 Flachau, Österreich'},seasonalHeroes:[]};
fs.writeFileSync(path.join(root,'content','global.json'),JSON.stringify(global,null,2)+'\n');
console.log(`Generated ${pages.length} content files.`);
