import {createIcons,ArrowUpRight,ArrowDown,Plus} from 'lucide';
// Keep previously shared section links working after the Running rename.
if (location.hash === '#course') location.replace('#running');
createIcons({icons:{ArrowUpRight,ArrowDown,Plus},attrs:{'aria-hidden':'true','stroke-width':1.5}});
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('#mobile-menu');
function closeMenu(){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{mobileNav.hidden=!mobileNav.hidden;menu.setAttribute('aria-expanded',String(!mobileNav.hidden))});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menu.focus()}});
const exercises={squat:{alt:'Illustration du goblet squat avec haltère',text:'Jambes · Un haltère, un mouvement complet. Une fiche illustrée pour retrouver tes repères.'},bench:{alt:'Illustration du développé couché avec haltères',text:'Pectoraux · Choisis ton matériel et ajuste tes séries, tes répétitions et tes charges.'},row:{alt:'Illustration du tirage horizontal à la poulie',text:'Dos · Intègre le tirage à ton programme personnel et retrouve tes réglages à la prochaine séance.'}};
document.querySelectorAll('[data-exercise]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-exercise]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});const key=button.dataset.exercise,img=document.querySelector('#exercise-image');img.src=import.meta.env.BASE_URL+'assets/'+key+'.webp';img.alt=exercises[key].alt;document.querySelector('#exercise-description').textContent=exercises[key].text}));
const goals={bulk:{value:'2 500 kcal',label:'Minimum visé dans cet exemple',text:'Une zone de 2 500 à 2 700 kcal pour ce profil fictif.'},maintain:{value:'2 200 kcal',label:'Cible de maintien dans cet exemple',text:'Une zone de 1 980 à 2 420 kcal pour ce profil fictif.'},cut:{value:'1 900 kcal',label:'Plafond visé dans cet exemple',text:'Une zone de 1 710 à 1 900 kcal pour ce profil fictif.'}};
document.querySelectorAll('[data-goal]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-goal]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const goal=goals[button.dataset.goal];document.querySelector('#goal-value').textContent=goal.value;document.querySelector('#goal-label').textContent=goal.label;document.querySelector('#goal-description').textContent=goal.text}));
// Add only verified public release URLs. Never serve the private debug APK.
const releaseLinks={ios:null,android:null};
document.querySelectorAll('[data-platform]').forEach(link=>link.addEventListener('click',event=>{const platform=link.dataset.platform;if(releaseLinks[platform]){event.preventDefault();window.location.assign(releaseLinks[platform]);return}document.querySelector('#availability').textContent=platform==='ios'?'La version iOS n’est pas encore publiée sur l’App Store. Le lien sera ajouté à sa sortie.':'La version Android est en test privé. Le lien Google Play sera ajouté après sa publication.'}));
document.querySelector('#year').textContent=new Date().getFullYear();

// One continuous rail; the source reviews remain readable without JavaScript.
const reviewWindow=document.querySelector('.reviews-window');
const reviewGroup=document.querySelector('.reviews-group');
const reviewControls=document.querySelector('.reviews-controls');
const pauseReviews=document.querySelector('[data-reviews="pause"]');
const reduceReviews=matchMedia('(prefers-reduced-motion: reduce)');
const fineReviews=matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
const reviewClone=reviewGroup.cloneNode(true);
reviewClone.setAttribute('aria-hidden','true');
reviewClone.inert=true;
document.querySelector('.reviews-track').append(reviewClone);
reviewControls.hidden=false;
let reviewsPaused=reduceReviews.matches||!fineReviews.matches;
let reviewsVisible=false,reviewsHovered=false,reviewsFocused=false;
let reviewFrame=0,reviewTime=0,reviewPosition=0;
const reviewCount=reviewGroup.children.length;
function reviewStep(){return reviewGroup.getBoundingClientRect().width/reviewCount}
function reviewButton(){
  pauseReviews.textContent=reviewsPaused?'Lancer le défilement':'Mettre en pause';
  pauseReviews.hidden=reduceReviews.matches;
}
function canRunReviews(){return !reviewsPaused&&!reduceReviews.matches&&reviewsVisible&&!reviewsHovered&&!reviewsFocused&&!document.hidden}
function animateReviews(time){
  if(!canRunReviews()){reviewFrame=0;return}
  const elapsed=reviewTime?Math.min(time-reviewTime,64):0;
  reviewTime=time;
  reviewPosition=(reviewPosition+elapsed*.03)%reviewGroup.getBoundingClientRect().width;
  reviewWindow.scrollLeft=reviewPosition;
  reviewFrame=requestAnimationFrame(animateReviews);
}
function syncReviews(){
  cancelAnimationFrame(reviewFrame);reviewFrame=0;reviewTime=0;
  reviewPosition=reviewWindow.scrollLeft;
  reviewButton();
  if(canRunReviews())reviewFrame=requestAnimationFrame(animateReviews);
}
function stopReviews(){reviewsPaused=true;syncReviews()}
function moveReview(direction){
  stopReviews();
  const step=reviewStep();
  const index=(Math.round(reviewWindow.scrollLeft/step)+direction+reviewCount)%reviewCount;
  reviewWindow.scrollTo({left:index*step,behavior:reduceReviews.matches?'instant':'smooth'});
  document.querySelector('#review-status').textContent=`Exemple ${index+1} sur ${reviewCount}`;
}
reviewControls.addEventListener('click',event=>{
  const action=event.target.closest('[data-reviews]')?.dataset.reviews;
  if(action==='pause'){reviewsPaused=!reviewsPaused;syncReviews()}
  if(action==='previous')moveReview(-1);
  if(action==='next')moveReview(1);
});
reviewWindow.addEventListener('pointerenter',()=>{if(fineReviews.matches){reviewsHovered=true;syncReviews()}});
reviewWindow.addEventListener('pointerleave',()=>{reviewsHovered=false;syncReviews()});
reviewWindow.addEventListener('pointerdown',stopReviews,{passive:true});
reviewWindow.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>0||event.shiftKey)stopReviews()},{passive:true});
reviewWindow.addEventListener('focusin',()=>{reviewsFocused=true;syncReviews()});
reviewWindow.addEventListener('focusout',()=>{reviewsFocused=false;syncReviews()});
reviewWindow.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveReview(event.key==='ArrowRight'?1:-1)}
});
new IntersectionObserver(entries=>{reviewsVisible=entries[0].isIntersecting;syncReviews()},{threshold:.1}).observe(reviewWindow);
document.addEventListener('visibilitychange',syncReviews);
reduceReviews.addEventListener('change',()=>{if(reduceReviews.matches)reviewsPaused=true;syncReviews()});
fineReviews.addEventListener('change',()=>{if(!fineReviews.matches)reviewsPaused=true;syncReviews()});
let previousReviewStep=reviewStep();
window.addEventListener('resize',()=>{
  const index=Math.round(reviewWindow.scrollLeft/previousReviewStep)%reviewCount;
  previousReviewStep=reviewStep();
  reviewWindow.scrollLeft=index*previousReviewStep;
  syncReviews();
});
reviewButton();
