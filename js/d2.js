/* ==========================================================================
   DISEÑO 2 — MOVIMIENTO

   La referencia analizada no usa ninguna libreria de animacion: son
   waypoints que anaden una clase al entrar en pantalla, y esa clase dispara
   la transicion.

   Aqui se reproduce con IntersectionObserver. Sin dependencias, que es lo
   que pide esta maqueta.

   El marquee de logos NO lleva JavaScript: es CSS puro.
   ========================================================================== */

(function () {
  'use strict';

  /* Si el usuario pidio menos movimiento, no se anima nada.
     Los elementos ya son visibles por CSS. */
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var elementos = document.querySelectorAll('.d2-entra');
  if (!elementos.length) { return; }

  if (sinMovimiento || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(elementos, function (el) {
      el.classList.add('es-visible');
    });
    return;
  }

  /* Escalonado dentro de cada bloque: los hermanos entran uno tras otro,
     no todos a la vez. Es lo que da la sensacion de secuencia. */
  var RETARDO = 90;

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) { return; }

      var el = entrada.target;
      var hermanos = el.parentElement
        ? el.parentElement.querySelectorAll(':scope > .d2-entra')
        : [el];
      var posicion = Array.prototype.indexOf.call(hermanos, el);

      el.style.transitionDelay = (Math.max(0, posicion) * RETARDO) + 'ms';
      el.classList.add('es-visible');

      /* Una vez visible, deja de observarse: no se repite al volver a subir */
      observador.unobserve(el);
    });
  }, {
    /* Se dispara un poco antes de que el elemento llegue del todo */
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  Array.prototype.forEach.call(elementos, function (el) {
    observador.observe(el);
  });
})();
