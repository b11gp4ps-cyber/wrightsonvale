const fs = require("fs");
const path = require("path");
const root = process.argv[2] || path.join(__dirname, "..");
const V = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/styles\.css\?v=([\w.]+)/) || [])[1] || "1";
const src = fs.readFileSync(path.join(root, "site.js"), "utf8");
const grab = (name) => eval("(" + src.match(new RegExp("^const " + name + " = (\\{[\\s\\S]*?\\n\\});", "m"))[1] + ")");
const chairs = grab("chairs");
const sizes = grab("sizes");
const priceList = { leather: 35000, fabric: 26000 };
const priceOverrides = eval("(" + src.match(/^const priceOverrides = (\{.*?\});/m)[1] + ")");
const priceFor = (name, kind) => priceOverrides[name]?.[kind] ?? priceList[kind];
const fmt = (n) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";
const SITE = "https://wrightsonvale.ru";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const collections = {
  cafe: { title: "Для кофеен", series: "Caffè", anchor: "collection", keys: ["tide", "pier", "ripple", "ripplebar", "cove", "swell", "jetty", "tier", "tierbar", "lagoon"] },
  wine: { title: "Винные и сигарные бутики", series: "Riserva", anchor: "wine-cigar", keys: ["cask", "leaf", "decant", "cellar", "fern", "carafe"] },
  office: { title: "Офис и переговорные", series: "Studio", anchor: "office", keys: ["axis", "linea", "forum", "meridian", "stroke", "atrium"] },
  home: { title: "Для дома", series: "Dimora", anchor: "home", keys: ["haven", "nook", "dune", "tuxedo", "hearth", "mesa"] },
};
const types = {
  tide: ["Кресло для кофейни", "кресло для кофейни ручной работы"],
  pier: ["Барный стул", "барный стул ручной работы"],
  ripple: ["Обеденный стул", "стул для кафе и ресторана ручной работы"],
  ripplebar: ["Полубарный стул", "полубарный стул ручной работы"],
  cove: ["Лаунж-кресло", "лаунж-кресло ручной работы"],
  cask: ["Стул для винного бутика", "стул для винного бара ручной работы"],
  leaf: ["Стул для зоны дегустации", "стул для винного бутика и ресторана"],
  decant: ["Барный стул", "барный стул в коже для винного бара"],
  axis: ["Рабочее кресло", "рабочее кресло в коже ручной работы"],
  linea: ["Кресло для переговорной", "консольное кресло для переговорной"],
  forum: ["Стул для приёмной", "стул для приёмной и зоны ожидания"],
  haven: ["Обеденный стул", "мягкий обеденный стул ручной работы"],
  nook: ["Кресло для отдыха", "кресло для чтения и отдыха ручной работы"],
  dune: ["Полубарный стул", "полубарный стул для кухонного острова"],
  swell: ["Кресло для кофейни", "кресло для кофейни ручной работы"],
  jetty: ["Барный стул", "барный стул с мягкой спинкой ручной работы"],
  cellar: ["Кресло для винного лаунжа", "лаунж-кресло для винного бара ручной работы"],
  fern: ["Стул для винного бара", "стул для винного бара и ресторана"],
  carafe: ["Барный стул", "барный стул в коже для винного бара"],
  meridian: ["Рабочее кресло", "рабочее кресло ручной работы"],
  stroke: ["Кресло для переговорной", "кресло для переговорной ручной работы"],
  atrium: ["Лаунж-кресло", "лаунж-кресло для лобби и зоны ожидания"],
  tuxedo: ["Обеденный стул", "обеденный стул в съёмном чехле ручной работы"],
  tier: ["Обеденный стул", "обеденный стул для кафе и ресторана ручной работы"],
  tierbar: ["Полубарный стул", "полубарный стул ручной работы"],
  lagoon: ["Лаунж-кресло", "лаунж-кресло ручной работы"],
  hearth: ["Кресло для отдыха", "кресло для чтения и отдыха ручной работы"],
  mesa: ["Полубарный стул", "полубарный стул для кухонного острова"],
};
const trios = { pier: "pier-trio", cask: "cask-trio", forum: "forum-trio", haven: "haven-trio", nook: "nook-trio", tide: "tide2-trio", ripple: "ripple-trio", ripplebar: "ripple-bar-trio", cove: "cove-trio", leaf: "leaf2-trio", decant: "decant2-trio", axis: "axis2-trio", linea: "linea2-trio", dune: "dune2-trio" };
const interiors = {
  pier: ["int-pier", "Кофейный бар"], cask: ["int-cask", "Винный погреб"], forum: ["int-forum", "Приёмная"], tide: ["int-tide", "Кофейня у окна"], ripple: ["int-ripple", "Зал бистро"], ripplebar: ["int-ripplebar", "Барная стойка"],
  decant: ["int-decant", "Винный бар"], leaf: ["int-leaf", "Дегустационный зал"], axis: ["int-axis", "Кабинет"],
  dune: ["int-dune", "Кухонный остров"], haven: ["int-haven", "Столовая"], nook: ["int-nook", "Зимний сад"],
  cove: ["cove-terracotta-room", "Светлая гостиная"], linea: ["linea2-office", "Переговорная"],
  swell: ["int-swell", "Кофейня у витрины"],
  cellar: ["int-cellar", "Винный лаунж"],
  stroke: ["int-stroke", "Переговорная"],
  atrium: ["int-atrium", "Лобби"],
  tuxedo: ["int-tuxedo", "Столовая"],
  tierbar: ["int-tierbar", "Барная стойка"],
};
const kindLabel = { leather: "Кожа", fabric: "Ткань" };
const collOf = (key) => Object.entries(collections).find(([, c]) => c.keys.includes(key));

const pages = [];
for (const [key, chair] of Object.entries(chairs)) {
  if (!types[key]) continue;
  const [cid, coll] = collOf(key);
  const [typeLabel, seoType] = types[key];
  const kinds = [...new Set(chair.variants.map((v) => v.kind))];
  const prices = kinds.map((k) => priceFor(chair.name, k));
  const low = Math.min(...prices), high = Math.max(...prices);
  const size = sizes[chair.name];
  const title = `${chair.name} — ${seoType} | Wrightson & Vale`;
  const firstSentence = chair.description.split(/(?<=\.)\s/)[0].replace(/\.$/, "");
  let desc = `${typeLabel} ${chair.name} ручной работы. ${firstSentence}. Обивка: ${kinds.map((k) => kindLabel[k].toLowerCase()).join(", ")} или ваш материал, от ${fmt(low)}.`;
  if (desc.length > 160) desc = `${typeLabel} ${chair.name} ручной работы. Обивка: ${kinds.map((k) => kindLabel[k].toLowerCase()).join(", ")} или ваш материал, от ${fmt(low)}. Доставка по России и СНГ.`;
  const url = `${SITE}/models/${key}.html`;
  const ogImage = `${SITE}/assets/${trios[key] ? trios[key] + ".webp" : chair.variants[0].photo.replace("assets/", "")}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: `${typeLabel} ${chair.name}`, description: chair.description,
    brand: { "@type": "Brand", name: "Wrightson & Vale" }, category: typeLabel, url,
    image: chair.variants.map((v) => SITE + "/" + v.photo),
    offers: { "@type": "AggregateOffer", priceCurrency: "RUB", lowPrice: low, highPrice: high, offerCount: chair.variants.length, availability: "https://schema.org/PreOrder" },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Wrightson & Vale", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: coll.title, item: `${SITE}/#${coll.anchor}` },
    { "@type": "ListItem", position: 3, name: chair.name, item: url },
  ] };
  const enc = encodeURIComponent(chair.name);
  const thumbs = chair.variants.map((v, i) => `<button class="mp-thumb" type="button" data-photo="../${v.photo}" data-alt="${esc(v.alt)}" data-name="${esc(v.name)}" data-variant="${encodeURIComponent(v.name)}" aria-pressed="${i === 0}"><img src="../${v.photo}" alt="" width="144" height="180" loading="lazy" decoding="async"><span><i style="background:${v.color}"></i>${esc(v.name)}</span></button>`).join("\n            ");
  const others = coll.keys.filter((k) => k !== key && chairs[k]).map((k) => {
    const c = chairs[k]; const lowO = Math.min(...[...new Set(c.variants.map((v) => v.kind))].map((kk) => priceFor(c.name, kk)));
    return `<a class="mp-other" href="${k}.html"><img src="../${c.variants[0].photo}" alt="${esc(c.variants[0].alt)}" width="720" height="900" loading="lazy" decoding="async"><b>${c.name}</b><span>${types[k][0]} · от ${fmt(lowO)}</span></a>`;
  }).join("\n          ");
  const interior = interiors[key];
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f0e6">
  <title>${esc(chair.name + " — " + typeLabel.toLowerCase() + " | Wrightson & Vale")}</title>
  <meta name="apple-mobile-web-app-title" content="W&amp;V">
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="Wrightson &amp; Vale">
  <meta property="og:title" content="${esc(chair.name + " — " + typeLabel.toLowerCase() + " | Wrightson & Vale")}">
  <meta property="og:description" content="${esc(chair.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.ico" sizes="any">
  <link rel="icon" href="../favicon.png" type="image/png" sizes="120x120">
  <link rel="apple-touch-icon" href="../apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <script>if("serviceWorker"in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")});</script>
  <link rel="stylesheet" href="../fonts.css?v=v93">
  <link rel="stylesheet" href="../styles.css?v=__V__">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body class="model-page">
  <header class="mp-header">
    <div class="shell mp-header-inner">
      <a class="mp-brand" href="../index.html"><img src="../assets/wrightson-vale.webp" alt="" width="40" height="40"><span>Wrightson &amp; Vale</span></a>
      <nav class="mp-nav" aria-label="Навигация">
        <a href="../index.html#collections">Все модели</a>
        <a href="../index.html?model=${enc}#pick">Расчёт</a>
        <a class="button button-primary mp-cta-small" href="../index.html?model=${enc}#project">Заявка</a>
      </nav>
    </div>
  </header>
  <main class="shell mp-main">
    <nav class="mp-crumbs" aria-label="Хлебные крошки"><a href="../index.html">Главная</a> / <a href="../index.html#${coll.anchor}">${esc(coll.title)}</a> / <span>${chair.name}</span></nav>
    <div class="mp-grid">
      <div class="mp-gallery">
        <figure class="mp-photo"><img id="mp-photo" src="../${chair.variants[0].photo}" alt="${esc(chair.variants[0].alt)}" width="720" height="900" decoding="async"></figure>
        <div class="mp-thumbs" role="group" aria-label="Цвета обивки">
            ${thumbs}
        </div>
      </div>
      <div class="mp-info">
        <p class="eyebrow">Серия ${coll.series} · ${esc(coll.title)}</p>
        <h1>${chair.name}</h1>
        <p class="mp-type">${typeLabel} ручной работы</p>
        <p class="mp-desc">${esc(chair.description)}</p>
        <div class="mp-prices">
          ${kinds.map((k) => `<div><span>${kindLabel[k]}</span><b>от ${fmt(priceFor(chair.name, k))}</b></div>`).join("\n          ")}
        </div>
        <p class="mp-selected">Выбран цвет: <b id="mp-selected">${esc(chair.variants[0].name)}</b></p>
        <div class="mp-actions">
          <a class="button button-primary" id="mp-order" href="../index.html?model=${enc}&amp;variant=${encodeURIComponent(chair.variants[0].name)}#project">Оставить заявку</a>
          <a class="button button-outline" href="../index.html?model=${enc}#pick">Посчитать стоимость</a>
        </div>
        <dl class="mp-specs">
          ${size ? `<div><dt>Размеры (Ш × Г × В)</dt><dd>${size.w} × ${size.d} × ${size.h} мм</dd></div>
          <div><dt>Высота сиденья</dt><dd>${size.seat} мм</dd></div>` : ""}
          <div><dt>Каркас</dt><dd>Металл</dd></div>
          <div><dt>Обивка</dt><dd>${chair.variants.map((v) => esc(v.name)).join(", ")}. Возможен свой материал</dd></div>
          <div><dt>Ткани</dt><dd>Коллекции Noble, Fiori, Bohemia, Rio</dd></div>
          <div><dt>Гарантия</dt><dd>12 месяцев, ГОСТ 16371-2014</dd></div>
          <div><dt>Производство</dt><dd>Фабрика полного цикла ГК «Фабрикант»</dd></div>
          <div><dt>Доставка</dt><dd>По России и СНГ</dd></div>
        </dl>
        <p class="mp-fine">Изготавливаем под ваш проект: точные размеры, обивку и стоимость фиксируем в персональном расчёте.</p>
      </div>
    </div>
${trios[key] || interior ? `    <section class="mp-more">
      ${trios[key] ? `<figure class="mp-wide"><img src="../assets/${trios[key]}.webp" alt="${esc(chair.name)} — все варианты обивки" width="1376" height="768" loading="lazy" decoding="async"><figcaption>Все варианты обивки ${chair.name}</figcaption></figure>` : ""}
      ${interior ? `<figure class="mp-interior"><img src="../assets/${interior[0]}.webp" alt="${esc(interior[1])} · ${chair.name}" loading="lazy" decoding="async"><figcaption>${esc(interior[1])} · визуализация</figcaption></figure>` : ""}
    </section>` : ""}
    <section class="mp-others">
      <h2>Другие модели серии ${coll.series}</h2>
      <div class="mp-others-grid">
          ${others}
      </div>
    </section>
  </main>
  <footer class="mp-footer">
    <div class="shell mp-footer-inner">
      <span>© 2026 Wrightson &amp; Vale · авторская мебель ручной работы</span>
      <span><a href="tel:+79993883030">+7 999 388 30 30</a> · <a href="mailto:wv@wrightsonvale.ru">wv@wrightsonvale.ru</a></span>
    </div>
    <p class="shell footer-legal">ЗАО «ЖИЛПРОМСЕРВИС», ИНН 6215018827, ОГРН 1066215014876 · <a href="../privacy.html">Политика конфиденциальности</a></p>
  </footer>
  <script>
    (function () {
      var photo = document.getElementById("mp-photo");
      var selected = document.getElementById("mp-selected");
      var order = document.getElementById("mp-order");
      var base = order.getAttribute("href").split("&")[0];
      document.querySelectorAll(".mp-thumb").forEach(function (button) {
        button.addEventListener("click", function () {
          photo.src = button.dataset.photo;
          photo.alt = button.dataset.alt;
          selected.textContent = button.dataset.name;
          order.setAttribute("href", base + "&variant=" + button.dataset.variant + "#project");
          document.querySelectorAll(".mp-thumb").forEach(function (b) { b.setAttribute("aria-pressed", String(b === button)); });
        });
      });
    })();
  </script>
</body>
</html>
`;
  fs.mkdirSync(path.join(root, "models"), { recursive: true });
  fs.writeFileSync(path.join(root, "models", key + ".html"), html.replace(/__V__/g, V));
  pages.push({ key, name: chair.name, type: typeLabel, coll: cid });
}
fs.writeFileSync(path.join(root, "models", "pages.json"), JSON.stringify(pages));
console.log(pages.length, "pages");
