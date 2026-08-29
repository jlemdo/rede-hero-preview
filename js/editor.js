/* ==========================================================================
   EDITOR DE TEXTOS

   Doble clic sobre cualquier texto para editarlo. Los estilos no se tocan:
   se edita solo el contenido, nunca el formato.

   Como se activa:
     cualquier-pagina.html?edit=rede

   Donde se guarda:
     - En el navegador (localStorage), asi el cliente ve sus cambios al
       volver y puede seguir donde lo dejo.
     - Se descarga como JSON para pasarlo al equipo.

   Este archivo es TEMPORAL. Desaparece cuando el sitio pase a WordPress.
   ========================================================================== */

(function () {
  'use strict';

  var CLAVE = 'rede';
  var ALMACEN = 'rede-textos';

  var params = new URLSearchParams(window.location.search);
  var modoEdicion = params.get('edit') === CLAVE;

  /* --- Que elementos son editables ---------------------------------------
     Solo texto visible. Se excluye la navegacion, los iconos y todo lo que
     no sea copy. */

  var SELECTOR = [
    'h1', 'h2', 'h3',
    'p:not(.pie__legal)',
    '.eyebrow',
    '.opcion__titulo', '.opcion__texto',
    '.perfil__texto',
    'dt', 'dd',
    '.lista-check li',
    '.nivel__lista li',
    'blockquote',
    '.cita__nombre', '.cita__org',
    '.persona__nombre', '.persona__credenciales', '.persona__cargo',
    '.ruta__tag', '.ruta__titulo',
    '.funcion__titulo',
    '.valor__titulo',
    '.ciclo__nombre',
    '.requisito__texto',
    '.programa__lugar', '.programa__nombre',
    '.tipo__nombre',
    '.pie__titulo',
    '.btn', '.enlace-flecha', '.ruta__link'
  ].join(', ');

  /* --- Identificar cada texto de forma estable ---------------------------
     La ruta en el arbol del documento sirve como identificador: no depende
     del contenido, asi que sobrevive a los cambios de texto. */

  function rutaDe(el) {
    var partes = [];
    while (el && el !== document.body) {
      var padre = el.parentNode;
      if (!padre) { break; }
      var hermanos = Array.prototype.filter.call(padre.children, function (h) {
        return h.tagName === el.tagName;
      });
      var i = hermanos.indexOf(el);
      partes.unshift(el.tagName.toLowerCase() + (i > 0 ? '[' + i + ']' : ''));
      el = padre;
    }
    return partes.join('/');
  }

  function pagina() {
    var f = window.location.pathname.split('/').pop();
    return f && f !== '' ? f : 'index.html';
  }

  /* --- Guardado ----------------------------------------------------------- */

  function leerTodo() {
    try { return JSON.parse(localStorage.getItem(ALMACEN)) || {}; }
    catch (e) { return {}; }
  }

  function guardarTodo(datos) {
    try { localStorage.setItem(ALMACEN, JSON.stringify(datos)); }
    catch (e) { avisar('No se pudo guardar. Puede que el almacenamiento este lleno.'); }
  }

  /* --- Aplicar los textos guardados --------------------------------------
     Esto corre SIEMPRE, en modo edicion o no. Es lo que hace que los
     cambios persistan al recargar. */

  var elementos = Array.prototype.filter.call(
    document.querySelectorAll(SELECTOR),
    function (el) {
      // Solo elementos con texto propio, no contenedores de otros bloques
      if (!el.textContent.trim()) { return false; }
      if (el.querySelector(SELECTOR)) { return false; }
      return true;
    }
  );

  var textosPagina = {};

  /* Los textos publicados mandan sobre los locales: asi todo el mundo ve lo
     mismo, y quien edita no arrastra borradores viejos. */
  function pintarTextos(publicados) {
    var local = leerTodo();
    var p = pagina();
    textosPagina = Object.assign({}, (publicados || {})[p] || {}, local[p] || {});

    elementos.forEach(function (el) {
      var ruta = rutaDe(el);
      if (Object.prototype.hasOwnProperty.call(textosPagina, ruta)) {
        aplicarTexto(el, textosPagina[ruta]);
      }
    });
  }

  if (window.RedeTextos) {
    window.RedeTextos.then(pintarTextos);
  } else {
    pintarTextos({});
  }

  /* Cambia el texto conservando el icono si lo hay.

     Si el elemento tiene hijos con texto (por ejemplo un <span> de color),
     se reemplaza el contenido completo: dejar solo el primer nodo partiria
     la frase. Se pierde el color de esa palabra, que es el precio de poder
     editar la frase entera. */
  function aplicarTexto(el, texto) {
    var svg = el.querySelector('svg');

    if (svg) {
      el.textContent = texto + ' ';
      el.appendChild(svg);
      return;
    }

    el.textContent = texto;
  }

  /* Texto completo, incluidos los hijos, pero sin el contenido de los iconos */
  function textoVisible(el) {
    var copia = el.cloneNode(true);
    Array.prototype.forEach.call(copia.querySelectorAll('svg'), function (s) {
      s.remove();
    });
    return copia.textContent.replace(/\s+/g, ' ').trim();
  }

  function primerNodoTexto(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.trim()) { return n; }
    }
    return null;
  }

  function textoDe(el) {
    return textoVisible(el);
  }

  // Si no estamos editando, aqui termina todo
  if (!modoEdicion) { return; }

  /* ======================================================================
     MODO EDICION
     ====================================================================== */

  document.body.classList.add('modo-edicion');

  var cambios = 0;

  elementos.forEach(function (el) {
    el.classList.add('editable');
    el.setAttribute('title', 'Doble clic para editar');

    el.addEventListener('dblclick', function (e) {
      e.preventDefault();
      e.stopPropagation();
      abrirEdicion(el);
    });
  });

  function abrirEdicion(el) {
    if (el.isContentEditable) { return; }

    var original = textoDe(el);
    var svg = el.querySelector('svg');

    // plaintext-only impide pegar formato: los estilos quedan intactos
    el.setAttribute('contenteditable', 'plaintext-only');
    if (!el.isContentEditable) {
      el.setAttribute('contenteditable', 'true');   // respaldo para Firefox
    }

    el.classList.add('editando');
    if (svg) { el.textContent = original; }   // el icono se repone al cerrar

    el.focus();
    seleccionarTodo(el);

    function cerrar(guardar) {
      el.removeAttribute('contenteditable');
      el.classList.remove('editando');

      var nuevo = el.textContent.trim();

      if (guardar && nuevo && nuevo !== original) {
        var d = leerTodo();
        var p = pagina();
        if (!d[p]) { d[p] = {}; }
        d[p][rutaDe(el)] = nuevo;
        guardarTodo(d);
        cambios++;
        actualizarBarra();
        el.classList.add('editado');
      } else {
        nuevo = original;
      }

      aplicarTexto(el, nuevo);
    }

    el.addEventListener('blur', function () { cerrar(true); }, { once: true });

    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); cerrar(false); el.blur(); }
      // Enter guarda, salvo en parrafos largos donde Shift+Enter hace salto
      if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); el.blur(); }
    });
  }

  function seleccionarTodo(el) {
    var rango = document.createRange();
    rango.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rango);
  }

  /* --- Barra de control --------------------------------------------------- */

  var barra = document.createElement('div');
  barra.className = 'barra-edicion';
  barra.innerHTML =
    '<div class="barra-edicion__info">' +
      '<strong>Edit mode</strong>' +
      '<span>Double-click any text to change it</span>' +
    '</div>' +
    '<div class="barra-edicion__acciones">' +
      '<span class="barra-edicion__cuenta" id="ed-cuenta">No changes yet</span>' +
      '<button type="button" id="ed-publicar">Publish changes</button>' +
      '<button type="button" id="ed-llave" class="es-discreto" ' +
        'title="Set the GitHub token">Key</button>' +
      '<button type="button" id="ed-reset" class="es-riesgo">Reset</button>' +
      '<a href="?" id="ed-salir">Exit</a>' +
    '</div>';
  document.body.appendChild(barra);

  // Contar los cambios ya guardados de esta pagina
  cambios = Object.keys(textosPagina).length;
  actualizarBarra();

  function actualizarBarra() {
    var el = document.getElementById('ed-cuenta');
    if (!el) { return; }
    el.textContent = cambios === 0 ? 'No changes yet'
                   : cambios === 1 ? '1 change saved'
                   : cambios + ' changes saved';
  }

  var btnPublicar = document.getElementById('ed-publicar');

  document.getElementById('ed-llave').addEventListener('click', function () {
    if (window.RedeGitHub && window.RedeGitHub.pedirToken()) {
      avisar('Token saved. You can publish changes now.');
    }
  });

  btnPublicar.addEventListener('click', function () {
    if (!window.RedeGitHub) {
      avisar('Publishing is not available on this page.');
      return;
    }

    if (!window.RedeGitHub.hayToken()) {
      avisar('A GitHub token is needed the first time. Opening the box now.');
      if (!window.RedeGitHub.pedirToken()) { return; }
    }

    var local = leerTodo();
    if (!Object.keys(local).length) {
      avisar('There is nothing new to publish.');
      return;
    }

    btnPublicar.disabled = true;
    btnPublicar.textContent = 'Publishing...';

    // Se combina lo publicado con lo local, para no pisar cambios de otros
    window.RedeGitHub.descargar()
      .then(function (previo) {
        var union = previo.datos || {};
        Object.keys(local).forEach(function (pag) {
          union[pag] = Object.assign({}, union[pag] || {}, local[pag]);
        });
        return window.RedeGitHub.publicar(union);
      })
      .then(function () {
        localStorage.removeItem(ALMACEN);   // ya vive en el repositorio
        btnPublicar.textContent = 'Published';
        avisar('Published. The site updates in about a minute.');
        window.setTimeout(function () {
          btnPublicar.disabled = false;
          btnPublicar.textContent = 'Publish changes';
        }, 2600);
      })
      .catch(function (err) {
        btnPublicar.disabled = false;
        btnPublicar.textContent = 'Publish changes';

        if (err.message === 'sin-token') {
          avisar('No token saved. Use the Key button first.');
        } else if (err.message === 'token-invalido') {
          avisar('The token was rejected. Check it has Contents: read and write.');
        } else {
          avisar('Could not publish: ' + err.message);
        }
      });
  });

  document.getElementById('ed-reset').addEventListener('click', function () {
    if (!window.confirm('This will undo every change on every page. Continue?')) { return; }
    localStorage.removeItem(ALMACEN);
    window.location.reload();
  });

  /* --- Avisos ------------------------------------------------------------- */

  function avisar(texto) {
    var t = document.createElement('div');
    t.className = 'aviso-edicion';
    t.setAttribute('role', 'status');
    t.textContent = texto;
    document.body.appendChild(t);
    window.setTimeout(function () { t.classList.add('se-va'); }, 3200);
    window.setTimeout(function () { t.remove(); }, 3700);
  }

  avisar('Edit mode is on. Double-click any text to change it.');

})();
