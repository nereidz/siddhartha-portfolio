const jobs = [
  { state: "ok", text: "claims_fhir_map · 2.1m rows" },
  { state: "run", text: "adls_bronze_ingest · Spark" },
  { state: "ok", text: "risk_adjust_gold · Azure" },
  { state: "run", text: "member_reconcile · Databricks" },
  { state: "ok", text: "quality_metrics · Power BI" },
  { state: "run", text: "hl7_validate · FHIR R4" },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const decimals = String(el.dataset.count).includes(".") ? 1 : 0;
  if (reduceMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
    return;
  }
  const started = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const t = Math.max(0, Math.min((now - started) / duration, 1));
    const eased = 1 - (1 - t) ** 3;
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const dash = document.querySelector(".dash");
const values = document.querySelectorAll(".kpi-value");
let counted = false;

if (dash && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          values.forEach(countUp);
        }
      });
    },
    { threshold: 0.35 }
  );
  io.observe(dash);
} else {
  values.forEach(countUp);
}

const list = document.getElementById("jobs");
if (list && !reduceMotion) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % jobs.length;
    const row = jobs[i];
    const li = document.createElement("li");
    li.innerHTML = `<span class="${row.state}">${row.state}</span> ${row.text}`;
    list.prepend(li);
    while (list.children.length > 3) list.lastElementChild.remove();
  }, 2200);
}
