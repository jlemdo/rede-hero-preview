# La composicion de la web: que fondo lleva cada seccion, y por que

Documento de decision. Cada fondo tiene una razon con fuente detras, no una
preferencia estetica. Investigado en septiembre de 2026 con cuatro lineas de
busqueda independientes.

---

## La regla que ordena todo

> **El fondo cambia donde cambia el argumento. Nunca dentro de uno.**

Viene de la investigacion sobre limites de evento: **Pettijohn, Thompson,
Tamplin, Krawietz y Radvansky (2016)**, *Cognition* 148:136-144. Cuatro
experimentos, todos significativos.

- Experimento 2 (N=37): la informacion repartida en dos eventos se recordo
  mejor que la misma en uno solo. .37 vs .34, p=.003. La manipulacion fue
  **puramente visual en pantalla** --cerrar una ventana y abrir otra--, no
  fisica: por eso es transferible a una web.
- Experimento 4 (N=48): con 0, 1 y 2 limites el recuerdo fue .14 / .23 / .27.
  Mas limites, mas beneficio.

Pero tiene contracara, y es la que fija la regla: **lo que cruza un limite se
degrada**. Si un argumento se parte por la mitad con un cambio de fondo, se
pierde. Por eso el fondo cambia ENTRE ideas completas, nunca dentro.

### Lo que esto sustituye

La pregunta original era "cada cuantas secciones conviene cambiar el fondo".
**Esa pregunta no tiene respuesta empirica.** No existe un solo estudio que
manipule la frecuencia de alternancia y mida comprension o conversion. Todo lo
que circula sobre "ritmo de alternancia" es heuristica de estudio de diseno
presentada como hallazgo.

Lo que hay hoy en la web --blanco / tinte / blanco / tinte-- es exactamente
esa alternancia mecanica: el color no dice nada, solo marca que empezo otra
seccion.

---

## Los tres fondos, todos derivables del manual

| | valor | de donde sale |
|---|---|---|
| Blanco | `#FFFFFF` | base |
| Gris tenue | `#F3F3F3` | negro de marca al 6% |
| Negro | `#333333` | el valor que el propio manual marca "DARK GREY BETTER FOR WEB" |

Se retira `#0E2A12`, el verde oscuro que **no sale del manual** --lo eligio el
equipo de diseno, no la marca--.

**Por que solo tres y por que tan sobrios:**

**Reinecke et al. (2013)**, CHI'13. N=548, 450 sitios, exposicion de 500ms.
La complejidad visual y la saturacion cromatica explican el 48% de la varianza
en atractivo percibido. Dos hallazgos que nos tocan directamente:

- La alta saturacion produce **la mayor caida** de atractivo. La complejidad
  baja no penaliza frente a la media.
- Interaccion significativa con nivel educativo, F(4)=2.61, p<.05: *"los
  participantes con doctorado fueron los mas negativamente afectados por la
  alta saturacion"*. Y los mayores de 45 prefirieron complejidad baja,
  F(4)=6.53, p<.001.

Superintendentes y secretarios-tesoreros de distrito escolar son ese perfil:
mayores de 45, alta credencial academica. **La paleta de dos colores de Rede
no es una limitacion con este publico: es una ventaja medida.**

### Contraste de texto, medido

| combinacion | ratio | minimo | |
|---|---|---|---|
| `#333333` sobre blanco | 12.63:1 | 4.5 | cumple |
| `#333333` sobre gris tenue | 11.39:1 | 4.5 | cumple |
| `#FFFFFF` sobre negro | 12.63:1 | 4.5 | cumple |

---

## El mapa

| # | Seccion | Fondo | Por que |
|---|---|---|---|
| 1 | Hero | **blanco** | Maxima legibilidad donde se forma el juicio. Aqui esta el 42% del tiempo de visionado (NN/g, 120 participantes, 130.000 fijaciones). |
| 2 | Logos de cliente | blanco | Mismo bloque que el hero: *quienes somos y para quien trabajamos* es un solo argumento. No se parte. |
| 3 | El problema | **gris tenue** | Primer limite real: cambia el sujeto. Se pasa de Rede al distrito. |
| 4 | Calculadora | blanco | Cambia otra vez: de exponer el problema a cuantificarlo. Ademas es la seccion mas alta (1276px) y de lectura larga: polaridad positiva. |
| 5 | Rutas de servicio | **gris tenue** | De "cuanto" a "como". Y resuelve el unico punto donde hoy hay dos blancos seguidos, 1306px sin corte. |
| 6 | Prueba / resultados | blanco | De la propuesta a la evidencia verificada. Lectura de datos: fondo claro. |
| 7 | Resenas | gris tenue | Sigue siendo evidencia, pero cambia la voz: de nuestros numeros a los suyos. |
| 8 | Equipo | blanco | De la organizacion a las personas. |
| 9 | CTA | **negro** | La unica banda oscura. Ver abajo. |
| 10 | Footer | negro | Continua la banda: cierre y verificacion son el mismo momento. |

Seis limites de fondo para diez secciones. Cada uno coincide con un cambio
real de argumento; ninguno parte una idea.

---

## Las dos decisiones que hay que justificar mejor

### Por que una sola banda oscura

**NN/g (Aurora Harley, 2020)** documenta que los bloques de ancho completo con
fondo contrastante *"pueden impedir que los usuarios sigan bajando"*. Con diez
secciones, cada banda oscura es un punto donde alguien puede abandonar el
scroll.

Por eso hay **una sola**, y va al final: donde detener el scroll ya no cuesta
nada porque el contenido se acabo.

### Por que el CTA va en negro, y no en claro

Aqui la medicion contradijo a la propia investigacion. El informe recomendaba
CTA sobre fondo claro "porque el verde contrasta mejor sobre blanco". **Es
falso, y se puede medir:**

| fondo | el boton verde contra el fondo | WCAG 1.4.11 (min 3:1) |
|---|---|---|
| blanco | 2.66:1 | **no cumple** |
| gris tenue | 2.40:1 | **no cumple** |
| negro | 4.74:1 | cumple |

El verde de marca **no se distingue como componente sobre ningun fondo claro**.
Se comprobo si el borde ayudaba: es del mismo verde que el relleno, asi que no
aporta nada.

Sobre negro el boton cumple sin tocarlo. Y el texto gris oscuro que va encima
mantiene sus 4.74:1.

**Pero esto no exime de arreglar el boton**, porque aparece tambien en el hero
y en la calculadora, ambos claros. La solucion medida: borde `#026F00`, que da
6.41:1 sobre blanco y 5.78:1 sobre gris. Se aplica en todas partes.

---

## Lo que la evidencia dice que NO hagamos

**No perseguir la disrupcion.** Es lo contrario de lo que sugiere el marco de
TikTok, y esta medido: **Tuch et al. (2012)**, N=86 y N=68, exposiciones de
hasta 17ms. Lo que mejor predice una valoracion positiva es **baja complejidad
visual + alta prototipicidad**: que la pagina se parezca a lo que se espera del
sector. Romper convenciones penaliza la credibilidad, que es justo lo que se
esta vendiendo a un comite que evalua riesgo.

**No destacar varias secciones a la vez.** El efecto de aislamiento depende de
que el resto sea homogeneo. Con cinco secciones destacadas el efecto es cero.
Ademas, MeasuringU (N=202 y N=213) mostro que el aislamiento **predice recuerdo,
no eleccion**: destacar el CTA hace que se recuerde, no que se pulse.

**No usar contraste para generar confianza.** Es una cadena que se cae. El
estudio original (Reber y Schwarz 1999) encontro una diferencia de **0,27
frases sobre 16**, p=.05 a una cola. Aktepe y Heck (2025), con preregistro,
obtuvo **efectos nulos**. Lo que si funciona para percepcion de fiabilidad es
la **repeticion coherente del mensaje** --meta-analisis de 182 estudios,
N=31.184, g=0.37--, que es estructura de contenido, no color.

---

## Cifras falsas detectadas, para que no entren en la web

Con un comprador tecnico, citar un dato falsificable descuenta la seriedad de
toda la propuesta. Estas se rastrearon hasta su origen:

| Cifra | Que es en realidad |
|---|---|
| "Lo visual se procesa 60.000 veces mas rapido" | Publirreportaje de *Business Week*, 1982, firmado por el presidente de una empresa que vendia software de graficos. Sin cita. El investigador al que se atribuye confirmo que su trabajo no tiene relacion. |
| "El usuario decide en 0,05 segundos" | Lindgaard (2006) midio **valoracion de atractivo**, no decision. |
| "El color aumenta el reconocimiento de marca un 80%" | El estudio citado no contiene la cifra. |
| "El boton rojo convierte 21% mas" | ~2.000 visitas en pocos dias. Y no medía color: la pagina era verde, el boton verde se fundia. Medía contraste. |
| "Palmer 1992: region comun mejora la organizacion un 34%" | El paper no tiene datos cuantitativos. El propio Palmer escribe que harian falta procedimientos cuantitativos. |
| "comScore: +69% por anadir un logo de cliente" | La fuente primaria devuelve 404. |
| "Calculadoras interactivas convierten 40-60%" | Solo vendedores de software de calculadoras. |
| "GoodUI: +84% repitiendo CTAs" | Sin muestra ni significancia publicadas. |

---

## Pendiente de decidir

1. **Si se retira `#0E2A12` de toda la web.** Hoy sigue en el pie y en la
   opcion "Dark" del selector. El negro `#333333` es del manual; el verde
   oscuro no.
2. **El borde del boton**, que hay que aplicar en las secciones claras.
3. **Que hacemos con la seccion del mapa de cartera** (opcion 4 del problema),
   que es oscura por definicion --el grafico necesita fondo oscuro-- y con este
   mapa seria una segunda banda oscura a mitad de pagina, justo lo que NN/g
   desaconseja.

---

## Fuentes

- Pettijohn et al. (2016), *Cognition* 148:136-144 — limites de evento
- Reinecke et al. (2013), CHI'13 — complejidad visual, N=548
- Tuch et al. (2012), *IJHCS* 70(11) — prototipicidad, N=86/68
- Piepenbrock et al. (2013), *Ergonomics* 56(7) — polaridad, N=169
- NN/g — [Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/), [Common Region](https://www.nngroup.com/articles/common-region/)
- MeasuringU — [Von Restorff](https://measuringu.com/von-restorff/), N=202/213
- WCAG 2.2 — [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
