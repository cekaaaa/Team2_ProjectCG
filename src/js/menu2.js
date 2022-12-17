import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { offset } from "@popperjs/core";

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
const diceSound = new  THREE.Audio(listener);
audioLoader.load('../assets/sfx2.mp3',function(buffer){
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
loader.load("../assets/dice.glb", function (gltf) {
  model = gltf.scene;
  scene.add(model);
  model.scale.set(500, 500, 500);
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

  function rollBtn(){
    diceSound.play();
    let angka = Math.floor(Math.random()*6+1);
  
    if (model){
      
        if(angka == 1){      
        gsap.to(model.rotation, {
        x: 12.6,
        y: 3.2,
        duration: 2,
        });
      }
    
        else if(angka == 2){      
        gsap.to(model.rotation, {
        x: 12.5,
        y: 31.5,
        duration: 2,
        });
      }
    
        else if(angka == 3){      
        gsap.to(model.rotation, {
        x: 6.4,
        y: 14.1,
        duration: 2,
        });
      }
    
        else if(angka == 4){      
        gsap.to(model.rotation, {
          x: 12.6,
          y: 29.9,
        duration: 2,
        });
      }
    
        else if(angka == 5){      
        gsap.to(model.rotation, {
            x: 11.1,
            y: 18.8,
            duration: 2,
            });
      }
    
      else if(angka == 6){      
        gsap.to(model.rotation, {
        x: 26.7,
        y: 11,
        duration: 2,
        });
      }
    }
    
    // else if(angka == 2){

    // }
    // gsap.to(model.rotation, {
    //   x: Math.random() * 10,
    //   y: Math.random() * 20,
    //   duration: 1,
    //   });
    console.log(model.rotation);
    console.log(angka);
  }
  animate();