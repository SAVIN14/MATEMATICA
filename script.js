/* ================= SUPABASE =================
   Cole aqui a URL e a chave PUBLICÁVEL (anon/publishable) do seu projeto.
   Nunca coloque a service_role/secret key neste arquivo.
*/
const SUPABASE_URL = 'https://vwyudcxdcgtcjceunthz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_elyZPGT9OZJQtxZJbuT1fw_BRUAB-4s';

const CLOUD_ENABLED =
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_ANON_KEY.startsWith('COLE_');

let cloud = null;
let cloudReady = false;

if (CLOUD_ENABLED && window.supabase?.createClient) {
  cloud = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}


/* ================= UTILITÁRIOS ================= */

const $ = s => document.querySelector(s);

const $$ = s => [...document.querySelectorAll(s)];


/* ================= ESTADO ================= */

const state = {
  view: localStorage.getItem('mm_view') || 'home',

  theme: localStorage.getItem('mm_theme') || 'light',

  score: +(localStorage.getItem('mm_score') || 0),

  answered: +(localStorage.getItem('mm_answered') || 0),

  correct: +(localStorage.getItem('mm_correct') || 0),

  logicDone:
    localStorage.getItem('mm_logicDone') === '1',

  topicStats:
    JSON.parse(
      localStorage.getItem('mm_topicStats') || '{}'
    ),

  logicResults:
    JSON.parse(
      localStorage.getItem('mm_logicResults') || '[]'
    ),

  lesson: null,

  slide: 0,

  quizLocked: false,

  sim: null,

  chart: null
};


/* ================= INFORMAÇÕES DOS TÓPICOS ================= */

const topicInfo = {

  // 1º ANO

  conjuntos: {
    year: 1,
    title: 'Conjuntos numéricos',
    desc: 'Naturais, inteiros, racionais, irracionais, reais, reta e intervalos.',
    concept: 'Os conjuntos numéricos organizam os números de acordo com suas características. Naturais incluem contagens; inteiros incluem negativos; racionais podem ser escritos como fração; irracionais não podem; reais reúnem racionais e irracionais.',
    formula: 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ  e  ℝ = ℚ ∪ (irracionais)',
    daily: 'Ao medir uma temperatura, contar objetos ou representar uma dívida, você usa diferentes tipos de números.',
    example: '−3 é inteiro e real; 1/2 é racional; √2 é irracional; 5 é natural, inteiro, racional e real.',
    visual: 'numberline'
  },

  razao: {
    year: 1,
    title: 'Razão, proporção e porcentagem',
    desc: 'Comparações, proporcionalidade, regra de três e porcentagens.',
    concept: 'Razão compara duas grandezas por divisão. Proporção é uma igualdade entre razões. A regra de três organiza relações proporcionais. Porcentagem é uma razão com denominador 100.',
    formula: 'porcentagem = (parte / total) × 100',
    daily: 'Descontos, receitas, salários, consumo de água e energia usam proporções e porcentagens.',
    example: 'Uma camisa de R$ 200 com 15% de desconto: desconto = 0,15×200 = R$ 30; preço final = R$ 170.',
    visual: 'table'
  },

  potencia: {
    year: 1,
    title: 'Potenciação e radiciação',
    desc: 'Potências, propriedades, raízes e notação científica.',
    concept: 'Potenciação representa multiplicações repetidas. Na potência a^n, a é a base e n é o expoente. Radiciação desfaz a potenciação em situações compatíveis.',
    formula: 'a^m·a^n=a^(m+n) ; a^m/a^n=a^(m−n) ; (a^m)^n=a^(mn)',
    daily: 'Áreas, escalas, armazenamento e medidas muito grandes ou pequenas usam potências.',
    example: '2^3 = 2·2·2 = 8. Já √49 = 7 porque 7^2 = 49.',
    visual: 'none'
  },

  algebra: {
    year: 1,
    title: 'Expressões algébricas',
    desc: 'Variáveis, termos, polinômios, produtos notáveis e fatoração.',
    concept: 'Uma expressão algébrica combina números, variáveis e operações. Termos semelhantes têm a mesma parte literal e podem ser reduzidos.',
    formula: '(a+b)^2=a^2+2ab+b^2',
    daily: 'Fórmulas de área e custo podem ser escritas com letras quando o valor ainda não é conhecido.',
    example: '3x+2x−4 = 5x−4. Para x=2, o resultado é 6.',
    visual: 'none'
  },

  equacoes: {
    year: 1,
    title: 'Equações',
    desc: 'Equações do 1º e 2º grau, delta, raízes e problemas.',
    concept: 'Equação é uma igualdade que contém uma incógnita. Resolver significa encontrar valores que tornam a igualdade verdadeira.',
    formula: 'ax²+bx+c=0  →  Δ=b²−4ac  →  x=(-b±√Δ)/(2a)',
    daily: 'Descobrir um preço desconhecido, uma distância ou uma quantidade pode ser modelado por uma equação.',
    example: '2x+6=14 → 2x=8 → x=4. No 2º grau, usamos fatoração ou Bhaskara quando apropriado.',
    visual: 'quadratic'
  },

  funcoes: {
    year: 1,
    title: 'Funções',
    desc: 'Domínio, contradomínio, imagem, tabelas, gráficos, afim e quadrática.',
    concept: 'Função associa cada entrada permitida a uma única saída. A variável independente costuma ser x e a dependente pode ser escrita f(x).',
    formula: 'função afim: f(x)=ax+b',
    daily: 'Preço em função da quantidade, distância em função do tempo e consumo em função dos dias são exemplos.',
    example: 'f(x)=2x+1: para x=3, f(3)=7. A tabela x→f(x) permite construir o gráfico.',
    visual: 'line'
  },

  geometria: {
    year: 1,
    title: 'Geometria plana',
    desc: 'Ângulos, triângulos, quadriláteros, perímetros e áreas.',
    concept: 'Geometria plana estuda figuras no plano. Perímetro soma comprimentos das bordas; área mede a região interna.',
    formula: 'A_quadrado=l² ; A_retângulo=bh ; A_triângulo=bh/2 ; A_trapézio=(B+b)h/2',
    daily: 'Pisos, paredes, terrenos e molduras podem ser dimensionados com perímetro e área.',
    example: 'Retângulo 8 m×3 m: perímetro=22 m e área=24 m².',
    visual: 'geometry'
  },


  // 2º ANO

  quadratica: {
    year: 2,
    title: 'Função quadrática',
    desc: 'Parábola, concavidade, raízes, vértice, máximo e mínimo.',
    concept: 'É uma função f(x)=ax²+bx+c, com a diferente de zero. Seu gráfico é uma parábola. O sinal de a define a concavidade.',
    formula: 'xv=−b/(2a) ; yv=f(xv)',
    daily: 'Altura de um objeto lançado, lucro máximo e trajetórias podem ter comportamento quadrático.',
    example: 'f(x)=−x²+4x tem concavidade para baixo e máximo no vértice x=2.',
    visual: 'quadratic'
  },

  exponencial: {
    year: 2,
    title: 'Função exponencial',
    desc: 'Crescimento, decrescimento, gráficos e aplicações.',
    concept: 'Na função f(x)=a^x, com a>0 e a≠1, a variável aparece no expoente. Se a>1, há crescimento; se 0<a<1, há decrescimento.',
    formula: 'f(x)=a^x',
    daily: 'Crescimento populacional, juros compostos, bactérias e depreciação podem ser modelados por exponenciais.',
    example: '2^0=1, 2^1=2, 2^2=4, 2^3=8: os valores dobram a cada aumento de 1 em x.',
    visual: 'exponential'
  },

  logaritmos: {
    year: 2,
    title: 'Logaritmos',
    desc: 'Conceito, propriedades, mudança de base e equações.',
    concept: 'Logaritmo responde: qual expoente preciso usar na base para obter o argumento?',
    formula: 'log_b(a)=c  ⇔  b^c=a',
    daily: 'Escalas e fenômenos que variam em muitas ordens de grandeza podem usar logaritmos.',
    example: 'log_2(8)=3 porque 2^3=8. A propriedade do produto transforma multiplicações em somas.',
    visual: 'log'
  },

  progressao: {
    year: 2,
    title: 'Progressões — PA e PG',
    desc: 'Sequências, razão, termo geral e soma.',
    concept: 'PA tem diferença constante entre termos. PG tem quociente constante entre termos.',
    formula: 'PA: a_n=a_1+(n−1)r ; PG: a_n=a_1·q^(n−1)',
    daily: 'Parcelas com aumento fixo lembram PA; crescimento percentual repetido lembra PG.',
    example: 'PA 3,7,11,... tem r=4. PG 2,6,18,... tem q=3.',
    visual: 'none'
  },

  trigonometria: {
    year: 2,
    title: 'Trigonometria',
    desc: 'Seno, cosseno, tangente, leis dos senos e cossenos.',
    concept: 'No triângulo retângulo, as razões trigonométricas relacionam lados e ângulos. Seno é oposto/hipotenusa, cosseno é adjacente/hipotenusa e tangente é oposto/adjacente.',
    formula: 'sen θ=oposto/hipotenusa ; cos θ=adjacente/hipotenusa ; tg θ=oposto/adjacente',
    daily: 'Alturas, rampas, telhados e distâncias inacessíveis podem ser calculados com trigonometria.',
    example: 'Em um triângulo 3-4-5, para o ângulo cujo oposto mede 3, sen θ=3/5.',
    visual: 'triangle'
  },

  circresp: {
    year: 2,
    title: 'Circunferência e geometria espacial',
    desc: 'Círculo, circunferência, polígonos, prismas, cilindros e pirâmides.',
    concept: 'Circunferência é a linha que delimita o círculo. Na geometria espacial, estudamos sólidos e suas áreas e volumes.',
    formula: 'C=2πr ; A_círculo=πr² ; V_prisma=Ab·h ; V_cilindro=πr²h',
    daily: 'Rodas, latas, caixas e recipientes são modelos geométricos comuns.',
    example: 'Círculo de raio 3: área=9π. Cilindro de raio 2 e altura 5: volume=20π.',
    visual: 'solid'
  },

  combinatoria: {
    year: 2,
    title: 'Análise combinatória',
    desc: 'Contagem, permutação, arranjo e combinação.',
    concept: 'Análise combinatória conta possibilidades sem precisar listar tudo. A estratégia depende de a ordem importar e de haver ou não repetição.',
    formula: 'P(n)=n! ; A(n,p)=n!/(n−p)! ; C(n,p)=n!/[p!(n−p)!]',
    daily: 'Senhas, cardápios, equipes, looks e sequências de escolhas são problemas de contagem.',
    example: '3 camisetas e 2 calças geram 3×2=6 looks diferentes.',
    visual: 'none'
  },


  // 3º ANO

  espacial: {
    year: 3,
    title: 'Geometria espacial',
    desc: 'Prismas, pirâmides, cilindros, cones, esferas, áreas e volumes.',
    concept: 'A geometria espacial mede regiões tridimensionais. Volume mede o espaço ocupado; área mede superfícies.',
    formula: 'V_prisma=Abh ; V_cilindro=πr²h ; V_esfera=4πr³/3',
    daily: 'Reservatórios, embalagens e recipientes exigem estimativas de volume e área.',
    example: 'Um prisma com área da base 10 cm² e altura 6 cm tem volume 60 cm³.',
    visual: 'solid'
  },

  analitica: {
    year: 3,
    title: 'Geometria analítica',
    desc: 'Plano cartesiano, distância, ponto médio, reta e circunferência.',
    concept: 'Geometria analítica traduz figuras e relações geométricas em coordenadas e equações.',
    formula: 'd=√[(x₂−x₁)²+(y₂−y₁)²] ; M=((x₁+x₂)/2,(y₁+y₂)/2)',
    daily: 'Mapas digitais e localização por coordenadas usam ideias do plano cartesiano.',
    example: 'Entre A(0,0) e B(3,4), d=5.',
    visual: 'cartesian'
  },

  matrizes: {
    year: 3,
    title: 'Matrizes',
    desc: 'Linhas, colunas, ordem, operações e determinantes.',
    concept: 'Matriz é uma organização retangular de números. A ordem é dada por linhas × colunas.',
    formula: 'det [[a,b],[c,d]]=ad−bc',
    daily: 'Tabelas de dados e transformações computacionais podem ser organizadas como matrizes.',
    example: 'Uma matriz 2×3 tem 2 linhas e 3 colunas, totalizando 6 elementos.',
    visual: 'matrix'
  },

  sistemas: {
    year: 3,
    title: 'Sistemas lineares',
    desc: 'Sistemas 2×2 e 3×3, substituição, adição e interpretação geométrica.',
    concept: 'Sistema linear reúne duas ou mais equações que devem ser satisfeitas simultaneamente.',
    formula: 'x+y=7 ; x−y=1  →  2x=8 → x=4, y=3',
    daily: 'Combinar preços e quantidades ou distribuir recursos pode gerar sistemas.',
    example: 'Somando x+y=7 e x−y=1, obtemos 2x=8; então x=4 e y=3.',
    visual: 'none'
  },

  probabilidade: {
    year: 3,
    title: 'Probabilidade',
    desc: 'Espaço amostral, eventos, probabilidade e situações de contagem.',
    concept: 'Probabilidade mede a chance de um evento ocorrer. Em casos equiprováveis, é a razão entre casos favoráveis e casos possíveis.',
    formula: 'P(A)=casos favoráveis/casos possíveis',
    daily: 'Jogos, previsão de riscos e tomada de decisões envolvem probabilidade.',
    example: 'Ao lançar um dado justo, P(sair 6)=1/6.',
    visual: 'none'
  },

  estatistica: {
    year: 3,
    title: 'Estatística',
    desc: 'Média, mediana, moda, amplitude, gráficos e interpretação de dados.',
    concept: 'Estatística organiza e interpreta dados. Medidas de tendência central ajudam a resumir conjuntos de valores.',
    formula: 'média = soma dos valores / quantidade de valores',
    daily: 'Notas, pesquisas, preços e indicadores usam estatística.',
    example: 'Notas 6, 7 e 8: média=(6+7+8)/3=7.',
    visual: 'stats'
  },

  financeira: {
    year: 3,
    title: 'Matemática financeira',
    desc: 'Porcentagem, juros simples, juros compostos e aplicações.',
    concept: 'Matemática financeira estuda o comportamento do dinheiro ao longo do tempo.',
    formula: 'J=Cit ; M=C(1+i)^t',
    daily: 'Parcelamentos, investimentos, empréstimos e descontos são aplicações diretas.',
    example: 'R$ 1.000 a 10% ao mês em juros compostos: após 2 meses, M=1000(1,1)^2=R$1.210.',
    visual: 'none'
  }
};


/* ================= SUPABASE: SALVAR ================= */

async function syncCloud() {

  if (!cloud) {
    return;
  }

  try {

    const {
      data: {
        user
      }
    } = await cloud.auth.getUser();

    if (!user) {
      return;
    }

    const payload = {
      user_id: user.id,

      theme: state.theme,

      score: state.score,

      answered: state.answered,

      correct: state.correct,

      logic_done: state.logicDone,

      topic_stats: state.topicStats,

      logic_results: state.logicResults,

      updated_at: new Date().toISOString()
    };

    const {
      error
    } = await cloud
      .from('math_progress')
      .upsert(
        payload,
        {
          onConflict: 'user_id'
        }
      );

    if (error) {
      throw error;
    }

    cloudReady = true;

    console.log(
      'Progresso sincronizado com o Supabase.'
    );

  } catch (error) {

    cloudReady = false;

    console.error(
      'Erro ao sincronizar com Supabase:',
      error
    );
  }
}


/* ================= SUPABASE: CARREGAR ================= */

async function loadCloud() {

  if (!cloud) {

    console.warn(
      'Supabase não carregado. Usando armazenamento local.'
    );

    return;
  }

  try {

    let {
      data: {
        session
      }
    } = await cloud.auth.getSession();


    if (!session) {

      const {
        data,
        error
      } = await cloud.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      session = data.session;
    }


    if (!session) {

      throw new Error(
        'Não foi possível criar uma sessão.'
      );
    }


    const {
      data,
      error
    } = await cloud
      .from('math_progress')
      .select('*')
      .eq(
        'user_id',
        session.user.id
      )
      .maybeSingle();


    if (error) {
      throw error;
    }


    if (data) {

      state.theme =
        data.theme ??
        state.theme;

      state.score =
        Number(
          data.score ??
          state.score
        );

      state.answered =
        Number(
          data.answered ??
          state.answered
        );

      state.correct =
        Number(
          data.correct ??
          state.correct
        );

      state.logicDone =
        Boolean(
          data.logic_done ??
          state.logicDone
        );

      state.topicStats =
        data.topic_stats ||
        state.topicStats;

      state.logicResults =
        data.logic_results ||
        state.logicResults;


      saveLocal();

      cloudReady = true;

      console.log(
        'Progresso carregado do Supabase.'
      );

    } else {

      await syncCloud();
    }

  } catch (error) {

    cloudReady = false;

    console.warn(
      'Supabase indisponível; usando armazenamento local.',
      error
    );
  }
}


/* ================= SALVAMENTO LOCAL ================= */

function saveLocal() {

  localStorage.setItem(
    'mm_view',
    state.view
  );

  localStorage.setItem(
    'mm_theme',
    state.theme
  );

  localStorage.setItem(
    'mm_score',
    state.score
  );

  localStorage.setItem(
    'mm_answered',
    state.answered
  );

  localStorage.setItem(
    'mm_correct',
    state.correct
  );

  localStorage.setItem(
    'mm_logicDone',
    state.logicDone ? '1' : '0'
  );

  localStorage.setItem(
    'mm_topicStats',
    JSON.stringify(
      state.topicStats
    )
  );

  localStorage.setItem(
    'mm_logicResults',
    JSON.stringify(
      state.logicResults
    )
  );
}


/* ================= SALVAR TUDO ================= */

function save() {

  saveLocal();

  syncCloud();
}


/* ================= RESETAR PROGRESSO ================= */

async function resetProgress() {

  if (
    !confirm(
      'Deseja apagar todo o progresso?'
    )
  ) {
    return;
  }


  state.score = 0;

  state.answered = 0;

  state.correct = 0;

  state.logicDone = false;

  state.topicStats = {};

  state.logicResults = [];


  Object.keys(localStorage)
    .filter(
      key =>
        key.startsWith('mm_')
    )
    .forEach(
      key =>
        localStorage.removeItem(key)
    );


  /*
   * Salva o estado zerado
   * antes de recarregar.
   */

  saveLocal();

  await syncCloud();

  location.reload();
}


/* ================= TEMA ================= */

function toggleTheme() {

  state.theme =
    state.theme === 'dark'
      ? 'light'
      : 'dark';

  save();

  render();
}


/* ================= PESQUISA ================= */

function search() {

  const input =
    $('#searchInput');

  const box =
    $('#searchResults');

  if (!input || !box) {
    return;
  }


  const q =
    input.value
      .trim()
      .toLowerCase();


  if (!q) {

    box.classList.remove(
      'show'
    );

    return;
  }


  const hits =
    Object.entries(topicInfo)
      .filter(
        ([k, t]) =>
          (
            t.title +
            ' ' +
            t.desc
          )
            .toLowerCase()
            .includes(q)
      )
      .slice(0, 8);


  box.innerHTML =
    hits.length

      ? hits
          .map(
            ([k, t]) => `
              <div
                class="result"
                onclick="
                  openTopic('${k}');
                  $('#searchResults').classList.remove('show');
                  $('#searchInput').value=''
                "
              >
                <b>
                  ${t.title}
                </b>

                <small>
                  ${YL[t.year]} · ${t.desc}
                </small>
              </div>
            `
          )
          .join('')

      : `
          <div class="result">
            <small>
              Nenhum módulo encontrado.
            </small>
          </div>
        `;


  box.classList.add(
    'show'
  );
}


/* ================= INICIALIZAÇÃO ================= */

function applyTheme() {

  document.documentElement
    .setAttribute(
      'data-theme',
      state.theme
    );
}


/* ================= RENDER ================= */

function render() {

  applyTheme();

  /*
   * A função render original da plataforma
   * continua sendo utilizada aqui.
   */

  if (typeof renderView === 'function') {
    renderView();
  }

}


/* ================= EVENTOS ================= */

const menuBtn =
  $('#menuBtn');

if (menuBtn) {
  menuBtn.onclick =
    openMenu;
}


const closeMenuBtn =
  $('#closeMenu');

if (closeMenuBtn) {
  closeMenuBtn.onclick =
    closeMenu;
}


const overlay =
  $('#overlay');

if (overlay) {
  overlay.onclick =
    closeMenu;
}


const themeBtn =
  $('#themeBtn');

if (themeBtn) {
  themeBtn.onclick =
    toggleTheme;
}


const searchInput =
  $('#searchInput');

if (searchInput) {

  searchInput.addEventListener(
    'input',
    search
  );
}


$$('.nav-item')
  .forEach(
    button => {

      button.addEventListener(
        'click',
        () =>
          setView(
            button.dataset.view
          )
      );

    }
  );


/* ================= TECLADO ================= */

document.addEventListener(
  'keydown',
  event => {

    if (
      state.lesson &&
      !event.target.matches(
        'input,textarea'
      )
    ) {

      if (
        event.key === 'ArrowRight' &&
        !document
          .querySelector(
            '#nextLessonBtn'
          )
          ?.disabled
      ) {

        lessonNext();
      }


      if (
        event.key === 'ArrowLeft'
      ) {

        lessonPrev();
      }

    }

  }
);


/* ================= CLIQUE FORA DA PESQUISA ================= */

document.addEventListener(
  'click',
  event => {

    if (
      !event.target.closest(
        '.search-wrap'
      )
    ) {

      const results =
        $('#searchResults');

      if (results) {

        results.classList.remove(
          'show'
        );
      }

    }

  }
);


/* ================= INICIALIZAÇÃO DA PLATAFORMA ================= */

(async function initPlatform() {

  applyTheme();

  await loadCloud();

  render();

})();


/* ================= LOADING ================= */

function hideLoader() {

  const loader =
    $('#loader');

  if (!loader) {
    return;
  }


  loader.classList.add(
    'hide'
  );


  setTimeout(
    () =>
      loader.remove(),
    600
  );
}


window.addEventListener(
  'load',
  () =>
    setTimeout(
      hideLoader,
      Math.max(
        300,
        1800 - performance.now()
      )
    )
);


setTimeout(
  hideLoader,
  5000
);
