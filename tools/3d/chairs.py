"""14 моделей Wrightson & Vale. Размеры — с сайта (Ш × Г × В, высота сиденья)."""
import sys, json, math
import numpy as np
from lib import *

TUBE = 0.011  # радиус стальной трубы (Ø22 мм)
BUILD = {}
def chair(fn):
    BUILD[fn.__name__] = fn; return fn

def seat_pad(c, w, d, t, top_y, z=0.0, round_xy=0.3, round_z=0.35, name='seat'):
    s = cushion(w, t, d, round_xy, round_z)
    move(s, 0, top_y - t / 2, z)
    return c.add(name, s, 'upholstery')

def x_mirror(pts):
    return [[-p[0], p[1], p[2]] for p in pts]

# ------------------------------------------------------------------ TIDE
@chair
def tide():
    c = Chair('tide')
    W, D, H, SH = .58, .56, .78, .46
    x = W / 2 - TUBE; zf = .24; ya = .625; yb = TUBE
    R = .27; zback = -.31            # спинка: радиус изгиба и положение
    zc = zback + R                   # центр изгиба
    Rt = R + .045                    # труба идёт по задней стороне спинки
    arc = arc_pts(Rt, x, ya, zc)
    zb = arc[0][2]                   # там же задние стойки
    path = [[-x, yb, zb], [-x, yb, zf], [-x, ya, zf]] + arc + [[x, ya, zf], [x, yb, zf], [x, yb, zb]]
    c.add('frame', tube(path, TUBE, .05), STEEL_BLACK)
    for sx in (-1, 1):
        c.add(f'rear_post{sx}', tube([[sx * x, yb, zb], [sx * x, ya, zb]], TUBE, 0), STEEL_BLACK)
        c.add(f'seat_rail{sx}', tube([[sx * x, .37, zf], [sx * x, .37, zb]], TUBE * .8, 0), STEEL_BLACK)
    c.add('floor_back', tube(arc_pts(Rt, x, yb, zc), TUBE * .9, 0, smooth=False), STEEL_BLACK)
    c.add('seat_base', move(trimesh.creation.box(extents=[W - .05, .02, .44]), 0, .38, .01), ('base', '#2a2a2a', .7, 0))
    seat_pad(c, W - .06, .45, .045, .435, .015, .3, .7, 'seat_lower')
    seat_pad(c, W - .07, .44, .065, SH + .02, .015, .3, .7)
    b = cushion(.74, .2, .065, .3, .6, edge=.014)
    channels(b, 0, 9, .005, along=2)
    bend_y(b, R)
    move(b, 0, .665, zback)
    tilt_x(b, 5, (0, .6, zback))
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ PIER
@chair
def pier():
    c = Chair('pier')
    SH = .75; r = .19
    for i, sx in enumerate((-1, 1)):
        # передние ножки
        c.add(f'fleg{i}', leg([sx * .14, SH - .07, .13], [sx * .2, 0, .19], .011, .009), STEEL_BLACK)
        # задние ножки продолжаются вверх и загибаются к спинке
        pts = [[sx * .2, 0, -.2], [sx * .15, SH - .07, -.14], [sx * .17, SH + .12, -.2], [sx * .19, SH + .3, -.17]]
        c.add(f'rleg{i}', tube(pts, .010, .09), STEEL_BLACK)
    c.add('footring', ring([0, .28, 0], .195, .009), STEEL_BLACK)
    c.add('top_ring', ring([0, SH - .075, 0], r + .005, .009), STEEL_BLACK)
    s = cushion(.40, .09, .40, .95, .7); move(s, 0, SH - .02, .0); c.add('seat', s, 'upholstery')
    R = .2
    b = cushion(.62, .11, .07, .3, .7, edge=.014)
    bend_y(b, R)
    move(b, 0, SH + .33, -.2)
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ CASK
@chair
def cask():
    c = Chair('cask')
    W, D, H, SH = .63, .60, .70, .45  # на сайте 830×730 — по фото кресло компактнее; берём фото
    W, D = .62, .58
    # 4 конических ножки с латунными наконечниками
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .19, SH - .1, sz * .17]; bot = [sx * .25, 0.03, sz * .23]
        c.add(f'leg{i}', leg(top, bot, .014, .009), STEEL_BLACK)
        c.add(f'tip{i}', leg(bot, [bot[0], 0, bot[2]], .009, .008), BRASS)
    c.add('ring', ring([0, SH - .105, 0], .27, .007), BRONZE)
    seat = cushion(.56, .12, .54, .85, .45); move(seat, 0, SH - .04, .02); c.add('seat', seat, 'upholstery')
    # спинка-бочка: обнимает сиденье, вертикальные валики
    R = .25
    b = cushion(1.12, .23, .1, .2, .6, edge=.014)
    channels(b, 0, 10, .01, along=2)
    bend_y(b, R)
    move(b, 0, SH + .13, .02 - R)
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ LEAF
@chair
def leaf():
    c = Chair('leaf')
    W, D, H, SH = .52, .56, .84, .46
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .19, SH - .08, sz * .19]; bot = [sx * .23, 0, sz * (.24 if sz > 0 else .26)]
        c.add(f'leg{i}', leg(top, bot, .011, .007), BRONZE)
    # перемычки из ореха
    c.add('stretcher_l', tube([[-.21, .2, .21], [-.21, .2, -.22]], .008, 0), WALNUT)
    c.add('stretcher_r', tube([[.21, .2, .21], [.21, .2, -.22]], .008, 0), WALNUT)
    c.add('stretcher_m', tube([[-.21, .2, 0], [.21, .2, 0]], .008, 0), WALNUT)
    seat = cushion(.50, .1, .48, .5, .45); move(seat, 0, SH - .05, .02); c.add('seat', seat, 'upholstery')
    # спинка-веер: шире вверху, глубокие вертикальные каналы, изогнута
    b = subdivided(cushion(.50, .42, .07, .3, .4, 96))
    v = b.vertices
    t = (v[:, 1] - v[:, 1].min()) / (np.ptp(v[:, 1]))
    v[:, 0] *= .72 + .38 * t  # веер
    v[:, 1] += np.cos(v[:, 0] / .3 * 7 * math.pi) * 0.0  # прямой верх
    b.vertices = v
    channels(b, 0, 6, .016, along=2)
    bend_y(b, .26)
    move(b, 0, SH + .17, -.2)
    tilt_x(b, 10, (0, SH, -.2))
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ DECANT
@chair
def decant():
    c = Chair('decant')
    SH = .75
    for i, a in enumerate(np.radians([45, 135, 225, 315])):
        top = [.17 * math.cos(a), SH - .1, .17 * math.sin(a)]; bot = [.22 * math.cos(a), 0, .22 * math.sin(a)]
        c.add(f'leg{i}', leg(top, bot, .011, .009), STEEL_BLACK)
    c.add('footring', ring([0, .27, 0], .205, .008), BRASS)
    seat = cushion(.44, .11, .44, .95, .45); move(seat, 0, SH - .04, .01); c.add('seat', seat, 'upholstery')
    c.add('piping', move(ring([0, 0, 0], .222, .007), 0, SH - .06, .01), 'piping')
    # низкая спинка, обнимающая бока (полукольцо)
    R = .2
    b = cushion(.86, .2, .07, .25, .6, edge=.014)
    bend_y(b, R)
    move(b, 0, SH + .09, .01 - R)
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ AXIS
@chair
def axis():
    c = Chair('axis')
    SH = .50
    # пятилучевая опора с роликами
    for i in range(5):
        a = math.radians(90 + i * 72)
        end = [.30 * math.cos(a), .07, .30 * math.sin(a)]
        c.add(f'spoke{i}', oval_tube([[0, .1, 0], end], .04, .025, 0), STEEL_BLACK)
        cast = trimesh.creation.cylinder(radius=.025, height=.03, sections=20)
        cast.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, [0, 0, 1]))
        move(cast, end[0], .028, end[2]); c.add(f'castor{i}', cast, RUBBER)
    c.add('gaslift', leg([0, SH - .08, 0], [0, .1, 0], .025, .03), STEEL_BLACK)
    c.add('mech', move(cushion(.22, .04, .24, .2, .3), 0, SH - .08, 0), STEEL_BLACK)
    seat = cushion(.50, .09, .49, .3, .45); move(seat, 0, SH - .02, .02); c.add('seat', seat, 'upholstery')
    # спинка с горизонтальной прострочкой
    b = subdivided(cushion(.47, .56, .07, .3, .45, 96))
    channels(b, 1, 9, .006, along=2)
    bend_y(b, .6)
    move(b, 0, SH + .30, -.25)
    tilt_x(b, 8, (0, SH, -.25))
    c.add('back', b, 'upholstery')
    c.add('back_bar', tube([[0, SH - .06, -.05], [0, SH - .06, -.26], [0, SH + .12, -.29]], .012, .05), STEEL_BLACK)
    for sx in (-1, 1):
        x = sx * .27
        c.add(f'arm{sx}', tube([[sx * .2, SH - .05, -.05], [x, SH - .02, -.02], [x, SH + .2, -.0], [x, SH + .2, .2]], .009, .04), STEEL_BLACK)
        c.add(f'armpad{sx}', move(cushion(.035, .025, .2, .3, .3), x, SH + .215, .1), WALNUT)
    return c

# ------------------------------------------------------------------ LINEA
@chair
def linea():
    c = Chair('linea')
    W, D, H, SH = .58, .60, .84, .46
    x = .25; zf = .25; zb = -.25; ya = .66
    # консоль: одна труба — полоз спереди, загибается, стойки к сиденью и подлокотники
    for sx in (-1, 1):
        pts = [[sx * x, ya, -.15], [sx * x, ya, .2], [sx * x, SH - .05, .22], [sx * x, .015, .28], [sx * x, .015, zb], ]
        c.add(f'side{sx}', tube(pts, TUBE, .05), STEEL_BLACK)
        c.add(f'armpad{sx}', move(cushion(.035, .025, .24, .3, .3), sx * x, ya + .016, .03), WALNUT)
        c.add(f'brace{sx}', tube([[sx * x, .015, zb], [sx * x, SH - .07, -.08]], TUBE * .9, 0), STEEL_BLACK)
    c.add('floor_bar', tube([[-x, .015, zb], [x, .015, zb]], TUBE * .9, 0), STEEL_BLACK)
    seat = cushion(.48, .08, .48, .3, .45); move(seat, 0, SH - .02, .02); c.add('seat', seat, 'upholstery')
    b = subdivided(cushion(.46, .5, .07, .3, .45, 96))
    channels(b, 1, 8, .006, along=2)
    bend_y(b, .7)
    move(b, 0, SH + .28, -.24)
    tilt_x(b, 9, (0, SH, -.24))
    c.add('back', b, 'upholstery')
    for sx in (-1, 1):
        c.add(f'backpost{sx}', tube([[sx * .2, SH - .05, -.06], [sx * .21, SH - .03, -.24], [sx * .21, ya, -.23], [sx * x, ya, -.15]], TUBE * .9, .05), STEEL_BLACK)
    return c

# ------------------------------------------------------------------ FORUM
@chair
def forum():
    c = Chair('forum')
    W, D, H, SH = .62, .65, .85, .45
    # боковины — прямоугольные рамы из плоской трубы
    for sx in (-1, 1):
        x = sx * .29
        rect = [[x, .015, .27], [x, .62, .27], [x, .62, -.28], [x, .015, -.28]]
        c.add(f'side{sx}', oval_tube(rect, .022, .045, .045, closed=True, up=(1, 0, 0)), STEEL_BLACK)
    seat = cushion(.53, .16, .56, .35, .55); move(seat, 0, SH - .08, .02); c.add('seat', seat, 'upholstery')
    b = cushion(.53, .5, .14, .35, .55); move(b, 0, SH + .2, -.22); tilt_x(b, 8, (0, SH, -.22))
    c.add('back', b, 'upholstery')
    c.add('rail', tube([[-.28, .3, -.1], [.28, .3, -.1]], .01, 0), STEEL_BLACK)
    return c

# ------------------------------------------------------------------ HAVEN
@chair
def haven():
    c = Chair('haven')
    W, D, H, SH = .55, .56, .80, .45  # на сайте 780×720 — по фото обеденный стул; берём фото
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .17, SH - .1, sz * .17]; bot = [sx * .23, 0, sz * .23]
        c.add(f'leg{i}', leg(top, bot, .012, .006), BRONZE)
    c.add('apron', ring([0, SH - .1, .0], .23, .009), BRONZE)
    seat = cushion(.50, .11, .49, .9, .45); move(seat, 0, SH - .04, .02); c.add('seat', seat, 'upholstery')
    b = subdivided(cushion(.52, .4, .07, .3, .45, 96))
    v = b.vertices
    top = v[:, 1] > .1
    # волнистый верх спинки
    v[top, 1] += .03 * np.cos(v[top, 0] / .26 * math.pi * 1.5) * ((v[top, 1] - .1) / .1)
    b.vertices = v
    bend_y(b, .25)
    move(b, 0, SH + .2, -.17)
    tilt_x(b, 8, (0, SH, -.17))
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ NOOK
@chair
def nook():
    c = Chair('nook')
    W, D, H, SH = .78, .72, .80, .45
    for sx in (-1, 1):
        x = sx * .36
        pts = [[x, .016, -.3], [x, .016, .3], [x, .14, .31], [x, .56, .25], [x, .56, -.05], [x * .9, .7, -.28], [0, .74, -.33]]
        c.add(f'side{sx}', oval_tube(pts, .022, .04, .06, up=(1, 0, 0)), STEEL_BLACK)
        c.add(f'floor_back{sx}', oval_tube([[x, .016, -.3], [x * .4, .016, -.32], [0, .016, -.32]], .022, .04, .06, up=(0, 1, 0)), STEEL_BLACK)
    seat = cushion(.64, .17, .6, .5, .6); move(seat, 0, SH - .08, .03); c.add('seat', seat, 'upholstery')
    b = subdivided(cushion(.70, .46, .2, .5, .6, 96))
    channels(b, 1, 2, .015, along=2); channels(b, 0, 2, .015, along=2)
    bend_y(b, .45)
    move(b, 0, SH + .17, -.22)
    tilt_x(b, 14, (0, SH, -.22))
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ DUNE
@chair
def dune():
    c = Chair('dune')
    SH = .65
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .17, SH - .06, sz * .16]; bot = [sx * .21, 0, sz * .2]
        c.add(f'leg{i}', leg(top, bot, .01, .009), STEEL_BLACK)
    fy = .22
    sq = [[-.195, fy, .185], [.195, fy, .185], [.195, fy, -.185], [-.195, fy, -.185]]
    c.add('footrest', oval_tube(sq, .03, .018, .0, closed=True, up=(0, 1, 0)), WALNUT)
    # сиденье-седло с низкой спинкой
    s = subdivided(cushion(.44, .06, .42, .4, .5, 96))
    v = s.vertices
    zz = v[:, 2]
    v[:, 1] += np.where(zz < -.04, (-.04 - zz) * .75, 0)  # невысокая спинка-седло
    v[:, 1] += .02 * (v[:, 0] / .22) ** 2  # седло
    s.vertices = v
    move(s, 0, SH - .02, .01)
    c.add('seat', s, 'upholstery')
    return c

# ------------------------------------------------------------------ RIPPLE
def ripple_back(c, SH, z=-.2):
    b = subdivided(cushion(.44, .3, .05, .55, .45, 96))
    channels(b, 0, 7, .005, along=2)
    bend_y(b, .3)
    move(b, 0, SH + .2, z)
    tilt_x(b, 8, (0, SH, z))
    return c.add('back', b, 'upholstery')

@chair
def ripple():
    c = Chair('ripple')
    SH = .46
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .2, SH - .06, sz * .2]; bot = [sx * .21, 0, sz * .22]
        c.add(f'leg{i}', leg(top, bot, .009, .009), STEEL_BLACK)
    c.add('frame', tube([[-.2, SH - .06, .2], [.2, SH - .06, .2], [.2, SH - .06, -.2], [-.2, SH - .06, -.2]], .009, .02, closed=True), STEEL_BLACK)
    for sx in (-1, 1):
        c.add(f'post{sx}', tube([[sx * .2, SH - .06, -.2], [sx * .2, SH + .12, -.22]], .009, 0), STEEL_BLACK)
    seat = cushion(.46, .07, .45, .5, .45); move(seat, 0, SH - .01, .0); c.add('seat', seat, 'upholstery')
    ripple_back(c, SH, -.21)
    return c

@chair
def ripplebar():
    c = Chair('ripplebar')
    SH = .65
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        top = [sx * .19, SH - .06, sz * .18]; bot = [sx * .21, 0, sz * .21]
        c.add(f'leg{i}', leg(top, bot, .009, .009), STEEL_BLACK)
    c.add('frame', tube([[-.19, SH - .06, .18], [.19, SH - .06, .18], [.19, SH - .06, -.18], [-.19, SH - .06, -.18]], .009, .02, closed=True), STEEL_BLACK)
    fy = .24
    c.add('footrest', tube([[-.2, fy, .2], [.2, fy, .2], [.2, fy, -.2], [-.2, fy, -.2]], .009, .02, closed=True), STEEL_BLACK)
    c.add('footpad', move(cushion(.36, .015, .035, .3, .3), 0, fy + .012, .2), WALNUT)
    for sx in (-1, 1):
        c.add(f'post{sx}', tube([[sx * .19, SH - .06, -.18], [sx * .19, SH + .1, -.2]], .009, 0), STEEL_BLACK)
    seat = cushion(.44, .07, .42, .5, .45); move(seat, 0, SH - .01, .0); c.add('seat', seat, 'upholstery')
    b = subdivided(cushion(.42, .28, .05, .55, .45, 96))
    channels(b, 0, 7, .005, along=2); bend_y(b, .3); move(b, 0, SH + .19, -.19); tilt_x(b, 8, (0, SH, -.19))
    c.add('back', b, 'upholstery')
    return c

# ------------------------------------------------------------------ COVE
@chair
def cove():
    c = Chair('cove')
    W, D, H, SH = .82, .78, .73, .42
    R = .33
    # корпус-«чаша»: спинка и подлокотники одной непрерывной линией
    shell = cushion(1.55, .44, .17, .3, .8, edge=.02, puff=.08)
    bend_y(shell, R)
    move(shell, 0, .5, .04 - R)
    c.add('shell', shell, 'upholstery')
    base = cushion(.80, .16, .74, .8, .8); move(base, 0, .3, .02); c.add('base', base, 'upholstery')
    seat = cushion(.52, .14, .5, .7, .8); move(seat, 0, SH - .02, .08); c.add('seat', seat, 'upholstery')
    pil = cushion(.36, .3, .1, .6, .8); move(pil, 0, .55, -.12); tilt_x(pil, 18, (0, .45, -.12))
    c.add('pillow', pil, ('pillow', '#e9e2d6', .95, 0))
    for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
        x, z = sx * .3, sz * .25
        c.add(f'leg{i}', leg([x, .25, z], [x, 0, z], .009, .009), STEEL_BLACK)
    return c

VARIANTS = json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'variants.json')))

if __name__ == '__main__':
    ids = sys.argv[1:] or list(BUILD)
    for cid in ids:
        ch = BUILD[cid]()
        ch.finalize()
        lo, hi = ch.bounds()
        print(cid, 'size мм:', [round(1000 * (hi[i] - lo[i])) for i in (0, 2, 1)])
        v = VARIANTS[cid][0]
        ch.scene(v['color'], v['kind']).export(f'out/{cid}.glb')
