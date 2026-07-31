<?php
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
  echo '<details open><summary>Globalni podaci</summary><div class="ac-panel"><label>Telefon<input name="ac_global[phone]" value="'.esc_attr($global['phone']??'+43 6457 33971').'"></label><label>E-mail<input type="email" name="ac_global[email]" value="'.esc_attr($global['email']??'info@alpenchalets.at').'"></label><label>Portfolio URL za Panta Digital logo<input type="url" name="ac_global[portfolio_url]" value="'.esc_attr($global['portfolio_url']??'').'"></label></div></details>';
  echo '<details><summary>Home i zajednički prevodi</summary><div class="ac-panel">';foreach($s['translations'] as $key=>$def){$saved=array('de'=>$trans['de'][$key]??'','en'=>$trans['en'][$key]??'','nl'=>$trans['nl'][$key]??'');echo '<h4>'.esc_html($key).'</h4>';ac_field3('ac_translations['.$key.']',$def,$saved);}echo '</div></details>';
  foreach($s['pages'] as $page=>$items){echo '<details><summary>'.esc_html(ucwords(str_replace('-',' ',$page))).' - tekstovi</summary><div class="ac-panel">';foreach($items as $it){echo '<h4>'.esc_html($it['label']).'</h4>';ac_field3('ac_texts['.$page.']['.$it['key'].']',$it,$texts[$page][$it['key']]??array());}echo '</div></details>';}
  foreach($s['media'] as $page=>$items){if(!$items)continue;echo '<details><summary>'.esc_html(ucwords(str_replace('-',' ',$page))).' - slike, PDF i linkovi</summary><div class="ac-panel">';foreach($items as $it){$value=$media[$page][$it['key']]??'';echo '<label><b>'.esc_html($it['label']).'</b><span class="ac-media-row"><input type="url" name="ac_media['.esc_attr($page).']['.esc_attr($it['key']).']" value="'.esc_attr($value).'" placeholder="Original: '.esc_attr($it['default']).'"><button type="button" class="button ac-media">Izaberi fajl</button></span></label>';}echo '</div></details>';}
  submit_button('Sačuvaj izmene');echo '</form></div><style>.ac-admin details{background:#fff;border:1px solid #ccd0d4;margin:12px 0}.ac-admin summary{padding:16px;font-size:16px;font-weight:700;cursor:pointer}.ac-panel{padding:0 18px 20px}.ac-panel>label{display:block;margin:14px 0}.ac-panel input{width:100%;padding:8px}.ac-langs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.ac-langs textarea{width:100%;font-family:inherit}.ac-media-row{display:flex;gap:8px}.ac-media-row input{flex:1}@media(max-width:900px){.ac-langs{grid-template-columns:1fr}}</style>';}
?>