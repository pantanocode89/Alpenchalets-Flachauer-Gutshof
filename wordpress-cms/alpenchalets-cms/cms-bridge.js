/* Applies WordPress-managed content to the existing public markup before page scripts run. */
(() => {
  const data = window.acCmsData || {};
  const texts = data.texts || {};
  const media = data.media || {};
  document.querySelectorAll('[data-cms-key]').forEach(element => {
    const value = texts[element.dataset.cmsKey];
    if (!value) return;
    ['de', 'en', 'nl'].forEach(language => {
      if (value[language]) element.dataset[language] = value[language];
    });
  });
  document.querySelectorAll('[data-cms-src-key]').forEach(element => {
    if (media[element.dataset.cmsSrcKey]) element.src = media[element.dataset.cmsSrcKey];
  });
  document.querySelectorAll('[data-cms-bg-key]').forEach(element => {
    const value = media[element.dataset.cmsBgKey];
    if (value) element.style.backgroundImage = `url("${value.replace(/"/g, '')}")`;
  });
  document.querySelectorAll('[data-cms-href-key]').forEach(element => {
    if (media[element.dataset.cmsHrefKey]) element.href = media[element.dataset.cmsHrefKey];
  });
  const global = data.global || {};
  if (global.phone) document.querySelectorAll('a[href="tel:+43645733971"]').forEach(link => {
    link.href = `tel:${global.phone.replace(/[^+0-9]/g, '')}`;
    link.textContent = global.phone;
  });
  if (global.email) document.querySelectorAll('a[href="mailto:info@alpenchalets.at"]').forEach(link => {
    link.href = `mailto:${global.email}`;
    link.textContent = global.email;
  });
})();
