(function(){
  var desktop=window.matchMedia('(min-width:1240px)');
  var t=document.getElementById('nav-toggle'),nav=document.getElementById('nav');

  function closeNav(){
    if(!t||!nav)return;
    nav.classList.remove('open');
    t.setAttribute('aria-expanded','false');
    t.setAttribute('aria-label','Open menu');
  }

  if(t&&nav){
    function setOpen(open){
      nav.classList.toggle('open',open);
      t.setAttribute('aria-expanded',open?'true':'false');
      t.setAttribute('aria-label',open?'Close menu':'Open menu');
    }
    t.addEventListener('click',function(){setOpen(!nav.classList.contains('open'));});
    nav.addEventListener('click',function(e){
      if(e.target.closest('a'))setOpen(false);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&nav.classList.contains('open')){
        closeNav();
        t.focus();
      }
    });
    var onBreakpoint=function(){if(desktop.matches)closeNav();};
    if(desktop.addEventListener)desktop.addEventListener('change',onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  // Current page in menu
  var file=location.pathname.split('/').pop()||'index.html';
  var coursePages=['courses.html','english-grammar.html','spoken-english.html','vocabulary.html','prime-quick-rehearsal-session.html','job-interview-cracker.html','english-for-general-knowledge.html'];
  document.querySelectorAll('.nav a').forEach(function(a){
    var h=a.getAttribute('href');
    if(h===file||(h==='blog.html'&&(file.indexOf('blog')===0||document.querySelector('article.post')))){
      a.classList.add('current');
      a.setAttribute('aria-current','page');
    }
  });
  var coursesLink=document.querySelector('.nav>a[href="courses.html"]');
  if(coursesLink&&coursePages.indexOf(file)>-1&&!coursesLink.classList.contains('current')){
    coursesLink.classList.add('current');
    coursesLink.setAttribute('aria-current','page');
  }

  // Forms (sent to the owner's email through FormSubmit)
  var EMAIL='alexaonlineclasses@gmail.com';
  document.querySelectorAll('.alexa-form').forEach(function(f){
    f.addEventListener('input',function(e){
      if(e.target.matches('input,select,textarea')&&e.target.checkValidity()){e.target.removeAttribute('aria-invalid');}
    });
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=f.querySelector('.alexa-form-msg'),btn=f.querySelector('.alexa-form-btn');
      if(!f.checkValidity()){
        f.querySelectorAll('input,select,textarea').forEach(function(el){
          if(el.checkValidity()){el.removeAttribute('aria-invalid');}
          else{el.setAttribute('aria-invalid','true');}
        });
        if(msg){msg.className='alexa-form-msg err';msg.textContent='Please complete the highlighted fields.';}
        f.reportValidity();
        return;
      }
      var d=new FormData(f);
      d.append('_subject',f.dataset.subject||'New website enquiry');
      d.append('_template','table');
      d.append('_captcha','false');
      if(btn){btn.disabled=true;}
      if(msg){msg.className='alexa-form-msg';msg.textContent='Sending...';}
      fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',headers:{Accept:'application/json'},body:d})
        .then(function(r){return r.json();})
        .then(function(j){
          if(j.success==='true'||j.success===true){
            if(msg){msg.className='alexa-form-msg ok';msg.textContent='Thank you! We have received your details and will contact you soon.';}
            f.reset();
            f.querySelectorAll('[aria-invalid]').forEach(function(el){el.removeAttribute('aria-invalid');});
          }else throw new Error('fail');
        })
        .catch(function(){
          if(msg){msg.className='alexa-form-msg err';msg.innerHTML='Could not send. Please message us on <a href="https://wa.me/+918762340231">WhatsApp</a> or email '+EMAIL+'.';}
        })
        .finally(function(){if(btn)btn.disabled=false;});
    });
  });

  // Blog: Load More
  var grid=document.getElementById('blog-grid'),more=document.getElementById('load-more');
  if(grid&&more){
    var cards=[].slice.call(grid.children),shown=0,step=6;
    var status=document.getElementById('blog-status');
    function updateStatus(){
      if(!status)return;
      if(shown>=cards.length)status.textContent='All '+cards.length+' articles shown.';
      else status.textContent='Showing '+shown+' of '+cards.length+' articles.';
      more.hidden=shown>=cards.length;
    }
    function show(){
      cards.slice(shown,shown+step).forEach(function(c){c.hidden=false;});
      shown=Math.min(shown+step,cards.length);
      updateStatus();
    }
    cards.forEach(function(c){c.hidden=true;});
    more.addEventListener('click',show);
    show();
  }

  // Home: testimonials scroller
  var tr=document.getElementById('t-track');
  if(tr){
    var prev=document.getElementById('t-prev'),next=document.getElementById('t-next');
    var amt=function(){return Math.max(tr.clientWidth*.8,300);};
    var update=function(){
      if(!prev||!next)return;
      var max=tr.scrollWidth-tr.clientWidth;
      prev.disabled=tr.scrollLeft<=4;
      next.disabled=tr.scrollLeft>=max-4;
    };
    if(prev)prev.addEventListener('click',function(){tr.scrollBy({left:-amt(),behavior:'smooth'});});
    if(next)next.addEventListener('click',function(){tr.scrollBy({left:amt(),behavior:'smooth'});});
    tr.addEventListener('scroll',update,{passive:true});
    tr.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
        e.preventDefault();
        tr.scrollBy({left:(e.key==='ArrowRight'?1:-1)*amt(),behavior:'smooth'});
      }
    });
    window.addEventListener('resize',update);
    update();

    var dialog=document.getElementById('t-dialog');
    if(dialog&&typeof dialog.showModal==='function'){
      var dq=document.getElementById('t-dialog-quote'),dn=document.getElementById('t-dialog-name');
      var dclose=dialog.querySelector('.t-dialog-close'),opener=null;
      var bindReview=function(btn){
        btn.addEventListener('click',function(){
          var card=btn.closest('.t-card');
          if(!card)return;
          var quote=card.querySelector('p'),name=card.querySelector('b');
          if(dq)dq.textContent=quote?quote.textContent:'';
          if(dn)dn.textContent=name?name.textContent:'';
          opener=btn;
          dialog.showModal();
        });
      };
      document.querySelectorAll('.t-more').forEach(bindReview);
      var addClippedReviews=function(){
        document.querySelectorAll('.t-card').forEach(function(card){
          if(card.querySelector('.t-more'))return;
          var quote=card.querySelector('p');
          if(quote&&quote.scrollHeight>quote.clientHeight+1){
            var btn=document.createElement('button');
            btn.type='button';btn.className='t-more';btn.textContent='Read full review';
            card.appendChild(btn);bindReview(btn);
          }
        });
      };
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(addClippedReviews);
      else addClippedReviews();
      window.addEventListener('load',addClippedReviews);
      if(dclose)dclose.addEventListener('click',function(){dialog.close();});
      dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
      dialog.addEventListener('close',function(){if(opener)opener.focus();});
    }
  }

  // Home: count learning statistics once when they enter the viewport
  var counters=[].slice.call(document.querySelectorAll('.learning-stat strong[data-count]'));
  if(counters.length){
    var reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
    var counted=false;
    var setFinal=function(){
      counters.forEach(function(el){
        var target=parseInt(el.getAttribute('data-count'),10);
        if(!isNaN(target))el.textContent=target+'+';
      });
    };
    var showFinal=function(){counted=true;setFinal();};
    var stopAnimation=function(){
      if(reducedMotion.addEventListener)reducedMotion.addEventListener('change',function(e){if(e.matches)setFinal();});
      else if(reducedMotion.addListener)reducedMotion.addListener(function(e){if(e.matches)setFinal();});
    };
    if(reducedMotion.matches||!('IntersectionObserver' in window)||!window.requestAnimationFrame){
      showFinal();
      stopAnimation();
    }else{
      counters.forEach(function(el){el.textContent='0+';});
      var statsSection=document.querySelector('.learning-stats');
      var animate=function(){
        counted=true;
        var duration=1400,started=null;
        var frame=function(now){
          if(reducedMotion.matches){setFinal();return;}
          if(started===null)started=now;
          var progress=Math.min((now-started)/duration,1);
          var eased=1-Math.pow(1-progress,3);
          counters.forEach(function(el){
            var target=parseInt(el.getAttribute('data-count'),10);
            if(!isNaN(target))el.textContent=Math.round(target*eased)+'+';
          });
          if(progress<1)window.requestAnimationFrame(frame);
          else setFinal();
        };
        window.requestAnimationFrame(frame);
      };
      var observer=new IntersectionObserver(function(entries){
        if(counted)return;
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            counted=true;
            observer.disconnect();
            animate();
          }
        });
      },{threshold:.35});
      observer.observe(statsSection);
      stopAnimation();
      if(reducedMotion.matches){observer.disconnect();setFinal();}
    }
  }
})();
