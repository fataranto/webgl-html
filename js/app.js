import * as THREE from 'three'; // Importa la biblioteca Three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Importa los controles de órbita
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'


// Definición de la clase Sketch
export default class Sketch {
    constructor(options) {
        this.time = 0; // Inicializa el tiempo para la animación
        this.container = options.dom; // El contenedor DOM donde se renderizará la escena
        this.scene = new THREE.Scene(); // Crea una nueva escena de Three.js

        // Obtiene las dimensiones del contenedor
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        // Configura la cámara con perspectiva
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
        this.camera.position.z = 1; // Posiciona la cámara

        // Crea el renderizador WebGL con antialiasing para suavizar bordes
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height); // Ajusta el tamaño del renderizador
        this.container.appendChild(this.renderer.domElement); // Añade el canvas del renderizador al DOM

        // Añade los controles de órbita para la cámara
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Configura el manejo del redimensionamiento de la ventana
        this.resize();
        this.setupResize();
        this.addObjects(); // Añade los objetos a la escena
        this.render(); // Inicia el bucle de renderizado
    }

    // Configura el evento de redimensionamiento
    setupResize() {
        window.addEventListener('resize', this.resize.bind(this)); // Asocia el evento resize al método resize
    }

    // Actualiza las dimensiones del renderizador y la cámara cuando la ventana cambia de tamaño
    resize() {
        this.width = this.container.offsetWidth; // Obtiene el nuevo ancho del contenedor
        this.height = this.container.offsetHeight; // Obtiene el nuevo alto del contenedor
        this.renderer.setSize(this.width, this.height); // Ajusta el tamaño del renderizador
        this.camera.aspect = this.width / this.height; // Actualiza el aspecto de la cámara
        this.camera.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
    }

    // Añade los objetos a la escena
    addObjects() {
        // Crea una geometría de cubo
        this.geometry = new THREE.PlaneGeometry(0.5, 0.5, 50, 50);
        
        // Crea un material de shader personalizado
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: true
        });

        // Crea una malla con la geometría y el material
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh); // Añade la malla a la escena
    }

    // Bucle de renderizado
    render() {
        this.time += 0.05; // Incrementa el tiempo para la animación
        this.mesh.rotation.x = this.time / 2000; // Rota la malla en el eje X
        this.mesh.rotation.y = this.time / 1000; // Rota la malla en el eje Y

        this.material.uniforms.time.value = this.time;

        this.renderer.render(this.scene, this.camera); // Renderiza la escena desde la perspectiva de la cámara
        window.requestAnimationFrame(this.render.bind(this)); // Solicita el siguiente frame de animación
    }
}

// Instancia de la clase Sketch
new Sketch({
    dom: document.getElementById('container') // Especifica el contenedor DOM para la instancia
});
