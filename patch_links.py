import re

with open('/Users/luxfajah/gabriela/maio.html', 'r', encoding='utf-8') as f:
    html = f.read()

# All contents
html = html.replace('<a href="#" class="dl-card dl-all">', '<a href="https://drive.google.com/drive/folders/1EExEgY4re3bINYe6tXYdZaYX6t59_2OF?usp=drive_link" class="dl-card dl-all" target="_blank">')

# Function to patch a specific post
def patch_link(post_num, link):
    pattern = rf'(<a href=")(#)(" class="dl-card">\s*<div class="dl-num">0{post_num}</div>)'
    return re.sub(pattern, rf'\1{link}" class="dl-card" target="_blank">\n        <div class="dl-num">0{post_num}</div>', html)

html = patch_link(2, 'https://drive.google.com/drive/folders/19vXQD2Ko8kXIQupXDL-8okzoR4LX6oep?usp=drive_link')
html = patch_link(4, 'https://drive.google.com/drive/folders/1lz28GdGhOa7NxAif0DVivy-_7JTcMAXj?usp=drive_link')
html = patch_link(6, 'https://drive.google.com/drive/folders/1rFtYJHbPDEQf6ub8Re-Q0aUGX0Lx-gaj?usp=drive_link')
html = patch_link(7, 'https://drive.google.com/drive/folders/1TnvCs48rAoVKc0X4bHhJlJmqVggIgv_s?usp=drive_link')

with open('/Users/luxfajah/gabriela/maio.html', 'w', encoding='utf-8') as f:
    f.write(html)
