(() => {
  const scroller = document.getElementById("scroller");
  if (!scroller) return;

  const captionCount = document.querySelector(".count");
  const slides = Array.from(scroller.querySelectorAll(".slide"));
  const total = slides.length;

  // --- Drag-to-scroll ---
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  scroller.addEventListener("pointerdown", (e) => {
    isDown = true;
    scroller.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollLeft = scroller.scrollLeft;
  });

  scroller.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    scroller.scrollLeft = scrollLeft - dx;
  });

  const endDrag = () => { isDown = false; };
  scroller.addEventListener("pointerup", endDrag);
  scroller.addEventListener("pointercancel", endDrag);
  scroller.addEventListener("pointerleave", endDrag);

  // --- "1 of N" indicator based on nearest slide center ---
  function updateCount() {
    if (!captionCount || total === 0) return;

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    slides.forEach((slide, idx) => {
      const left = slide.offsetLeft;
      const center = left + slide.clientWidth / 2;
      const dist = Math.abs(center - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    captionCount.textContent = `${bestIdx + 1} of ${total}`;
  }

  // Update on scroll (throttled via rAF)
  let ticking = false;
  scroller.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateCount();
      ticking = false;
    });
  });

  // Init
  updateCount();
})();
