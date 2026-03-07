// --- Init Function (Главный файл) ---
window.onload = function () {
  // Инициализация компонентов
  initThreeJS();
  generateNavigation();
  buildCarousels();
  initVideoInteractions();

  // Удаление Preloader
  setTimeout(() => {
    gsap.to("#preloader", {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        document.getElementById("preloader").style.display = "none";
        initWordCloud(); // Запуск облака слов, если первый слайд активен
      },
    });
  }, 1500);

  // Переключение в полноэкранный режим
  document.getElementById("fullscreen-btn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Ошибка включения полного экрана: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Навигация колесиком мыши
  window.addEventListener("wheel", (e) => {
    if (isAnimating) return;
    if (e.deltaY > 50) {
      goToSlide(currentSlideIndex + 1);
    } else if (e.deltaY < -50) {
      goToSlide(currentSlideIndex - 1);
    }
  });

  // Навигация с клавиатуры
  window.addEventListener("keydown", (e) => {
    if (isAnimating) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      goToSlide(currentSlideIndex - 1);
    }
  });
};
