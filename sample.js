// Адрес функции в Яндекс Облаке, которая принимает заявки (данные хранятся в России, 152-ФЗ).
// Пока пусто: заявка сохраняется в файл и открывается письмом на wv@wrightsonvale.ru.
const SAMPLE_ENDPOINT = "";

const sampleForm = document.querySelector("#sample-form");
const sampleStatus = document.querySelector("#sample-status");

function saveSampleRequest(data) {
  const files = [...sampleForm.querySelector("#sample-file").files].map((file) => file.name);
  const lines = [
    "Заявка на образец модели",
    "",
    "Модель — " + data.get("model"),
    "Описание — " + data.get("description"),
    "Контакт — " + data.get("contact"),
    "Файлы — " + (files.length ? files.join(", ") : "не приложены"),
  ];
  const file = new Blob(["﻿", lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Wrightson-Vale-sample-request.txt";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

sampleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(sampleForm);
  const fallback = () => {
    saveSampleRequest(data);
    sampleStatus.textContent = "Заявка сохранена в файл. Отправьте его вместе с фото образца на wv@wrightsonvale.ru — откроем письмо в вашей почте.";
    const body = ["Модель: " + data.get("model"), "Что нужно сделать: " + data.get("description"), "Контакт: " + data.get("contact"), "", "Файл заявки и фото образца прикладываю к письму."].join("\n");
    setTimeout(() => {
      window.location.href = "mailto:wv@wrightsonvale.ru?subject=" + encodeURIComponent("Образец: " + data.get("model")) + "&body=" + encodeURIComponent(body);
    }, 600);
  };
  if (!SAMPLE_ENDPOINT) { fallback(); return; }
  sampleStatus.textContent = "Отправляем...";
  try {
    const hasFiles = sampleForm.querySelector("#sample-file").files.length > 0;
    const payload = { _subject: "Образец модели: " + data.get("model"), "Тип": "Образец модели", "Модель": data.get("model"), "Что нужно сделать": data.get("description"), "Контакт": data.get("contact"), "Фото": hasFiles ? "клиент пришлёт ответным письмом" : "не приложены", "Согласие на обработку ПДн": "да, " + new Date().toLocaleString("ru-RU"), _page: location.href };
    const response = await fetch(SAMPLE_ENDPOINT, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json", Accept: "application/json" } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || String(result.success) === "false") throw new Error("bad status");
    sampleForm.reset();
    sampleStatus.textContent = hasFiles
      ? "Спасибо, заявка отправлена. Фото образца пришлите, пожалуйста, на wv@wrightsonvale.ru — мы ответим на ваш контакт."
      : "Спасибо, заявка отправлена. Мы свяжемся с вами.";
  } catch {
    fallback();
  }
});
