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
// --- 3. SISTEMA DE DESCARGAS GLOBALES (FIREBASE CORREGIDO) ---
function descargar(id) {
    const ref = db.ref('descargas/' + id);
    
    // Sumar 1 en la base de datos de Firebase
    ref.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    });

    // Efecto visual de "brillo" en la tarjeta al descargar
    const counterSpan = document.getElementById('count_' + id);
    if(counterSpan) {
        const card = counterSpan.closest('.card-aporte') || counterSpan.closest('.card');
        if(card) {
            card.style.transition = "0.3s";
            card.style.boxShadow = "0 0 30px #ffffff"; // Brillo blanco
            setTimeout(() => { card.style.boxShadow = "none"; }, 400);
        }
    }
}

// Escuchar cambios en tiempo real desde Firebase
db.ref('descargas').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    
    Object.keys(data).forEach(id => {
        // Buscamos el ID con el prefijo 'count_' que pusimos en el HTML
        const span = document.getElementById('count_' + id);
        if (span) {
            span.innerText = data[id];
        }
    });
    
    // Actualizar los tops automáticamente
    renderTopsFirebase(data);
});
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


// --- 4. RENDERIZADO DE TOPS (FIREBASE ACTUALIZADO) ---
function renderTopsFirebase(globalData) {
    function build(cardSelector, targetContainerId) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        // Buscamos las tarjetas originales en las secciones de Aportes y Datas
        const originalCards = Array.from(document.querySelectorAll(`.page-content:not([id^="top"]) ${cardSelector}`));
        
        const sorted = originalCards.map(card => {
            // Extraemos el ID del mod desde el ID del contador (ej: count_mod_01 -> mod_01)
            const span = card.querySelector('.counter');
            if(!span) return null;
            
            const spanId = span.id.replace('count_', '');
            const dls = globalData[spanId] || 0;
            return { element: card, dls: dls };
        })
        .filter(item => item !== null && item.dls > 0)
        .sort((a, b) => b.dls - a.dls)
        .slice(0, 3); // Solo los 3 mejores

        container.innerHTML = '';

        if (sorted.length === 0) {
            container.innerHTML = '<p style="color:gray; font-family:Orbitron; text-align:center; width:100%; padding: 20px;">Esperando descargas globales...</p>';
            return;
        }
        
        sorted.forEach((item, index) => {
            const clone = item.element.cloneNode(true);
            
            // Actualizar el contador en el clon
            const spanInClone = clone.querySelector('.counter');
            if(spanInClone) spanInClone.innerText = item.dls;

            // Estilo especial para el #1 (El Rey del Top)
            if(index === 0) {
                clone.style.border = "2px solid #ffffff";
                clone.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.2)";
                const title = clone.querySelector('.aporte-titulo');
                if(title) title.innerHTML = "👑 " + title.innerHTML;
            }
            container.appendChild(clone);
        });
    }

    // Llamamos a la función con tus nuevas clases de tarjetas
    build('.card-aporte', 'cont-top-a');
    // Dentro de la función renderTopsGlobal(globalData) ...
// Esta línea es la que hace que el Top de Datas funcione:
build('.card-data', 'cont-top-d');
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

