(function(){
  var d=document;
  // rok w stopce
  var rok=d.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');d.body.style.overflow=''}
  burger.addEventListener('click',function(){
    var otw=!menu.classList.contains('otw');
    menu.classList.toggle('otw',otw);burger.setAttribute('aria-expanded',otw);burger.setAttribute('aria-label',otw?'Zamknij menu':'Otwórz menu');
    d.body.style.overflow=otw?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});

  // aktywna pozycja menu
  var linki=[].slice.call(menu.querySelectorAll('a'));
  var sekcje=linki.map(function(a){return d.querySelector(a.getAttribute('href'))}).filter(Boolean);
  function spy(){
    var y=window.scrollY+window.innerHeight*0.35, akt=null;
    sekcje.forEach(function(s){if(s.offsetTop<=y)akt=s});
    if(window.innerHeight+window.scrollY>=d.documentElement.scrollHeight-4)akt=sekcje[sekcje.length-1];
    linki.forEach(function(a){var on=akt&&a.getAttribute('href')==='#'+akt.id;a.classList.toggle('akt',!!on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
  }
  window.addEventListener('scroll',spy,{passive:true});spy();

  // dolny pasek po przewinięciu za przyciski hero
  var mob=d.getElementById('mob'), akcje=d.getElementById('heroAkcje');
  if('IntersectionObserver' in window&&mob&&akcje){
    new IntersectionObserver(function(e){mob.classList.toggle('widac',!e[0].isIntersecting&&e[0].boundingClientRect.top<0)}).observe(akcje);
  }

  // karuzele: palec, mysz, strzałki, licznik
  d.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.tor'), el=[].slice.call(tor.children);
    var p=k.querySelector('.kar-p'), n=k.querySelector('.kar-n'), licz=k.querySelector('.kar-licz');
    function krok(){return el.length>1?el[1].offsetLeft-el[0].offsetLeft:tor.clientWidth}
    function idx(){return Math.round(tor.scrollLeft/krok())}
    function widoczne(){return Math.max(1,Math.round(tor.clientWidth/krok()))}
    function odswiez(){
      var max=Math.max(1,el.length-widoczne()+1), i=Math.min(idx(),max-1);
      if(licz)licz.textContent=(i+1)+' / '+max;
      if(p)p.disabled=tor.scrollLeft<=2;
      if(n)n.disabled=tor.scrollLeft>=tor.scrollWidth-tor.clientWidth-2;
    }
    if(p)p.addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'})});
    if(n)n.addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'})});
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(odswiez)},{passive:true});
    window.addEventListener('resize',odswiez);
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();tor.scrollBy({left:krok(),behavior:'smooth'})}if(e.key==='ArrowLeft'){e.preventDefault();tor.scrollBy({left:-krok(),behavior:'smooth'})}});
    // przeciąganie myszą
    var x0=0,s0=0,ciag=false,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth)return;ciag=true;ruch=false;x0=e.clientX;s0=tor.scrollLeft;tor.classList.add('ciagnie')});
    window.addEventListener('pointermove',function(e){if(!ciag)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)ruch=true;tor.scrollLeft=s0-dx});
    window.addEventListener('pointerup',function(){if(!ciag)return;ciag=false;tor.classList.remove('ciagnie');var i=Math.round(tor.scrollLeft/krok());tor.scrollTo({left:i*krok(),behavior:'smooth'})});
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    odswiez();
  });

  // przycisk "Zapytaj o program" ustawia temat
  d.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){var s=d.getElementById('f-temat');if(s)s.value=a.getAttribute('data-temat')})});

  // formularz pokazowy
  var f=d.getElementById('formularz'), info=d.getElementById('fInfo');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!f.imie.value.trim()||!f.kontakt.value.trim()){info.textContent='Proszę podać imię i e-mail lub telefon.';return}
    info.textContent='To wersja pokazowa - na docelowej stronie wiadomość trafi prosto na mk@malgorzataknut.pl.';
  });
})();
