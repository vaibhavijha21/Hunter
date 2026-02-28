import * as THREE from 'three'
import './index.css'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Light
scene.add(new THREE.AmbientLight(0xffffff, 0.7))
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 20, 10)
scene.add(light)

// =======================
// 🧱 FLOOR
// =======================

const floorGeo = new THREE.BoxGeometry(50, 1, 50)
const floorMat = new THREE.MeshStandardMaterial({ color: 0x228B22 })
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.position.y = -0.5
scene.add(floor)

// =======================
// 🧍 PLAYER
// =======================

const playerGeo = new THREE.BoxGeometry(1, 2, 1)
const playerMat = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const player = new THREE.Mesh(playerGeo, playerMat)

player.position.y = 1
scene.add(player)

// =======================
// 🎮 MOVEMENT
// =======================

const keys = {}
const speed = 0.1

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true
})

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

// =======================
// 🔁 ANIMATE
// =======================

function animate() {
  requestAnimationFrame(animate)

  if (keys['w']) player.position.z -= speed
  if (keys['s']) player.position.z += speed
  if (keys['a']) player.position.x -= speed
  if (keys['d']) player.position.x += speed

  // Camera follow player
  camera.position.x = player.position.x
  camera.position.z = player.position.z + 5
  camera.position.y = player.position.y + 5

  camera.lookAt(player.position)

  renderer.render(scene, camera)
}

animate()

// Resize fix
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})