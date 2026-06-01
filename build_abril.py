import re
import os

with open('/Users/luxfajah/gabriela/junho.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Basic replacements
html = html.replace('junho.css?v=2.2', 'junho.css?v=2.2') # keep using junho.css, or maybe style.css. I will just keep junho.css as it is the layout driver.
html = html.replace('junho.js', 'abril.js')

html = html.replace('0 de 8 aprovados', '0 de 6 aprovados')
html = html.replace('8 posts', '6 posts')
html = html.replace('Planejamento de conteúdo · Junho 2026', 'Planejamento de conteúdo · Abril 2026')
html = html.replace('Planejamento · Junho 2026', 'Planejamento · Abril 2026')
html = html.replace('8 posts estratégicos', '6 posts estratégicos')
html = html.replace('id="f-pending">8<', 'id="f-pending">6<')

posts_data = [
    {
        'id': '1', 'title': 'Post 1', 'type': 'Carrossel', 'caption': 'Dor na relação não é normal!<br>Com avaliação adequada, é possível entender a causa e traçar o melhor tratamento pra cada caso.', 
        'slides': ['Post 1 - 1.webp', 'Post 1 - 2.webp', 'Post 1 - 3.webp', 'Post 1 - 4.webp', 'Post 1 - 5.webp', 'Post 1 - 6.webp', 'Post 1 - 7.webp'],
        'folder': 'posts abril'
    },
    {
        'id': '2', 'title': 'Post 2', 'type': 'Carrossel', 'caption': 'É normal sair um cheiro "sujo"...',
        'slides': ['Post 2 - 1.webp', 'Post 2 - 2.webp', 'Post 2 - 3.webp', 'Post 2 - 4.webp'],
        'folder': 'posts abril'
    },
    {
        'id': '3', 'title': 'Post 3', 'type': 'Imagem', 'caption': 'A menstruação limpa o corpo?',
        'media': '<img src="posts abril/Post 3.webp" style="width:100%; height:auto; display:block;" alt="Post 3" loading="lazy">',
        'grid_media': '<img src="posts abril/Post 3.webp" alt="Post 3" loading="lazy" decoding="async">'
    },
    {
        'id': '4', 'title': 'Post 4', 'type': 'Carrossel', 'caption': 'Candidíase de repetição',
        'slides': ['Post 4 - 1.webp', 'Post 4 - 2.webp', 'Post 4 - 3.webp', 'Post 4 - 4.webp'],
        'folder': 'posts abril'
    },
    {
        'id': '5', 'title': 'Post 5', 'type': 'Carrossel', 'caption': 'Vacina HPV',
        'slides': ['Post 5 - 1.webp', 'Post 5 - 2.webp', 'Post 5 - 3.webp', 'Post 5 - 4.webp', 'Post 5 - 5.webp'],
        'folder': 'posts abril'
    },
    {
        'id': '6', 'title': 'Post 6', 'type': 'Carrossel', 'caption': 'Mioma e cirurgias',
        'slides': ['Post 6 - 1.webp', 'Post 6 - 2.webp', 'Post 6 - 3.webp', 'Post 6 - 4.webp', 'Post 6 - 5.webp'],
        'folder': 'posts abril'
    }
]

# Generate IGP Grid (the 3xN grid on the profile replica)
igp_grid_html = ""
for idx, p in enumerate(posts_data):
    if 'slides' in p:
        img_src = f"{p['folder']}/{p['slides'][0]}"
        grid_media = f'<img src="{img_src}" alt="{p["title"]}" loading="lazy" decoding="async">'
    else:
        grid_media = p['grid_media']
    
    igp_grid_html += f"""
        <div class="igp-grid-item" onclick="openLightbox('{p['id']}')">
          {grid_media}
          <span class="grid-num">0{p['id']}</span>
        </div>"""

# Replace the igp-grid in HTML
html = re.sub(r'<div class="igp-grid">.*?</div>\s*</div>\s*</div>\s*</section>', 
              f'<div class="igp-grid">{igp_grid_html}\n      </div>\n    </div>\n  </div>\n</section>', html, flags=re.DOTALL)

# Generate Post Indicator
indicator_html = ""
for idx, p in enumerate(posts_data):
    cls = "pi-item active" if idx == 0 else "pi-item"
    indicator_html += f'<div class="{cls}" data-idx="{idx}" onclick="goToPost({idx})">{p["id"]}</div>'
    if idx < len(posts_data) - 1:
        indicator_html += '\n    <div class="pi-sep">–</div>\n    '
html = re.sub(r'<div class="post-indicator" id="postIndicator">.*?</div>', f'<div class="post-indicator" id="postIndicator">\n    {indicator_html}\n  </div>', html, flags=re.DOTALL)

# Generate Main Posts
main_posts_html = ""
for p in posts_data:
    if 'slides' in p:
        slides_html = ""
        for s in p['slides']:
            slides_html += f'<div class="ig-slide"><img src="{p["folder"]}/{s}" loading="lazy" decoding="async"></div>\n            '
        media_html = f"""<div class="ig-carousel" style="cursor:pointer" onclick="openLightbox('{p['id']}')">
          <div class="ig-track" id="itrack-{p['id']}">
            {slides_html}
          </div>
          <div class="ig-dots" id="idots-{p['id']}"></div>
          <button class="ig-arrow prev" onclick="igSlide('{p['id']}', -1)">‹</button>
          <button class="ig-arrow next" onclick="igSlide('{p['id']}', 1)">›</button>
        </div>"""
    else:
        media_html = f"""<div class="ig-carousel" style="cursor:pointer" onclick="openLightbox('{p['id']}')">
          {p['media']}
        </div>"""

    main_posts_html += f"""
<!-- ══ POST {p['id']} ══ -->
<section class="post-section" id="sec-{p['id']}" style="position:relative;">
  <div class="post-split">
    <div class="reveal">
      <div class="post-num-badge"><div class="pnb-dot">{p['id']}</div> Post {p['id']}</div>
      <div class="ig-phone">
        <div class="ig-bar">
          <div class="ig-ava"><img src="foto.webp" alt="Gabriela Saueressig"></div>
          <div><div class="ig-handle">gabrielasaueressig_</div></div>
          <div class="ig-type" id="type-{p['id']}">{p['type']}</div>
        </div>
        {media_html}
        <div class="ig-foot">
          <p class="ig-cap"><strong>gabrielasaueressig_</strong> Planejamento de conteúdo em aprovação.</p>
        </div>
      </div>
    </div>
    <div class="post-panel reveal" style="transition-delay:.1s">
      <div class="post-head">
        <div class="post-eyebrow">
          <span id="eyebrow-{p['id']}">{p['type']}</span>
          <span class="v3-badge">v1</span>
        </div>
        <h3 class="post-title">Peça 0{p['id']} — <em>{p['title']}</em></h3>
        <div class="sb sb-none" id="badge-{p['id']}"><span class="sbp"></span>Aguardando</div>
      </div>

      <div class="blk-label">Legenda</div>
      <div class="caption-blk">
        <span class="handle">gabrielasaueressig_</span> {p['caption']}
      </div>

    </div>
  </div>
  <div class="post-actions-below">
    <div class="reject-alert" id="ralert-{p['id']}">⚠ Para reprovar, adicione um comentário primeiro.</div>
    <div class="actions">
      <div class="actions-left">
        <button class="abtn btn-ap" id="ba-{p['id']}" onclick="event.stopPropagation(); setStatus('{p['id']}','approved')">✓ Aprovar</button>
        <button class="abtn btn-rj" id="br-{p['id']}" onclick="event.stopPropagation(); setStatus('{p['id']}','rejected')">✎ Reprovar</button>
        <button class="abtn btn-lt" id="bl-{p['id']}" onclick="event.stopPropagation(); openReviewModal('{p['id']}')">⏳ Revisar</button>
      </div>
      <button class="abtn btn-cm" id="bc-{p['id']}" onclick="event.stopPropagation(); openCommentsModal('{p['id']}')">💬 Comentários</button>
    </div>
  </div>
</section>
"""

html = re.sub(r'<div class="posts-horizontal-track" id="mainPostsTrack">.*?</div>\s*</section>', f'<div class="posts-horizontal-track" id="mainPostsTrack">\n{main_posts_html}\n</div>\n</section>', html, flags=re.DOTALL)

# Generate Hidden Comments Data
hidden_comments_html = ""
for i in range(1, 7):
    hidden_comments_html += f'<div id="comments-{i}"></div>\n  '
html = re.sub(r'<div id="hiddenCommentsData" style="display:none">.*?</div>', f'<div id="hiddenCommentsData" style="display:none">\n  {hidden_comments_html}\n</div>', html, flags=re.DOTALL)

# Generate Downloads Grid
downloads_grid_html = """
      <a href="#" class="dl-card dl-all">
        <div class="dl-icon">📁</div>
        <div class="dl-info">
          <div class="dl-label">Todos os conteúdos</div>
          <div class="dl-sub">Pasta completa</div>
        </div>
        <div class="dl-arrow">↗</div>
      </a>
"""
for p in posts_data:
    downloads_grid_html += f"""
      <a href="#" class="dl-card">
        <div class="dl-num">0{p['id']}</div>
        <div class="dl-info">
          <div class="dl-label">Post {p['id']}</div>
          <div class="dl-sub">Baixar Arquivo</div>
        </div>
        <div class="dl-arrow">↗</div>
      </a>"""

html = re.sub(r'<div class="downloads-grid">.*?</div>\s*</div>\s*</section>', f'<div class="downloads-grid">{downloads_grid_html}\n    </div>\n  </div>\n</section>', html, flags=re.DOTALL)


with open('/Users/luxfajah/gabriela/abril.html', 'w', encoding='utf-8') as f:
    f.write(html)
