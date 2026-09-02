/* ==========================================================================
   EL HEADER: DESPLEGABLE Y MENU MOVIL CON MOVIMIENTO

   El codigo base abre y cierra con el atributo `hidden`, que es correcto
   para accesibilidad pero corta cualquier transicion: el elemento pasa de
   `display:none` a visible y no hay nada que animar.

   Aqui se conserva `hidden` (el lector de pantalla lo necesita) pero se
   retira un instante antes de animar, y se vuelve a poner cuando la
   animacion de cierre termina. Asi el elemento sigue estando oculto de
   verdad cuando esta cerrado.

   La curva es cubic-bezier(.32,.72,0,1), la que usa Apple en sus menus:
   arranca decidido y frena muy suave, sin rebote.
   ========================================================================== */

(function () {
  'use strict';

  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Abrir y cerrar respetando la animacion
     ------------------------------------------------------------------------ */

  function abrir(el) {
    if (el.dataset.cerrando) {
      clearTimeout(+el.dataset.cerrando);
      delete el.dataset.cerrando;
    }
    el.hidden = false;
    /* Forzar un reflow: sin esto el navegador aplica el estado final de
       golpe y la transicion no llega a verse. */
    void el.offsetWidth;
    el.classList.add('esta-abierto');
  }

  function cerrar(el) {
    el.classList.remove('esta-abierto');

    if (sinMovimiento) { el.hidden = true; return; }

    /* Se espera a que termine la animacion antes de ocultarlo del todo.
       450ms es la mas larga de las declaradas en el CSS. */
    var t = setTimeout(function () {
      el.hidden = true;
      delete el.dataset.cerrando;
    }, 450);
    el.dataset.cerrando = t;
  }

  /* ------------------------------------------------------------------------
     EL DESPLEGABLE DE SOLUTIONS
     ------------------------------------------------------------------------ */

  var toggle = document.querySelector('.nav__toggle');
  var drop = document.querySelector('.nav__drop');

  if (toggle && drop) {
    /* El manejador del codigo base seguiria poniendo `hidden` a mano y
       pisaria la animacion. Se sustituye el boton por un clon sin oyentes. */
    var limpio = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(limpio, toggle);
    toggle = limpio;

    var abierto = false;

    function pintar(v) {
      abierto = v;
      toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
      v ? abrir(drop) : cerrar(drop);
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      pintar(!abierto);
    });

    /* Al pulsar fuera se cierra */
    document.addEventListener('click', function (e) {
      if (!abierto) { return; }
      if (drop.contains(e.target) || e.target === toggle) { return; }
      pintar(false);
    });

    /* Escape cierra y devuelve el foco al boton, que es de donde salio */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto) {
        pintar(false);
        toggle.focus();
      }
    });

    /* Si el foco sale del menu con el tabulador, se cierra: quedaria abierto
       detras mientras se navega por otro sitio. */
    drop.addEventListener('focusout', function (e) {
      if (!abierto) { return; }
      if (drop.contains(e.relatedTarget) || e.relatedTarget === toggle) { return; }
      pintar(false);
    });
  }

  /* ------------------------------------------------------------------------
     EL MENU MOVIL
     ------------------------------------------------------------------------ */

  var burger = document.querySelector('.burger');
  var movil = document.getElementById('mobile-menu');

  if (burger && movil) {
    var limpioB = burger.cloneNode(true);
    burger.parentNode.replaceChild(limpioB, burger);
    burger = limpioB;

    var abiertoM = false;

    function pintarM(v) {
      abiertoM = v;
      burger.setAttribute('aria-expanded', v ? 'true' : 'false');
      burger.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
      burger.classList.toggle('esta-activo', v);
      v ? abrir(movil) : cerrar(movil);

      /* Con el menu abierto, el fondo no debe poder desplazarse */
      document.body.style.overflow = v ? 'hidden' : '';
    }

    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      pintarM(!abiertoM);
    });

    /* Al elegir un destino se cierra: si no, tapa la seccion a la que se
       acaba de saltar */
    movil.addEventListener('click', function (e) {
      if (e.target.closest('a')) { pintarM(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abiertoM) {
        pintarM(false);
        burger.focus();
      }
    });

    /* Al volver a escritorio el menu movil no debe quedarse abierto */
    window.matchMedia('(min-width: 1001px)').addEventListener('change', function (ev) {
      if (ev.matches && abiertoM) { pintarM(false); }
    });
  }
})();
