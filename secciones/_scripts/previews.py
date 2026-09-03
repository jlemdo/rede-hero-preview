# -*- coding: utf-8 -*-
"""
Genera una vista previa por variante y un indice navegable.

Sin esto la biblioteca es un monton de fragmentos que nadie puede juzgar.
Con esto se abre un archivo y se ve la seccion aislada, funcionando.
"""
import io, os, json, re

BASE = u'C:/Users/jlelp/Desktop/Erick Elementa/Rede Energy/rede-hero-preview'
LIB = os.path.join(BASE, 'secciones')

idx = json.loads(io.open(os.path.join(LIB, 'indice.json'), encoding='utf-8').read())

PLANTILLA = u'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(titulo)s / %(nombre)s</title>

<!-- La biblioteca vive dos niveles por debajo de la raiz -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../css/tokens.css">
<link rel="stylesheet" href="../../css/style.css">
<link rel="stylesheet" href="../../css/d2.css">

<!-- Solo el CSS de esta variante -->
<link rel="stylesheet" href="%(css)s">

<style>
  /* La barra de la vista previa. No forma parte de la seccion. */
  .vp-barra {
    position: sticky; top: 0; z-index: 99;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    padding: 10px 18px;
    font: 600 12px/1.4 "Open Sans", system-ui, sans-serif;
    color: #FFFFFF; background: #333333;
  }
  .vp-barra a { color: #B0E1B7; text-decoration: none; }
  .vp-barra a:hover { text-decoration: underline; }
  .vp-barra code {
    padding: 2px 6px; font-size: 11px;
    background: rgba(255,255,255,.14); border-radius: 3px;
  }
  .vp-sep { opacity: .45; }
  /* Los tokens de composicion, para que la seccion no salga sin fondo */
  .d2 {
    --comp-blanco:#FFFFFF; --comp-gris:#F3F3F3; --comp-negro:#333333;
    --comp-hero:#FFFFFF; --comp-logos:#FFFFFF; --comp-problema:#F3F3F3;
    --comp-calc:#FFFFFF; --comp-rutas:#F3F3F3; --comp-prueba:#FFFFFF;
    --comp-resenas:#F3F3F3; --comp-equipo:#FFFFFF; --comp-faq:#F3F3F3;
    --comp-cta:#333333; --comp-footer:#333333;
  }
</style>
</head>
<body class="d2">

<div class="vp-barra">
  <a href="../indice.html">&larr; Library</a>
  <span class="vp-sep">/</span>
  <strong>%(titulo)s</strong>
  <span class="vp-sep">/</span>
  <span>%(nombre)s</span>
  <span class="vp-sep">|</span>
  <code>.%(clase)s</code>
  <span class="vp-sep">|</span>
  <a href="%(html)s">markup</a>
  <a href="%(css)s">css</a>
</div>

%(marcado)s

%(scripts)s
</body>
</html>
'''

total = 0
for sec in idx:
    carpeta = os.path.join(LIB, sec['slug'])
    scripts = u'\n'.join(
        u'<script src="../../%s"></script>' % j for j in sec['js'])

    for v in sec['variantes']:
        marcado = io.open(os.path.join(carpeta, v['archivo'] + u'.html'),
                          encoding='utf-8').read()
        # quitar el comentario de cabecera del fragmento
        marcado = re.sub(r'^<!--.*?-->\s*', u'', marcado, flags=re.S)

        io.open(os.path.join(carpeta, v['archivo'] + u'.preview.html'),
                'w', encoding='utf-8').write(PLANTILLA % {
                    'titulo': sec['titulo'],
                    'nombre': v['nombre'],
                    'clase': v['clase'],
                    'css': v['archivo'] + u'.css',
                    'html': v['archivo'] + u'.html',
                    'marcado': marcado,
                    'scripts': scripts,
                })
        total += 1

# --- El indice ---
filas = []
for sec in idx:
    tarjetas = u''.join(
        u'<a class="lib-v" href="%s/%s.preview.html">'
        u'<span class="lib-n">%d</span>'
        u'<span class="lib-t">%s</span>'
        u'<code>.%s</code></a>' % (sec['slug'], v['archivo'], v['n'], v['nombre'], v['clase'])
        for v in sec['variantes'])
    js = (u'<p class="lib-js">Needs: %s</p>' %
          u', '.join(u'<code>%s</code>' % j for j in sec['js'])) if sec['js'] else u''
    filas.append(
        u'<section class="lib-s"><h2>%s <small>%d variants</small></h2>%s'
        u'<div class="lib-g">%s</div></section>' % (sec['titulo'], len(sec['variantes']), js, tarjetas))

io.open(os.path.join(LIB, 'indice.html'), 'w', encoding='utf-8').write(u'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rede — section library</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root { --v:#39B54A; --vo:#026F00; --t:#333333; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0 24px 80px;
    font: 400 15px/1.6 "Open Sans", system-ui, sans-serif;
    color: var(--t); background: #FAFAFA;
  }
  header { max-width: 1100px; margin: 0 auto; padding: 56px 0 40px; }
  h1 { margin: 0 0 10px; font-size: 34px; letter-spacing: -.02em; }
  .lead { max-width: 62ch; margin: 0; color: #5C5C5C; }
  .lib-s { max-width: 1100px; margin: 0 auto 44px; }
  .lib-s h2 {
    margin: 0 0 4px; padding-bottom: 10px;
    font-size: 19px; border-bottom: 2px solid var(--v);
  }
  .lib-s h2 small { font-weight: 400; color: #707070; font-size: 13px; }
  .lib-js { margin: 8px 0 0; font-size: 12px; color: #707070; }
  .lib-g {
    display: grid; gap: 12px; margin-top: 16px;
    grid-template-columns: repeat(auto-fill, minmax(228px, 1fr));
  }
  .lib-v {
    display: block; padding: 16px 18px;
    text-decoration: none; color: inherit;
    background: #FFFFFF; border: 1px solid #E4E4E4; border-radius: 8px;
    transition: border-color .15s, transform .15s;
  }
  .lib-v:hover { border-color: var(--v); transform: translateY(-2px); }
  .lib-n {
    display: inline-block; margin-bottom: 6px;
    font-size: 11px; font-weight: 700; color: var(--vo);
  }
  .lib-t { display: block; font-weight: 700; margin-bottom: 6px; }
  code {
    font-size: 11px; color: #5C5C5C;
    padding: 1px 5px; background: #F3F3F3; border-radius: 3px;
  }
</style>
</head>
<body>
<header>
  <h1>Section library</h1>
  <p class="lead">Every section variant built for this site, saved as an independent
  piece: markup, its own CSS, and the scripts it needs. Nothing is deleted — a variant
  that does not fit the home page may fit another one.</p>
</header>
''' + u'\n'.join(filas) + u'''
</body>
</html>
''')

print(u'%d vistas previas + indice.html' % total)
