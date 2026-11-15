import json, os, zipfile, io, re
import trimesh
from chairs import BUILD, VARIANTS
NAMES={'tide':'Tide','pier':'Pier','cask':'Cask','leaf':'Leaf','decant':'Decant','axis':'Axis','linea':'Linea','forum':'Forum','haven':'Haven','nook':'Nook','dune':'Dune','ripple':'Ripple','ripplebar':'Ripple Bar','cove':'Cove'}
OUT='/mnt/user-data/outputs/wv-3d'; os.makedirs(OUT, exist_ok=True)
for cid, fn in BUILD.items():
    ch = fn(); ch.finalize()
    for i, v in enumerate(VARIANTS[cid], 1):
        nm = f"{NAMES[cid]} — {v['name']}".replace('/', '-')
        ch.scene(v['color'], v['kind']).export(f"{OUT}/{nm}.glb")
    v = VARIANTS[cid][0]
    files = trimesh.exchange.obj.export_obj(ch.scene(v['color'], v['kind']), include_texture=True, return_texture=True, mtl_name='material.mtl')
    obj, tex = files if isinstance(files, tuple) else (files, {})
    with zipfile.ZipFile(f"{OUT}/{NAMES[cid]} — OBJ.zip", 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr(f"{NAMES[cid]}.obj", obj)
        for k, data in tex.items(): z.writestr(k, data)
    print(cid, 'ok')
