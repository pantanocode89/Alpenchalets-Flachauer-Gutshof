const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),content=path.join(root,'content');
const sharedText=new Set(['Home','Unsere Chalets','Sommer','Winter','Komfort','Restaurant','Galerie','Lage & Anfahrt','Urlaubsanfrage','FAQ','Kontakt','wohlfühlen | genießen','Flachau Salzburger Land Österreich','Impressum','Datenschutz','Newsletter']);
const branding=/^(?:logo(?:-transparent)?\.png|logo\.jpg|panta-studios-mark-black\.png)$/i;
for(const file of fs.readdirSync(content).filter(file=>file.endsWith('.json'))){
  const full=path.join(content,file),data=JSON.parse(fs.readFileSync(full,'utf8'));
  if(Array.isArray(data.texts))data.texts=data.texts.filter(item=>!sharedText.has(item.label));
  if(Array.isArray(data.media))data.media=data.media.filter(item=>!branding.test(path.basename(item.image||''))).map((item,index)=>({...item,label:`Bild ${index+1}`}));
  if(file==='galerie.json'){delete data.media;delete data.links;delete data.translations;}
  fs.writeFileSync(full,JSON.stringify(data,null,2)+'\n');
}
