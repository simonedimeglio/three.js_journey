// FIRST EXAMPLE

// console.log(THREE);

/* 
For the first scene we need 4 elements to get started:
1) A scene that will contain objects
2) Some objects 
3) A camera
4) A redender


SCENE
- Like a container
- We put objects, models, lights, etc. in it
- At some poin we ask Three.js to render that scene

OBJECTS
- Primitive Geometries
- Imported models
- Particles
- Lights
- Etc.
Start with a simple red cube
We need to create a Mesh: combination of a geometry (shape) and material (how it looks).
Start with a BoxGeometry and a MeshBasicMaterial

CAMERA 
- Not visible
- Serve as point of view when doing a render 
- Can have multiple and switch between them 
- Different types 
- We are going to use PerspectiveCamera 

RENDERER
- Render the scene from the camera pov 
- Result drawn into a canvas
- A canvas is an HTML element in wich you can draw stuff
- Three.js will use WebGL to draw the render inside this canvas 
- You can create it or you can let Three.js do it

*/

// Scene
const scene = new THREE.Scene();

// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1); // The first 3 parameters correspond to the box's size
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
	width: 800,
	height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // First parameter -> fov in degrees | Second parameter -> aspect ratio
camera.position.z = 3;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
