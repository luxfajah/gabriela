import re

with open('/Users/luxfajah/gabriela/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add CSS
login_css = """
    /* ── Login Screen ──────────────────────────────────────── */
    .login-screen {
      position: fixed; inset: 0; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.5s, visibility 0.5s;
      overflow: hidden;
    }
    .login-screen::before {
      content: ""; position: absolute; inset: 0;
      background: #2E4F3E;
      z-index: -1;
    }
    .login-screen::after {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(circle at 20% 30%, rgba(6, 95, 70, 0.12), transparent),
                  radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2), transparent);
      z-index: -1;
    }
    .login-screen.hidden {
      opacity: 0; visibility: hidden; pointer-events: none;
    }
    .login-box {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(45px) saturate(1.8);
      -webkit-backdrop-filter: blur(45px) saturate(1.8);
      padding: 60px 44px; border-radius: 40px; text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.25);
      width: 90%; max-width: 380px;
      box-shadow: 0 50px 140px rgba(0, 0, 0, 0.3),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      animation: loginAppear 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes loginAppear {
      from { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(10px); }
      to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    .login-box img { max-width: 220px; margin-bottom: 32px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1)); }
    .login-box h2 { 
      font-family: 'Canela', 'Fraunces', 'Playfair Display', serif; 
      color: #fff; 
      margin-bottom: 32px; 
      font-weight: 300; 
      font-size: 24px;
      letter-spacing: 0.02em;
      text-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .login-box input {
      width: 100%; padding: 16px 20px; margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px;
      background: rgba(255, 255, 255, 0.1); color: #fff; outline: none;
      font-family: 'Inter', sans-serif; font-size: 14px;
      box-sizing: border-box; transition: all 0.3s;
    }
    .login-box input::placeholder { color: rgba(255, 255, 255, 0.5); }
    .login-box input:focus { 
      border-color: rgba(255, 255, 255, 0.6); 
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
    .login-box button {
      width: 100%; padding: 16px; 
      background: #fff; 
      color: #7A1E2C; 
      border: none; border-radius: 16px; 
      font-weight: 700; font-family: 'Inter', sans-serif;
      font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;
      cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      margin-top: 8px;
    }
    .login-box button:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }
    .login-error { color: #fff; font-size: 13px; margin-top: 20px; min-height: 20px; font-weight: 400; opacity: 0.9; }
    
    body.locked {
      overflow: hidden;
      height: 100vh;
    }
  </style>
"""
if "/* ── Login Screen" not in html:
    html = html.replace('</style>', login_css)

# Add HTML
login_html = """
<div id="login-screen" class="login-screen">
  <div class="login-box">
    <img src="logos/logo header.webp" alt="Gabriela Saueressig">
    <h2>Acesso Exclusivo</h2>
    <input type="text" id="login-user" placeholder="Usuário" autocomplete="off">
    <input type="password" id="login-pass" placeholder="Senha" autocomplete="off">
    <button id="login-btn">Entrar</button>
    <div id="login-error" class="login-error"></div>
  </div>
</div>
"""
if '<div id="login-screen"' not in html:
    html = html.replace('<body>', f'<body>\n{login_html}')

# Add JS
login_js = """
<script>
  const loginScreen = document.getElementById('login-screen');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  
  let currentUser = sessionStorage.getItem('authUser') || '';
  let currentToken = sessionStorage.getItem('authToken') || '';

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (!currentUser) {
      sessionStorage.setItem('authUser', 'admin');
      sessionStorage.setItem('authToken', 'token_valid_admin');
      currentUser = 'admin';
      currentToken = 'token_valid_admin';
    }
  }

  if (!currentUser || !currentToken) {
    if (loginScreen) loginScreen.classList.remove('hidden');
    document.body.classList.add('locked');
  } else {
    if (loginScreen) loginScreen.classList.add('hidden');
    document.body.classList.remove('locked');
  }

  if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const u = document.getElementById('login-user').value.trim().toLowerCase();
      const p = document.getElementById('login-pass').value.trim();
      if(!u || !p) { loginError.textContent = 'Preencha todos os campos.'; return; }
      
      loginBtn.textContent = 'Aguarde...';
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: u, password: p})
        });
        const data = await res.json();
        if(res.ok && data.success) {
          sessionStorage.setItem('authUser', data.username);
          sessionStorage.setItem('authToken', data.token);
          currentUser = data.username;
          currentToken = data.token;
          loginScreen.classList.add('hidden');
          document.body.classList.remove('locked');
        } else {
          loginError.textContent = 'Usuário ou senha incorretos.';
        }
      } catch(e) {
        loginError.textContent = 'Erro ao conectar. Tente novamente.';
      }
      loginBtn.textContent = 'Entrar';
    });
  }
</script>
</body>
"""
if 'const loginScreen = document.getElementById' not in html:
    html = html.replace('</body>', login_js)

with open('/Users/luxfajah/gabriela/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
