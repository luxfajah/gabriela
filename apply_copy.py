import re

with open('maio.html', 'r', encoding='utf-8') as f:
    html = f.read()

copies = {
    '1': """<span class="handle">gabrielasaueressig_</span> <strong>[Vídeo] Engravidar tomando a pílula? Isso realmente acontece?</strong><br><br>
<strong>Cena 1:</strong> Esse vídeo é pra quem usa pílula! Esses dias eu estava conversando com uma amiga minha e ela me comentou que ia começar a tomar Monjaro, e aí eu disse pra ela que teríamos que trocar o anticoncepcional dela, já que a pílula oral pode ter efeito reduzido com o uso dessa medicação, e ela ficou chocada “nossa eu ia só iniciar uma medicação e podia acabar gravida” e é verdade.<br>
Com isso eu resolvi vir aqui comentar sobre a importancia de sempre atualizar a tua ginecologista sobre a tua vida, no geral, porque assim como o uso do Monjaro, vão ter outras causas que podem reduzir o efeito da tua pílula oral.<br>
Como ela depende de tu lembrar de tomar o comprimido todos os dias, esquecer um comprimido já pode reduzir a proteção, dependendo de qual comprimido da cartela foi. Tu tomar a pílyla com mais de 12h de atraso também pode reduzir. Tu ter um episodio de vomito ou de diarreia logo depois de ingerir a pilula tambem, porque ele pode não ter sido absorvido ainda. Algumas outras medicações que são usadas no tratamento de condições especificas como epilepsia tambem podem reduzir a eficácia do método.<br><br>
<strong>Cena 2:</strong> Sim, acontece. E não, não é mito. 0,3 de 100 mulheres no período de 1 ano … 3 MULHERES E A pílula tem dois tipos de eficácia: a eficácia quando tu toma todo dia, no mesmo horário, sem falhar nenhum dia é de,<br><br>
<strong>Cena 3:</strong> A eficácia real, considerando como as pessoas usam de verdade no dia a dia, cai pra cerca de 91%. Isso significa que, em uso típico, cerca de 3 em cada 100 mulheres que usam pílula por um ano podem engravidar.<br><br>
<strong>Cena 4:</strong> Por que isso acontece? Esqueceu um comprimido. Mesmo um dia já reduz a proteção, dependendo de qual comprimido da cartela foi. Tomou com mais de 12 horas de atraso. Teve vômito ou diarreia logo depois de tomar. O comprimido pode não ter sido absorvido. Usou antibiótico. Alguns interferem na absorção. Tomou junto com alguns medicamentos pra epilepsia ou outros. Isso reduz a eficácia de verdade. E tem mais uma coisa que quase ninguém fala: cada pílula tem uma composição diferente. Dose de hormônio, tipo de progestina, combinada ou só progestina.<br><br>
<strong>Cena 5:</strong> Por isso, a pílula não é um método que se escolhe sozinha na farmácia e se usa pra sempre sem rever. Ela precisa ser escolhida com a tua ginecologista, revisada quando a tua vida muda (peso, outros medicamentos, rotina) e usada com informação sobre como ela funciona.<br><br>
<strong>Legenda:</strong> O ano é 2026 e ainda precisamos falar sobre isso!""",

    '2': """<span class="handle">gabrielasaueressig_</span> <strong>[Carrossel] Coisas que ouvimos por aí que não aguento mais…</strong><br><br>
<strong>Card 1:</strong> Coisas que ouvimos por aí que não aguento mais…<br>“Cheiro forte é sujeira”<br>Não é. A vagina tem cheiro. Isso é normal, é fisiológico e varia ao longo do ciclo. O que muda o cheiro de forma intensa e persistente pode ser sinal de desequilíbrio (vaginose bacteriana, por exemplo) e pede investigação<br><br>
<strong>Card 2:</strong> Calcinha úmida, com corrimento, é completamente normal e vai mudando ao longo do mês. A vagina produz muco, igual o nariz, o ouvido, a boca..<br><br>
<strong>Card 3:</strong> “Quanto mais se usa, mais alarga”.<br>Para. Respira. A vagina é um canal muscular elástico. Ela se adapta e retorna. Não existe "alargar" por uso. Não existe vagina "gasta". Isso é uma construção pra envergonhar mulher e não tem nenhuma base anatômica.<br><br>
<strong>Card 4:</strong> “Pelo tem que tirar para ser higiênico”<br>Ele protege a região de atrito, de bactérias, de fungos. A depilação total, especialmente a cera quente, pode causar microlesões na pele que aumentam o risco de infecção. Tirar ou não o pelo é uma escolha estética, não é questão de higiene. Isso quem decide é tu.<br><br>
<strong>Card 5:</strong> O problema de todos esses mitos é o mesmo: eles fazem a mulher sentir que o próprio corpo é sujo, defeituoso ou inadequado. E aí tu compra produto que não precisa, sente vergonha de sintoma que precisava contar pra médica e normaliza dor que tinha tratamento.<br><br>
<strong>Legenda:</strong> Mais algum para adicionar na lista?""",

    '3': """<span class="handle">gabrielasaueressig_</span> <strong>[Vídeo] “Meu Deus, eu tenho HPV, que vergonha!”</strong><br><br>
HPV não tem nada a ver com quem você é. Não tem a ver com quantas pessoas você ficou. Não tem a ver com caráter. HPV é o vírus sexualmente transmissível mais comum do mundo. A maioria das pessoas sexualmente ativas vai ter contato com algum tipo de HPV ao longo da vida e a maioria nem vai saber.<br><br>
Existem mais de 100 tipos de HPV. A maioria é eliminada pelo próprio sistema imunológico em até dois anos, sem nenhum tratamento. Alguns tipos podem causar verrugas genitais. Outros, em infecções persistentes e não rastreadas, podem levar a lesões precursoras do câncer de colo do útero. Por isso, o rastreio existe.<br><br>
Se isso tem sido uma questão para você, vem conversar comigo para pensarmos os próximos passos para a tua saúde.<br><br>
<strong>Legenda:</strong> Existe caminho depois desse diagnóstico. Me chama para a gente pensar juntas.""",

    '4': """<span class="handle">gabrielasaueressig_</span> <strong>[Carrossel] Posso ter relação depois de uma cirurgia ginecológica?</strong><br><br>
<strong>Card 1:</strong> Posso ter relação depois de uma cirurgia ginecológica?<br>
<strong>Card 2:</strong> Sim, mas tem um tempo certo pra isso. E esse tempo existe porque depois de qualquer cirurgia ginecológica, especialmente histerectomia, miomectomia, laparoscopia com procedimento no útero, os tecidos precisam cicatrizar por dentro.<br>
<strong>Card 3:</strong> Essa cicatrização interna não dá pra ver. Não tem sinal visível, mas ela está acontecendo.<br>
<strong>Card 4:</strong> A relação sexual antes da liberação médica pode causar sangramento, abrir pontos internos, introduzir bactérias numa região ainda em cicatrização e provocar dor desnecessária.<br>
E quando vier a liberação, se sentir dor, desconforto ou algo diferente, contar pra tua ginecologista é importante. Isso também faz parte do acompanhamento.""",

    '5': """<span class="handle">gabrielasaueressig_</span> <strong>[Carrossel] Dúvida comum do consultório</strong><br><br>
Espaço para Gabi trazer uma dúvida comum de consultório.""",

    '6': """<span class="handle">gabrielasaueressig_</span> <strong>[Carrossel] Mioma: operar ou não operar?</strong><br><br>
<strong>Card 1:</strong> Mioma: operar ou não operar?<br>
<strong>Card 2:</strong> Mioma é um tumor benigno do útero. Benigno significa que não vira câncer. Mas isso não significa que não causa problema.<br>
<strong>Card 3:</strong> Tem mioma que não dá sintoma nenhum. Aparece no ultrassom, a mulher nem sabia que tinha. Esse geralmente só precisa de acompanhamento.<br>
<strong>Card 4:</strong> Tem mioma que causa: sangramento intenso, dor, pressão pélvica, dificuldade pra engravidar dependendo da localização…<br>
<strong>Card 5:</strong> As opções não são só "opera" ou "não opera". Tem medicamento que reduz o tamanho. Tem embolização, um procedimento menos invasivo. Tem miomectomia, que retira o mioma e preserva o útero. Tem histerectomia, que retira o útero, indicada em casos específicos.<br>
<strong>Card 6:</strong> A escolha depende do teu tamanho de mioma, localização, sintomas, desejo de engravidar e qualidade de vida. Não existe resposta igual pra todas as mulheres.<br><br>
<strong>Legenda:</strong> E aí: qual é o melhor caminho? Hoje te explico melhor!""",

    '7': """<span class="handle">gabrielasaueressig_</span> <strong>[Card] Investimentos para a sua saúde em 2026</strong><br><br>
Quase metade do ano, e aí vão investimentos para a sua saúde para fazer em 2026 (uma listinha seleta preparada para você):<br>
- Vacina nonavalente do HPV<br>
- Rastreio de ISTs<br>
- Boa nutricionista e um bom educador físico<br>
- Bons relacionamentos, afinal, isso é olhar para a sua saúde física e mental também.<br>
- Higiene do sono<br><br>
<strong>Legenda:</strong> Aqui estão os investimentos em saúde que eu, como ginecologista, colocaria como prioridade em 2026. Spoiler: não são exames ginecológicos.<br><br>A saúde da mulher não mora só na vulva.""",

    '8': """<span class="handle">gabrielasaueressig_</span> <strong>[Vídeo] Quanto tempo vou ficar parada depois da cirurgia?</strong><br><br>
<strong>Cena 1:</strong> Depende de três coisas principais: Qual cirurgia foi feita. Qual via cirúrgica foi usada. Como é o teu corpo e tua recuperação individual.<br>
<strong>Cena 2:</strong> Laparoscopia diagnóstica ou procedimentos simples: Em geral, 3 a 7 dias sem esforço fisico. Retorno às atividades leves na primeira semana. Trabalho de escritório em torno de 7 a 10 dias na maioria dos casos.<br>
<strong>Cena 3:</strong> Laparoscopia com procedimento mais complexo (endometriose, miomectomia, cisto): Em geral 1 a 2 semanas de repouso. Atividade física liberada progressivamente após avaliação.<br>
<strong>Cena 4:</strong> Histerectomia laparoscópica: em geral 2 a 4 semanas de repouso. Retorno ao trabalho físico ou pesado pode levar mais tempo.<br>
<strong>Cena 5:</strong> Histerectomia abdominal: via aberta: em geral 4 a 6 semanas. Restrição de peso e esforço por período mais longo.<br>
<strong>Cena 6:</strong> Repouso não significa imobilidade total. Caminhar leve nos primeiros dias é incentivado, porque, como sabemos: ajuda na circulação e previne trombose. O que não pode é esforço, peso, relação sexual e atividade intensa antes da liberação.<br><br>
<strong>Legenda:</strong> Antes de entrar numa sala cirúrgica, tu merece saber o que te espera do outro lado.<br>
A resposta depende de três coisas: qual cirurgia foi feita, qual via cirúrgica foi usada e como é o teu corpo. Ouve pra entender cada situação.<br>
E se a tua cirurgia não está aqui, me manda uma mensagem, porque cada caso tem a sua conversa."""
}

for post_id, new_content in copies.items():
    # Find the post section
    pattern = rf'(<!-- ══ POST {post_id} ══ -->.*?<div class="caption-blk">\s*)(.*?)(\s*</div>\s*</div>\s*</div>\s*<div class="post-actions-below">)'
    html = re.sub(pattern, lambda m: m.group(1) + new_content + m.group(3), html, flags=re.DOTALL)

with open('maio.html', 'w', encoding='utf-8') as f:
    f.write(html)
