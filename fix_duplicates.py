import re

for filename in ['junho.html', 'abril.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    html = re.sub(r'(</div>\s*</section>)\s*<!-- ══ POST 2 ══ -->.*?<!-- Modal de Erro Persistente -->',
                  r'\1\n\n<!-- Modal de Erro Persistente -->', html, flags=re.DOTALL)
                  
    html = re.sub(r'(<div id="hiddenCommentsData" style="display:none">.*?</div>)\s*<div id="comments-2"></div>.*?<!-- ═══════════════ PROJECT VIEWER ═══════════════ -->',
                  r'\1\n\n<!-- ═══════════════ PROJECT VIEWER ═══════════════ -->', html, flags=re.DOTALL)
                  
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)

