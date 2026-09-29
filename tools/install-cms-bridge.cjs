const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.html'))){
  const full=path.join(root,file);let html=fs.readFileSync(full,'utf8');
  html=html.replace(/<script src="cms-content\.js\?v=1"><\/script>/g,'');
  html=html.replace(/(<script src="(?:script|page|chalet-detail)\.js[^>]*>\s*<\/script>)/,'<script src="cms-content.js?v=1"></script>$1');
  fs.writeFileSync(full,html);
}
