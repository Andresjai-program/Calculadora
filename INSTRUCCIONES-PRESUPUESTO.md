# Instrucciones para Refactorizar presupuesto-potencia.html

## Cambios Requeridos

### 1. Fórmula Correcta
```
P_Tx - L_cable - L_conectores - L_pasivos + G_amp = M + S_Rx
```

Donde:
- **P_Tx**: Potencia del Tx [dBm]
- **L_cable**: Pérdidas en el Cable [dB]
- **L_conectores**: Pérdidas por conectores [dB]
- **L_pasivos**: Pérdidas por elementos pasivos (divisores) [dB]
- **G_amp**: Ganancias de amplificadores [dB]
- **M**: Margen
- **S_Rx**: Sensibilidad del Receptor

### 2. Cálculo de P_Rx
```
P_Rx = P_Tx - L_cables - L_conectores - L_pasivos + G_amplificadores
```

### 3. Validación
```
Enlace VIABLE si: P_Rx ≥ S_Rx + Margen
```

### 4. L_cables (Cables)

#### Cable Coaxial:
- Longitud en **metros** (m)
- Prefijos: pm, nm, µm, mm, cm, dm, m, dam, hm, km
- Atenuación en **dB/m**
- Pérdida = Longitud × Atenuación
- Permitir múltiples cables
- Sumar todas las pérdidas de cables

#### Fibra Óptica:
- Longitud en **kilómetros** (km)
- Prefijos: pm, nm, µm, mm, cm, dm, m, dam, hm, km
- Atenuación en **dB/km**
- Pérdida = Longitud × Atenuación
- Permitir múltiples fibras
- Sumar todas las pérdidas de cables

### 5. L_conectores (Conectores)

- Número de conectores (cantidad)
- Pérdida por conector: selección entre:
  - 0.2 dB
  - 0.5 dB
  - 1.0 dB
- Pérdida total = Número de conectores × Pérdida por conector
- Permitir múltiples grupos de conectores
- Sumar todas las pérdidas

### 6. L_pasivos (Divisores/Splitters)

- Relaciones estándar:
  - 0 dB (sin división)
  - 1:2 = 3 dB
  - 1:4 = 6 dB
  - 1:8 = 9 dB
  - 1:16 = 12 dB
  - 1:32 = 15 dB
  - 1:64 = 18 dB
  - 1:128 = 21 dB
  - Personalizado (ingresar valor en dB)
- Permitir múltiples divisores
- Sumar todas las pérdidas

### 7. G_amplificadores (Amplificadores)

- Ganancia en dB (editable)
- Permitir múltiples amplificadores
- Sumar todas las ganancias

### 8. Parámetros Principales

- **P_Tx**: Potencia del transmisor (dBm)
- **S_Rx**: Sensibilidad del receptor (dBm)
- **Margen**: Margen deseado (dB)

### 9. Interfaz

- Tabs para Cable Coaxial / Fibra Óptica
- Botones para agregar:
  - Cable/Fibra
  - Conectores
  - Divisores/Pasivos
  - Amplificadores
- Cada elemento debe ser editable
- Botón para eliminar elementos
- Botón "Cargar Ejemplo"
- Botón "Limpiar Todo"
- Botón "Calcular"

### 10. Resultados

Mostrar:
- P_Tx
- + Ganancias Totales (amplificadores)
- - Pérdidas Cables
- - Pérdidas Conectores
- - Pérdidas Pasivos
- = P_Rx (Potencia Recibida)
- S_Rx (Sensibilidad)
- Margen Calculado
- Estado: VIABLE / NO VIABLE

### 11. Barra de Búsqueda

Agregar barra de búsqueda en el header para navegar a otras calculadoras.

### 12. Actualizar Nombre

Cambiar todos los textos de "Potencia del Receptor" a "Presupuesto de Potencia".

## Ejemplo de Cálculo

### Cable Coaxial:
```
P_Tx = 20 dBm
Cable 1: 50m × 0.15 dB/m = 7.5 dB
Conector 1: 0.5 dB
Amplificador: +15 dB
Cable 2: 30m × 0.2 dB/m = 6 dB
Conector 2: 0.5 dB
Divisor 1:2: 3 dB

L_cables = 7.5 + 6 = 13.5 dB
L_conectores = 0.5 + 0.5 = 1 dB
L_pasivos = 3 dB
G_amp = 15 dB

P_Rx = 20 - 13.5 - 1 - 3 + 15 = 17.5 dBm

Si S_Rx = -95 dBm y Margen = 3 dB:
Requerido = -95 + 3 = -92 dBm
17.5 > -92 → VIABLE ✅
```

### Fibra Óptica:
```
P_Tx = 3 dBm
Conector 1: 0.3 dB
Fibra 1: 15 km × 0.25 dB/km = 3.75 dB
Empalme: 0.1 dB
Amplificador EDFA: +20 dB
Fibra 2: 25 km × 0.3 dB/km = 7.5 dB
Divisor 1:4: 6 dB
Conector 2: 0.3 dB

L_cables = 3.75 + 7.5 = 11.25 dB
L_conectores = 0.3 + 0.1 + 0.3 = 0.7 dB
L_pasivos = 6 dB
G_amp = 20 dB

P_Rx = 3 - 11.25 - 0.7 - 6 + 20 = 5.05 dBm

Si S_Rx = -28 dBm y Margen = 3 dB:
Requerido = -28 + 3 = -25 dBm
5.05 > -25 → VIABLE ✅
```
