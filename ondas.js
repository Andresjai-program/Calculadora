const C = 3e8; // Velocidad de la luz en m/s
let currentTab = 'longitud';

// ===== FUNCIONES DE TABS =====
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById('tab-' + tab);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    document.getElementById('resultado-longitud').style.display = 'none';
    document.getElementById('resultado-frecuencia').style.display = 'none';
}

// ===== CALCULAR LONGITUD DE ONDA =====
function calcularLongitud() {
    const frecuenciaInput = parseFloat(document.getElementById('frecuencia-input').value);
    const frecuenciaUnit = parseFloat(document.getElementById('frecuencia-unit').value);
    
    if (!frecuenciaInput || frecuenciaInput <= 0) {
        alert('⚠️ Por favor ingrese una frecuencia válida mayor a 0');
        return;
    }
    
    const frecuenciaHz = frecuenciaInput * frecuenciaUnit;
    const longitudMetros = C / frecuenciaHz;
    
    document.getElementById('resultado-longitud').style.display = 'block';
    document.getElementById('resultado-frecuencia').style.display = 'none';
    
    const longitudFormateada = formatearLongitud(longitudMetros);
    document.getElementById('valor-longitud').textContent = longitudFormateada;
    
    const frecuenciaFormateada = formatearFrecuencia(frecuenciaHz);
    document.getElementById('display-frecuencia').textContent = frecuenciaFormateada;
    
    mostrarConversionesLongitud(longitudMetros);
    
    document.getElementById('resultado-longitud').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== CALCULAR FRECUENCIA =====
function calcularFrecuencia() {
    const longitudInput = parseFloat(document.getElementById('longitud-input').value);
    const longitudUnit = parseFloat(document.getElementById('longitud-unit').value);
    
    if (!longitudInput || longitudInput <= 0) {
        alert('⚠️ Por favor ingrese una longitud de onda válida mayor a 0');
        return;
    }
    
    const longitudMetros = longitudInput * longitudUnit;
    const frecuenciaHz = C / longitudMetros;
    
    document.getElementById('resultado-frecuencia').style.display = 'block';
    document.getElementById('resultado-longitud').style.display = 'none';
    
    const frecuenciaFormateada = formatearFrecuencia(frecuenciaHz);
    document.getElementById('valor-frecuencia').textContent = frecuenciaFormateada;
    
    const longitudFormateada = formatearLongitud(longitudMetros);
    document.getElementById('display-longitud').textContent = longitudFormateada;
    
    mostrarConversionesFrecuencia(frecuenciaHz);
    
    document.getElementById('resultado-frecuencia').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== FORMATEAR VALORES =====
function formatearLongitud(metros) {
    if (metros >= 1000) {
        return (metros / 1000).toFixed(3) + ' km';
    } else if (metros >= 1) {
        return metros.toFixed(3) + ' m';
    } else if (metros >= 0.01) {
        return (metros * 100).toFixed(3) + ' cm';
    } else if (metros >= 0.001) {
        return (metros * 1000).toFixed(3) + ' mm';
    } else if (metros >= 1e-6) {
        return (metros * 1e6).toFixed(3) + ' µm';
    } else if (metros >= 1e-9) {
        return (metros * 1e9).toFixed(3) + ' nm';
    } else {
        return (metros * 1e12).toFixed(3) + ' pm';
    }
}

function formatearFrecuencia(hz) {
    if (hz >= 1e12) {
        return (hz / 1e12).toFixed(3) + ' THz';
    } else if (hz >= 1e9) {
        return (hz / 1e9).toFixed(3) + ' GHz';
    } else if (hz >= 1e6) {
        return (hz / 1e6).toFixed(3) + ' MHz';
    } else if (hz >= 1e3) {
        return (hz / 1e3).toFixed(3) + ' kHz';
    } else {
        return hz.toFixed(3) + ' Hz';
    }
}

// ===== MOSTRAR CONVERSIONES =====
function mostrarConversionesLongitud(metros) {
    const conversiones = [
        { valor: metros * 1e12, unidad: 'pm', nombre: 'Picómetros' },
        { valor: metros * 1e9, unidad: 'nm', nombre: 'Nanómetros' },
        { valor: metros * 1e6, unidad: 'µm', nombre: 'Micrómetros' },
        { valor: metros * 1000, unidad: 'mm', nombre: 'Milímetros' },
        { valor: metros * 100, unidad: 'cm', nombre: 'Centímetros' },
        { valor: metros, unidad: 'm', nombre: 'Metros' },
        { valor: metros / 1000, unidad: 'km', nombre: 'Kilómetros' }
    ];
    
    const container = document.getElementById('conversiones-longitud');
    container.innerHTML = conversiones
        .filter(c => c.valor >= 0.001 && c.valor <= 1e9)
        .map(c => `<div>• ${c.valor.toFixed(6)} ${c.unidad}</div>`)
        .join('');
}

function mostrarConversionesFrecuencia(hz) {
    const conversiones = [
        { valor: hz, unidad: 'Hz', nombre: 'Hertz' },
        { valor: hz / 1e3, unidad: 'kHz', nombre: 'Kilohertz' },
        { valor: hz / 1e6, unidad: 'MHz', nombre: 'Megahertz' },
        { valor: hz / 1e9, unidad: 'GHz', nombre: 'Gigahertz' },
        { valor: hz / 1e12, unidad: 'THz', nombre: 'Terahertz' }
    ];
    
    const container = document.getElementById('conversiones-frecuencia');
    container.innerHTML = conversiones
        .filter(c => c.valor >= 0.001 && c.valor <= 1e9)
        .map(c => `<div>• ${c.valor.toFixed(6)} ${c.unidad}</div>`)
        .join('');
}

// ===== LIMPIAR =====
function limpiarLongitud() {
    document.getElementById('frecuencia-input').value = '';
    document.getElementById('frecuencia-unit').value = '1000000';
    document.getElementById('resultado-longitud').style.display = 'none';
}

function limpiarFrecuencia() {
    document.getElementById('longitud-input').value = '';
    document.getElementById('longitud-unit').value = '1';
    document.getElementById('resultado-frecuencia').style.display = 'none';
}

// ===== CARGAR EJEMPLOS =====
function cargarEjemplo(tipo) {
    switch(tipo) {
        case 'wifi':
            switchTab('longitud');
            document.getElementById('frecuencia-input').value = '2.4';
            document.getElementById('frecuencia-unit').value = '1000000000';
            setTimeout(() => calcularLongitud(), 100);
            break;
        case 'wifi5':
            switchTab('longitud');
            document.getElementById('frecuencia-input').value = '5';
            document.getElementById('frecuencia-unit').value = '1000000000';
            setTimeout(() => calcularLongitud(), 100);
            break;
        case 'fm':
            switchTab('longitud');
            document.getElementById('frecuencia-input').value = '100';
            document.getElementById('frecuencia-unit').value = '1000000';
            setTimeout(() => calcularLongitud(), 100);
            break;
        case 'luz':
            switchTab('frecuencia');
            document.getElementById('longitud-input').value = '500';
            document.getElementById('longitud-unit').value = '1e-9';
            setTimeout(() => calcularFrecuencia(), 100);
            break;
    }
}

// ===== TEMA =====
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;
    const isDarkMode = document.documentElement.classList.contains('dark');
    themeToggleBtn.innerHTML = isDarkMode 
        ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>'
        : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>';
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    updateThemeButton();
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});
