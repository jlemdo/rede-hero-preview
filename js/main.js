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
   OPPORTUNITY CHECK

   Benchmarks historicos de BC Hydro Continuous Optimization por tipo de
   edificio. Vienen del wireframe del cliente, no son inventados.

   La recomendacion final depende del alcance:
     una sola instalacion -> Site Investigation
     varias               -> Energy Gap Analysis
   ========================================================================== */

(function () {
  'use strict';

  var seccion = document.querySelector('.calc');
  if (!seccion) { return; }

  /* --- Benchmarks C-Op ---------------------------------------------------- */

  var BENCHMARKS = {
    extendedCare: { label: 'Extended care',                     costPerFt2: 2.24, savingsPct: 6.7, implementCostFt2: 0.35, payback: 2.4 },
    foodRetail:   { label: 'Food retail',                       costPerFt2: 4.13, savingsPct: 4.5, implementCostFt2: 0.02, payback: 0.1 },
    hospital:     { label: 'Hospital',                          costPerFt2: 2.98, savingsPct: 4.8, implementCostFt2: 0.23, payback: 1.6 },
    largeOffice:  { label: 'Large office',                      costPerFt2: 2.49, savingsPct: 4.2, implementCostFt2: 0.21, payback: 1.9 },
    mediumOffice: { label: 'Medium office',                     costPerFt2: 2.13, savingsPct: 7.0, implementCostFt2: 0.27, payback: 1.8 },
    murb:         { label: 'Multi-unit residential building',   costPerFt2: 0.72, savingsPct: 7.4, implementCostFt2: 0.06, payback: 1.2 },
    nursingHome:  { label: 'Nursing home',                      costPerFt2: 1.92, savingsPct: 4.8, implementCostFt2: 0.23, payback: 2.5 },
    recreation:   { label: 'Recreation',                        costPerFt2: 3.10, savingsPct: 5.7, implementCostFt2: 0.32, payback: 1.8 },
    shoppingMall: { label: 'Shopping mall',                     costPerFt2: 1.95, savingsPct: 2.0, implementCostFt2: 0.07, payback: 1.9 },
    university:   { label: 'University or college',             costPerFt2: 2.03, savingsPct: 7.9, implementCostFt2: 0.28, payback: 1.8 },
    hotel:        { label: 'Hotel',                             costPerFt2: 2.20, savingsPct: 5.2, implementCostFt2: 0.23, payback: 2.0 },
    school:       { label: 'School',                            costPerFt2: 1.00, savingsPct: 9.5, implementCostFt2: 0.17, payback: 1.8 },
    other:        { label: 'Other',                             costPerFt2: 2.18, savingsPct: 5.7, implementCostFt2: 0.21, payback: 1.7 }
  };

  var estado = { paso: 1, scope: '' };
  var TOTAL = 4;

  var $ = function (sel) { return seccion.querySelector(sel); };

  /* --- Rellenar el selector de tipo de edificio --------------------------- */

  var selTipo = $('#c-type');
  Object.keys(BENCHMARKS).forEach(function (clave) {
    var op = document.createElement('option');
    op.value = clave;
    op.textContent = BENCHMARKS[clave].label;
    selTipo.appendChild(op);
  });
  selTipo.value = 'school';   // el sector principal de Rede

  /* --- Navegacion entre pasos -------------------------------------------- */

  var barra    = $('#barra');
  var contador = $('#paso-n');
  var btnAtras = $('#btn-atras');
  var btnSig   = $('#btn-siguiente');
  var btnTexto = $('#btn-texto');

  function pintarPaso() {
    seccion.querySelectorAll('.paso-calc').forEach(function (p) {
      p.classList.toggle('is-activo', Number(p.dataset.paso) === estado.paso);
    });

    barra.style.width = (estado.paso / TOTAL * 100) + '%';
    contador.textContent = estado.paso;
    barra.parentElement.setAttribute('aria-valuenow', estado.paso);

    btnAtras.hidden = estado.paso === 1;
    btnTexto.textContent = estado.paso === TOTAL ? 'Show benchmark result' : 'Next';
  }

  function siguiente() {
    // El paso 1 necesita una eleccion; si no la hay, se asume portafolio
    if (estado.paso === 1 && !estado.scope) { elegirScope('multi'); }

    if (estado.paso < TOTAL) {
      estado.paso += 1;
      pintarPaso();
    } else {
      calcular();
    }
  }

  function atras() {
    if (estado.paso > 1) {
      estado.paso -= 1;
      pintarPaso();
    }
  }

  btnSig.addEventListener('click', siguiente);
  btnAtras.addEventListener('click', atras);

  /* --- Paso 1: uno o varios edificios ------------------------------------- */

  function elegirScope(valor) {
    estado.scope = valor;
    seccion.querySelectorAll('.opcion').forEach(function (o) {
      o.classList.toggle('is-elegida', o.dataset.scope === valor);
    });
    if (valor === 'single') { $('#c-sites').value = '1'; }
  }

  seccion.querySelectorAll('.opcion').forEach(function (o) {
    o.addEventListener('click', function () {
      elegirScope(o.dataset.scope);
      window.setTimeout(siguiente, 220);   // avanza solo tras elegir
    });
  });

  /* --- Utilidades --------------------------------------------------------- */

  function numero(valor) {
    var n = Number(String(valor || '').replace(/[^0-9.]/g, ''));
    return isFinite(n) ? n : 0;
  }

  function dinero(n) {
    if (!isFinite(n) || n <= 0) { return '$0'; }
    return '$' + Math.round(n).toLocaleString('en-CA');
  }

  /* --- El calculo --------------------------------------------------------- */

  function calcular() {
    var clave = selTipo.value || 'other';
    var b = BENCHMARKS[clave] || BENCHMARKS.other;

    var area   = numero($('#c-area').value);
    var gasto  = numero($('#c-spend').value);
    var sitios = numero($('#c-sites').value) || (estado.scope === 'single' ? 1 : 2);

    // Si no indica gasto, se estima con el coste por pie cuadrado del benchmark
    var gastoFinal = gasto || (area ? area * b.costPerFt2 : 0);
    var oportunidad = gastoFinal * (b.savingsPct / 100);

    $('#cifra').textContent = dinero(oportunidad);
    $('#etiqueta-tipo').textContent = b.label;
    $('#d-tipo').textContent = b.label;
    $('#d-pct').textContent = b.savingsPct.toFixed(1) + ' per cent';
    $('#d-payback').textContent = b.payback + ' years';

    $('#cifra-nota').textContent = gasto
      ? 'in annual opportunity, based on your entered utility spend'
      : 'in annual opportunity, estimated from historical cost per square foot';

    // La recomendacion depende del alcance
    var unaSola = estado.scope === 'single' || sitios <= 1;

    if (unaSola) {
      $('#rec-titulo').textContent = 'Recommended next step: Site Investigation';
      $('#rec-texto').textContent =
        'Because this is one building, the clearest next step is a focused review ' +
        'of utility evidence, benchmark context, and building operation.';
      $('#rec-boton').textContent = 'See Site Investigation';
      $('#dorso-titulo').textContent = 'Site Investigation';
    } else {
      $('#rec-titulo').textContent = 'Recommended next step: Energy Gap Analysis';
      $('#rec-texto').textContent =
        'Because this is a portfolio, start with an Energy Gap Analysis. It compares ' +
        'buildings, identifies outliers, and shows which sites deserve attention first.';
      $('#rec-boton').textContent = 'See the EGA path';
      $('#dorso-titulo').textContent = 'Energy Gap Analysis';
    }

    // Guardar el contexto para HubSpot
    var form = seccion.querySelector('[data-hubspot]');
    if (form) {
      var datos = {
        scope: estado.scope || 'multi',
        sector: $('#c-sector').value,
        province: $('#c-province').value,
        building_type: clave,
        area: area || '',
        annual_spend: gastoFinal ? Math.round(gastoFinal) : '',
        sites: sitios,
        benchmark_opportunity: oportunidad ? Math.round(oportunidad) : ''
      };
      Object.keys(datos).forEach(function (k) {
        var campo = form.querySelector('[name="' + k + '"]');
        if (campo) { campo.value = datos[k]; }
      });
    }

    $('#espera').hidden = true;
    $('#salida').hidden = false;
  }

  /* --- Giro de la tarjeta ------------------------------------------------- */

  var flip = document.getElementById('flip');
  if (!flip) { return; }

  var caraFrente = flip.querySelector('.flip__cara--frente');
  var caraDorso  = flip.querySelector('.flip__cara--dorso');
  var btnAbrir   = flip.querySelector('[data-flip="abrir"]');
  var btnCerrar  = flip.querySelector('[data-flip="cerrar"]');

  /* La cara oculta se marca inerte: fuera del recorrido de teclado y de los
     lectores de pantalla. Se usa inert y no visibility, porque esa propiedad
     conmuta de golpe y produce un parpadeo a mitad del giro. */
  function marcarInerte(girada) {
    if (caraDorso)  { caraDorso.inert  = !girada; }
    if (caraFrente) { caraFrente.inert =  girada; }
  }

  function abrir() {
    flip.classList.add('girada');
    if (btnAbrir) { btnAbrir.setAttribute('aria-expanded', 'true'); }
    marcarInerte(true);
    window.setTimeout(function () { if (btnCerrar) { btnCerrar.focus(); } }, 330);
  }

  function cerrar() {
    flip.classList.remove('girada');
    if (btnAbrir) { btnAbrir.setAttribute('aria-expanded', 'false'); }
    marcarInerte(false);
    window.setTimeout(function () { if (btnAbrir) { btnAbrir.focus(); } }, 330);
  }

  if (btnAbrir)  { btnAbrir.addEventListener('click', abrir); }
  if (btnCerrar) { btnCerrar.addEventListener('click', cerrar); }

  flip.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && flip.classList.contains('girada')) { cerrar(); }
  });

  marcarInerte(false);

  /* --- Envio a HubSpot ---------------------------------------------------- */

  var form = seccion.querySelector('[data-hubspot]');
  if (!form) { return; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    // TODO: conectar con HubSpot. Por ahora solo se confirma en pantalla.
    var datos = {};
    new FormData(form).forEach(function (v, k) { datos[k] = v; });
    if (window.console) { console.log('[Rede] Pendiente de enviar a HubSpot:', datos); }

    var caja = document.createElement('div');
    caja.className = 'captura--enviada';
    caja.setAttribute('role', 'status');
    caja.innerHTML =
      '<span class="tic" aria-hidden="true">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none">' +
          '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</span>' +
      '<p class="captura__titulo">Thanks. We will be in touch.</p>' +
      '<p class="captura__texto">Someone from the team will get back to you within ' +
      'one business day.</p>';

    form.replaceWith(caja);
  });

  pintarPaso();

})();
