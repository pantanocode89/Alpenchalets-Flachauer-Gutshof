(()=>{
  'use strict';
  if(!document.querySelector('link[data-ac-final-polish]')){const css=document.createElement('link');css.rel='stylesheet';css.href='final-polish.css?v=20260816-29';css.dataset.acFinalPolish='';document.head.append(css)}
  const settleInternalMotion=()=>document.documentElement.classList.add('ac-navigation-settled');
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',settleInternalMotion,{capture:true}));
  window.addEventListener('popstate',settleInternalMotion);
  const revealTargets=[...document.querySelectorAll('main > section:not(:first-child),.card,.room-card,.amenity,.detail-fact,.gallery-item,.gallery-full button')];
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ac-visible');observer.unobserve(entry.target)}}),{rootMargin:'0px 0px -7% 0px',threshold:.08});revealTargets.forEach((el,index)=>{el.classList.add('ac-reveal');el.style.transitionDelay=`${Math.min(index%4,3)*55}ms`;observer.observe(el)})}else revealTargets.forEach(el=>el.classList.add('ac-visible'));
  document.querySelectorAll('img:not([loading])').forEach((img,index)=>{if(index>1)img.loading='lazy';img.decoding='async'});
  const journey=document.querySelector('.alpine-journey');
  if(journey){
    const playJourney=()=>{if(journey.classList.contains('is-playing'))return;journey.classList.add('is-playing');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)journey.querySelectorAll('.journey-motion').forEach(motion=>motion.beginElement?.())};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)playJourney();
    else if('IntersectionObserver'in window){const journeyObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){playJourney();journeyObserver.disconnect()}},{threshold:.28});journeyObserver.observe(journey)}
    else playJourney();
  }})();
