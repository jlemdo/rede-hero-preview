/* ==========================================================================
   MAPA DE BARRIOS — LA VARIANTE SOBRE PLANO

   Mismo gesto que el mapa de cartera --rota sola, se fija al senalar, solo
   gira mientras se ve-- sobre once sitios en vez de cinco.

   POR QUE UN MODULO APARTE Y NO UN PARAMETRO DEL OTRO

   El de cartera busca su raiz con [data-mapa-cartera] y escribe en los
   [data-mapa-*] de su ficha. Anadir aqui esos mismos gancho habria hecho
   que los dos modulos se pisaran cuando las dos variantes conviven en la
   pagina: el primero en cargar se quedaria con las burbujas del segundo.
   Con ganchos propios --[data-mapa-zonas] y [data-zonas-*]-- cada uno ve
   solo lo suyo.

   El orden de rotacion no es el del documento sino el de DESVIACION, de
   mayor a menor: la primera que se enciende es la que mas merece mirarse.
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

  /* Cifras ilustrativas: el aviso de la esquina lo dice en la propia
     interfaz. Los barrios si son reales --Grande Prairie, Alberta-- y el
     nivel es el que colorea la burbuja, declarado tambien en el marcado. */
  var ZONAS = {
    'railway':         { nombre: 'Railway Industrial', variance: '+26%', intensidad: '214 kWh/m²', potencial: 'High' },
    'summit':          { nombre: 'Summit',             variance: '+21%', intensidad: '188 kWh/m²', potencial: 'High' },
    'mission-heights': { nombre: 'Mission Heights',    variance: '+17%', intensidad: '176 kWh/m²', potencial: 'High' },
    'royal-oaks':      { nombre: 'Royal Oaks',         variance: '+14%', intensidad: '171 kWh/m²', potencial: 'High' },
    'countryside':     { nombre: 'Countryside South',  variance: '+11%', intensidad: '154 kWh/m²', potencial: 'Moderate' },
    'lakeland':        { nombre: 'Lakeland',           variance: '+9%',  intensidad: '142 kWh/m²', potencial: 'Moderate' },
    'stone-ridge':     { nombre: 'Stone Ridge',        variance: '+5%',  intensidad: '128 kWh/m²', potencial: 'Moderate' },
    'creekside':       { nombre: 'Creekside',          variance: '−2%',  intensidad: '112 kWh/m²', potencial: 'Low' },
    'crystal-heights': { nombre: 'Crystal Heights',    variance: '−4%',  intensidad: '104 kWh/m²', potencial: 'Low' },
    'avondale':        { nombre: 'Avondale',           variance: '−6%',  intensidad: '96 kWh/m²',  potencial: 'Low' },
    'westpointe':      { nombre: 'Westpointe',         variance: '−9%',  intensidad: '88 kWh/m²',  potencial: 'Low' }
  };

  /* De mayor desviacion a menor: la rotacion cuenta una historia --primero
     los que hay que mirar-- en vez de recorrer el plano al azar. */
  var ORDEN = ['railway', 'summit', 'mission-heights', 'royal-oaks',
               'countryside', 'lakeland', 'stone-ridge', 'creekside',
               'crystal-heights', 'avondale', 'westpointe'];

  /* 2800 y no los 2500 del mapa de cartera: aqui hay once sitios en vez de
     cinco, y a ese ritmo la vuelta entera se hacia agotadora de seguir. */
  var INTERVALO = 2800;

  var ficha = {
    caja:       mapa.querySelector('[data-zonas-ficha]'),
    titulo:     mapa.querySelector('[data-zonas-titulo]'),
    nombre:     mapa.querySelector('[data-zonas-nombre]'),
    variance:   mapa.querySelector('[data-zonas-variance]'),
    intensidad: mapa.querySelector('[data-zonas-intensidad]'),
    potencial:  mapa.querySelector('[data-zonas-potencial]')
  };

  var actual = 'railway';
  var reloj = null;
  var detenido = false;
  var aLaVista = false;
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrar(id) {
    var d = ZONAS[id];
    if (!d) { return; }
    actual = id;

    Array.prototype.forEach.call(sitios, function (s) {
      s.classList.toggle('es-foco', s.getAttribute('data-zona') === id);
    });

    if (ficha.titulo) {
      ficha.titulo.textContent = d.potencial === 'High' ? 'Priority opportunity' : 'Portfolio reading';
    }
    if (ficha.nombre)     { ficha.nombre.textContent = d.nombre; }
    if (ficha.variance)   { ficha.variance.textContent = d.variance; }
    if (ficha.intensidad) { ficha.intensidad.textContent = d.intensidad; }
    if (ficha.potencial)  { ficha.potencial.textContent = d.potencial; }

    /* Reinicia la entrada de la ficha. El reflow entre medias es necesario:
       sin el, el navegador agrupa los dos cambios y no se ve nada. */
    if (ficha.caja && !sinMovimiento) {
      ficha.caja.style.animation = 'none';
      void ficha.caja.offsetWidth;
      ficha.caja.style.animation = '';
    }
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
