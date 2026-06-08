const reveals = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll(".count-up");
const interactiveItems = document.querySelectorAll(
  ".action-pill, .cv-actions a, .service-card, .work-card"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

const animateCount = (item) => {
  if (item.dataset.counted === "true") {
    return;
  }

  item.dataset.counted = "true";
  const target = Number(item.dataset.count || 0);
  const duration = 1050;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    item.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  countItems.forEach((item) => countObserver.observe(item));
} else {
  countItems.forEach(animateCount);
}

interactiveItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    item.style.setProperty("--mx", `${x}%`);
    item.style.setProperty("--my", `${y}%`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.removeProperty("--mx");
    item.style.removeProperty("--my");
  });
});
