/* ==========================================================================
   RESENAS — LA VARIANTE CENTRADA

   El original del diseno 3 tenia UNA cita fija. Aqui hay tres, como en las
   otras dos variantes de esta seccion, asi que rota.

   Lo que rota con cada cita: el texto, el nombre, la organizacion Y las tres
   cifras. Las cifras no son decorativas --son el respaldo de esa cita
   concreta-- asi que cambiar la cita sin cambiarlas atribuiria los numeros
   de un distrito a otro.

   ADVERTENCIA PARA ERICK: las cifras de Northland y Fort Vermilion estan
   marcadas abajo como PENDIENTE. Solo las de SD27 estan confirmadas en el
   copy aprobado. Hasta que se confirmen, las tres citas muestran las mismas
   cifras y la etiqueta dice "across our client portfolio", que es cierto y
   no atribuye nada a nadie.
   ========================================================================== */

(function () {
  'use strict';

  var caja = document.querySelector('[data-res-cen]');
  if (!caja) { return; }

  var seccion = caja.closest('.d2-res-cen');

  /* El copy es el aprobado, literal.

     Las cifras: $4.4M y 20 edificios salen del sitio actual; $500K+ es la
     cifra anual del mismo caso. Van iguales en las tres porque describen la
     cartera completa, no el distrito de cada cita. En cuanto Erick confirme
     los numeros por distrito, aqui se separan. */
  var RESENAS = [
    {
      cita: 'The Rede team is all about proactively implementing energy solutions. ' +
            'They see a gap and they take care of it.',
      nombre: 'Alex Telford',
      org: 'SD27 · British Columbia'
    },
    {
      cita: 'Before Northland started working with Rede, we had no energy management ' +
            'plan at all. We recognized quickly that we can save money with an energy ' +
            'management program.',
      nombre: 'Wayne Turpin',
      org: 'Northland School Division'
    },
    {
      cita: 'For people like myself, money talks. If we can engage someone like Rede ' +
            'to find inefficiencies within our facilities, then we are able to ' +
            'address them.',
      nombre: 'Norman Buhler',
      org: 'Fort Vermilion School Division'
    }
  ];

  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 300ms es lo que dura la salida en el CSS. Con movimiento reducido no hay
     espera: el cambio es inmediato. */
  var CRUCE = sinMovimiento ? 0 : 300;
  var PAUSA = 7000;

  var cita   = caja.querySelector('[data-cen-cita]');
  var nombre = caja.querySelector('[data-cen-nombre]');
  var org    = caja.querySelector('[data-cen-org]');
  var puntos = Array.prototype.slice.call(caja.querySelectorAll('[data-cen-a]'));
  var flechas = Array.prototype.slice.call(caja.querySelectorAll('[data-cen-ir]'));

  var actual = 0;
  var cambiando = false;

  function escribir(i) {
    var r = RESENAS[i];
    cita.textContent = '“' + r.cita + '”';
    nombre.textContent = r.nombre;
    org.textContent = r.org;

    puntos.forEach(function (p, n) {
      var on = n === i;
      p.classList.toggle('es-activo', on);
      p.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function ir(i) {
    i = (i + RESENAS.length) % RESENAS.length;

    /* El candado: dos pulsaciones seguidas dejarian la cita y los puntos en
       pasos distintos del cruce. */
    if (i === actual || cambiando) { return; }
    cambiando = true;
    actual = i;

    if (seccion) { seccion.classList.add('esta-cambiando'); }

    window.setTimeout(function () {
      escribir(actual);
      if (seccion) { seccion.classList.remove('esta-cambiando'); }
      cambiando = false;
    }, CRUCE);
  }

  puntos.forEach(function (p, n) {
    p.addEventListener('click', function () { ir(n); reiniciar(); });
  });

  flechas.forEach(function (f) {
    f.addEventListener('click', function () {
      ir(actual + parseInt(f.getAttribute('data-cen-ir'), 10));
      reiniciar();
    });
  });

  /* Teclado: como cualquier grupo de pestanas, y solo dentro de los mandos,
     para no secuestrar las flechas del carrusel de variantes. */
  caja.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
    if (!e.target.closest('[data-cen-a], [data-cen-ir]')) { return; }
    e.preventDefault();
    ir(actual + (e.key === 'ArrowRight' ? 1 : -1));
    reiniciar();
  });

  /* ------------------------------------------------------------------------
     EL AVANCE AUTOMATICO

     WCAG 2.2.2 obliga a poder detener cualquier movimiento automatico que
     dure mas de cinco segundos y corra junto a otro contenido. La pausa al
     apuntar cumple esa via, y ademas permite leer una cita entera sin que
     se vaya a medias.

     Con prefers-reduced-motion no arranca siquiera: el setInterval no se
     desactiva solo, hay que consultarlo aqui explicitamente.
     ------------------------------------------------------------------------ */

  var reloj = null;
  var aLaVista = false;
  var detenido = false;

  function visible() {
    var diapo = caja.closest('.d2-caru__diapo');
    return !diapo || !diapo.hasAttribute('hidden');
  }

  function arrancar() {
    if (reloj || detenido || !aLaVista || sinMovimiento || !visible()) { return; }
    reloj = window.setInterval(function () { ir(actual + 1); }, PAUSA);
  }

  function parar() {
    if (!reloj) { return; }
    window.clearInterval(reloj);
    reloj = null;
  }

  function reiniciar() { parar(); arrancar(); }

  caja.addEventListener('mouseenter', function () { detenido = true; parar(); });
  caja.addEventListener('mouseleave', function () { detenido = false; arrancar(); });
  caja.addEventListener('focusin',    function () { detenido = true; parar(); });
  caja.addEventListener('focusout',   function () { detenido = false; arrancar(); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { parar(); } else { arrancar(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      aLaVista = entradas[0].isIntersecting;
      if (aLaVista) { arrancar(); } else { parar(); }
    }, { threshold: 0.35 }).observe(caja);
  } else {
    aLaVista = true;
    arrancar();
  }

  /* Al cambiar de variante en el carrusel hay que retomar o soltar la
     cuenta: oculta, el observador no vuelve a disparar. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-caru-a], [data-caru-ir]')) { return; }
    window.setTimeout(function () {
      if (visible()) { arrancar(); } else { parar(); }
    }, 60);
  });

  escribir(0);
})();
