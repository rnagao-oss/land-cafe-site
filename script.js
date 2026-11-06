const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealTargets = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const countUp = (el) => {
  const target = Number(el.dataset.count);
  if (!target || reduceMotion) return;
  el.style.display = "inline-block";
  el.style.minWidth = `${el.offsetWidth}px`;
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = `¥${Math.round(target * eased).toLocaleString("ja-JP")}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => observer.observe(el));

if (window.budoux && window.budoux.jaParser) {
  const parser = window.budoux.jaParser;
  const applyBudoux = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.nodeValue;
      if (!text.trim() || !/[぀-ヿ一-鿿]/.test(text)) return;
      const frag = document.createDocumentFragment();
      parser.parse(text).forEach((seg, i) => {
        if (i > 0) frag.appendChild(document.createElement("wbr"));
        frag.appendChild(document.createTextNode(seg));
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add("budoux-ja");
  };
  document
    .querySelectorAll("h1, h2, h3, .lead, .hero-copy, dt, summary")
    .forEach(applyBudoux);
}

const form = document.querySelector("[data-entry-form]");
const message = document.querySelector("[data-form-message]");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) {
      message.textContent = "メールアドレスを入力してください。";
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    message.textContent = "送信しています…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "【My Land】オープン案内の登録",
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      message.textContent = "登録しました。オープン日が決まったらお知らせします。";
    } catch (err) {
      message.textContent = "送信できませんでした。時間をおいてもう一度お試しください。";
    } finally {
      button.disabled = false;
    }
  });
}
