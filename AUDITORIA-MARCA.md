# Auditoría de marca — sección por sección

Verificación de que los colores y las tipografías de la home cumplen el
manual de Rede. Cada sección se audita, se corrige lo urgente y se anota
lo que queda.

Empezada: 4 de septiembre de 2026

---

## La referencia: qué dice el manual, verificado contra el PDF

Se extrajeron los operadores de color del PDF original, no de la
transcripción. El PDF está construido para imprenta: **declara todo en CMYK
y no contiene ni un solo valor RGB o hex**.

**Confirmado contra la fuente:**

| | Valor en el PDF |
|---|---|
| Verde de marca | `C75 M0 Y100 K0` |
| Tintas del verde | C60, C52, C45, C37, C30 → 80%, 70%, 60%, 50%, 40% |
| Escala del negro | K20, 30, 40, 50, 60, 70, 80, 85, 100 |

**Los hex que usamos son una interpretación**, no un dato del manual:

| Tinta | Hex |
|---|---|
| 100% | `#39B54A` |
| 80% | `#6DC067` |
| 70% | `#80C679` |
| 60% | `#92CC8B` |
| 50% | `#A4D49B` |
| 40% | `#B5DBAD` |

Salen de muestrear el swatch del PDF. `C75 M0 Y100 K0` es Pantone 361 C, que
convertido a sRGB con un perfil real ronda ese valor, así que la
interpretación es correcta. **Decisión del 4/9/2026: se dan por buenos.**

**El negro:** la guía dice literalmente *"DARK GREY BETTER FOR WEB"*, así que
en pantalla el K100 se sustituye por `#333333`. Nuestra escala de grises
parte de ahí y es correcta.

**Para preguntar a Rede:** si tienen un hex oficial del verde, usar el suyo
en vez de nuestra interpretación.

---

## 1. HEADER — auditado 4/9/2026

### Corregido

**Los botones del menú móvil.** Se quedaron con el esquema viejo —verde de
marca de fondo y texto blanco— que en escritorio ya se había corregido.
Medido: **2.66:1**, muy por debajo del 4.5 que exige WCAG.

Ahora siguen el patrón del resto de la web:

| Estado | Fondo | Texto | Contraste |
|---|---|---|---|
| Reposo | `#026F00` | blanco | 6.41:1 |
| Hover | `#39B54A` | `#333333` | 4.74:1 |

Además del contraste, gana coherencia: el mismo botón no puede verse de dos
colores según el ancho de la ventana.

**El token fantasma `--fw-semibold`.** No existe en `tokens.css`; el CSS lo
usaba como `var(--fw-semibold, 600)` y funcionaba por el respaldo. Los 5
usos pasan a `--fw-medium`, que sí existe y vale lo mismo.

### Correcto, sin tocar

- `#333333`, `#FFFFFF`, `#39B54A`, `#B5DBAD` — todos del manual
- Toda la tipografía hereda Open Sans; ninguna regla declara otra familia

### Anotado para el final

- **Cinco tamaños escritos a mano** en vez de token: `1rem`, `.8125rem`,
  `2rem`, `.875rem`, `.9375rem`. Funcionan, pero son el tipo de cosa que
  desalinea las secciones con el tiempo.

---

## 2. HERO — auditado 4/9/2026

**Resultado: cumple. No hizo falta tocar nada.**

### Colores

Los cinco que usa salen del manual:

| Color | Qué es | Dónde |
|---|---|---|
| `#333333` | Negro de marca | Titular, entradilla, cifras |
| `#6B6B6B` | Negro al 73% | Etiquetas de las métricas |
| `#39B54A` | Verde de marca | Acentos |
| `#B5DBAD` | Verde 40% | Sobre fondo oscuro |
| `#FFFFFF` | Blanco | Panel y fondo |

El único fuera de guía es **`#026F00`** en el eyebrow, que es la decisión
global pendiente de aprobar.

### Contraste

Todo cumple sobre fondo blanco: de 5.33:1 el más bajo —la etiqueta de
métrica— a 12.63:1.

**Se verificó además el fondo con imagen**, que era el riesgo real: la foto
del edificio va al 50% de opacidad y ocupa desde el 32% del ancho, así que
se cruza con el final del texto. Medido en el peor caso —píxel más oscuro de
la imagen, en el punto de mayor solape— el titular da **5.31:1**. Cumple.

Las métricas no corren riesgo: el panel tiene fondo blanco propio.

### Tipografía

Correcta. Todo hereda Open Sans y los pesos salen de tokens
(`--fw-bold`, `--fw-extrabold`, `--fw-medium`, `--fw-regular`).

### Anotado para el final

- **Ocho tamaños escritos a mano**: `.8125rem`, `.875rem`, `.75rem`,
  `1.25rem`, `.6875rem` y tres `clamp()` propios. Mismo caso que el header.
- **El hero conserva su barra de variantes.** Es la única sección junto al
  FAQ y el footer que sigue con selector. Hay que fijarla antes de entregar.

---

## 3. MARCAS — auditado 4/9/2026

**Resultado: cumple. No hizo falta tocar nada.**

### Colores

Todos los que pinta salen del manual:

| Color | Qué es | Dónde |
|---|---|---|
| `#6B6B6B` | Negro al 73% | Eyebrow sobre fondo claro |
| `#BFBFBF` | Negro al 31% | Eyebrow sobre fondo oscuro |
| `#333333`, `#39B54A`, `#E4E4E4`, `#E8E8E8`, `#FFFFFF` | Del manual | Varios |

**Un color no deriva: `#CFDCD1`.** Pero solo pinta cuando el selector de
fondos de Erick pone el verde `#2A5C31`, que es una herramienta temporal, no
un estado de producción. Si ese fondo se descarta, el color se va con él.

*Nota de método:* una primera pasada marcó también `#026F00` en esta
sección. Era un falso positivo — mi filtro capturó una regla genérica que
comparte selector. Verificado: **no hay ninguna regla de marcas que lo use.**

### Contraste

El eyebrow es el único texto, y cumple en los cinco fondos del selector:

| Fondo | Eyebrow | Contraste |
|---|---|---|
| Blanco | `#6B6B6B` | 5.33:1 |
| Gris | `#6B6B6B` | 4.80:1 |
| Gris oscuro | `#BFBFBF` | 6.87:1 |
| Negro | `#BFBFBF` | 9.46:1 |
| Verde | `#CFDCD1` | 5.54:1 |

**Los logos también se verificaron.** Sobre fondo oscuro se invierten a
blanco con `opacity: .85`; medido, quedan entre 6.23:1 y 12.81:1, por encima
del 3:1 que pide WCAG para gráficos.

### Tipografía

Correcta. Un solo tamaño (`.6875rem`) con `--fw-bold`, y todo hereda Open
Sans.

### Anotado para el final

- **El selector de fondos de Erick sigue en la página.** Es temporal: hay
  que retirarlo cuando se decida el fondo definitivo. Con él se va el
  `#CFDCD1`.

---

## 4. SOLUTIONS — auditado 4/9/2026

### Corregido

**El nombre del servicio iba en peso 400.** Era el único subtítulo de toda
la web en peso normal: equipo, reseñas, prueba, FAQ y las otras variantes de
esta misma sección usan 700 u 800. Pasa a `--fw-bold`.

**Catorce respaldos de token que mentían.** Al comprobar si de verdad usamos
los mismos hexadecimales en todas las secciones apareció esto:

| Token | Vale | Pero el respaldo decía |
|---|---|---|
| `--c-verde` | `#39B54A` | `#009B27` (13 veces) |
| `--c-borde-suave` | `#EFEFEF` | `#E2E6E2` |
| `--c-texto-suave` | `#6B6B6B` | `#5C5C5C` (3 veces) |

No cambiaba lo que se ve —el token siempre gana— pero es una mentira en el
código: quien lea `var(--c-verde, #009B27)` creerá que el verde de marca es
ese. Y de hecho **me engañó a mí**: mi primera auditoría reportó `#5C5C5C`
en esta sección porque leí el respaldo en vez del valor real.

El `#009B27` era además el verde inventado del menú móvil, esparcido por
todo el CSS.

### Correcto, sin tocar

Colores: `#333333`, `#6B6B6B`, `#BFBFBF`, `#E4E4E4`, `#39B54A`, `#B5DBAD`,
blanco. Todos del manual. El único fuera de guía es `#026F00`, la decisión
global.

Contraste: de 5.78:1 a 11.39:1.

### Anotado para el final

- Seis pesos escritos a mano y cuatro tamaños sueltos (`14px`, `12px`,
  `17px`, `13px`).

---

## 5. CALCULADORA — auditado 4/9/2026

Se auditó en dos partes, como pidió el cliente: la cabecera negra y el panel.

### 5a. La cabecera — cumple, sin cambios

Sobre el negro `#1A1A1A`:

| Elemento | Color | Contraste |
|---|---|---|
| Eyebrow | `#B5DBAD` (verde 40%) | 11.35:1 |
| Titular | `#FFFFFF` | 17.40:1 |
| Entradilla | `#D6D6D6` (negro 20%) | 11.97:1 |

Los tres derivan del manual. El `#1A1A1A` del fondo también: es el negro de
marca al 50% sobre negro.

### 5b. El panel — corregido el `$2.94M`

**El problema:** iba en verde de marca sobre el gris `#F5F5F5` del bloque, y
daba **2.44:1** — por debajo del 3 que pide WCAG para texto grande.

Es la misma cifra que aparece en Reviews, así que se resolvió igual: **el
bloque pasa a blanco y la cifra al `#33A343`**, verde de marca al 90% sobre
negro. Medido: 3.25:1.

*Por qué no bastaba con cambiar solo el verde:* sobre el gris, el `#33A343`
da 2.98 — se queda a 0.02 del mínimo. El fondo gris es más exigente que el
blanco, y además tener la misma cifra sobre dos fondos distintos según la
sección no tenía sentido.

**El resto del panel cumple.** Es oscuro, no blanco como parecía: los
blancos con transparencia van sobre `#1A1A1A` y dan de 7.32:1 a 17.40:1. Las
cifras en verde de marca sobre ese fondo dan 6.53:1.

La zona blanca del perfil también: `#333333` a 12.63:1 y `#6B6B6B` a 5.33:1.

### Anotado para el final

- **Tres grises distintos para el mismo papel** en secciones oscuras:
  `#BFBFBF` (Solutions), `#D6D6D6` (esta cabecera), `#E8E8E8` (Marcas). Los
  tres derivan del manual y los tres cumplen, pero convendría unificar.

---

## 6. REVIEWS — auditado 4/9/2026

### Corregido: los puntos de navegación

Son controles, así que WCAG 1.4.11 pide 3:1 contra el fondo. Ninguno
llegaba:

| | Antes | Ahora |
|---|---|---|
| Inactivo | `#E4E4E4` — 1.27:1 | `#8F8F8F` — 3.23:1 |
| Activo | `#39B54A` — 2.66:1 | `#026F00` — 6.41:1 |

**Un detalle que hizo falta medir:** el primer intento puso el activo en
`#33A343`, el verde de las cifras de esta misma sección. Pero los dos puntos
daban **1.01:1 entre sí** —casi la misma luminosidad— así que quien no
distinga tonos no sabría cuál está activo. Con `#026F00` suben a 1.98.

El `#8F8F8F` es negro de marca al 55% sobre blanco, así que deriva del
manual.

El punto activo sigue creciendo 1.6×, y lleva `role="tab"` con
`aria-selected`: la señal nunca dependió solo del color.

### Correcto, sin tocar

Todo el texto cumple sobre el fondo blanco fijo:

| Elemento | Color | Contraste |
|---|---|---|
| Eyebrow | `#026F00` | 6.41:1 |
| La cita | `#333333` | 12.63:1 |
| Nombre | `#333333` | 12.63:1 |
| Organización | `#6B6B6B` | 5.33:1 |
| Las cifras | `#33A343` | 3.25:1 |
| Etiquetas | `#6B6B6B` | 5.33:1 |

El trazado decorativo del fondo va al 20-32% de opacidad, pero es
`aria-hidden` y no transmite información, así que el mínimo no le aplica.

---

## 7. EQUIPO — auditado 4/9/2026

### Corregido: cuatro colores inventados

Todos cumplían contraste (de 4.83 a 7.85), pero ninguno derivaba del manual.

**Un comentario del CSS afirmaba lo contrario:** *"El verde del fondo se
construye desde el manual: verde de marca al 22% sobre el negro #333333.
Nada inventado."* Comprobado: ese cálculo da `#345038`, no `#2A5C31`.

| | Antes | Ahora | Contraste |
|---|---|---|---|
| Fondo | `#2A5C31` | `#1A5121` — verde al 45% sobre negro | — |
| Eyebrow | `#B5DBAD` | igual, tinta 40% | 6.11:1 |
| Entradilla | `#D6E4D8` | `#B5DBAD` — tinta 40% | 6.11:1 |
| Cargo | `#C8DACB` | `#A4D49B` — tinta 50% | 5.56:1 |
| Cargo (span) | `#BCD0BF` | `#92CC8B` — tinta 60% | 5.01:1 |
| Titular y nombres | `#FFFFFF` | igual | 9.36:1 |

**Por qué el fondo baja del 22% al 45% de verde:** con el anterior, las
tintas 50 y 60 daban 4.28 y 3.86 — por debajo del mínimo. Con este hay
margen para las tres y se conserva la jerarquía entre título y cargo.

El `fill` del circuito decorativo se ajustó al fondo nuevo.

### De paso: el último color inventado de Marcas

El selector de fondos de Erick usaba `#CFDCD1` para su eyebrow sobre verde,
porque la tinta oficial no llegaba con el fondo anterior. **Con `#1A5121` la
tinta 40% da 6.11:1**, así que ese color desaparece.

Marcas y Equipo quedan con **cero colores inventados**.

---

## Comprobación transversal: ¿usamos los mismos colores en todas las secciones?

Hecha el 4/9/2026, a petición del cliente.

**Sí, con una excepción documentada.** El mismo elemento usa el mismo color
en todas las secciones:

| Elemento | Fondo claro | Fondo oscuro |
|---|---|---|
| Eyebrow | `#026F00` | `#B5DBAD` |
| Texto de cuerpo | `--c-texto-cuerpo` (`#333333`) | `#BFBFBF` / `#E8E8E8` |
| Texto suave | `--c-texto-suave` (`#6B6B6B`) | — |

**La excepción:** Equipo y la cabecera de la calculadora usan `#D6E4D8` y
`#D6D6D6` en su texto de cuerpo. Ambas tienen fondo propio —verde y negro—
así que no comparten el mismo contexto. Se revisan al auditar esas
secciones.

---

## Pendiente global (afecta a varias secciones)

- **`#026F00`** — 141 usos. No está en el manual; viene del mockup de Erick.
  Falta aprobación escrita de Rede. Ver `PENDIENTES-ANTES-DE-PUBLICAR.md`.
- **El 20% del CSS escribe colores a mano** en vez de usar variables: 175
  declaraciones de 878.
- **Los titulares de sección no son uniformes.** Solutions y la calculadora
  usan su propio `clamp()` en vez del token.
