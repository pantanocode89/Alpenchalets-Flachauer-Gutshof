const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.html'))){
  const full=path.join(root,file);let html=fs.readFileSync(full,'utf8');
  html=html.replace(/<script src="cms-content\.js\?v=\d+"><\/script>\s*<script src="cms-bootstrap\.js\?v=\d+" data-script="[^"]+"><\/script>/g,'');
  html=html.replace(/<script src="cms-content\.js\?v=\d+"><\/script>/g,'');
  html=html.replace(/<script src="((?:script|page|chalet-detail)\.js[^"]*)"[^>]*>\s*<\/script>/,'<script src="cms-content.js?v=2"></script><script src="cms-bootstrap.js?v=2" data-script="$1"></script>');
  fs.writeFileSync(full,html);
}
