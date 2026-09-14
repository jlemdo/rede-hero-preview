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

    /* --- El avance automatico ------------------------------------------

       Patron normativo del W3C --APG, Carousel--. Tres detalles que casi
       todas las implementaciones fallan y aqui se respetan:

         1. El boton CAMBIA DE ETIQUETA --Stop / Start--. La guia dice
            explicitamente que el cambio de etiqueta sustituye a
            aria-pressed, no que se usen los dos.

         2. aria-live va en "off" MIENTRAS ROTA y pasa a "polite" al
            parar. En rotacion automatica el lector de pantalla debe
            callar: si no, anuncia un cambio cada 4.5s sin que nadie lo
            haya pedido.

         3. El hover detiene y REANUDA al salir; el foco de teclado
            detiene y NO reanuda solo. La asimetria es deliberada y viene
            de la guia: quien navega con teclado esta leyendo, no
            pasando.

       WCAG 2.2.2 exige el control porque el bucle dura mas de 5s. El
       hover solo no basta.

       Con prefers-reduced-motion arranca PARADO, no solo mas suave: el
       fallo habitual es dejar el temporizador corriendo y suavizar la
       transicion. */

    var TURNO = 4500;
    var boton = sec.querySelector('[data-piv-pausa]');
    var botonEti = sec.querySelector('[data-piv-pausa-eti]');
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

    var reloj = null;
    var parado = quieto.matches;

    function siguiente() {
      var abierto = sec.querySelector('.d2-ega-piv__item[open]');
      var i = Array.prototype.indexOf.call(items, abierto);
      var n = items[(i + 1) % items.length];
      if (n) { n.open = true; }
    }

    function arrancar() {
      if (parado || reloj) { return; }
      reloj = setInterval(siguiente, TURNO);
    }

    function detener() {
      if (reloj) { clearInterval(reloj); reloj = null; }
    }

    function pintarBoton() {
      if (botonEti) { botonEti.textContent = parado ? 'Start' : 'Stop'; }
      if (boton) {
        boton.setAttribute('aria-label',
          parado ? 'Start automatic advance' : 'Stop automatic advance');
      }
      /* En rotacion, la ficha calla. */
      caja.setAttribute('aria-live', parado ? 'polite' : 'off');
      if (parado) { sec.setAttribute('data-piv-parado', ''); }
      else { sec.removeAttribute('data-piv-parado'); }
    }

    if (boton) {
      boton.addEventListener('click', function () {
        parado = !parado;
        pintarBoton();
        if (parado) { detener(); } else { arrancar(); }
      });
    }

    /* El raton detiene mientras esta encima y reanuda al salir. */
    sec.addEventListener('mouseenter', detener);
    sec.addEventListener('mouseleave', function () {
      if (!parado) { arrancar(); }
    });

    /* El foco de teclado detiene y NO reanuda: quien tabula esta
       leyendo. Se marca como parado para que el boton lo refleje. */
    sec.addEventListener('focusin', function () {
      if (parado) { return; }
      parado = true;
      pintarBoton();
      detener();
    });

    /* Fuera de pantalla no tiene sentido gastar turnos. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { arrancar(); } else { detener(); }
        });
      }, { threshold: .25 }).observe(sec);
    } else {
      arrancar();
    }

    pintarBoton();
  });
}());
