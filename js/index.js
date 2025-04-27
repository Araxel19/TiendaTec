// Reemplaza el contenido de index.js con este código Polvo Estelar.
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

// Crear sistema de partículas en forma de red (versión optimizada)
const createNetworkParticles = () => {
    const particlesCount = 250; // Reducido para mejor rendimiento
    const connectionDistance = 1.5;
    
    // Geometría para partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3);
    
    // Crear posiciones aleatorias y velocidades
    for(let i = 0; i < particlesCount; i++) {
        // Posiciones
        posArray[i * 3] = (Math.random() - 0.5) * 8;       // x
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;   // y
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;   // z
        
        // Velocidades (más lentas para suavidad)
        velocityArray[i * 3] = (Math.random() - 0.5) * 0.01;
        velocityArray[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocityArray[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material para partículas
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Crear mesh de partículas
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    
    // Líneas - usar instanciación para mejor rendimiento
    const maxLines = particlesCount * 3; // Estimación del número máximo de líneas
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    // Crear pool de líneas reutilizables
    const linePool = [];
    const linesGroup = new THREE.Group();
    
    // Actualizar función
    const update = () => {
        const positions = particlesGeometry.attributes.position.array;
        
        // Ocultar todas las líneas primero
        linePool.forEach(line => {
            line.visible = false;
        });
        
        let lineIndex = 0;
        
        // Actualizar posiciones de partículas
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            
            // Actualizar posición
            positions[i3] += velocityArray[i3];
            positions[i3 + 1] += velocityArray[i3 + 1];
            positions[i3 + 2] += velocityArray[i3 + 2];
            
            // Rebotar en los límites
            if(Math.abs(positions[i3]) > 4) velocityArray[i3] *= -1;
            if(Math.abs(positions[i3 + 1]) > 4) velocityArray[i3 + 1] *= -1;
            if(Math.abs(positions[i3 + 2]) > 4) velocityArray[i3 + 2] *= -1;
        }
        
        // Marcar geometría para actualización
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Optimización: Crear conexiones usando un enfoque basado en distancia
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            // Buscar conexiones solo con partículas siguientes (evitar duplicados)
            for(let j = i + 1; j < particlesCount; j++) {
                const j3 = j * 3;
                const x2 = positions[j3];
                const y2 = positions[j3 + 1];
                const z2 = positions[j3 + 2];
                
                // Optimización: Cálculo de distancia simplificado
                const dx = x1 - x2;
                const dy = y1 - y2;
                const dz = z1 - z2;
                const distSq = dx * dx + dy * dy + dz * dz;
                
                // Evitar raíz cuadrada para comparación de distancia
                if(distSq < connectionDistance * connectionDistance) {
                    // Calcular opacidad basada en distancia
                    const distance = Math.sqrt(distSq);
                    const opacity = 1 - (distance / connectionDistance);
                    
                    // Obtener o crear una línea
                    let line;
                    if(lineIndex < linePool.length) {
                        line = linePool[lineIndex];
                        line.visible = true;
                        
                        // Actualizar puntos de la línea
                        const linePositions = line.geometry.attributes.position.array;
                        linePositions[0] = x1;
                        linePositions[1] = y1;
                        linePositions[2] = z1;
                        linePositions[3] = x2;
                        linePositions[4] = y2;
                        linePositions[5] = z2;
                        line.geometry.attributes.position.needsUpdate = true;
                    } else {
                        // Crear nueva línea si es necesario
                        const lineGeometry = new THREE.BufferGeometry();
                        const vertices = new Float32Array([x1, y1, z1, x2, y2, z2]);
                        lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        
                        line = new THREE.Line(lineGeometry, linesMaterial.clone());
                        line.material.opacity = opacity * 0.5;
                        
                        linePool.push(line);
                        linesGroup.add(line);
                    }
                    
                    // Actualizar opacidad
                    line.material.opacity = opacity * 0.5;
                    
                    lineIndex++;
                    
                    // Limitar el número de líneas para mejor rendimiento
                    if (lineIndex >= maxLines) break;
                }
            }
            
            // Si ya tenemos suficientes líneas, salir del bucle
            if (lineIndex >= maxLines) break;
        }
    };

    return { particlesMesh, linesGroup, update };
};

// Crear sistema de partículas
const networkParticles = createNetworkParticles();
scene.add(networkParticles.particlesMesh);
scene.add(networkParticles.linesGroup);

// Añadir luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Posición de cámara
camera.position.z = 5;

// Animación
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar partículas y conexiones
    networkParticles.update();
    
    // Rotar ligeramente toda la escena
    networkParticles.particlesMesh.rotation.y += 0.0005;
    networkParticles.linesGroup.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}
animate();

// Control de resize (optimizado con throttling)
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
});