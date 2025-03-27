
// Configuración Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

// Configuración del renderizador
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('scene-container').appendChild(renderer.domElement);

// Geometría holográfica
const createHoloGrid = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const size = 20;
    const divisions = 50;

    for (let i = 0; i <= divisions; i++) {
        const percent = i / divisions;
        const x = (percent - 0.5) * size;

        vertices.push(x, -size / 2, 0);
        vertices.push(x, size / 2, 0);

        vertices.push(-size / 2, x, 0);
        vertices.push(size / 2, x, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1
    });

    return new THREE.LineSegments(geometry, material);
};

// Añadir elementos a la escena
scene.add(createHoloGrid());

// Posición de cámara
camera.position.z = 5;

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Rotación suave de la escena
    scene.rotation.x += 0.0005;
    scene.rotation.y += 0.001;

    renderer.render(scene, camera);
}

animate();

// Control de resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
