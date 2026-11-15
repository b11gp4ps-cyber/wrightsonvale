"""Параметрические примитивы для 3D-моделей стульев Wrightson & Vale.
Единицы — метры. Оси glTF: Y вверх, Z — к зрителю (перед стула), X — вправо."""
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

# ---------- материалы ----------
def hex_rgba(h, a=255):
    """sRGB hex -> линейный RGBA (glTF baseColorFactor линейный)."""
    h = h.lstrip('#')
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        c = c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
        out.append(c)
    return out + [a / 255]

MATS = {}
def material(name, color, rough=0.6, metal=0.0):
    key = (name, color, rough, metal)
    if key not in MATS:
        MATS[key] = PBRMaterial(name=name, baseColorFactor=hex_rgba(color),
                                roughnessFactor=rough, metallicFactor=metal, doubleSided=False)
    return MATS[key]

def paint(mesh, mat):
    mesh.visual = trimesh.visual.TextureVisuals(material=mat)
    return mesh

STEEL_BLACK = ('steel', '#1d1d1f', 0.38, 0.85)
BRASS = ('brass', '#b08d57', 0.3, 1.0)
BRONZE = ('bronze', '#9a7b55', 0.35, 1.0)
WALNUT = ('walnut', '#5b3a24', 0.55, 0.0)
RUBBER = ('rubber', '#111111', 0.9, 0.0)

def fabric_params(kind):
    # кожа — полуматовая, ткань/букле/бархат — матовые
    return {'leather': 0.45, 'fabric': 0.92}.get(kind, 0.8)

# ---------- трубы ----------
def _smooth_polyline(pts, corner_r, closed=False, seg=10):
    """Скругляет углы ломаной дугами радиуса corner_r."""
    pts = np.asarray(pts, float)
    n = len(pts)
    out = []
    idx = range(n) if closed else range(n)
    for i in idx:
        p = pts[i]
        if not closed and (i == 0 or i == n - 1):
            out.append(p); continue
        a, b = pts[(i - 1) % n], pts[(i + 1) % n]
        u, v = a - p, b - p
        lu, lv = np.linalg.norm(u), np.linalg.norm(v)
        if lu < 1e-9 or lv < 1e-9:
            out.append(p); continue
        u, v = u / lu, v / lv
        ang = np.arccos(np.clip(np.dot(u, v), -1, 1))
        if ang > np.pi - 1e-3:
            out.append(p); continue
        r = corner_r
        t = min(r / np.tan(ang / 2), lu * 0.49, lv * 0.49)
        p1, p2 = p + u * t, p + v * t
        # квадратичная Безье — достаточно гладко для трубы
        for s in np.linspace(0, 1, seg):
            out.append((1 - s) ** 2 * p1 + 2 * (1 - s) * s * p + s ** 2 * p2)
    if closed:
        out.append(out[0])
    return np.array(out)

def tube(points, radius, corner_r=0.04, closed=False, sides=20, smooth=True, cap=True):
    """Труба круглого сечения вдоль ломаной (с параллельным переносом рамки)."""
    P = _smooth_polyline(points, corner_r, closed) if smooth else np.asarray(points, float)
    # убрать дубли
    keep = [0] + [i for i in range(1, len(P)) if np.linalg.norm(P[i] - P[i - 1]) > 1e-6]
    P = P[keep]
    T = np.gradient(P, axis=0)
    T /= np.linalg.norm(T, axis=1)[:, None]
    ref = np.array([0, 1, 0.0]) if abs(T[0][1]) < 0.9 else np.array([1, 0, 0.0])
    N = np.cross(T[0], ref); N /= np.linalg.norm(N)
    frames = []
    for i in range(len(P)):
        if i > 0:
            N = N - np.dot(N, T[i]) * T[i]
            N /= np.linalg.norm(N)
        B = np.cross(T[i], N)
        frames.append((N, B))
    ang = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    verts = []
    for p, (Nn, Bb) in zip(P, frames):
        for a in ang:
            verts.append(p + radius * (np.cos(a) * Nn + np.sin(a) * Bb))
    verts = np.array(verts)
    faces = []
    m = len(P)
    for i in range(m - 1):
        for j in range(sides):
            a = i * sides + j; b = i * sides + (j + 1) % sides
            c = (i + 1) * sides + j; d = (i + 1) * sides + (j + 1) % sides
            faces += [[a, c, b], [b, c, d]]
    if cap and not closed:
        c0 = len(verts); verts = np.vstack([verts, P[0], P[-1]])
        for j in range(sides):
            faces.append([c0, j, (j + 1) % sides])
            o = (m - 1) * sides
            faces.append([c0 + 1, o + (j + 1) % sides, o + j])
    mesh = trimesh.Trimesh(verts, faces, process=True)
    mesh.fix_normals()
    return mesh

def flat_tube(points, w, h, corner_r=0.05, closed=False, sides=24):
    """Плоско-овальная труба (сечение — суперэллипс w×h)."""
    m = tube(points, 1.0, corner_r, closed, sides)
    return m  # заменяется ниже

def oval_tube(points, w, h, corner_r=0.05, closed=False, sides=24, up=(0, 1, 0)):
    P = _smooth_polyline(points, corner_r, closed)
    keep = [0] + [i for i in range(1, len(P)) if np.linalg.norm(P[i] - P[i - 1]) > 1e-6]
    P = P[keep]
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    upv = np.array(up, float)
    ang = np.linspace(0, 2 * np.pi, sides, endpoint=False)
    ex = 4.0
    verts = []
    for p, t in zip(P, T):
        n = np.cross(t, upv)
        if np.linalg.norm(n) < 1e-6:
            n = np.cross(t, [1, 0, 0])
        n /= np.linalg.norm(n); b = np.cross(n, t)
        for a in ang:
            c, s = np.cos(a), np.sin(a)
            x = np.sign(c) * abs(c) ** (2 / ex) * w / 2
            y = np.sign(s) * abs(s) ** (2 / ex) * h / 2
            verts.append(p + x * n + y * b)
    verts = np.array(verts); m = len(P); faces = []
    for i in range(m - 1):
        for j in range(sides):
            a = i * sides + j; bb = i * sides + (j + 1) % sides
            c = (i + 1) * sides + j; d = (i + 1) * sides + (j + 1) % sides
            faces += [[a, c, bb], [bb, c, d]]
    if not closed:
        c0 = len(verts); verts = np.vstack([verts, P[0], P[-1]])
        for j in range(sides):
            faces.append([c0, j, (j + 1) % sides]); o = (m - 1) * sides
            faces.append([c0 + 1, o + (j + 1) % sides, o + j])
    mesh = trimesh.Trimesh(verts, faces, process=True); mesh.fix_normals()
    return mesh

def leg(top, bottom, r_top, r_bot=None, sides=18):
    """Прямая (возможно коническая) ножка от точки top до bottom."""
    r_bot = r_top if r_bot is None else r_bot
    top, bottom = np.asarray(top, float), np.asarray(bottom, float)
    h = np.linalg.norm(top - bottom)
    m = trimesh.creation.cylinder(radius=1, height=h, sections=sides)
    v = m.vertices.copy()
    t = (v[:, 2] + h / 2) / h  # 0 низ, 1 верх
    s = r_bot + (r_top - r_bot) * t
    v[:, 0] *= s; v[:, 1] *= s
    m.vertices = v
    # выровнять ось Z цилиндра по направлению bottom->top
    d = (top - bottom) / h
    R = trimesh.geometry.align_vectors([0, 0, 1], d)
    m.apply_transform(R)
    m.apply_translation((top + bottom) / 2)
    return m

def ring(center, radius, r_tube, sides=16, seg=64):
    """Горизонтальное кольцо (подножка)."""
    a = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    pts = [np.array(center) + [radius * np.cos(t), 0, radius * np.sin(t)] for t in a]
    return tube(pts, r_tube, corner_r=0, closed=True, sides=sides, smooth=False, cap=False)

# ---------- мягкие элементы ----------
def _se(c, e):
    return np.sign(c) * np.abs(c) ** e

def cushion(w, h, d, round_xy=0.25, round_z=0.35, res=56, puff=0.12, edge=0.02):
    """Мягкий элемент: скруглённый параллелепипед w (X) × h (Y) × d (Z) с «пухлыми» гранями.
    round_xy — скругление углов в плане (доля от половины меньшей стороны),
    round_z — скругление рёбер по толщине (доля от половины h)."""
    half = np.array([w, h, d]) / 2
    rxz = max(round_xy, .05) * min(w, d) / 2
    ry = max(min(round_z, .98), .05) * h / 2
    rv = np.array([max(rxz, ry * .6), ry, max(rxz, ry * .6)])
    rv = np.minimum(rv, half * .98)
    box = trimesh.creation.box(extents=[w, h, d])
    v, f = trimesh.remesh.subdivide_to_size(box.vertices, box.faces, max_edge=max(min(edge, h / 3, w / 6, d / 6), .006))
    q = np.clip(v, -(half - rv), half - rv)
    dd = (v - q) / rv
    nrm = np.linalg.norm(dd, axis=1)
    nrm[nrm < 1e-9] = 1
    v2 = q + (dd / nrm[:, None]) * rv
    # пухлость верх/низ и лицевых сторон
    u = np.clip(v2[:, 0] / half[0], -1, 1); t = np.clip(v2[:, 2] / half[2], -1, 1); s_ = np.clip(v2[:, 1] / half[1], -1, 1)
    bulge_y = (1 - u ** 2) * (1 - t ** 2)
    v2[:, 1] += np.sign(v2[:, 1]) * puff * h * bulge_y * (np.abs(s_) > .2)
    bulge_z = (1 - u ** 2) * (1 - s_ ** 2)
    v2[:, 2] += np.sign(v2[:, 2]) * puff * .5 * d * bulge_z * (np.abs(t) > .2)
    m = trimesh.Trimesh(v2, f, process=True)
    m.merge_vertices()
    trimesh.smoothing.filter_taubin(m, iterations=6)
    m.fix_normals()
    return m

def arc_pts(R, x_end, y, z_center, n=24):
    """Точки дуги в плане (вокруг вертикали) радиуса R от -x_end до +x_end; центр дуги впереди (z_center)."""
    a_end = np.arcsin(min(x_end / R, .999))
    return [[R * np.sin(a), y, z_center - R * np.cos(a)] for a in np.linspace(-a_end, a_end, n)]

def channels(mesh, axis, count, depth, along=None, span=None):
    """Прострочка: продольные канавки — смещение вершин внутрь по нормали.
    axis — ось, поперёк которой идут канавки (0=X — вертикальные каналы, 1=Y — горизонтальные)."""
    v = mesh.vertices.copy(); n = mesh.vertex_normals
    lo, hi = (span if span else (v[:, axis].min(), v[:, axis].max()))
    t = (v[:, axis] - lo) / (hi - lo + 1e-9)
    groove = (np.cos(t * count * 2 * np.pi) * 0.5 + 0.5) ** 2  # впадины прострочки
    mask = np.ones(len(v))
    if along is not None:
        mask = np.clip((n[:, along] - 0.3) / 0.4, 0, 1)  # только лицевая сторона, плавно
    v -= n * (depth * groove * mask)[:, None]
    mesh.vertices = v
    return mesh

def bend_y(mesh, radius):
    """Изгибает меш вокруг вертикальной оси: X → дуга радиуса radius (центр позади, -Z)."""
    v = mesh.vertices.copy()
    ang = v[:, 0] / radius
    r = radius - v[:, 2]          # центр изгиба впереди (+Z): спинка обнимает сидящего
    v[:, 0] = r * np.sin(ang)
    v[:, 2] = radius - r * np.cos(ang)
    mesh.vertices = v
    mesh.fix_normals()
    return mesh

def tilt_x(mesh, deg, pivot=(0, 0, 0)):
    """Наклон назад вокруг оси X (положительный угол — верх уходит назад)."""
    R = trimesh.transformations.rotation_matrix(np.radians(-deg), [1, 0, 0], pivot)
    mesh.apply_transform(R)
    return mesh

def move(mesh, x=0, y=0, z=0):
    mesh.apply_translation([x, y, z]); return mesh

def subdivided(mesh, n=1):
    return mesh  # плотность задаётся параметром res у cushion

# ---------- сборка ----------
class Chair:
    def __init__(self, cid):
        self.cid = cid
        self.parts = []  # (name, mesh, mat_key or 'upholstery')

    def add(self, name, mesh, mat):
        self.parts.append((name, mesh, mat))
        return mesh

    def finalize(self, max_faces=24000):
        out = []
        for name, mesh, mat in self.parts:
            if len(mesh.faces) > max_faces:
                try:
                    mesh = mesh.simplify_quadric_decimation(face_count=max_faces)
                except Exception as e:
                    print('decimate fail', name, e)
            mesh.fix_normals()
            out.append((name, mesh, mat))
        self.parts = out

    def scene(self, uph_color, uph_kind):
        sc = trimesh.Scene()
        for name, mesh, mat in self.parts:
            m = mesh.copy()
            if mat == 'upholstery':
                paint(m, material('upholstery', uph_color, fabric_params(uph_kind), 0.0))
            elif mat == 'piping':
                paint(m, material('piping', uph_color, fabric_params(uph_kind), 0.0))
            else:
                paint(m, material(*mat))
            sc.add_geometry(m, node_name=name, geom_name=name)
        return sc

    def bounds(self):
        allv = np.vstack([m.vertices for _, m, _ in self.parts])
        return allv.min(0), allv.max(0)
