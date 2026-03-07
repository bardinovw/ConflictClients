// --- Three.js Background ---
function initThreeJS() {
  const container = document.getElementById("canvas-container");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a001a, 0.001);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Particles Geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  const colorPalette = [
    new THREE.Color("#FF0057"), // Magenta
    new THREE.Color("#00C2FF"), // El Blue
    new THREE.Color("#00F0FF"), // Neon Cyan
    new THREE.Color("#2A004D"), // Deep Purple
  ];

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // positions in a sphere/cloud
    posArray[i] = (Math.random() - 0.5) * 1200;
    posArray[i + 1] = (Math.random() - 0.5) * 1000;
    posArray[i + 2] = (Math.random() - 0.5) * 1000;

    // random color from palette
    const mixedColor =
      colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colorsArray[i] = mixedColor.r;
    colorsArray[i + 1] = mixedColor.g;
    colorsArray[i + 2] = mixedColor.b;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3),
  );
  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorsArray, 3),
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);

  // Floating Neural Lines (simplified via connecting lines in random positions)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1c0033,
    transparent: true,
    opacity: 0.3,
  });
  const lineGeo = new THREE.BufferGeometry();
  const linePos = new Float32Array(300); // 100 points
  for (let i = 0; i < 300; i++) {
    linePos[i] = (Math.random() - 0.5) * 800;
  }
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Mouse interaction vars
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.02;

    lines.rotation.y = elapsedTime * -0.03;

    // Parallax effect on mouse move
    camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
