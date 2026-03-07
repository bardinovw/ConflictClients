// --- Carousels Logic ---
const carouselStates = {
  "carousel-1": 0,
  "carousel-2": 0,
  "carousel-3": 0,
};

function buildCarousels() {
  Object.keys(carouselData).forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;

    const items = carouselData[id];
    items.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "carousel-card";
      card.innerHTML = `<h3 class="subtitle-text font-bold mb-5 text-magenta">${item.title}</h3>${item.content}`;
      container.appendChild(card);
    });
    updateCarousel(id);
  });
}

function rotateCarousel(id, direction) {
  const data = carouselData[id];
  carouselStates[id] += direction;

  // Loop logic
  if (carouselStates[id] < 0) carouselStates[id] = data.length - 1;
  if (carouselStates[id] >= data.length) carouselStates[id] = 0;

  updateCarousel(id);
}

function updateCarousel(id) {
  const container = document.getElementById(id);
  const cards = container.querySelectorAll(".carousel-card");
  const currentIndex = carouselStates[id];

  cards.forEach((card, i) => {
    // Calculate relative position (-1, 0, 1)
    let relIndex = i - currentIndex;
    const total = cards.length;

    // Adjust for circular feeling
    if (relIndex < -Math.floor(total / 2)) relIndex += total;
    if (relIndex > Math.floor(total / 2)) relIndex -= total;

    const isCenter = relIndex === 0;

    const translateX = relIndex * 340;
    const translateZ = Math.abs(relIndex) * -200;
    const rotateY = relIndex * -15;
    const opac = Math.abs(relIndex) > 1 ? 0 : isCenter ? 1 : 0.4;
    const zIndex = 100 - Math.abs(relIndex);

    // Visual state calculations for focus (Scale 1.15 for active, 0.9 for inactive)
    const scale = isCenter ? 1.15 : 0.9;
    const bgColor = isCenter
      ? "linear-gradient(145deg, #1C0033, #2A004D)"
      : "rgba(255, 255, 255, 0.02)";
    const boxShad = isCenter
      ? "0 0 40px rgba(255, 0, 87, 0.9), inset 0 0 20px rgba(255, 0, 87, 0.5)"
      : "0 4px 15px 0 rgba(255, 0, 87, 0.1)";
    const borderCol = isCenter
      ? "rgba(255, 0, 87, 1)"
      : "rgba(255, 0, 87, 0.15)";

    gsap.to(card, {
      x: translateX,
      z: translateZ,
      rotationY: rotateY,
      scale: scale,
      opacity: opac,
      backgroundImage: isCenter ? bgColor : "none",
      backgroundColor: isCenter ? "transparent" : bgColor,
      boxShadow: boxShad,
      borderColor: borderCol,
      zIndex: zIndex,
      duration: 0.6,
      ease: "power2.out",
    });
  });
}
