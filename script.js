
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = {
  view: localStorage.getItem('mm_view') || 'home',
  theme: localStorage.getItem('mm_theme') || 'light',
  score: +(localStorage.getItem('mm_score') || 0),
  answered: +(localStorage.getItem('mm_answered') || 0),
  correct: +(localStorage.getItem('mm_correct') || 0),
  logicDone: localStorage.getItem('mm_logicDone') === '1',
  topicStats: JSON.parse(localStorage.getItem('mm_topicStats') || '{}'),
  lesson: null,
  slide: 0,
  quizLocked: false,
  sim: null,
  chart: null
};

const topicInfo = {
  // 1º ano
  conjuntos:{year:1,title:'Conjuntos numéricos',desc:'Naturais, inteiros, racionais, irracionais, reais, reta e intervalos.',concept:'Os conjuntos numéricos organizam os números de acordo com suas características. Naturais incluem contagens; inteiros incluem negativos; racionais podem ser escritos como fração; irracionais não podem; reais reúnem racionais e irracionais.',formula:'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ  e  ℝ = ℚ ∪ (irracionais)',daily:'Ao medir uma temperatura, contar objetos ou representar uma dívida, você usa diferentes tipos de números.',example:'−3 é inteiro e real; 1/2 é racional; √2 é irracional; 5 é natural, inteiro, racional e real.',visual:'numberline'},
  razao:{year:1,title:'Razão, proporção e porcentagem',desc:'Comparações, proporcionalidade, regra de três e porcentagens.',concept:'Razão compara duas grandezas por divisão. Proporção é uma igualdade entre razões. A regra de três organiza relações proporcionais. Porcentagem é uma razão com denominador 100.',formula:'porcentagem = (parte / total) × 100',daily:'Descontos, receitas, salários, consumo de água e energia usam proporções e porcentagens.',example:'Uma camisa de R$ 200 com 15% de desconto: desconto = 0,15×200 = R$ 30; preço final = R$ 170.',visual:'table'},
  potencia:{year:1,title:'Potenciação e radiciação',desc:'Potências, propriedades, raízes e notação científica.',concept:'Potenciação representa multiplicações repetidas. Na potência a^n, a é a base e n é o expoente. Radiciação desfaz a potenciação em situações compatíveis.',formula:'a^m·a^n=a^(m+n) ; a^m/a^n=a^(m−n) ; (a^m)^n=a^(mn)',daily:'Áreas, escalas, armazenamento e medidas muito grandes ou pequenas usam potências.',example:'2^3 = 2·2·2 = 8. Já √49 = 7 porque 7^2 = 49.',visual:'none'},
  algebra:{year:1,title:'Expressões algébricas',desc:'Variáveis, termos, polinômios, produtos notáveis e fatoração.',concept:'Uma expressão algébrica combina números, variáveis e operações. Termos semelhantes têm a mesma parte literal e podem ser reduzidos.',formula:'(a+b)^2=a^2+2ab+b^2',daily:'Fórmulas de área e custo podem ser escritas com letras quando o valor ainda não é conhecido.',example:'3x+2x−4 = 5x−4. Para x=2, o resultado é 6.',visual:'none'},
  equacoes:{year:1,title:'Equações',desc:'Equações do 1º e 2º grau, delta, raízes e problemas.',concept:'Equação é uma igualdade que contém uma incógnita. Resolver significa encontrar valores que tornam a igualdade verdadeira.',formula:'ax²+bx+c=0  →  Δ=b²−4ac  →  x=(-b±√Δ)/(2a)',daily:'Descobrir um preço desconhecido, uma distância ou uma quantidade pode ser modelado por uma equação.',example:'2x+6=14 → 2x=8 → x=4. No 2º grau, usamos fatoração ou Bhaskara quando apropriado.',visual:'quadratic'},
  funcoes:{year:1,title:'Funções',desc:'Domínio, contradomínio, imagem, tabelas, gráficos, afim e quadrática.',concept:'Função associa cada entrada permitida a uma única saída. A variável independente costuma ser x e a dependente pode ser escrita f(x).',formula:'função afim: f(x)=ax+b',daily:'Preço em função da quantidade, distância em função do tempo e consumo em função dos dias são exemplos.',example:'f(x)=2x+1: para x=3, f(3)=7. A tabela x→f(x) permite construir o gráfico.',visual:'line'},
  geometria:{year:1,title:'Geometria plana',desc:'Ângulos, triângulos, quadriláteros, perímetros e áreas.',concept:'Geometria plana estuda figuras no plano. Perímetro soma comprimentos das bordas; área mede a região interna.',formula:'A_quadrado=l² ; A_retângulo=bh ; A_triângulo=bh/2 ; A_trapézio=(B+b)h/2',daily:'Pisos, paredes, terrenos e molduras podem ser dimensionados com perímetro e área.',example:'Retângulo 8 m×3 m: perímetro=22 m e área=24 m².',visual:'geometry'},

  // 2º ano
  quadratica:{year:2,title:'Função quadrática',desc:'Parábola, concavidade, raízes, vértice, máximo e mínimo.',concept:'É uma função f(x)=ax²+bx+c, com a diferente de zero. Seu gráfico é uma parábola. O sinal de a define a concavidade.',formula:'xv=−b/(2a) ; yv=f(xv)',daily:'Altura de um objeto lançado, lucro máximo e trajetórias podem ter comportamento quadrático.',example:'f(x)=−x²+4x tem concavidade para baixo e máximo no vértice x=2.',visual:'quadratic'},
  exponencial:{year:2,title:'Função exponencial',desc:'Crescimento, decrescimento, gráficos e aplicações.',concept:'Na função f(x)=a^x, com a>0 e a≠1, a variável aparece no expoente. Se a>1, há crescimento; se 0<a<1, há decrescimento.',formula:'f(x)=a^x',daily:'Crescimento populacional, juros compostos, bactérias e depreciação podem ser modelados por exponenciais.',example:'2^0=1, 2^1=2, 2^2=4, 2^3=8: os valores dobram a cada aumento de 1 em x.',visual:'exponential'},
  logaritmos:{year:2,title:'Logaritmos',desc:'Conceito, propriedades, mudança de base e equações.',concept:'Logaritmo responde: qual expoente preciso usar na base para obter o argumento?',formula:'log_b(a)=c  ⇔  b^c=a',daily:'Escalas e fenômenos que variam em muitas ordens de grandeza podem usar logaritmos.',example:'log_2(8)=3 porque 2^3=8. A propriedade do produto transforma multiplicações em somas.',visual:'log'},
  progressao:{year:2,title:'Progressões — PA e PG',desc:'Sequências, razão, termo geral e soma.',concept:'PA tem diferença constante entre termos. PG tem quociente constante entre termos.',formula:'PA: a_n=a_1+(n−1)r ; PG: a_n=a_1·q^(n−1)',daily:'Parcelas com aumento fixo lembram PA; crescimento percentual repetido lembra PG.',example:'PA 3,7,11,... tem r=4. PG 2,6,18,... tem q=3.',visual:'none'},
  trigonometria:{year:2,title:'Trigonometria',desc:'Seno, cosseno, tangente, leis dos senos e cossenos.',concept:'No triângulo retângulo, as razões trigonométricas relacionam lados e ângulos. Seno é oposto/hipotenusa, cosseno é adjacente/hipotenusa e tangente é oposto/adjacente.',formula:'sen θ=oposto/hipotenusa ; cos θ=adjacente/hipotenusa ; tg θ=oposto/adjacente',daily:'Alturas, rampas, telhados e distâncias inacessíveis podem ser calculados com trigonometria.',example:'Em um triângulo 3-4-5, para o ângulo cujo oposto mede 3, sen θ=3/5.',visual:'triangle'},
  circresp:{year:2,title:'Circunferência e geometria espacial',desc:'Círculo, circunferência, polígonos, prismas, cilindros e pirâmides.',concept:'Circunferência é a linha que delimita o círculo. Na geometria espacial, estudamos sólidos e suas áreas e volumes.',formula:'C=2πr ; A_círculo=πr² ; V_prisma=Ab·h ; V_cilindro=πr²h',daily:'Rodas, latas, caixas e recipientes são modelos geométricos comuns.',example:'Círculo de raio 3: área=9π. Cilindro de raio 2 e altura 5: volume=20π.',visual:'solid'},
  combinatoria:{year:2,title:'Análise combinatória',desc:'Contagem, permutação, arranjo e combinação.',concept:'Análise combinatória conta possibilidades sem precisar listar tudo. A estratégia depende de a ordem importar e de haver ou não repetição.',formula:'P(n)=n! ; A(n,p)=n!/(n−p)! ; C(n,p)=n!/[p!(n−p)!]',daily:'Senhas, cardápios, equipes, looks e sequências de escolhas são problemas de contagem.',example:'3 camisetas e 2 calças geram 3×2=6 looks diferentes.',visual:'none'},

  // 3º ano
  espacial:{year:3,title:'Geometria espacial',desc:'Prismas, pirâmides, cilindros, cones, esferas, áreas e volumes.',concept:'A geometria espacial mede regiões tridimensionais. Volume mede o espaço ocupado; área mede superfícies.',formula:'V_prisma=Abh ; V_cilindro=πr²h ; V_esfera=4πr³/3',daily:'Reservatórios, embalagens e recipientes exigem estimativas de volume e área.',example:'Um prisma com área da base 10 cm² e altura 6 cm tem volume 60 cm³.',visual:'solid'},
  analitica:{year:3,title:'Geometria analítica',desc:'Plano cartesiano, distância, ponto médio, reta e circunferência.',concept:'Geometria analítica traduz figuras e relações geométricas em coordenadas e equações.',formula:'d=√[(x₂−x₁)²+(y₂−y₁)²] ; M=((x₁+x₂)/2,(y₁+y₂)/2)',daily:'Mapas digitais e localização por coordenadas usam ideias do plano cartesiano.',example:'Entre A(0,0) e B(3,4), d=5.',visual:'cartesian'},
  matrizes:{year:3,title:'Matrizes',desc:'Linhas, colunas, ordem, operações e determinantes.',concept:'Matriz é uma organização retangular de números. A ordem é dada por linhas × colunas.',formula:'det [[a,b],[c,d]]=ad−bc',daily:'Tabelas de dados e transformações computacionais podem ser organizadas como matrizes.',example:'Uma matriz 2×3 tem 2 linhas e 3 colunas, totalizando 6 elementos.',visual:'matrix'},
  sistemas:{year:3,title:'Sistemas lineares',desc:'Sistemas 2×2 e 3×3, substituição, adição e interpretação geométrica.',concept:'Sistema linear reúne duas ou mais equações que devem ser satisfeitas simultaneamente.',formula:'x+y=7 ; x−y=1  →  2x=8 → x=4, y=3',daily:'Combinar preços e quantidades ou distribuir recursos pode gerar sistemas.',example:'Somando x+y=7 e x−y=1, obtemos 2x=8; então x=4 e y=3.',visual:'line'},
  probabilidade:{year:3,title:'Probabilidade',desc:'Experimento, espaço amostral, evento e probabilidade condicional.',concept:'Probabilidade mede a chance de um evento ocorrer. Em casos equiprováveis, é a razão entre casos favoráveis e casos possíveis.',formula:'P(A)=casos favoráveis/casos possíveis',daily:'Sorteios, dados, cartas e previsões usam probabilidades.',example:'Em um dado justo, P(sair 6)=1/6.',visual:'none'},
  estatistica:{year:3,title:'Estatística',desc:'Média, mediana, moda, amplitude, variância, desvio padrão e gráficos.',concept:'Estatística organiza e interpreta dados. Medidas de tendência central resumem o conjunto; medidas de dispersão indicam o quanto os dados variam.',formula:'média = soma dos valores / quantidade de valores',daily:'Notas, pesquisas, preços, população e desempenho esportivo podem ser analisados estatisticamente.',example:'Dados 2,4,4,6: média=4, mediana=4, moda=4, amplitude=4.',visual:'stats'},
  financeira:{year:3,title:'Matemática financeira',desc:'Porcentagem, juros simples e compostos, descontos, acréscimos e financiamentos.',concept:'Matemática financeira modela a evolução do dinheiro ao longo do tempo.',formula:'Juros simples: M=C(1+it) ; compostos: M=C(1+i)^t',daily:'Cartão, empréstimo, investimento, parcelamento e descontos são situações financeiras.',example:'R$100 a 10% de juros compostos por 2 períodos: M=100(1,1)^2=R$121.',visual:'finance'},
  complexos:{year:3,title:'Números complexos',desc:'Unidade imaginária, forma algébrica, operações e plano complexo.',concept:'Números complexos ampliam os reais usando i, definido por i²=−1. Podem ser escritos z=a+bi.',formula:'i²=−1 ; z=a+bi',daily:'Modelos matemáticos e engenharia usam números complexos para representar fenômenos com duas componentes.',example:'(2+3i)+(1−i)=3+2i.',visual:'complex'},
  polinomios:{year:3,title:'Polinômios',desc:'Grau, operações, divisão, raízes, resto e relações de Girard.',concept:'Polinômio é uma soma de termos com potências inteiras não negativas da variável. O maior expoente com coeficiente não nulo define o grau.',formula:'P(x)=a_nx^n+...+a_1x+a_0',daily:'Polinômios aparecem em modelos de crescimento, áreas e aproximações matemáticas.',example:'P(x)=x²−5x+6 tem raízes 2 e 3 porque P(2)=P(3)=0.',visual:'polynomial'},
  enem:{year:3,title:'Revisão geral para ENEM e vestibulares',desc:'Funções, geometria, estatística, probabilidade, finanças, razão e interpretação.',concept:'A revisão combina conteúdos em situações contextualizadas. O foco é identificar informações, escolher estratégias e interpretar resultados.',formula:'Estratégia: ler → identificar dados → escolher modelo → calcular → conferir unidade e sentido.',daily:'Questões podem envolver consumo, transporte, população, energia, economia, educação, tecnologia, esporte e meio ambiente.',example:'Uma tabela de consumo pode exigir porcentagem, média ou leitura de gráfico na mesma questão.',visual:'stats'}
};

const YL = {1:'Iniciante',2:'Intermediário',3:'Avançado'};
const years = {
  1:['conjuntos','razao','potencia','algebra','equacoes','funcoes','geometria'],
  2:['quadratica','exponencial','logaritmos','progressao','trigonometria','circresp','combinatoria'],
  3:['espacial','analitica','matrizes','sistemas','probabilidade','estatistica','financeira','complexos','polinomios','enem']
};

const logicQuestions = [
 {q:'2, 4, 8, 16, ?',opts:['20','24','32','36'],a:2,e:'Cada termo é o dobro do anterior: 2×2=4, 4×2=8, 8×2=16. Portanto, 16×2=32.'},
 {q:'Qual número completa a sequência 5, 8, 11, 14, ?',opts:['16','17','18','20'],a:1,e:'A diferença é sempre +3. Assim, 14+3=17.'},
 {q:'Ana é mais velha que Bia. Bia é mais velha que Carla. Quem é a mais nova?',opts:['Ana','Bia','Carla','Não é possível saber'],a:2,e:'Se Ana>Bia e Bia>Carla, então Ana>Bia>Carla. Carla é a mais nova.'},
 {q:'Um relógio marca 3h. Qual é o menor ângulo entre os ponteiros?',opts:['30°','60°','90°','120°'],a:2,e:'Às 3h, o ponteiro dos minutos está no 12 e o das horas no 3. Cada intervalo vale 30°, então o ângulo é 90°.'},
 {q:'Em uma turma, 12 alunos gostam de Matemática, 8 de Física e 5 gostam das duas. Quantos gostam de pelo menos uma?',opts:['15','20','25','30'],a:0,e:'Usamos união: 12+8−5=15. Os 5 foram contados duas vezes e precisam ser retirados uma vez.'},
 {q:'João tem 4 anos a mais que Maria. Juntos têm 30 anos. Quantos anos tem Maria?',opts:['11','12','13','14'],a:1,e:'Se Maria=x, João=x+4. Então x+(x+4)=30 → 2x=26 → x=13. Portanto, Maria tem 13 anos.'},
 {q:'Quatro pessoas estão em fila. Lucas está antes de Pedro e Pedro antes de Ana. Quem certamente não pode estar antes de Lucas?',opts:['Pedro','Ana','Lucas','Ninguém'],a:0,e:'Como Lucas vem antes de Pedro, Pedro não pode estar antes de Lucas.'},
 {q:'Uma senha usa uma letra entre A/B e um número entre 1/2/3. Quantas senhas simples são possíveis?',opts:['3','4','5','6'],a:1,e:'Há 2 escolhas para a letra e 3 para o número: 2×3=6.'},
 {q:'Se todos os X são Y e nenhum Y é Z, o que é necessariamente verdadeiro?',opts:['Todo X é Z','Nenhum X é Z','Todo Z é X','Algum X é Z'],a:1,e:'X está dentro de Y. Se nenhum Y pertence a Z, nenhum X pode pertencer a Z.'},
 {q:'Uma caixa tem 3 bolas vermelhas e 2 azuis. Sem olhar, qual é o número mínimo de bolas para garantir duas da mesma cor?',opts:['2','3','4','5'],a:1,e:'Com 2 bolas, pode sair uma de cada cor. Com 3, necessariamente duas terão a mesma cor.'}
];

const topicQuestions = {
 conjuntos:[
  {q:'Qual conjunto contém os números naturais?',opts:['−3,−2,−1','0,1,2,3,...','1/2,2/3','√2,√3'],a:1,e:'Os naturais representam contagens e, nesta plataforma, incluem 0: 0,1,2,3,...'},
  {q:'Qual número é irracional?',opts:['0,25','−4','√2','3/5'],a:2,e:'√2 não pode ser escrito como uma fração de inteiros, portanto é irracional.'},
  {q:'Qual intervalo representa 2≤x<5?',opts:['(2,5)','[2,5)','(2,5]','[2,5]'],a:1,e:'Colchete em 2 porque 2 pertence ao intervalo; parêntese em 5 porque 5 não pertence.'}
 ],
 razao:[
  {q:'20% de 150 é:',opts:['20','25','30','35'],a:2,e:'20%=0,20. Então 0,20×150=30.'},
  {q:'Uma receita para 4 pessoas usa 300 g de arroz. Para 8 pessoas, mantendo a proporção, usa:',opts:['450 g','500 g','600 g','750 g'],a:2,e:'8 é o dobro de 4, então a quantidade também dobra: 300×2=600 g.'},
  {q:'Um produto de R$200 recebe desconto de 15%. O preço final é:',opts:['R$160','R$170','R$175','R$185'],a:1,e:'15% de 200=30. Preço final: 200−30=170.'}
 ],
 potencia:[
  {q:'2³ é igual a:',opts:['5','6','8','9'],a:2,e:'2³=2×2×2=8.'},
  {q:'3²×3³ é igual a:',opts:['3⁵','3⁶','6⁵','9⁵'],a:0,e:'Na multiplicação de potências de mesma base, somamos os expoentes: 2+3=5.'},
  {q:'√81 é:',opts:['7','8','9','10'],a:2,e:'9×9=81, portanto √81=9.'}
 ],
 algebra:[
  {q:'Simplifique 3x+2x−4:',opts:['5x−4','6x−4','5x+4','x−4'],a:0,e:'3x e 2x são termos semelhantes: 3x+2x=5x. Mantemos −4.'},
  {q:'(x+3)² é:',opts:['x²+9','x²+3x+9','x²+6x+9','x²+6x+3'],a:2,e:'Quadrado da soma: x²+2·x·3+3²=x²+6x+9.'},
  {q:'Fatoração de x²−9:',opts:['(x−9)(x+1)','(x−3)(x+3)','(x−9)²','x(x−9)'],a:1,e:'É uma diferença de quadrados: x²−3²=(x−3)(x+3).'}
 ],
 equacoes:[
  {q:'Resolva 2x+6=14:',opts:['2','3','4','5'],a:2,e:'2x=14−6=8; x=8/2=4.'},
  {q:'As raízes de x²−5x+6=0 são:',opts:['1 e 6','2 e 3','−2 e −3','0 e 6'],a:1,e:'Procuramos dois números cujo produto seja 6 e soma 5: 2 e 3.'},
  {q:'Para x²−4=0, as soluções são:',opts:['x=4','x=−4','x=±2','x=2 apenas'],a:2,e:'x²=4, então x=2 ou x=−2.'}
 ],
 funcoes:[
  {q:'Se f(x)=2x+1, então f(3)=',opts:['5','6','7','8'],a:2,e:'Substituindo x=3: f(3)=2·3+1=7.'},
  {q:'Em uma função, x costuma representar a:',opts:['variável dependente','variável independente','imagem','contradomínio'],a:1,e:'Em uma representação usual y=f(x), x é a entrada, ou variável independente.'},
  {q:'O gráfico de uma função afim é uma:',opts:['circunferência','parábola','reta','elipse'],a:2,e:'Uma função afim f(x)=ax+b tem gráfico linear, isto é, uma reta.'}
 ],
 geometria:[
  {q:'Área de um retângulo 8 m×3 m:',opts:['11 m²','22 m²','24 m²','48 m²'],a:2,e:'A=b·h=8×3=24 m².'},
  {q:'Perímetro de um quadrado de lado 5 cm:',opts:['10 cm','15 cm','20 cm','25 cm'],a:2,e:'Perímetro=4l=4×5=20 cm.'},
  {q:'Área de um triângulo com base 10 e altura 6:',opts:['16','30','60','120'],a:1,e:'A=bh/2=10×6/2=30.'}
 ],
 quadratica:[
  {q:'Na função f(x)=−x²+4x, a concavidade é:',opts:['para cima','para baixo','reta','horizontal'],a:1,e:'O coeficiente de x² é −1, então a<0 e a parábola é voltada para baixo.'},
  {q:'O x do vértice de x²−6x+5 é:',opts:['2','3','5','6'],a:1,e:'xv=−b/(2a)=−(−6)/(2)=3.'},
  {q:'Uma parábola voltada para baixo possui:',opts:['máximo','mínimo','nenhum extremo','somente raiz'],a:0,e:'Quando a<0, o vértice representa o valor máximo da função.'}
 ],
 exponencial:[
  {q:'2⁴ é:',opts:['8','12','16','24'],a:2,e:'2×2×2×2=16.'},
  {q:'Na função 3^x, quando x aumenta 1 unidade, o valor:',opts:['diminui pela metade','é multiplicado por 3','aumenta 1','fica igual'],a:1,e:'3^(x+1)=3·3^x, portanto o valor triplica.'},
  {q:'Uma população dobra a cada período. Esse comportamento é melhor representado por:',opts:['função constante','função linear','função exponencial','função quadrática'],a:2,e:'Multiplicação por um mesmo fator em intervalos iguais caracteriza crescimento exponencial.'}
 ],
 logaritmos:[
  {q:'log₂(8)=',opts:['2','3','4','8'],a:1,e:'2³=8, então o expoente procurado é 3.'},
  {q:'log₁₀(100)=',opts:['1','2','10','100'],a:1,e:'10²=100.'},
  {q:'Se log_b(a)=c, então:',opts:['a^b=c','b^c=a','c^b=a','a^c=b'],a:1,e:'A definição é log_b(a)=c ⇔ b^c=a.'}
 ],
 progressao:[
  {q:'Na PA 3,7,11,15,... a razão é:',opts:['2','3','4','5'],a:2,e:'A diferença entre termos consecutivos é 4.'},
  {q:'O 5º termo da PA 2,5,8,... é:',opts:['11','12','13','14'],a:2,e:'a5=2+(5−1)·3=14. Atenção: 2,5,8,11,14.'},
  {q:'Na PG 2,6,18,... a razão é:',opts:['2','3','4','6'],a:1,e:'Cada termo é o anterior multiplicado por 3.'}
 ],
 trigonometria:[
  {q:'Em um triângulo retângulo, sen θ é:',opts:['adjacente/hipotenusa','oposto/hipotenusa','oposto/adjacente','hipotenusa/oposto'],a:1,e:'Seno é cateto oposto dividido pela hipotenusa.'},
  {q:'Se o cateto oposto mede 3 e a hipotenusa 5, sen θ=',opts:['3/5','4/5','5/3','2/5'],a:0,e:'sen θ=oposto/hipotenusa=3/5.'},
  {q:'Em um triângulo 3-4-5, para o ângulo oposto ao lado 3, cos θ=',opts:['3/5','4/5','3/4','5/4'],a:1,e:'O lado adjacente mede 4 e a hipotenusa 5: cos θ=4/5.'}
 ],
 circresp:[
  {q:'Comprimento da circunferência de raio r:',opts:['πr²','2πr','πd²','r²/π'],a:1,e:'C=2πr.'},
  {q:'Área de um círculo de raio 3:',opts:['6π','9π','12π','18π'],a:1,e:'A=πr²=π·9=9π.'},
  {q:'Volume de um cilindro de raio 2 e altura 5:',opts:['10π','15π','20π','25π'],a:2,e:'V=πr²h=π·4·5=20π.'}
 ],
 combinatoria:[
  {q:'3 camisetas e 2 calças formam quantos looks?',opts:['5','6','8','9'],a:1,e:'Para cada uma das 3 camisetas há 2 escolhas de calça: 3×2=6.'},
  {q:'Quantas formas de ordenar 3 pessoas em fila?',opts:['3','6','9','12'],a:1,e:'Permutação de 3: 3!=3×2×1=6.'},
  {q:'Escolher 2 alunos entre 4, sem importar a ordem, corresponde a:',opts:['permutação','arranjo','combinação','potência'],a:2,e:'Como a ordem não importa, usamos combinação: C(4,2)=6.'}
 ],
 espacial:[
  {q:'Volume de um prisma com área da base 10 e altura 6:',opts:['16','30','60','120'],a:2,e:'V=Ab·h=10×6=60.'},
  {q:'Volume de uma esfera de raio r:',opts:['πr²','2πr','4πr³/3','πr³'],a:2,e:'A fórmula é V=4πr³/3.'},
  {q:'Um cilindro tem r=2 e h=3. Seu volume é:',opts:['6π','8π','12π','18π'],a:2,e:'V=π·2²·3=12π.'}
 ],
 analitica:[
  {q:'Distância entre (0,0) e (3,4):',opts:['4','5','6','7'],a:1,e:'d=√(3²+4²)=√25=5.'},
  {q:'Ponto médio de (2,4) e (6,8):',opts:['(3,5)','(4,6)','(5,7)','(8,12)'],a:1,e:'M=((2+6)/2,(4+8)/2)=(4,6).'},
  {q:'No plano cartesiano, o ponto (−2,3) está em:',opts:['I quadrante','II quadrante','III quadrante','IV quadrante'],a:1,e:'x<0 e y>0 correspondem ao II quadrante.'}
 ],
 matrizes:[
  {q:'Uma matriz 2×3 possui:',opts:['2 elementos','3 elementos','5 elementos','6 elementos'],a:3,e:'2 linhas×3 colunas=6 elementos.'},
  {q:'A ordem de [[1,2],[3,4]] é:',opts:['1×4','2×2','2×4','4×2'],a:1,e:'São 2 linhas e 2 colunas.'},
  {q:'det [[2,1],[3,4]] =',opts:['5','8','11','−5'],a:0,e:'det=2·4−1·3=8−3=5.'}
 ],
 sistemas:[
  {q:'No sistema x+y=7 e x−y=1, x é:',opts:['2','3','4','5'],a:2,e:'Somando as equações: 2x=8, então x=4.'},
  {q:'No mesmo sistema, y é:',opts:['1','2','3','4'],a:2,e:'Substituindo x=4 em x+y=7: y=3.'},
  {q:'Geometricamente, duas retas que se cruzam em um ponto representam:',opts:['nenhuma solução','uma solução','infinitas soluções','sempre 3 soluções'],a:1,e:'O ponto de interseção é a solução comum do sistema.'}
 ],
 probabilidade:[
  {q:'Ao lançar um dado justo, P(6)=',opts:['1/2','1/3','1/6','1/12'],a:2,e:'Há 1 resultado favorável entre 6 possíveis: 1/6.'},
  {q:'Uma moeda justa é lançada. P(cara)=',opts:['0','1/4','1/2','1'],a:2,e:'Há dois resultados equiprováveis e um é cara: 1/2.'},
  {q:'Uma urna tem 3 bolas vermelhas e 2 azuis. P(vermelha)=',opts:['2/5','3/5','1/2','3/2'],a:1,e:'São 3 favoráveis em 5 possíveis: 3/5.'}
 ],
 estatistica:[
  {q:'Média de 2,4,6:',opts:['3','4','5','6'],a:1,e:'(2+4+6)/3=12/3=4.'},
  {q:'Moda de 2,4,4,6 é:',opts:['2','4','6','não existe'],a:1,e:'Moda é o valor que mais se repete; 4 aparece duas vezes.'},
  {q:'Mediana de 1,3,5,8,10 é:',opts:['3','5','6','8'],a:1,e:'Os dados já estão ordenados; o valor central é 5.'}
 ],
 financeira:[
  {q:'10% de R$500 é:',opts:['R$5','R$25','R$50','R$100'],a:2,e:'0,10×500=50.'},
  {q:'R$100 a 10% de juros simples por 2 períodos gera montante:',opts:['R$110','R$120','R$121','R$200'],a:1,e:'M=C(1+it)=100(1+0,10×2)=120.'},
  {q:'R$100 a 10% de juros compostos por 2 períodos gera:',opts:['R$110','R$120','R$121','R$122'],a:2,e:'M=100(1,1)²=121.'}
 ],
 complexos:[
  {q:'A unidade imaginária i satisfaz:',opts:['i=1','i²=−1','i²=1','i=−1'],a:1,e:'Por definição, i²=−1.'},
  {q:'(2+3i)+(1−i)=',opts:['3+i','3+2i','1+4i','2+2i'],a:1,e:'Somamos partes reais e imaginárias: 2+1=3 e 3i−i=2i.'},
  {q:'Na forma z=a+bi, a representa a parte:',opts:['imaginária','quadrática','real','polar'],a:2,e:'a é a parte real e b é o coeficiente da parte imaginária.'}
 ],
 polinomios:[
  {q:'O grau de 4x³−2x+1 é:',opts:['1','2','3','4'],a:2,e:'O maior expoente da variável é 3.'},
  {q:'Uma raiz de x²−5x+6 é:',opts:['1','2','5','6'],a:1,e:'P(2)=4−10+6=0, então 2 é raiz.'},
  {q:'O resto da divisão de P(x) por x−2 é P(2). Isso é:',opts:['teorema do resto','regra de três','teorema de Pitágoras','fórmula de Bhaskara'],a:0,e:'O Teorema do Resto afirma que o resto da divisão por x−a é P(a).'}
 ],
 enem:[
  {q:'Uma conta de R$80 recebe 25% de desconto. O valor pago é:',opts:['R$55','R$60','R$65','R$70'],a:1,e:'25% de 80=20; 80−20=60.'},
  {q:'Uma tabela mostra 40, 50 e 60 unidades consumidas em três meses. A média é:',opts:['45','50','55','60'],a:1,e:'(40+50+60)/3=150/3=50.'},
  {q:'Um gráfico mostra uma quantidade que cresce de 10 para 20. O aumento percentual é:',opts:['10%','25%','50%','100%'],a:2,e:'Aumento=10; 10/10=1=100%? Cuidado: comparando com o valor inicial 10, o aumento de 10 é 100%. Portanto a alternativa correta deveria ser 100%.',fix:true}
 ]
};

topicQuestions.enem[2] = {q:'Uma quantidade passa de 10 para 20. O aumento percentual é:',opts:['10%','25%','50%','100%'],a:3,e:'O aumento foi 10 sobre uma base inicial de 10: 10/10×100%=100%.'};

function save(){
  localStorage.setItem('mm_theme',state.theme);
  localStorage.setItem('mm_score',state.score);
  localStorage.setItem('mm_answered',state.answered);
  localStorage.setItem('mm_correct',state.correct);
  localStorage.setItem('mm_logicDone',state.logicDone?'1':'0');
  localStorage.setItem('mm_topicStats',JSON.stringify(state.topicStats));
}
function pct(){return state.answered ? +(state.correct/state.answered*100).toFixed(1) : 0}
function topicPct(key){const s=state.topicStats[key];return s&&s.total?s.correct/s.total*100:0}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function setView(v){state.view=v;state.lesson=null;state.slide=0;localStorage.setItem('mm_view',v);$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));closeMenu();render()}
function closeMenu(){$('#sidebar').classList.remove('open');$('#overlay').style.display='none'}
function openMenu(){$('#sidebar').classList.add('open');$('#overlay').style.display='block'}
function yearProgress(y){const keys=years[y];let vals=keys.map(topicPct);return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)}

function render(){
  document.body.classList.toggle('dark',state.theme==='dark');
  $('#themeBtn').textContent=state.theme==='dark'?'☾':'☼';
  $('#topScore').textContent=state.score;
  if(state.lesson) renderLesson();
  else if(state.view==='home') renderHome();
  else if(state.view==='logic') renderLogic();
  else if(state.view==='year1') renderYear(1);
  else if(state.view==='year2') renderYear(2);
  else if(state.view==='year3') renderYear(3);
  else if(state.view==='simulado') renderSimulado();
  else if(state.view==='progress') renderProgress();
  else if(state.view==='settings') renderSettings();
  setTimeout(()=>window.MathJax?.typeset?.(),50);
}

function renderHome(){
 $('#app').innerHTML=`
 <section class="hero">
  <div class="hero-card"><img class="hero-logo" src="logo.png" alt="Logo do CETI Helvídio Nunes de São José do Piauí"><div class="eyebrow">Plataforma de aprendizagem</div><h1>Matemática — Ensino Médio</h1><p>Do básico ao ENEM: aprenda, pratique e domine a Matemática com aulas em slides, exemplos resolvidos, exercícios interativos e acompanhamento do progresso.</p><div class="teacher-line">Professor Sávio Mendes</div></div>
  <div class="hero-stats"><h3>Seu desempenho</h3><div class="stat-grid">
   <div class="stat"><b>${Math.round((yearProgress(1)+yearProgress(2)+yearProgress(3))/3)}%</b><span>Progresso geral</span></div>
   <div class="stat"><b>${state.answered}</b><span>Questões respondidas</span></div>
   <div class="stat"><b>${state.correct}</b><span>Acertos</span></div>
   <div class="stat"><b>${pct()}%</b><span>Aproveitamento</span></div>
  </div></div>
 </section>
 <div class="section-title"><div><h2>Trilhas de aprendizagem</h2><p>Escolha o nível ou comece pelo desafio de lógica.</p></div></div>
 <div class="cards">
  ${[1,2,3].map(y=>`<article class="year-card"><span class="num">${YL[y].toUpperCase()}</span><h3>${y===1?'Fundamentos':y===2?'Funções e estruturas':'Aprofundamento e ENEM'}</h3><p>${y===1?'Álgebra, funções, números e geometria.':y===2?'Funções, trigonometria, progressões e combinatória.':'Geometria, estatística, probabilidade, finanças e revisão.'}</p><div class="progress-line"><i style="width:${yearProgress(y)}%"></i></div><div class="card-footer"><small>${yearProgress(y)}% concluído</small><button class="btn" onclick="setView('year${y}')">Estudar</button></div></article>`).join('')}
 </div>
 <div class="section-title"><div><h2>Comece por aqui</h2><p>O desafio inicial desenvolve raciocínio antes do conteúdo matemático.</p></div></div>
 <div class="panel"><div class="module-head"><div><span class="tag">${state.logicDone?'CONCLUÍDO':'PRIMEIRA ETAPA'}</span><h2 style="margin:10px 0">Desafio de Lógica</h2><p>10 questões progressivas de sequência, padrões, conjuntos, idade, ordem, associação e raciocínio.</p></div><button class="btn" onclick="setView('logic')">${state.logicDone?'Revisar desafio':'Começar desafio'}</button></div></div>`;
}

function renderLogic(){
 const done=state.logicDone;
 if(done){
  $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Início / Desafio de Lógica</span><h1>Desafio de Lógica</h1><p>Você já concluiu a primeira etapa. Pode refazer para praticar.</p></div></div>
  <div class="panel"><h2>Resultado registrado</h2><div class="result-panel"><div class="result-stat"><b>10</b><span>questões</span></div><div class="result-stat"><b>${logicQuestions.filter((_,i)=>localStorage.getItem('mm_logic_'+i)==='1').length}</b><span>acertos na última tentativa</span></div><div class="result-stat"><b>100</b><span>pontos máximos</span></div><div class="result-stat"><b>✓</b><span>etapa concluída</span></div></div><button class="btn" onclick="startLogic()">Refazer desafio</button></div>`;
 } else startLogic();
}
function startLogic(){state.logic={i:0,score:0,answered:false};renderLogicQuestion()}
function renderLogicQuestion(){
 const q=logicQuestions[state.logic.i];$('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Primeira etapa / Desafio de Lógica</span><h1>Desafio de Lógica</h1><p>Raciocine com calma. Cada acerto vale 10 pontos.</p></div><div class="module-progress"><span><b>Questão ${state.logic.i+1} de 10</b><b>${state.logic.score} pts</b></span><div class="progress-line"><i style="width:${(state.logic.i/10)*100}%"></i></div></div></div>
 <div class="lesson-shell"><div class="slide"><div class="question-meta"><span>Raciocínio lógico</span><span>+10 pontos</span></div><h2>${q.q}</h2><div class="choice-list">${q.opts.map((o,i)=>`<button class="choice" onclick="answerLogic(${i})" ${state.logic.answered?'disabled':''}>${String.fromCharCode(65+i)}) ${o}</button>`).join('')}</div>${state.logic.feedback||''}</div><div class="lesson-nav"><span class="slide-count">Questão ${state.logic.i+1} / 10</span>${state.logic.answered?`<button class="btn" onclick="nextLogic()">${state.logic.i===9?'Ver resultado':'Próxima questão →'}</button>`:''}</div></div>`;
}
function answerLogic(i){
 if(state.logic.answered)return;state.logic.answered=true;const q=logicQuestions[state.logic.i];const ok=i===q.a;if(ok)state.logic.score+=10;
 $$('.choice').forEach((b,k)=>{if(k===q.a)b.classList.add('correct');if(k===i&&i!==q.a)b.classList.add('wrong')});
 state.logic.feedback=`<div class="feedback ${ok?'good':'bad'}"><strong>${ok?'Resposta correta — +10 pontos':'Resposta incorreta — +0 pontos'}</strong><div><b>Resposta:</b> ${String.fromCharCode(65+q.a)} — ${q.opts[q.a]}</div><p>${q.e}</p></div>`;
 renderLogicQuestion(); // redraw preserves answer styling through feedback only; styles handled below
}
function nextLogic(){
 const idx=state.logic.i;if(state.logic.i===9){state.logicDone=true;state.score+=state.logic.score;state.answered+=10;state.correct+=state.logic.score/10;for(let i=0;i<10;i++)localStorage.setItem('mm_logic_'+i,'1');save();showToast('Desafio concluído!');render();return}
 state.logic.i++;state.logic.answered=false;state.logic.feedback='';renderLogicQuestion();
}

function renderYear(y){
 const list=years[y];$('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Matemática / ${YL[y]}</span><h1>Nível ${YL[y]}</h1><p>${y===1?'Construa a base: números, álgebra, equações, funções e geometria.':y===2?'Avance em funções, trigonometria, progressões e contagem.':'Aprofunde a matemática e prepare-se para questões contextualizadas.'}</p></div></div>
 <div class="topic-grid">${list.map(k=>{const t=topicInfo[k],p=Math.round(topicPct(k));return `<article class="topic-card" onclick="openTopic('${k}')"><span class="tag">${p===100?'CONCLUÍDO':`${p}%`}</span><h3>${t.title}</h3><p>${t.desc}</p><div class="progress-line"><i style="width:${p}%"></i></div></article>`}).join('')}</div>`;
}

function openTopic(k){state.lesson={key:k};state.slide=0;state.quizLocked=false;setViewForLesson()}
function setViewForLesson(){render()}

function buildSlides(k){
 const t=topicInfo[k], qs=topicQuestions[k]||[];
 const slides=[
  {type:'content',title:t.title,body:`<p class="lead">${t.desc}</p><div class="callout"><b>Objetivo:</b> ao final desta aula, você deverá reconhecer o conceito, entender quando utilizá-lo e resolver situações básicas com segurança.</div><h3>Como estudar</h3><p>Avance em ordem: conceito → exemplo cotidiano → exemplo matemático → visual → erro comum → prática. Se algo parecer novo, volte um slide e tente novamente.</p>`},
  {type:'content',title:'O que é?',body:`<p>${t.concept}</p><h3>Para que serve?</h3><p>${t.daily}</p><div class="formula">\\(${t.formula.replaceAll('→','\\\\to')}\\)</div>`},
  {type:'content',title:'Exemplo do cotidiano',body:`<div class="example"><strong>Situação:</strong><p>${t.daily}</p><p><b>Ideia:</b> primeiro identificamos as grandezas e as informações disponíveis; depois escolhemos a relação matemática adequada.</p></div><div class="callout">Dica: antes de calcular, pergunte: <b>“O que o problema quer descobrir?”</b></div>`},
  {type:'content',title:'Exemplo matemático',body:`<div class="example"><strong>Exemplo:</strong><p>${t.example}</p></div><h3>Estratégia</h3><ol><li>Leia e destaque os dados.</li><li>Escolha a definição ou fórmula.</li><li>Substitua os valores.</li><li>Calcule com atenção.</li><li>Confira se a resposta faz sentido.</li></ol>`},
  {type:'content',title:'Como resolver passo a passo',body:`<h3>1. Identifique</h3><p>Separe dados, incógnitas e unidades.</p><h3>2. Modele</h3><p>Escolha a propriedade, fórmula, tabela ou gráfico adequado.</p><h3>3. Resolva</h3><p>Faça uma etapa por vez, mantendo a organização.</p><h3>4. Interprete</h3><p>Volte ao enunciado e confira o significado do resultado.</p>`},
  {type:'visual',title:'Visualização',visual:t.visual,body:`<p class="lead">Use o visual para relacionar a representação matemática com o significado do problema.</p>`},
  {type:'content',title:'Exemplo resolvido',body:`<div class="example"><strong>Resolução:</strong><p>${t.example}</p><p><b>Conclusão:</b> o cálculo só está completo quando interpretamos o resultado no contexto.</p></div><div class="callout"><b>Erro comum:</b> aplicar uma fórmula por memória sem verificar se as condições do problema permitem seu uso.</div>`},
  {type:'quiz',q:qs[0],num:1},
  {type:'quiz',q:qs[1],num:2},
  {type:'quiz',q:qs[2],num:3},
  {type:'content',title:'Resumo',body:`<ul><li><b>Conceito:</b> ${t.concept}</li><li><b>Aplicação:</b> ${t.daily}</li><li><b>Fórmula/ideia:</b> ${t.formula}</li><li><b>Boa prática:</b> confira dados, unidades e interpretação.</li></ul><div class="callout">Você conclui o tópico ao responder as 3 questões. Seu desempenho fica salvo automaticamente.</div>`}
 ];
 return slides;
}

function visualHTML(v){
 if(v==='numberline')return `<div class="formula">−3 ─── −2 ─── −1 ─── 0 ─── 1 ─── 2 ─── 3</div><p>Na reta, valores maiores ficam à direita e menores à esquerda.</p>`;
 if(v==='table')return `<div class="table-wrap"><table><thead><tr><th>Produto</th><th>Preço</th><th>Desconto</th><th>Preço final</th></tr></thead><tbody><tr><td>A</td><td>R$100</td><td>10%</td><td>R$90</td></tr><tr><td>B</td><td>R$200</td><td>15%</td><td>R$170</td></tr><tr><td>C</td><td>R$150</td><td>20%</td><td>R$120</td></tr></tbody></table></div>`;
 if(v==='geometry')return `<div class="formula">□ l² &nbsp;&nbsp; ▭ b·h &nbsp;&nbsp; △ b·h/2 &nbsp;&nbsp; ⏢ (B+b)h/2</div>`;
 if(v==='triangle')return `<div class="formula">      /|\\<br>     / | \\<br>  oposto |  \\ hipotenusa<br>   /___|___\\<br>     adjacente</div>`;
 if(v==='matrix')return `<div class="formula">\\(\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}\\)</div><p>2 linhas × 3 colunas = matriz 2×3.</p>`;
 if(v==='cartesian')return `<div class="formula">y ↑<br>│ &nbsp; • (3,4)<br>│<br>└────────→ x</div>`;
 if(v==='solid')return `<div class="formula">Volume = área da base × altura<br>Prisma: \\(V=A_bh\\)<br>Cilindro: \\(V=\\pi r^2h\\)</div>`;
 if(v==='finance')return `<div class="table-wrap"><table><thead><tr><th>Período</th><th>Valor a 10% compostos</th></tr></thead><tbody><tr><td>0</td><td>R$100</td></tr><tr><td>1</td><td>R$110</td></tr><tr><td>2</td><td>R$121</td></tr><tr><td>3</td><td>R$133,10</td></tr></tbody></table></div>`;
 if(v==='complex')return `<div class="formula">Plano complexo: eixo real ↔ eixo imaginário<br>\\(z=a+bi\\)</div>`;
 if(v==='polynomial')return `<div class="formula">\\(P(x)=x^2-5x+6=(x-2)(x-3)\\)</div>`;
 if(v==='stats')return `<div class="chart-box"><canvas id="lessonChart"></canvas></div>`;
 if(v==='line'||v==='quadratic'||v==='exponential'||v==='log')return `<div class="chart-box"><canvas id="lessonChart"></canvas></div>`;
 return `<div class="callout">Visualização conceitual disponível neste tópico. Observe como a representação ajuda a interpretar a matemática.</div>`;
}

function renderLesson(){
 const k=state.lesson.key,t=topicInfo[k],slides=buildSlides(k),s=slides[state.slide];
 const p=Math.round((state.slide/(slides.length-1))*100);
 let body='';
 if(s.type==='content')body=`<h2>${s.title}</h2>${s.body}`;
 else if(s.type==='visual')body=`<h2>${s.title}</h2>${s.body}${visualHTML(s.visual)}`;
 else body=renderQuizSlide(s.q,s.num);
 $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">${YL[t.year]} / ${t.title}</span><h1>${t.title}</h1><p>Aula interativa · 3 questões · progresso salvo automaticamente</p></div><div class="module-progress"><span><b>Slide ${state.slide+1} / ${slides.length}</b><b>${p}%</b></span><div class="progress-line"><i style="width:${p}%"></i></div></div></div>
 <div class="lesson-shell"><div class="slide">${body}</div><div class="lesson-nav"><button class="btn secondary" onclick="lessonPrev()" ${state.slide===0?'disabled':''}>← Anterior</button><span class="slide-count">${state.slide+1} / ${slides.length}</span><button class="btn" id="nextLessonBtn" onclick="lessonNext()" ${s.type==='quiz'&&!state.quizLocked?'disabled':''}>${state.slide===slides.length-1?'Concluir tópico':'Próximo →'}</button></div></div>`;
 if(s.type==='visual')setTimeout(()=>drawLessonChart(s.visual),80);
 if(s.type==='quiz'&&state.quizLocked)setTimeout(()=>{$$('.choice').forEach((b,i)=>{if(i===s.q.a)b.classList.add('correct')})},10);
}

function renderQuizSlide(q,num){
 const key=state.lesson.key,stats=state.topicStats[key]||{total:0,correct:0};
 if(!q)return '<div class="empty">Questão indisponível.</div>';
 return `<div class="question-meta"><span>Prática · Questão ${num} de 3</span><span>+10 pontos</span></div><h2>${q.q}</h2><div class="choice-list">${q.opts.map((o,i)=>`<button class="choice ${state.quizLocked?(i===q.a?'correct':''):''}" onclick="answerTopic(${i})" ${state.quizLocked?'disabled':''}>${String.fromCharCode(65+i)}) ${o}</button>`).join('')}</div>${state.quizFeedback||''}`;
}
function answerTopic(i){
 if(state.quizLocked)return;
 const slides=buildSlides(state.lesson.key),s=slides[state.slide],q=s.q;
 state.quizLocked=true;
 const ok=i===q.a;
 state.score+=ok?10:0;state.answered++;if(ok)state.correct++;
 const st=state.topicStats[state.lesson.key]||{total:0,correct:0};st.total++;if(ok)st.correct++;state.topicStats[state.lesson.key]=st;save();
 state.quizFeedback=`<div class="feedback ${ok?'good':'bad'}"><strong>${ok?'Resposta correta — +10 pontos':'Resposta incorreta — +0 pontos'}</strong><div><b>Resposta:</b> ${String.fromCharCode(65+q.a)}) ${q.opts[q.a]}</div><p>${q.e}</p>${!ok?`<p><b>Você marcou:</b> ${String.fromCharCode(65+i)}) ${q.opts[i]}</p>`:''}</div>`;
 renderLesson();
}
function lessonNext(){
 const slides=buildSlides(state.lesson.key);
 if(state.slide<slides.length-1){state.slide++;state.quizLocked=false;state.quizFeedback='';renderLesson();window.scrollTo({top:0,behavior:'smooth'});}
 else {showToast('Tópico concluído!');state.lesson=null;renderYear(topicInfo[state.lesson?.key]?.year||topicInfo[Object.keys(topicInfo).find(k=>k===state.view)]?.year||1);}
}
function lessonPrev(){if(state.slide>0){state.slide--;state.quizLocked=false;state.quizFeedback='';renderLesson();window.scrollTo({top:0,behavior:'smooth'})}}

function drawLessonChart(v){
 const c=$('#lessonChart');if(!c)return;if(state.chart)state.chart.destroy();
 let labels=[],data=[],label='Valores';
 if(v==='quadratic'){labels=[-2,-1,0,1,2,3,4,5,6];data=labels.map(x=>-x*x+4*x);label='f(x) = −x² + 4x'}
 else if(v==='exponential'){labels=[0,1,2,3,4,5];data=labels.map(x=>2**x);label='f(x)=2ˣ'}
 else if(v==='log'){labels=[1,2,4,8,16,32];data=labels.map(x=>Math.log2(x));label='f(x)=log₂(x)'}
 else if(v==='line'){labels=[-2,-1,0,1,2,3,4];data=labels.map(x=>2*x+1);label='f(x)=2x+1'}
 else if(v==='stats'){labels=['A','B','C','D','E'];data=[12,19,8,15,22];label='Dados simulados'}
 else {labels=[0,1,2,3,4,5];data=[0,2,4,6,8,10];label='Exemplo'}
 state.chart=new Chart(c,{type:v==='stats'?'bar':'line',data:{labels,datasets:[{label,data,borderWidth:2,tension:.25,fill:v==='stats'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}},scales:{y:{beginAtZero:true}}}});
}

function renderSimulado(){
 if(state.sim){renderSimQuestion();return}
 $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Avaliação</span><h1>Simulado Geral</h1><p>20 questões misturando matemática básica, álgebra, funções, geometria, estatística, probabilidade e matemática financeira.</p></div></div>
 <div class="panel"><h2>Antes de começar</h2><p>Faça o simulado sem consultar as aulas para medir seu desempenho real. Cada acerto vale 10 pontos.</p><div class="result-panel"><div class="result-stat"><b>20</b><span>questões</span></div><div class="result-stat"><b>200</b><span>pontos máximos</span></div><div class="result-stat"><b>100%</b><span>avaliação completa</span></div><div class="result-stat"><b>misto</b><span>Iniciante, Intermediário e Avançado</span></div></div><button class="btn" onclick="startSim()">Iniciar simulado</button></div>`;
}
const simBase=[
 ['conjuntos',0],['razao',2],['potencia',1],['algebra',0],['equacoes',1],['funcoes',0],['geometria',2],
 ['quadratica',0],['exponencial',1],['logaritmos',0],['progressao',0],['trigonometria',1],['circresp',2],['combinatoria',0],
 ['analitica',0],['matrizes',2],['sistemas',0],['probabilidade',1],['estatistica',0],['financeira',2]
];
function startSim(){state.sim={i:0,correct:0,locked:false,feedback:''};renderSimQuestion()}
function renderSimQuestion(){
 const [k,qi]=simBase[state.sim.i],q=topicQuestions[k][qi],t=topicInfo[k];
 $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Simulado Geral / ${t.title}</span><h1>Simulado Geral</h1><p>${t.title} · cada acerto vale 10 pontos</p></div><div class="module-progress"><span><b>Questão ${state.sim.i+1} de 20</b><b>${state.sim.correct*10} pts</b></span><div class="progress-line"><i style="width:${(state.sim.i/20)*100}%"></i></div></div></div><div class="lesson-shell"><div class="slide"><div class="question-meta"><span>${YL[t.year]}</span><span>Questão ${state.sim.i+1}/20</span></div><h2>${q.q}</h2><div class="choice-list">${q.opts.map((o,i)=>`<button class="choice ${state.sim.locked&&i===q.a?'correct':''}" onclick="answerSim(${i})" ${state.sim.locked?'disabled':''}>${String.fromCharCode(65+i)}) ${o}</button>`).join('')}</div>${state.sim.feedback}</div><div class="lesson-nav"><span class="slide-count">${state.sim.i+1} / 20</span>${state.sim.locked?`<button class="btn" onclick="nextSim()">${state.sim.i===19?'Ver resultado':'Próxima questão →'}</button>`:''}</div></div>`;
}
function answerSim(i){
 if(state.sim.locked)return;const [k,qi]=simBase[state.sim.i],q=topicQuestions[k][qi],ok=i===q.a;state.sim.locked=true;if(ok)state.sim.correct++;state.sim.feedback=`<div class="feedback ${ok?'good':'bad'}"><strong>${ok?'Correto — +10 pontos':'Incorreto — +0 pontos'}</strong><div><b>Resposta:</b> ${String.fromCharCode(65+q.a)}) ${q.opts[q.a]}</div><p>${q.e}</p></div>`;renderSimQuestion()
}
function nextSim(){if(state.sim.i===19){state.score+=state.sim.correct*10;state.answered+=20;state.correct+=state.sim.correct;save();const r=state.sim.correct/20*100;state.sim={done:true,correct:state.sim.correct,pct:r};renderSimResult();return}state.sim.i++;state.sim.locked=false;state.sim.feedback='';renderSimQuestion()}
function renderSimResult(){const r=state.sim;const msg=r.pct<=30?'Continue praticando':r.pct<=60?'Bom começo':r.pct<=80?'Muito bom':'Excelente';$('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Simulado Geral / Resultado</span><h1>Resultado</h1><p>${msg}! Use o resultado para decidir o que revisar.</p></div></div><div class="panel"><div class="result-panel"><div class="result-stat"><b>${r.correct}</b><span>acertos</span></div><div class="result-stat"><b>${20-r.correct}</b><span>erros</span></div><div class="result-stat"><b>${r.correct*10}</b><span>pontos</span></div><div class="result-stat"><b>${r.pct}%</b><span>aproveitamento</span></div></div><button class="btn" onclick="state.sim=null;renderSimulado()">Novo simulado</button></div>`}

function renderProgress(){
 const all=Object.keys(topicInfo),overall=Math.round(all.map(topicPct).reduce((a,b)=>a+b,0)/all.length);
 $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Acompanhamento</span><h1>Meu Progresso</h1><p>Seu desempenho fica salvo neste navegador.</p></div></div>
 <div class="result-panel"><div class="result-stat"><b>${overall}%</b><span>progresso geral</span></div><div class="result-stat"><b>${state.answered}</b><span>questões</span></div><div class="result-stat"><b>${state.correct}</b><span>acertos</span></div><div class="result-stat"><b>${state.score}</b><span>pontuação</span></div></div>
 <div class="progress-grid"><div class="panel"><h2>Por nível</h2>${[1,2,3].map(y=>`<div class="bar-row"><div><b>${YL[y]}</b><span>${yearProgress(y)}%</span></div><div class="progress-line"><i style="width:${yearProgress(y)}%"></i></div></div>`).join('')}</div><div class="panel"><h2>Desempenho</h2><div class="chart-box"><canvas id="progressChart"></canvas></div></div></div>
 <div class="section-title"><div><h2>Tópicos</h2><p>100% indica que as três questões registradas foram acertadas.</p></div></div><div class="topic-grid">${all.map(k=>`<article class="topic-card" onclick="openTopic('${k}')"><span class="tag">${Math.round(topicPct(k))}%</span><h3>${topicInfo[k].title}</h3><p>${YL[topicInfo[k].year]} · ${topicStatsText(k)}</p><div class="progress-line"><i style="width:${topicPct(k)}%"></i></div></article>`).join('')}</div>
 <div class="section-title"><div><h2>Certificado simbólico</h2><p>Disponível quando todos os tópicos forem concluídos.</p></div></div>${overall===100?`<div class="certificate"><div class="eyebrow">MATEMÁTICA — ENSINO MÉDIO</div><h2>PARABÉNS!</h2><p>Você concluiu a trilha de Matemática do Ensino Médio.</p><div class="cert-name">Estudante</div><div class="cert-data">Data: ${new Date().toLocaleDateString('pt-BR')}<br>Pontuação: ${state.score} pontos<br>Aproveitamento: ${pct()}%</div><br><button class="btn" onclick="window.print()">Gerar certificado</button></div>`:`<div class="panel"><p>Conclua os tópicos para liberar o certificado simbólico.</p></div>`}`;
 setTimeout(()=>drawProgressChart(),80);
}
function topicStatsText(k){const s=state.topicStats[k];return s?`${s.correct}/${s.total} acertos`:'ainda não iniciado'}
function drawProgressChart(){const c=$('#progressChart');if(!c)return;if(state.chart)state.chart.destroy();state.chart=new Chart(c,{type:'bar',data:{labels:[YL[1],YL[2],YL[3]],datasets:[{label:'Progresso (%)',data:[yearProgress(1),yearProgress(2),yearProgress(3)],borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}}}})}

function renderSettings(){
 $('#app').innerHTML=`<div class="module-head"><div><span class="crumb">Preferências</span><h1>Configurações</h1><p>Personalize a experiência e gerencie os dados locais.</p></div></div><div class="panel">
 <div class="setting-row"><div><h3>Modo escuro</h3><p>Alterna entre interface clara e escura.</p></div><button class="toggle ${state.theme==='dark'?'on':''}" onclick="toggleTheme()"><i></i></button></div>
 <div class="setting-row"><div><h3>Dados de progresso</h3><p>Pontuação, questões e desempenho são armazenados no localStorage deste navegador.</p></div><button class="btn ghost" onclick="resetProgress()">Redefinir</button></div>
 <div class="setting-row"><div><h3>Acessibilidade</h3><p>Use Tab para navegar e Enter para ativar controles. As setas ← e → navegam nas aulas.</p></div><span class="tag">ATIVO</span></div>
 </div>`;
}
function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';save();render()}
function resetProgress(){if(confirm('Deseja apagar todo o progresso?')){Object.keys(localStorage).filter(k=>k.startsWith('mm_')).forEach(k=>localStorage.removeItem(k));location.reload()}}

function search(){
 const q=$('#searchInput').value.trim().toLowerCase(),box=$('#searchResults');if(!q){box.classList.remove('show');return}
 const hits=Object.entries(topicInfo).filter(([k,t])=>(t.title+' '+t.desc).toLowerCase().includes(q)).slice(0,8);
 box.innerHTML=hits.length?hits.map(([k,t])=>`<div class="result" onclick="openTopic('${k}');$('#searchResults').classList.remove('show');$('#searchInput').value=''"><b>${t.title}</b><small>${YL[t.year]} · ${t.desc}</small></div>`).join(''):'<div class="result"><small>Nenhum módulo encontrado.</small></div>';box.classList.add('show')
}

$('#menuBtn').onclick=openMenu;$('#closeMenu').onclick=closeMenu;$('#overlay').onclick=closeMenu;$('#themeBtn').onclick=toggleTheme;$('#searchInput').addEventListener('input',search);
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
document.addEventListener('keydown',e=>{if(state.lesson&&!e.target.matches('input,textarea')){if(e.key==='ArrowRight'&&!document.querySelector('#nextLessonBtn')?.disabled)lessonNext();if(e.key==='ArrowLeft')lessonPrev()}});
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('#searchResults').classList.remove('show')});

render();

function hideLoader(){const l=$('#loader');if(!l)return;l.classList.add('hide');setTimeout(()=>l.remove(),600)}
window.addEventListener('load',()=>setTimeout(hideLoader,Math.max(300,1800-performance.now())));
setTimeout(hideLoader,5000);
