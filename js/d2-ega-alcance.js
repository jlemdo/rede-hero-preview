/* ==========================================================================
   ALCANCE — LA FICHA DEL LIMITE

   Mismo mecanismo que el FAQ, con otra carga argumental.

   En el FAQ el usuario pregunta y la ficha responde con un dato. Aqui el
   usuario abre un entregable y la ficha responde con SU LIMITE: lo que ese
   entregable concreto NO resuelve, y por que.

   Es el contrato causa-efecto que le faltaba a esta seccion. Las tres
   variantes anteriores eran maquetacion: el visitante no podia hacer nada
   con ellas.

   CASI TODO LO HACE EL HTML

   <details name="d2-ega-piv"> da acordeon exclusivo, teclado y
   accesibilidad sin una linea de JS. Es el mismo patron que el FAQ, que a
   su vez lo tomo de Vercel.

   Esto solo rellena la ficha lateral con los datos del item abierto.

   SIN DATO NO HAY FICHA

   La misma regla del FAQ: si un item no trae data-limite, la ficha se
   oculta. La alternativa seria rellenarla con algo generico, y eso es lo
   que convierte un dato en ruido.

   SI EL GUION NO CORRE

   Cada <details> lleva su limite tambien DENTRO, en su propio <p>. El
   acordeon sigue funcionando y el visitante lee la pareja completa; lo
   unico que se pierde es la ficha lateral. Por eso ese <p> existe aunque
   en escritorio quede oculto: es el contenido de verdad, no un duplicado
   de adorno.
   ========================================================================== */

(function () {
  'use strict';

  var secciones = document.querySelectorAll('.d2-ega-piv');
  if (!secciones.length) { return; }

  Array.prototype.forEach.call(secciones, function (sec) {

    var items = sec.querySelectorAll('.d2-ega-piv__item');
    var caja = sec.querySelector('.d2-ega-piv__ficha');
    if (!items.length || !caja) { return; }

    var limite = caja.querySelector('[data-piv-limite]');
    var razon = caja.querySelector('[data-piv-razon]');
    var interior = caja.querySelector('.d2-ega-piv__ficha-caja');

    var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pintar(item) {
      if (!item) { return; }

      var l = item.getAttribute('data-limite');
      /* Sin dato no hay ficha. Deliberado, igual que en el FAQ. */
      if (!l) {
        if (interior) { interior.hidden = true; }
        return;
      }

      if (interior) { interior.hidden = false; }
      if (limite) { limite.textContent = l; }
      if (razon) { razon.textContent = item.getAttribute('data-razon') || ''; }

      /* Reinicia la entrada. El reflow entre medias es necesario: sin el,
         el navegador agrupa los dos cambios y la animacion no se ve. */
      if (interior && !sinMovimiento) {
        interior.style.animation = 'none';
        void interior.offsetWidth;
        interior.style.animation = '';
      }
    }

    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) { pintar(item); }
      });
    });

    /* El que venga abierto del marcado. */
    pintar(sec.querySelector('.d2-ega-piv__item[open]') || items[0]);
  });
}());
