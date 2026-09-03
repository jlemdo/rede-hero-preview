# Paleta de Rede — la del guideline, y como usarla

Referencia unica para que todo cuadre con la marca. Sale de la lamina
"LOGO COLOURS" del manual de Rede.

## Lo que dice el manual

> "The basic colours of REDE are in the range of green and grey."
>
> "The REDE green is a bold, powerful colour that embodies sustainability and
> green energies. Additionally black is a strong support colour that speaks
> to the innovative side of REDE."
>
> "The red/orange reflects the organization's dynamism. It should be used
> whenever a graphic vibrancy is desired in communication."

**Solo hay dos colores base.** Todo lo demas son opacidades de esos dos.

---

## Verde REDE

`#39B54A` · Pantone 361 C · CMYK 75/0/100/0 · RGB 57/181/74

| opacidad | valor aprox. |
|---|---|
| 100% | `#39B54A` |
| 80%  | `#61C46F` |
| 70%  | `#75CB81` |
| 60%  | `#89D293` |
| 50%  | `#9CDAA5` |
| 40%  | `#B0E1B7` |

### Donde SI funciona (medido)

| uso | contraste | veredicto |
|---|---|---|
| Texto **negro** sobre el verde | **4.74:1** | cumple AA |
| El verde sobre fondo oscuro (`#0E2A12`) | **5.80:1** | cumple AA |
| Relleno de graficos, barras, areas | — | sin requisito |
| Acentos grandes, filetes, iconos decorativos | — | sin requisito |

### Donde NO funciona

| uso | contraste | problema |
|---|---|---|
| Texto **blanco** sobre el verde | **2.66:1** | muy por debajo de 4.5 |
| Texto verde sobre blanco | **2.66:1** | ilegible en cuerpo |

**La conclusion practica:** el verde de marca es para SUPERFICIES y
ACENTOS, no para texto pequeño ni para botones con texto blanco. Si un
boton verde necesita etiqueta, la etiqueta va en **negro**, no en blanco.

---

## Negro / gris

Pantone 100% Process Black · CMYK 0/0/0/100 · RGB 0/0/0

El valor de marca es negro puro, pero el manual añade entre parentesis
**"WEB #333333 (DARK GREY BETTER FOR WEB)"**: para pantalla, el gris
oscuro. Es una indicacion explicita del propio manual, no una
interpretacion nuestra.

| opacidad | valor | sobre blanco | uso |
|---|---|---|---|
| 100% | `#333333` | 12.63:1 | titulares y cuerpo |
| 80%  | `#5C5C5C` | 6.69:1  | texto secundario |
| 70%  | `#707070` | 4.95:1  | el minimo que aun vale para texto |
| 60%  | `#858585` | 3.69:1  | solo texto grande (>=24px) |
| 50%  | `#999999` | 2.85:1  | decorativo: filetes, bordes |
| 40%  | `#ADADAD` | 2.24:1  | decorativo: fondos, separadores |

---

## Rojo / naranja

El manual lo menciona en el texto de la pagina 8 --"refleja el dinamismo de
la organizacion, usar cuando se busque vibrancia grafica"-- pero **la
lamina solo muestra el verde y el negro**. Leidas las 13 paginas, el valor
no aparece en ningun sitio.

Falta pedirselo a Erick antes de usarlo.

---

## Tipografia (paginas 10 y 11)

**Open Sans** es la tipografia oficial para toda comunicacion corporativa:
"tiene un caracter preciso y limpio que acentua el concepto del lema. Ideal
para titulares, informacion tecnica y señaletica, y tambien para bloques de
texto largo".

Sustituta solo si Open Sans no esta disponible: **Arial**.

La web ya usa Open Sans. Correcto.

---

## La regla del logo sobre fondo de color (pagina 5)

> "When using the colour logo on a colour background ranging between 30%
> and 100% of any solid colour, white letters must be used."

**Ojo: esta regla es para el LOGO, no para la interfaz.** Si se aplicara a
los botones, obligaria a texto blanco sobre el verde, que da 2.66:1 y no
llega al minimo de accesibilidad.

Para el logo sobre fondo verde: letras blancas, como manda el manual.
Para botones y texto de interfaz: ver la regla de mas abajo.

---

## Otras reglas del manual que afectan al sitio

- **El logo no se recolorea** (pagina 9, punto 2). El SVG actual usa
  `#39A935`, que no es el verde de marca: conviene revisar el archivo con
  Erick.
- **No usar el logo sobre fondos complicados o intensos** (pagina 9, punto
  3). Afecta a la idea de poner texturas de fondo en las secciones.
- **Area de proteccion**: hay que dejar un margen libre alrededor del logo,
  definido por la altura del ovalo. Nada de texto o graficos pegados.
- **Ancho minimo con lema: 2 pulgadas**. Por debajo, usar la version sin
  lema. En pantalla son unos 192px a 96ppp.
- Existe `Rede-logo-white.png`, que es el que debe ir en el pie oscuro.

---

## Que hay en el codigo hoy, y que no cuadra

| token | valor | en el guideline |
|---|---|---|
| `--c-verde` | `#2E902B` | **NO** — es el que domina la web |
| `--c-verde-marca` | `#39B54A` | **SI**, el oficial. Apenas usado |
| `--c-verde-logo` | `#39A935` | NO. Solo el archivo SVG del logo |
| `--c-texto` | `#333333` | SI |
| `--c-texto-cuerpo` | `#333333` | SI |
| `--c-texto-suave` | `#6B6B6B` | aprox. al 75% |

### El historial de `#2E902B`

Se eligio por accesibilidad, buscando un verde que pasara AA con texto
blanco encima. **No lo consigue**: da 4.09:1 y el minimo son 4.5:1 para
texto normal (el de los botones mide 16px, por debajo del umbral de 18.66px
que permitiria 3:1).

Asi que hoy usamos un verde que **no es el de la marca** y que **tampoco
resuelve** el problema por el que se eligio.

---

## La regla que resuelve las dos cosas

Volver al verde de marca `#39B54A` y cambiar lo que va ENCIMA:

1. **Botones solidos** → fondo `#39B54A` con texto `#333333` (4.74:1).
   Es ademas lo que sugiere el manual al llamar al gris "color de apoyo".
2. **Texto verde sobre blanco** → no usarlo en cuerpo. Para enlaces y datos
   pequeños, el gris al 100% o al 80%.
3. **Sobre fondo oscuro** → el verde de marca a pleno (5.80:1), que es donde
   mejor rinde.
4. **Graficos, barras y acentos** → verde de marca sin restriccion.

---

## Pendiente de Erick

1. El valor exacto del **rojo/naranja**.
2. Confirmar que los **botones con texto negro** son aceptables para la
   marca. Es la unica via para usar el verde oficial cumpliendo AA.
3. Si hay una lamina posterior del manual con colores de interfaz --estados
   de error, aviso, exito-- que no esten en esta.
