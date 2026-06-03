import re

with open('maio.css', 'r', encoding='utf-8') as f:
    css = f.read()

bg_gradient = "background: linear-gradient(135deg, #c47c87 0%, #8c424e 100%);"

css = re.sub(r"background:\s*url\('logos/wallpaper\.webp'\)[^;]+;", bg_gradient, css)
css = re.sub(r"(\.login-screen::before\s*\{[^}]*?)background:\s*#2E4F3E;", r"\1" + bg_gradient, css)
css = re.sub(r"(\.preloader::before\s*\{[^}]*?)background:\s*#2E4F3E;", r"\1" + bg_gradient, css)

with open('maio.css', 'w', encoding='utf-8') as f:
    f.write(css)

