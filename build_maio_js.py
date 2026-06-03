import re

with open('/Users/luxfajah/gabriela/maio.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace arrays
js = js.replace("['1','2','5','6']", "['2','4','6']") # These are probably carousels to init. Posts 2, 4, 6 are carousels. Wait, what about post 5? Post 5 is missing/placeholder.
js = js.replace("['1','2','3','4','5','6']", "['1','2','3','4','5','6','7','8']")
js = js.replace("{1:'none', 2:'none', 3:'none', 4:'none', 5:'none', 6:'none'}", "{1:'none', 2:'none', 3:'none', 4:'none', 5:'none', 6:'none', 7:'none', 8:'none'}")
js = js.replace("const total = 6;", "const total = 8;")

# The Lightbox LB data might be complex. Let's just strip out the specific hardcoded image arrays and generate ours.
# In Ximenas script, there's `const LB_IMAGES = { ... }` and `const LB_DATA = { ... }`.
# Let's replace the whole LB_IMAGES block.
# Actually, let's just do simple replacements or overwrite the objects if they are at the top.
# Let's find LB_IMAGES.

lb_images = """const LB_IMAGES = {
  '1': [],
  '2': ['Maio/Post 2/Post 2 - 1.png', 'Maio/Post 2/Post 2 - 2.png', 'Maio/Post 2/Post 2 - 3.png', 'Maio/Post 2/Post 2 - 4.png', 'Maio/Post 2/Post 2 - 5_1.png'],
  '3': [],
  '4': ['Maio/Post 4/Post 4 - 1.png', 'Maio/Post 4/Post 4 - 2.png', 'Maio/Post 4/Post 4 - 3.png', 'Maio/Post 4/Post 4 - 4.png'],
  '5': [],
  '6': ['Maio/Post 6/Post 6 - 1.png', 'Maio/Post 6/Post 6 - 2.png', 'Maio/Post 6/Post 6 - 3.png', 'Maio/Post 6/Post 6 - 4.png', 'Maio/Post 6/Post 6 - 5.png', 'Maio/Post 6/Post 6 -6.png'],
  '7': ['Maio/Post 7/Post 7.png'],
  '8': []
};
"""
js = re.sub(r'const LB_IMAGES = \{.*?\};', lb_images, js, flags=re.DOTALL)

lb_data = """const LB_DATA = {
  '1': { title: 'Post 1', items: [] },
  '2': {
    title: 'Post 2',
    items: [
      { img: 'Maio/Post 2/Post 2 - 1.png', sub: 'Slide 1', text: '' },
      { img: 'Maio/Post 2/Post 2 - 2.png', sub: 'Slide 2', text: '' },
      { img: 'Maio/Post 2/Post 2 - 3.png', sub: 'Slide 3', text: '' },
      { img: 'Maio/Post 2/Post 2 - 4.png', sub: 'Slide 4', text: '' },
      { img: 'Maio/Post 2/Post 2 - 5_1.png', sub: 'Slide 5', text: '' }
    ]
  },
  '3': { title: 'Post 3', items: [] },
  '4': {
    title: 'Post 4',
    items: [
      { img: 'Maio/Post 4/Post 4 - 1.png', sub: 'Slide 1', text: '' },
      { img: 'Maio/Post 4/Post 4 - 2.png', sub: 'Slide 2', text: '' },
      { img: 'Maio/Post 4/Post 4 - 3.png', sub: 'Slide 3', text: '' },
      { img: 'Maio/Post 4/Post 4 - 4.png', sub: 'Slide 4', text: '' }
    ]
  },
  '5': { title: 'Post 5', items: [] },
  '6': {
    title: 'Post 6',
    items: [
      { img: 'Maio/Post 6/Post 6 - 1.png', sub: 'Slide 1', text: '' },
      { img: 'Maio/Post 6/Post 6 - 2.png', sub: 'Slide 2', text: '' },
      { img: 'Maio/Post 6/Post 6 - 3.png', sub: 'Slide 3', text: '' },
      { img: 'Maio/Post 6/Post 6 - 4.png', sub: 'Slide 4', text: '' },
      { img: 'Maio/Post 6/Post 6 - 5.png', sub: 'Slide 5', text: '' },
      { img: 'Maio/Post 6/Post 6 -6.png', sub: 'Slide 6', text: '' }
    ]
  },
  '7': {
    title: 'Post 7',
    items: [
      { img: 'Maio/Post 7/Post 7.png', sub: 'Imagem', text: '' }
    ]
  },
  '8': { title: 'Post 8', items: [] }
};
"""
js = re.sub(r'const LB_DATA = \{.*?\n\};\n', lb_data, js, flags=re.DOTALL)

with open('/Users/luxfajah/gabriela/maio.js', 'w', encoding='utf-8') as f:
    f.write(js)
