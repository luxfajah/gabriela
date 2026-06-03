
// Preloader logic
const PRELOADER_MIN_TIME = 3200; // Slightly more than 3s to be safe
const pageStartTime = Date.now();

window.addEventListener('load', () => {
  const elapsed = Date.now() - pageStartTime;
  const remaining = Math.max(PRELOADER_MIN_TIME - elapsed, 0);
  
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 800);
    }
  }, remaining);
});

// Optimized Parallax Effect
  const stickers = document.querySelectorAll('.sticker-wrap');
  let ticking = false;
  let lastScrolled = 0;

  function updateParallax() {
    stickers.forEach(wrap => {
      const speed = parseFloat(wrap.getAttribute('data-speed') || '0.2');
      wrap.style.transform = `translate3d(0, ${lastScrolled * speed}px, 0)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrolled = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });


  /* ── IG Carousel ─────────────────────────────────────── */
  const ig = {};
  function initIG(id){
    const t = document.getElementById(`itrack-${id}`);
    if(!t) return;
    const n = t.children.length;
    ig[id] = {i:0, n};
    const dc = document.getElementById(`idots-${id}`);
    if(dc) {
      dc.innerHTML = '';
      for(let x=0;x<n;x++){
        const d = document.createElement('div');
        d.className = 'ig-dot'+(x===0?' active':'');
        dc.appendChild(d);
      }
    }
  }
  function igSlide(id,dir){
    const s = ig[id]; if(!s) return;
    const ni = s.i + dir;
    if(ni<0||ni>=s.n) return;
    s.i = ni;
    document.getElementById(`itrack-${id}`).style.transform = `translateX(-${ni*100}%)`;
    const dots = document.getElementById(`idots-${id}`).children;
    [...dots].forEach((d,i)=>d.classList.toggle('active',i===ni));
    const sc = document.getElementById(`sc-${id}`);
    if(sc) sc.textContent = `${ni+1} / ${s.n}`;
  }
  ['1','2','4','5','6'].forEach(initIG);

  /* ── Status & actions ─────────────────────────────────── */
  const statuses = {1:'none', 2:'none', 3:'none', 4:'none', 5:'none', 6:'none'};
  const smap = {
    approved:{ label:'Aprovado',   sb:'sb-approved' },
    rejected:{ label:'Reprovado',  sb:'sb-rejected' },
    pending: { label:'Em revisão', sb:'sb-pending'  },
    none:    { label:'Aguardando', sb:'sb-none'     },
  };

  function setStatus(id, status){
    if(status==='rejected'){
      const cl = document.getElementById(`comments-${id}`);
      if(cl && cl.querySelector('.c-empty')){
        const ra = document.getElementById(`ralert-${id}`);
        ra.classList.add('show');
        setTimeout(()=>ra.classList.remove('show'),3000);
        return;
      }
    }
    statuses[id] = status;
    const badge = document.getElementById(`badge-${id}`);
    if(badge) {
      badge.className = `sb ${smap[status].sb}`;
      badge.innerHTML = `<span class="sbp"></span>${smap[status].label}`;
    }
    const btnAp = document.getElementById(`ba-${id}`); if(btnAp) btnAp.classList.toggle('active', status==='approved');
    const btnRj = document.getElementById(`br-${id}`); if(btnRj) btnRj.classList.toggle('active', status==='rejected');
    const btnLt = document.getElementById(`bl-${id}`); if(btnLt) btnLt.classList.toggle('active', status==='pending');
    updateCounts(); saveState(); lockButtons(id, status);
    const toasts={ approved:['✅','Conteúdo aprovado!'], rejected:['✏️','Conteúdo reprovado.'], pending:['⏳','Marcado para revisão.'] };
    showToast(...toasts[status]);
  }

  function lockButtons(id, status){
    const map = { approved:`ba-${id}`, rejected:`br-${id}`, pending:`bl-${id}` };
    Object.entries(map).forEach(([s,btnId])=>{
      const btn = document.getElementById(btnId);
      if(btn) btn.classList.toggle('locked', s !== status);
    });
  }

  function updateCounts(){
    const vals = Object.values(statuses);
    const a = vals.filter(v=>v==='approved').length;
    const r = vals.filter(v=>v==='rejected').length;
    const total = 6;
    const p = total - a - r;
    
    // Header progress
    const pbFill = document.getElementById('pbFill');
    if(pbFill) pbFill.style.width = `${(a/total)*100}%`;
    const pbLabel = document.getElementById('pbLabel');
    if(pbLabel) pbLabel.innerHTML = `<strong>${a}</strong> de ${total} aprovados`;
    
    // Overview progress (if present)
    const infoFill = document.getElementById('infoFill');
    if(infoFill) infoFill.style.width = `${(a/total)*100}%`;
    const infoCount = document.getElementById('infoCount');
    if(infoCount) infoCount.textContent = `${a} de ${total} aprovados`;
    
    // Footer counts
    const fa = document.getElementById('f-approved'); if(fa) fa.textContent = a;
    const fp = document.getElementById('f-pending'); if(fp) fp.textContent = p;
    const fr = document.getElementById('f-rejected'); if(fr) fr.textContent = r;
  }

  /* ── Review Modal Logic ────────────────────────────────── */
  let currentReviewId = null;
  function openReviewModal(id) {
    currentReviewId = id;
    const modal = document.getElementById('reviewModal');
    const textarea = document.getElementById('reviewTextarea');
    textarea.value = '';
    modal.classList.add('open');
    document.getElementById('confirmReviewBtn').onclick = () => confirmReview(id);
  }

   charity = null;
  function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('open');
    currentReviewId = null;
  }

  function confirmReview(id) {
    const textarea = document.getElementById('reviewTextarea');
    const text = textarea.value.trim();
    if (!text) {
      alert("Por favor, descreva o que precisa ser revisado.");
      return;
    }
    
    // 1. Add the comment automatically
    addCommentByText(id, text, false); // add without individual toast
    
    // 2. Set status to pending
    setStatus(id, 'pending');
    
    // 3. Close modal
    closeReviewModal();
  }

  /* ── Comments Modal Logic ──────────────────────────────── */
  function openCommentsModal(id) {
    const originalList = document.getElementById(`comments-${id}`);
    const modalList = document.getElementById('modalCommentsList');
    modalList.innerHTML = originalList.innerHTML;
    document.getElementById('commentsModal').classList.add('open');
    document.getElementById('modalCommentInput').value = '';
    document.getElementById('modalSendCommentBtn').onclick = () => {
      const txt = document.getElementById('modalCommentInput').value;
      addCommentByText(id, txt);
      document.getElementById('modalCommentInput').value = '';
      openCommentsModal(id); // refresh list
    }
  }
  function closeCommentsModal() {
    document.getElementById('commentsModal').classList.remove('open');
  }

  /* ── Comments ─────────────────────────────────────────── */
  function addCommentByText(id, text, showT=true) {
    const txt = text.trim(); 
    if(!txt) return;
    const cl = document.getElementById(`comments-${id}`);
    
    // Remove empty if present
    const empty = cl.querySelector('.c-empty'); 
    if(empty) empty.remove();
    
    const now = new Date();
    const ts = now.toLocaleDateString()+' '+now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const div = document.createElement('div');
    div.className = 'comment-item';
    
    // Define o nome de exibição baseado no usuário logado
    const displayName = (currentUser === 'gabriela' || currentUser === 'gabriela@duasmaos.com.br') ? 'Gabriela Saueressig' : 'Duas Mãos (Admin)';
    
    div.innerHTML = `<div class="c-meta"><strong>${displayName}</strong> · ${ts}</div><div class="c-text">${txt}</div>`;
    cl.appendChild(div);
    
    // Show history button
    const bc = document.getElementById(`bc-${id}`);
    if(bc) bc.classList.add('visible');
    
    saveState(); 
    if(showT) showToast('💬','Comentário adicionado!');
  }

  function addComment(id, showT=true){
    // Legacy support for calls that might still expect an input field
    const inp = document.getElementById(`input-${id}`);
    if(inp) {
      addCommentByText(id, inp.value, showT);
      inp.value = '';
    }
  }

  function showToast(icon,msg){
    const t=document.getElementById('toast');
    document.getElementById('ti').textContent=icon;
    document.getElementById('tm').textContent=msg;
    t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500);
  }

  /* ── Login Logic ──────────────────────────────────────── */
  const loginScreen = document.getElementById('login-screen');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  
  let currentUser = sessionStorage.getItem('authUser') || '';
  let currentToken = sessionStorage.getItem('authToken') || '';

  // Auto-login on localhost for development/testing
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (!currentUser) {
      sessionStorage.setItem('authUser', 'admin');
      sessionStorage.setItem('authToken', 'token_valid_admin');
      currentUser = 'admin';
      currentToken = 'token_valid_admin';
    }
  }

  if (!currentUser || !currentToken) {
    if (loginScreen) loginScreen.classList.remove('hidden');
    document.body.classList.add('locked');
  } else {
    if (loginScreen) loginScreen.classList.add('hidden');
    document.body.classList.remove('locked');
    loadState();
  }

  if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const u = document.getElementById('login-user').value.trim().toLowerCase();
      const p = document.getElementById('login-pass').value.trim();
      if(!u || !p) { loginError.textContent = 'Preencha todos os campos.'; return; }
      
      loginBtn.textContent = 'Aguarde...';
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: u, password: p})
        });
        const data = await res.json();
        if(res.ok && data.success) {
          sessionStorage.setItem('authUser', data.username);
          sessionStorage.setItem('authToken', data.token);
          currentUser = data.username;
          currentToken = data.token;
          loginScreen.classList.add('hidden');
          document.body.classList.remove('locked');
          loadState();
        } else {
          loginError.textContent = 'Usuário ou senha incorretos.';
        }
      } catch(e) {
        loginError.textContent = 'Erro ao conectar. Tente novamente.';
      }
      loginBtn.textContent = 'Entrar';
    });
  }

  /* ── Persistence ──────────────────────────────────────── */
  async function saveState(){
    if (!currentUser || !currentToken) return; // Só tenta salvar se estiver logado

    const data = { statuses:{...statuses}, comments:{} };
    ['1','2','3','4','5','6'].forEach(id=>{
      const cl=document.getElementById(`comments-${id}`);
      if(cl){
        const items=cl.querySelectorAll('.comment-item');
        data.comments[id]=[...items].map(el=>el.innerHTML);
      }
    });
    try {
      // Feedback visual de salvamento em andamento
      showToast('🔄', 'Salvando dados...');
      
      const res = await fetch('/api/save',{ 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify({ data: data, username: currentUser, token: currentToken }) 
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) {
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('authToken');
          showToast('❌', 'Sessão expirada. Recarregue a página.');
        } else {
          // Mostra modal de erro detalhado
          const errorModal = document.getElementById('error-modal');
          const errorMsg = document.getElementById('error-message-text');
          if (errorModal && errorMsg) {
            errorMsg.textContent = err.error || 'Erro interno no servidor (500)';
            errorModal.classList.add('open');
          }
          showToast('❌', 'Erro ao salvar.');
        }
        return;
      }
      
      // Feedback visual de sucesso
      showToast('☁️', 'Salvo na nuvem!');
    } catch(e){ 
      console.error('Erro ao salvar:',e); 
      const errorModal = document.getElementById('error-modal');
      const errorMsg = document.getElementById('error-message-text');
      if (errorModal && errorMsg) {
        errorMsg.textContent = `Falha de Conexão: ${e.message}`;
        errorModal.classList.add('open');
      }
      showToast('❌', 'Falha de conexão.');
    }
  }

  function applyStatus(id,status){
    statuses[id]=status;
    const badge=document.getElementById(`badge-${id}`);
    if(badge) {
      badge.className=`sb ${smap[status].sb}`;
      badge.innerHTML=`<span class="sbp"></span>${smap[status].label}`;
    }
    const btnAp = document.getElementById(`ba-${id}`); if(btnAp) btnAp.classList.toggle('active',status==='approved');
    const btnRj = document.getElementById(`br-${id}`); if(btnRj) btnRj.classList.toggle('active',status==='rejected');
    const btnLt = document.getElementById(`bl-${id}`); if(btnLt) btnLt.classList.toggle('active',status==='pending');
    lockButtons(id,status);
  }

  async function loadState(){
    try {
      const resp=await fetch('/api/load');
      const data=await resp.json();
      if(!data||Object.keys(data).length===0){ updateCounts(); return; }
      ['1','2','3','4','5','6'].forEach(id=>{
        const comments=data.comments?.[id]||[];
        const cl=document.getElementById(`comments-${id}`);
        if(cl && comments.length){
          cl.innerHTML = ''; // avoid duplicates
          comments.forEach(html=>{ const div=document.createElement('div'); div.className='comment-item'; div.innerHTML=html; cl.appendChild(div); });
          
          // If has comments, show bubble
          const bc = document.getElementById(`bc-${id}`);
          if(bc) bc.classList.add('visible');
        }
      });
      ['1','2','3','4','5','6'].forEach(id=>{ const s=data.statuses?.[id]||'none'; if(s!=='none') applyStatus(id,s); });
    } catch(e){ console.error('Erro ao carregar:',e); }
    updateCounts();
  }

  async function clearState(){
    if(!confirm('Limpar todas as respostas e comentários no sistema?')) return;
    if (!currentUser || !currentToken) {
      alert('Você precisa estar logado para limpar os dados.');
      return;
    }

    try {
      showToast('🔄', 'Limpando dados...');
      const res = await fetch('/api/save',{ 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify({ data: { statuses: {}, comments: {} }, username: currentUser, token: currentToken }) 
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) {
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('authToken');
          showToast('❌', 'Sessão expirada.');
        } else {
          const errorModal = document.getElementById('error-modal');
          const errorMsg = document.getElementById('error-message-text');
          if (errorModal && errorMsg) {
            errorMsg.textContent = err.error || 'Erro ao limpar dados no servidor (500)';
            errorModal.classList.add('open');
          }
          showToast('❌', 'Erro ao limpar.');
        }
        return;
      }
      
      showToast('✅', 'Sistema resetado!');
      setTimeout(() => location.reload(), 1000);
    } catch(e){ 
      console.error('Erro ao limpar:', e);
      const errorModal = document.getElementById('error-modal');
      const errorMsg = document.getElementById('error-message-text');
      if (errorModal && errorMsg) {
        errorMsg.textContent = `Falha de Rede: ${e.message}`;
        errorModal.classList.add('open');
      }
    }
  }

  // Reveal observer
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  },{ threshold:0.1, rootMargin:'0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

  /* ══ Lightbox module ════════════════════════════════════ */
  let lbPost=null, lbIdx=0;

  const lbSources = {
    '1': ['posts abril/Post 1 - 1.webp', 'posts abril/Post 1 - 2.webp', 'posts abril/Post 1 - 3.webp', 'posts abril/Post 1 - 4.webp', 'posts abril/Post 1 - 5.webp', 'posts abril/Post 1 - 6.webp', 'posts abril/Post 1 - 7.webp'],
    '2': ['posts abril/Post 2 - 1.webp', 'posts abril/Post 2 - 2.webp', 'posts abril/Post 2 - 3.webp', 'posts abril/Post 2 - 4.webp'],
    '3': ['posts abril/Post 3.webp'],
    '4': ['posts abril/Post 4 - 1.webp', 'posts abril/Post 4 - 2.webp', 'posts abril/Post 4 - 3.webp', 'posts abril/Post 4 - 4.webp'],
    '5': ['posts abril/Post 5 - 1.webp', 'posts abril/Post 5 - 2.webp', 'posts abril/Post 5 - 3.webp', 'posts abril/Post 5 - 4.webp', 'posts abril/Post 5 - 5.webp'],
    '6': ['posts abril/Post 6 - 1.webp', 'posts abril/Post 6 - 2.webp', 'posts abril/Post 6 - 3.webp', 'posts abril/Post 6 - 4.webp', 'posts abril/Post 6 - 5.webp'],
    'comece-aqui': ['destaque 1.jpg'],
    'agende': ['destaque 2.jpg']
  };

  const postMeta = {
    '1': { caption: 'Dor na relação não é normal!<br>Com avaliação adequada, é possível entender a causa e traçar o melhor tratamento pra cada caso.', cards: [] },
    '2': { caption: 'É normal sair um cheiro "sujo"...', cards: [] },
    '3': { caption: 'A menstruação limpa o corpo?', cards: [] },
    '4': { caption: 'Candidíase de repetição', cards: [] },
    '5': { caption: 'Vacina HPV', cards: [] },
    '6': { caption: 'Mioma e cirurgias', cards: [] }
  };

  function openLightbox(postId){
    lbPost=postId; lbIdx=ig[postId]?ig[postId].i:0;
    renderLightbox();
    populateLbRight(postId);
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow='hidden';
  }

  function renderLightbox(){
    const srcs=lbSources[lbPost]; if(!srcs) return;
    const total=srcs.length;
    const prev=document.getElementById('lbPrev');
    const next=document.getElementById('lbNext');
    const dots=document.getElementById('lbDots');

    const track=document.getElementById('lbTrack');
    if(track.getAttribute('data-post') !== lbPost){
      track.innerHTML = '';
      srcs.forEach(src => {
        const div = document.createElement('div');
        div.className = 'lb-track-item';
        if (src.toLowerCase().endsWith('.mov') || src.toLowerCase().endsWith('.mp4')) {
          div.innerHTML = `<video src="${src}" controls playsinline style="width:100%; max-height:100%; object-fit:contain; display:block; margin:auto;"></video>`;
        } else {
          div.innerHTML = `<img src="${src}" loading="lazy">`;
        }
        track.appendChild(div);
      });
      track.setAttribute('data-post', lbPost);
      track.style.transition = 'none';
      track.style.transform = `translateX(0%)`;
    }

    setTimeout(()=>{ track.style.transition = 'transform .35s cubic-bezier(0.25, 1, 0.5, 1)'; }, 10);
    track.style.transform = `translateX(-${lbIdx * 100}%)`;

    prev.disabled=lbIdx===0; next.disabled=lbIdx===total-1;
    prev.style.display=next.style.display=total>1?'flex':'none';
    dots.innerHTML='';
    if(total>1){ srcs.forEach((_,i)=>{ const d=document.createElement('div'); d.className='lb-dot-item'+(i===lbIdx?' active':''); d.onclick=()=>lbGo(i); dots.appendChild(d); }); }
  }

  function populateLbRight(postId){
    const meta=postMeta[postId]||{};
    const cap=document.getElementById('lbCaption');
    if(cap) {
      cap.innerHTML=`<strong>gabrielasaueressig_</strong> ${meta.caption||''}`;
    }
    
    const cardsEl=document.getElementById('lbCards');
    if(meta.cards&&meta.cards.length){
      cardsEl.innerHTML='<div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#999;margin-bottom:6px">SLIDES</div>';
      meta.cards.forEach((c,i)=>{
        const d=document.createElement('div');
        d.className='lb-rcard';
        d.innerHTML=`<div class="lb-rcard-num">Card ${i+1}</div>${c}`;
        cardsEl.appendChild(d);
      });
    } else { if(cardsEl) cardsEl.innerHTML=''; }

    const cl=document.getElementById(`comments-${postId}`);
    const lbCL=document.getElementById('lbCommentsList');
    if(lbCL) {
      lbCL.innerHTML='';
      if(cl){
        const items=cl.querySelectorAll('.comment-item');
        if(items.length){ items.forEach(it=>{ const d=document.createElement('div'); d.style.cssText='font-size:11px;line-height:1.5;color:#333;margin-bottom:8px;padding:8px;background:#f9f9f9;border-radius:8px;'; d.innerHTML=it.innerHTML; lbCL.appendChild(d); }); }
        else { lbCL.innerHTML='<div style="font-size:11px;color:#aaa;font-style:italic">Nenhum feedback ainda.</div>'; }
      }
    }

    const ar=document.getElementById('lbActionRow');
    if(ar) {
      const st=statuses[postId]||'none';
      ar.innerHTML=`
        <button class="lb-abtn lb-abtn-ap${st==='approved'?' active':''}" onclick="setStatus('${postId}','approved');populateLbRight('${postId}')">✓ Aprovar</button>
        <button class="lb-abtn lb-abtn-rj${st==='rejected'?' active':''}" onclick="setStatus('${postId}','rejected');populateLbRight('${postId}')">✎ Reprovar</button>
        <button class="lb-abtn lb-abtn-lt${st==='pending'?' active':''}" onclick="setStatus('${postId}','pending');populateLbRight('${postId}')">⏳ Revisar</button>
      `;
    }
    const txtArea = document.getElementById('lbTextarea');
    if(txtArea) txtArea.value='';
  }

  function lbSendComment(){
    if(!lbPost) return;
    const txt = document.getElementById('lbTextarea').value.trim();
    if(!txt) return;
    addCommentByText(lbPost, txt);
    setTimeout(()=>populateLbRight(lbPost),50);
  }

  function lbGo(idx){ lbIdx=idx; renderLightbox(); }
  function lbSlide(dir){ const newIdx=lbIdx+dir; if(newIdx<0||newIdx>=lbSources[lbPost].length) return; lbGo(newIdx); }
  function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; lbPost=null; }
  document.addEventListener('keydown',(e)=>{ if(!lbPost) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight') lbSlide(1); if(e.key==='ArrowLeft') lbSlide(-1); });


/* ══ Project Viewer ════════════════════════════════════════ */
const projectData = {
};

function openProject(key) {
  const data = projectData[key];
  if (!data) return;

  const viewer = document.getElementById('projectViewer');
  const title = document.getElementById('pvTitle');
  const content = document.getElementById('pvContent');

  title.textContent = `Projects: ${data.title}`;
  content.innerHTML = '';

  data.sections.forEach((sec, i) => {
    const row = document.createElement('div');
    row.className = `pv-row ${i % 2 !== 0 ? 'reverse' : ''}`;
    
    let mediaHtml = `<img src="${sec.img}" alt="${sec.sub}" loading="lazy">`;
    if (sec.img.toLowerCase().endsWith('.mov') || sec.img.toLowerCase().endsWith('.mp4')) {
      mediaHtml = `<video src="${sec.img}" controls playsinline style="width:100%; max-height:100%; object-fit:contain; display:block;"></video>`;
    }
    
    row.innerHTML = `
      <div class="pv-img-wrap reveal">
        ${mediaHtml}
      </div>
      <div class="pv-text reveal">
        <h3>${sec.sub}</h3>
        <p>${sec.text}</p>
      </div>
    `;
    content.appendChild(row);
  });

  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Re-init reveal observer for new elements
  setTimeout(() => {
    content.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }, 100);
}

function closeProject() {
  const viewer = document.getElementById('projectViewer');
  if(viewer) viewer.classList.remove('open');
  document.body.style.overflow = '';
}

// Map old function calls to new ones for backwards compatibility with HTML if any
function openStory(key) { openProject(key); }
function closeStory() { closeProject(); }


/* ══ Highlights Slider ════════════════════════════════ */
const dsState = { 'comece-aqui': 0, 'agende': 0 };
function dsMove(key, dir) {
  const track = document.getElementById(`dt-${key}`);
  if (!track) return;
  const slides = track.querySelectorAll(".dest-slide-item");
  const total = slides.length;
  let next = dsState[key] + dir;
  if (next < 0) next = total - 1;
  if (next >= total) next = 0;
  dsState[key] = next;
  track.style.transform = `translateX(-${next * 100}%)`;
  renderDsDots(key, total, next);
}
function renderDsDots(key, total, current) {
  const dots = document.getElementById(`dd-${key}`);
  if (!dots) return;
  dots.innerHTML = "";
  if (total <= 1) return;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("div");
    dot.className = "dest-dot" + (i === current ? " active" : "");
    dots.appendChild(dot);
  }
}
// Init dots
document.addEventListener("DOMContentLoaded", () => {
  renderDsDots("comece-aqui", 1, 0);
  renderDsDots("agende", 1, 0);
});

/* ══ Snap Scroller Navigation ════════════════════════ */
function snapMove(dir) {
  const scroller = document.getElementById("snapTrack");
  if (!scroller) return;
  const sections = scroller.querySelectorAll(".post-section, .destacados-section");
  let currentIdx = 0;
  const scrollPos = scroller.scrollTop;
  const height = scroller.offsetHeight;
  
  // Find which section we are mostly in
  currentIdx = Math.round(scrollPos / height);
  
  let nextIdx = currentIdx + dir;
  if (nextIdx < 0) nextIdx = 0;
  if (nextIdx >= sections.length) nextIdx = sections.length - 1;
  
  sections[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ══ Main Posts Carousel ══════════════════════════════ */
function moveMainPosts(dir) {
  const track = document.getElementById("mainPostsTrack");
  if (!track) return;
  
  const slides = track.querySelectorAll(".post-section");
  if (!slides.length) return;

  // Find the exact slide currently in view
  const currentIdx = Math.round(track.scrollLeft / track.offsetWidth);
  let targetIdx = currentIdx + dir;
  
  if (targetIdx >= 0 && targetIdx < slides.length) {
    slides[targetIdx].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest', 
      inline: 'start' 
    });
  }
}

/* ══ Post Indicator ════════════════════════════════════ */
function goToPost(idx) {
  const track = document.getElementById("mainPostsTrack");
  if (!track) return;
  const slides = track.querySelectorAll(".post-section");
  if (slides[idx]) {
    slides[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
}

function updatePostIndicator(idx) {
  document.querySelectorAll('.pi-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

// Attach scroll listener
(function initIndicator() {
  const track = document.getElementById("mainPostsTrack");
  if (!track) { setTimeout(initIndicator, 200); return; }
  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / track.offsetWidth);
    updatePostIndicator(idx);
  }, { passive: true });
})();

/* ══ Mobile Meta Bar ════════════════════════════════════ */
function setupMobileMeta() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    document.querySelectorAll('.post-split').forEach(split => {
      if (split.querySelector('.mobile-meta-bar')) return;

      const eyebrow = split.querySelector('.post-eyebrow');
      const sb = split.querySelector('.sb');

      const bar = document.createElement('div');
      bar.className = 'mobile-meta-bar';

      if (eyebrow) bar.appendChild(eyebrow);
      if (sb) bar.appendChild(sb);

      split.insertBefore(bar, split.firstChild);
    });
  } else {
    document.querySelectorAll('.mobile-meta-bar').forEach(bar => {
      const split = bar.closest('.post-split');
      const head = split.querySelector('.post-head');
      const title = split.querySelector('.post-title');
      const eyebrow = bar.querySelector('.post-eyebrow');
      const sb = bar.querySelector('.sb');

      if (eyebrow) head.insertBefore(eyebrow, head.firstChild);
      if (sb && title) title.insertAdjacentElement('afterend', sb);
      else if (sb) head.appendChild(sb);

      bar.remove();
    });
  }
}

setupMobileMeta();
window.addEventListener('resize', setupMobileMeta);
