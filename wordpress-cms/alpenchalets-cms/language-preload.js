(()=>{
  try{
    const stored=localStorage.getItem('alpenchalets-language');
    const cookie=document.cookie.match(/(?:^|;\s*)alpenchalets-language=(de|en)(?:;|$)/)?.[1];
    const lang=stored==='en'||stored==='de'?stored:(cookie||'de');
    document.documentElement.lang=lang;
    document.documentElement.classList.add('language-pending');
    setTimeout(()=>document.documentElement.classList.remove('language-pending'),1800);
  }catch{
    document.documentElement.lang='de';
  }
})();
