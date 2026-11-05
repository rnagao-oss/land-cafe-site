const form = document.querySelector("[data-entry-form]");
const message = document.querySelector("[data-form-message]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();

  if (!email) {
    message.textContent = "メールアドレスを入力してください。";
    return;
  }

  form.reset();
  message.textContent = "登録ありがとうございます。オープン情報を準備でき次第お送りします。";
});
