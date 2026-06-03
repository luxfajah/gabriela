import os

files_to_update = [
    'index.html',
    'maio.html',
    'maio.css',
    'maio.js',
    'build_maio.py',
    'build_maio_js.py',
    'build_maio_js2.py',
    'build_abril.py',
    'build_abril_js.py',
    'patch_links.py',
    'fix_css.py',
    'fix_all.py',
    'apply_copy.py'
]

for filename in files_to_update:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update text references
        content = content.replace('junho.html', 'maio.html')
        content = content.replace('junho.css', 'maio.css')
        content = content.replace('junho.js', 'maio.js')
        content = content.replace('Junho', 'Maio')
        content = content.replace('junho', 'maio')
        content = content.replace('JUNHO', 'MAIO')

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

