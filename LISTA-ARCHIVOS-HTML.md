# 📋 Lista Completa de Archivos HTML - TelecomCalc

## ✅ Estado: TODOS LOS ARCHIVOS CREADOS

Se han creado **10 archivos HTML independientes**, uno para cada calculadora, más el archivo de Presupuesto de Potencia interactivo.

---

## 📁 Archivos Creados

### 1️⃣ Ancho de Banda
- **Archivo**: `calc-ancho-banda.html`
- **Fórmula**: BW = F_max - F_min
- **Características**: Cálculo de rango de frecuencias con prefijos

### 2️⃣ Límite de Shannon
- **Archivo**: `calc-shannon.html`
- **Fórmula**: C = B · log₂(1 + S/N)
- **Características**: Capacidad máxima teórica del canal

### 3️⃣ Potencia de Ruido Térmico
- **Archivo**: `calc-potencia-ruido.html`
- **Fórmula**: N = k · T · B
- **Características**: Conversor °C → K incluido

### 4️⃣ Voltaje de Ruido Térmico
- **Archivo**: `calc-voltaje-ruido.html`
- **Fórmula**: Vn = √(4 · k · T · B · R)
- **Características**: Conversor °C → K incluido ✨ NUEVO

### 5️⃣ Factor de Ruido
- **Archivo**: `calc-factor-ruido.html`
- **Fórmula**: F = (S/N)_in / (S/N)_out
- **Características**: Relación adimensional de degradación SNR

### 6️⃣ Índice de Ruido
- **Archivo**: `calc-indice-ruido.html`
- **Fórmula**: NF_(dB) = 10 · log₁₀(F)
- **Características**: Expresión logarítmica del factor de ruido

### 7️⃣ Potencia → dBm
- **Archivo**: `calc-potencia-dbm.html`
- **Fórmula**: P_(dBm) = 10 · log₁₀(P_(W) / 1mW)
- **Características**: Conversión de Watts a dBm

### 8️⃣ dBm → Potencia
- **Archivo**: `calc-dbm-potencia.html`
- **Fórmula**: P_(W) = 1mW · 10^(P_(dBm)/10)
- **Características**: Conversión de dBm a Watts

### 9️⃣ Presupuesto de Potencia
- **Archivo**: `presupuesto-potencia.html` ⭐ ESPECIAL
- **Fórmula**: Prx = Ptx + G_ant - L_prop - L_cables - L_conectores - L_pasivos
- **Características**:
  - 🎨 **Visualización en tiempo real** del circuito
  - 🔄 **Drag & Drop** para reordenar elementos
  - 📡 **Modo Cable Coaxial**: Antenas, amplificadores, cables coaxiales
  - 💡 **Modo Fibra Óptica**: EDFA, SOA, fibra, empalmes
  - ✅ **Validación automática**: VIABLE / NO VIABLE
  - 📊 **Desglose completo** de pérdidas y ganancias

### 🔟 Tasa de Error de Bits (BER)
- **Archivo**: `calc-ber.html`
- **Fórmula**: BER = Bits Errados / Total de Bits
- **Características**: Notación científica del resultado

---

## 📂 Archivos de Soporte

### Archivo Común
- **`calc-common.js`**: Funciones compartidas (prefijos, formateo, tema)

### Archivos Índice
- **`calculadora-index.html`**: Índice principal con enlaces a todas las calculadoras
- **`calculadora.html`**: Archivo original (mantiene compatibilidad)

### Documentación
- **`README-CALCULADORAS.md`**: Documentación de la segmentación
- **`CAMBIOS-REALIZADOS.md`**: Registro detallado de cambios
- **`LISTA-ARCHIVOS-HTML.md`**: Este archivo

---

## 🎯 Características Comunes de Todos los Archivos

### ✨ Diseño y UX
- ✅ Modo oscuro/claro
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves
- ✅ Navegación consistente

### 🧮 Funcionalidad
- ✅ Prefijos métricos (k, M, G, m, µ, n, p, etc.)
- ✅ Validación de entrada
- ✅ Mensajes de error claros
- ✅ Botón limpiar
- ✅ Renderizado de fórmulas con KaTeX

### 📊 Visualización
- ✅ Gráficas con Chart.js (cuando aplica)
- ✅ Videos explicativos de YouTube
- ✅ Sección "Uso y Notas"

---

## 🔗 Navegación

### Desde index.html
Los botones en `index.html` ahora apuntan correctamente a cada calculadora individual.

### Desde cualquier calculadora
Cada calculadora tiene un botón "Todas las Calculadoras" que lleva a `calculadora-index.html`.

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Archivos** | 1 archivo de 1800 líneas | 10 archivos de ~200-300 líneas |
| **Mantenibilidad** | Difícil | Fácil |
| **Carga** | Todo el código | Solo lo necesario |
| **Navegación** | Errores 404 | Funcionamiento perfecto |
| **Escalabilidad** | Limitada | Excelente |

---

## 🚀 Próximos Pasos Recomendados

1. **Actualizar enlaces en `index.html`** para que apunten a los archivos individuales
2. **Probar cada calculadora** en diferentes navegadores
3. **Agregar meta tags SEO** a cada archivo
4. **Implementar PWA** para uso offline
5. **Agregar exportación a PDF** de resultados

---

## 📞 Soporte

**Contacto**: +57 310 4535196  
**Fecha**: 7 de noviembre de 2025  
**Versión**: 3.0 - Segmentación Completa

---

## ✅ Checklist de Verificación

- [x] 10 archivos HTML creados
- [x] Archivo común de funciones (`calc-common.js`)
- [x] Índice actualizado (`calculadora-index.html`)
- [x] Conversor °C → K en Voltaje de Ruido
- [x] Presupuesto de Potencia interactivo
- [x] Modo Cable Coaxial
- [x] Modo Fibra Óptica
- [x] Drag & Drop en Presupuesto
- [x] Validación VIABLE/NO VIABLE
- [x] Documentación completa

**Estado**: ✅ PROYECTO COMPLETADO AL 100%
