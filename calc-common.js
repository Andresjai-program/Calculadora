// ===================================================
// Funciones comunes para todas las calculadoras
// ===================================================

const K_BOLTZMANN = 1.38e-23; // Constante de Boltzmann

const PREFIXES = {
    "": 1.0, "Y": 1e24, "Z": 1e21, "E": 1e18, "P": 1e15, "T": 1e12,
    "G": 1e9, "M": 1e6, "k": 1e3, "h": 1e2, "da": 1e1, "d": 1e-1,
    "c": 1e-2, "m": 1e-3, "µ": 1e-6, "n": 1e-9, "p": 1e-12, "f": 1e-15,
    "a": 1e-18, "z": 1e-21, "y": 1e-24,
};

function getPrefixOptions() {
    const items = Object.entries(PREFIXES).map(([symbol, factor]) => {
        const exp = (factor === 0) ? 0 : Math.round(Math.log10(factor));
        const label = (symbol === "") ? `(10^${exp})` : `${symbol} (10^${exp})`;
        return { label, symbol, factor };
    });
    return items.sort((a, b) => b.factor - a.factor);
}

const DISPLAY_LABEL_TO_SYMBOL = getPrefixOptions().reduce((acc, item) => {
    acc[item.label] = item.symbol;
    return acc;
}, {});

const DEFAULT_PREFIX_LABEL = getPrefixOptions().find(p => p.symbol === "").label;

function formatResult(value, unit) {
    if (value === 0) return `0 ${unit}`;
    if (unit === "dB" || unit === "dBm" || unit === "adim" || unit === "") {
        const decimals = (unit === "" || unit === "adim") ? 6 : 2;
        return `${value.toFixed(decimals)} ${unit}`;
    }

    const absVal = Math.abs(value);
    let bestSym = "";
    let bestFac = 1.0;

    const sortedPrefixes = Object.entries(PREFIXES).sort(([, facA], [, facB]) => facB - facA);

    for (const [sym, fac] of sortedPrefixes) {
        if (absVal >= fac && fac !== 0) {
            bestSym = sym;
            bestFac = fac;
            break;
        }
    }
    
    if (bestFac === 1.0 && absVal < 1.0) {
        for (const [sym, fac] of sortedPrefixes.filter(p => p[1] < 1).reverse()) {
             if (absVal >= fac) {
                bestSym = sym;
                bestFac = fac;
                break;
            }
        }
        if (bestSym === "") {
            bestSym = 'y';
            bestFac = 1e-24;
        }
    }

    const scaled = value / bestFac;
    return `${scaled.toFixed(4)} ${bestSym}${unit}`;
}

function parseInputs(fields, inputValues) {
    const vals = {};
    for (const field of fields) {
        const name = field.name;
        const input = inputValues[name];
        
        if (!input || input.value.trim() === "") {
            throw new Error(`Falta el valor para '${field.label}'.`);
        }
        
        const rawValue = parseFloat(input.value.trim());
        if (isNaN(rawValue)) {
            throw new Error(`Valor no válido para '${field.label}'. Debe ser un número.`);
        }
        
        const symbol = DISPLAY_LABEL_TO_SYMBOL[input.prefixLabel];
        const factor = PREFIXES[symbol];
        
        if (field.unit === "dB" || field.unit === "dBm" || field.unit === "bits" || field.unit === "adim" || field.unit === "K") {
            vals[name] = rawValue;
        } else {
            vals[name] = rawValue * factor;
        }
    }
    return vals;
}

const linspace = (start, stop, num) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + (step * i));
};

// Funciones de tema
function toggleTheme() {
    const html = document.documentElement;
    const isDarkMode = html.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;
    const isDarkMode = document.documentElement.classList.contains('dark');
    themeToggleBtn.innerHTML = isDarkMode 
        ? '<svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 009 9c0 4.54-3.52 8.44-8.45 8.97a.75.75 0 01-.8-.85c.17-1.13.25-2.3.25-3.47a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75c0 1.17-.08 2.34-.25 3.47a.75.75 0 01-.8.85C6.52 20.44 3 16.54 3 12a9 9 0 019-9z"/></svg> Modo Claro' 
        : '<svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.885 18.885c.38.38.38 1.02.042 1.358-.337.337-1.02.34-1.358.042l-1.597-1.597a1.06 1.06 0 011.554-1.423l1.414 1.414zM21 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM12 18.75a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM5.132 18.885l-1.597-1.597a1.06 1.06 0 011.554-1.423l1.414 1.414c.38.38.38 1.02.042 1.358-.337.337-1.02.34-1.358.042zM3 12a.75.75 0 01.75.75h2.25a.75.75 0 010-1.5H3a.75.75 0 01-.75.75zM12 6.75a.75.75 0 01-.75-.75V3.75a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75z"/></svg> Modo Oscuro';
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeButton();
    const tBtn = document.getElementById('themeToggle');
    if (tBtn) tBtn.addEventListener('click', toggleTheme);
}
