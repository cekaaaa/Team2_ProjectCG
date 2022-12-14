import * as THREE from "three";
import gsap from "gsap";
import CANNON from "cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//SCENE
const scene = new THREE.Scene();



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

//LOADER
const loader = new GLTFLoader();
let model;
loader.load("../assets/dice.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  model.scale.set(500, 500, 500);
});

//FLOOR
var floor = new THREE.PlaneGeometry(30, 30, 10, 10);
scene.add(floor);
let floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
  material: DiceManager.floorBodyMaterial
});
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1, 0, 0),
  -Math.PI / 2
);
world.add(floorBody);

//WORLD
world = new CANNON.World();
world.gravity.set(0, -9.82 *20, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 16;

DiceManager.setWorld(world);

//WALLS
for (var i = 0; i < 5; i++){
  var die = new DiceD20
}

function randomDiceThrow() {
  var diceValues = [];

  for (var i = 0; i < dice.length; i++) {
    let yRand = Math.random() * 20;
    dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
    dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
    dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
    dice[i].getObject().quaternion.x =
      ((Math.random() * 90 - 45) * Math.PI) / 180;
    dice[i].getObject().quaternion.z =
      ((Math.random() * 90 - 45) * Math.PI) / 180;
    dice[i].updateBodyFromMesh();
    let rand = Math.random() * 5;
    dice[i]
      .getObject()
      .body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
    dice[i]
      .getObject()
      .body.angularVelocity.set(
        20 * Math.random() - 10,
        20 * Math.random() - 10,
        20 * Math.random() - 10
      );

    diceValues.push({ dice: dice[i], value: i + 1 });
  }

  DiceManager.prepareValues(diceValues);
}

//Init for normalizing mouse movement
const mouse = {
    x: undefined,
    y: undefined,
  };
  // Recrusive function for infinite loop
  function animate() {
    requestAnimationFrame(animate);
    if (model){
        model.rotation.x += 0.02;
        gsap.to(model.rotation, {
        x: -mouse.y * 3,
        y: mouse.x * 2,
        duration: 15,
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