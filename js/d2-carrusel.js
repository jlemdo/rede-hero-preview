/* ==========================================================================
   CARRUSEL DE VARIANTES — DISEÑO 2

   Sirve para decidir: cada seccion que tenga opciones se envuelve en uno y
   se comparan sin cambiar de pagina.

   NO gira solo. Un carrusel automatico sirve para pasar contenido; este es
   para comparar, y moverse solo mientras alguien mira una opcion es justo lo
   contrario de lo que hace falta.

   Se mueve con:
     - los botones
     - las flechas del teclado (izquierda / derecha)
     - arrastrando con el dedo

   Funciona con cualquier bloque que lleve [data-caru], asi que las secciones
   siguientes no necesitan codigo nuevo: solo el marcado.
   ========================================================================== */

(function () {
  'use strict';

  var carruseles = document.querySelectorAll('[data-caru]');
  if (!carruseles.length) { return; }

  Array.prototype.forEach.call(carruseles, function (caja) {

    var diapos = caja.querySelectorAll('.d2-caru__diapo');
    var puntos = caja.querySelectorAll('[data-caru-a]');
    var flechas = caja.querySelectorAll('[data-caru-ir]');
    if (diapos.length < 2) { return; }

    var actual = 0;

    /* La eleccion se recuerda mientras dure la visita: al volver a la pagina
       sigue la opcion que se estaba mirando, no la primera. */
    var CLAVE = 'rede-caru-' + (caja.id || 'sin-id');
    try {
      var guardado = parseInt(sessionStorage.getItem(CLAVE), 10);
      if (!isNaN(guardado) && guardado >= 0 && guardado < diapos.length) { actual = guardado; }
    } catch (e) {}

    function mostrar(i, mover_foco) {
      /* Da la vuelta por los dos lados */
      actual = (i + diapos.length) % diapos.length;

      Array.prototype.forEach.call(diapos, function (d, n) {
        var activa = n === actual;
        d.hidden = !activa;
        d.classList.toggle('es-activa', activa);
      });

      Array.prototype.forEach.call(puntos, function (p, n) {
        var activo = n === actual;
        p.classList.toggle('es-activo', activo);
        p.setAttribute('aria-selected', activo ? 'true' : 'false');
      });

      if (mover_foco && puntos[actual]) { puntos[actual].focus(); }

      try { sessionStorage.setItem(CLAVE, String(actual)); } catch (e) {}

      /* Las entradas al hacer scroll ya se dispararon en la diapositiva que
         estaba visible. La que entra ahora nunca fue observada, asi que se
         marca como visible a mano o se quedaria en blanco. */
      diapos[actual].querySelectorAll('.d2-entra').forEach(function (el) {
        el.classList.add('es-visible');
        el.style.transitionDelay = '0ms';
      });
    }

    Array.prototype.forEach.call(puntos, function (p, n) {
      p.addEventListener('click', function () { mostrar(n); });
    });

    Array.prototype.forEach.call(flechas, function (f) {
      f.addEventListener('click', function () {
        mostrar(actual + parseInt(f.getAttribute('data-caru-ir'), 10));
      });
    });

    /* Teclado: como cualquier grupo de pestañas */
    caja.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
      if (!e.target.closest('.d2-caru__mandos')) { return; }
      e.preventDefault();
      mostrar(actual + (e.key === 'ArrowRight' ? 1 : -1), true);
    });

    /* Arrastre en movil. Solo se hace caso a un gesto claramente horizontal:
       si no, al bajar por la pagina con el dedo cambiaria de opcion sin
       querer. */
    var x0 = null, y0 = null;

    caja.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });

    caja.addEventListener('touchend', function (e) {
      if (x0 === null) { return; }
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      x0 = y0 = null;

      if (Math.abs(dx) < 45) { return; }          /* muy corto: no cuenta */
      if (Math.abs(dx) < Math.abs(dy) * 1.4) { return; }  /* iba hacia abajo */

      mostrar(actual + (dx < 0 ? 1 : -1));
    }, { passive: true });

    mostrar(actual);
  });
})();
