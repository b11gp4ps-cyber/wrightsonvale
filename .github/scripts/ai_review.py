"""ИИ-проверка сайта Wrightson & Vale через GitHub Models (бесплатно для репозитория)."""
import sys, os, glob, time, json, requests
from bs4 import BeautifulSoup

root, static_path, out_path = sys.argv[1:4]
TOKEN = os.environ["GITHUB_TOKEN"]
URL = "https://models.github.ai/inference/chat/completions"
MODEL = os.environ.get("AI_MODEL", "openai/gpt-4.1-mini")
CHUNK = 11000

BRAND = (
    "Сайт https://wrightsonvale.ru бренда Wrightson & Vale (W&V) — авторская мебель ручной работы "
    "(стулья, кресла, барные стулья) для кофеен, винных и сигарных бутиков, офисов и домов, Россия. "
    "Правила бренда: тон громкий, дерзкий, элегантный («Rolls-Royce в мебели»); не подчёркивать количества "
    "(«14 моделей», «4 коллекции»); не писать «металлический каркас»; никаких WhatsApp/Telegram на сайте; "
    "сайт должен соответствовать 152-ФЗ (согласие на ПДн, политика, реквизиты ЗАО «ЖИЛПРОМСЕРВИС»). "
    "Формы отправляют заявки на функцию Яндекс Облака. Хостинг статический."
)

ASPECTS = {
    "text": "Ты редактор и маркетолог. Проверь видимый текст страницы: орфография, пунктуация, опечатки, "
            "неясные или канцелярские фразы, противоречия (цены, сроки, гарантия, контакты), нарушения правил бренда. "
            "Для каждой проблемы: цитата → что не так → как исправить.",
    "html": "Ты фронтенд-разработчик и SEO-специалист. Проверь фрагмент HTML: ошибки разметки, доступность "
            "(alt, label, aria, контраст по классам не оценивай), SEO (title, description, заголовки, Open Graph, "
            "JSON-LD), формы (обязательные поля, согласие), производительность (размеры картинок, lazy-loading).",
    "js":   "Ты опытный JavaScript-разработчик. Найди в фрагменте кода ошибки, возможные исключения, проблемы "
            "безопасности (XSS через innerHTML с пользовательскими данными), утечки, проблемы на мобильных, мёртвый код.",
    "css":  "Ты фронтенд-разработчик. Найди в фрагменте CSS ошибки, конфликтующие или дублирующиеся правила, "
            "проблемы адаптивности (телефон 360–430 px), горизонтальную прокрутку, проблемы доступности (фокус).",
}

def ask(system, user, max_tokens=1200):
    for attempt in range(8):
        r = requests.post(URL, headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
                          json={"model": MODEL, "temperature": 0.2, "max_tokens": max_tokens,
                                "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]},
                          timeout=120)
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"].strip()
        wait = int(r.headers.get("retry-after", 0) or 0) or 20 * (attempt + 1)
        print(f"  HTTP {r.status_code}: {r.text[:200]} — жду {wait} с", flush=True)
        if r.status_code in (401, 403, 404): return f"_Ошибка доступа к ИИ: HTTP {r.status_code} {r.text[:300]}_"
        time.sleep(min(wait, 120))
    return "_ИИ не ответил (лимит запросов)._"

def chunks(s, n=CHUNK):
    return [s[i:i + n] for i in range(0, len(s), n)] or [""]

def visible_text(html):
    s = BeautifulSoup(html, "html.parser")
    for t in s(["script", "style", "svg", "noscript"]): t.decompose()
    lines, prev = [], None
    for l in (x.strip() for x in s.get_text("\n").split("\n")):
        if l and l != prev: lines.append(l)
        prev = l
    return "\n".join(lines)

jobs = []
pages = ["index.html", "sample.html", "privacy.html", "consent.html"] + sorted(
    os.path.relpath(p, root) for p in glob.glob(os.path.join(root, "models", "*.html")))
for p in pages:
    html = open(os.path.join(root, p), encoding="utf-8").read()
    for i, c in enumerate(chunks(visible_text(html))): jobs.append(("text", p, i, c))
for p in ["index.html", "sample.html", "models/tide.html"]:
    html = open(os.path.join(root, p), encoding="utf-8").read()
    for i, c in enumerate(chunks(html)): jobs.append(("html", p, i, c))
for p in ["site.js", "sample.js"]:
    for i, c in enumerate(chunks(open(os.path.join(root, p), encoding="utf-8").read())): jobs.append(("js", p, i, c))
for i, c in enumerate(chunks(open(os.path.join(root, "styles.css"), encoding="utf-8").read(), 14000)):
    jobs.append(("css", "styles.css", i, c))

findings = []
for n, (kind, p, i, c) in enumerate(jobs, 1):
    print(f"[{n}/{len(jobs)}] {kind} {p} часть {i + 1}", flush=True)
    system = BRAND + "\n\n" + ASPECTS[kind] + (
        "\nОтвечай по-русски, кратко, списком. Указывай только реальные проблемы, без общих советов. "
        "Если проблем нет — ответь «Замечаний нет». Это фрагмент, не считай ошибкой то, что код обрезан на границе.")
    ans = ask(system, f"Файл: {p}, фрагмент {i + 1}\n\n```\n{c}\n```")
    findings.append((kind, p, i, ans))
    time.sleep(5)

static = open(static_path, encoding="utf-8").read()
digest = "\n\n".join(f"### {k} · {p} · часть {i + 1}\n{a[:1800]}" for k, p, i, a in findings
                     if "Замечаний нет" not in a[:40])
summary = ask(BRAND + "\nТы руководитель веб-проекта. Из замечаний ниже составь итог по-русски: "
              "1) оценка сайта по 10-балльной шкале с объяснением; 2) ТОП-10 самых важных проблем по приоритету "
              "(критично / важно / желательно) с конкретным исправлением; 3) что сделано хорошо. "
              "Отбрось ложные срабатывания и дубли.",
              (static + "\n\n" + digest)[:30000], max_tokens=2500)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(f"# AI-проверка сайта wrightsonvale.ru\n\nМодель: `{MODEL}` (GitHub Models). Проверено фрагментов: {len(jobs)}.\n\n")
    f.write("## Итог\n\n" + summary + "\n\n")
    f.write(static + "\n\n## Подробные замечания ИИ\n\n")
    for k, p, i, a in findings:
        f.write(f"<details><summary>{k} · {p} · часть {i + 1}</summary>\n\n{a}\n\n</details>\n\n")
print("Готово:", out_path)
