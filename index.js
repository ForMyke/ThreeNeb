import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const estrellas = getStarfield({ numStars: 10000 });
scene.add(estrellas);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshPhongMaterial({
  map: loader.load(
    "./shader/sunmap.jpg",
    function (texture) {
      console.log("Texture loaded successfully");
      material.map = texture;
      animate();
    },
    undefined,
    function (err) {
      console.error("Error loading texture:", err);
    }
  ),
});

const sunMesh = new THREE.Mesh(geometry, material);
scene.add(sunMesh);

const grupo = new THREE.Group();
scene.add(grupo);

const lucesMat = new THREE.MeshBasicMaterial({
  color: 0xffa500,
  opacity: 1,
});

const numberOfRings = 4;
const rings = [];

// Añadir los anillos originales
for (let i = 1; i <= numberOfRings; i++) {
  const Aro = getFresnelMat();
  const AroGlow = new THREE.Mesh(geometry, Aro);
  AroGlow.scale.setScalar(1.05 + i * 0.35);

  if (i % 2 !== 0) {
    AroGlow.rotation.x = THREE.MathUtils.degToRad(45); // 45 grados
  }

  grupo.add(AroGlow);
  rings.push(AroGlow); // Almacena los aros para manipular su rotación por separado
}

// Añadir un nuevo aro con escala 1.01
const additionalAro = getFresnelMat();
const additionalAroGlow = new THREE.Mesh(geometry, additionalAro);
additionalAroGlow.scale.setScalar(1.04);
grupo.add(additionalAroGlow);
rings.push(additionalAroGlow); // Añadirlo al array de aros para rotación

// Añadir las luces (representando los electrones) al grupo
const luces = new THREE.Mesh(geometry, lucesMat);
grupo.add(luces);

const sunLight = new THREE.DirectionalLight(0xffffff, 4.0);

function animate() {
  requestAnimationFrame(animate);
  sunMesh.rotation.y += 0.001111;

  // Rotacion
  rings.forEach((ring) => {
    ring.rotation.x += 0.51;
    ring.rotation.y += 1001;
  });

  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
