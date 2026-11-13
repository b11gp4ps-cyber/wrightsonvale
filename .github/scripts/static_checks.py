import sys, os, re, glob
from urllib.parse import urlparse, unquote
from bs4 import BeautifulSoup
root = sys.argv[1]
pages = [os.path.join(root, p) for p in ["index.html","sample.html","privacy.html","consent.html"]] + sorted(glob.glob(os.path.join(root,"models","*.html")))
issues = []
def local(base, ref):
    u = urlparse(ref)
    if u.scheme or ref.startswith(("#","mailto:","tel:","data:","javascript:")) or not u.path: return None
    return os.path.normpath(os.path.join(os.path.dirname(base), unquote(u.path)))
for p in pages:
    rel = os.path.relpath(p, root)
    s = BeautifulSoup(open(p, encoding="utf-8").read(), "html.parser")
    if not s.title or not s.title.get_text(strip=True): issues.append(f"{rel}: нет <title>")
    if not s.find("meta", attrs={"name":"description"}): issues.append(f"{rel}: нет meta description")
    if len(s.find_all("h1")) != 1: issues.append(f"{rel}: заголовков h1 — {len(s.find_all('h1'))} (нужен один)")
    ids = [t["id"] for t in s.find_all(id=True)]
    for d in {i for i in ids if ids.count(i) > 1}: issues.append(f"{rel}: повторяется id=\"{d}\"")
    for img in s.find_all("img"):
        if img.get("alt") is None: issues.append(f"{rel}: картинка без alt: {img.get('src')}")
    for tag, attr in (("a","href"),("img","src"),("link","href"),("script","src"),("source","srcset")):
        for t in s.find_all(tag):
            v = t.get(attr)
            if not v: continue
            for ref in [x.strip().split(" ")[0] for x in v.split(",")] if attr=="srcset" else [v]:
                f = local(p, ref)
                if f and not os.path.exists(f) and not os.path.exists(os.path.join(f,"index.html")):
                    issues.append(f"{rel}: битая ссылка {ref}")
    for a in s.find_all("a", href=True):
        h = a["href"]
        if h.startswith("#") and len(h) > 1 and h[1:] not in ids: issues.append(f"{rel}: якорь {h} не найден на странице")
        if a.get("target") == "_blank" and "noopener" not in (a.get("rel") or []): issues.append(f"{rel}: target=_blank без rel=noopener: {h}")
    for f in s.find_all("form"):
        if not f.find("input", attrs={"name":"consent"}) and f.find("input", attrs={"type":["text","tel","email"]}):
            issues.append(f"{rel}: форма {f.get('id')} без галочки согласия на ПДн")
for js in ("site.js","sample.js","styles.css"):
    txt = open(os.path.join(root, js), encoding="utf-8").read()
    for m in set(re.findall(r'["\'(]((?:\.\./)?assets/[^"\')\s?]+)', txt)):
        if not os.path.exists(os.path.join(root, m.replace("../",""))): issues.append(f"{js}: нет файла {m}")
print("## Автоматическая проверка (без ИИ)\n")
print(f"Проверено страниц: {len(pages)}. Найдено замечаний: {len(issues)}.\n")
for i in sorted(set(issues)): print(f"- {i}")
