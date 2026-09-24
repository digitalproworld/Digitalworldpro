/* Digital World Pro — website assistant (no backend required) */
(function () {
  if (window.DWPChat) return;
  // ▼ Paste your backend URL here after deploying (example: https://dwp-chat-backend.onrender.com/api/chat)
  //   Leave empty to use the simple keyword assistant only.
  var API_URL = '';
  // ▲
  var FORM = 'https://formspree.io/f/xzdqenkp';
  var AI = !!API_URL, history = [];
  var PHONE = '(484) 240-1582', TEL = '+14842401582', EMAIL = 'DigitalworldPro@outlook.com';

  var css = `
  .dwp-launch{position:fixed;right:20px;bottom:20px;z-index:1000;display:flex;align-items:center;gap:10px;background:#00b4d8;color:#041f2d;border:0;border-radius:30px;padding:13px 20px 13px 16px;font:700 14px 'Montserrat',sans-serif;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}
  .dwp-launch:hover{background:#48cae4}
  .dwp-launch:focus-visible,.dwp-panel button:focus-visible,.dwp-panel input:focus-visible,.dwp-panel textarea:focus-visible{outline:2px solid #48cae4;outline-offset:2px}
  .dwp-dot{width:9px;height:9px;border-radius:50%;background:#02c39a;box-shadow:0 0 0 3px rgba(2,195,154,.25)}
  .dwp-panel{position:fixed;right:20px;bottom:86px;z-index:1001;width:370px;max-width:calc(100vw - 24px);height:540px;max-height:calc(100vh - 110px);display:none;flex-direction:column;background:#063548;border:1px solid rgba(0,180,216,.25);border-radius:14px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.45);font-family:'Open Sans',sans-serif}
  .dwp-panel.open{display:flex}
  .dwp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#041f2d;border-bottom:1px solid rgba(0,180,216,.18)}
  .dwp-head b{display:block;font:800 15px 'Montserrat',sans-serif;color:#fff}
  .dwp-head small{font-size:12px;color:#90c4d4}
  .dwp-x{background:none;border:0;color:#90c4d4;font-size:24px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:6px}
  .dwp-x:hover{color:#fff}
  .dwp-log{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px}
  .dwp-msg{max-width:86%;padding:10px 13px;border-radius:12px;font-size:14px;line-height:1.55;white-space:pre-line;word-wrap:break-word}
  .dwp-bot{align-self:flex-start;background:#0a4d6e;color:#e8f4f8;border-bottom-left-radius:4px}
  .dwp-me{align-self:flex-end;background:#00b4d8;color:#041f2d;border-bottom-right-radius:4px;font-weight:600}
  .dwp-msg a{color:#48cae4;font-weight:600}
  .dwp-me a{color:#041f2d}
  .dwp-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 10px}
  .dwp-chip{background:rgba(0,180,216,.12);color:#48cae4;border:1px solid rgba(0,180,216,.3);border-radius:16px;padding:7px 12px;font:600 12.5px 'Open Sans',sans-serif;cursor:pointer}
  .dwp-chip:hover{background:rgba(0,180,216,.25);color:#fff}
  .dwp-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(0,180,216,.18);background:#041f2d}
  .dwp-form input{flex:1;min-width:0;background:rgba(255,255,255,.07);border:1px solid rgba(0,180,216,.25);border-radius:8px;padding:11px 12px;color:#fff;font:14px 'Open Sans',sans-serif}
  .dwp-form input::placeholder{color:rgba(255,255,255,.35)}
  .dwp-send{background:#00b4d8;color:#041f2d;border:0;border-radius:8px;padding:0 16px;font:700 13px 'Montserrat',sans-serif;cursor:pointer}
  .dwp-note{font-size:11px;color:rgba(144,196,212,.7);text-align:center;padding:0 12px 10px;background:#041f2d}
  .dwp-typing{align-self:flex-start;color:#90c4d4;font-size:13px;padding:4px 6px}
  .dwp-short{display:none}
  @media(max-width:760px){.dwp-long{display:none}.dwp-short{display:inline}.dwp-launch{bottom:74px;right:14px;padding:12px 16px 12px 13px}.dwp-panel{right:12px;left:12px;width:auto;bottom:134px;height:auto;top:76px;max-height:none}}
  @media(prefers-reduced-motion:reduce){.dwp-panel,.dwp-launch{transition:none}}`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var launch = document.createElement('button');
  launch.className = 'dwp-launch'; launch.type = 'button';
  launch.setAttribute('aria-label', 'Open chat assistant'); launch.setAttribute('aria-expanded', 'false');
  launch.innerHTML = '<span class="dwp-dot" aria-hidden="true"></span><span class="dwp-long">Questions? Chat with us</span><span class="dwp-short">Chat</span>';

  var panel = document.createElement('div');
  panel.className = 'dwp-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Digital World Pro assistant');
  panel.innerHTML =
    '<div class="dwp-head"><div><b>Digital World Pro</b><small>' + (AI ? 'AI assistant · usually replies in seconds' : 'Website assistant · replies instantly') + '</small></div>' +
    '<button type="button" class="dwp-x" aria-label="Close chat">×</button></div>' +
    '<div class="dwp-log" aria-live="polite"></div>' +
    '<div class="dwp-chips"></div>' +
    '<form class="dwp-form" autocomplete="on"><label for="dwp-in" style="position:absolute;left:-9999px">Type your message</label>' +
    '<input id="dwp-in" type="text" placeholder="Type your question…" maxlength="500"/>' +
    '<button type="submit" class="dwp-send">Send</button></form>' +
    '<div class="dwp-note">Want a person? Call <a href="tel:' + TEL + '" style="color:#48cae4">' + PHONE + '</a></div>';

  document.body.appendChild(launch); document.body.appendChild(panel);
  var log = panel.querySelector('.dwp-log'), chips = panel.querySelector('.dwp-chips'),
      form = panel.querySelector('.dwp-form'), input = panel.querySelector('#dwp-in');

  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function linkify(text){
    var h=esc(text);
    h=h.replace(/(^|[\s(])(\/(?:[\w-]+\.html)?(?:#[\w-]+)?)(?=$|[\s).,!?:;])/g,function(m,pre,path){return (path.length>1&&(path.indexOf('.html')>-1||path.indexOf('#')>-1))?pre+'<a href="'+path+'">'+path+'</a>':m;});
    h=h.replace(/https?:\/\/digitalworldpro\.online[^\s<)]*/g,function(u){return '<a href="'+u+'">'+u+'</a>';});
    h=h.replace(/\(484\) 240-1582/g,'<a href="tel:'+TEL+'">'+PHONE+'</a>');
    h=h.replace(/DigitalworldPro@outlook\.com/gi,'<a href="mailto:'+EMAIL+'">'+EMAIL+'</a>');
    return h;
  }
  function add(html, who){var d=document.createElement('div');d.className='dwp-msg '+(who==='me'?'dwp-me':'dwp-bot');d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;}
  function setChips(list){chips.innerHTML='';(list||[]).forEach(function(c){var b=document.createElement('button');b.type='button';b.className='dwp-chip';b.textContent=c;b.onclick=function(){handle(c);};chips.appendChild(b);});}
  function bot(html, next){
    var t=document.createElement('div');t.className='dwp-typing';t.textContent='typing…';log.appendChild(t);log.scrollTop=log.scrollHeight;
    setChips([]);
    setTimeout(function(){t.remove();add(html,'bot');setChips(next===undefined?MAIN:next);}, 450);
  }

  var MAIN = ['Services', 'Pricing', 'How long does it take?', 'Where are you located?', 'Book a free call'];

  var KB = [
    {k:['hi','hello','hey','salam','assalam','good morning','good afternoon'], a:'Hi there! 👋 What can I help you with today?'},
    {k:['service','offer','what do you do','help with','provide'], a:'We help Lehigh Valley small businesses with three things:\n\n• <a href="/web-design.html">Website design</a>: fast, mobile-friendly sites built to bring in calls\n• <a href="/ai-chatbots.html">AI chatbots &amp; automation</a>: answer customers 24/7 and automate follow-ups\n• <a href="/local-seo.html">Local SEO &amp; ads</a>: show up on Google Maps and in local search\n\nWhich one interests you?', n:['Web design','Chatbots & automation','Local SEO & ads','Book a free call']},
    {k:['scan','audit','check my','analyze','review my site'], a:'Try our <a href="/website-scanner.html">free website scanner</a>. It checks speed, mobile-friendliness, security, SEO, and Google reviews in about 20 seconds.', n:['Book a free call','Services']},
    {k:['website','web design','web site','redesign','landing page','new site','site'], a:'We build custom, mobile-first websites designed to turn visitors into calls, bookings, and orders. That includes tap-to-call buttons, lead forms, and local SEO setup.\n\nSee examples on our <a href="/web-design.html">web design page</a>.', n:['Pricing','How long does it take?','See your work','Book a free call']},
    {k:['chatbot','chat bot','bot','ai','automation','automate','crm','follow up','follow-up'], a:'We set up website chatbots that answer common questions and capture leads around the clock, plus automations for follow-ups, forms, and scheduling.\n\nThis assistant is a simple demo. Yours would be trained on your own services, hours, and FAQs. More on the <a href="/ai-chatbots.html">chatbots page</a>.', n:['Pricing','How long does it take?','Book a free call']},
    {k:['seo','google','maps','ranking','rank','business profile','ads','advertis','marketing','facebook','instagram','meta'], a:'We help you get found locally: Google Business Profile optimization, website local SEO, consistent directory listings, a review strategy, and Google or Meta ad campaigns.\n\nDetails on the <a href="/local-seo.html">local SEO page</a>.', n:['Pricing','Scan my website','Book a free call']},
    {k:['price','pricing','cost','how much','budget','charge','rate','afford','expensive','cheap'], a:'Every project gets a fixed price up front, so there are no surprises. The price depends on what you need, like the number of pages or whether you want booking, online ordering, or a chatbot.\n\nThe quickest way to get your number is a free strategy call.', n:['Book a free call','Services']},
    {k:['how long','timeline','time','fast','quick','when','turnaround','weeks','days'], a:'Typical timelines:\n\n• Small business website: about 1–3 weeks\n• Basic chatbot: about 1–2 weeks\n• Local SEO: profile improvements often show in 1–3 months; website rankings take 3–6 months', n:['Pricing','Book a free call']},
    {k:['where','location','located','area','allentown','bethlehem','easton','northampton','lehigh','local','near','remote'], a:'We\'re based in Northampton, PA and work with businesses across the Lehigh Valley, including Allentown, Bethlehem, and Easton. We work with remote clients too.', n:['Services','Book a free call']},
    {k:['work','portfolio','example','sample','previous','past projects','see your'], a:'You can see recent projects, including a fragrance bar, barbershop, grocery store, and landscaping company, in the <a href="/#work">Recent Work</a> section.', n:['Web design','Book a free call']},
    {k:['phone','call you','contact','email','reach','talk to','human','person','someone'], a:'You can reach us directly:\n\n📞 <a href="tel:'+TEL+'">'+PHONE+'</a>\n✉️ <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>\n\nOr leave your details here and we\'ll get back to you within 24 hours.', n:['Book a free call']},
    {k:['thank','thanks','great','awesome','perfect','ok','okay','cool'], a:'You\'re welcome! Anything else I can help with?'}
  ];
  var ALIAS = {'web design':'website','chatbots & automation':'chatbot','local seo & ads':'seo','see your work':'portfolio','scan my website':'scan','where are you located?':'where','how long does it take?':'how long','services':'services','pricing':'pricing'};

  // lead capture flow
  var lead = null;
  var BOOK = ['book','free call','strategy call','consult','appointment','schedule','meeting','quote','estimate','get started','hire you','interested'];
  function startLead(){lead={step:'name'};bot('Great, let\'s set up your free strategy call. What\'s your name?',[]);}
  function leadStep(text){
    if(lead.step==='name'){lead.name=text.slice(0,80);lead.step='contact';return bot('Thanks, '+esc(lead.name)+'! What\'s the best phone number or email to reach you?',[]);}
    if(lead.step==='contact'){
      var isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text), digits=text.replace(/\D/g,'');
      if(!isEmail && digits.length<10) return bot('That doesn\'t look like a full phone number or email. Could you check it and send it again?',[]);
      lead.contact=text;lead.step='need';
      return bot('Got it. In a sentence or two, what would you like help with?',['A new website','A chatbot','More Google visibility','Not sure yet']);
    }
    if(lead.step==='need'){lead.need=text.slice(0,500);submitLead();}
  }
  function submitLead(){
    var fd=new FormData(), isEmail=lead.contact.indexOf('@')>-1;
    fd.append('name',lead.name);fd.append(isEmail?'email':'phone',lead.contact);
    fd.append('message',lead.need);fd.append('heard_about','Website chat assistant');fd.append('page',location.pathname);
    var saved=lead;lead=null;
    fetch(FORM,{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(function(r){
      if(!r.ok) throw 0;
      bot('You\'re all set, '+esc(saved.name)+'! ✅ We\'ll reach out within 24 hours to schedule your free strategy call.',['Services','See your work']);
    }).catch(function(){
      bot('Sorry, that didn\'t go through. Please call <a href="tel:'+TEL+'">'+PHONE+'</a> or email <a href="mailto:'+EMAIL+'">'+EMAIL+'</a> and we\'ll help right away.',MAIN);
    });
  }

  function hit(t,w){ return w.length<=4 ? new RegExp('(^|[^a-z])'+w+'([^a-z]|$)').test(t) : t.indexOf(w)>-1; }
  function answer(text){
    var t=text.toLowerCase().trim(); t=ALIAS[t]||t;
    if(BOOK.some(function(w){return hit(t,w);}) && t.indexOf('how long')<0) return startLead();
    for(var i=0;i<KB.length;i++){ if(KB[i].k.some(function(w){return hit(t,w);})) return bot(KB[i].a,KB[i].n); }
    bot('I\'m not sure about that one, but our team can help. Want to leave your details so we can follow up, or call <a href="tel:'+TEL+'">'+PHONE+'</a>?',['Book a free call','Services']);
  }
  var AI_CHIPS=['Book a free call','Services','Pricing'];
  function aiAsk(text){
    history.push({role:'user',content:text}); if(history.length>16) history=history.slice(-16);
    var t=document.createElement('div');t.className='dwp-typing';t.textContent='thinking…';log.appendChild(t);log.scrollTop=log.scrollHeight;setChips([]);
    var ctrl=('AbortController' in window)?new AbortController():null, timer=setTimeout(function(){ctrl&&ctrl.abort();},45000);
    fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history,page:location.pathname}),signal:ctrl?ctrl.signal:undefined})
      .then(function(r){if(!r.ok) throw r.status; return r.json();})
      .then(function(j){clearTimeout(timer);t.remove();var reply=String(j.reply||'').trim();if(!reply) throw 0;
        history.push({role:'assistant',content:reply});add(linkify(reply),'bot');setChips(j.leadSaved?['Services','See your work']:AI_CHIPS);})
      .catch(function(err){clearTimeout(timer);t.remove();history.pop();
        if(err===429){add('You\'ve sent a lot of messages in a short time. Please call <a href="tel:'+TEL+'">'+PHONE+'</a> or try again in a few minutes.','bot');setChips(MAIN);return;}
        answer(text);});
  }
  function handle(text){
    text=String(text).trim(); if(!text) return;
    add(esc(text),'me');
    if(lead) return leadStep(text);
    if(AI && text!=='Book a free call') return aiAsk(text);
    answer(text);
  }

  var started=false;
  function open(){
    panel.classList.add('open');launch.setAttribute('aria-expanded','true');
    if(!started){started=true;add('Hi! 👋 I\'m the Digital World Pro '+(AI?'AI ':'')+'assistant. I can answer questions about our services, pricing, and timelines, or help you book a free strategy call.','bot');setChips(MAIN);}
    setTimeout(function(){input.focus();},50);
  }
  function close(){panel.classList.remove('open');launch.setAttribute('aria-expanded','false');launch.focus();}
  launch.onclick=function(){panel.classList.contains('open')?close():open();};
  panel.querySelector('.dwp-x').onclick=close;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('open'))close();});
  form.onsubmit=function(e){e.preventDefault();var v=input.value;input.value='';handle(v);};
  if(AI){try{fetch(API_URL.replace(/\/api\/chat\/?$/,'')+'/health',{mode:'no-cors'});}catch(e){}}
  window.DWPChat={open:open,close:close};
})();
