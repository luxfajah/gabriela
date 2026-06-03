import re

with open('/Users/luxfajah/gabriela/maio.js', 'r', encoding='utf-8') as f:
    js = f.read()

lb_sources_new = """const lbSources = {
    '1': [],
    '2': ['Maio/Post 2/Post 2 - 1.png', 'Maio/Post 2/Post 2 - 2.png', 'Maio/Post 2/Post 2 - 3.png', 'Maio/Post 2/Post 2 - 4.png', 'Maio/Post 2/Post 2 - 5_1.png'],
    '3': [],
    '4': ['Maio/Post 4/Post 4 - 1.png', 'Maio/Post 4/Post 4 - 2.png', 'Maio/Post 4/Post 4 - 3.png', 'Maio/Post 4/Post 4 - 4.png'],
    '5': [],
    '6': ['Maio/Post 6/Post 6 - 1.png', 'Maio/Post 6/Post 6 - 2.png', 'Maio/Post 6/Post 6 - 3.png', 'Maio/Post 6/Post 6 - 4.png', 'Maio/Post 6/Post 6 - 5.png', 'Maio/Post 6/Post 6 -6.png'],
    '7': ['Maio/Post 7/Post 7.png'],
    '8': []
  };"""
js = re.sub(r'const lbSources = \{.*?\n  \};\n', lb_sources_new + "\n", js, flags=re.DOTALL)


post_meta_new = """const postMeta = {
    '1': { caption: 'Engravidar tomando a pílula? Isso realmente acontece?', cards: [] },
    '2': { caption: 'Coisas que ouvimos por aí que não aguento mais…', cards: [] },
    '3': { caption: '“Meu Deus, eu tenho HPV, que vergonha!”', cards: [] },
    '4': { caption: 'Posso ter relação depois de uma cirurgia ginecológica?', cards: [] },
    '5': { caption: 'Espaço para Gabi: Dúvida comum do consultório', cards: [] },
    '6': { caption: 'Mioma: operar ou não operar?', cards: [] },
    '7': { caption: 'Investimentos para a sua saúde em 2026', cards: [] },
    '8': { caption: 'Quanto tempo vou ficar parada depois da cirurgia?', cards: [] }
  };"""
js = re.sub(r'const postMeta = \{.*?\n  \};\n', post_meta_new + "\n", js, flags=re.DOTALL)


project_data_new = """/* ══ Project Viewer ════════════════════════════════════════ */
const projectData = {
};
"""
js = re.sub(r'/\* ══ Project Viewer.*?\nconst projectData = \{.*?\n\};\n', project_data_new, js, flags=re.DOTALL)

with open('/Users/luxfajah/gabriela/maio.js', 'w', encoding='utf-8') as f:
    f.write(js)
