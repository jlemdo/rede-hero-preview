# HTML — Maqueta del hero

Reproducción en HTML/CSS/JS del mockup de Erick
(`../Imagen que creo Erick como hero para tomar en cuenta como diseno/`).

Abrir `index.html` en el navegador. No necesita servidor.

---

## ⛔ QUÉ ES Y QUÉ NO ES

**Es:** una maqueta de referencia visual. Sirve para enseñar el diseño al cliente,
iterar rápido sobre él, y como especificación exacta al construir en Elementor.

**NO es:** código para pegar dentro de widgets de Elementor.

> En el proyecto anterior (BC Greenhouse Growers') se portó una maqueta pegando su HTML
> en widgets `html` y `text-editor`. Se veía perfecto, pero el cliente abría Elementor,
> veía código, y no podía tocar nada. **Costó tres sesiones completas** convertir
> 33 widgets a nativos.
>
> Ver `../PROCESO/ERRORES-PROHIBIDOS.md` §1.

Cuando toque construir en WordPress, cada bloque se hace con **widgets nativos**
(heading, text-editor, button, image, icon-list, container). Esta maqueta se mira,
no se copia.

---

## Estructura

```
HTML/
  index.html          la maqueta
  css/
    tokens.css        variables: colores, tipografía, espaciado
    style.css         estilos del hero
  js/
    main.js           dropdown, menú móvil, gráfico, contadores
  assets/
    Rede-logo.svg     logo oficial del cliente
```

---

## Colores — hay TRES verdes en juego

Esto es importante y está sin resolver:

| Verde | Hex | De dónde sale | Uso |
|---|---|---|---|
| **Interfaz** | `#028B00` | Mockup de Erick | Botones, links, acentos. **El que usa esta maqueta** |
| **Marca** | `#39B54A` | Guía oficial PDF, p.8 | Acentos grandes y fondos. **No pasa AA sobre blanco** |
| **Logo** | `#39A935` | Dentro del archivo SVG | Solo el propio logo |

**El verde de interfaz está pendiente de aprobación del cliente.** Se eligió por
accesibilidad: da ~4.9:1 con texto blanco, mientras el verde de marca da ~2.5:1
y WCAG AA exige 4.5:1.

Está como variable en `tokens.css`. Cambiarlo es editar una línea:

```css
--c-verde: #028B00;
```

Detalle completo en `../IDENTIDAD-DE-MARCA.md` §5 y §6.

---

## Tipografía

**Open Sans**, oficial según la guía de marca (p.10). Gratuita, se carga desde
Google Fonts. La escala usa `clamp()` para escalar sola entre móvil y escritorio.

El logo usa Olivier Regular y ERA ITC, pero solo dentro del SVG. Nunca se tipean.

---

## La regla del padding

Todo el padding y el gap se escriben como **variables**, nunca directo:

```css
/* Así está escrito */
.hero { --padding-top: 0px; padding-block: var(--padding-top); }
```

Esto no es un capricho de estilo. Elementor aplica el padding por una cadena
`--padding-top → --padding-block-start → padding-block-start: var(...)`. Escribir
`padding` directo corta esa cadena y **el cliente nunca podría editarlo desde el editor**.

Escribirlo así desde ahora hace que el paso a Elementor sea directo.
Ver `../PROCESO/02-SISTEMA-VISUAL.md` §2.4.

---

## Placeholders

Marcados con trama diagonal y borde punteado, para que se lea claramente que faltan:

- **Foto del edificio** — pendiente del cliente
- **5 logos de clientes** — pendientes, y con permisos sin confirmar

⚠ Los logos del mockup (Calgary Board of Education, Edmonton Catholic, North Vancouver
SD, Fort McMurray SD, Elk Island) **casi no coinciden** con los de los wireframes.
Solo Calgary está en ambos. Y los testimonios del copy son de Northland, SD27 y
Fort Vermilion, que no aparecen aquí.

**Usar el logo de un cliente sin permiso es un problema legal.** Confirmar la lista
autorizada antes de publicar. Ver `../HERO-REFERENCIA.md` §4.1.

---

## El gráfico

SVG inline, sin librerías. Se dibuja solo al entrar en pantalla.

**Por qué SVG y no una librería de gráficas:**
- Pesa unos pocos KB, no 200
- Nítido en cualquier pantalla
- No depende de nada externo
- En Elementor entra como un bloque único, sin scripts de terceros

La longitud de la línea se **mide** con `getTotalLength()`, no se inventa. Un valor
fijo mal calculado deja la línea a medio dibujar.

Si el JS no corre, el gráfico se ve completo igualmente: el estado por defecto es
el final, y la animación solo se activa al añadir la clase `.chart--anima`.

---

## Cambios respecto al mockup

Tres correcciones deliberadas:

1. **"REDE" → "Rede"** en el párrafo. La guía de marca y el copy del cliente usan
   "Rede" (es una palabra, no un acrónimo).
2. **Sin guiones em (—).** El brief los prohíbe explícitamente.
3. **Inglés canadiense** en el texto.

---

## ⚠ Los datos de la tarjeta son inventados

$480K, 2.7M kWh, 14%, 11% vienen del mockup y **no son datos reales**.

Los datos reales que sí tenemos del brief:
- **$2.94M** en costos innecesarios identificados (Gap Analysis)
- **34%** de reducción de intensidad energética, **$4.4M** ahorrados (Energy Management)

Con un público que compra precisamente por rigor de datos, mostrar cifras inventadas
como si fueran reales es un riesgo de credibilidad. Decidir con el cliente: datos
reales anonimizados, o marcarlo claramente como ejemplo ilustrativo.

---

## Verificado

Renderizado y medido en Chrome, no solo mirado:

- **1440px** — dos columnas, tarjeta superpuesta sobre la foto
- **768px** — una columna, hamburguesa, tarjeta bajo la foto
- **390px** — sin scroll horizontal, botones a ancho completo, métricas apiladas

También:
- Navegable con teclado, foco visible
- `prefers-reduced-motion` respetado en las tres animaciones
- El gráfico se ve completo aunque el JS no cargue
- Los contadores muestran el valor final si no hay JS

---

## Al portar a Elementor

| Bloque de la maqueta | Cómo se construye |
|---|---|
| Header | Theme Builder → Header. `theme-site-logo`, `nav-menu`, `button` |
| Eyebrow, titular, párrafo | `heading` + `text-editor` |
| Botones | `button`, estilados desde Ajustes del sitio |
| Foto | `image` dentro de un container |
| Tarjeta flotante | `container` con posición absoluta |
| Métricas | `heading` + `text-editor` |
| Gráfico | El SVG como bloque único |
| Barra de logos | `container` + widgets `image` |

El dropdown y el menú móvil los resuelve el widget `nav-menu`: ese JS **no se porta**.
La animación del gráfico y los contadores sí, como snippet en `rede-custom.php`.
