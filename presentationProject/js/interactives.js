// --- Interactive Game ---
function playGame(choice) {
  const resultBox = document.getElementById("game-result");
  const msg = document.getElementById("game-msg");
  resultBox.classList.remove("hidden");

  if (choice === 0) {
    msg.innerHTML =
      '<span class="text-magenta font-bold">❌ Прямой отказ.</span> Вызывает триггер "Ограничение свободы" и "Угроза достоинству". Клиент начнет спорить.';
    resultBox.style.borderColor = "var(--magenta)";
  } else {
    msg.innerHTML =
      '<span class="text-neon-cyan font-bold">✅ Отличный выбор.</span> Вы использовали технику "Эмпатия + Альтернатива". Это переключает внимание клиента на новые возможности.';
    resultBox.style.borderColor = "var(--neon-cyan)";
  }
}

function resetGame() {
  document.getElementById("game-result").classList.add("hidden");
}

// --- Video Carousel Logic ---
function scrollVideoCarousel(direction) {
  const carousel = document.getElementById("stress-videos");
  const cardWidth = 288;
  const gap = 32;
  carousel.scrollBy({
    left: direction * (cardWidth + gap),
    behavior: "smooth",
  });
}

function initVideoInteractions() {
  const videoCards = document.querySelectorAll(".video-card");
  videoCards.forEach((card) => {
    const video = card.querySelector("video");
    const overlay = card.querySelector(".play-overlay");

    card.addEventListener("click", () => {
      if (video.paused) {
        // Останавливаем все остальные видео перед запуском нового
        document.querySelectorAll(".video-card video").forEach((v) => {
          if (v !== video) {
            v.pause();
            v.currentTime = 0;
            v.nextElementSibling.style.opacity = "1";
            v.nextElementSibling.style.pointerEvents = "auto";
          }
        });
        video.play();
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      } else {
        video.pause();
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
      }
    });

    video.addEventListener("ended", () => {
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    });
  });
}

// --- Word Cloud Animation ---
let cloudInited = false;
function initWordCloud() {
  if (cloudInited) return;
  cloudInited = true;
  const container = document.getElementById("word-cloud");
  container.innerHTML = "";

  words.forEach((word, i) => {
    const el = document.createElement("div");
    el.className = "word-cloud-item";
    // Random color from palette
    const colors = [
      "var(--magenta)",
      "var(--neon-cyan)",
      "var(--el-blue)",
      "#ffffff",
    ];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = `${Math.random() * 30 + 20}px`; // Увеличенный размер слов
    el.style.textShadow = `0 0 10px ${el.style.color}`;
    el.innerText = word;

    // Random position %
    el.style.left = `${Math.random() * 70 + 15}%`;
    el.style.top = `${Math.random() * 70 + 15}%`;

    container.appendChild(el);

    // Animate appearance
    gsap.to(el, {
      opacity: Math.random() * 0.5 + 0.5,
      scale: Math.random() * 0.5 + 1,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      delay: i * 0.3,
      ease: "sine.inOut",
    });
  });
}

// --- Hot Seat Timer ---
let hotSeatTimerInterval = null;
let hotSeatTimeLeft = 110;

function startTimer() {
  if (hotSeatTimerInterval) return;
  const timerDisplay = document.getElementById("hot-seat-timer");

  hotSeatTimerInterval = setInterval(() => {
    hotSeatTimeLeft--;

    let m = Math.floor(hotSeatTimeLeft / 60)
      .toString()
      .padStart(2, "0");
    let s = (hotSeatTimeLeft % 60).toString().padStart(2, "0");
    timerDisplay.innerText = `${m}:${s}`;

    if (hotSeatTimeLeft <= 0) {
      clearInterval(hotSeatTimerInterval);
      hotSeatTimerInterval = null;

      // Show notification
      timerDisplay.innerText = "ВРЕМЯ ВЫШЛО!";
      gsap.fromTo(
        timerDisplay,
        { scale: 1 },
        {
          scale: 1.1,
          yoyo: true,
          repeat: 5,
          duration: 0.2,
          color: "#FFFFFF",
          textShadow: "0 0 30px #FF0057",
        },
      );

      // Reset after 4 seconds
      setTimeout(() => {
        hotSeatTimeLeft = 110;
        timerDisplay.innerText = "01:50";
        gsap.to(timerDisplay, {
          scale: 1,
          color: "var(--magenta)",
          textShadow: "0 0 10px var(--magenta), 0 0 20px rgba(255, 0, 87, 0.5)",
        });
      }, 4000);
    }
  }, 1000);
}
