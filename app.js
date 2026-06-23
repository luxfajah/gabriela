const pageStartTime = Date.now();
const PRELOADER_MIN_TIME = 3200;

// Determine current month from filename
const pageName = window.location.pathname.split('/').pop() || 'index.html';
const month = pageName.startsWith('abril') ? 'abril' : (pageName.startsWith('maio') ? 'maio' : 'maio');

let db = null;
let statuses = {};
let ig = {}; // carousel state

// Authentication
let currentUser = sessionStorage.getItem('authUser') || '';
let currentToken = sessionStorage.getItem('authToken') || '';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  if (!currentUser) {
    sessionStorage.setItem('authUser', 'gabriela');
    sessionStorage.setItem('authToken', 'token_valid_gabriela');
    currentUser = 'gabriela';
    currentToken = 'token_valid_gabriela';
  }
}

const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

if (!currentUser || !currentToken) {
  if (loginScreen) loginScreen.classList.remove('hidden');
  document.body.classList.add('locked');
} else {
  if (loginScreen) loginScreen.classList.add('hidden');
  document.body.classList.remove('locked');
  initApp();
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
        initApp();
      } else {
        loginError.textContent = 'Usuário ou senha incorretos.';
      }
    } catch(e) {
      // Fallback for local/offline testing if backend is down
      if ((u === 'gabriela' && p === 'gabi2026') || (u === 'admin' && p === 'T7v#S26!Adm9Xp')) {
        sessionStorage.setItem('authUser', u);
        sessionStorage.setItem('authToken', 'mock_token');
        currentUser = u;
        currentToken = 'mock_token';
        loginScreen.classList.add('hidden');
        document.body.classList.remove('locked');
        initApp();
      } else {
        loginError.textContent = 'Erro ao conectar. Tente novamente.';
      }
    }
    loginBtn.textContent = 'Entrar';
  });
}

// Preloader
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

// App Initialization
async function initApp() {
  try {
    const res = await fetch(`/api/database?month=${month}`);
    db = await res.json();
    renderApp();
    await loadState();
  } catch (e) {
    console.error("Erro ao carregar o banco de dados", e);
    alert("Erro ao carregar configurações.");
  }
}

function renderApp() {
  if (!db || !db.client) return;

  // Title
  document.title = db.client.name;

  // Preloader elements
  const plImg = document.getElementById('preloader-img');
  if(plImg) plImg.src = db.client.profile_pic;
  const plName = document.getElementById('preloader-name');
  if(plName) plName.textContent = db.client.name;

  // Login elements
  const liImg = document.getElementById('login-img');
  if(liImg) liImg.src = db.client.profile_pic;

  // Header elements
  const headerAvatar = document.getElementById('header-avatar');
  if(headerAvatar) headerAvatar.src = db.client.profile_pic;
  const headerName = document.getElementById('header-name');
  if(headerName) headerName.textContent = db.client.name;
  const headerEyebrow = document.getElementById('header-eyebrow');
  if(headerEyebrow) headerEyebrow.textContent = `Planejamento de conteúdo · ${db.metadata.month_name}`;
  const headerFocus = document.getElementById('header-focus');
  if(headerFocus) headerFocus.textContent = db.metadata.campaign_focus;
  const headerDeadline = document.getElementById('header-deadline');
  if(headerDeadline) headerDeadline.textContent = db.metadata.deadline;

  // Profile Overview elements
  const igpAvatar = document.getElementById('igp-avatar');
  if(igpAvatar) igpAvatar.src = db.client.profile_pic;
  const igpUsername = document.getElementById('igp-username');
  if(igpUsername) igpUsername.textContent = db.client.username;
  const igpBio = document.getElementById('igp-bio');
  if(igpBio) igpBio.innerHTML = db.client.bio;
  
  const linkEl = document.getElementById('igp-link');
  if(linkEl) {
    linkEl.href = db.client.link;
    linkEl.textContent = `🔗 ${db.client.link.replace('https://', '')}`;
  }

  const statPosts = document.getElementById('igp-stat-posts');
  if(statPosts) statPosts.textContent = db.client.stats.posts;
  const statFollowers = document.getElementById('igp-stat-followers');
  if(statFollowers) statFollowers.textContent = db.client.stats.followers;
  const statFollowing = document.getElementById('igp-stat-following');
  if(statFollowing) statFollowing.textContent = db.client.stats.following;

  // Followed By
  const followedContainer = document.getElementById('igp-followed');
  if (followedContainer) {
    if (db.client.followed_by_images && db.client.followed_by_images.length) {
      let picsHtml = `<div class="igp-followed-pics" style="display:flex;">`;
      db.client.followed_by_images.forEach((img, idx) => {
        let margin = idx > 0 ? 'margin-left:-8px;' : '';
        picsHtml += `<img src="${img}" alt="follower" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:2px solid #fff;${margin}" loading="lazy">`;
      });
      picsHtml += `</div>`;
      picsHtml += `<span class="igp-followed-text" style="font-size:12px; margin-left:8px; color:#262626;">${db.client.followed_by_text}</span>`;
      followedContainer.innerHTML = picsHtml;
    } else {
      followedContainer.style.display = 'none';
    }
  }

  // Highlights
  const highlightsContainer = document.getElementById('igp-highlights-container');
  if(highlightsContainer) {
    highlightsContainer.innerHTML = '';
    if (db.highlights) {
      db.highlights.forEach(hl => {
        highlightsContainer.innerHTML += `
          <div class="igp-hl">
            <div class="igp-hl-circle" style="border:2px solid ${hl.color}">
              <img src="${hl.cover}" alt="${hl.title}">
            </div>
            <div class="igp-hl-label">${hl.title}</div>
          </div>
        `;
      });
    }
  }

  // Profile Grid
  const gridContainer = document.getElementById('igp-grid-container');
  if(gridContainer) {
    gridContainer.innerHTML = '';
    if (db.profile_posts) {
      db.profile_posts.forEach((pp, idx) => {
        let onClick = '';
        const matchingPost = db.approval_posts.find(ap => ap.id === pp.id);
        if (matchingPost) {
          onClick = `onclick="openLightbox('${pp.id}')"`;
        }
        
        let mediaHtml = '';
        if (pp.image.startsWith('data:image/svg+xml')) {
          mediaHtml = pp.image; // inline SVG
        } else {
          mediaHtml = `<img src="${pp.image}" alt="Post ${idx+1}" loading="lazy" decoding="async">`;
        }
        
        gridContainer.innerHTML += `
          <div class="igp-grid-item" ${onClick}>
            ${mediaHtml}
            <span class="grid-num">${String(idx+1).padStart(2, '0')}</span>
          </div>
        `;
      });
    }
  }

  // Approval Posts Carousel
  const postsTrack = document.getElementById('mainPostsTrack');
  const indicator = document.getElementById('postIndicator');
  const hiddenCommentsData = document.getElementById('hiddenCommentsData');
  const downloadsContainer = document.getElementById('downloads-container');

  if(postsTrack) postsTrack.innerHTML = '';
  if(indicator) indicator.innerHTML = '';
  if(hiddenCommentsData) hiddenCommentsData.innerHTML = '';
  
  if (downloadsContainer) {
    if (db.downloads && db.downloads.full_folder) {
      downloadsContainer.innerHTML = `<a href="${db.downloads.full_folder}" class="abtn btn-pri" target="_blank" style="width: 100%; justify-content: center; margin-bottom: 16px;"><span class="material-symbols-outlined">folder_zip</span> Baixar Pasta Completa</a>`;
    } else {
      downloadsContainer.innerHTML = '';
    }
  }

  if (db.approval_posts) {
    db.approval_posts.forEach((ap, idx) => {
      // Indicator
      if (indicator) {
        if (idx > 0) indicator.innerHTML += `<div class="pi-sep">–</div>`;
        indicator.innerHTML += `<div class="pi-item ${idx===0?'active':''}" data-idx="${idx}" onclick="goToPost(${idx})">${idx+1}</div>`;
      }

      // Hidden comments holder
      if(hiddenCommentsData) {
        hiddenCommentsData.innerHTML += `<div id="comments-${ap.id}"></div>`;
      }

      // Downloads
      if (downloadsContainer && db.downloads && db.downloads.items) {
        const dlItem = db.downloads.items.find(d => d.id === ap.id);
        if (dlItem) {
          downloadsContainer.innerHTML += `
            <a href="${dlItem.link}" class="dl-item" target="_blank">
              <div class="dl-icon">${String(idx+1).padStart(2, '0')}</div>
              <div class="dl-text">${dlItem.title}</div>
              <span class="material-symbols-outlined">download</span>
            </a>
          `;
        }
      }

      // Initialize status
      statuses[ap.id] = 'none';

      // Left Column (Gallery/Media)
      let galleryHtml = '';
      if (ap.type === 'carousel') {
        if (ap.images && ap.images.length > 0) {
          let slidesHtml = '';
          let dotsHtml = '';
          ap.images.forEach((img, imgIdx) => {
            slidesHtml += `<div class="ig-slide"><img src="${img}" loading="lazy" decoding="async"></div>`;
            dotsHtml += `<div class="ig-dot${imgIdx===0?' active':''}"></div>`;
          });

          galleryHtml = `
            <div class="ig-carousel">
              <div class="ig-mock-header">
                <div class="ig-mock-left">
                  <img src="${db.client.profile_pic}" class="ig-mock-ava" alt="${db.client.name}">
                  <div class="ig-mock-info">
                    <span class="ig-mock-name">${db.client.username}</span>
                    <span class="ig-mock-date">${ap.date}</span>
                  </div>
                </div>
                <span class="material-symbols-outlined ig-mock-more">more_horiz</span>
              </div>
              <div class="ig-track" id="itrack-${ap.id}" style="cursor:pointer" onclick="openLightbox('${ap.id}')">
                ${slidesHtml}
              </div>
              <div class="ig-dots" id="idots-${ap.id}">${dotsHtml}</div>
              <button class="ig-arrow prev" onclick="igSlide('${ap.id}', -1)"><span class="material-symbols-outlined">chevron_left</span></button>
              <button class="ig-arrow next" onclick="igSlide('${ap.id}', 1)"><span class="material-symbols-outlined">chevron_right</span></button>
            </div>
          `;
        } else {
          // Placeholder carousel
          galleryHtml = `
            <div class="ig-carousel" style="cursor:pointer" onclick="openLightbox('${ap.id}')">
              ${ap.html_content || `<div style="width:100%; height:100%; min-height:400px; aspect-ratio:4/5; background:#e0e0e0; display:flex; align-items:center; justify-content:center; color:#555; text-align:center; padding:20px;">Carrossel pendente de upload</div>`}
            </div>
          `;
        }
      } else if (ap.type === 'video') {
        galleryHtml = `
          <div class="ig-carousel" style="cursor:pointer" onclick="openLightbox('${ap.id}')">
            ${ap.html_content || `<video src="${ap.images[0]}" autoplay muted loop playsinline style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>`}
          </div>
        `;
      } else {
        // Single image
        galleryHtml = `
          <div class="ig-carousel" style="cursor:pointer" onclick="openLightbox('${ap.id}')">
            <img src="${ap.images[0]}" style="width:100%; height:auto; display:block;" alt="${ap.title}" loading="lazy">
          </div>
        `;
      }

      // Copy & Caption
      let copyCardsHtml = '';
      if (ap.copy) {
        ap.copy.forEach((c, cIdx) => {
          let label = ap.type === 'carousel' ? `<strong>Lâmina ${String(cIdx+1).padStart(2,'0')}</strong> ` : '';
          copyCardsHtml += `<div class="copy-card">${label}${c}</div>`;
        });
      }

      let sectionHtml = `
        <section class="post-section" id="sec-${ap.id}" style="position:relative;">
          <div class="post-split">
            <div class="gallery-col reveal">
              ${galleryHtml}
            </div>
            <div class="post-panel reveal" style="transition-delay:.1s">
              <div class="post-head">
                <div class="ph-top-row">
                  <div class="post-eyebrow">
                    <span id="eyebrow-${ap.id}">${ap.theme || 'Feed'}</span> <span class="date"> ${ap.date}</span>
                  </div>
                  <div class="sb sb-none" id="badge-${ap.id}"><span class="sbp"></span>Aguardando</div>
                </div>
                <h3 class="post-title">${ap.title}</h3>
              </div>
              <div class="caption-blk" style="padding: 0; background: transparent; border-radius: 0;">
                <div class="content-groups">
                  ${ap.copy && ap.copy.length ? `
                  <div class="content-group">
                    <div class="cg-header"><span class="material-symbols-outlined">${ap.type==='carousel'?'view_carousel':'image'}</span> Texto das Artes (Copy)</div>
                    <div class="copy-cards">${copyCardsHtml}</div>
                  </div>
                  ` : ''}
                  <div class="content-group">
                    <div class="cg-header"><span class="material-symbols-outlined">notes</span> Legenda do Post</div>
                    <div class="caption-body"><span class="handle">${db.client.username}</span> ${ap.caption}</div>
                  </div>
                </div>
              </div>
              <div class="panel-actions-wrapper">
                <div class="reject-alert" id="ralert-${ap.id}">⚠ Para reprovar, adicione um comentário primeiro.</div>
                <div class="actions">
                  <div class="actions-left">
                    <button class="abtn btn-ap" id="ba-${ap.id}" onclick="event.stopPropagation(); setStatus('${ap.id}','approved')"><span class="material-symbols-outlined" style="font-size:18px;">check</span> Aprovar</button>
                    <button class="abtn btn-rj" id="br-${ap.id}" onclick="event.stopPropagation(); setStatus('${ap.id}','rejected')"><span class="material-symbols-outlined" style="font-size:18px;">close</span> Reprovar</button>
                    <button class="abtn btn-lt" id="bl-${ap.id}" onclick="event.stopPropagation(); openReviewModal('${ap.id}')"><span class="material-symbols-outlined" style="font-size:18px;">schedule</span> Revisar</button>
                  </div>
                  <button class="abtn btn-cm" id="bc-${ap.id}" onclick="event.stopPropagation(); openCommentsModal('${ap.id}')"><span class="material-symbols-outlined" style="font-size:18px;">chat</span> Comentários</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;

      if(postsTrack) postsTrack.innerHTML += sectionHtml;
    });

    // Initialize carousels
    db.approval_posts.forEach(ap => {
      if (ap.type === 'carousel' && ap.images && ap.images.length > 0) {
        initIG(ap.id);
      }
    });

    // Trigger reveal observers
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    // Setup intersection observer for post indicator
    initIndicator();

    // Setup mobile layout adjustments
    setupMobileMeta();
  }

  // Lightbox Avatar & Name setup
  const lbClientAva = document.getElementById('lb-client-ava');
  if(lbClientAva) lbClientAva.src = db.client.profile_pic;
  const lbClientUser = document.getElementById('lb-client-username');
  if(lbClientUser) lbClientUser.textContent = db.client.username;

  updateCounts();
}

/* ── Parallax ── */
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

/* ── IG Carousel ── */
function initIG(id){
  const t = document.getElementById(`itrack-${id}`);
  if(!t) return;
  const n = t.children.length;
  ig[id] = {i:0, n};
  const dc = document.getElementById(`idots-${id}`);
  
  t.addEventListener('scroll', () => {
    const idx = Math.round(t.scrollLeft / t.clientWidth);
    ig[id].i = idx;
    if(dc) {
      [...dc.children].forEach((d,i)=>d.classList.toggle('active', i===idx));
    }
  }, {passive: true});
}

function igSlide(id,dir){
  const s = ig[id]; if(!s) return;
  const ni = s.i + dir;
  if(ni<0||ni>=s.n) return;
  
  const track = document.getElementById(`itrack-${id}`);
  const slideWidth = track.clientWidth;
  track.scrollTo({ left: ni * slideWidth, behavior: 'smooth' });
}

/* ── Status & actions ── */
const smap = {
  approved:{ label:'Aprovado',   sb:'sb-approved' },
  rejected:{ label:'Reprovado',  sb:'sb-rejected' },
  pending: { label:'Em revisão', sb:'sb-pending'  },
  none:    { label:'Aguardando', sb:'sb-none'     },
};

function setStatus(id, status){
  if(status==='rejected'){
    const cl = document.getElementById(`comments-${id}`);
    if(cl && (cl.querySelector('.c-empty') || cl.children.length === 0)){
      const ra = document.getElementById(`ralert-${id}`);
      if(ra) {
        ra.classList.add('show');
        setTimeout(()=>ra.classList.remove('show'),3000);
      }
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
  updateCounts(); 
  saveState(); 
  lockButtons(id, status);
  const toasts={ approved:['check_circle','Conteúdo aprovado!'], rejected:['edit','Conteúdo reprovado.'], pending:['schedule','Marcado para revisão.'] };
  if(toasts[status]) showToast(...toasts[status]);
}

function lockButtons(id, status){
  const map = { approved:`ba-${id}`, rejected:`br-${id}`, pending:`bl-${id}` };
  Object.entries(map).forEach(([s,btnId])=>{
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.toggle('locked', s !== status);
  });
}

function updateCounts(){
  if (!db || !db.approval_posts) return;
  
  const vals = Object.values(statuses);
  const a = vals.filter(v=>v==='approved').length;
  const r = vals.filter(v=>v==='rejected').length;
  const total = db.approval_posts.length;
  const p = total - a - r;
  
  const pbFill = document.getElementById('pbFill');
  if(pbFill) pbFill.style.width = `${(a/total)*100}%`;
  const pbLabel = document.getElementById('pbLabel');
  if(pbLabel) pbLabel.innerHTML = `<strong>${a}</strong> de ${total} aprovados`;
  
  const infoFill = document.getElementById('infoFill');
  if(infoFill) infoFill.style.width = `${(a/total)*100}%`;
  const infoCount = document.getElementById('infoCount');
  if(infoCount) infoCount.textContent = `${a} de ${total} aprovados`;
  
  const fa = document.getElementById('f-approved'); if(fa) fa.textContent = a;
  const fp = document.getElementById('f-pending'); if(fp) fp.textContent = p;
  const fr = document.getElementById('f-rejected'); if(fr) fr.textContent = r;
}

/* ── Modals ── */
let currentReviewId = null;
function openReviewModal(id) {
  currentReviewId = id;
  const modal = document.getElementById('reviewModal');
  const textarea = document.getElementById('reviewTextarea');
  textarea.value = '';
  modal.classList.add('open');
  document.getElementById('confirmReviewBtn').onclick = () => confirmReview(id);
}

function closeReviewModal() {
  document.getElementById('reviewModal').classList.remove('open');
  currentReviewId = null;
}

function confirmReview(id) {
  const textarea = document.getElementById('reviewTextarea');
  const text = textarea.value.trim();
  if (!text) { alert("Por favor, descreva o que precisa ser revisado."); return; }
  addCommentByText(id, text, false); 
  setStatus(id, 'pending');
  closeReviewModal();
}

function openCommentsModal(id) {
  const originalList = document.getElementById(`comments-${id}`);
  const modalList = document.getElementById('modalCommentsList');
  modalList.innerHTML = originalList ? originalList.innerHTML : '';
  document.getElementById('commentsModal').classList.add('open');
  document.getElementById('modalCommentInput').value = '';
  document.getElementById('modalSendCommentBtn').onclick = () => {
    const txt = document.getElementById('modalCommentInput').value;
    addCommentByText(id, txt);
    document.getElementById('modalCommentInput').value = '';
    openCommentsModal(id);
  }
}
function closeCommentsModal() { document.getElementById('commentsModal').classList.remove('open'); }

/* ── Comments ── */
function addCommentByText(id, text, showT=true) {
  const txt = text.trim(); 
  if(!txt) return;
  const cl = document.getElementById(`comments-${id}`);
  if(!cl) return;
  
  const empty = cl.querySelector('.c-empty'); 
  if(empty) empty.remove();
  
  const now = new Date();
  const ts = now.toLocaleDateString()+' '+now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const div = document.createElement('div');
  div.className = 'comment-item';
  const displayName = (currentUser === 'admin' || currentUser === 'admin@duasmaos.com.br') ? 'Admin' : (db?.client?.name || 'Gabriela Saueressig');
  div.innerHTML = `<div class="c-meta"><strong>${displayName}</strong> · ${ts}</div><div class="c-text">${txt}</div>`;
  cl.appendChild(div);
  
  const bc = document.getElementById(`bc-${id}`);
  if(bc) bc.classList.add('visible');
  
  saveState(); 
  if(showT) showToast('chat','Comentário adicionado!');
}

function showToast(icon,msg){
  const t=document.getElementById('toast');
  document.getElementById('ti').textContent=icon;
  document.getElementById('tm').textContent=msg;
  t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500);
}

/* ── Persistence ── */
async function saveState(){
  if (!currentUser || !currentToken) return; 

  const data = { statuses:{...statuses}, comments:{} };
  if (db && db.approval_posts) {
    db.approval_posts.forEach(ap => {
      const id = ap.id;
      const cl=document.getElementById(`comments-${id}`);
      if(cl){
        const items=cl.querySelectorAll('.comment-item');
        data.comments[id]=[...items].map(el=>el.innerHTML);
      }
    });
  }
  
  try {
    showToast('sync', 'Salvando dados...');
    const res = await fetch(`/api/save?month=${month}`,{ 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({ data: data, username: currentUser, token: currentToken }) 
    });
    
    if (!res.ok) {
      showToast('error', 'Erro ao salvar.');
      return;
    }
    showToast('cloud_done', 'Salvo na nuvem!');
  } catch(e){ 
    console.error(e); 
    showToast('error', 'Falha de conexão.');
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
    const resp=await fetch(`/api/load?month=${month}`);
    const data=await resp.json();
    if(!data) { updateCounts(); return; }
    
    if (db && db.approval_posts) {
      db.approval_posts.forEach(ap => {
        const id = ap.id;
        const comments=data.comments?.[id]||[];
        const cl=document.getElementById(`comments-${id}`);
        if(cl && comments.length){
          cl.innerHTML = ''; 
          comments.forEach(html=>{ const div=document.createElement('div'); div.className='comment-item'; div.innerHTML=html; cl.appendChild(div); });
          const bc = document.getElementById(`bc-${id}`);
          if(bc) bc.classList.add('visible');
        }
        const s=data.statuses?.[id]||'none'; 
        if(s!=='none') applyStatus(id,s);
      });
    }
  } catch(e){ console.error('Erro ao carregar:',e); }
  updateCounts();
}

async function clearState(){
  if(!confirm('Limpar todas as respostas e comentários no sistema?')) return;
  if (!currentUser || !currentToken) { alert('Você precisa estar logado para limpar os dados.'); return; }
  try {
    showToast('sync', 'Limpando dados...');
    const res = await fetch(`/api/save?month=${month}`,{ 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({ data: { statuses: {}, comments: {} }, username: currentUser, token: currentToken }) 
    });
    if (res.ok) {
      showToast('check_circle', 'Sistema resetado!');
      setTimeout(() => location.reload(), 1000);
    }
  } catch(e){ 
    console.error(e);
  }
}

// Reveal observer
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  },{ threshold:0.1, rootMargin:'0px 0px -40px 0px' });

/* ── Lightbox ── */
let lbPost=null, lbIdx=0;

function openLightbox(postId){
  lbPost=postId; 
  lbIdx = (ig[postId] && ig[postId].i) ? ig[postId].i : 0;
  renderLightbox();
  populateLbRight(postId);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}

function renderLightbox(){
  const ap = db.approval_posts.find(p => p.id === lbPost);
  if(!ap) return;
  const track=document.getElementById('lbTrack');
  const prev=document.getElementById('lbPrev');
  const next=document.getElementById('lbNext');
  const dots=document.getElementById('lbDots');

  if (ap.type === 'video') {
    track.innerHTML = `<div class="lb-track-item">${ap.html_content || `<video src="${ap.images[0]}" autoplay muted loop playsinline controls style="max-height:80vh; max-width:100%;"></video>`}</div>`;
    prev.style.display = next.style.display = 'none';
    dots.innerHTML = '';
    track.style.transform = `translateX(0%)`;
    return;
  }

  const srcs = ap.images || [];
  const total = srcs.length;

  if(track.getAttribute('data-post') !== lbPost){
    track.innerHTML = '';
    srcs.forEach(src => {
      const div = document.createElement('div');
      div.className = 'lb-track-item';
      div.innerHTML = `<img src="${src}" loading="lazy">`;
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
  const ap = db.approval_posts.find(p => p.id === postId);
  if(!ap) return;
  
  const cap=document.getElementById('lbCaption');
  if(cap) {
    let capText = ap.caption || '';
    cap.innerHTML=`<strong>${db.client.username}</strong> ${capText}`;
  }
  
  const cardsEl=document.getElementById('lbCards');
  if(ap.copy && ap.copy.length){
    cardsEl.innerHTML='<div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#999;margin-bottom:6px">TEXTO</div>';
    ap.copy.forEach((c,i)=>{
      const d=document.createElement('div');
      d.className='lb-rcard';
      d.innerHTML=`<div class="lb-rcard-num">Slide ${i+1}</div>${c}`;
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
function lbSlide(dir){ 
  const ap = db.approval_posts.find(p => p.id === lbPost);
  if(!ap) return;
  const newIdx=lbIdx+dir; 
  if(newIdx<0||newIdx>=ap.images.length) return; 
  lbGo(newIdx); 
}
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; lbPost=null; }
document.addEventListener('keydown',(e)=>{ if(!lbPost) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight') lbSlide(1); if(e.key==='ArrowLeft') lbSlide(-1); });

/* ── Posts Carousel Logic ── */
function moveMainPosts(dir) {
  const track = document.getElementById("mainPostsTrack");
  if (!track) return;
  const slides = track.querySelectorAll(".post-section");
  if (!slides.length) return;
  const currentIdx = Math.round(track.scrollLeft / track.offsetWidth);
  let targetIdx = currentIdx + dir;
  if (targetIdx >= 0 && targetIdx < slides.length) {
    slides[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
}

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

function initIndicator() {
  const slides = document.querySelectorAll('.post-section');
  if (slides.length === 0) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active-slide');
        const idx = Array.from(slides).indexOf(e.target);
        updatePostIndicator(idx);
      } else {
        e.target.classList.remove('active-slide');
      }
    });
  }, { threshold: 0.55, root: document.getElementById("mainPostsTrack") });
  slides.forEach(s => obs.observe(s));
}

/* ── Mobile Meta Bar ── */
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
window.addEventListener('resize', setupMobileMeta);
