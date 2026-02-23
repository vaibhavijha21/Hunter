import * as THREE from 'three'
import './index.css'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// Camera (Player)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.y = 2

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 20, 10)
scene.add(light)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// ==========================
// 🧱 BLOCK WORLD
// ==========================

const blockSize = 1
const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize)

for (let x = -20; x < 20; x++) {
  for (let z = -20; z < 20; z++) {
    const material = new THREE.MeshStandardMaterial({
      color: 0x228B22
    })

    const block = new THREE.Mesh(geometry, material)
    block.position.set(x, 0, z)
    scene.add(block)
  }
}

// ==========================
// 🎮 PLAYER MOVEMENT
// ==========================

const keys = {}

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true
})

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

const speed = 0.1
let yaw = 0
let pitch = 0

// Mouse look
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002
    pitch -= e.movementY * 0.002

    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))

    camera.rotation.set(pitch, yaw, 0)
  }
})

// Click to lock mouse
document.body.addEventListener('click', () => {
  document.body.requestPointerLock()
})

// ==========================
// 🔁 Animation Loop
// ==========================

function animate() {
  requestAnimationFrame(animate)

  const forward = new THREE.Vector3()
  camera.getWorldDirection(forward)
  forward.y = 0
  forward.normalize()

  const right = new THREE.Vector3()
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

  if (keys['w']) camera.position.add(forward.clone().multiplyScalar(speed))
  if (keys['s']) camera.position.add(forward.clone().multiplyScalar(-speed))
  if (keys['a']) camera.position.add(right.clone().multiplyScalar(speed))
  if (keys['d']) camera.position.add(right.clone().multiplyScalar(-speed))

  renderer.render(scene, camera)
}

animate()

// Resize fix
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})