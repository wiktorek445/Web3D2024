import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Set up Three.js scene, camera, lights, and controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let objToRender = "cokecan"; // Default model to render

const loader = new GLTFLoader();

// Function to load the selected model
function loadModel(modelName) {
  // Clear the scene of any existing objects
  scene.remove(object);

  // Load the selected model
  loader.load(
    `models/${modelName}.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);

      // Adjust camera position based on the selected model
      camera.position.set(0, -5, 15);
      controls.target.set(0, -5, 0); // Adjust orbital position for cokecan model

      // Adjust ambient light intensity based on the selected model
      ambientLight.intensity = modelName === "cokecan" ? 20 : 50;
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );
}

// Load the default model
loadModel(objToRender);

const canvas = document.getElementById("model-canvas");
const renderer = new THREE.WebGLRenderer({ alpha: true });

// Set renderer size to match the canvas size
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// Append the renderer to the canvas element
canvas.appendChild(renderer.domElement);

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(0, 500, 0); // straight from the top
topLight.castShadow = true;
scene.add(topLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
bottomLight.position.set(0, -500, 0); // straight from the bottom
scene.add(bottomLight);

const ambientLight = new THREE.AmbientLight(
  0x333333,
  objToRender === "cokecan" ? 20 : 50
);
scene.add(ambientLight);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth transitions
controls.dampingFactor = 0.25; // Damping inertia
controls.screenSpacePanning = false; // Disable panning on left mouse button
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.PAN,
  RIGHT: THREE.MOUSE.DOLLY,
};

// Function to handle button click event
function handleModelChange(modelName) {
  objToRender = modelName;
  loadModel(modelName);
}

// Button event listeners
document
  .getElementById("model-button-coke")
  .addEventListener("click", function () {
    handleModelChange("cokecan");
  });

document
  .getElementById("model-button-sprite")
  .addEventListener("click", function () {
    handleModelChange("spritecan");
  });

document
  .getElementById("model-button-pepsi")
  .addEventListener("click", function () {
    handleModelChange("pepsican");
  });

function updateEyeMovement() {
  if (object && objToRender === "cokecan") {
    object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
    object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
  }
}

// Render function
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};

document.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (event) => {
  if (isDragging && object && objToRender === "cokecan") {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    object.rotation.y += deltaX * 0.01;
    object.rotation.x += deltaY * 0.01;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }
});

// Initialize zoom variables
let zoomLevel = 1.0;

// Listen for scroll events
document.addEventListener("wheel", (event) => {
  // Adjust zoom level based on scroll direction
  if (event.deltaY > 0) {
    zoomLevel /= 1.1; // Zoom out
  } else {
    zoomLevel *= 1.1; // Zoom in
  }

  // Update camera properties
  camera.fov = 75 / zoomLevel; // Adjust FOV
  camera.updateProjectionMatrix();

  // Re-render the scene
  renderer.render(scene, camera);
});

animate();
