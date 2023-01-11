import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { auto, offset } from "@popperjs/core";

const scene = new THREE.Scene();
// const rollBtn = document.querySelector('.roll')

// video
const videoId = document.querySelector("#bg");
const video = new THREE.VideoTexture(videoId);

//audio
const listener = new THREE.AudioListener();

//audio loader
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);
//buat sfx untuk dice roll
const diceSound = new THREE.Audio(listener);
audioLoader.load("../assets/sfx2.mp3", function (buffer) {
  diceSound.setBuffer(buffer);
  diceSound.setLoop(false);
  diceSound.setVolume(1.0);
});

scene.background = video;

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
loader.load("../assets/dice2.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  model.scale.set(4, 4, 4);
});

//Init for normalizing mouse movement
// const mouse = {
//     x: undefined,
//     y: undefined,
//   };
// Recrusive function for infinite loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

const btnRoll = document.getElementById("roll");
btnRoll.addEventListener("click", rollBtn);

function rollBtn() {
  diceSound.play();
  let angka = Math.floor(Math.random() *6 + 1);

  // if (model) {
  //   if (angka == 1) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 2) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 3) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 4) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 5) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 6) {
  //     gsap.to(model.rotation, {
  //       x: 21.8,
  //       y: 23.5,
  //       duration: 2,
  //     });
  //   } else if (angka == 7) {
  //     gsap.to(model.rotation, {
  //       x: ,
  //       y: ,
  //       duration: 2,
  //     });
  //   } else if (angka == 8) {
  //     gsap.to(model.rotation, {
  //       x: 15.6,
  //       y: 24.8,
  //       duration: 2,
  //     });
  //   } else if (angka == 9) {
  //     gsap.to(model.rotation, {
  //       x: 18.7,
  //       y: 26.1,
  //       duration: 2,
  //     });
  //   } else if (angka == 12) {
  //     gsap.to(model.rotation, {
  //       x: 21.8,
  //       y: 19.8,
  //       duration: 2,
  //     });
  //   } else if (angka == 13) {
  //     gsap.to(model.rotation, {
  //       x: 18.7,
  //       y: 24.8,
  //       duration: 2,
  //     });
  //   } else if (angka == 15) {
  //     gsap.to(model.rotation, {
  //       x: 18.7,
  //       y: 29.9,
  //       duration: 2,
  //     });
  //   } else if (angka == 20) {
  //     gsap.to(model.rotation, {
  //       x: 19.8,
  //       y: 28,
  //       duration: 2,
  //     });
  // }

  // gsap.to(model.rotation, {
  //   x: (Math.random() *20 + 1),
  //   y: (Math.random() *20 + 1),
  //   // z: (Math.random)*2,
  //   duration: 1,
  //   });

  gsap.to(model.rotation, {
    x: 2.4,
    y: 11.9,
    // z: (Math.random)*2,
    duration: 1,
    });
  console.log(model.rotation);
  console.log(angka);
}
animate();
