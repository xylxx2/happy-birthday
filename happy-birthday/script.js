(function(){
  var VID='FuXbKLiW1UI',YT_URL='https://youtu.be/FuXbKLiW1UI';
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cols=['#b5332e','#7fa8d6','#efc46a','#bfe5d0','#b57ae0','#fffaec'];
  function confetti(n){
    if(calm)return;
    for(var i=0;i<n;i++){var c=document.createElement('i');c.className='conf';
      c.style.left=Math.random()*100+'vw';c.style.background=cols[i%6];
      c.style.animationDuration=(2.5+Math.random()*2)+'s';c.style.animationDelay=Math.random()*.6+'s';
      document.body.appendChild(c);setTimeout(function(e){e.remove()},5500,c)}
  }
  function sparks(x,y,n,size){
    if(calm)return;
    for(var i=0;i<n;i++){var e=document.createElement('img');e.src='assets/star.png';e.alt='';e.className='sp';
      var a=Math.random()*6.283,d=30+Math.random()*60;
      e.style.left=x+'px';e.style.top=y+'px';e.style.setProperty('--s',(size*(.6+Math.random()*.8))+'px');
      e.style.setProperty('--dx',Math.cos(a)*d+'px');e.style.setProperty('--dy',Math.sin(a)*d+'px');
      e.style.setProperty('--r',(Math.random()*360-180)+'deg');
      document.body.appendChild(e);setTimeout(function(x){x.remove()},900,e)}
  }

  /* =============== MUSIQUE (persistante d'une page à l'autre) =============== */
  var wrap=document.createElement('div');wrap.id='mp-wrap';wrap.setAttribute('data-keep','');wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<div id="mp-yt"></div>';
  document.body.appendChild(wrap);
  var yt=null,ytReady=false,ytFailed=false,playing=false,started=false,want=false,resumeAt=0;
  try{var sv=JSON.parse(sessionStorage.getItem('mp')||'null');if(sv&&sv.on){started=true;want=true;resumeAt=sv.t||0}}catch(e){}
  function ui(){
    document.querySelectorAll('.mp-btn').forEach(function(b){
      b.classList.toggle('on',playing);b.setAttribute('aria-pressed',playing?'true':'false');
      b.querySelector('.mp-t').textContent=playing?'Pause':'Musique';
      b.title=playing?'Mettre la musique en pause':'Écouter la musique de l’anniversaire'});
  }
  function save(){try{sessionStorage.setItem('mp',JSON.stringify({on:playing||want?1:0,t:ytReady&&yt.getCurrentTime?yt.getCurrentTime():0}))}catch(e){}}
  function mkPlayer(){
    var o={playsinline:1,controls:0,disablekb:1,rel:0,modestbranding:1,loop:1,playlist:VID};
    if(/^https?:/.test(location.protocol))o.origin=location.origin;
    yt=new YT.Player('mp-yt',{width:200,height:200,videoId:VID,playerVars:o,events:{
      onReady:function(){ytReady=true;if(want){if(resumeAt)yt.seekTo(resumeAt,true);yt.playVideo();
        setTimeout(function(){if(!playing){want=false;ui()}},1800)}},
      onStateChange:function(e){var s=e.data;
        if(s===1){playing=true;started=true;want=false}else if(s===2){playing=false}else if(s===0){yt.seekTo(0);yt.playVideo()}
        ui();save()},
      onError:function(){ytFailed=true;playing=false;ui()}}});
  }
  var api=document.createElement('script');api.src='https://www.youtube.com/iframe_api';
  api.onerror=function(){ytFailed=true};
  window.onYouTubeIframeAPIReady=mkPlayer;document.head.appendChild(api);
  var music={
    play:function(){started=true;want=true;
      if(ytFailed){window.open(YT_URL,'_blank','noopener');return}
      if(ytReady){yt.unMute();yt.playVideo()}ui()},
    pause:function(){want=false;if(ytReady)yt.pauseVideo();playing=false;ui();save()},
    toggle:function(){playing?music.pause():music.play()}
  };
  addEventListener('pagehide',save);
  document.addEventListener('visibilitychange',function(){if(document.hidden)save()});

  /* =============== TÉLÉ : agrandissement =============== */
  var big=null,back=null,note=null,srcTv=null;
  function tilt(tv){
    tv.addEventListener('pointermove',function(e){if(e.pointerType==='touch'||calm)return;var r=tv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      tv.style.transform='perspective(700px) rotateY('+(x*14).toFixed(1)+'deg) rotateX('+(-y*12).toFixed(1)+'deg) scale(1.03)'});
    tv.addEventListener('pointerleave',function(){tv.style.transform=''});
  }
  function zap(tv){tv.classList.remove('zap');void tv.offsetWidth;tv.classList.add('zap')}
  function openBig(src,x,y){
    if(big)return;srcTv=src;
    var r=src.getBoundingClientRect(),w=Math.min(innerWidth*.94,innerHeight*.84*637/747,780),h=w*747/637;
    back=document.createElement('div');back.className='tv-back';
    note=document.createElement('p');note.className='tv-note px';note.textContent='clique n’importe où pour fermer';
    big=src.cloneNode(true);big.removeAttribute('style');big.classList.add('tv-big');
    big.style.cssText='width:'+w+'px;left:'+(innerWidth-w)/2+'px;top:'+Math.max(8,(innerHeight-h)/2-14)+'px';
    document.body.appendChild(back);document.body.appendChild(big);document.body.appendChild(note);
    src.style.visibility='hidden';
    var cx=r.left+r.width/2-innerWidth/2,cy=r.top+r.height/2-(parseFloat(big.style.top)+h/2),s=r.width/w;
    if(!calm){back.animate([{opacity:0},{opacity:1}],{duration:350,fill:'both'});
      big.animate([{transform:'translate('+cx+'px,'+cy+'px) scale('+s+')'},{transform:'none'}],{duration:620,easing:'cubic-bezier(.3,1.2,.5,1)'})}
    tilt(big);zap(big);
    big.addEventListener('click',function(e){e.stopPropagation();tvToggle(big)});
    back.addEventListener('click',function(){closeBig()});
    sparks(x||innerWidth/2,y||innerHeight/2,10,22);confetti(40);
  }
  function closeBig(now){
    if(!big)return;var b=big,k=back,n=note,s=srcTv;big=back=note=null;
    var done=function(){b.remove();k.remove();n.remove();if(s)s.style.visibility=''};
    if(now||calm||!s.isConnected){done();return}
    var r=s.getBoundingClientRect(),br=b.getBoundingClientRect();
    var a=b.animate([{transform:'none',opacity:1},{transform:'translate('+(r.left+r.width/2-br.left-br.width/2)+'px,'+(r.top+r.height/2-br.top-br.height/2)+'px) scale('+(r.width/br.width)+')',opacity:1}],{duration:380,easing:'cubic-bezier(.5,0,.7,.4)',fill:'forwards'});
    k.animate([{opacity:1},{opacity:0}],{duration:380,fill:'forwards'});n.style.opacity=0;
    a.onfinish=done;
  }
  function tvToggle(tv,e){
    if(big){closeBig();return}
    openBig(tv,e&&e.clientX,e&&e.clientY);
  }
  addEventListener('keydown',function(e){if(e.key==='Escape')closeBig()});

  /* =============== ÉCRAN DE CHARGEMENT =============== */
  var loaderEl=document.getElementById('loader'),readyQ=[];
  function whenReady(fn){if(document.body.classList.contains('loading'))readyQ.push(fn);else fn()}
  (function(){
    if(!loaderEl){document.body.classList.remove('loading');return}
    var t0=Date.now(),min=calm?400:1800,fin=false;
    function finish(){if(fin)return;fin=true;
      setTimeout(function(){loaderEl.classList.add('done');
        setTimeout(function(){document.body.classList.remove('loading');readyQ.splice(0).forEach(function(f){f()})},300);
        setTimeout(function(){loaderEl.remove()},1000)},Math.max(0,min-(Date.now()-t0)))}
    if(document.readyState==='complete')finish();else addEventListener('load',finish);
    setTimeout(finish,4500);
  })();

  /* =============== PAGE (réinitialisée à chaque navigation) =============== */
  var nav=null,home=null,dds=[],io=null;
  function initPage(){
    /* confettis d'accueil */
    if(document.body.hasAttribute('data-burst'))whenReady(function(){setTimeout(function(){confetti(45)},600)});
    /* bougie */
    var c=document.getElementById('candle'),w=document.getElementById('wish');
    if(c)c.addEventListener('click',function(){c.classList.toggle('off');var o=c.classList.contains('off');
      w.textContent=o?'Que tous tes vœux se réalisent ♥':'appuie sur la bougie, fais un vœu';if(o)confetti(90)});
    /* mot de passe + copier */
    var pw=document.getElementById('pw'),eye=document.getElementById('eye'),s=false;
    if(eye)eye.addEventListener('click',function(){s=!s;pw.textContent=s?pw.dataset.v:'••••••••••••••';eye.textContent=s?'Masquer':'Afficher'});
    document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
      var el=document.getElementById(b.dataset.copy),x=el.dataset.v||el.textContent,o=b.textContent,ok=function(){b.textContent='Copié ✓';setTimeout(function(){b.textContent=o},1500)};
      navigator.clipboard?navigator.clipboard.writeText(x).then(ok,ok):ok()})});
    /* menu : pastille qui glisse */
    nav=document.querySelector('nav');home=null;
    if(nav){
      var mb=document.createElement('button');mb.type='button';mb.className='mp-btn';
      mb.innerHTML='<span class="eq"><i></i><i></i><i></i></span><span class="mp-t">Musique</span>';
      mb.addEventListener('click',function(e){e.stopPropagation();music.toggle()});nav.appendChild(mb);
      var links=[].slice.call(nav.querySelectorAll('a')),cur=nav.querySelector('[aria-current]')||links[0];
      var ind=document.createElement('span');ind.className='ind';nav.insertBefore(ind,nav.firstChild);nav.classList.add('has-ind');
      var place=function(a,hov){links.forEach(function(l){l.classList.toggle('on',l===a)});
        ind.classList.toggle('hov',!!hov&&a!==cur);
        ind.style.width=a.offsetWidth+'px';ind.style.translate=a.offsetLeft+'px 0'};
      home=function(){place(cur,false)};
      links.forEach(function(a){['pointerenter','focus'].forEach(function(ev){a.addEventListener(ev,function(){place(a,true)})});
        ['pointerleave','blur'].forEach(function(ev){a.addEventListener(ev,home)})});
      home();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){home&&home()});
      onScroll();
    }
    /* apparition au scroll */
    if(io)io.disconnect();
    var rv=[].slice.call(document.querySelectorAll('.win,footer,.mini,.candle,main>.cta'));
    if('IntersectionObserver' in window&&!calm){
      io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}})},{threshold:.12});
      rv.forEach(function(e){e.classList.add('rv')});
      var myio=io;whenReady(function(){rv.forEach(function(e){myio.observe(e)})});
    }
    /* images décoratives */
    dds=[].slice.call(document.querySelectorAll('.dd'));
    dds.forEach(function(d,i){d.dataset.k=(.25+(i%4)*.12).toFixed(2);
      d.addEventListener('click',function(e){e.stopPropagation();d.classList.remove('pop');void d.offsetWidth;d.classList.add('pop');
        var r=d.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,9,20);confetti(18)});
      d.addEventListener('animationend',function(e){if(e.animationName==='pop')d.classList.remove('pop')})});
    /* télé */
    var tv=document.querySelector('.tv');
    if(tv){tilt(tv);tv.addEventListener('click',function(e){tvToggle(tv,e)});
      tv.tabIndex=0;tv.setAttribute('role','button');tv.setAttribute('aria-label','Agrandir la photo');
      tv.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tvToggle(tv)}})}
    /* étapes à cocher */
    document.querySelectorAll('.steps li').forEach(function(li){li.addEventListener('click',function(e){if(e.target.closest('a,button'))return;
      li.classList.toggle('done');if(li.classList.contains('done')){var r=li.getBoundingClientRect();sparks(r.left+19,r.top+16,6,16)}})});
    ui();
  }

  /* =============== listeners globaux =============== */
  var mx=0,my=0,sy=0,raf=0,last=scrollY,tick=false;
  function par(){raf=0;dds.forEach(function(d){var k=+d.dataset.k;
    d.style.transform='translate3d('+(mx*k*-26).toFixed(1)+'px,'+(my*k*-18+sy*k*-.06).toFixed(1)+'px,0)'})}
  function ask(){if(!raf)raf=requestAnimationFrame(par)}
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){
    var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;sy=y;
    if(nav){nav.style.setProperty('--prog',h>0?Math.min(1,y/h):0);
      if(y>last+6&&y>120)nav.classList.add('hide');else if(y<last-6||y<60)nav.classList.remove('hide')}
    last=y;tick=false;if(!calm)ask()})}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',function(){home&&home()});
  if(!calm)addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;ask()},{passive:true});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');
    if(a&&!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!a.target&&
       a.protocol===location.protocol&&a.host===location.host&&/\.html$/.test(a.pathname)){
      e.preventDefault();if(a.pathname!==location.pathname)go(a.href,true);return}
    if(e.target.closest('.dd,.tv,.tv-big,.candle,.mp-btn'))return;sparks(e.clientX,e.clientY,5,14)});

  /* =============== navigation sans rechargement (la musique continue) =============== */
  function go(url,push){
    fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(html){
      var doc=new DOMParser().parseFromString(html,'text/html');
      var swap=function(){
        closeBig(true);
        [].slice.call(document.body.children).forEach(function(n){if(!n.hasAttribute('data-keep')&&n.tagName!=='SCRIPT')n.remove()});
        document.body.removeAttribute('data-burst');if(doc.body.hasAttribute('data-burst'))document.body.setAttribute('data-burst','');
        var f=document.createDocumentFragment();
        [].slice.call(doc.body.children).forEach(function(n){if(n.tagName!=='SCRIPT'&&n.id!=='loader'&&n.tagName!=='NOSCRIPT')f.appendChild(document.importNode(n,true))});
        document.body.insertBefore(f,document.body.firstChild);
        document.title=doc.title;scrollTo(0,0);last=0;initPage();
      };
      if(push)history.pushState({},'',url);
      if(document.startViewTransition&&!calm)document.startViewTransition(swap);else swap();
    }).catch(function(){save();location.href=url});
  }
  addEventListener('popstate',function(){go(location.href,false)});

  initPage();
})();
