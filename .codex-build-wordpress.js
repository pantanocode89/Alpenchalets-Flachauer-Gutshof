const fs=require('fs');
const path=require('path');
const root=process.cwd();
const packageDir=path.join(root,'wordpress-cms');
const themeDir=path.join(packageDir,'alpenchalets-cms');
if(fs.existsSync(packageDir))fs.rmSync(packageDir,{recursive:true,force:true});
fs.mkdirSync(themeDir,{recursive:true});

const pages={
  'index.html':'front-page.php','chalet-4-zimmer.html':'page-chalet-4-zimmer.php','chalet-5-zimmer.html':'page-chalet-5-zimmer.php',
  'sommer.html':'page-sommer.php','winter.html':'page-winter.php','restaurant.html':'page-restaurant.php','galerie.html':'page-galerie.php',
  'faq.html':'page-faq.php','urlaubsanfrage.html':'page-urlaubsanfrage.php','kontakt.html':'page-kontakt.php','lage.html':'page-lage.php','impressum.html':'page-impressum.php','datenschutz.html':'page-datenschutz.php'
};
const slugFor=n=>n==='index.html'?'home':n.replace('.html','');
const schema={pages:{},translations:{},media:{}};
const usedAssets=new Set();
const escapePhp=s=>s.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/&[a-zA-Z#0-9]+;/g,' ').replace(/\s+/g,' ').trim().slice(0,90);

function phpUrlFor(href){
  if(href.startsWith('index.html')){
    const rest=href.slice('index.html'.length);
    return `<?php echo esc_url(home_url('/${escapePhp(rest)}')); ?>`;
  }
  const m=href.match(/^([a-z0-9-]+)\.html(.*)$/i);
  if(m)return `<?php echo esc_url(home_url('/${escapePhp(m[1])}/${escapePhp(m[2])}')); ?>`;
  return href;
}

function transformHtml(name){
  const slug=slugFor(name);
  schema.pages[slug]=[];schema.media[slug]=[];
  let text=fs.readFileSync(path.join(root,name),'utf8');
  let counter=0,mediaCounter=0;
  text=text.replace(/data-de="([^"]*)" data-en="([^"]*)" data-nl="([^"]*)"/g,(all,de,en,nl)=>{
    const key=`${slug}_text_${String(++counter).padStart(3,'0')}`;
    schema.pages[slug].push({key,label:strip(de)||key,de,en,nl});
    return `data-cms-key="${key}" ${all}`;
  });
  text=text.replace(/<img([^>]*?)src="(assets\/[^"]+)"([^>]*)>/g,(all,before,src,after)=>{
    const key=`${slug}_image_${String(++mediaCounter).padStart(3,'0')}`;
    schema.media[slug].push({key,label:path.basename(src),type:'image',default:src});usedAssets.add(src);
    return `<img${before}data-cms-src-key="${key}" src="<?php echo esc_url(get_template_directory_uri()); ?>/${src}"${after}>`;
  });
  text=text.replace(/style="background-image:url\('([^']+)'\)"/g,(all,src)=>{
    if(!src.startsWith('assets/'))return all;
    const key=`${slug}_background_${String(++mediaCounter).padStart(3,'0')}`;
    schema.media[slug].push({key,label:path.basename(src),type:'image',default:src});usedAssets.add(src);
    return `data-cms-bg-key="${key}" style="background-image:url('<?php echo esc_url(get_template_directory_uri()); ?>/${src}')"`;
  });
  text=text.replace(/href="(assets\/docs\/[^"]+)"/g,(all,src)=>{
    const key=`${slug}_document_${String(++mediaCounter).padStart(3,'0')}`;
    schema.media[slug].push({key,label:path.basename(src),type:'document',default:src});usedAssets.add(src);
    return `data-cms-href-key="${key}" href="<?php echo esc_url(get_template_directory_uri()); ?>/${src}"`;
  });
  text=text.replace(/href="(https:\/\/www\.sunweb\.[^"]+)"/g,(all,url)=>{
    const key=`${slug}_sunweb_${String(++mediaCounter).padStart(3,'0')}`;
    schema.media[slug].push({key,label:'Sunweb booking URL',type:'url',default:url});
    return `data-cms-href-key="${key}" href="${url}"`;
  });
  text=text.replace(/(?:src|href)="(assets\/[^"]+)"/g,(all,src)=>{usedAssets.add(src);return all.replace(src,`<?php echo esc_url(get_template_directory_uri()); ?>/${src}`)});
  text=text.replace(/href="([a-z0-9-]+\.html(?:[^"#]*)?(?:#[^"]*)?|index\.html#[^"]*)"/gi,(all,href)=>`href="${phpUrlFor(href)}"`);
  text=text.replace(/<link rel="stylesheet" href="[^"]+">/g,'');
  text=text.replace(/<script src="[^"]+"><\/script>/g,'');
  text=text.replace('</head>','<?php wp_head(); ?>\n</head>');
  text=text.replace(/<body class="([^"]*)">/,'<body <?php body_class(\'$1\'); ?>><?php wp_body_open(); ?>');
  text=text.replace(/<body>/,'<body <?php body_class(); ?>><?php wp_body_open(); ?>');
  text=text.replace('</body>','<?php wp_footer(); ?>\n</body>');
  return `<?php defined('ABSPATH') || exit; ?>\n${text}`;
}

for(const [html,php] of Object.entries(pages))fs.writeFileSync(path.join(themeDir,php),transformHtml(html),'utf8');

// Parse the home translation dictionary and expose every key in the CMS panel.
const scriptSource=fs.readFileSync(path.join(root,'script.js'),'utf8');
const translationMatch=scriptSource.match(/const translations=(\{[^\r\n]*\});/);
if(!translationMatch)throw new Error('Could not read translation dictionary');
const translations=JSON.parse(translationMatch[1]);
for(const key of Object.keys(translations.de))schema.translations[key]={label:key,de:translations.de[key]||'',en:translations.en[key]||'',nl:translations.nl[key]||''};

// Copy only assets referenced by templates/CSS/JS.
for(const file of ['styles.css','page.css','chalet-detail.css','script.js','page.js','chalet-detail.js']){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of text.matchAll(/assets\/[A-Za-z0-9_@.,%+()&' -]+(?:\/[A-Za-z0-9_@.,%+()&' -]+)*\.[A-Za-z0-9]+/g))usedAssets.add(m[0]);
}
function copy(rel,destRel=rel){const src=path.join(root,rel),dst=path.join(themeDir,destRel);if(!fs.existsSync(src))throw new Error('Missing '+rel);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)}
for(const ref of usedAssets)copy(ref);
for(const file of ['styles.css','page.css','chalet-detail.css'])copy(file);

const cmsDom=`(function(){var d=window.acCmsData||{},t=d.texts||{},m=d.media||{};document.querySelectorAll('[data-cms-key]').forEach(function(e){var v=t[e.dataset.cmsKey];if(!v)return;['de','en','nl'].forEach(function(l){if(v[l])e.dataset[l]=v[l]});});document.querySelectorAll('[data-cms-src-key]').forEach(function(e){var v=m[e.dataset.cmsSrcKey];if(v)e.src=v;});document.querySelectorAll('[data-cms-bg-key]').forEach(function(e){var v=m[e.dataset.cmsBgKey];if(v)e.style.backgroundImage='url("'+v.replace(/"/g,'')+'")';});document.querySelectorAll('[data-cms-href-key]').forEach(function(e){var v=m[e.dataset.cmsHrefKey];if(v)e.href=v;});var g=d.global||{};if(g.phone){document.querySelectorAll('a[href="tel:+43645733971"]').forEach(function(a){a.href='tel:'+g.phone.replace(/[^+0-9]/g,'');a.textContent=g.phone;});}if(g.email){document.querySelectorAll('a[href="mailto:info@alpenchalets.at"]').forEach(function(a){a.href='mailto:'+g.email;a.textContent=g.email;});}})();\n`;
let mainJs=scriptSource.replace(translationMatch[0],`const translations=${translationMatch[1]};\nObject.entries(window.acCmsTranslations||{}).forEach(([lang,values])=>Object.assign(translations[lang]||{},values));`);
mainJs=cmsDom+mainJs;
fs.writeFileSync(path.join(themeDir,'script.js'),mainJs,'utf8');
fs.writeFileSync(path.join(themeDir,'page.js'),cmsDom+fs.readFileSync(path.join(root,'page.js'),'utf8'),'utf8');
fs.writeFileSync(path.join(themeDir,'chalet-detail.js'),cmsDom+fs.readFileSync(path.join(root,'chalet-detail.js'),'utf8'),'utf8');
fs.writeFileSync(path.join(themeDir,'content-schema.json'),JSON.stringify(schema,null,2),'utf8');

fs.writeFileSync(path.join(themeDir,'style.css'),`/*\nTheme Name: Flachauer Alpenchalets CMS\nTheme URI: https://www.alpenchalets.at\nAuthor: Panta Digital\nDescription: WordPress CMS theme matching the Flachauer Alpenchalets website.\nVersion: 1.0.0\nText Domain: alpenchalets\n*/\nbody.admin-bar .site-header,body.admin-bar .page-header{top:32px}@media(max-width:782px){body.admin-bar .site-header,body.admin-bar .page-header{top:46px}}\n`,'utf8');

const functionsPhp=`<?php
defined('ABSPATH') || exit;

function ac_schema(){static $s=null;if($s===null){$f=get_template_directory().'/content-schema.json';$s=json_decode(file_get_contents($f),true);}return $s?:array();}
function ac_option($key,$default=''){ $g=get_option('ac_cms_global',array()); return isset($g[$key])&&$g[$key]!==''?$g[$key]:$default; }
function ac_page_slug(){return is_front_page()?'home':get_post_field('post_name',get_queried_object_id());}

function ac_setup(){add_theme_support('post-thumbnails');add_theme_support('html5',array('gallery','caption','style','script'));}
add_action('after_setup_theme','ac_setup');

function ac_assets(){
  $uri=get_template_directory_uri();$ver=wp_get_theme()->get('Version');$slug=ac_page_slug();
  wp_enqueue_style('ac-theme',get_stylesheet_uri(),array(),$ver);
  if(is_front_page()){wp_enqueue_style('ac-main',$uri.'/styles.css',array('ac-theme'),$ver);wp_enqueue_script('ac-main',$uri.'/script.js',array(),$ver,true);$handle='ac-main';}
  elseif(in_array($slug,array('chalet-4-zimmer','chalet-5-zimmer'),true)){wp_enqueue_style('ac-chalet',$uri.'/chalet-detail.css',array('ac-theme'),$ver);wp_enqueue_script('ac-chalet',$uri.'/chalet-detail.js',array(),$ver,true);$handle='ac-chalet';}
  else{wp_enqueue_style('ac-page',$uri.'/page.css',array('ac-theme'),$ver);wp_enqueue_script('ac-page',$uri.'/page.js',array(),$ver,true);$handle='ac-page';}
  $allTexts=get_option('ac_cms_texts',array());$allMedia=get_option('ac_cms_media',array());
  $pageTexts=isset($allTexts[$slug])?$allTexts[$slug]:array();$pageMedia=isset($allMedia[$slug])?$allMedia[$slug]:array();
  $translationOverrides=get_option('ac_cms_translations',array());
  $payload='window.acCmsData='.wp_json_encode(array('texts'=>$pageTexts,'media'=>$pageMedia,'global'=>get_option('ac_cms_global',array()))).';window.acCmsTranslations='.wp_json_encode($translationOverrides).';window.acNewsletterEndpoint='.wp_json_encode(admin_url('admin-post.php')).';';
  wp_add_inline_script($handle,$payload,'before');
}
add_action('wp_enqueue_scripts','ac_assets');

function ac_newsletter_redirect($status){
  $referer=wp_get_referer();if(!$referer)$referer=home_url('/');
  wp_safe_redirect(add_query_arg('newsletter',$status,$referer).'#newsletter',303);exit;
}
function ac_newsletter_subscribe(){
  if(!empty($_POST['website']))ac_newsletter_redirect('success');
  $email=sanitize_email(wp_unslash($_POST['email']??''));$consent=($_POST['consent']??'')==='yes';
  if(!$email||!is_email($email)||!$consent)ac_newsletter_redirect('invalid');
  if(!defined('AC_BREVO_API_KEY')||!defined('AC_BREVO_LIST_ID')||!defined('AC_BREVO_DOI_TEMPLATE_ID'))ac_newsletter_redirect('unavailable');
  $response=wp_remote_post('https://api.brevo.com/v3/contacts/doubleOptinConfirmation',array('timeout'=>12,'headers'=>array('accept'=>'application/json','content-type'=>'application/json','api-key'=>AC_BREVO_API_KEY),'body'=>wp_json_encode(array('email'=>$email,'includeListIds'=>array((int)AC_BREVO_LIST_ID),'templateId'=>(int)AC_BREVO_DOI_TEMPLATE_ID,'redirectionUrl'=>home_url('/')))));
  if(is_wp_error($response))ac_newsletter_redirect('failed');
  $code=wp_remote_retrieve_response_code($response);ac_newsletter_redirect($code>=200&&$code<300?'success':'failed');
}
add_action('admin_post_nopriv_ac_newsletter_subscribe','ac_newsletter_subscribe');
add_action('admin_post_ac_newsletter_subscribe','ac_newsletter_subscribe');

function ac_activate(){
  $pages=array('sommer'=>'Sommer','winter'=>'Winter','restaurant'=>'Restaurant','galerie'=>'Galerie','faq'=>'FAQ','kontakt'=>'Kontakt','lage'=>'Lage & Anfahrt','impressum'=>'Impressum','datenschutz'=>'Datenschutz','chalet-4-zimmer'=>'4-Zimmer-Chalet','chalet-5-zimmer'=>'5-Zimmer-Chalet');
  foreach($pages as $slug=>$title){if(!get_page_by_path($slug))wp_insert_post(array('post_title'=>$title,'post_name'=>$slug,'post_status'=>'publish','post_type'=>'page'));}
  $home=get_page_by_path('home');if(!$home){$id=wp_insert_post(array('post_title'=>'Home','post_name'=>'home','post_status'=>'publish','post_type'=>'page'));}else{$id=$home->ID;}
  update_option('show_on_front','page');update_option('page_on_front',$id);flush_rewrite_rules();
}
add_action('after_switch_theme','ac_activate');

function ac_admin_menu(){add_menu_page('Alpenchalets Inhalte','Alpenchalets Inhalte','manage_options','ac-content','ac_admin_page','dashicons-admin-home',3);}
add_action('admin_menu','ac_admin_menu');
function ac_admin_assets($hook){if($hook!=='toplevel_page_ac-content')return;wp_enqueue_media();wp_enqueue_script('ac-admin',get_template_directory_uri().'/admin.js',array('jquery'),wp_get_theme()->get('Version'),true);}
add_action('admin_enqueue_scripts','ac_admin_assets');

function ac_clean_multilang($input){$out=array();foreach((array)$input as $group=>$items){foreach((array)$items as $key=>$langs){foreach(array('de','en','nl') as $lang)$out[$group][$key][$lang]=wp_kses_post($langs[$lang]??'');}}return $out;}
function ac_admin_save(){if(!current_user_can('manage_options')||!isset($_POST['ac_nonce'])||!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ac_nonce'])),'ac_save'))return;
  if(isset($_POST['ac_texts']))update_option('ac_cms_texts',ac_clean_multilang(wp_unslash($_POST['ac_texts'])));
  if(isset($_POST['ac_translations'])){$raw=array('home'=>wp_unslash($_POST['ac_translations']));$clean=ac_clean_multilang($raw);$byLang=array('de'=>array(),'en'=>array(),'nl'=>array());foreach($clean['home'] as $key=>$langs)foreach($byLang as $lang=>$_)if($langs[$lang]!=='')$byLang[$lang][$key]=$langs[$lang];update_option('ac_cms_translations',$byLang);}
  $media=array();foreach((array)wp_unslash($_POST['ac_media']??array()) as $group=>$items)foreach((array)$items as $key=>$value)$media[$group][$key]=esc_url_raw($value);update_option('ac_cms_media',$media);
  $g=wp_unslash($_POST['ac_global']??array());update_option('ac_cms_global',array('phone'=>sanitize_text_field($g['phone']??''),'email'=>sanitize_email($g['email']??''),'portfolio_url'=>esc_url_raw($g['portfolio_url']??'')));
  add_settings_error('ac_messages','saved','Sadržaj je sačuvan.','updated');
}
function ac_field3($name,$defaults,$saved){echo '<div class="ac-langs">';foreach(array('de'=>'DE','en'=>'EN','nl'=>'NL') as $lang=>$label){$v=isset($saved[$lang])&&$saved[$lang]!==''?$saved[$lang]:($defaults[$lang]??'');echo '<label><b>'.$label.'</b><textarea name="'.esc_attr($name.'['.$lang.']').'" rows="3">'.esc_textarea($v).'</textarea></label>';}echo '</div>';}
function ac_admin_page(){ac_admin_save();$s=ac_schema();$texts=get_option('ac_cms_texts',array());$trans=get_option('ac_cms_translations',array());$media=get_option('ac_cms_media',array());$global=get_option('ac_cms_global',array());settings_errors('ac_messages');
  echo '<div class="wrap ac-admin"><h1>Flachauer Alpenchalets - sadržaj sajta</h1><p>Ovde menjate tekstove na sva tri jezika, slike, dokumente i glavne kontakt podatke. Prazno polje koristi originalni sadržaj teme.</p><form method="post">';wp_nonce_field('ac_save','ac_nonce');
  echo '<details open><summary>Globalni podaci</summary><div class="ac-panel"><label>Telefon<input name="ac_global[phone]" value="'.esc_attr($global['phone']??'+43 6457 33971').'\"></label><label>E-mail<input type="email" name="ac_global[email]" value="'.esc_attr($global['email']??'info@alpenchalets.at').'\"></label><label>Portfolio URL za Panta Digital logo<input type="url" name="ac_global[portfolio_url]" value="'.esc_attr($global['portfolio_url']??'').'\"></label></div></details>';
  echo '<details><summary>Home i zajednički prevodi</summary><div class="ac-panel">';foreach($s['translations'] as $key=>$def){$saved=array('de'=>$trans['de'][$key]??'','en'=>$trans['en'][$key]??'','nl'=>$trans['nl'][$key]??'');echo '<h4>'.esc_html($key).'</h4>';ac_field3('ac_translations['.$key.']',$def,$saved);}echo '</div></details>';
  foreach($s['pages'] as $page=>$items){echo '<details><summary>'.esc_html(ucwords(str_replace('-',' ',$page))).' - tekstovi</summary><div class="ac-panel">';foreach($items as $it){echo '<h4>'.esc_html($it['label']).'</h4>';ac_field3('ac_texts['.$page.']['.$it['key'].']',$it,$texts[$page][$it['key']]??array());}echo '</div></details>';}
  foreach($s['media'] as $page=>$items){if(!$items)continue;echo '<details><summary>'.esc_html(ucwords(str_replace('-',' ',$page))).' - slike, PDF i linkovi</summary><div class="ac-panel">';foreach($items as $it){$value=$media[$page][$it['key']]??'';echo '<label><b>'.esc_html($it['label']).'</b><span class="ac-media-row"><input type="url" name="ac_media['.esc_attr($page).']['.esc_attr($it['key']).']" value="'.esc_attr($value).'" placeholder="Original: '.esc_attr($it['default']).'"><button type="button" class="button ac-media">Izaberi fajl</button></span></label>';}echo '</div></details>';}
  submit_button('Sačuvaj izmene');echo '</form></div><style>.ac-admin details{background:#fff;border:1px solid #ccd0d4;margin:12px 0}.ac-admin summary{padding:16px;font-size:16px;font-weight:700;cursor:pointer}.ac-panel{padding:0 18px 20px}.ac-panel>label{display:block;margin:14px 0}.ac-panel input{width:100%;padding:8px}.ac-langs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.ac-langs textarea{width:100%;font-family:inherit}.ac-media-row{display:flex;gap:8px}.ac-media-row input{flex:1}@media(max-width:900px){.ac-langs{grid-template-columns:1fr}}</style>';}
?>`;
fs.writeFileSync(path.join(themeDir,'functions.php'),functionsPhp,'utf8');

fs.writeFileSync(path.join(themeDir,'admin.js'),`jQuery(function($){$(document).on('click','.ac-media',function(){var input=$(this).siblings('input');var frame=wp.media({title:'Izaberite fajl',button:{text:'Koristi ovaj fajl'},multiple:false});frame.on('select',function(){input.val(frame.state().get('selection').first().toJSON().url);});frame.open();});});`,'utf8');
fs.writeFileSync(path.join(themeDir,'index.php'),`<?php defined('ABSPATH')||exit; get_header(); ?><main class="section"><div class="container"><h1><?php the_title(); ?></h1><?php while(have_posts()){the_post();the_content();} ?></div></main><?php get_footer(); ?>`,'utf8');
fs.writeFileSync(path.join(themeDir,'header.php'),`<!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?>`,'utf8');
fs.writeFileSync(path.join(themeDir,'footer.php'),`<?php wp_footer(); ?></body></html>`,'utf8');
fs.writeFileSync(path.join(themeDir,'screenshot-readme.txt'),'Add a 1200x900 screenshot.png later if you want a visual preview in WordPress Themes.','utf8');

// Make footer credit logo clickable through the CMS option.
for(const file of fs.readdirSync(themeDir).filter(n=>n.endsWith('.php'))){const p=path.join(themeDir,file);let t=fs.readFileSync(p,'utf8');t=t.replace(/<span class="footer-credit-logo"([^>]*)>([\s\S]*?)<\/span>/g,`<a class="footer-credit-logo"$1 href="<?php echo esc_url(ac_option('portfolio_url','#')); ?>" target="_blank" rel="noopener noreferrer">$2</a>`);fs.writeFileSync(p,t,'utf8');}

console.log(JSON.stringify({theme:themeDir,pages:Object.keys(pages).length,textFields:Object.values(schema.pages).reduce((n,a)=>n+a.length,0),translationKeys:Object.keys(schema.translations).length,mediaFields:Object.values(schema.media).reduce((n,a)=>n+a.length,0),assets:usedAssets.size},null,2));
