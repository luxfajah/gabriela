import re

with open('/Users/luxfajah/gabriela/maio.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace post numbers: 8 -> 6
js = js.replace("['1','2','3','4','5','6','7','8']", "['1','2','3','4','5','6']")
js = js.replace("{1:'none', 2:'none', 3:'none', 4:'none', 5:'none', 6:'none', 7:'none', 8:'none'}", "{1:'none', 2:'none', 3:'none', 4:'none', 5:'none', 6:'none'}")
js = js.replace("const total = 8;", "const total = 6;")
js = js.replace("['2','4','6']", "['1','2','4','5','6']") # 1,2,4,5,6 are carousels in April

lb_sources_new = """const lbSources = {
    '1': ['posts abril/Post 1 - 1.webp', 'posts abril/Post 1 - 2.webp', 'posts abril/Post 1 - 3.webp', 'posts abril/Post 1 - 4.webp', 'posts abril/Post 1 - 5.webp', 'posts abril/Post 1 - 6.webp', 'posts abril/Post 1 - 7.webp'],
    '2': ['posts abril/Post 2 - 1.webp', 'posts abril/Post 2 - 2.webp', 'posts abril/Post 2 - 3.webp', 'posts abril/Post 2 - 4.webp'],
    '3': ['posts abril/Post 3.webp'],
    '4': ['posts abril/Post 4 - 1.webp', 'posts abril/Post 4 - 2.webp', 'posts abril/Post 4 - 3.webp', 'posts abril/Post 4 - 4.webp'],
    '5': ['posts abril/Post 5 - 1.webp', 'posts abril/Post 5 - 2.webp', 'posts abril/Post 5 - 3.webp', 'posts abril/Post 5 - 4.webp', 'posts abril/Post 5 - 5.webp'],
    '6': ['posts abril/Post 6 - 1.webp', 'posts abril/Post 6 - 2.webp', 'posts abril/Post 6 - 3.webp', 'posts abril/Post 6 - 4.webp', 'posts abril/Post 6 - 5.webp'],
    'comece-aqui': ['destaque 1.jpg'],
    'agende': ['destaque 2.jpg']
  };"""
js = re.sub(r'const lbSources = \{.*?\n  \};\n', lb_sources_new + "\n", js, flags=re.DOTALL)


post_meta_new = """const postMeta = {
    '1': { caption: 'Dor na relação não é normal!<br>Com avaliação adequada, é possível entender a causa e traçar o melhor tratamento pra cada caso.', cards: [] },
    '2': { caption: 'É normal sair um cheiro "sujo"...', cards: [] },
    '3': { caption: 'A menstruação limpa o corpo?', cards: [] },
    '4': { caption: 'Candidíase de repetição', cards: [] },
    '5': { caption: 'Vacina HPV', cards: [] },
    '6': { caption: 'Mioma e cirurgias', cards: [] }
  };"""
js = re.sub(r'const postMeta = \{.*?\n  \};\n', post_meta_new + "\n", js, flags=re.DOTALL)

with open('/Users/luxfajah/gabriela/abril.js', 'w', encoding='utf-8') as f:
    f.write(js)
