// Configuración básica de la escena
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

// Configuración del renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Creación de un cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Configuración de la luz
const hemiLight = new THREE.HemisphereLight();
scene.add(hemiLight);

// Función de animación
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
}

// Manejar el redimensionamiento de la ventana
function handleWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// Añadir evento de redimensionamiento de la ventana
window.addEventListener("resize", handleWindowResize);

// Inicia la animación
animate();
