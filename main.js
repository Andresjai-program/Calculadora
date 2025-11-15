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


// --- 2. Funciones de Cálculo (Sin cambios) ---

const calcBandwidth = (vals) => ({
    result: vals.Fmax - vals.Fmin,
    unit: "Hz"
});
const calcShannon = (vals) => ({
    result: vals.B * Math.log2(1 + (vals.S / vals.N)),
    unit: "bits/s"
});
// Función auxiliar para conversión de temperatura
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

const calcNoisePower = (vals) => {
    // Convertir temperatura si se ingresa en Celsius (< 100°C se asume Celsius)
    let tempK = vals.T;
    if (vals.T < 100) {
        tempK = celsiusToKelvin(vals.T);
    }
    return {
        result: K_BOLTZMANN * tempK * vals.B,
        unit: "W",
        meta: {
            tempK: tempK,
            tempC: kelvinToCelsius(tempK)
        }
    }
};
const calcNoiseVoltage = (vals) => {
    // Convertir temperatura si se ingresa en Celsius (< 100°C se asume Celsius)
    let tempK = vals.T;
    if (vals.T < 100) {
        tempK = celsiusToKelvin(vals.T);
    }
    return {
        result: Math.sqrt(4 * K_BOLTZMANN * vals.R * tempK * vals.B),
        unit: "V",
        meta: {
            tempK: tempK,
            tempC: kelvinToCelsius(tempK)
        }
    }
};
const calcNoiseFactor = (vals) => ({
    result: (vals.S_in / vals.N_in) / (vals.S_out / vals.N_out),
    unit: "adim"
});
const calcNoiseFigure = (vals) => {
    if (vals.F < 1) {
        throw new Error("El Factor de ruido (F) debe ser >= 1.");
    }
    return {
        result: 10 * Math.log10(vals.F),
        unit: "dB"
    };
};
const calcWToDbm = (vals) => {
    if (vals.P_W <= 0) {
        throw new Error("La potencia en Watts (P_W) debe ser > 0.");
    }
    return {
        result: 10 * Math.log10(vals.P_W / 1e-3),
        unit: "dBm"
    };
};
const calcDbmToW = (vals) => ({
    result: 1e-3 * Math.pow(10, vals.P_dBm / 10.0),
    unit: "W"
});
const calcRxPower = (vals) => {
    let totalLcables = 0;
    let totalLconectores = 0;
    let totalLpasivos = 0;

    // Procesar L cables (longitud * atenuación)
    if (vals.cables && Array.isArray(vals.cables)) {
        totalLcables = vals.cables.reduce((sum, cable) => {
            // Aplicar el prefijo métrico si existe
            let longitud = cable.longitud;
            if (cable.prefix && PREFIXES[cable.prefix]) {
                longitud *= PREFIXES[cable.prefix];
            }
            return sum + (longitud * cable.atenuacion);
        }, 0);
    }

    // Procesar L conectores
    if (vals.conectores && Array.isArray(vals.conectores)) {
        totalLconectores = vals.conectores.reduce((sum, conector) => {
            return sum + (conector.cantidad * conector.perdida);
        }, 0);
    }

    // Procesar L pasivos (relaciones)
    if (vals.relaciones && Array.isArray(vals.relaciones)) {
        totalLpasivos = vals.relaciones.reduce((sum, relacion) => {
            const relacionesDB = {
                "1:2": 3,
                "1:4": 6,
                "1:8": 9,
                "1:16": 12,
                "1:32": 15,
                "1:64": 18,
                "1:128": 21
            };
            return sum + (relacionesDB[relacion.tipo] || 0);
        }, 0);
    }

    // Cálculo final
    const { Ptx_dBm, Gamp_dB = 0 } = vals;
    const Prx = Ptx_dBm - totalLcables - totalLconectores - totalLpasivos + Gamp_dB;
    
    return {
        result: Prx,
        unit: "dBm",
        meta: {
            desglose: {
                Lcables_dB: totalLcables,
                Lconectores_dB: totalLconectores,
                Lpasivos_dB: totalLpasivos,
                Gamp_dB: Gamp_dB || 0
            }
        }
    };
};
const calcBer = (vals) => {
    const { Errados, Total } = vals;
    if (Total <= 0) {
        throw new Error("El total de bits debe ser mayor que cero.");
    }
    if (Errados < 0 || Errados > Total) {
        throw new Error("El número de bits errados debe estar entre 0 y el total de bits.");
    }
    return {
        result: Errados / Total,
        unit: ""
    };
};


// --- 3. Funciones de Gráficas (Generadores de Datos) (Sin cambios) ---

const linspace = (start, stop, num) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + (step * i));
};

const plotShannon = (vals) => {
    const B = vals.B;
    const snr_db_values = linspace(-20, 30, 200);
    const C_values = snr_db_values.map(snr_db => {
        const snr_lin = Math.pow(10, snr_db / 10);
        return B * Math.log2(1 + snr_lin);
    });

    return {
        title: "Capacidad de Shannon vs SNR (B fijo)",
        labels: snr_db_values,
        datasets: [{
            label: `Capacidad (bits/s) con B = ${B.toExponential(2)} Hz`,
            data: C_values,
            borderColor: "#4f9cff",
            tension: 0.1
        }]
    };
};

const plotNoiseVoltage = (vals) => {
    const { R, B, T: T0 } = vals;
    const T_values = linspace(Math.max(1.0, 0.5 * T0), 1.5 * T0, 200);
    const Vn_values = T_values.map(T => 
        Math.sqrt(4 * K_BOLTZMANN * R * T * B)
    );

    return {
        title: "Voltaje de ruido vs T (R, B fijos)",
        labels: T_values,
        datasets: [{
            label: "Vn (V)",
            data: Vn_values,
            borderColor: "#4f9cff",
            tension: 0.1
        }]
    };
};

const plotNoiseFigure = (vals) => {
    const F0 = Math.max(1.0, vals.F);
    const F_values = linspace(1.0, Math.max(1.2, 2.5 * F0), 200);
    const NF_values = F_values.map(F => 10 * Math.log10(F));

    return {
        title: "Índice de Ruido (NF) vs Factor de Ruido (F)",
        labels: F_values,
        datasets: [{
            label: "NF (dB)",
            data: NF_values,
            borderColor: "#4f9cff",
            tension: 0.1
        }]
    };
};

const plotWToDbm = (vals) => {
    const P_W_0 = Math.max(1e-9, vals.P_W);
    const P_W_values = linspace(P_W_0 / 10, P_W_0 * 10, 200);
    const dBm_values = P_W_values.map(P_W => 10 * Math.log10(P_W / 1e-3));

    return {
        title: "Conversión de Watts a dBm",
        xLabel: "Potencia (W) - Eje Log",
        yLabel: "Potencia (dBm)",
        labels: P_W_values,
        datasets: [{
            label: "dBm",
            data: dBm_values,
            borderColor: "#4f9cff"
        }],
        xType: 'logarithmic'
    };
};

const plotDbmToW = (vals) => {
    const P_dBm_0 = vals.P_dBm;
    const P_dBm_values = linspace(P_dBm_0 - 20, P_dBm_0 + 20, 200);
    const P_W_values = P_dBm_values.map(P_dBm => 1e-3 * Math.pow(10, P_dBm / 10.0));

    return {
        title: "Conversión de dBm a Watts",
        xLabel: "Potencia (dBm)",
        yLabel: "Potencia (W) - Eje Log",
        labels: P_dBm_values,
        datasets: [{
            label: "Watts (W)",
            data: P_W_values,
            borderColor: "#4f9cff"
        }],
        yType: 'logarithmic'
    };
};


// --- 4. Definición Maestra de Fórmulas (!!! ACTUALIZADA !!!) ---

const FORMULAS = {
    "1. Ancho de banda": {
        "formulaImg": "./img/f1_bandwidth.png", // <--- NUEVO
        "videoId": "nE-jmgk9L-4",               // <--- NUEVO (Qué es Ancho de Banda)
        "que_es": "Es la medida del espectro que representa el rango de frecuencias que una señal ocupa o que un canal puede transportar (Hz).",
        "uso": "Esencial para seleccionar la frecuencia portadora, dimensionar filtros y evaluar la capacidad potencial de transmisión.",
        "nota": "La frecuencia máxima siempre debe ser mayor que la mínima.",
        "fields": [
            { "name": "Fmax", "label": "Frecuencia máxima", "unit": "Hz", "tip": "Límite superior del espectro." },
            { "name": "Fmin", "label": "Frecuencia mínima", "unit": "Hz", "tip": "Límite inferior del espectro." },
        ],
        "fn": calcBandwidth,
        "plot": null
    },
    "2. Límite de Shannon": {
        "formulaImg": "./img/f2_shannon.png", // <--- NUEVO
        "videoId": "_m-g_js-48k",             // <--- NUEVO (Teorema de Shannon-Hartley)
        "que_es": "Es la capacidad teórica máxima (C) de información sin errores a través de un canal con ruido gaussiano (bits/segundo).",
        "uso": "Establece la cota superior de rendimiento (throughput) para un canal dado. Guía para diseño de modulación y codificación.",
        "nota": "La capacidad (C) mejora linealmente con el ancho de banda (B) y logarítmicamente con la Relación Señal a Ruido (S/N).",
        "fields": [
            { "name": "B", "label": "Ancho de banda", "unit": "Hz", "tip": "Ancho efectivo del canal." },
            { "name": "S", "label": "Potencia de señal (S)", "unit": "W", "tip": "Potencia útil." },
            { "name": "N", "label": "Potencia de ruido (N)", "unit": "W", "tip": "Potencia de ruido." },
        ],
        "fn": calcShannon,
        "plot": plotShannon
    },
    "3. Potencia de ruido térmico": {
        "formulaLatex": "N = kTB",
        "videoId": "i-2b-E-0W5Y",
        "que_es": "La potencia del ruido térmico generado por la agitación de los electrones en un conductor.",
        "uso": "Determina el piso de ruido mínimo en sistemas de comunicación.",
        "nota": "k es la constante de Boltzmann (1.38×10⁻²³ J/K). Temperatura se puede ingresar en °C, se convierte automáticamente a K.",
        "fields": [
            { 
                "name": "T", 
                "label": "Temperatura", 
                "unit": "K",
                "tip": "Temperatura (se puede ingresar en °C)",
                "tempConversion": true 
            },
            { "name": "B", "label": "Ancho de banda", "unit": "Hz", "tip": "Ancho de banda del sistema" }
        ],
        "fn": calcNoisePower,
        "plot": null
    },
    "4. Voltaje de ruido térmico": {
        "formulaLatex": "V_n = \\sqrt{4kTBR}",
        "videoId": "pS-z0f-7s-I",
        "que_es": "El voltaje RMS del ruido térmico generado en una resistencia.",
        "uso": "Dimensionamiento de la etapa de entrada de amplificadores y receptores.",
        "nota": "Depende de la raíz cuadrada de R, T y B. Temperatura se puede ingresar en °C, se convierte automáticamente a K.",
        "fields": [
            { "name": "R", "label": "Resistencia", "unit": "Ω", "tip": "Resistencia equivalente" },
            { 
                "name": "T", 
                "label": "Temperatura", 
                "unit": "K", 
                "tip": "Temperatura (se puede ingresar en °C)",
                "tempConversion": true 
            },
            { "name": "B", "label": "Ancho de banda", "unit": "Hz", "tip": "Ancho de banda del sistema" }
        ],
        "fn": calcNoiseVoltage,
        "plot": plotNoiseVoltage
    },
    "5. Factor de ruido": {
        "formulaImg": "./img/f5_noise_factor.png", // <--- NUEVO
        "videoId": "S_oYdG-KzYc",                  // <--- NUEVO (Factor de Ruido)
        "que_es": "Relación adimensional que cuantifica la degradación de la Relación Señal a Ruido (S/N) que introduce un dispositivo.",
        "uso": "Fundamental para comparar el rendimiento de componentes (LNA, mezcladores) y para el cálculo de la cascada de ruido (Fórmula de Friis).",
        "nota": "F siempre es >= 1. Un valor F=1 (o 0 dB) es un dispositivo ideal sin ruido. Menor F es mejor.",
        "fields": [
            { "name": "S_in", "label": "Señal de entrada", "unit": "W", "tip": "Potencia útil en la entrada." },
            { "name": "N_in", "label": "Ruido de entrada", "unit": "W", "tip": "Ruido referido a la entrada." },
            { "name": "S_out", "label": "Señal de salida", "unit": "W", "tip": "Potencia útil en la salida." },
            { "name": "N_out", "label": "Ruido de salida", "unit": "W", "tip": "Ruido en la salida." },
        ],
        "fn": calcNoiseFactor,
        "plot": null
    },
    "6. Índice de ruido": {
        "formulaImg": "./img/f6_noise_figure.png", // <--- NUEVO
        "videoId": "eMv9tovg8xM",                  // <--- NUEVO (Figura de Ruido vs Factor)
        "que_es": "Es la expresión logarítmica (en decibelios, dB) del Factor de Ruido (F). Es la forma más común en hojas de datos.",
        "uso": "Se emplea para presupuestos de enlace y cálculos de cascadas de ruido, facilitando la comparación de componentes.",
        "nota": "Un NF bajo (cercano a 0 dB) indica mejor preservación de la S/N.",
        "fields": [
            { "name": "F", "label": "Factor de ruido (F)", "unit": "adim", "tip": "F >= 1; ideal es F=1." }
        ],
        "fn": calcNoiseFigure,
        "plot": plotNoiseFigure
    },
    "7. Potencia -> dBm": {
        "formulaImg": "./img/f7_w_to_dbm.png", // <--- NUEVO
        "videoId": "D-s-WnS-PqI",             // <--- NUEVO (Qué son dB y dBm)
        "que_es": "Unidad logarítmica de potencia (dB) referida a 1 milivatio (1 mW). Usada en RF y microondas.",
        "uso": "Facilita la representación de amplios rangos de potencia y permite sumar ganancias y restar pérdidas en dB.",
        "nota": "0 dBm = 1 mW. Valores positivos > 1 mW, valores negativos < 1 mW.",
        "fields": [
            { "name": "P_W", "label": "Potencia", "unit": "W", "tip": "Potencia absoluta en Watts." }
        ],
        "fn": calcWToDbm,
        "plot": plotWToDbm
    },
    "8. dBm -> Potencia": {
        "formulaImg": "./img/f8_dbm_to_w.png", // <--- NUEVO
        "videoId": "D-s-WnS-PqI",             // <--- NUEVO (Qué son dB y dBm)
        "que_es": "Es la conversión inversa del nivel logarítmico (dBm) a la potencia absoluta en Watts (W).",
        "uso": "Necesaria para cálculos de energía real (consumo, eficiencia) que requieren unidades lineales (W).",
        "nota": "10 dBm = 10 mW. -30 dBm = 1 µW (microwatt).",
        "fields": [
            { "name": "P_dBm", "label": "Potencia", "unit": "dBm", "tip": "Nivel relativo." }
        ],
        "fn": calcDbmToW,
        "plot": plotDbmToW
    },
    "9. Presupuesto de potencia": {
        "formulaLatex": "P_{rx} = P_{tx} - L_{cables} - L_{conectores} - L_{pasivos} + G_{amp}",
        "videoId": "oTFBz-XyYvY",
        "que_es": "Cálculo detallado del balance de potencias en un enlace de comunicaciones.",
        "uso": "Determinar la viabilidad de enlaces y dimensionar componentes.",
        "nota": "Todas las pérdidas se suman en dB, las ganancias se restan.",
        "fields": [
            { 
                "name": "cables", 
                "label": "L cables", 
                "type": "array",
                "items": {
                    "longitud": { "unit": "m", "prefixes": true },
                    "atenuacion": { "unit": "dB/m" }
                }
            },
            {
                "name": "conectores",
                "label": "L conectores",
                "type": "array",
                "items": {
                    "cantidad": { "unit": "" },
                    "perdida": { "unit": "dB", "options": [0.2, 0.5, 1.0] }
                }
            },
            {
                "name": "relaciones",
                "label": "L pasivos",
                "type": "array",
                "items": {
                    "tipo": { "options": ["1:2", "1:4", "1:8", "1:16", "1:32", "1:64", "1:128"] }
                }
            },
            { "name": "Ptx_dBm", "label": "Potencia TX", "unit": "dBm" },
            { "name": "Gamp_dB", "label": "Ganancia amplificador", "unit": "dB" }
        ],
        "fn": calcRxPower,
        "plot": plotRxPower
    },
    "10. Tasa de error de bits (BER)": {
        "formulaImg": "./img/f10_ber.png", // <--- NUEVO
        "videoId": "mD_s-R1e-7g",          // <--- NUEVO (Qué es BER)
        "que_es": "Métrica que define la proporción de bits de datos transmitidos que se han alterado debido a ruido o interferencia.",
        "uso": "Cuantifica el rendimiento y la calidad de un enlace. BER 10⁻⁶ = 1 bit erróneo por cada millón.",
        "nota": "Una BER más baja indica un mejor rendimiento del sistema.",
        "fields": [
            { "name": "Errados", "label": "Bits errados", "unit": "bits", "tip": "Cantidad de bits recibidos incorrectamente." },
            { "name": "Total", "label": "Total de bits", "unit": "bits", "tip": "Cantidad total de bits transmitidos." },
        ],
        "fn": calcBer,
        "plot": null
    },
};


// --- 5. Funciones de Ayuda y Animación (Sin cambios) ---

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
         for (const [sym, fac] of sortedPrefixes.reverse()) {
            if (absVal <= fac) {
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
    
    if(bestFac === 1.0 && absVal < 1.0) {
        bestSym = 'm';
        bestFac = 1e-3;
    }

    const scaled = value / bestFac;
    return `${scaled.toFixed(6)} ${bestSym}${unit}`;
}


function animateButtonPulse(buttonElement, colors) {
    if (!buttonElement || !colors) return;
    
    const originalColor = colors.hover; 
    const pulseColor = colors.active;

    buttonElement.style.backgroundColor = pulseColor;
    buttonElement.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        buttonElement.style.backgroundColor = originalColor;
        buttonElement.style.transform = 'scale(1)';
    }, 120);
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
        
        if (field.unit === "dB" || field.unit === "dBm" || field.unit === "bits" || field.unit === "adim") {
            vals[name] = rawValue;
        } else {
            vals[name] = rawValue * factor;
        }
    }
    return vals;
}

// --- 6. Exportaciones del Módulo (Sin cambios) ---

export const getFormulaList = () => Object.keys(FORMULAS);

export const getFormulaDetails = (key) => FORMULAS[key];

export const getPrefixOptionsList = () => getPrefixOptions().map(p => p.label);

export const getDefaultPrefix = () => DEFAULT_PREFIX_LABEL;

export function calculateFormula(formulaKey, inputValues) {
    const spec = FORMULAS[formulaKey];
    if (!spec) {
        throw new Error("Fórmula no encontrada.");
    }
    
    const scaledValues = parseInputs(spec.fields, inputValues);
    const { result, unit, meta } = spec.fn(scaledValues);
    const formattedResult = formatResult(result, unit);
    
    return { formattedResult, meta: meta || null };
}

export function getGraphDataForFormula(formulaKey, inputValues) {
    const spec = FORMULAS[formulaKey];
    if (!spec || !spec.plot) {
        return null;
    }
    
    const scaledValues = parseInputs(spec.fields, inputValues);
    return spec.plot(scaledValues);
}

export { animateButtonPulse };

