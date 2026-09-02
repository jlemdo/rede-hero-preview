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

  /* Una instancia por cada .calc: las variantes del carrusel son copias
     independientes y cada una lleva su propio estado. El codigo de dentro
     ya buscaba todo con `seccion.querySelector`, asi que basta con
     envolverlo. */
  var calculadoras = document.querySelectorAll('.calc');
  if (!calculadoras.length) { return; }

  Array.prototype.forEach.call(calculadoras, function (seccion) {

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

    if (typeof refrescarPerfil === 'function') { refrescarPerfil(); }

    /* Las variantes que muestran los cuatro campos a la vez no llevan barra
       de progreso ni contador: no hay pasos que contar. Sin esta guarda el
       modulo se caia ahi y dejaba la calculadora muerta. */
    if (barra) {
      barra.style.width = (estado.paso / TOTAL * 100) + '%';
      if (barra.parentElement) {
        barra.parentElement.setAttribute('aria-valuenow', estado.paso);
      }
    }
    if (contador) { contador.textContent = estado.paso; }

    btnAtras.hidden = estado.paso === 1;
    btnTexto.textContent = estado.paso === TOTAL ? 'Show benchmark result' : 'Next';
  }

  function siguiente() {
    // El paso 1 necesita una eleccion; si no la hay, se asume portafolio
    if (estado.paso === 1 && !estado.scope) { elegirScope('multi'); }

    /* Si la variante muestra los cuatro campos a la vez no hay pasos que
       recorrer: el boton calcula directamente. Sin esto pedia cuatro clics
       para avanzar por pantallas que ya estaban visibles. */
    if (seccion.querySelector('[data-abierto]')) {
      estado.paso = TOTAL;
      calcular();
      return;
    }

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

  /* --- Panel vivo: se llena con cada respuesta ---------------------------- */

  function fila(clave) { return seccion.querySelector('[data-fila="' + clave + '"]'); }

  function ponerFila(clave, valor) {
    var f = fila(clave);
    if (!f) { return; }
    f.querySelector('.perfil__valor').textContent = valor;
    f.classList.add('is-lleno');
  }

  function milesTxt(n) {
    if (!n) { return ''; }
    if (n >= 1000000) { return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M sq ft'; }
    if (n >= 1000)    { return Math.round(n / 1000) + 'K sq ft'; }
    return n + ' sq ft';
  }

  var TXT_SECTOR = {
    k12: 'K-12 school district',
    postsec: 'Post-secondary',
    health: 'Healthcare',
    muni: 'Municipality',
    commercial: 'Commercial property',
    housing: 'Housing operator',
    other: 'Institutional'
  };

  var TXT_PROV = { bc: 'BC', ca: 'Canada' };

  function refrescarPerfil() {
    if (estado.scope) {
      ponerFila('scope', estado.scope === 'single' ? 'One building' : 'Multiple buildings');
    }

    var sector = $('#c-sector').value;
    var prov   = $('#c-province').value;
    if (sector) {
      var txt = TXT_SECTOR[sector] || 'Organization';
      if (TXT_PROV[prov]) { txt += ', ' + TXT_PROV[prov]; }
      ponerFila('sector', txt);
    }

    /* Basta con que haya tipo elegido. Antes se exigia ademas estar en el
       paso 3, pero las variantes abiertas no recorren pasos: el tipo se
       quedaba sin rellenar y el contador atascado en 3 de 4. */
    var clave = selTipo.value;
    if (clave) {
      var b = BENCHMARKS[clave];
      ponerFila('tipo', b.label);

      // Adelanto del benchmark: recompensa parcial antes del resultado
      var adelanto = $('#adelanto');
      $('#adelanto-pct').textContent = b.savingsPct.toFixed(1);
      $('#adelanto-txt').textContent =
        'average historical cost reduction for ' + b.label.toLowerCase() + ' buildings';
      adelanto.hidden = false;
      $('#prueba').hidden = true;   // el dato propio sustituye a la prueba social
    }

    var area = numero($('#c-area').value);
    if (area) { ponerFila('area', milesTxt(area)); }

    /* El perfil recoge TODO lo que el formulario sabe, no solo cuatro
       campos: sirve de vista rapida completa. ponerFila ya ignora las
       filas que un diseño no tenga. */
    var gastoPerfil = numero($('#c-spend').value);
    if (gastoPerfil) { ponerFila('spend', dinero(gastoPerfil)); }

    var sitiosPerfil = numero($('#c-sites').value);
    if (sitiosPerfil) {
      ponerFila('sites', sitiosPerfil === 1 ? '1 site' : sitiosPerfil + ' sites');
    }

    var listas = seccion.querySelectorAll('.perfil__fila.is-lleno').length;
    var totalFilas = seccion.querySelectorAll('.perfil__fila').length;
    $('#etiqueta-progreso').textContent = listas + ' of ' + totalFilas;
  }


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
      /* Solo marca la eleccion. Antes saltaba de paso a los 220ms, y eso
         incumple WCAG 3.2.2: quien recorre las opciones con el teclado
         cambia la seleccion al pasar por ellas y se encontraba en otra
         pantalla sin haberlo pedido.

         El flujo no cambia: se avanza con el boton Next, que ya estaba
         ahi y ahora es el unico camino. */
      elegirScope(o.dataset.scope);

      /* Sin esto la fila Scope no aparecia hasta tocar otro campo, y daba
         la sensacion de que el clic no habia hecho nada. */
      refrescarPerfil();
    });
  });

  // Selector de region: dos botones en lugar de un desplegable
  seccion.querySelectorAll('.duo__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      seccion.querySelectorAll('.duo__btn').forEach(function (o) {
        var activa = o === b;
        o.classList.toggle('is-elegida', activa);
        o.setAttribute('aria-checked', String(activa));
      });
      $('#c-province').value = b.dataset.prov;
      refrescarPerfil();
    });
  });

  // Cada cambio en un campo actualiza el panel derecho al momento
  ['#c-sector', '#c-province', '#c-type', '#c-area', '#c-spend', '#c-sites'].forEach(function (sel) {
    var el = $(sel);
    if (!el) { return; }
    el.addEventListener('change', refrescarPerfil);
    el.addEventListener('input', refrescarPerfil);
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

    /* Sin superficie ni gasto no hay nada que calcular. Mostrar "$0" haria
       dudar del metodo, asi que se pide el dato que falta. */
    var hayDatos = gastoFinal > 0;

    $('#cifra').textContent = hayDatos ? dinero(oportunidad) : 'Add your area';
    $('#cifra').classList.toggle('es-incompleto', !hayDatos);
    $('#etiqueta-tipo').textContent = b.label;
    $('#d-tipo').textContent = b.label;
    $('#d-pct').textContent = b.savingsPct.toFixed(1) + ' per cent';
    $('#d-payback').textContent = b.payback + ' years';

    $('#cifra-nota').textContent = !hayDatos
      ? 'Enter your total area or annual utility spend and we will estimate the opportunity.'
      : (gasto
        ? 'in annual opportunity, based on your entered utility spend'
        : 'in annual opportunity, estimated from historical cost per square foot');

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

    // El resultado pasa a la IZQUIERDA, donde estaban las preguntas.
    $('#cierre-cifra').textContent = dinero(oportunidad);
    $('#cierre-nota').textContent = gasto
      ? 'in annual opportunity, based on your entered utility spend'
      : 'in annual opportunity, estimated from historical cost per square foot';
    $('#c-d-tipo').textContent = b.label;
    $('#c-d-pct').textContent = b.savingsPct.toFixed(1) + ' per cent';
    $('#c-d-payback').textContent = b.payback + ' years';
    $('#c-rec-titulo').textContent = $('#rec-titulo').textContent;
    $('#c-rec-texto').textContent = $('#rec-texto').textContent;

    $('#pasos').hidden = true;
    $('#cierre').hidden = false;

    // Y la DERECHA pasa a ser el formulario, sin tener que girar la tarjeta.
    if (flip) { flip.classList.add('girada'); marcarInerte(true); }
  }

  /* --- Reiniciar ---------------------------------------------------------- */

  var btnReiniciar = $('#btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', function () {
      estado.paso = 1;
      estado.scope = '';

      ['#c-area', '#c-spend', '#c-sites'].forEach(function (sel) {
        var el = $(sel); if (el) { el.value = ''; }
      });
      $('#c-sector').value = '';
      $('#c-province').value = 'bc';
      selTipo.value = 'school';

      seccion.querySelectorAll('.opcion').forEach(function (o) {
        o.classList.remove('is-elegida');
      });
      seccion.querySelectorAll('.perfil__fila').forEach(function (f) {
        f.classList.remove('is-lleno');
        f.querySelector('.perfil__valor').textContent = '-';
      });

      $('#adelanto').hidden = true;
      $('#prueba').hidden = false;
      $('#salida').hidden = true;
      $('#espera').hidden = false;
      $('#cierre').hidden = true;
      $('#cierre-extra').hidden = true;
      $('#pasos').hidden = false;

      if (flip) { flip.classList.remove('girada', 'enviado'); }
      pintarPaso();
    });
  }

  /* --- Giro de la tarjeta ------------------------------------------------- */

  var flip = seccion.querySelector('[data-flip-panel]');
  if (!flip) { return; }

  var caraFrente = flip.querySelector('.flip__cara--frente');
  var caraDorso  = flip.querySelector('.flip__cara--dorso');
  var btnAbrir   = flip.querySelector('[data-flip="abrir"]');
  var btnCerrar  = flip.querySelector('[data-flip="cerrar"]');   // puede no existir

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

    // Solo ahora aparecen el contacto directo y el reinicio
    var extra = $('#cierre-extra');
    if (extra) { extra.hidden = false; }

    // Respaldo para navegadores sin :has() (Safari < 15.4, Firefox antiguo)
    if (flip) { flip.classList.add('enviado'); }
  });

    pintarPaso();
  });

})();
