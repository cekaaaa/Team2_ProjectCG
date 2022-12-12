import * as THREE from "three";
import gsap from "gsap";
// ini buat import sisi dadunya, ada 6 sisi
import side1 from "../assets/Asset-1.png";
import side2 from "../assets/Asset-2.png";
import side3 from "../assets/Asset-3.png";
import side4 from "../assets/Asset-4.png";
import side5 from "../assets/Asset-5.png";
import side6 from "../assets/Asset-6.png";
//New scene
const scene = new THREE.Scene();

// video
const videoId = document.querySelector("#bg");
const video = new THREE.VideoTexture(videoId);

scene.background = video;
// Making Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//Render the object into canvas with an id bg
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#dice"),
});
// Optimizing renderer with window ratio
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Render the renderer object

renderer.render(scene, camera);

//Bikin light
const ambientLight = new THREE.AmbientLight(0x222222, 1);

const hempLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

const pointLight = new THREE.PointLight(0xffffff, 1, 0);

pointLight.position.set(0, 90, 20);
//Bikin dice
// Shape
const diceShape = new THREE.BoxGeometry(10, 10, 10);

const textureLoader = new THREE.TextureLoader();

//Material
const diceMaterial = [
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side1) }),
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side2) }),
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side3) }),
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side4) }),
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side5) }),
  new THREE.MeshPhongMaterial({ map: textureLoader.load(side6) }),
];
//Mesh

const dice = new THREE.Mesh(diceShape, diceMaterial);

// Tambahkan ke scene

scene.add(dice, ambientLight, hempLight, pointLight);

//Init for normalizing mouse movement
const mouse = {
  x: undefined,
  y: undefined,
};
// Recrusive function for infinite loop
function animate() {
  requestAnimationFrame(animate);
  dice.rotation.x += 0.02;
  renderer.render(scene, camera);
  gsap.to(dice.rotation, {
    x: -mouse.y * 3,
    y: mouse.x * 2,
    duration: 2,
  });
}
animate();

//Normalize mouse movement
addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerWidth) * 2 + 1;
});