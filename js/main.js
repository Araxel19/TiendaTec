import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let model; // Variable para almacenar el modelo

// Cargar modelo GLTF
const loader = new GLTFLoader();
loader.load('/models/modelobase.glb', function (gltf) {
    model = gltf.scene; // Guardar el modelo en la variable
    model.scale.set(5, 5, 5);
    model.position.set(0, 0, 0);
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

// Animación
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01; // Rotar en el eje Y
    }

    renderer.render(scene, camera);
}
animate();
