/* Wrightson & Vale — 3D-просмотр модели на странице товара.
   Загружает model-viewer (лежит на нашем сайте) только когда посетитель открыл 3D. */
(function () {
  var fig = document.querySelector(".mp-photo[data-model]");
  if (!fig) return;
  var id = fig.dataset.model;
  var photo = document.getElementById("mp-photo");
  var tabs = fig.querySelectorAll(".mp-view button");
  var box = fig.querySelector(".mp-3d");
  var viewer = null;
  var current = (document.querySelector('.mp-thumb[aria-pressed="true"]') || document.querySelector(".mp-thumb"));
  var ROUGH = { leather: 0.45, fabric: 0.92 };

  function loadScript(cb) {
    if (window.customElements && customElements.get("model-viewer")) return cb();
    var s = document.createElement("script");
    s.src = "../assets/vendor/model-viewer.min.js";
    s.onload = cb;
    s.onerror = function () { box.innerHTML = '<p class="mp-3d-error">Не удалось загрузить 3D. Обновите страницу.</p>'; };
    document.head.appendChild(s);
  }

  function paint(btn) {
    if (!viewer || !viewer.model || !btn) return;
    var color = btn.dataset.color, kind = btn.dataset.kind;
    viewer.model.materials.forEach(function (m) {
      if (m.name === "upholstery" || m.name === "piping") {
        m.pbrMetallicRoughness.setBaseColorFactor(color);
        if (ROUGH[kind] != null) m.pbrMetallicRoughness.setRoughnessFactor(ROUGH[kind]);
      }
    });
  }

  function open3d() {
    box.hidden = false; photo.hidden = true;
    if (viewer) return;
    box.innerHTML = '<p class="mp-3d-loading">Загружаем 3D-модель…</p>';
    loadScript(function () {
      viewer = document.createElement("model-viewer");
      var a = {
        src: "../assets/3d/" + id + ".glb",
        alt: "3D-модель " + (document.querySelector("h1") || {}).textContent,
        "camera-controls": "", "auto-rotate": "", "auto-rotate-delay": "1500", "rotation-per-second": "18deg",
        "touch-action": "pan-y", "interaction-prompt": "none",
        ar: "", "ar-modes": "webxr scene-viewer quick-look", "ar-placement": "floor",
        "shadow-intensity": "1", "shadow-softness": "0.8", exposure: "0.9", "environment-image": "neutral",
        "camera-orbit": "35deg 78deg auto", "min-camera-orbit": "auto 20deg auto", "max-camera-orbit": "auto 95deg auto"
      };
      Object.keys(a).forEach(function (k) { viewer.setAttribute(k, a[k]); });
      viewer.innerHTML = '<button slot="ar-button" class="mp-ar">Посмотреть у себя в комнате</button>';
      viewer.addEventListener("load", function () { paint(current); });
      box.innerHTML = "";
      box.appendChild(viewer);
      var hint = document.createElement("p");
      hint.className = "mp-3d-hint";
      hint.textContent = "Вращайте пальцем или мышью, приближайте щипком или колёсиком.";
      box.appendChild(hint);
    });
  }

  function openPhoto() { box.hidden = true; photo.hidden = false; }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(b === t)); });
      if (t.dataset.view === "3d") open3d(); else openPhoto();
    });
  });

  document.querySelectorAll(".mp-thumb").forEach(function (b) {
    b.addEventListener("click", function () { current = b; paint(b); });
  });
})();
