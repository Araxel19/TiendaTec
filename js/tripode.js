import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('tripode-container');
const loaderDiv = document.getElementById('tripode-loader');
const hintDiv = document.getElementById('tripode-hint');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// OrbitControls para mejor navegación
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;

let model;
const loader = new GLTFLoader();
loader.load('/models/Tripode3d.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(4.5, 4.5, 4.5);
    model.position.set(0, 0.5, 0);
    scene.add(model);
    if (loaderDiv) loaderDiv.style.display = 'none'; // Oculta el loader
}, undefined, function (error) {
    if (loaderDiv) loaderDiv.innerHTML = '<span class="text-danger">Error al cargar el modelo 3D.</span>';
    console.error('Error al cargar el modelo:', error);
});

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 1));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsividad
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Oculta el hint después de unos segundos
setTimeout(() => {
    if (hintDiv) hintDiv.style.display = 'none';
}, 4000);
