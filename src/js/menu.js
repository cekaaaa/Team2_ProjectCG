import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon";
import CannonDebugRendere from 'cannon/tools/threejs/CannonDebugRenderer';

const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
let timestamp = 1.0/60.0;

function addObjects(){
  let box = new CANNON.Box(new CANNON.Vec3(2,2,2));
  charBody = new CANNON.Body({
      shape:box, 
      mass:60, 
      type: CANNON.Body.STATIC,
      material: new CANNON.Material()});
  charBody.position.set(0,40,576);
  world.addBody(charBody);
  
}

// video
// const videoId = document.querySelector("#bg");
// const video = new THREE.VideoTexture(videoId);

// scene.background = video;

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

const ambientLight = new THREE.AmbientLight(0x222222, 1);

const hempLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(0, 90, 20);

scene.add(ambientLight, hempLight, pointLight);

renderer.render(scene, camera);

const loader = new GLTFLoader();
let model;
loader.load("../assets/dice.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  model.scale.set(500, 500, 500);
});

let debugRenderer = new THREE.cannonDebugRendere(scene,world);
//Init for normalizing mouse movement
const mouse = {
    x: undefined,
    y: undefined,
  };
  // Recrusive function for infinite loop
  function animate() {
    world.step(timestamp);
    debugRenderer.update();
    requestAnimationFrame(animate);
    if (model){
        model.rotation.x += 0.02;
        gsap.to(model.rotation, {
        x: -mouse.y * 3,
        y: mouse.x * 2,
        duration: 2,
    });
    }
    renderer.render(scene, camera);
  }
  animate();
  
  //Normalize mouse movement
  addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = (event.clientY / innerWidth) * 2 + 1;
  });