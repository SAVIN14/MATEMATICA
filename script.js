/* =========================================================
   MATEMÁTICA — ENSINO MÉDIO
   Professor Sávio Mendes
   Persistência local + Supabase
   ========================================================= */

/* =========================
   SUPABASE
   ========================= */

const SUPABASE_URL = 'https://vwyudcxdcgtcjceunthz.supabase.co';

const SUPABASE_ANON_KEY =
    'sb_publishable_elyZPGT9OZJQtxZJbuT1fw_BRUAB-4s';

let cloud = null;
let cloudReady = false;

if (window.supabase) {
    cloud = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}


/* =========================
   ESTADO DA PLATAFORMA
   ========================= */

const state = {
    view: localStorage.getItem('mm_view') || 'home',

    theme: localStorage.getItem('mm_theme') || 'light',

    score: Number(
        localStorage.getItem('mm_score') || 0
    ),

    answered: Number(
        localStorage.getItem('mm_answered') || 0
    ),

    correct: Number(
        localStorage.getItem('mm_correct') || 0
    ),

    logicDone: Number(
        localStorage.getItem('mm_logicDone') || 0
    ),

    topicStats: JSON.parse(
        localStorage.getItem('mm_topicStats') || '{}'
    ),

    logicResults: JSON.parse(
        localStorage.getItem('mm_logicResults') || '{}'
    )
};


/* =========================
   UTILITÁRIOS
   ========================= */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


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
        state.logicDone
    );

    localStorage.setItem(
        'mm_topicStats',
        JSON.stringify(state.topicStats)
    );

    localStorage.setItem(
        'mm_logicResults',
        JSON.stringify(state.logicResults)
    );
}


/* =========================
   SINCRONIZAÇÃO COM SUPABASE
   ========================= */

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


/* =========================
   CARREGAR DA NUVEM
   ========================= */

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


        /*
         * Cria um usuário anônimo caso
         * ainda não exista uma sessão.
         */

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


        /*
         * Se já existir progresso,
         * recupera os dados.
         */

        if (data) {

            state.theme =
                data.theme ??
                state.theme;

            state.score =
                Number(
                    data.score ?? state.score
                );

            state.answered =
                Number(
                    data.answered ?? state.answered
                );

            state.correct =
                Number(
                    data.correct ?? state.correct
                );

            state.logicDone =
                Number(
                    data.logic_done ?? state.logicDone
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

            /*
             * Primeiro acesso:
             * envia o progresso local para a nuvem.
             */

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


/* =========================
   SALVAR
   ========================= */

function save() {

    saveLocal();

    /*
     * Sincroniza sem bloquear
     * a interface.
     */

    syncCloud();
}


/* =========================
   NAVEGAÇÃO
   ========================= */

function navigate(view) {

    state.view = view;

    saveLocal();

    render();
}


/* =========================
   TEMA
   ========================= */

function applyTheme() {

    document.documentElement
        .setAttribute(
            'data-theme',
            state.theme
        );
}


function toggleTheme() {

    state.theme =
        state.theme === 'dark'
            ? 'light'
            : 'dark';

    applyTheme();

    save();

    render();
}


/* =========================
   ESTATÍSTICAS
   ========================= */

function getTotalTopics() {

    return Object.keys(
        state.topicStats
    ).length;
}


function getCompletedTopics() {

    return Object.values(
        state.topicStats
    ).filter(
        item => item && item.completed
    ).length;
}


function getProgress() {

    const total =
        getTotalTopics();

    const completed =
        getCompletedTopics();

    if (!total) {
        return 0;
    }

    return Math.round(
        (completed / total) * 100
    );
}


/* =========================
   MARCAR TÓPICO
   ========================= */

function completeTopic(topic) {

    if (!state.topicStats[topic]) {

        state.topicStats[topic] = {
            completed: false,
            questions: 0,
            correct: 0
        };
    }

    state.topicStats[topic].completed = true;

    save();
}


/* =========================
   REGISTRAR QUESTÃO
   ========================= */

function registerAnswer(
    topic,
    isCorrect
) {

    state.answered++;

    if (isCorrect) {
        state.correct++;
        state.score += 10;
    }


    if (!state.topicStats[topic]) {

        state.topicStats[topic] = {
            completed: false,
            questions: 0,
            correct: 0
        };
    }


    state.topicStats[topic].questions++;


    if (isCorrect) {

        state.topicStats[topic].correct++;
    }


    const stats =
        state.topicStats[topic];


    if (
        stats.questions > 0 &&
        stats.correct >= stats.questions
    ) {
        stats.completed = true;
    }


    save();
}


/* =========================
   DESAFIOS DE LÓGICA
   ========================= */

function completeLogic(index, correct) {

    const key =
        String(index);


    if (
        state.logicResults[key] === true
    ) {
        return;
    }


    state.logicResults[key] =
        Boolean(correct);


    if (correct) {

        state.logicDone++;

        state.score += 10;
    }


    save();
}


/* =========================
   HOME
   ========================= */

function renderHome() {

    const progress =
        getProgress();

    return `
        <section class="page home-page">

            <div class="hero">

                <div>
                    <span class="eyebrow">
                        MATEMÁTICA — ENSINO MÉDIO
                    </span>

                    <h1>
                        Aprenda matemática
                        de forma simples.
                    </h1>

                    <p>
                        Estude os principais conteúdos
                        do Ensino Médio, pratique questões
                        e acompanhe seu progresso.
                    </p>

                    <button
                        class="primary-btn"
                        onclick="navigate('levels')"
                    >
                        Começar a estudar
                    </button>
                </div>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <span>
                        Pontuação
                    </span>

                    <strong>
                        ${state.score}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>
                        Questões respondidas
                    </span>

                    <strong>
                        ${state.answered}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>
                        Acertos
                    </span>

                    <strong>
                        ${state.correct}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>
                        Progresso
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

            </div>


            <div class="progress-section">

                <div class="section-header">

                    <div>
                        <span class="eyebrow">
                            SEU PROGRESSO
                        </span>

                        <h2>
                            Continue estudando
                        </h2>
                    </div>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>

        </section>
    `;
}


/* =========================
   NÍVEIS
   ========================= */

function renderLevels() {

    return `
        <section class="page">

            <div class="page-header">

                <span class="eyebrow">
                    NÍVEIS
                </span>

                <h1>
                    Escolha seu nível
                </h1>

                <p>
                    Avance conforme seu domínio
                    dos conteúdos.
                </p>

            </div>


            <div class="levels-grid">

                <button
                    class="level-card"
                    onclick="navigate('iniciante')"
                >

                    <span class="level-number">
                        01
                    </span>

                    <h2>
                        Iniciante
                    </h2>

                    <p>
                        Fundamentos essenciais
                        da matemática.
                    </p>

                </button>


                <button
                    class="level-card"
                    onclick="navigate('intermediario')"
                >

                    <span class="level-number">
                        02
                    </span>

                    <h2>
                        Intermediário
                    </h2>

                    <p>
                        Conteúdos que exigem
                        maior domínio.
                    </p>

                </button>


                <button
                    class="level-card"
                    onclick="navigate('avancado')"
                >

                    <span class="level-number">
                        03
                    </span>

                    <h2>
                        Avançado
                    </h2>

                    <p>
                        Questões e conceitos
                        mais complexos.
                    </p>

                </button>

            </div>

        </section>
    `;
}


/* =========================
   CONFIGURAÇÕES
   ========================= */

function renderSettings() {

    return `
        <section class="page">

            <div class="page-header">

                <span class="eyebrow">
                    CONFIGURAÇÕES
                </span>

                <h1>
                    Configurações
                </h1>

                <p>
                    Personalize sua experiência
                    de estudo.
                </p>

            </div>


            <div class="settings-card">

                <div class="setting-item">

                    <div>

                        <strong>
                            Tema
                        </strong>

                        <p>
                            Alterne entre o modo
                            claro e escuro.
                        </p>

                    </div>

                    <button
                        class="secondary-btn"
                        onclick="toggleTheme()"
                    >
                        ${
                            state.theme === 'dark'
                                ? 'Modo claro'
                                : 'Modo escuro'
                        }
                    </button>

                </div>


                <div class="setting-item">

                    <div>

                        <strong>
                            Sincronização
                        </strong>

                        <p>
                            Seu progresso é salvo
                            localmente e, quando o
                            Supabase está configurado,
                            sincronizado com a nuvem.
                        </p>

                    </div>

                    <span class="status">

                        ${
                            cloudReady
                                ? 'Sincronizado'
                                : 'Local'
                        }

                    </span>

                </div>


                <div class="setting-item">

                    <div>

                        <strong>
                            Progresso
                        </strong>

                        <p>
                            Apague todos os dados
                            salvos desta conta.
                        </p>

                    </div>

                    <button
                        class="danger-btn"
                        onclick="resetProgress()"
                    >
                        Resetar progresso
                    </button>

                </div>

            </div>

        </section>
    `;
}


/* =========================
   RESETAR PROGRESSO
   ========================= */

async function resetProgress() {

    const confirmed =
        confirm(
            'Tem certeza que deseja apagar todo o seu progresso?'
        );


    if (!confirmed) {
        return;
    }


    state.score = 0;

    state.answered = 0;

    state.correct = 0;

    state.logicDone = 0;

    state.topicStats = {};

    state.logicResults = {};


    saveLocal();


    /*
     * Aguarda a sincronização
     * antes de recarregar a página.
     */

    await syncCloud();


    /*
     * Remove também os registros
     * antigos dos desafios.
     */

    Object.keys(localStorage)
        .filter(
            key =>
                key.startsWith('mm_logic_')
        )
        .forEach(
            key =>
                localStorage.removeItem(key)
        );


    render();
}


/* =========================
   RENDER PRINCIPAL
   ========================= */

function render() {

    applyTheme();


    const app =
        document.getElementById('app');


    if (!app) {
        return;
    }


    let content = '';


    switch (state.view) {

        case 'home':

            content =
                renderHome();

            break;


        case 'levels':

            content =
                renderLevels();

            break;


        case 'settings':

            content =
                renderSettings();

            break;


        /*
         * Os conteúdos específicos
         * de cada nível permanecem
         * conforme a estrutura original
         * da plataforma.
         */

        default:

            content =
                renderHome();

            break;
    }


    app.innerHTML = content;


    updateSidebar();

    updateScore();
}


/* =========================
   SIDEBAR
   ========================= */

function updateSidebar() {

    document
        .querySelectorAll(
            '[data-view]'
        )
        .forEach(
            element => {

                element.classList.toggle(
                    'active',
                    element.dataset.view ===
                    state.view
                );

            }
        );
}


/* =========================
   SCORE
   ========================= */

function updateScore() {

    const scoreElement =
        document.getElementById(
            'score'
        );


    if (scoreElement) {

        scoreElement.textContent =
            state.score;
    }
}


/* =========================
   LOADING
   ========================= */

function hideLoader() {

    const loader =
        document.getElementById(
            'loader'
        );


    if (!loader) {
        return;
    }


    loader.classList.add(
        'hidden'
    );


    setTimeout(
        () => {

            loader.remove();

        },
        500
    );
}


/* =========================
   INICIALIZAÇÃO
   ========================= */

(async function initPlatform() {

    applyTheme();


    try {

        await loadCloud();

    } catch (error) {

        console.error(
            error
        );

    }


    render();


    setTimeout(
        hideLoader,
        400
    );

})();
