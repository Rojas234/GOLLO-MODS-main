// --- 1. CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyBpHDgoUtVnnG48j_jG2-QAm2AgEM5uvjc",
    authDomain: "gollos-mods.firebaseapp.com",
    databaseURL: "https://gollos-mods-default-rtdb.firebaseio.com", 
    projectId: "gollos-mods",
    storageBucket: "gollos-mods.firebasestorage.app",
    messagingSenderId: "531411952451",
    appId: "1:531411952451:web:8cbcdd4a2f9ea0fe3a05f6",
    measurementId: "G-1567JZCS1Q"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 2. MANEJO DE PESTAÑAS (NAVEGACIÓN) ---
function tab(id, el) {
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    document.querySelectorAll('.nav-icon').forEach(n => {
        n.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}

// --- 3. SISTEMA DE DESCARGAS GLOBALES (FIREBASE) ---
function upd(id) {
    const ref = db.ref('descargas/' + id);
    
    ref.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    });

    const counterSpan = document.getElementById(id);
    if(counterSpan) {
        const card = counterSpan.closest('.card');
        card.style.transition = "0.3s";
        card.style.boxShadow = "0 0 30px var(--secondary)";
        setTimeout(() => { card.style.boxShadow = "none"; }, 400);
    }
}

db.ref('descargas').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    
    Object.keys(data).forEach(id => {
        const span = document.getElementById(id);
        if (span) {
            span.innerText = data[id];
        }
    });
    
    renderTopsFirebase(data);
});

// --- 4. RENDERIZADO DE TOPS (FIREBASE) ---
function renderTopsFirebase(globalData) {
    function build(cardSelector, targetContainerId) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        const originalCards = Array.from(document.querySelectorAll(`.page-content:not([id^="top"]) ${cardSelector}`));
        
        const sorted = originalCards.map(card => {
            const spanId = card.querySelector('.download-badge span').id;
            const dls = globalData[spanId] || 0;
            return { element: card, dls: dls };
        })
        .filter(item => item.dls > 0)
        .sort((a, b) => b.dls - a.dls)
        .slice(0, 3);

        container.innerHTML = '';

        if (sorted.length === 0) {
            container.innerHTML = '<p style="color:gray; font-family:Orbitron; text-align:center; width:100%; padding: 20px;">Esperando descargas globales...</p>';
            return;
        }
        
        sorted.forEach((item, index) => {
            const clone = item.element.cloneNode(true);
            const spanInClone = clone.querySelector('.download-badge span');
            spanInClone.innerText = item.dls;

            if(index === 0) {
                clone.style.border = "1px solid var(--secondary)";
                clone.style.background = "rgba(0, 242, 255, 0.05)";
                const title = clone.querySelector('.value');
                if(title) title.innerHTML = "👑 " + title.innerHTML;
            }
            container.appendChild(clone);
        });
    }

    build('.aporte-card', 'cont-top-a');
    build('.data-card', 'cont-top-d');
}

// --- 5. SISTEMA DE MÚSICA ---
const audio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('btn-music');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicIcon.innerText = "⏸";
        musicBtn.style.boxShadow = "0 0 20px var(--secondary)";
        musicBtn.style.background = "var(--secondary)";
    } else {
        audio.pause();
        musicIcon.innerText = "▶";
        musicBtn.style.boxShadow = "0 0 15px var(--primary)";
        musicBtn.style.background = "var(--primary)";
    }
}

// --- 6. SISTEMA DE ICONO DINÁMICO (FAVICON) ---
function setFavicon(url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
}

// Aplicar el icono de la pestaña con tu link de Discord
setFavicon('https://cdn.discordapp.com/icons/1427457445063561370/dc50482b0affb53c8fab32eaf7357079.png');

// Título dinámico
window.onblur = () => { document.title = "¡Ey! Vuelve a Gollos Mods 🚀"; };
window.onfocus = () => { document.title = "GOLLO MODS | Comunidad Aportes"; };

// Carga inicial
window.onload = () => {
    console.log("Gollo Mods cargado con éxito. Icono actualizado.");
};
