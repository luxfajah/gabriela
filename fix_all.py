import re

# 1. FIX CSS
with open('maio.css', 'r', encoding='utf-8') as f:
    css = f.read()

bg_gradient = "background: linear-gradient(135deg, #b86e7a 0%, #7a3a45 100%);"

# Replace hero-bg
css = re.sub(r'(\.hero-bg\s*\{\s*position:\s*absolute;\s*inset:\s*0;\s*)background-image:[^}]+(\})',
             r'\1' + bg_gradient + r'\n\2', css)

# Replace login-screen::before
css = re.sub(r'(\.login-screen::before\s*\{\s*content:\s*"";\s*position:\s*absolute;\s*inset:\s*0;\s*)background:[^;]+;(\s*z-index:\s*-1;\s*\})',
             r'\1' + bg_gradient + r'\2', css)

# Replace preloader::before
css = re.sub(r'(\.preloader::before\s*\{\s*content:\s*"";\s*position:\s*absolute;\s*inset:\s*-5%;\s*)background:[^;]+;(\s*z-index:\s*-1;\s*\})',
             r'\1' + bg_gradient + r'\2', css)

with open('maio.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. FIX HTMLs
def repair_file(filepath, build_script):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    with open(build_script, 'r', encoding='utf-8') as f:
        script = f.read()
        
    # Extract posts_data and html building logic
    # We will just execute the script but modify its regex locally
    script = script.replace(r're.sub(r\'<div class="posts-horizontal-track" id="mainPostsTrack">.*?</div>\s*</section>\'', 
                            r're.sub(r\'<div class="posts-horizontal-track" id="mainPostsTrack">.*?<!-- Modal de Erro Persistente -->\'')
    script = script.replace(r'f\'<div class="posts-horizontal-track" id="mainPostsTrack">\n{main_posts_html}\n</div>\n</section>\'',
                            r'f\'<div class="posts-horizontal-track" id="mainPostsTrack">\n{main_posts_html}\n</div>\n</section>\n\n<!-- Modal de Erro Persistente -->\'')
    
    script = script.replace(r're.sub(r\'<div id="hiddenCommentsData" style="display:none">.*?</div>\'',
                            r're.sub(r\'<div id="hiddenCommentsData" style="display:none">.*?<!-- ═══════════════ PROJECT VIEWER ═══════════════ -->\'')
    script = script.replace(r'f\'<div id="hiddenCommentsData" style="display:none">\n  {hidden_comments_html}\n</div>\'',
                            r'f\'<div id="hiddenCommentsData" style="display:none">\n  {hidden_comments_html}\n</div>\n\n<!-- ═══════════════ PROJECT VIEWER ═══════════════ -->\'')
                            
    # Run the modified script in this namespace
    exec(script)

repair_file('maio.html', 'build_maio.py')
repair_file('abril.html', 'build_abril.py')

# 3. APPLY PATCH LINKS TO MAIO.HTML
with open('maio.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<a href="#" class="dl-card dl-all">', '<a href="https://drive.google.com/drive/folders/1EExEgY4re3bINYe6tXYdZaYX6t59_2OF?usp=drive_link" class="dl-card dl-all" target="_blank">')

def patch_link(post_num, link):
    pattern = rf'(<a href=")(#)(" class="dl-card">\s*<div class="dl-num">0{post_num}</div>)'
    return re.sub(pattern, rf'\1{link}" class="dl-card" target="_blank">\n        <div class="dl-num">0{post_num}</div>', html)

html = patch_link(2, 'https://drive.google.com/drive/folders/19vXQD2Ko8kXIQupXDL-8okzoR4LX6oep?usp=drive_link')
html = patch_link(4, 'https://drive.google.com/drive/folders/1lz28GdGhOa7NxAif0DVivy-_7JTcMAXj?usp=drive_link')
html = patch_link(6, 'https://drive.google.com/drive/folders/1rFtYJHbPDEQf6ub8Re-Q0aUGX0Lx-gaj?usp=drive_link')
html = patch_link(7, 'https://drive.google.com/drive/folders/1TnvCs48rAoVKc0X4bHhJlJmqVggIgv_s?usp=drive_link')

with open('maio.html', 'w', encoding='utf-8') as f:
    f.write(html)
