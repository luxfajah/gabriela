import re

html_files = ['abril.html', 'junho.html']

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update igp-bio-name
    html = re.sub(r'(<div class="igp-bio-name">\s*).*?(?=\s*</div>)', 
                  r'\1Gabriela Saueressig | Ginecologia &amp; Cirurgia Ginecológica', html)

    # 2. Update igp-stats
    new_stats = """<div class="igp-stat"><div class="igp-stat-num">192</div><div class="igp-stat-lbl">posts</div></div>
              <div class="igp-stat"><div class="igp-stat-num">2.503</div><div class="igp-stat-lbl">seguidores</div></div>
              <div class="igp-stat"><div class="igp-stat-num">1.982</div><div class="igp-stat-lbl">seguindo</div></div>"""
    html = re.sub(r'<div class="igp-stats">.*?</div>\s*(<div class="igp-bio">)', 
                  f'<div class="igp-stats">\n              {new_stats}\n            </div>\n\n            \\1', html, flags=re.DOTALL)

    # 3. Update igp-bio
    new_bio = """| Ginecologia Geral e Cirurgia Ginecológica<br>| CRM 47527 • RQE 44082 • RQE 46316<br>| Laparoscopia • Histeroscopia •... <span style="color:#a0a0a0;">mais</span>"""
    html = re.sub(r'(<div class="igp-bio">\s*).*?(?=\s*</div>)', 
                  r'\1' + new_bio, html, flags=re.DOTALL)

    # 4. Update link
    html = re.sub(r'<a href="#" class="igp-bio-link">.*?</a>', 
                  '<a href="https://linktr.ee/ginecogabrielasaueressig" class="igp-bio-link" target="_blank" style="color:#00376b;text-decoration:none;">🔗 linktr.ee/ginecogabrielasaueressig</a>', html)

    # 5. Update followed by
    followed_html = """<div class="igp-followed" style="display:flex; align-items:center; margin-top:10px;">
              <div class="igp-followed-pics" style="display:flex;">
                <img src="tthacy.webp" alt="tthacy" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:2px solid #fff;" loading="lazy">
                <img src="duasmaos.webp" alt="dduasmaos" style="width:24px;height:24px;border-radius:50%;object-fit:cover;margin-left:-8px;border:2px solid #fff;" loading="lazy">
              </div>
              <span class="igp-followed-text" style="font-size:12px; margin-left:8px; color:#262626;">Seguido(a) por <strong>tthacy</strong>, <strong>dduasmaos</strong> e outras 2 pessoas</span>
            </div>"""
    
    html = re.sub(r'<div class="igp-followed">.*?<div class="igp-actions">', 
                  followed_html + '\n\n            <div class="igp-actions">', html, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
