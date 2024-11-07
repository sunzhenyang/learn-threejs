import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer({
  antialias: true // 抗锯齿
})

// 设置分辨率
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)
camera.lookAt(0, 0, 0)

// 使用顶点方式绘制正方形平面
const geometry = new THREE.BufferGeometry()
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true // 线框模式
  // 材质可见面 -> FrontSide：正面  BackSide：背面  DoubleSide：双面
  // side: THREE.FrontSide
})

// 顶点顺序逆时针时为正面(默认可见)，顺时针时为反面(默认不可见)
const vertices = new Float32Array([
  1.0, 1.0, 0.0, -1.0, -1.0, 0, 1.0, -1.0, 0.0, 1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
console.log(geometry)
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

const light = new THREE.DirectionalLight(0xffffff, 1)
const axisHelp = new THREE.AxesHelper(5)
light.position.set(3, 3, 3)
scene.add(axisHelp)
scene.add(light)

function animate(time) {
  time *= 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)
