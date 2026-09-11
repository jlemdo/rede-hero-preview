/* ==========================================================================
   MAPA DE BARRIOS — EL RESALTADO

   Diez sitios sobre el plano real de Grande Prairie. El modulo hace una
   sola cosa: encender uno cada pocos segundos y dejar que el raton o el
   teclado tomen el control.

   QUE YA NO HACE, Y POR QUE

   La primera version escribia una ficha con desviacion, intensidad y
   potencial de ahorro por barrio. Esas cifras eran inventadas, y puestas
   al lado de un mapa real se leen como datos reales: el aviso de "solo
   ilustrativo" no basta cuando todo lo demas --calles, rio, posiciones--
   si es verdad.

   El mapa ahora dice lo unico que puede sostener: donde esta cada sitio y
   cual consume mas. Si llegan datos de verdad, la ficha vuelve.

   El gesto --rota sola, se fija al senalar, solo gira mientras se ve-- es
   el mismo del mapa de cartera.
   ========================================================================== */

(function () {
  'use strict';

  /* El primero que este VISIBLE, no el primero del documento: el mapa
     puede estar dentro de una diapositiva con [hidden] y entonces el
     modulo giraria sobre algo que nadie ve. */
  var mapa = null;
  var candidatos = document.querySelectorAll('[data-mapa-zonas]');
  for (var n = 0; n < candidatos.length; n++) {
    if (!candidatos[n].closest('[hidden]')) { mapa = candidatos[n]; break; }
  }
  if (!mapa) { return; }

  var sitios = mapa.querySelectorAll('[data-zona]');
  if (sitios.length < 2) { return; }

  /* El orden es el del documento, que va de norte a sur: recorrer el mapa
     a saltos marea. No hay una lista de datos aparte porque ya no hay
     datos que mostrar: el id sale del propio marcado. */
  var ORDEN = [];
  Array.prototype.forEach.call(sitios, function (s) {
    ORDEN.push(s.getAttribute('data-zona'));
  });

  /* 2600: con diez sitios, la vuelta entera dura 26 segundos. Mas rapido
     no da tiempo a leer el nombre; mas lento se siente parado. */
  var INTERVALO = 2600;

  var actual = ORDEN[0];
  var reloj = null;
  var detenido = false;
  var aLaVista = false;
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrar(id) {
    actual = id;
    Array.prototype.forEach.call(sitios, function (s) {
      s.classList.toggle('es-foco', s.getAttribute('data-zona') === id);
    });
  }

  function avanzar() {
    mostrar(ORDEN[(ORDEN.indexOf(actual) + 1) % ORDEN.length]);
  }

  function visible() {
    var diapo = mapa.closest('.d2-caru__diapo');
    return !diapo || !diapo.hasAttribute('hidden');
  }

  function arrancar() {
    if (sinMovimiento || detenido || reloj || !aLaVista || !visible()) { return; }
    reloj = window.setInterval(avanzar, INTERVALO);
  }

  function parar() {
    if (!reloj) { return; }
    window.clearInterval(reloj);
    reloj = null;
  }

  Array.prototype.forEach.call(sitios, function (s) {
    var id = s.getAttribute('data-zona');

    function fijar()  { detenido = true;  parar(); mostrar(id); }
    function soltar() { detenido = false; arrancar(); }

    s.addEventListener('mouseenter', fijar);
    s.addEventListener('mouseleave', soltar);
    s.addEventListener('focus', fijar);
    s.addEventListener('blur', soltar);
    s.addEventListener('click', fijar);

    /* Con teclado, Enter y Espacio activan: lleva role="button" */
    s.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fijar();
      }
    });
  });

  /* Con la pestana en segundo plano no hay nadie mirando */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { parar(); } else { arrancar(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      aLaVista = entradas[0].isIntersecting;
      if (aLaVista) { arrancar(); } else { parar(); }
    }, { threshold: 0.25 }).observe(mapa);
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

  mostrar(actual);
})();
