/* ==========================================================================
   SELECTOR DE FONDO DE LA SECCION DE MARCAS

   Un control local para que Erick pruebe la seccion en cinco fondos sin
   tocar el resto de la web. Es temporal: se retira al decidir.

   Por que no reutilizar el selector de composicion global: ese cambia las
   once secciones a la vez y aqui hace falta mover una sola. Ademas la
   seccion de marcas no sigue al token de composicion, asi que el control
   global no la alcanzaria.

   Los cinco fondos salen del manual. El detalle de cada uno esta junto a
   la lista, mas abajo.
   ========================================================================== */

(function () {
  'use strict';

  var caru = document.getElementById('caru-logos');
  if (!caru) { return; }

  var seccion = caru.querySelector('.d2-logos--dos');
  if (!seccion) { return; }

  /* Cinco fondos, todos derivables del manual:
       blanco
       negro de marca al 6%   -> el gris de la composicion
       negro de marca         -> #333333
       negro de marca al 50% sobre negro puro -> #1A1A1A, el de la
         cabecera de la calculadora
       verde de marca al 45% sobre negro -> el de la seccion de equipo

     El #333333 se llamaba "Black" y era incoherente: el negro de la web es
     el #1A1A1A de la calculadora. Ahora cada uno lleva el nombre que le
     corresponde. */
  var FONDOS = [
    { id: 'blanco',    et: 'White',     color: '#FFFFFF', tono: 'claro' },
    { id: 'gris',      et: 'Grey',      color: '#F3F3F3', tono: 'claro' },
    { id: 'grisosc',   et: 'Dark grey', color: '#333333', tono: 'oscuro' },
    { id: 'negro',     et: 'Black',     color: '#1A1A1A', tono: 'oscuro' },
    { id: 'verde',     et: 'Green',     color: '#1A5121', tono: 'verde' }
  ];

  var CLAVE = 'rede-logos-fondo';
  var actual = 0;

  try {
    var g = parseInt(sessionStorage.getItem(CLAVE), 10);
    if (!isNaN(g) && g >= 0 && g < FONDOS.length) { actual = g; }
  } catch (e) {}

  function pintar(i) {
    actual = (i + FONDOS.length) % FONDOS.length;
    var f = FONDOS[actual];

    /* El color va en la seccion y el TONO en un atributo: el CSS decide
       desde ahi que texto usar. Asi no hay que nombrar cada elemento
       aqui, que es lo que convierte estas cosas en listas interminables. */
    seccion.style.setProperty('--logos-fondo', f.color);
    seccion.setAttribute('data-logos-tono', f.tono);

    Array.prototype.forEach.call(botones, function (b, n) {
      var on = n === actual;
      b.classList.toggle('es-activo', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    try { sessionStorage.setItem(CLAVE, String(actual)); } catch (e) {}
  }

  /* --- La barra, con el mismo aspecto que los demas mandos --- */

  var barra = document.createElement('div');
  barra.className = 'd2-caru__mandos d2-logos-fondos';
  barra.innerHTML =
    '<button class="d2-caru__ocultar" type="button" data-lf-ocultar aria-expanded="true" aria-label="Close background options">' +
      '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
    '</button>' +
    '<span class="d2-logos-fondos__eti">Logos background</span>' +
    '<div class="d2-caru__puntos" role="tablist" aria-label="Logos section background">' +
      FONDOS.map(function (f, i) {
        return '<button class="d2-caru__punto" type="button" role="tab" aria-selected="false" data-lf-a="' + i + '">' +
               '<span>' + (i + 1) + '</span><small>' + f.et + '</small></button>';
      }).join('') +
    '</div>';

  caru.appendChild(barra);

  var botones = barra.querySelectorAll('[data-lf-a]');

  Array.prototype.forEach.call(botones, function (b, n) {
    b.addEventListener('click', function () { pintar(n); });
  });

  /* Minimizar, igual que el resto de mandos */
  var ocultar = barra.querySelector('[data-lf-ocultar]');
  var minimizado = false;
  try { minimizado = sessionStorage.getItem(CLAVE + '-min') === '1'; } catch (e) {}

  function pintarMin() {
    barra.classList.toggle('esta-minimizado', minimizado);
    ocultar.setAttribute('aria-expanded', minimizado ? 'false' : 'true');
    ocultar.setAttribute('aria-label', minimizado ? 'Show background options' : 'Close background options');

    /* Minimizados quedan recortados: sin esto seguirian recibiendo el
       tabulador y el foco se iria a un boton que no se ve. */
    Array.prototype.forEach.call(
      barra.querySelectorAll('button:not([data-lf-ocultar])'),
      function (b) { b.tabIndex = minimizado ? -1 : 0; }
    );

    try { sessionStorage.setItem(CLAVE + '-min', minimizado ? '1' : '0'); } catch (e) {}
  }

  ocultar.addEventListener('click', function () {
    minimizado = !minimizado;
    pintarMin();
  });

  pintar(actual);
  pintarMin();
})();
