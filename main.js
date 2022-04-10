import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

//group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 0.1, 1000)
camera.position.z = 30
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg')
});

//in case window is resized!
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render()
}

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize ( window.innerWidth, window.innerHeight );

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 0.02, 16, 100 ) //10, 3, 16, 100
const material = new THREE.MeshStandardMaterial( {color: 0xFFFFFF } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff) //lights up from a point
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff) //kind of like a floodlight
scene.add(pointLight, ambientLight)

//const lightHelper = new THREE.PointLightHelper(pointLight) //shows position + direction of light source
//const gridHelper = new THREE.GridHelper(200, 50); // shows grid
//scene.add(lightHelper, /**gridHelper**/)

//const controls = new OrbitControls( camera, renderer.domElement); //magic! adds mouse controls to grid (pan, etc)


//add stars to scene!
function addStar() {
  const geometry = new THREE.SphereGeometry(0.125, 24, 24)
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//space img
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//img mapped to cube
const mappedTexture = new THREE.TextureLoader().load('cattelation.webp');

const texturedCube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial( {map: mappedTexture} )
)
scene.add(texturedCube)

//img mapped to sphere!
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( { map: moonTexture, normalMap: normalTexture })
);

scene.add(moon)

//move moon down
moon.position.y = -30;

//do stuff on scroll!
window.addEventListener('scroll', ()=>{
  const t = window.scrollY; //gets distance from top

  moon.rotation.x += 0.025;
  moon.rotation.y += 0.0375;
  moon.rotation.z += 0.025;

  texturedCube.rotation.y += 0.01;
  texturedCube.rotation.z += 0.01;

  //!!! IMPORTANT !!!//
  // you can play around with these to change scroll speed //
  // note t is negative
  camera.position.z = -8 * (- t / window.innerHeight) + 30; // change 30 to whatever starting z of camera is
  camera.position.y = 8 * (- t / window.innerHeight);
})

//parallax !!
/**
 * Cursor
*/
const cursor = {}
cursor.x = 0
cursor.y = 0

//update mousex and mousey on move
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / window.innerWidth - 0.5 //camera can go as much on the left as the right; thus, isntead of from 0 to 1, let's go from -0.5 to 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
})


//animate!!
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;
  moon.rotation.y += 0.0075;
  moon.rotation.z += 0.005;

  //controls.update();


  //parallax
  const parallaxX = cursor.x
  const parallaxY = - cursor.y
  //lerp!
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1

  

  renderer.render( scene, camera );
}

animate()