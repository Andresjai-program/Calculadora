# Instrucciones de Prueba - Calculadora de Presupuesto de Potencia

## Archivos Disponibles

### 1. `presupuesto-potencia.html` - ARCHIVO PRINCIPAL
Este es el archivo completo con todas las funcionalidades solicitadas.

### 2. `test-presupuesto.html` - ARCHIVO DE PRUEBA
Un archivo simple para verificar que las funciones básicas funcionan correctamente en tu navegador.

## Cambios Realizados

### ✅ Eliminado
- Dependencia de `calc-common.js` que estaba causando conflictos

### ✅ Corregido
- Sistema de tabs entre Cable Coaxial y Fibra Óptica
- Event listeners para todos los botones
- Función de tema claro/oscuro
- Cálculos de pérdidas con conversión de unidades correcta
- Todos los nombres de botones actualizados a "Presupuesto de Potencia"

### ✅ Implementado
- **Lcables**: Múltiples cables con atenuación y prefijos (cm, m, km, etc.)
- **Lconectores**: Cantidad ajustable con opciones 0.2dB, 0.5dB, 1dB
- **Lpasivos**: Relaciones 1:2 hasta 1:128 + valor personalizado
- **Gamp**: Amplificadores con ganancia ajustable
- Fórmula: PRX = PTX - Lcables - Lconectores - Lpasivos + Gamp
- Verificación: PRX ≥ SRX + M

## Cómo Probar

### Paso 1: Abrir en el Navegador
Abre el archivo `presupuesto-potencia.html` en tu navegador (Chrome, Firefox, Edge recomendados).

### Paso 2: Verificar Funcionalidades

#### A. Tema Claro/Oscuro
1. Click en el botón de tema (icono de sol/luna) en la esquina superior derecha
2. La página debe cambiar entre modo claro y oscuro
3. Verifica que los colores se actualicen correctamente

#### B. Tabs Cable Coaxial / Fibra Óptica
1. Click en "📡 Cable Coaxial" - debe mostrar opciones de cable coaxial
2. Click en "💡 Fibra Óptica" - debe mostrar opciones de fibra óptica
3. Los contenidos deben cambiar correctamente

#### C. Agregar Elementos
**En Cable Coaxial:**
1. Click en "+ Agregar Cable" - debe aparecer un cable con longitud en metros
2. Click en "+ Agregar Conector" - debe aparecer un conector
3. Click en "+ Agregar Divisor" - debe aparecer un divisor
4. Click en "+ Agregar Amplificador" - debe aparecer un amplificador

**En Fibra Óptica:**
1. Click en "+ Agregar Fibra" - debe aparecer fibra con longitud en kilómetros
2. Click en "+ Agregar Conector" - debe aparecer conector SC/LC
3. Click en "+ Agregar Divisor Óptico" - debe aparecer divisor óptico
4. Click en "+ Agregar Amplificador EDFA/SOA" - debe aparecer amplificador óptico

#### D. Modificar Valores
1. Cambia la longitud de un cable
2. Cambia el prefijo (m, km, cm, etc.)
3. Cambia la atenuación
4. Verifica que las pérdidas se calculen automáticamente

#### E. Calcular Presupuesto
1. Agrega varios elementos
2. Click en "🧮 Calcular Presupuesto de Potencia"
3. Verifica que aparezcan los resultados:
   - PTX (Potencia del Transmisor)
   - Gamp (Ganancias)
   - Lcables (Pérdidas en Cables)
   - Lconectores (Pérdidas por Conectores)
   - Lpasivos (Pérdidas por Pasivos)
   - PRX (Potencia Recibida)
   - Estado del Enlace (✅ VIABLE o ❌ NO VIABLE)

#### F. Cargar Ejemplo
1. Click en "💡 Cargar Ejemplo de Presupuesto"
2. Debe cargar un ejemplo completo según el tab activo
3. Los resultados se deben calcular automáticamente

#### G. Limpiar Todo
1. Click en "🗑️ Limpiar Todo"
2. Confirma la acción
3. Todos los elementos deben eliminarse

## Solución de Problemas

### Si los Botones No Funcionan:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Copia y envía cualquier error que veas

### Si el Tab de Fibra Óptica Está en Blanco:
1. Click varias veces entre los tabs
2. Recarga la página (F5)
3. Verifica que no haya errores en la consola

### Si el Tema No Cambia:
1. Click en el botón de tema varias veces
2. Verifica que el ícono del botón cambie
3. Limpia la caché del navegador (Ctrl+F5)

## Verificación Rápida

### ¿Todo Funciona?
- [ ] Tema claro/oscuro cambia correctamente
- [ ] Tabs cambian entre Coaxial y Fibra
- [ ] Puedo agregar cables
- [ ] Puedo agregar conectores
- [ ] Puedo agregar divisores
- [ ] Puedo agregar amplificadores
- [ ] Los cálculos se actualizan automáticamente
- [ ] El botón "Calcular" funciona
- [ ] El botón "Cargar Ejemplo" funciona
- [ ] El botón "Limpiar Todo" funciona

## Contacto

Si algo no funciona, abre la consola del navegador (F12) y verifica si hay errores.
Todos los botones y funciones deberían estar operativos ahora.

---
**Última Actualización:** Noviembre 8, 2025
