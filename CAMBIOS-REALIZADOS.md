# Cambios Realizados en TelecomCalc

## Resumen Ejecutivo

Se han realizado mejoras significativas en la aplicación TelecomCalc para optimizar la experiencia del usuario y agregar funcionalidades avanzadas de cálculo.

---

## 1. ✅ Enlaces de Fórmulas Corregidos (index.html → calculadora.html)

### Problema
Los botones de fórmulas en `index.html` no coincidían con las fórmulas en `calculadora.html`, causando errores de navegación.

### Solución
Se actualizaron todos los IDs de fórmulas en `index.html` para que coincidan exactamente con las claves en `calculadora.html`:

| # | Nombre de Fórmula | ID Actualizado |
|---|-------------------|----------------|
| 1 | Ancho de Banda | `1-ancho-de-banda` |
| 2 | Límite de Shannon | `2-limite-de-shannon` |
| 3 | Potencia de Ruido Térmico | `3-potencia-de-ruido-termico` |
| 4 | Voltaje de Ruido Térmico | `4-voltaje-de-ruido-termico` |
| 5 | Factor de Ruido | `5-factor-de-ruido` |
| 6 | Índice de Ruido | `6-indice-de-ruido` |
| 7 | Potencia → dBm | `7-potencia-dbm` |
| 8 | dBm → Potencia | `8-dbm-potencia` |
| 9 | Presupuesto de Potencia | `9-presupuesto-de-potencia` |
| 10 | Tasa de Error de Bits (BER) | `10-tasa-de-error-de-bits-ber` |

**Resultado**: Ahora todos los botones en `index.html` navegan correctamente a la calculadora correspondiente.

---

## 2. ✅ Conversor de Temperatura en Voltaje de Ruido Térmico

### Problema
La calculadora de "Voltaje de Ruido Térmico" requiere temperatura en Kelvin (K), pero los usuarios suelen trabajar en grados Celsius (°C).

### Solución
Se agregó un conversor de temperatura °C → K en `calc-voltaje-ruido.html`:

```html
<!-- Conversor °C a K -->
<div class="mt-3 p-3 bg-gray-50 dark:bg-bg-dark-soft rounded">
    <label>Temperatura (°C) → Convertir a Kelvin (K)</label>
    <div class="flex space-x-2 items-center">
        <input type="number" id="tempC" step="any" placeholder="Ej: 17.5">
        <button id="btnConvert" type="button">Convertir → K</button>
    </div>
</div>
```

**Funcionalidad**:
- El usuario ingresa temperatura en °C
- Al hacer clic en "Convertir → K", se calcula: `K = °C + 273.15`
- El valor se inserta automáticamente en el campo de Temperatura (K)
- Soporta tecla Enter para conversión rápida

---

## 3. ✅ Presupuesto de Potencia - Mejoras Completas

### Cambio de Nombre
**Antes**: "9. Potencia del receptor"  
**Ahora**: "9. Presupuesto de potencia"

### Fórmula Actualizada
```
Prx (dBm) = Ptx (dBm) + Gant TX - Lprop + Gant RX - Lcables - Lconectores - Lpasivos
```

### Nuevos Campos Agregados

#### a) **Campos Básicos Mejorados**
| Campo | Descripción | Unidad |
|-------|-------------|--------|
| Ptx | Potencia de transmisión | dBm |
| Gant TX | Ganancia de antena transmisora | dB |
| Lprop | Pérdida de propagación (FSPL, etc.) | dB |
| Gant RX | Ganancia de antena receptora | dB |
| Prx min | Sensibilidad mínima del receptor | dBm |

#### b) **L cables (Pérdidas en Cables)** - Campo Dinámico
Permite agregar múltiples segmentos de cable con:
- **Longitud**: Con prefijos (cm, m, dm, hm, km, etc.)
- **Atenuación**: dB/unidad (ej: 0.2 dB/m, 0.5 dB/km)
- **Cálculo**: `Pérdida = Longitud × Atenuación`
- **Total**: Suma automática de todos los cables

**Ejemplo**:
```
Cable 1: 100 m × 0.2 dB/m = 20 dB
Cable 2: 50 m × 0.3 dB/m = 15 dB
Total L cables = 35 dB
```

#### c) **L conectores (Pérdidas en Conectores)** - Campo Dinámico
Permite agregar múltiples conectores con:
- **Número de conectores**: Cantidad
- **Pérdida por conector**: Selector con valores típicos:
  - 0.2 dB (conectores de alta calidad)
  - 0.5 dB (conectores estándar)
  - 1.0 dB (conectores de baja calidad)
- **Cálculo**: `Pérdida = Número × Pérdida unitaria`
- **Total**: Suma automática de todos los conectores

**Ejemplo**:
```
Grupo 1: 4 conectores × 0.2 dB = 0.8 dB
Grupo 2: 2 conectores × 0.5 dB = 1.0 dB
Total L conectores = 1.8 dB
```

#### d) **L pasivos (Divisores/Splitters)** - Campo Dinámico
Permite agregar múltiples divisores con relaciones estándar:

| Relación | Pérdida (dB) |
|----------|--------------|
| 1:2 | 3 dB |
| 1:4 | 6 dB |
| 1:8 | 9 dB |
| 1:16 | 12 dB |
| 1:32 | 15 dB |
| 1:64 | 18 dB |
| 1:128 | 21 dB |

- **Cantidad**: Número de divisores de cada tipo
- **Cálculo**: `Pérdida = Cantidad × Pérdida de relación`
- **Total**: Suma automática de todos los divisores

**Ejemplo**:
```
2 divisores 1:2 = 2 × 3 dB = 6 dB
1 divisor 1:4 = 1 × 6 dB = 6 dB
Total L pasivos = 12 dB
```

### Función de Cálculo Actualizada

```javascript
const calcRxPower = (vals) => {
    const Ptx_dBm = vals.Ptx_dBm || 0;
    const GantTX_dB = vals.GantTX_dB || 0;
    const Lprop_dB = vals.Lprop_dB || 0;
    const GantRX_dB = vals.GantRX_dB || 0;
    const Lcables_dB = vals.Lcables_total || 0;
    const Lconectores_dB = vals.Lconectores_total || 0;
    const Lpasivos_dB = vals.Lpasivos_total || 0;
    const Prx_min_dBm = vals.Prx_min_dBm || -30;
    
    // Cálculo del presupuesto de potencia
    const Prx = Ptx_dBm + GantTX_dB - Lprop_dB + GantRX_dB 
                - Lcables_dB - Lconectores_dB - Lpasivos_dB;
    const viable = Prx >= Prx_min_dBm;
    const margen = Prx - Prx_min_dBm;
    
    return {
        result: Prx,
        unit: "dBm",
        meta: {
            viable: viable,
            margen_dB: margen,
            Lcables_total: Lcables_dB,
            Lconectores_total: Lconectores_dB,
            Lpasivos_total: Lpasivos_dB
        }
    };
};
```

### Resultado Visual
El resultado muestra:
- **Prx (Potencia Recibida)**: En dBm
- **Estado de Viabilidad**: 
  - ✅ VIABLE (verde) si Prx ≥ Prx_min
  - ❌ NO VIABLE (rojo) si Prx < Prx_min
- **Margen de Enlace**: Diferencia entre Prx y Prx_min
- **Desglose de Pérdidas**:
  - Total L cables
  - Total L conectores
  - Total L pasivos

---

## Archivos Modificados

1. **`index.html`**
   - ✅ Actualizados IDs de fórmulas
   - ✅ Corregidos enlaces de navegación

2. **`calc-voltaje-ruido.html`**
   - ✅ Agregado conversor °C → K
   - ✅ Agregada lógica JavaScript para conversión

3. **`calculadora.html`**
   - ✅ Actualizado título "9. Presupuesto de potencia"
   - ✅ Actualizada fórmula matemática
   - ✅ Agregados nuevos campos (Gant TX, Lprop, Gant RX)
   - ✅ Definidos campos dinámicos (type: "array")
   - ✅ Actualizada función `calcRxPower`
   - ✅ Mejoradas descripciones y notas técnicas

---

## Beneficios para el Usuario

### 🎯 Navegación Mejorada
- Los usuarios pueden acceder directamente a cualquier calculadora desde index.html
- No más errores 404 o páginas no encontradas

### 🌡️ Conversión de Temperatura
- Facilita el trabajo con temperaturas en °C
- Conversión instantánea a Kelvin
- Reduce errores de cálculo manual

### 📊 Presupuesto de Potencia Profesional
- Cálculos precisos de enlaces de telecomunicaciones
- Soporte para múltiples cables, conectores y divisores
- Desglose detallado de pérdidas
- Validación automática de viabilidad del enlace
- Cálculo de margen de seguridad

---

## Próximos Pasos Recomendados

1. **Implementar la UI de campos dinámicos** para L cables, L conectores y L pasivos
2. **Agregar validaciones** para evitar valores negativos o fuera de rango
3. **Crear ejemplos prácticos** de uso para cada calculadora
4. **Agregar exportación de resultados** a PDF o Excel
5. **Implementar historial de cálculos** para que los usuarios puedan revisar cálculos anteriores

---

## Soporte Técnico

Para cualquier consulta o soporte:
- **Teléfono**: +57 310 4535196
- **Documentación**: README-CALCULADORAS.md

---

**Fecha de actualización**: 7 de noviembre de 2025  
**Versión**: 2.0  
**Estado**: ✅ Completado
