const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const menuIcon = menuToggle.querySelector("use");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  menuIcon.setAttribute("href", open ? "#close" : "#menu");
  mobileNav.hidden = !open;
}

menuToggle.addEventListener("click", () => setMenu(mobileNav.hidden));
mobileNav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  setMenu(false);
  const section = document.querySelector(link.hash);
  section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
});
document.addEventListener("click", (event) => {
  if (!mobileNav.hidden && !event.target.closest(".site-header")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia("(max-width: 760px)").addEventListener("change", (event) => {
  if (!event.matches) setMenu(false);
});

const chairs = {
  "tide": {
    "name": "Tide",
    "description": "Мягкое кресло для кофейни: одна гнутая чёрная стальная труба образует и подлокотники, и полозья. Спинка-лента с тонкой вертикальной прострочкой, отдельная мягкая подушка сиденья.",
    "variants": [
      {
        "kind": "leather",
        "name": "Терракотовая кожа",
        "color": "#a5523a",
        "photo": "assets/tide2-terracotta.webp",
        "alt": "Кресло Tide на металлическом каркасе, обивка — терракотовая кожа",
        "note": "Тёплая терракотовая кожа — самый яркий вариант для зала у окна."
      },
      {
        "kind": "fabric",
        "name": "Песочное букле",
        "color": "#cbbba2",
        "photo": "assets/tide2-sand.webp",
        "alt": "Кресло Tide на металлическом каркасе, обивка — песочное букле",
        "note": "Светлое мягкое букле для спокойных интерьеров."
      },
      {
        "kind": "fabric",
        "name": "Серо-синяя ткань",
        "color": "#5f7088",
        "photo": "assets/tide2-slate.webp",
        "alt": "Кресло Tide на металлическом каркасе, обивка — серо-синяя ткань",
        "note": "Плотная тканая обивка глубокого серо-синего цвета."
      }
    ]
  },
  "pier": {
    "name": "Pier",
    "description": "Высокий стул для барной стойки с круглой металлической подножкой и мягкой изогнутой спинкой.",
    "variants": [
      {
        "kind": "leather",
        "name": "Кожа цвета эспрессо",
        "color": "#4d3128",
        "photo": "assets/pier-leather.webp",
        "alt": "Стул Pier на металлическом каркасе, обивка — кожа цвета эспрессо"
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#a2663f",
        "photo": "assets/pier-cognac.webp",
        "alt": "Стул Pier на металлическом каркасе, обивка — коньячная кожа"
      },
      {
        "kind": "leather",
        "name": "Тёмно-зелёная кожа",
        "color": "#394738",
        "photo": "assets/pier-forest.webp",
        "alt": "Стул Pier на металлическом каркасе, обивка — тёмно-зелёная кожа"
      }
    ]
  },
  "cask": {
    "name": "Cask",
    "description": "Мягкая спинка с вертикальной прострочкой, кожа на сиденье и тёмный стальной каркас.",
    "variants": [
      {
        "kind": "leather",
        "name": "Бордовая кожа",
        "color": "#6b2c2a",
        "photo": "assets/cask-leather.webp",
        "alt": "Стул Cask на металлическом каркасе, обивка — бордовая кожа"
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#a2663f",
        "photo": "assets/cask-cognac.webp",
        "alt": "Стул Cask на металлическом каркасе, обивка — коньячная кожа"
      },
      {
        "kind": "leather",
        "name": "Графитовая кожа",
        "color": "#4c4b49",
        "photo": "assets/cask-graphite.webp",
        "alt": "Стул Cask на металлическом каркасе, обивка — графитовая кожа"
      }
    ]
  },
  "leaf": {
    "name": "Leaf",
    "description": "Стул для зоны консультаций: спинка-веер с глубокой вертикальной прострочкой, мягкое сиденье, тонкие ножки цвета бронзы с перемычкой из ореха. Лёгкий ар-деко.",
    "variants": [
      {
        "kind": "fabric",
        "name": "Оливковый бархат",
        "color": "#5f6a35",
        "photo": "assets/leaf2-olive.webp",
        "alt": "Стул Leaf на металлическом каркасе, обивка — оливковый бархат",
        "note": "Глубокий оливковый бархат красиво играет на свету."
      },
      {
        "kind": "fabric",
        "name": "Винный бархат",
        "color": "#6e1f2e",
        "photo": "assets/leaf2-wine.webp",
        "alt": "Стул Leaf на металлическом каркасе, обивка — винный бархат",
        "note": "Насыщенный винный цвет для винотек и сигарных комнат."
      },
      {
        "kind": "fabric",
        "name": "Песочный лён",
        "color": "#d8cbb4",
        "photo": "assets/leaf2-sand.webp",
        "alt": "Стул Leaf на металлическом каркасе, обивка — песочный лён",
        "note": "Светлый лён — лёгкий и сдержанный вариант."
      }
    ]
  },
  "decant": {
    "name": "Decant",
    "description": "Высокий барный стул: глубокое круглое кожаное сиденье, низкая спинка, обнимающая бока, кант по краю, тонкие чёрные ножки и латунное кольцо-подножка.",
    "variants": [
      {
        "kind": "leather",
        "name": "Табачная кожа",
        "color": "#9a5a2c",
        "photo": "assets/decant2-tobacco.webp",
        "alt": "Барный стул Decant на металлическом каркасе, обивка — табачная кожа",
        "note": "Тёплый табачный оттенок, классика сигарного бара."
      },
      {
        "kind": "leather",
        "name": "Бордовая кожа",
        "color": "#5e1f2a",
        "photo": "assets/decant2-burgundy.webp",
        "alt": "Барный стул Decant на металлическом каркасе, обивка — бордовая кожа",
        "note": "Глубокий бордовый — цвет выдержанного вина."
      },
      {
        "kind": "leather",
        "name": "Тёмно-зелёная кожа",
        "color": "#21402f",
        "photo": "assets/decant2-forest.webp",
        "alt": "Барный стул Decant на металлическом каркасе, обивка — тёмно-зелёная кожа",
        "note": "Благородный тёмно-зелёный с латунным кантом."
      }
    ]
  },
  "axis": {
    "name": "Axis",
    "description": "Рабочее кресло: тонкая спинка с горизонтальной прострочкой, сиденье с мягким передним краем, подлокотники из чёрной стали с накладками из ореха, пятилучевая опора на мягких роликах и газлифт.",
    "variants": [
      {
        "kind": "leather",
        "name": "Графитовая кожа",
        "color": "#46474a",
        "photo": "assets/axis2-graphite.webp",
        "alt": "Рабочее кресло Axis на металлическом каркасе, обивка — графитовая кожа",
        "note": "Сдержанный графит — универсальный цвет для кабинета и open space."
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#a8612f",
        "photo": "assets/axis2-cognac.webp",
        "alt": "Рабочее кресло Axis на металлическом каркасе, обивка — коньячная кожа",
        "note": "Тёплая коньячная кожа делает рабочее место уютнее."
      },
      {
        "kind": "fabric",
        "name": "Оливковая шерсть",
        "color": "#5c6440",
        "photo": "assets/axis2-olive.webp",
        "alt": "Рабочее кресло Axis на металлическом каркасе, обивка — оливковая шерсть",
        "note": "Мягкая шерстяная ткань глубокого оливкового цвета."
      }
    ]
  },
  "linea": {
    "name": "Linea",
    "description": "Консольное кресло для переговорной: каркас из одной чёрной стальной трубы без задних ножек, накладки из ореха на подлокотниках, спинка с горизонтальной прострочкой.",
    "variants": [
      {
        "kind": "leather",
        "name": "Чёрная кожа",
        "color": "#232325",
        "photo": "assets/linea2-black.webp",
        "alt": "Кресло Linea на металлическом каркасе, обивка — чёрная кожа",
        "note": "Строгая чёрная кожа для переговорных и кабинетов."
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#a8612f",
        "photo": "assets/linea2-cognac.webp",
        "alt": "Кресло Linea на металлическом каркасе, обивка — коньячная кожа",
        "note": "Тёплый коньячный оттенок смягчает деловой интерьер."
      },
      {
        "kind": "fabric",
        "name": "Графитовая шерсть",
        "color": "#4a4a4c",
        "photo": "assets/linea2-graphite.webp",
        "alt": "Кресло Linea на металлическом каркасе, обивка — графитовая шерсть",
        "note": "Плотная шерстяная ткань графитового цвета."
      }
    ]
  },
  "forum": {
    "name": "Forum",
    "description": "Мягкое сиденье в прямоугольном металлическом контуре. Стул для приёмных и зон ожидания.",
    "variants": [
      {
        "kind": "fabric",
        "name": "Песочная ткань",
        "color": "#c8ae84",
        "photo": "assets/forum-sand.webp",
        "alt": "Стул Forum на металлическом каркасе, обивка — песочная ткань"
      },
      {
        "kind": "fabric",
        "name": "Графитовая ткань",
        "color": "#4e5158",
        "photo": "assets/forum-graphite.webp",
        "alt": "Стул Forum на металлическом каркасе, обивка — графитовая ткань"
      },
      {
        "kind": "fabric",
        "name": "Терракотовая ткань",
        "color": "#a75a45",
        "photo": "assets/forum-terracotta.webp",
        "alt": "Стул Forum на металлическом каркасе, обивка — терракотовая ткань"
      }
    ]
  },
  "haven": {
    "name": "Haven",
    "description": "Мягкая спинка с плавным изгибом и металлические опоры бронзового оттенка. Стул для обеденной зоны.",
    "variants": [
      {
        "kind": "fabric",
        "name": "Молочная ткань",
        "color": "#ece2d4",
        "photo": "assets/haven-milk.webp",
        "alt": "Стул Haven на металлическом каркасе, обивка — молочная ткань"
      },
      {
        "kind": "fabric",
        "name": "Шалфейная ткань",
        "color": "#88957d",
        "photo": "assets/haven-sage.webp",
        "alt": "Стул Haven на металлическом каркасе, обивка — шалфейная ткань"
      },
      {
        "kind": "fabric",
        "name": "Терракотовая ткань",
        "color": "#a75a45",
        "photo": "assets/haven-terracotta.webp",
        "alt": "Стул Haven на металлическом каркасе, обивка — терракотовая ткань"
      }
    ]
  },
  "nook": {
    "name": "Nook",
    "description": "Кресло для чтения и отдыха: стёганая округлая спинка, мягкое сиденье и цельный каркас-полозья из плоско-овальной стальной трубы — подлокотники продолжают линию основания.",
    "variants": [
      {
        "kind": "fabric",
        "name": "Молочная ткань",
        "color": "#ebe4d8",
        "photo": "assets/nook-milk.webp",
        "alt": "Кресло Nook на чёрном стальном каркасе, обивка — молочное букле"
      },
      {
        "kind": "fabric",
        "name": "Оливковая ткань",
        "color": "#5a6230",
        "photo": "assets/nook-olive.webp",
        "alt": "Кресло Nook на чёрном стальном каркасе, обивка — оливковое букле"
      },
      {
        "kind": "fabric",
        "name": "Тёмно-синяя ткань",
        "color": "#26324f",
        "photo": "assets/nook-navy.webp",
        "alt": "Кресло Nook на чёрном стальном каркасе, обивка — тёмно-синее букле"
      }
    ]
  },
  "dune": {
    "name": "Dune",
    "description": "Полубарный стул для кухонного острова: сиденье-«седло» с очень низкой спинкой, тонкие чёрные ножки и квадратная подножка с ореховыми вставками.",
    "variants": [
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#a8612f",
        "photo": "assets/dune2-cognac.webp",
        "alt": "Полубарный стул Dune на металлическом каркасе, обивка — коньячная кожа",
        "note": "Коньячная кожа хорошо смотрится с мрамором и орехом."
      },
      {
        "kind": "fabric",
        "name": "Кремовое букле",
        "color": "#ece4d6",
        "photo": "assets/dune2-cream.webp",
        "alt": "Полубарный стул Dune на металлическом каркасе, обивка — кремовое букле",
        "note": "Мягкое светлое букле для светлых кухонь."
      },
      {
        "kind": "leather",
        "name": "Чёрная кожа",
        "color": "#232325",
        "photo": "assets/dune2-black.webp",
        "alt": "Полубарный стул Dune на металлическом каркасе, обивка — чёрная кожа",
        "note": "Графичный чёрный вариант для современных интерьеров."
      }
    ]
  },
  "ripple": {
    "name": "Ripple",
    "description": "Обеденный стул со спинкой-«ракушкой» и вертикальной прострочкой, мягким сиденьем и тонким чёрным стальным каркасом. Пара к полубарному Ripple Bar.",
    "variants": [
      {
        "kind": "leather",
        "name": "Шоколадная кожа",
        "color": "#4a2f26",
        "photo": "assets/ripple-chocolate.webp",
        "alt": "Стул Ripple на металлическом каркасе, обивка — шоколадная кожа",
        "note": "Глубокий шоколадный цвет и вертикальная прострочка — строго и тепло одновременно."
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#b05f2e",
        "photo": "assets/ripple-cognac.webp",
        "alt": "Стул Ripple на металлическом каркасе, обивка — коньячная кожа",
        "note": "Яркий коньячный оттенок, который со временем становится только благороднее."
      },
      {
        "kind": "fabric",
        "name": "Оливковая ткань",
        "color": "#556036",
        "photo": "assets/ripple-olive.webp",
        "alt": "Стул Ripple на металлическом каркасе, обивка — оливковая ткань",
        "note": "Плотная мягкая ткань глубокого оливкового цвета для спокойных интерьеров."
      }
    ]
  },
  "ripplebar": {
    "name": "Ripple Bar",
    "description": "Полубарный стул той же линии: спинка-«ракушка» с прострочкой, тонкий чёрный каркас и подножка с ореховыми вставками. Для барной стойки и кухонного острова.",
    "variants": [
      {
        "kind": "leather",
        "name": "Шоколадная кожа",
        "color": "#4a2f26",
        "photo": "assets/ripple-bar-chocolate.webp",
        "alt": "Полубарный стул Ripple Bar на металлическом каркасе, обивка — шоколадная кожа",
        "note": "Глубокий шоколадный цвет и вертикальная прострочка — строго и тепло одновременно."
      },
      {
        "kind": "leather",
        "name": "Коньячная кожа",
        "color": "#b05f2e",
        "photo": "assets/ripple-bar-cognac.webp",
        "alt": "Полубарный стул Ripple Bar на металлическом каркасе, обивка — коньячная кожа",
        "note": "Яркий коньячный оттенок, который со временем становится только благороднее."
      },
      {
        "kind": "fabric",
        "name": "Оливковая ткань",
        "color": "#556036",
        "photo": "assets/ripple-bar-olive.webp",
        "alt": "Полубарный стул Ripple Bar на металлическом каркасе, обивка — оливковая ткань",
        "note": "Плотная мягкая ткань глубокого оливкового цвета для спокойных интерьеров."
      }
    ]
  },
  "cove": {
    "name": "Cove",
    "description": "Лаунж-кресло с мягким округлым корпусом: спинка и подлокотники сливаются в одну непрерывную линию. Корпус словно парит на тонких чёрных опорах с гнутыми кронштейнами и вставками из ореха.",
    "variants": [
      {
        "kind": "fabric",
        "name": "Терракотовое букле",
        "color": "#a8573c",
        "photo": "assets/cove-terracotta.webp",
        "room": "assets/cove-terracotta-room.webp",
        "roomName": "Светлая гостиная",
        "alt": "Кресло Cove, обивка — терракотовое букле",
        "note": "Тёплый терракотовый оттенок оживляет светлый интерьер и красиво смотрится рядом с ореховой мебелью."
      },
      {
        "kind": "fabric",
        "name": "Шоколадное букле",
        "color": "#4e3126",
        "photo": "assets/cove-chocolate.webp",
        "room": "assets/cove-chocolate-room.webp",
        "roomName": "Кабинет и библиотека",
        "alt": "Кресло Cove, обивка — шоколадное букле",
        "note": "Глубокий шоколадный цвет для кабинета, библиотеки и вечернего лаунжа с тёплым светом."
      },
      {
        "kind": "fabric",
        "name": "Оливковое букле",
        "color": "#55592f",
        "photo": "assets/cove-olive.webp",
        "room": "assets/cove-olive-room.webp",
        "roomName": "Спальня у окна",
        "alt": "Кресло Cove, обивка — оливковое букле",
        "note": "Спокойный оливковый оттенок для спальни, зоны чтения и интерьеров с натуральным камнем."
      }
    ]
  }
};

const sizes = {
  "Tide": { w: 580, d: 560, h: 780, seat: 460 },
  "Pier": { w: 500, d: 535, h: 1150, seat: 750 },
  "Cask": { w: 830, d: 730, h: 700, seat: 450 },
  "Leaf": { w: 520, d: 560, h: 840, seat: 460 },
  "Decant": { w: 480, d: 500, h: 1000, seat: 750 },
  "Axis": { w: 620, d: 620, h: 1000, seat: 500 },
  "Linea": { w: 580, d: 600, h: 840, seat: 460 },
  "Forum": { w: 620, d: 650, h: 850, seat: 450 },
  "Haven": { w: 780, d: 720, h: 800, seat: 450 },
  "Nook": { w: 780, d: 720, h: 800, seat: 450 },
  "Dune": { w: 450, d: 480, h: 780, seat: 650 },
  "Cove": { w: 820, d: 780, h: 730, seat: 420 },
  "Ripple": { w: 480, d: 540, h: 800, seat: 460 },
  "Ripple Bar": { w: 480, d: 520, h: 970, seat: 650 }
};

function formatSize(size) {
  return size.w + " × " + size.d + " × " + size.h + " мм, высота сиденья " + size.seat + " мм";
}

function filterVariant(chair, kind) {
  return kind === "all" ? chair.variants[0] : chair.variants.find((variant) => variant.kind === kind);
}

const chairsByName = new Map(Object.values(chairs).map((chair) => [chair.name, chair]));

function renderSwatches(container, chair, selected, onSelect) {
  const buttons = chair.variants.map((variant) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.setAttribute("aria-pressed", String(variant === selected));

    const dot = document.createElement("span");
    dot.className = "swatch-dot";
    dot.style.backgroundColor = variant.color;
    dot.setAttribute("aria-hidden", "true");
    button.append(dot, variant.name);

    button.addEventListener("click", () => {
      buttons.forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
      onSelect(variant);
    });
    return button;
  });
  container.replaceChildren(...buttons);
}

const dialog = document.querySelector("#piece-dialog");
const pieceImage = document.querySelector("#piece-image");
const pieceTitle = document.querySelector("#piece-title");
const pieceMaterial = document.querySelector("#piece-material");
const pieceDescription = document.querySelector("#piece-description");
const pieceSwatches = document.querySelector("#piece-swatches");
const pieceSize = document.querySelector("#piece-size");
let activeChair;
let activeVariant;

// Ориентировочные цены, ₽. Заменить на свои после расчёта себестоимости.
const priceList = { leather: 35000, fabric: 26000 };
const priceOverrides = { "Cove": { fabric: 48000, leather: 56000 } }; // например: { "Tide": { leather: 42000 } }
const priceLine = document.querySelector("#price-line");
const briefPreview = document.querySelector("#brief-preview");
const briefPreviewImage = document.querySelector("#brief-preview-image");
const briefPreviewCaption = document.querySelector("#brief-preview-caption");

function formatPrice(amount) {
  return amount.toLocaleString("ru-RU") + " ₽";
}

function priceFor(chairName, kind) {
  return priceOverrides[chairName]?.[kind] ?? priceList[kind];
}

const kindLabels = { leather: "кожа", fabric: "ткань" };

// Обложка карточки — тот вариант, чьё фото стоит в разметке (у разных карточек разные цвета).
function cardVariant(card) {
  const chair = chairs[card.dataset.chair];
  if (!card.dataset.cover) card.dataset.cover = card.querySelector("img").getAttribute("src");
  return chair.variants.find((variant) => variant.photo === card.dataset.cover) ?? chair.variants[0];
}

document.querySelectorAll(".collection-card").forEach((card) => {
  const chair = chairs[card.dataset.chair];
  const price = document.createElement("span");
  price.className = "card-price";
  price.textContent = formatPrice(priceFor(chair.name, cardVariant(card).kind));
  card.querySelector(".card-caption > span").append(price);
});

function updateBriefPreview() {
  const chair = chairsByName.get(model.value);
  if (!chair) {
    briefPreview.hidden = true;
    return;
  }
  const variant = chair.variants.find((item) => item.name === upholstery.value) ?? chair.variants[0];
  briefPreview.hidden = false;
  swapPhoto(briefPreviewImage, variant.photo, variant.alt);
  briefPreviewCaption.textContent = "Примерный вид: " + chair.name + ", " + variant.name.toLowerCase() + ". Фото иллюстративное, точный цвет уточним по образцу.";
}

// Надбавки за свой материал, ₽. Ориентировочные, заменить на свои после расчёта.
const customSurcharge = { standard: 0, premium: 8000, exotic: 15000 };
const customMaterial = document.querySelector("#custom-material");
const customCategory = document.querySelector("#custom-category");

function updatePriceLine() {
  updateBriefPreview();
  const chair = chairsByName.get(model.value);
  if (!chair) {
    priceLine.textContent = "";
    return;
  }
  const ownMaterial = customMaterial.value.trim();
  if (ownMaterial) {
    const amount = priceFor(chair.name, "leather") + customSurcharge[customCategory.value];
    priceLine.textContent = "Свой материал «" + ownMaterial + "»: около " + formatPrice(amount) + ". Ориентировочно, точную цену уточним по образцу.";
    return;
  }
  const variant = chair.variants.find((item) => item.name === upholstery.value);
  if (variant) {
    priceLine.textContent = "Цена: " + formatPrice(priceFor(chair.name, variant.kind)) + " (" + kindLabels[variant.kind] + "). Ориентировочно.";
    return;
  }
  const kinds = [...new Set(chair.variants.map((item) => item.kind))];
  priceLine.textContent = kinds
    .map((kind) => kindLabels[kind][0].toUpperCase() + kindLabels[kind].slice(1) + " — " + formatPrice(priceFor(chair.name, kind)))
    .join(" · ") + ". Ориентировочно.";
}

const photoTimers = new WeakMap();

function swapPhoto(img, src, alt) {
  if (alt !== undefined) img.alt = alt;
  if (img.getAttribute("src") === src) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fadeMs = reduceMotion ? 0 : 320;

  clearTimeout(photoTimers.get(img));
  new Image().src = src;
  img.style.opacity = "0";

  const timer = setTimeout(() => {
    img.onload = () => { img.style.opacity = "1"; };
    img.src = src;
    if (img.complete && img.naturalWidth) img.style.opacity = "1";
  }, fadeMs);
  photoTimers.set(img, timer);
}

function showPieceVariant(variant) {
  activeVariant = variant;
  swapPhoto(pieceImage, variant.photo, variant.alt);
  pieceImage.parentElement.style.setProperty("--photo", `url("${variant.photo}")`);
  pieceMaterial.textContent = variant.name + " · " + formatPrice(priceFor(activeChair.name, variant.kind));
}

document.querySelectorAll(".collection:not(.lounge)").forEach((collection) => {
  const cards = collection.querySelectorAll(".collection-card");
  const filters = collection.querySelectorAll(".filters button[data-filter]");
  const catalogStatus = collection.querySelector(".catalog-status");
  let catalogFilter = "all";

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      catalogFilter = filter.dataset.filter;
      filters.forEach((button) => button.setAttribute("aria-pressed", String(button === filter)));
      let count = 0;
      cards.forEach((card) => {
        const chair = chairs[card.dataset.chair];
        const cover = cardVariant(card);
        const variant = catalogFilter === "all" || cover.kind === catalogFilter ? cover : filterVariant(chair, catalogFilter);
        card.hidden = !variant;
        if (card.parentElement.classList.contains("card-wrap")) card.parentElement.hidden = !variant;
        if (!variant) return;
        card.dataset.shown = variant.photo;

        swapPhoto(card.querySelector("img"), variant.photo);
        card.querySelector(".card-material").textContent = variant.name;
        card.querySelector(".card-price").textContent = formatPrice(priceFor(chairs[card.dataset.chair].name, variant.kind));
        count += 1;
      });
      catalogStatus.textContent = "Моделей в подборке — " + count;
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const chair = chairs[card.dataset.chair];
      const cover = cardVariant(card);
      openPiece(chair, catalogFilter === "all" || cover.kind === catalogFilter ? cover : filterVariant(chair, catalogFilter));
    });
  });
});

function openPiece(chair, variant = chair.variants[0]) {
  activeChair = chair;
  pieceTitle.textContent = chair.name;
  pieceDescription.textContent = chair.description;
  pieceSize.textContent = sizes[chair.name]
    ? "Ориентировочные размеры: " + formatSize(sizes[chair.name]) + ". Точные уточняем по образцу."
    : "";
  showPieceVariant(variant);
  renderSwatches(pieceSwatches, chair, variant, showPieceVariant);
  const pageLink = document.querySelector("#piece-page-link");
  const chairKey = Object.keys(chairs).find((key) => chairs[key] === chair);
  if (pageLink && chairKey) pageLink.href = "models/" + chairKey + ".html";
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const briefForm = document.querySelector("#brief-form");
const model = document.querySelector("#chair-model");
const upholstery = document.querySelector("#upholstery");
const description = document.querySelector("#description");
const briefStatus = document.querySelector("#brief-status");

const allMaterials = [...new Set(Object.values(chairs).flatMap((chair) => chair.variants.map((variant) => variant.name)))];
const chooseMaterial = "Подобрать материал";

function updateBriefMaterials(selected = upholstery.value) {
  const chair = chairsByName.get(model.value);
  const names = chair ? chair.variants.map((variant) => variant.name) : allMaterials;
  upholstery.replaceChildren(
    new Option(chooseMaterial, chooseMaterial),
    ...names.map((name) => new Option(name, name)),
  );
  upholstery.value = names.includes(selected) ? selected : chooseMaterial;
  updatePriceLine();
}

model.addEventListener("change", () => updateBriefMaterials());
upholstery.addEventListener("change", updatePriceLine);
updateBriefMaterials();

function fillBrief(chair, variant) {
  model.value = chair.name;
  updateBriefMaterials(variant.name);
  briefStatus.textContent = "";
  briefForm.scrollIntoView();
  description.focus({ preventScroll: true });
}

document.querySelector("#add-to-brief").addEventListener("click", () => {
  dialog.close();
  fillBrief(activeChair, activeVariant);
});

const storyBand = document.querySelector(".story:not(.about)");
if (storyBand && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  storyBand.addEventListener("pointermove", (event) => {
    const box = storyBand.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    storyBand.style.setProperty("--shift-x", (x * -44).toFixed(1) + "px");
    storyBand.style.setProperty("--shift-y", (y * -30).toFixed(1) + "px");
  });
  storyBand.addEventListener("pointerleave", () => {
    storyBand.style.setProperty("--shift-x", "0px");
    storyBand.style.setProperty("--shift-y", "0px");
  });
}

const storyPhotos = [...new Set(Object.values(chairs).flatMap((chair) => chair.variants.map((variant) => variant.photo)))];
// Фото стульев листаются только в блоке «О стульях»; шапка остаётся спокойной, без фото.
const storyHosts = [storyBand].filter(Boolean);
const storyFrameSets = storyHosts.map((host) => {
  const layer = document.createElement("div");
  layer.className = host.classList.contains("site-header") ? "story-slides header-slides" : "story-slides";
  layer.setAttribute("aria-hidden", "true");
  const frames = storyPhotos.map((photo) => {
    const frame = document.createElement("div");
    frame.className = "story-slide";
    if (host === storyBand) {
      // Full photo in the centre; a blurred copy of the same photo fills the sides (see .has-fill in CSS).
      frame.classList.add("has-fill");
      frame.style.setProperty("--photo", `url("${photo}")`);
    } else {
      frame.style.backgroundImage = `url("${photo}")`;
    }
    layer.append(frame);
    return frame;
  });
  host.prepend(layer);
  return frames;
});

const siteHeader = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
const updateHeaderState = () => {
  const y = window.scrollY;
  siteHeader.classList.toggle("is-scrolled", y > 120);
  if (y > lastScrollY && y > 120) siteHeader.classList.add("is-hidden");
  else if (y < lastScrollY) siteHeader.classList.remove("is-hidden");
  lastScrollY = y;
  const probe = document.elementFromPoint(window.innerWidth / 2, siteHeader.offsetHeight + 6);
  siteHeader.classList.toggle("is-on-dark", Boolean(probe?.closest(".story:not(.about)")));
};
window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

// Слайды «О стульях»: листаются сами и вручную (стрелки, свайп, клавиши, выбор модели).
// Порядок совпадает со storyPhotos: каждая фотография каталога один раз.
const storyItems = [];
{
  const seen = new Set();
  Object.entries(chairs).forEach(([key, chair]) => chair.variants.forEach((variant) => {
    if (seen.has(variant.photo)) return;
    seen.add(variant.photo);
    storyItems.push({ key, chair, variant });
  }));
}

let storyCurrent = 0;
let storyTimer;
const STORY_DELAY = 4200;
const STORY_PAUSE_AFTER_USER = 9000;

const storyInner = storyBand?.querySelector(".story-inner > div");
let storyControls;
if (storyInner && storyItems.length > 1) {
  storyControls = document.createElement("div");
  storyControls.className = "story-controls";
  storyControls.innerHTML = `
    <div class="story-switch">
      <button class="story-nav story-prev" type="button" aria-label="Предыдущее фото"><svg class="icon" aria-hidden="true"><use href="#arrow-right"/></svg></button>
      <button class="story-chair" type="button" aria-label="Открыть модель в каталоге">
        <span class="story-chair-name"></span>
        <span class="story-chair-variant"></span>
      </button>
      <button class="story-nav story-next" type="button" aria-label="Следующее фото"><svg class="icon" aria-hidden="true"><use href="#arrow-right"/></svg></button>
      <span class="story-count" aria-live="polite"></span>
    </div>
    <div class="story-models" role="group" aria-label="Модели каталога"></div>`;
  const models = storyControls.querySelector(".story-models");
  Object.entries(chairs).forEach(([key, chair]) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "story-model";
    chip.dataset.chair = key;
    chip.textContent = chair.name;
    chip.addEventListener("click", () => {
      showStory(storyItems.findIndex((item) => item.key === key), true);
    });
    models.append(chip);
  });
  storyInner.append(storyControls);

  storyControls.querySelector(".story-prev").addEventListener("click", () => showStory(storyCurrent - 1, true));
  storyControls.querySelector(".story-next").addEventListener("click", () => showStory(storyCurrent + 1, true));
  storyControls.querySelector(".story-chair").addEventListener("click", () => {
    const { chair, variant } = storyItems[storyCurrent];
    openPiece(chair, variant);
  });
  storyControls.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showStory(storyCurrent - 1, true); }
    if (event.key === "ArrowRight") { event.preventDefault(); showStory(storyCurrent + 1, true); }
  });

  // Свайп по блоку на телефоне.
  let touchX = null;
  let touchY = null;
  storyBand.addEventListener("touchstart", (event) => {
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
  }, { passive: true });
  storyBand.addEventListener("touchend", (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    const dy = event.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showStory(storyCurrent + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
}

function updateStoryControls() {
  if (!storyControls) return;
  const { key, chair, variant } = storyItems[storyCurrent];
  storyControls.querySelector(".story-chair-name").textContent = chair.name;
  storyControls.querySelector(".story-chair-variant").textContent = variant.name;
  storyControls.querySelector(".story-count").textContent = (storyCurrent + 1) + " / " + storyItems.length;
  storyControls.querySelectorAll(".story-model").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.chair === key));
  });
}

function scheduleStory(delay = STORY_DELAY) {
  clearTimeout(storyTimer);
  storyTimer = setTimeout(() => {
    showStory(storyCurrent + 1);
  }, delay);
}

function showStory(index, byUser = false) {
  if (index < 0 && !byUser) index = 0;
  storyFrameSets.forEach((frames) => frames[storyCurrent].classList.remove("is-active"));
  storyCurrent = (index + storyPhotos.length) % storyPhotos.length;
  storyFrameSets.forEach((frames) => frames[storyCurrent].classList.add("is-active"));
  updateStoryControls();
  // Слайды листаются всегда, независимо от настройки «уменьшить движение» в системе.
  // После ручного переключения автопрокрутка ждёт дольше, чтобы фото можно было рассмотреть.
  if (storyPhotos.length > 1) scheduleStory(byUser ? STORY_PAUSE_AFTER_USER : STORY_DELAY);
}

showStory(0);

const materialModel = document.querySelector("#material-model");
const materialModelName = document.querySelector("#material-model-name");
const materialImage = document.querySelector("#material-image");
const materialCaption = document.querySelector("#material-caption");
const materialDescription = document.querySelector("#material-description");
const materialSwatches = document.querySelector("#material-swatches");
let featuredChair;
let featuredVariant;

function showMaterialVariant(variant) {
  featuredVariant = variant;
  swapPhoto(materialImage, variant.photo, variant.alt);
  materialCaption.textContent = variant.name;
  materialDescription.textContent = variant.note ?? featuredChair.description;
}

function showMaterialModel() {
  featuredChair = chairsByName.get(materialModel.value);
  materialModelName.textContent = featuredChair.name;
  showMaterialVariant(featuredChair.variants[0]);
  renderSwatches(materialSwatches, featuredChair, featuredVariant, showMaterialVariant);
}

materialModel.addEventListener("change", showMaterialModel);
showMaterialModel();

document.querySelector("#choose-material").addEventListener("click", () => {
  fillBrief(featuredChair, featuredVariant);
});

briefForm.addEventListener("input", () => {
  description.setCustomValidity("");
  briefStatus.textContent = "";
});
briefForm.querySelector('button[type="submit"]').disabled = false;

function briefLines() {
  const qty = briefForm.querySelector("#brief-qty").value.trim();
  const city = briefForm.querySelector("#brief-city").value.trim();
  return [
    "Wrightson & Vale",
    "Бриф на изготовление стульев",
    "",
    "Имя — " + briefForm.querySelector("#brief-name").value.trim(),
    "Контакт — " + briefForm.querySelector("#brief-contact").value.trim(),
    ...(city ? ["Город — " + city] : []),
    "",
    "Модель — " + model.value,
    "Обивка — " + upholstery.value,
    ...(customMaterial.value.trim() ? ["Свой материал — " + customMaterial.value.trim() + " (" + customCategory.selectedOptions[0].textContent + ")"] : []),
    ...(qty ? ["Количество — " + qty + " шт."] : []),
    "Каркас — металл",
    ...(sizes[model.value] ? ["Размеры (ориентировочно) — " + formatSize(sizes[model.value])] : []),
    ...(priceLine.textContent ? ["", priceLine.textContent] : []),
    "",
    "Описание проекта",
    description.value.trim(),
    "",
  ];
}

function downloadBrief() {
  const file = new Blob(["\uFEFF", briefLines().join("\r\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const download = document.createElement("a");
  download.href = url;
  download.download = "Wrightson-Vale-brief.txt";
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelector("#brief-download").addEventListener("click", () => {
  downloadBrief();
  briefStatus.textContent = "Бриф скачан. Его можно отправить на wv@wrightsonvale.ru.";
});

briefForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!description.value.trim()) {
    description.setCustomValidity("Добавьте описание проекта.");
  }
  if (!briefForm.reportValidity()) return;
  const button = briefForm.querySelector('button[type="submit"]');
  button.disabled = true;
  briefStatus.textContent = "Отправляем заявку…";
  const result = await sendLead({
    _subject: "Заявка с сайта: " + model.value,
    "Тип": "Бриф на изготовление",
    "Имя": briefForm.querySelector("#brief-name").value.trim(),
    "Контакт": briefForm.querySelector("#brief-contact").value.trim(),
    "Город": briefForm.querySelector("#brief-city").value.trim(),
    "Модель": model.value,
    "Обивка": upholstery.value,
    "Свой материал": customMaterial.value.trim(),
    "Количество": briefForm.querySelector("#brief-qty").value.trim(),
    "Ориентировочная цена": priceLine.textContent,
    "Описание": description.value.trim(),
    _honey: briefForm.querySelector(".hp-field").value,
  }, briefLines().join("\n"));
  button.disabled = false;
  if (result === "sent") {
    briefStatus.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами в рабочее время.";
    description.value = "";
    reachGoal("lead_brief");
  } else {
    briefStatus.textContent = "Не получилось отправить с сайта — открываем письмо с заполненным брифом. Отправьте его, и мы ответим.";
    reachGoal("lead_brief_mailto");
  }
});

const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector("#site-search");
const searchInput = document.querySelector("#site-search-input");
const searchResults = document.querySelector("#site-search-results");

function openChairFromSearch(key) {
  openPiece(chairs[key]);
}

const searchIndex = [
  ...Object.entries(chairs).map(([key, chair]) => ({
    label: chair.name,
    hint: "Модель",
    text: [chair.name, chair.description, ...chair.variants.map((variant) => variant.name + " " + (variant.note ?? ""))].join(" ").toLowerCase(),
    run: () => openChairFromSearch(key),
  })),
  { label: "Коллекции стульев", hint: "Раздел", text: "коллекции стулья модели каталог", target: "#collections" },
  { label: "Для кофеен", hint: "Коллекция · серия Caffè", text: "caffe caffè кофейни кофейня кафе", target: "#collection" },
  { label: "Винные и сигарные бутики", hint: "Коллекция · серия Riserva", text: "riserva вино сигары винный бутик сигарный винотека магазин", target: "#wine-cigar" },
  { label: "Офис и переговорные", hint: "Коллекция · серия Studio", text: "studio офис кабинет переговорная приёмная рабочее место", target: "#office" },
  { label: "Для дома", hint: "Коллекция · серия Casa", text: "casa дом кухня обеденная зона гостиная", target: "#home" },
  { label: "Цвет и фактура", hint: "Обивка", text: "обивка цвет фактура кожа ткань материал", target: "#materials" },
  { label: "Заказ и бриф", hint: "Раздел", text: "заказ бриф проект индивидуальный описание проекта", target: "#project" },
  { label: "О нас", hint: "Раздел", text: "о нас компания ателье мастера", target: "#about" },
];

function renderSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const items = query
    ? searchIndex.filter((item) => item.text.includes(query) || item.label.toLowerCase().includes(query))
    : searchIndex;
  const rows = items.slice(0, 8).map((item) => {
    const row = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "site-search-item";
    const label = document.createElement("span");
    label.textContent = item.label;
    const hint = document.createElement("small");
    hint.textContent = item.hint;
    button.append(label, hint);
    button.addEventListener("click", () => {
      setSearchOpen(false);
      if (item.run) {
        item.run();
      } else {
        document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth" });
      }
    });
    row.append(button);
    return row;
  });
  searchResults.replaceChildren(...(rows.length ? rows : [Object.assign(document.createElement("li"), { textContent: "Ничего не найдено" })]));
}

function setSearchOpen(open) {
  searchPanel.hidden = !open;
  searchToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    renderSearch();
    searchInput.focus();
  }
}

searchToggle.addEventListener("click", () => setSearchOpen(searchPanel.hidden));
searchInput.addEventListener("input", renderSearch);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !searchPanel.hidden) setSearchOpen(false);
});

const projectBand = document.querySelector(".project-band");
if (projectBand) {
  const projectLayer = document.createElement("div");
  projectLayer.className = "story-slides";
  projectLayer.setAttribute("aria-hidden", "true");
  const projectFrames = ["assets/cafe-hero-small.webp", "assets/reserve-interior.webp"].map((photo) => {
    const frame = document.createElement("div");
    frame.className = "story-slide";
    frame.style.backgroundImage = `url("${photo}")`;
    projectLayer.append(frame);
    return frame;
  });
  projectBand.prepend(projectLayer);

  const reduceProject = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceProject) {
    const waitProject = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    (async () => {
      let current = 0;
      while (true) {
        projectFrames[current].classList.add("is-active");
        await waitProject(600 + 3000);
        projectFrames[current].classList.remove("is-active");
        await waitProject(600);
        current = (current + 1) % projectFrames.length;
      }
    })();
  } else {
    projectFrames[0].classList.add("is-active");
  }
}

customMaterial.addEventListener("input", updatePriceLine);
customCategory.addEventListener("change", updatePriceLine);


// Коллекция Salotto (лаунж-кресла): кресло Cove, три цвета, студия или интерьер, точки на фото лобби.
const lounge = document.querySelector("#lounge");
if (lounge) {
  const cove = chairs.cove;
  const loungeImage = lounge.querySelector("#lounge-image");
  const loungePhoto = lounge.querySelector(".lounge-photo");
  const loungeCaption = lounge.querySelector("#lounge-caption");
  const loungeRoom = lounge.querySelector("#lounge-room");
  const loungeCount = lounge.querySelector("#lounge-count");
  const loungeNote = lounge.querySelector("#lounge-note");
  const loungePrice = lounge.querySelector("#lounge-price");
  const loungeSwatches = lounge.querySelector("#lounge-swatches");
  const viewButtons = lounge.querySelectorAll("[data-view]");
  const hotspots = lounge.querySelectorAll(".lounge-hotspot");
  let loungeIndex = 0;
  let loungeView = "studio";

  loungePrice.textContent = "от " + formatPrice(priceFor(cove.name, "fabric"));
  lounge.querySelector("#lounge-size").textContent = sizes.Cove.w + " × " + sizes.Cove.d + " × " + sizes.Cove.h + " мм";
  lounge.querySelector("#lounge-seat").textContent = sizes.Cove.seat + " мм";

  function renderLounge() {
    const variant = cove.variants[loungeIndex];
    const src = loungeView === "room" ? variant.room : variant.photo;
    swapPhoto(loungeImage, src, variant.alt + (loungeView === "room" ? ", в интерьере" : ""));
    loungePhoto.style.setProperty("--photo", `url("${src}")`);
    loungeCaption.textContent = variant.name;
    loungeRoom.textContent = loungeView === "room" ? variant.roomName : "Студийный кадр";
    loungeCount.textContent = String(loungeIndex + 1).padStart(2, "0") + " / " + String(cove.variants.length).padStart(2, "0");
    loungeNote.textContent = variant.note;
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === loungeView)));
    hotspots.forEach((spot) => spot.setAttribute("aria-pressed", String(Number(spot.dataset.variant) === loungeIndex)));
    loungeSwatches.querySelectorAll(".swatch").forEach((button, i) => button.setAttribute("aria-pressed", String(i === loungeIndex)));
  }

  function selectLounge(index) {
    loungeIndex = (index + cove.variants.length) % cove.variants.length;
    renderLounge();
  }

  renderSwatches(loungeSwatches, cove, cove.variants[0], (variant) => selectLounge(cove.variants.indexOf(variant)));
  viewButtons.forEach((button) => button.addEventListener("click", () => {
    loungeView = button.dataset.view;
    renderLounge();
  }));
  lounge.querySelector(".lounge-prev").addEventListener("click", () => selectLounge(loungeIndex - 1));
  lounge.querySelector(".lounge-next").addEventListener("click", () => selectLounge(loungeIndex + 1));
  hotspots.forEach((spot) => spot.addEventListener("click", () => {
    selectLounge(Number(spot.dataset.variant));
    if (window.matchMedia("(max-width: 900px)").matches) {
      lounge.querySelector(".lounge-stage").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }));
  lounge.querySelectorAll(".lounge-more .collection-card").forEach((card) => {
    card.addEventListener("click", () => {
      const chair = chairs[card.dataset.chair];
      const src = card.querySelector("img").getAttribute("src");
      openPiece(chair, chair.variants.find((variant) => variant.photo === src) ?? chair.variants[0]);
    });
  });
  lounge.querySelector("#lounge-open").addEventListener("click", () => openPiece(cove, cove.variants[loungeIndex]));
  lounge.querySelector("#lounge-brief").addEventListener("click", () => fillBrief(cove, cove.variants[loungeIndex]));

  // Свайп по фото на телефоне.
  let loungeTouch = null;
  loungePhoto.addEventListener("touchstart", (event) => {
    loungeTouch = [event.touches[0].clientX, event.touches[0].clientY];
  }, { passive: true });
  loungePhoto.addEventListener("touchend", (event) => {
    if (!loungeTouch) return;
    const dx = event.changedTouches[0].clientX - loungeTouch[0];
    const dy = event.changedTouches[0].clientY - loungeTouch[1];
    loungeTouch = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) selectLounge(loungeIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Подгружаем все фото заранее, чтобы переключение было мгновенным.
  cove.variants.forEach((variant) => { new Image().src = variant.photo; new Image().src = variant.room; });
  renderLounge();
}

document.querySelectorAll("[data-open-chair]").forEach((button) => {
  button.addEventListener("click", () => openPiece(chairs[button.dataset.openChair]));
});



// ---------------------------------------------------------------------------
// Карточки: точки цветов, смена фото при наведении, сравнение моделей.
const TELEGRAM_URL = ""; // например "https://t.me/wrightson_vale_bot" — кнопка появится сама
const compareKeys = [];
const compareBar = document.querySelector("#compare-bar");
const compareText = document.querySelector("#compare-bar-text");
const compareDialog = document.querySelector("#compare-dialog");
const compareTable = document.querySelector("#compare-table");

function updateCompare() {
  document.querySelectorAll(".compare-toggle").forEach((toggle) => {
    const on = compareKeys.includes(toggle.dataset.chair);
    toggle.setAttribute("aria-pressed", String(on));
    toggle.querySelector("span").textContent = on ? "В сравнении" : "Сравнить";
  });
  compareBar.hidden = compareKeys.length === 0;
  compareText.textContent = "Сравнение: " + compareKeys.map((key) => chairs[key].name).join(", ") +
    (compareKeys.length < 2 ? " — добавьте ещё модель" : "");
  document.querySelector("#compare-open").disabled = compareKeys.length < 2;
}

function toggleCompare(key) {
  const i = compareKeys.indexOf(key);
  if (i >= 0) compareKeys.splice(i, 1);
  else {
    if (compareKeys.length >= 3) compareKeys.shift();
    compareKeys.push(key);
  }
  updateCompare();
}

function renderCompare() {
  const kindsOf = (chair) => [...new Set(chair.variants.map((v) => v.kind))];
  const rows = [
    ["", (c) => { const img = document.createElement("img"); img.src = c.variants[0].photo; img.alt = c.name; return img; }],
    ["Модель", (c) => c.name],
    ["Размеры", (c) => sizes[c.name] ? sizes[c.name].w + " × " + sizes[c.name].d + " × " + sizes[c.name].h + " мм" : "—"],
    ["Высота сиденья", (c) => sizes[c.name] ? sizes[c.name].seat + " мм" : "—"],
    ["Цена", (c) => kindsOf(c).map((k) => kindLabels[k] + " — " + formatPrice(priceFor(c.name, k))).join("\n")],
    ["Цвета", (c) => c.variants.map((v) => v.name).join("\n")],
  ];
  const table = document.createElement("table");
  rows.forEach(([label, get]) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = label;
    tr.append(th);
    compareKeys.forEach((key) => {
      const td = document.createElement("td");
      const value = get(chairs[key]);
      if (typeof value === "string") td.textContent = value; else td.append(value);
      tr.append(td);
    });
    table.append(tr);
  });
  const tr = document.createElement("tr");
  tr.append(document.createElement("th"));
  compareKeys.forEach((key) => {
    const td = document.createElement("td");
    const open = document.createElement("button");
    open.type = "button";
    open.className = "text-link compare-pick";
    open.textContent = "Открыть карточку";
    open.addEventListener("click", () => { compareDialog.close(); openPiece(chairs[key]); });
    td.append(open);
    tr.append(td);
  });
  table.append(tr);
  compareTable.replaceChildren(table);
}

document.querySelector("#compare-open").addEventListener("click", () => {
  renderCompare();
  compareDialog.showModal();
});
document.querySelector("#compare-clear").addEventListener("click", () => { compareKeys.length = 0; updateCompare(); });
compareDialog.querySelector(".dialog-close").addEventListener("click", () => compareDialog.close());
compareDialog.addEventListener("click", (event) => { if (event.target === compareDialog) compareDialog.close(); });

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
document.querySelectorAll(".collection-card[data-chair]").forEach((card) => {
  const chair = chairs[card.dataset.chair];
  if (!chair) return;
  const cover = cardVariant(card);
  card.dataset.shown = cover.photo;

  // Точки цветов вместо плашки «3 цвета»
  const dots = document.createElement("span");
  dots.className = "card-dots";
  dots.setAttribute("aria-label", chair.variants.length + " цвета обивки");
  chair.variants.forEach((variant) => {
    const dot = document.createElement("span");
    dot.className = "card-dot";
    dot.style.backgroundColor = variant.color;
    dot.title = variant.name;
    dots.append(dot);
  });
  card.querySelector(".card-caption > span").append(dots);

  // Кнопка сравнения рядом с карточкой (внутри кнопки-карточки нельзя)
  const wrap = document.createElement("div");
  wrap.className = "card-wrap";
  card.replaceWith(wrap);
  wrap.append(card);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "compare-toggle";
  toggle.dataset.chair = card.dataset.chair;
  toggle.setAttribute("aria-pressed", "false");
  toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg><span>Сравнить</span>';
  toggle.addEventListener("click", () => toggleCompare(card.dataset.chair));
  wrap.append(toggle);

  // При наведении — другой цвет той же модели (у Cove — фото в интерьере)
  if (canHover) {
    const img = card.querySelector(".card-image img");
    card.addEventListener("mouseenter", () => {
      const shown = chair.variants.find((v) => v.photo === card.dataset.shown) ?? cover;
      const alt = shown.room ?? (chair.variants.find((v) => v !== shown && v.kind === shown.kind) ?? chair.variants.find((v) => v !== shown))?.photo;
      if (alt) swapPhoto(img, alt);
    });
    card.addEventListener("mouseleave", () => swapPhoto(img, card.dataset.shown));
  }
});
updateCompare();

// Плавающая кнопка «Связаться»
{
  const fab = document.querySelector("#contact-fab");
  const panel = document.querySelector("#contact-fab-panel");
  const toggle = fab.querySelector(".contact-fab-toggle");
  const telegram = document.querySelector("#contact-fab-telegram");
  if (TELEGRAM_URL) { telegram.href = TELEGRAM_URL; telegram.target = "_blank"; telegram.rel = "noopener"; telegram.hidden = false; }
  const setOpen = (open) => { panel.hidden = !open; toggle.setAttribute("aria-expanded", String(open)); };
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  panel.addEventListener("click", (event) => { if (event.target.closest("a")) setOpen(false); });
  document.addEventListener("click", (event) => { if (!fab.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
}

/* ===== Заявки, подбор, расчёт, образцы (11.11) ===== */

// Куда уходят заявки: адрес функции в Яндекс Облаке (данные хранятся в России, 152-ФЗ).
// Пока пусто — заявка открывается письмом в почте посетителя на wv@wrightsonvale.ru.
const LEAD_ENDPOINT = "https://functions.yandexcloud.net/d4e975m4m3tro265j0kb";
const LEAD_EMAIL = "wv@wrightsonvale.ru";
// Номер счётчика Яндекс Метрики, например "98765432". Пока пусто — счётчик не подключается.
const METRIKA_ID = "";

if (METRIKA_ID) {
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  window.ym(Number(METRIKA_ID), "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
}

function reachGoal(goal) {
  try { if (METRIKA_ID && window.ym) window.ym(Number(METRIKA_ID), "reachGoal", goal); } catch {}
}

async function sendLead(fields, plainText) {
  if (fields._honey) return "sent";
  const clean = Object.fromEntries(Object.entries(fields).filter(([key, value]) => key !== "_honey" && key !== "consent" && String(value ?? "").trim() !== ""));
  if (LEAD_ENDPOINT) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...clean, "Согласие на обработку ПДн": "да, " + new Date().toLocaleString("ru-RU"), _page: location.href }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await response.json().catch(() => ({}));
      if (response.ok && String(data.success) !== "false") return "sent";
    } catch {}
  }
  const body = plainText.length > 1800 ? plainText.slice(0, 1800) + "…" : plainText;
  window.location.href = "mailto:" + LEAD_EMAIL + "?subject=" + encodeURIComponent(fields._subject || "Заявка с сайта") + "&body=" + encodeURIComponent(body);
  return "mailto";
}

const chairKeyByName = new Map(Object.entries(chairs).map(([key, chair]) => [chair.name, key]));
const kindsOfChair = (chair) => [...new Set(chair.variants.map((variant) => variant.kind))];
const minPrice = (chair) => Math.min(...kindsOfChair(chair).map((kind) => priceFor(chair.name, kind)));

// ---- Расчёт стоимости ----
const calcForm = document.querySelector("#calc");
const calcModel = document.querySelector("#calc-model");
const calcKind = document.querySelector("#calc-kind");
const calcQty = document.querySelector("#calc-qty");
const calcUnit = document.querySelector("#calc-unit");
const calcTotal = document.querySelector("#calc-total");

function fillCalcKinds(keep) {
  const chair = chairsByName.get(calcModel.value);
  const options = kindsOfChair(chair).map((kind) => new Option(kindLabels[kind][0].toUpperCase() + kindLabels[kind].slice(1) + " — " + formatPrice(priceFor(chair.name, kind)), kind));
  options.push(new Option("Свой материал: обычный", "custom:standard"));
  options.push(new Option("Свой материал: премиум (+8 000 ₽)", "custom:premium"));
  options.push(new Option("Свой материал: редкий (+15 000 ₽)", "custom:exotic"));
  calcKind.replaceChildren(...options);
  if (keep && [...calcKind.options].some((option) => option.value === keep)) calcKind.value = keep;
}

function calcUnitPrice() {
  const chair = chairsByName.get(calcModel.value);
  const value = calcKind.value;
  if (value.startsWith("custom:")) return priceFor(chair.name, "leather") + customSurcharge[value.slice(7)];
  return priceFor(chair.name, value);
}

function calcQuantity() {
  const qty = Math.round(Number(calcQty.value));
  return Number.isFinite(qty) && qty > 0 ? Math.min(qty, 5000) : 1;
}

function updateCalc() {
  const unit = calcUnitPrice();
  calcUnit.textContent = formatPrice(unit);
  calcTotal.textContent = formatPrice(unit * calcQuantity());
}

if (calcForm) {
  fillCalcKinds();
  updateCalc();
  calcModel.addEventListener("change", () => { fillCalcKinds(calcKind.value); updateCalc(); });
  calcKind.addEventListener("change", updateCalc);
  calcQty.addEventListener("input", updateCalc);
  calcQty.addEventListener("blur", () => { calcQty.value = calcQuantity(); updateCalc(); });
  calcForm.querySelectorAll(".calc-step").forEach((button) => button.addEventListener("click", () => {
    calcQty.value = Math.max(1, calcQuantity() + Number(button.dataset.step));
    updateCalc();
  }));
  calcForm.addEventListener("submit", (event) => event.preventDefault());
  document.querySelector("#calc-to-brief").addEventListener("click", () => {
    const chair = chairsByName.get(calcModel.value);
    const value = calcKind.value;
    const qty = calcQuantity();
    let variant = chair.variants[0];
    if (value.startsWith("custom:")) {
      customCategory.value = value.slice(7);
      if (!customMaterial.value.trim()) customMaterial.value = "Свой материал";
    } else {
      variant = chair.variants.find((item) => item.kind === value) ?? variant;
      customMaterial.value = "";
    }
    briefForm.querySelector("#brief-qty").value = qty;
    if (!description.value.trim()) {
      description.value = qty + " шт. " + chair.name + ", " + (value.startsWith("custom:") ? "свой материал" : kindLabels[value]) + ". Ориентировочно " + formatPrice(calcUnitPrice() * qty) + ".";
    }
    fillBrief(chair, variant);
    if (value.startsWith("custom:")) updatePriceLine();
    reachGoal("calc_to_brief");
  });
}

function setCalcModel(name) {
  if (!calcForm || !chairsByName.has(name)) return;
  calcModel.value = name;
  fillCalcKinds();
  updateCalc();
}

// ---- Подбор за 4 вопроса ----
const quizProfiles = {
  tide: { place: ["cafe", "home"], seat: ["dining", "lounge"] },
  pier: { place: ["cafe", "wine"], seat: ["bar"] },
  ripple: { place: ["cafe", "home"], seat: ["dining"] },
  ripplebar: { place: ["cafe", "home"], seat: ["bar"] },
  cove: { place: ["cafe", "home", "office"], seat: ["lounge"] },
  cask: { place: ["wine", "cafe"], seat: ["dining"] },
  leaf: { place: ["wine", "home"], seat: ["dining"] },
  decant: { place: ["wine", "cafe"], seat: ["bar"] },
  axis: { place: ["office", "home"], seat: ["work"] },
  linea: { place: ["office", "wine"], seat: ["work", "dining"] },
  forum: { place: ["office", "cafe"], seat: ["lounge", "dining"] },
  haven: { place: ["home", "cafe"], seat: ["dining"] },
  nook: { place: ["home", "office"], seat: ["lounge"] },
  dune: { place: ["home", "cafe"], seat: ["bar"] },
};

const quizQuestions = [
  { key: "place", title: "Где будут стоять стулья?", options: [["cafe", "Кофейня или кафе"], ["wine", "Винный или сигарный бутик, бар"], ["office", "Офис или переговорная"], ["home", "Дом или квартира"]] },
  { key: "seat", title: "Для чего нужен стул?", options: [["dining", "За обеденный стол"], ["bar", "К барной стойке или острову"], ["lounge", "Для отдыха и ожидания"], ["work", "Для работы и переговоров"]] },
  { key: "kind", title: "Какая обивка ближе?", options: [["leather", "Кожа"], ["fabric", "Ткань"], ["any", "Пока не знаю"]] },
  { key: "budget", title: "Бюджет за один стул?", options: [["30000", "До 30 000 ₽"], ["40000", "До 40 000 ₽"], ["any", "Не важно"]] },
];

const quizBody = document.querySelector("#quiz-body");
const quizStep = document.querySelector("#quiz-step");
const quizBar = document.querySelector("#quiz-bar");
const quizRestart = document.querySelector("#quiz-restart");
let quizAnswers = {};
let quizIndex = 0;

function quizScore(key, answers) {
  const chair = chairs[key];
  const profile = quizProfiles[key];
  if (!profile) return -99;
  let score = 0;
  const placeAt = profile.place.indexOf(answers.place);
  score += placeAt === 0 ? 4 : placeAt > 0 ? 2 : 0;
  const seatAt = profile.seat.indexOf(answers.seat);
  score += seatAt === 0 ? 5 : seatAt > 0 ? 2 : -3;
  if (answers.kind !== "any") score += kindsOfChair(chair).includes(answers.kind) ? 2 : -2;
  if (answers.budget !== "any") {
    const limit = Number(answers.budget);
    const price = answers.kind !== "any" && kindsOfChair(chair).includes(answers.kind) ? priceFor(chair.name, answers.kind) : minPrice(chair);
    score += price <= limit ? 1 : -4;
  }
  return score;
}

function renderQuiz() {
  quizRestart.hidden = quizIndex === 0;
  if (quizIndex < quizQuestions.length) {
    const question = quizQuestions[quizIndex];
    quizStep.textContent = "Вопрос " + (quizIndex + 1) + " из " + quizQuestions.length;
    quizBar.style.width = (quizIndex / quizQuestions.length) * 100 + "%";
    const title = document.createElement("h3");
    title.textContent = question.title;
    const list = document.createElement("div");
    list.className = "quiz-options";
    question.options.forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = label;
      button.addEventListener("click", () => {
        quizAnswers[question.key] = value;
        quizIndex += 1;
        renderQuiz();
      });
      list.append(button);
    });
    const nodes = [title, list];
    if (quizIndex === 0) {
      const hint = document.createElement("p");
      hint.className = "quiz-hint";
      hint.textContent = "Займёт меньше минуты. Результат сразу перенесём в расчёт стоимости.";
      nodes.push(hint);
    }
    if (quizIndex > 0) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "quiz-back";
      back.textContent = "← Назад";
      back.addEventListener("click", () => { quizIndex -= 1; renderQuiz(); });
      nodes.push(back);
    }
    quizBody.replaceChildren(...nodes);
    return;
  }
  quizStep.textContent = "Подходящие модели";
  quizBar.style.width = "100%";
  const ranked = Object.keys(chairs)
    .map((key) => [key, quizScore(key, quizAnswers)])
    .sort((a, b) => b[1] - a[1])
    .filter(([, score], index) => index < 3 && (score > 0 || index === 0))
    .map(([key]) => key);
  const title = document.createElement("h3");
  title.textContent = "Вам подойдут";
  const list = document.createElement("div");
  list.className = "quiz-results";
  ranked.forEach((key) => {
    const chair = chairs[key];
    const variant = (quizAnswers.kind !== "any" && chair.variants.find((item) => item.kind === quizAnswers.kind)) || chair.variants[0];
    const item = document.createElement("article");
    item.className = "quiz-result";
    const image = document.createElement("img");
    image.src = variant.photo;
    image.alt = variant.alt;
    image.loading = "lazy";
    const info = document.createElement("div");
    const name = document.createElement("b");
    name.textContent = chair.name;
    const price = document.createElement("span");
    price.textContent = "от " + formatPrice(variant ? priceFor(chair.name, variant.kind) : minPrice(chair));
    const actions = document.createElement("div");
    actions.className = "quiz-result-actions";
    const open = document.createElement("button");
    open.type = "button";
    open.textContent = "Открыть";
    open.addEventListener("click", () => openPiece(chair, variant));
    const count = document.createElement("button");
    count.type = "button";
    count.textContent = "Посчитать";
    count.addEventListener("click", () => {
      setCalcModel(chair.name);
      if (variant) { calcKind.value = variant.kind; updateCalc(); }
      calcForm.scrollIntoView({ behavior: "smooth", block: "center" });
      calcQty.focus({ preventScroll: true });
    });
    actions.append(open, count);
    info.append(name, price, actions);
    item.append(image, info);
    list.append(item);
  });
  const note = document.createElement("p");
  note.className = "quiz-note";
  note.textContent = "Не нашли нужное? Опишите задачу в заявке — сделаем стул по вашему эскизу.";
  quizBody.replaceChildren(title, list, note);
  if (ranked[0]) setCalcModel(chairs[ranked[0]].name);
  reachGoal("quiz_done");
}

if (quizBody) {
  renderQuiz();
  quizRestart.addEventListener("click", () => { quizAnswers = {}; quizIndex = 0; renderQuiz(); });
}

// ---- Образцы тканей ----
{
  const samplesDialog = document.querySelector("#samples-dialog");
  const samplesForm = document.querySelector("#samples-form");
  const samplesStatus = document.querySelector("#samples-status");
  if (samplesDialog && samplesForm) {
    document.querySelectorAll("[data-open-samples]").forEach((button) => button.addEventListener("click", () => {
      samplesStatus.textContent = "";
      samplesDialog.showModal();
    }));
    samplesDialog.querySelector(".dialog-close").addEventListener("click", () => samplesDialog.close());
    samplesDialog.addEventListener("click", (event) => { if (event.target === samplesDialog) samplesDialog.close(); });
    samplesForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fabrics = [...samplesForm.querySelectorAll('input[name="fabrics"]:checked')].map((input) => input.value);
      if (!fabrics.length) { samplesStatus.textContent = "Отметьте хотя бы одну коллекцию."; return; }
      if (!samplesForm.reportValidity()) return;
      const data = new FormData(samplesForm);
      const fields = {
        _subject: "Образцы тканей: " + fabrics.join(", "),
        "Тип": "Заказ образцов тканей",
        "Коллекции": fabrics.join(", "),
        "Имя": data.get("name"),
        "Контакт": data.get("contact"),
        "Заведение": data.get("company"),
        "Город": data.get("city"),
        _honey: data.get("_honey"),
      };
      const text = ["Заказ образцов тканей", "", "Коллекции — " + fabrics.join(", "), "Имя — " + data.get("name"), "Контакт — " + data.get("contact"), "Заведение — " + (data.get("company") || "—"), "Город — " + (data.get("city") || "—")].join("\n");
      const button = samplesForm.querySelector('button[type="submit"]');
      button.disabled = true;
      samplesStatus.textContent = "Отправляем…";
      const result = await sendLead(fields, text);
      button.disabled = false;
      if (result === "sent") {
        samplesStatus.textContent = "Спасибо! Заявка на образцы отправлена, мы уточним адрес доставки.";
        reachGoal("lead_samples");
      } else {
        samplesStatus.textContent = "Открываем письмо с заявкой — отправьте его, и мы пришлём образцы.";
      }
    });
  }
}

// ---- Переход со страницы модели: index.html?model=Tide#project ----
{
  const params = new URLSearchParams(window.location.search);
  const fromPage = params.get("model");
  if (fromPage && chairsByName.has(fromPage)) {
    const chair = chairsByName.get(fromPage);
    const variant = chair.variants.find((item) => item.name === params.get("variant")) ?? chair.variants[0];
    model.value = chair.name;
    updateBriefMaterials(variant.name);
    setCalcModel(chair.name);
  }
}
