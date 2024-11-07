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
camera.position.set(0, 0, 5)
camera.lookAt(0, 0, 0)

const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('./public/texture/uv_grid_opengl.jpg')
const material = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide })
const plane1Geometry = new THREE.PlaneGeometry(2, 2)
const plane1 = new THREE.Mesh(plane1Geometry, material)
console.log('plane1Geometry', plane1Geometry)
plane1.position.x = -2
scene.add(plane1)

// 使用顶点方式绘制正方形平面（无UV信息）
const plane2Geometry = new THREE.BufferGeometry()

// 顶点顺序逆时针时为正面(默认可见)，顺时针时为反面(默认不可见)
const vertices = new Float32Array([1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0, 1.0, -1.0, 0])
const indices = new Uint16Array([0, 1, 2, 0, 2, 3])

// 设置UV坐标(两个点为一组，与四个顶点对应)
const uv = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0])
plane2Geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

plane2Geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
plane2Geometry.setIndex(new THREE.BufferAttribute(indices, 1))
console.log('plane2Geometry', plane2Geometry)
const plane2 = new THREE.Mesh(plane2Geometry, material)
plane2.position.x = 2
scene.add(plane2)

const axisHelp = new THREE.AxesHelper(5)
scene.add(axisHelp)

function animate(time) {
  time *= 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)
