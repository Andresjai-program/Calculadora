# Segmentación de Calculadoras - TelecomCalc

## Estructura de Archivos

El archivo `calculadora.html` original (casi 2000 líneas) ha sido segmentado en archivos individuales para mejorar la mantenibilidad y reducir la saturación del código.

### Archivos Creados

#### Archivo Común
- **`calc-common.js`**: Contiene todas las funciones compartidas (constantes, prefijos, formateo, tema, etc.)

#### Calculadoras Individuales (Archivos HTML independientes)
1. **`calc-ancho-banda.html`** - Calculadora de Ancho de Banda
2. **`calc-shannon.html`** - Calculadora del Límite de Shannon
3. **`calc-potencia-ruido.html`** - Calculadora de Potencia de Ruido Térmico
4. **`calc-voltaje-ruido.html`** - Calculadora de Voltaje de Ruido Térmico
5. **`calc-indice-ruido.html`** - Calculadora de Índice de Ruido

#### Archivo Índice
- **`calculadora-index.html`** - Página índice que lista todas las calculadoras disponibles

#### Archivo Original
- **`calculadora.html`** - Se mantiene para las calculadoras restantes (5, 7, 8, 9, 10) que funcionan mediante parámetros URL

## Ventajas de la Segmentación

### 1. **Mejor Mantenibilidad**
- Cada calculadora es un archivo independiente de ~200-300 líneas
- Más fácil de editar y depurar
- Cambios en una calculadora no afectan a las demás

### 2. **Carga Más Rápida**
- Los usuarios solo cargan el código de la calculadora que necesitan
- Reduce el tiempo de carga inicial
- Mejora la experiencia del usuario

### 3. **Código Más Limpio**
- Separación clara de responsabilidades
- Funciones comunes centralizadas en `calc-common.js`
- Estructura consistente entre calculadoras

### 4. **Escalabilidad**
- Fácil agregar nuevas calculadoras
- Patrón claro para seguir
- Reutilización de componentes

## Uso

### Para Usuarios
1. Acceder a `calculadora-index.html` para ver todas las calculadoras
2. Hacer clic en la calculadora deseada
3. Cada calculadora tiene su propia URL directa

### Para Desarrolladores
1. **Agregar una nueva calculadora**: Copiar una calculadora existente como plantilla
2. **Modificar funciones comunes**: Editar `calc-common.js`
3. **Actualizar el índice**: Agregar la nueva calculadora en `calculadora-index.html`

## Estructura de una Calculadora Individual

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Configuración de Tailwind y estilos -->
    <script src="calc-common.js"></script>
</head>
<body>
    <header><!-- Header común --></header>
    
    <main>
        <!-- Título y descripción -->
        <!-- Fórmula con KaTeX -->
        <!-- Grid: Inputs | Gráfica + Video -->
    </main>
    
    <footer><!-- Footer común --></footer>
    
    <script>
        // Lógica específica de la calculadora
        // - Función de cálculo
        // - Función de gráfica
        // - Event listeners
    </script>
</body>
</html>
```

## Calculadoras Disponibles

| # | Nombre | Archivo | Estado |
|---|--------|---------|--------|
| 1 | Ancho de Banda | `calc-ancho-banda.html` | ✅ Completo |
| 2 | Límite de Shannon | `calc-shannon.html` | ✅ Completo |
| 3 | Potencia de Ruido Térmico | `calc-potencia-ruido.html` | ✅ Completo |
| 4 | Voltaje de Ruido Térmico | `calc-voltaje-ruido.html` | ✅ Completo |
| 5 | Factor de Ruido | `calculadora.html?formula=...` | ⚠️ Usa original |
| 6 | Índice de Ruido | `calc-indice-ruido.html` | ✅ Completo |
| 7 | Potencia → dBm | `calculadora.html?formula=...` | ⚠️ Usa original |
| 8 | dBm → Potencia | `calculadora.html?formula=...` | ⚠️ Usa original |
| 9 | Potencia del Receptor | `calculadora.html?formula=...` | ⚠️ Usa original |
| 10 | Tasa de Error de Bits | `calculadora.html?formula=...` | ⚠️ Usa original |

## Próximos Pasos (Opcional)

Si deseas completar la segmentación:
1. Crear archivos individuales para las calculadoras 5, 7, 8, 9 y 10
2. Seguir el mismo patrón de las calculadoras ya creadas
3. Actualizar `calculadora-index.html` con los nuevos enlaces

## Notas Técnicas

- **Dependencias**: Tailwind CSS, KaTeX, Chart.js
- **Compatibilidad**: Navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Modo Oscuro**: Soportado en todas las calculadoras
- **Responsive**: Diseño adaptable a móviles y tablets

## Contacto

Para soporte técnico: +57 310 4535196
