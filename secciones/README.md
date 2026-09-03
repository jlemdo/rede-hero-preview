# Biblioteca de secciones

Todas las variantes construidas para este sitio, guardadas como piezas
independientes. **Nada se borra.** Una variante que no encaja en la home
puede encajar en otra pagina, o servir de punto de partida.

Abre **`indice.html`** en el navegador para verlas todas.

---

## Que hay dentro

**33 variantes en 11 secciones.**

| seccion | variantes | necesita JS |
|---|---|---|
| Hero | Original · Smaller panel · Translucent | — |
| Client logos | Marquee · Three blocks · Spotlight | `d2-foco.js` |
| The problem | Triptych · Readings · Comparison · **Map** | `d2-mapa-cartera.js` |
| Calculator | Panel · Split · Steps | `main.js`, `d2-calc-vivo.js` |
| Solution routes | Self-select · Ladder · Comparison | — |
| Proof | Record · Backed · Timeline | — |
| Reviews | Three · Editorial | `d2-resenas.js` |
| Team | Cards · Dossier · Signature | — |
| Questions | Open · Accordion · By role | `d2-faq.js` |
| Call to action | Balanced · Continuity · Two lanes | — |
| Footer | Directory · Contact-first · Closing | — |

---

## Los archivos de cada variante

```
secciones/problema/
  04-map.html            el marcado, listo para pegar
  04-map.css             SOLO las reglas de esta variante
  04-map.preview.html    para verla funcionando aislada
```

El `.preview.html` no forma parte de la pieza: es un envoltorio para poder
juzgarla. Al reutilizar la seccion se copian el `.html` y el `.css`.

---

## Como reutilizar una seccion en otra pagina

1. Copia el contenido de `NN-nombre.html` donde vaya.
2. Anade el `NN-nombre.css` a la pagina, o pega sus reglas en la hoja que
   uses.
3. Si la seccion necesita JS (columna de la tabla), carga tambien ese
   archivo.
4. La pieza usa **tokens del sistema**, asi que hace falta cargar antes
   `css/tokens.css`. Sin el, los colores y espaciados salen a su valor de
   respaldo.

### Los tokens de fondo

Las secciones toman su fondo de un token de composicion
(`--comp-problema`, `--comp-faq`...). Si la nueva pagina no los declara, cada
seccion usa su valor de respaldo --normalmente blanco--. Para fijar el fondo
a mano:

```css
.d2 .d2-prob-mapa { --comp-problema: #F3F3F3; }
```

Y si la seccion va sobre fondo oscuro, hay que marcarlo para que el texto se
invierta:

```html
<div data-comp-tono="oscuro">  <!-- envolviendo la seccion -->
```

---

## Como se genero, y como regenerarla

Dos scripts en el directorio de trabajo de la sesion:

- `biblioteca.py` — extrae marcado y CSS desde `home-d2.html`
- `previews.py` — genera las vistas previas y el indice

El CSS se reparte **por prefijo de clase**: cada variante tiene el suyo
(`.d2-prob-mapa`, `.d2-faq-acord`), y el extractor recoge todas las reglas
cuyo selector lo mencione, incluidas las de dentro de `@media` y las de
piezas internas (`__marco`, `--modificador`).

**Al anadir o cambiar una variante en `home-d2.html`, vuelve a ejecutarlos**
para que la biblioteca no se quede atras.

---

## Limitaciones que conviene conocer

**Las tres variantes de la calculadora comparten CSS.** Las tres usan la
clase `.calc`, asi que el extractor no puede separarlas: cada archivo trae
las reglas de las tres. Se diferencian solo en el marcado.

**El CSS puede traer reglas de mas.** Si un selector agrupa varias variantes
--`.d2-rutas-sel, .d2-rutas-esc, .d2-rutas-cmp`-- la regla entera aparece en
las tres. Es deliberado: es preferible que sobre una regla a que falte y la
seccion se vea rota.

**Los tokens no se copian.** Viven en `css/tokens.css` y en `css/d2.css`.
Es lo correcto --si se copiaran, cambiar un color obligaria a tocar 33
archivos-- pero significa que la pieza no es autonoma del todo.

**Las vistas previas cargan las hojas completas** del sitio para que el
tipo de letra y los tokens esten disponibles. El `.css` de la variante es
el que si esta recortado.
