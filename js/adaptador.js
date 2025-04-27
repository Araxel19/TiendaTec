import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const container = document.getElementById('adaptador-container');

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

let model;
const loader = new GLTFLoader();
loader.load('/models/modeloadaptador.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(6, 6, 6);
    model.position.set(0, 0.5, 0);
    scene.add(model);
}, undefined, function (error) {
    console.error('Error al cargar el modelo:', error);
});

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        let deltaY = event.clientY - previousMouseY;

        model.rotation.y += deltaX * 0.005;
        model.rotation.x += deltaY * 0.005;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

// Animación
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
