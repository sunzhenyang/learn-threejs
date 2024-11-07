import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)
camera.lookAt(0, 0, 0)

// 颜色贴图
const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('./public/texture/uv_grid_opengl.jpg')

// 设置贴图颜色空间
map.colorSpace = THREE.SRGBColorSpace

// 定义材质
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map,
  transparent: true
})

// 加载 hdr 全景贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图映射
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置场景背景
  scene.background = envMap
  // 设置场景中所有物理材质的环境贴图
  scene.environment = envMap
  // 设置平面环境贴图
  material.envMap = envMap
})

// 平面1有法向量(plane1Geometry.attributes.normal)，有反射光效果
const plane1Geometry = new THREE.PlaneGeometry(2, 2)
const plane1 = new THREE.Mesh(plane1Geometry, material)
plane1.position.x = -2
scene.add(plane1)

// 平面2没有法向量(plane1Geometry.attributes.normal)，无反射光效果
const plane2Geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0, 1.0, -1.0, 0])
const indices = new Uint16Array([0, 1, 2, 0, 2, 3])
const uv = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0])
plane2Geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
plane2Geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
plane2Geometry.setIndex(new THREE.BufferAttribute(indices, 1))

/**
 * 设置法向量(plane1Geometry.attributes.normal)，使其具有反射光效果
 * 方法1：自动计算  plane2Geometry.computeVertexNormals()
 * 方法2：自行设置法向量
 */
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])
plane2Geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
const plane2 = new THREE.Mesh(plane2Geometry, material)
plane2.position.x = 2
scene.add(plane2)

// 添加顶点法向量辅助器
const helper1 = new VertexNormalsHelper(plane1, 0.5, 0xff0000)
const helper2 = new VertexNormalsHelper(plane2, 0.5, 0x00ff00)
scene.add(helper1)
scene.add(helper2)

function animate(time) {
  time *= 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)

const axisHelp = new THREE.AxesHelper(5)
scene.add(axisHelp)
