import * as THREE from 'three'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js' 
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import gsap from 'gsap'


const scene = new THREE.Scene()
const camera = new THREE.
	PerspectiveCamera(
		75,
		innerWidth / innerHeight,
		//canvasContainer.offsetWidth /canvasContainer.offsetHeight,
		0.1,
		1000
	)

const renderer = new THREE.WebGLRenderer(
{
	antialias: true
})

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.
	devicePixelRatio)
document.body.appendChild(renderer.domElement)




//create a spehere
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(5,50,50),
	new THREE.ShaderMaterial({
		//color: 0xff0000
		//map: new THREE.TextureLoader().load('./img/mercury.jpg')
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			planetTexture: {
				value: new THREE.TextureLoader().load('./img/mercury.jpg')
			}
		}
	})
)

scene.add(sphere)

//create atmosphere
const atmosphere = new THREE.Mesh(
	new THREE.SphereGeometry(5,50,50),
	new THREE.ShaderMaterial({
		//color: 0xff0000
		//map: new THREE.TextureLoader().load('./img/mercury.jpg')
		vertexShader: atmosphereVertexShader,
		fragmentShader: atmosphereFragmentShader,
		side: THREE.BackSide
	})
)

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.
	BufferGeometry()
const starMaterial = new THREE.
	PointsMaterial({
		color:0xffffff
	})
const starVertices = []
for (let i = 0; i<10000; i++) {
	const x = (Math.random() - 0.5) * 2000
	const y = (Math.random() - 0.5) * 2000
	const z = -Math.random() * 3000
	starVertices.push(x,y,z)
}

starGeometry.setAttribute('position',
	 new THREE.Float32BufferAttribute(
	 	starVertices, 3))

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z=15


const mouse = {
	x: undefined,
	y: undefined
}

new OrbitControls(camera, renderer.domElement)

let angle = 0;

window.addEventListener("keydown", function(event) {
	if(event.key == "ArrowLeft") {
		angle -= 0.075;
		camera.position["x"] = 10*Math.sin(angle);
		camera.position["z"] = 10*Math.cos(angle);
		camera.lookAt(0, 0,0);
		camera.updateProjectionMatrix();
	}
})
window.addEventListener("keydown", function(event) {
	if(event.key == "ArrowRight") {
		angle += 0.075;
		camera.position["x"] = 10*Math.sin(angle);
		camera.position["z"] = 10*Math.cos(angle);
		camera.lookAt(0, 0,0);
		camera.updateProjectionMatrix();
	}
})


function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
	sphere.rotation.y += 0.005 //increase rotation speed
	group.rotation.y = mouse.x
	group.rotation.x = mouse.y	
}
animate()


addEventListener('mousemove',() => {
	mouse.x = (event.clientX / innerWidth) * 2 - 1
	mouse.y = (event.clientY / innerHeight) * 2 - 1 
})
