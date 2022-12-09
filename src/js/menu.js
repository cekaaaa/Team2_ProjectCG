import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

// const scene = new THREE.Scene();
// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0);
// world.broadphase = new CANNON.NaiveBroadphase();
// let timestamp = 1.0/60.0;

// function addObjects(){
//   let box = new CANNON.Box(new CANNON.Vec3(2,2,2));
//   charBody = new CANNON.Body({
//       shape:box, 
//       mass:60, 
//       type: CANNON.Body.STATIC,
//       material: new CANNON.Material()});
//   charBody.position.set(0,40,576);
//   world.addBody(charBody);
  
// }

// // video
// // const videoId = document.querySelector("#bg");
// // const video = new THREE.VideoTexture(videoId);

// // scene.background = video;

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// //Render the object into canvas with an id bg
// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector("#dice"),
// });
// // Optimizing renderer with window ratio
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.z = 30;

// const ambientLight = new THREE.AmbientLight(0x222222, 1);

// const hempLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

// const pointLight = new THREE.PointLight(0xffffff, 1, 0);
// pointLight.position.set(0, 90, 20);

// scene.add(ambientLight, hempLight, pointLight);

// renderer.render(scene, camera);

// const loader = new GLTFLoader();
// let model;
// loader.load("../assets/dice.glb", function (gltf) {
//   model = gltf.scene;
//   scene.add(model);
//   model.scale.set(500, 500, 500);
// });

// let debugRenderer = new THREE.cannonDebugRendere();
// //Init for normalizing mouse movement
// const mouse = {
//     x: undefined,
//     y: undefined,
//   };
//   // Recrusive function for infinite loop
//   function animate() {
//     world.step(timestamp);
//     debugRenderer.update();
//     requestAnimationFrame(animate);
//     if (model){
//         model.rotation.x += 0.02;
//         gsap.to(model.rotation, {
//         x: -mouse.y * 3,
//         y: mouse.x * 2,
//         duration: 2,
//     });
//     }
//     renderer.render(scene, camera);
//   }
//   animate();
  
//   //Normalize mouse movement
//   addEventListener("mousemove", (event) => {
//     mouse.x = (event.clientX / innerWidth) * 2 - 1;
//     mouse.y = (event.clientY / innerWidth) * 2 + 1;
//   });


// standard global variables
var container,
	scene,
	camera,
	renderer,
	controls,
	stats,
	world,
	dice = [];

init();

// FUNCTIONS
function init() {
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth,
		SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 20,
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
		NEAR = 1,
		FAR = SCREEN_HEIGHT * 1.3;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0, 80, 0);
	// camera.position.z = SCREEN_HEIGHT
	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	container = document.getElementById("ThreeJS");
	container.appendChild(renderer.domElement);
	// EVENTS
	// CONTROLS
	controls = new OrbitControls(camera, renderer.domElement);
	// STATS
	stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = "0px";
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);

	let ambient = new THREE.AmbientLight("#ffffff", 0.3);
	scene.add(ambient);

	let directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
	directionalLight.position.x = -1000;
	directionalLight.position.y = 1000;
	directionalLight.position.z = 1000;
	scene.add(directionalLight);

	let light = new THREE.SpotLight(0xefdfd5, 1.3);
	light.position.y = 100;
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	light.shadow.camera.near = 50;
	light.shadow.camera.far = 110;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	scene.add(light);

	// FLOOR
	var floorMaterial = new THREE.MeshPhongMaterial({
		color: "#FFFF",
		side: THREE.DoubleSide
	});
	var floorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyBoxMaterial = new THREE.MeshPhongMaterial({
		color: 0x9999ff,
		side: THREE.BackSide
	});
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);
	scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

	////////////
	// CUSTOM //
	////////////
	world = new CANNON.World();

	world.gravity.set(0, -9.82 * 20, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 16;

	DiceManager.setWorld(world);

	//Floor
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

	//Walls

	for (var i = 0; i < 1; i++) { //jumlah dadu
		var die = new GLTFLoader({ 
			size: 4,
			backColor: "#000000",
			fontColor: "#fff"
		});
		scene.add(die.getObject());
		dice.push(die);
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

		
	}

	document
		.querySelector("#ThreeJS")
		.addEventListener("click", randomDiceThrow);
	// setInterval(randomDiceThrow, 3000);
	// randomDiceThrow();

	requestAnimationFrame(animate);
}

function animate() {
	updatePhysics();
	render();
	update();

	requestAnimationFrame(animate);
}

function updatePhysics() {
	world.step(1.0 / 60.0);

	for (var i in dice) {
		dice[i].updateMeshFromBody();
	}
}

function update() {
	controls.update();
	stats.update();
}

function render() {
	renderer.render(scene, camera);
}