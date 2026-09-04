# Pendientes antes de publicar

Lo que queda abierto y hay que resolver **antes** de subir a la web.
Cada punto lleva lo medido, para no volver a discutirlo desde cero.

Actualizado: 3 de septiembre de 2026

---

## 1. El verde de los botones — DECISIÓN DE CLIENTE

`#026F00`, 141 usos en toda la web (55 en Solutions, 40 en el hero, 6 en la
calculadora). **No está en el manual de marca.**

Viene del mockup de Erick (`#038C01`, `#028B00`). Ya estaba documentado como
conflicto en `IDENTIDAD-DE-MARCA.md` §5.

El problema de fondo: **el manual no tiene ningún verde oscuro.** Sus tintas
van de 100% a 40%, todas hacia claro.

| Opción | Texto blanco | Texto `#333333` | ¿En guía? |
|---|---|---|---|
| `#026F00` (actual) | **6.41:1** ✓ | 1.97:1 ✗ | No |
| `#39B54A` (marca) | 2.66:1 ✗ | **4.74:1** ✓ | Sí |

El verde de marca **no sirve** para botón con texto blanco. Sí con texto
`#333333`, pero esa es la combinación verde/gris que Erick rechazó.

**Tres caminos:**
1. Dejar `#026F00` y pedir aprobación escrita a Rede *(recomendado)*
2. Verde de marca con texto `#333333` — cumple todo, pero ya se descartó
3. Preguntar a Rede si tienen un verde oscuro de interfaz fuera del PDF

---

## 2. El rojo de las gráficas — CONFIRMAR CON ERICK

`#C0392B` en la sección del problema. **El manual no da ningún valor de rojo.**

La página 8 dice *"The red/orange reflects the organization's dynamism"*, pero
no hay swatch ni valor en toda la guía. Es una propuesta, no un color de marca.

---

## 3. La calculadora deja avanzar sin el dato obligatorio

**Decidido el 3/9/2026: se queda como está, se revisa al final.**

Si el usuario llega al paso 4 sin dar área ni gasto, la calculadora muestra el
resultado igualmente: pone "Add your area" en el lugar de la cifra, pero debajo
enseña `School`, `9.5 per cent` y `1.8 years` como si el cálculo fuera válido.

- `siguiente()` en `js/main.js` avanza sin validar
- El input `#c-area` no tiene `required`
- Hay botón "Back", así que nadie queda atrapado

Arreglarlo toca la lógica de la calculadora, que está congelada por decisión
del cliente. Dos opciones cuando se retome:

- **Solo CSS:** que el aviso deje de ocupar 50px y no compita con la
  recomendación. No toca `main.js`.
- **Producto:** que el botón del último paso no avance sin área ni gasto.
  Toca `main.js`.

---

## 4. La metodología de la calculadora — PREGUNTAR AL CLIENTE

El brief dice **dos veces**: *"Results section: BC Hydro case study data.
Citation to be confirmed before publishing."*

El cliente marcó esa cita como pendiente. La calculadora entera descansa sobre
esos benchmarks y la nota al pie los declara en público.

Tres preguntas para Erick:

1. **¿Está confirmada la cita de BC Hydro C-Op?** El brief dice que no.
2. **La metodología no se pidió por escrito.** `PROCESO/05-CALCULADORA.md`
   lo exigía: *"⛔ No empezar sin la metodología del cliente por escrito."*
   Lo construido es más fino que el spec (13 benchmarks reales en vez de un
   rango 10–15%), pero no está firmado.
3. **La salida es un número exacto, no un rango.** El spec pedía rango. Un
   `$23,750` exacto se lee como promesa; el descargo dice que es estimación.
   La cifra en grande contradice al descargo.

Lo que **sí** viene del cliente y está verificado:
- Los 13 benchmarks por tipo de edificio (del wireframe)
- El 9.5% de School — coincide con el brief
- Los $2.94M — coincide con el brief
- La ramificación single → Site Investigation / multiple → Gap Analysis

---

## 5. Verificación en tres motores

Todo lo medido en esta sesión es **solo Chromium**. Playwright no está
instalado como módulo de Node en este equipo, únicamente el navegador vía MCP.

Antes de publicar hay que repasar en **WebKit y Firefox**, sobre todo:

- La entrada de la calculadora al hacer scroll (`IntersectionObserver`)
- El punto del perfil (`:not() ~ :not()`, CSS2, sin riesgo esperado)
- Las animaciones con `animation-timeline` de otras secciones
  (**no soportadas en Firefox**, ya medido)

---

## 6. Notas de Erick sin abordar

- (11) Framework de SEO
- (17) "Energy management solutions" del diseño de ChatGPT
- (21) Logo blanco del footer / clics en gris
- **Lo último de todo:** quitar el selector de diseños para que el diseño 2
  pase a ser la home
