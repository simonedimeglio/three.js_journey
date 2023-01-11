import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg",
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false; // performance upgrade

// ENVIRONMENT MAP
const environmentMapTexture = cubeTextureLoader.load([
	"/textures/environmentMaps/1/px.jpg",
	"/textures/environmentMaps/1/nx.jpg",
	"/textures/environmentMaps/1/py.jpg",
	"/textures/environmentMaps/1/ny.jpg",
	"/textures/environmentMaps/1/pz.jpg",
	"/textures/environmentMaps/1/nz.jpg",
]);

/**
 * Objects
 */

// MESH BASIC MATERIAL (standard material, a lot of functions)
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('#f00')
// material.color = new THREE.Color('lime')
// material.wireframe = true
// material.transparent = true // with opacity or alphamap
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide // for vision of booth plane side

// MESH NORMAL MATERIAL (a nice purple, blueish, greenish color)
const MeshNormalMaterial = new THREE.MeshNormalMaterial();
MeshNormalMaterial.wireframe = true;
// MeshNormalMaterial.flatShading = true

// MESH MATCAP MATERIAL (simulating light without light)
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MESH DEPTH MATERIAL (color the geometry in white if it's close to the near and in black if it's close to the far value of the camera)
// const material = new THREE.MeshDepthMaterial()

// MESH LAMBERT MATERIAL (will react to light)
// const material = new THREE.MeshLambertMaterial()

// MESH PHONG MATERIAL (similar to lambert, but the strange patterns are less visible)
// const material = new THREE.MeshPhongMaterial()

// MESH TOON MATERIAL (similar to lambert, but with a cartoonish)
const MeshToonMaterial = new THREE.MeshToonMaterial();
MeshToonMaterial.gradientMap = gradientTexture;

// MESH STANDARD MATERIAL (physically based rendering principles (PBR), like lambert and phong but with more realistic algorithm and better parameters like roughness and metalness)
const MeshStandardMaterial = new THREE.MeshStandardMaterial();
MeshStandardMaterial.metalness = 0;
MeshStandardMaterial.roughness = 1;
MeshStandardMaterial.map = doorColorTexture;
MeshStandardMaterial.aoMap = doorAmbientOcclusionTexture;
MeshStandardMaterial.aoMapIntensity = 1;
MeshStandardMaterial.displacementMap = doorHeightTexture;
MeshStandardMaterial.displacementScale = 0.05;
MeshStandardMaterial.metalnessMap = doorMetalnessTexture;
MeshStandardMaterial.roughnessMap = doorRoughnessTexture;
MeshStandardMaterial.normalMap = doorNormalTexture;
MeshStandardMaterial.normalScale.set(0.5, 0.5);
MeshStandardMaterial.transparent = true;
// MeshStandardMaterial.alphaMap = doorAlphaTexture

const MeshStandardMaterial2 = new THREE.MeshStandardMaterial();
MeshStandardMaterial2.metalness = 0.9;
MeshStandardMaterial2.roughness = 0;
MeshStandardMaterial2.envMap = environmentMapTexture;

// MATERIAL SHININESS (we can control teh light reflection with shininess and the color of this reflection with specular)
MeshStandardMaterial2.shininess = 10;
MeshStandardMaterial2.specular = new THREE.Color(0x1100ff);

// Tweaks for debug
gui.add(MeshStandardMaterial2, "metalness").min(0).max(1).step(0.0001);
gui.add(MeshStandardMaterial2, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, 'aoMapIntensity').min(0).max(5).step(0.0001)
// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(1, 1, 100, 100),
//     material
// )

const sphere1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 64, 64),
	MeshStandardMaterial,
);
sphere1.position.x = -1.5;

const torus1 = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	MeshStandardMaterial2,
);
torus1.position.x = 0;

const sphere2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 64, 64),
	MeshNormalMaterial,
);
sphere2.position.x = 1.5;

scene.add(sphere1, torus1, sphere2);

// plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
sphere1.geometry.setAttribute(
	"uv2",
	new THREE.BufferAttribute(sphere1.geometry.attributes.uv.array, 2),
);
torus1.geometry.setAttribute(
	"uv2",
	new THREE.BufferAttribute(torus1.geometry.attributes.uv.array, 2),
);
sphere2.geometry.setAttribute(
	"uv2",
	new THREE.BufferAttribute(sphere2.geometry.attributes.uv.array, 2),
);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.x = 4;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	sphere1.rotation.y = 0.1 * elapsedTime;
	// plane.rotation.y = 0.1 * elapsedTime
	torus1.rotation.y = 0.1 * elapsedTime;
	sphere2.rotation.y = 0.1 * elapsedTime;

	sphere1.rotation.x = 0.55 * elapsedTime;
	// plane.rotation.x = 0.15 * elapsedTime
	torus1.rotation.x = 0.25 * elapsedTime;
	sphere2.rotation.x = -0.25 * elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
