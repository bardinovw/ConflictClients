// --- App Global State ---
let currentSlideIndex = 0;
const totalSlides = 16;
let isAnimating = false;

// --- Navigation Logic ---
function generateNavigation() {
  const nav = document.getElementById("nav-container");
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    dot.className = `nav-sphere ${i === 0 ? "active" : ""}`;
    dot.id = `nav-dot-${i}`;
    dot.onclick = (e) => morphToSlide(i, e.target);
    // Setup animation delay to make them wave
    dot.style.animationDelay = `${i * 0.2}s`;
    nav.appendChild(dot);
  }
}

function morphToSlide(targetIndex, clickedDot) {
  if (
    isAnimating ||
    targetIndex === currentSlideIndex ||
    targetIndex < 0 ||
    targetIndex >= totalSlides
  )
    return;
  isAnimating = true;

  const currentSlide = document.getElementById(`slide-${currentSlideIndex}`);
  const targetSlide = document.getElementById(`slide-${targetIndex}`);
  const titleElement = targetSlide.querySelector(".slide-title");
  const dummy = document.getElementById("morph-dummy");

  // Update dots
  document.querySelectorAll(".nav-sphere").forEach((d, i) => {
    d.classList.toggle("active", i === targetIndex);
  });

  // Morph Animation using Dummy
  if (clickedDot && titleElement) {
    const dotRect = clickedDot.getBoundingClientRect();
    const titleRect = titleElement.getBoundingClientRect();

    // Reset dummy to dot position
    gsap.set(dummy, {
      x: dotRect.left,
      y: dotRect.top,
      width: dotRect.width,
      height: dotRect.height,
      borderRadius: "50%",
      opacity: 1,
      background: "var(--magenta)",
    });

    // Animate dummy to title position
    gsap.to(dummy, {
      x: titleRect.left + titleRect.width / 2 - dotRect.width / 2, // Center alignment approx
      y: titleRect.top,
      width: titleRect.width * 0.8,
      height: titleRect.height,
      borderRadius: "10px",
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
    });
  }

  // Cinematic transitions
  gsap.to(currentSlide, {
    opacity: 0,
    scale: targetIndex > currentSlideIndex ? 0.9 : 1.1,
    filter: "blur(15px)",
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      currentSlide.classList.remove("active");
    },
  });

  targetSlide.classList.add("active");
  gsap.fromTo(
    targetSlide,
    {
      opacity: 0,
      scale: targetIndex > currentSlideIndex ? 1.1 : 0.9,
      filter: "blur(15px)",
    },
    {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        isAnimating = false;
        currentSlideIndex = targetIndex;
        triggerSlideSpecificLogic(currentSlideIndex);
      },
    },
  );
}

function goToSlide(targetIndex) {
  if (targetIndex < 0 || targetIndex >= totalSlides) return;
  const dot = document.getElementById(`nav-dot-${targetIndex}`);
  morphToSlide(targetIndex, dot);
}

function triggerSlideSpecificLogic(index) {
  if (index === 1) {
    // Slide 2: Word cloud
    initWordCloud();
  } else if (index === 11) {
    // Slide 12: Hot Seat Game Entrance Animation
    // Animate central card
    gsap.fromTo(
      "#hot-seat-center",
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" },
    );
    // Stagger animate floating role cards
    gsap.fromTo(
      ".role-card",
      { scale: 0, opacity: 0, rotationY: 90 },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.3,
      },
    );
  } else if (index === 12) {
    // Slide 13: Реакция тела
    gsap.killTweensOf(".chain-item, .chain-arrow");
    gsap.fromTo(
      ".chain-item",
      {
        opacity: 0.2,
        scale: 0.9,
        boxShadow: "0 0 0px transparent",
        borderColor: "rgba(255, 0, 87, 0.1)",
      },
      {
        opacity: 1,
        scale: 1,
        boxShadow: "0 0 30px rgba(255, 0, 87, 0.8)",
        borderColor: "rgba(255, 0, 87, 1)",
        duration: 0.5,
        stagger: 0.6,
        ease: "power2.out",
      },
    );
    gsap.fromTo(
      ".chain-arrow",
      { opacity: 0, width: 0 },
      {
        opacity: 1,
        width: 50,
        duration: 0.4,
        stagger: 0.6,
        delay: 0.3,
        ease: "power1.inOut",
      },
    );
  }
}
