const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const change=(file,fn)=>{const full=path.join(root,file);fs.writeFileSync(full,fn(fs.readFileSync(full,'utf8')))};
change('index.html',html=>{let n=0;return html.replace(/data-chalet-carousel/g,()=>`data-chalet-carousel data-cms-carousel="home-${++n===1?'4-zimmer':'5-zimmer'}"`)});
change('chalet-4-zimmer.html',html=>html.replace('class="detail-gallery"','class="detail-gallery" data-cms-gallery="chalet-4-gallery"'));
change('chalet-5-zimmer.html',html=>html.replace('class="detail-gallery"','class="detail-gallery" data-cms-gallery="chalet-5-gallery"'));
change('page.js',source=>source.replace(/const galleryImages=(\[[^\r\n]*\]);/,(_,fallback)=>`const galleryImages=window.acCmsGallery?.('galerie-bilder',${fallback})||${fallback};`));
console.log('Connected editable galleries to the protected engines.');
