import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const estrellas = getStarfield({ numStars: 14000 });

//add stars
scene.add(estrellas);
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshPhongMaterial({
  map: loader.load(
    "./shader/sunmap.jpg",
    function (texture) {
      console.log("Texture loaded successfully");
      material.map = texture;
      animate(); // Solo empezar la animación cuando la textura esté cargada
    },
    undefined,
    function (err) {
      console.error("Error loading texture:", err);
    }
  ),
});

const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

//Contenido
const grupo = new THREE.Group();
scene.add(grupo);
//Luces
const lucesMat = new THREE.MeshBasicMaterial({
  color: 0xffa500,
  opacity: 0.4,
  transparent: true,
});
const luces = new THREE.Mesh(geometry, lucesMat);
grupo.add(luces);
//Extras
const sunLight = new THREE.DirectionalLight(0xffffff, 41.0);
sunLight.position.set(-1, 0.5, 2.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.002;
  luces.rotation.y += 0.002;
  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

// Iniciar la animación solo si la textura se carga correctamente
