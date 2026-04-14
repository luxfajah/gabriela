import json

posts = [
    {
        "id": "1",
        "date": "06/04/2026",
        "type": "Carrossel",
        "funnel": "Topo de Funil",
        "title": "Dor na relação",
        "title_html": "Dor na<br><em>relação</em>",
        "legenda": "Dor na relação ainda é um tema pouco falado e, muitas vezes, normalizado, mas sentir dor não é algo que você precisa aceitar ou aprender a conviver. Na prática, esse sintoma pode ter diferentes causas, e cada uma delas precisa de uma avaliação cuidadosa. Se isso faz parte da sua realidade, vale investigar.",
        "slides": [
            "Dor na relação não é algo que você “tem que aprender a lidar”!",
            "Dor durante a relação pode ter diferentes causas:<br><br>– infecções<br>– endometriose<br>– vaginismo<br>– fatores emocionais",
            "Mas muitas mulheres aprendem, em silêncio, adaptar o corpo ao desconforto. E, aos poucos, o que deveria ser um momento de conexão, vira algo evitado, tolerado ou até temido.",
            "Com avaliação adequada, é possível entender a causa e definir o melhor caminho para o seu caso."
        ],
        "bg": ["bg-1", "bg-2", "bg-3", "bg-4"]
    },
    {
        "id": "2",
        "date": "09/04/2026",
        "type": "Vídeo",
        "funnel": "Meio de Funil",
        "title": "Canetinhas emagrecedoras",
        "title_html": "Canetinhas<br><em>emagrecedoras</em>",
        "legenda": "O uso das chamadas “canetas emagrecedoras” cresceu muito nos últimos anos, mas o que pouca gente entende é que elas não são neutras para o restante do organismo.<br><br>Quando você omite uma informação como essa na consulta, a gente perde a capacidade de olhar o todo e passa a tomar decisões com peças faltando.",
        "slides": [
            "[Cena 1] Se você usa as famosas canetinhas emagrecedoras, a sua ginecologista precisa saber, sabe por quê?",
            "[Cena 2] Essas medicações (como semaglutida e liraglutida) não atuam só na perda de peso. Elas impactam o funcionamento do seu corpo como um todo e isso inclui o sistema reprodutivo.",
            "[Cena 3] Os análogos do GLP-1 diminuem a resistência à insulina, e isso pode restaurar o ciclo menstrual de algumas mulheres...",
            "[Cena 4] Além disso, retardam o esvaziamento gástrico, o que pode diminuir a absorção do seu anticoncepcional oral.",
            "[Cena 5] Nesses casos, podemos optar pelo uso dos DIUs, Implanon ou anel vaginal, por exemplo."
        ],
        "bg": ["bg-5", "bg-6", "bg-7", "bg-8", "bg-9"]
    },
    {
        "id": "3",
        "date": "14/04/2026",
        "type": "Post Único",
        "funnel": "Meio de Funil",
        "title": "\"Soluções rápidas\"",
        "title_html": "<em>“Soluções</em><br>rápidas”",
        "legenda": "A gente vive um tempo em que tudo precisa ser imediato: resultado rápido, promessa fácil, solução pronta, mas quando o assunto é saúde, e principalmente cirurgia ginecológica, não existe atalho responsável.<br><br>Por trás de cada decisão, existe estudo, análise, escuta e, muitas vezes, a escolha de NÃO fazer nada naquele momento. E eu sei… isso pode frustrar, mas é justamente aí que mora o cuidado de verdade.<br><br>Nem sempre o que você viu na internet é o que o seu corpo precisa. Meu papel não é te oferecer respostas fáceis, mas te oferecer segurança e uma condução baseada no que realmente faz sentido para você.",
        "slides": [
            "Ser médica na era das “soluções rápidas” não é fácil, mas eu AMO educar sobre o que é seguro e baseado em estudos sólidos e confiáveis!"
        ],
        "bg": ["bg-10"]
    },
    {
        "id": "4",
        "date": "16/04/2026",
        "type": "Post Único",
        "funnel": "",
        "title": "Candidíase de repetição",
        "title_html": "Candidíase<br><em>de repetição</em>",
        "legenda": "Candidíase recorrente não deve ser tratada apenas como infecção, mas como um indicativo de desequilíbrio na microbiota vaginal e no organismo.<br><br>Isso porque a microbiota vaginal é um ecossistema complexo, regulado por fatores hormonais, imunológicos e comportamentais. Quando esse equilíbrio se altera, o crescimento de fungos como a Candida deixa de ser controlado.<br><br>E é por isso que tratar apenas com medicações antifúngicas, sem investigar o contexto, costuma levar a ciclos repetidos de melhora.<br><br>Na dúvida, consulte a sua ginecologista.",
        "slides": [
            "Candidíase de repetição é um sinal de que algo no seu corpo está em desequilíbrio e não olhar para isso é o que faz ela voltar."
        ],
        "bg": ["bg-11"]
    },
    {
        "id": "5",
        "date": "21/04/2026",
        "type": "Carrossel",
        "funnel": "Topo de Funil",
        "title": "Vacina do HPV",
        "title_html": "Vacina<br><em>do HPV</em>",
        "legenda": "Quando a gente fala em vacina contra o HPV, estamos falando de reduzir riscos lá na frente. Isso porque o HPV é extremamente comum, mas as consequências dele não precisam ser.<br><br>A vacina entra como uma camada de proteção importante, diminuindo as chances de desenvolvimento de lesões e, principalmente, a evolução dessas lesões para câncer ao longo da vida.<br><br>Por isso, se você está dentro da faixa indicada, vale considerar essa proteção como parte do seu cuidado contínuo.",
        "slides": [
            "Depois de já ter tido relação sexual, vale a pena fazer a vacina do HPV?",
            "Existem mais de 100 tipos de vírus do HPV, e é muito improvável que você já tenha sido exposta a todos eles mesmo após iniciar a atividade sexual.",
            "A vacina vai te proteger contra os tipos mais graves de HPV, aqueles que causam câncer, além de evitar reinfecções...",
            "Por isso, a minha recomendação é clara: se você estiver dentro da faixa indicada, vale sim considerar a vacinação como parte do seu cuidado com a saúde."
        ],
        "bg": ["bg-12", "bg-13", "bg-1", "bg-2"]
    },
    {
        "id": "6",
        "date": "23/04/2026",
        "type": "Vídeo Lo-fi",
        "funnel": "Topo de Funil",
        "title": "Indicação de cirurgia",
        "title_html": "Indicação<br><em>de cirurgia</em>",
        "legenda": "Nem toda alteração precisa de cirurgia e isso é algo que precisa ser compreendido, assim como nem toda cirurgia pode ser adiada.<br><br>Entre esses dois extremos, existe o que realmente importa: análise clínica.<br><br>Indicar um procedimento sem necessidade expõe a paciente a riscos desnecessários, assim como deixar de indicar quando há benefício também compromete o cuidado.<br><br>Por isso, a decisão nunca é automática. Ela passa por análise, contexto e, principalmente, pelo impacto na vida de quem está ali. Por isso, nas minhas consultas, sempre há avaliação cuidadosa e análise de contexto para decidirmos os próximos passos juntas e de maneira consciente.",
        "slides": [
            "[Vídeo Orgânico / Café]<br><br>Indicar cirurgia sem necessidade é tão inadequado quanto deixar de indicar quando ela é necessária."
        ],
        "bg": ["bg-8"]
    },
    {
        "id": "7",
        "date": "27/04/2026",
        "type": "Carrossel",
        "funnel": "Meio de Funil",
        "title": "Coisas que eu faço<br>sendo médica",
        "title_html": "O que eu<br><em>faço</em>",
        "legenda": "O meu compromisso é sempre com o cuidado, por isso, as minhas decisões nem sempre levarão a operar mais. Isso porque cada decisão sempre passará por análise de cenário e impacto na vida de cada paciente.",
        "slides": [
            "Coisas que eu faço sendo médica ginecologista com foco em cirurgia ginecológica",
            "Nem sempre eu vou te indicar cirurgia, por mais que tu queira muito, porque isso não seria adequado da minha parte.",
            "Eu não vou te indicar soluções rápidas e milagrosas para problemas complexos.",
            "Eu não tomo decisões baseada apenas em um exame isolado.",
            "Eu não sigo conduta automática só porque “é o mais comum”. Eu considero o teu momento, tua rotina e teus planos antes de qualquer indicação."
        ],
        "bg": ["bg-4", "bg-5", "bg-6", "bg-7", "bg-3"]
    },
    {
        "id": "8",
        "date": "28/04/2026",
        "type": "Post Único",
        "funnel": "Fundo de Funil",
        "title": "Não precisa saber tudo",
        "title_html": "O óbvio que<br><em>precisa ser dito</em>",
        "legenda": "Muitas pacientes acham que precisam saber tudo antes de virem para a consulta. E, por isso, chegam já preocupadas. A verdade é que eu estou aqui justamente para isso: para tirar todas as tuas dúvidas com responsabilidade e cuidado.<br><br>Minha consulta acontece em Porto Alegre e é um espaço de cuidado, atenção e entendimento de possibilidades para cada caso. Agende diretamente pelo link da bio!",
        "slides": [
            "O óbvio que precisa ser dito: você não precisa chegar na consulta sabendo explicar tudo."
        ],
        "bg": ["bg-10"]
    }
]

import os
with open('/Users/luxfajah/gabriela/aprovacao.html', 'r', encoding='utf-8') as f:
    template = f.read()

# I will just write a new html string completely. It's safer.
