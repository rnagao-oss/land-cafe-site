const appleForm = document.querySelector("[data-apple-form]");
const appleMessage = document.querySelector("[data-apple-message]");

appleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  appleForm.reset();
  appleMessage.textContent = "登録ありがとうございます。オープン情報を準備でき次第お送りします。";
});
