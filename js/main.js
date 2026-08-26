/* ==========================================================================
   REDE ENERGY — HERO
   Interacción mínima: dropdown, menú móvil, animación del gráfico y contadores.

   Nota para el paso a Elementor:
   - El dropdown y el menú móvil los resuelve el widget nav-menu. Este código NO se porta.
   - La animación del gráfico y los contadores SÍ se portan, como snippet en el
     mu-plugin rede-custom.php. Ver README.md
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. DROPDOWN DE ESCRITORIO
     ---------------------------------------------------------------------- */

  var toggle = document.querySelector('.nav__toggle');
  var drop   = document.getElementById('drop-solutions');

  if (toggle && drop) {
    var abrir = function (estado) {
      toggle.setAttribute('aria-expanded', String(estado));
      drop.hidden = !estado;
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      abrir(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (!drop.hidden && !drop.contains(e.target) && e.target !== toggle) {
        abrir(false);
      }
    });

    // Cerrar con Escape y devolver el foco
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drop.hidden) {
        abrir(false);
        toggle.focus();
      }
    });
  }


  /* ----------------------------------------------------------------------
     2. MENÚ MÓVIL
     ---------------------------------------------------------------------- */

  var burger = document.querySelector('.burger');
  var movil  = document.getElementById('mobile-menu');

  if (burger && movil) {
    burger.addEventListener('click', function () {
      var abierto = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!abierto));
      burger.setAttribute('aria-label', abierto ? 'Open menu' : 'Close menu');
      movil.hidden = abierto;
    });
  }


  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ----------------------------------------------------------------------
     3. ANIMACIÓN DEL GRÁFICO
     Se dispara una vez, cuando el gráfico entra en pantalla.

     La longitud de la línea se MIDE con getTotalLength(), no se inventa.
     Un valor fijo mal calculado deja la línea a medio dibujar.
     ---------------------------------------------------------------------- */

  var chart = document.querySelector('.chart');

  if (chart && !reducido) {
    var linea = chart.querySelector('.chart__linea--rede');

    if (linea && typeof linea.getTotalLength === 'function') {
      var largo = Math.ceil(linea.getTotalLength());
      chart.style.setProperty('--largo', largo);
    }

    if ('IntersectionObserver' in window) {
      var obsChart = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('chart--anima');
            obsChart.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.35 });

      obsChart.observe(chart);

      // Respaldo: si a los 2s el observer no disparó (headless, pestaña en
      // segundo plano, navegador raro), animar igual. Sin esto el gráfico
      // se puede quedar sin dibujar.
      setTimeout(function () {
        if (!chart.classList.contains('chart--anima')) {
          chart.classList.add('chart--anima');
          obsChart.unobserve(chart);
        }
      }, 2000);

    } else {
      chart.classList.add('chart--anima');
    }
  }
  // Si hay movimiento reducido, el gráfico queda en su estado final. No se anima.


  /* ----------------------------------------------------------------------
     4. CONTADORES DE LAS MÉTRICAS
     Cuentan desde 0 hasta el valor de data-contador.
     ---------------------------------------------------------------------- */

  function animarContador(el) {
    var destino   = parseFloat(el.dataset.contador);
    var prefijo   = el.dataset.prefijo || '';
    var sufijo    = el.dataset.sufijo  || '';
    var decimales = parseInt(el.dataset.decimales || '0', 10);
    var unidad    = el.querySelector('.metrica__unidad');
    var htmlUnidad = unidad ? unidad.outerHTML : '';

    if (isNaN(destino)) { return; }

    var duracion = 1400;
    var inicio   = null;

    function paso(ahora) {
      if (inicio === null) { inicio = ahora; }
      var avance = Math.min((ahora - inicio) / duracion, 1);

      // easeOutExpo: rápido al principio, suave al final
      var suave = avance === 1 ? 1 : 1 - Math.pow(2, -10 * avance);
      var valor = (destino * suave).toFixed(decimales);

      el.innerHTML = prefijo + valor + sufijo + (htmlUnidad ? ' ' + htmlUnidad : '');

      if (avance < 1) { requestAnimationFrame(paso); }
    }

    requestAnimationFrame(paso);
  }

  var contadores = document.querySelectorAll('[data-contador]');

  if (contadores.length && !reducido && 'IntersectionObserver' in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          obsNum.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });

    contadores.forEach(function (el) { obsNum.observe(el); });
  }
  // Si hay movimiento reducido o no hay soporte, el HTML ya trae el valor final.

})();


/* ==========================================================================
   CALCULADORA — solo interaccion visual

   NO calcula. La logica real ira en un plugin de WordPress (ver DECISIONES D-02).
   Aqui solo pasan dos cosas:
     1. "Calculate my opportunity" anima los numeros del panel hasta su valor
     2. "Show me where these savings are" gira la tarjeta y muestra el reverso
   ========================================================================== */

(function () {
  'use strict';

  var seccion = document.querySelector('.calc');
  if (!seccion) { return; }

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Formatear al estilo canadiense: 2,400,000 --- */
  function formatear(n, decimales) {
    return n.toLocaleString('en-CA', {
      minimumFractionDigits: decimales || 0,
      maximumFractionDigits: decimales || 0
    });
  }

  /* --- Contar de 0 al valor final --- */
  function contar(el) {
    var destino = parseFloat(el.dataset.num);
    var pre = el.dataset.pre || '';
    if (isNaN(destino)) { return; }

    if (reducido) {
      el.textContent = pre + formatear(destino);
      return;
    }

    var duracion = 1100;
    var inicio = null;

    function paso(ahora) {
      if (inicio === null) { inicio = ahora; }
      var avance = Math.min((ahora - inicio) / duracion, 1);
      var suave = avance === 1 ? 1 : 1 - Math.pow(2, -10 * avance);
      el.textContent = pre + formatear(Math.round(destino * suave));
      if (avance < 1) { requestAnimationFrame(paso); }
    }

    requestAnimationFrame(paso);
  }

  /* --- Giro de la tarjeta --- */
  var flip = document.getElementById('flip');
  var btnAbrir  = flip ? flip.querySelector('[data-flip="abrir"]')  : null;
  var btnCerrar = flip ? flip.querySelector('[data-flip="cerrar"]') : null;

  function abrir() {
    if (!flip) { return; }
    flip.classList.add('girada');
    if (btnAbrir) { btnAbrir.setAttribute('aria-expanded', 'true'); }
    // Llevar el foco al reverso para que el teclado siga el hilo
    window.setTimeout(function () { if (btnCerrar) { btnCerrar.focus(); } }, 380);
  }

  function cerrar() {
    if (!flip) { return; }
    flip.classList.remove('girada');
    if (btnAbrir) { btnAbrir.setAttribute('aria-expanded', 'false'); }
    window.setTimeout(function () { if (btnAbrir) { btnAbrir.focus(); } }, 380);
  }

  if (btnAbrir)  { btnAbrir.addEventListener('click', abrir); }
  if (btnCerrar) { btnCerrar.addEventListener('click', cerrar); }

  /* --- Boton "Calculate my opportunity" --- */
  var btnCalcular = seccion.querySelector('.calc__btn');

  if (btnCalcular) {
    btnCalcular.addEventListener('click', function () {
      // Si la tarjeta esta girada, volver al frente antes de recalcular
      if (flip && flip.classList.contains('girada')) { cerrar(); }

      seccion.querySelectorAll('[data-num]').forEach(function (el) {
        el.textContent = el.dataset.pre || '';   // reiniciar
        contar(el);
      });
    });
  }

  // Escape vuelve al frente
  if (flip) { flip.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && flip.classList.contains('girada')) { cerrar(); }
  }); }

})();
