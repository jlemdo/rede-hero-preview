# -*- coding: utf-8 -*-
"""
Construye la BIBLIOTECA DE SECCIONES.

La idea: no borrar nada. Cada variante se guarda como pieza independiente
--marcado, CSS y JS-- para poder recolocarla en otra pagina o rescatarla
mas adelante.

No es un backup del archivo: es un backup POR SECCION, que es lo que hace
falta cuando quieres mover una pieza de sitio.

Como decide que CSS pertenece a cada variante: por prefijo de clase. Cada
variante tiene el suyo (.d2-prob-mapa, .d2-faq-acord...), asi que se extraen
todas las reglas cuyo selector lo mencione, EN ORDEN, incluidas las que
estan dentro de @media.
"""
import io, os, re, json

BASE = u'C:/Users/jlelp/Desktop/Erick Elementa/Rede Energy/rede-hero-preview'
LIB  = os.path.join(BASE, 'secciones')

# --- La estructura real, verificada en el navegador ---
SECCIONES = [
    ('hero',     'Hero',                 [('d2-hero',           'Original'),
                                          ('d2-hero',           'Smaller panel'),
                                          ('d2-hero',           'Translucent')]),
    ('logos',    'Client logos',         [('d2-logos',          'Marquee'),
                                          ('d2-logos--dos',     'Three blocks'),
                                          ('d2-foco',           'Spotlight')]),
    ('problema', 'The problem',          [('d2-prob-tri',       'Triptych'),
                                          ('d2-prob-lec',       'Readings'),
                                          ('d2-prob-comp',      'Comparison'),
                                          ('d2-prob-mapa',      'Map')]),
    ('calc',     'Calculator',           [('calc',              'Panel'),
                                          ('calc',              'Split'),
                                          ('calc',              'Steps')]),
    ('rutas',    'Solution routes',      [('d2-rutas-sel',      'Self-select'),
                                          ('d2-rutas-esc',      'Ladder'),
                                          ('d2-rutas-cmp',      'Comparison')]),
    ('prueba',   'Proof',                [('d2-prueba-reg',     'Record'),
                                          ('d2-prueba-resp',    'Backed'),
                                          ('d2-prueba-rec',     'Timeline')]),
    ('resenas',  'Reviews',              [('d2-res-tres',       'Three'),
                                          ('d2-res-ed',         'Editorial')]),
    ('equipo',   'Team',                 [('d2-equipo-ficha',   'Cards'),
                                          ('d2-equipo-dosier',  'Dossier'),
                                          ('d2-equipo-firma',   'Signature')]),
    ('faq',      'Questions',            [('d2-faq-abierto',    'Open'),
                                          ('d2-faq-acord',      'Accordion'),
                                          ('d2-faq-rol',        'By role')]),
    ('cta',      'Call to action',       [('d2-cta-bal',        'Balanced'),
                                          ('d2-cta-con',        'Continuity'),
                                          ('d2-cta-car',        'Two lanes')]),
    ('footer',   'Footer',               [('d2-pie-dir',        'Directory'),
                                          ('d2-pie-desp',       'Contact-first'),
                                          ('d2-pie-cierre',     'Closing')]),
]

# JS que necesita cada seccion. Verificado leyendo que busca cada archivo.
JS_DE = {
    'logos':    ['js/d2-foco.js'],
    'problema': ['js/d2-mapa-cartera.js'],
    'calc':     ['js/main.js', 'js/d2-calc-vivo.js'],
    'resenas':  ['js/d2-resenas.js'],
    'faq':      ['js/d2-faq.js'],
}


def leer(p):
    return io.open(os.path.join(BASE, p), encoding='utf-8').read()


def reglas_css(texto, prefijo):
    """Devuelve las reglas cuyo selector menciona el prefijo, en orden.

    Recorre carácter a carácter contando llaves, porque los @media anidan y
    una expresión regular se pierde con ellos.

    La coincidencia incluye los sufijos BEM --__elemento y --modificador--
    porque si no, .d2-equipo-ficha traeria solo la regla de la seccion y
    dejaria fuera .d2-equipo-ficha__marco y todas las piezas internas. El
    CSS archivado quedaba incompleto y no servia para recolocar nada.
    """
    fuera = []
    i, n = 0, len(texto)

    while i < n:
        # comentario
        if texto.startswith(u'/*', i):
            fin = texto.find(u'*/', i + 2)
            i = (fin + 2) if fin > 0 else n
            continue

        llave = texto.find(u'{', i)
        if llave < 0:
            break

        selector = texto[i:llave]
        # el comentario que precede al selector viaja con la regla
        sel_limpio = re.sub(r'/\*.*?\*/', u'', selector, flags=re.S).strip()

        # cerrar el bloque contando llaves
        prof, j = 1, llave + 1
        while j < n and prof:
            if texto[j] == u'{':
                prof += 1
            elif texto[j] == u'}':
                prof -= 1
            j += 1

        bloque = texto[i:j]

        if sel_limpio.startswith(u'@media') or sel_limpio.startswith(u'@supports'):
            # dentro puede haber reglas nuestras: se recorta el interior
            interior = texto[llave + 1:j - 1]
            dentro = reglas_css(interior, prefijo)
            if dentro:
                fuera.append(sel_limpio + u' {\n' + u'\n'.join(dentro) + u'\n}')
        elif re.search(r'(?<![\w-])' + re.escape(prefijo) + r'(?:__[\w-]+|--[\w-]+)?(?![\w-])', sel_limpio):
            fuera.append(bloque.strip())

        i = j

    return fuera


def main():
    if not os.path.isdir(LIB):
        os.makedirs(LIB)

    html = leer('home-d2.html')

    hojas = [('css/tokens.css', leer('css/tokens.css')),
             ('css/style.css', leer('css/style.css')),
             ('css/d2.css', leer('css/d2.css')),
             ('css/d2-variantes.css', leer('css/d2-variantes.css'))]

    # localizar cada carrusel y sus diapositivas
    indice = []

    for slug, titulo, variantes in SECCIONES:
        cid = u'caru-' + slug
        ini = html.find(u'<div class="d2-caru" id="' + cid + u'"')
        if ini < 0:
            print(u'  ! no encontrado: ' + cid)
            continue

        # el final es el siguiente carrusel, o los mandos de este
        sig = html.find(u'<div class="d2-caru" id="', ini + 10)
        bloque = html[ini:sig if sig > 0 else len(html)]

        # partir por diapositiva
        partes = re.split(r'(?=<div class="d2-caru__diapo)', bloque)
        diapos = [p for p in partes if p.startswith(u'<div class="d2-caru__diapo')]

        carpeta = os.path.join(LIB, slug)
        if not os.path.isdir(carpeta):
            os.makedirs(carpeta)

        vs = []
        for i, (prefijo, nombre) in enumerate(variantes):
            if i >= len(diapos):
                break

            # el marcado, recortando el div de la diapositiva
            d = diapos[i]
            corte = d.rfind(u'</div>')
            marcado = d[d.find(u'>') + 1:corte].strip()

            # el CSS de esa variante, de todas las hojas
            css_partes = []
            for nombre_hoja, texto in hojas:
                rs = reglas_css(texto, u'.' + prefijo)
                if rs:
                    css_partes.append(u'/* --- de ' + nombre_hoja + u' --- */\n\n' + u'\n\n'.join(rs))

            base_nombre = u'%02d-%s' % (i + 1, re.sub(r'[^a-z0-9]+', '-', nombre.lower()).strip('-'))

            io.open(os.path.join(carpeta, base_nombre + u'.html'), 'w', encoding='utf-8').write(
                u'<!-- ' + titulo + u' / ' + nombre + u'\n'
                u'     Clase raiz: .' + prefijo + u'\n'
                u'     Extraido de home-d2.html. El CSS va en ' + base_nombre + u'.css -->\n\n'
                + marcado + u'\n')

            io.open(os.path.join(carpeta, base_nombre + u'.css'), 'w', encoding='utf-8').write(
                u'/* ' + titulo + u' / ' + nombre + u'\n'
                u'   Reglas cuyo selector menciona .' + prefijo + u', en el orden original.\n'
                u'   Usa tokens del sistema: hay que cargar css/tokens.css antes. */\n\n'
                + (u'\n\n'.join(css_partes) if css_partes else u'/* sin reglas propias */') + u'\n')

            vs.append({'n': i + 1, 'nombre': nombre, 'clase': prefijo,
                       'archivo': base_nombre, 'css_reglas': sum(len(p.split(u'\n\n')) for p in css_partes)})

        indice.append({'slug': slug, 'titulo': titulo, 'variantes': vs,
                       'js': JS_DE.get(slug, [])})
        print(u'  %-10s %d variantes' % (slug, len(vs)))

    io.open(os.path.join(LIB, 'indice.json'), 'w', encoding='utf-8').write(
        json.dumps(indice, indent=2, ensure_ascii=False))

    return indice


if __name__ == '__main__':
    print(u'Construyendo la biblioteca...\n')
    idx = main()
    print(u'\nTotal: %d variantes archivadas' % sum(len(s['variantes']) for s in idx))
