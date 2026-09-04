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

## Pendiente global (afecta a varias secciones)

- **`#026F00`** — 141 usos. No está en el manual; viene del mockup de Erick.
  Falta aprobación escrita de Rede. Ver `PENDIENTES-ANTES-DE-PUBLICAR.md`.
- **El 20% del CSS escribe colores a mano** en vez de usar variables: 175
  declaraciones de 878.
- **Los titulares de sección no son uniformes.** Solutions y la calculadora
  usan su propio `clamp()` en vez del token.
