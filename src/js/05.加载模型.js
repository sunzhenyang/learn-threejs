import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(2, 2, 3)
camera.lookAt(0, 0, 0)
scene.background = new THREE.Color(0x999999)

const rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图映射
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置场景背景
  scene.background = envMap
  // 设置场景中所有物理材质的环境贴图
  scene.environment = envMap
})

// 加载模型
const gltfLoader = new GLTFLoader()
gltfLoader.load('./model/Duck.glb', gltf => {
  scene.add(gltf.scene)
})

// 实例化加载器 draco，用于处理压缩后的模型
const dracoLoader = new DRACOLoader()

/**
 * 复制 draco 文件夹到静态目录，并设置 draco 路径
 * 文件位置：node_modules\three\examples\jsm\libs\draco
 */
dracoLoader.setDecoderPath('./draco/')

// 设置 gltf 加载器为 draco 解码器
gltfLoader.setDRACOLoader(dracoLoader)

// 加载城市模型
gltfLoader.load('./model/city.glb', gltf => {
  scene.add(gltf.scene)
})

function animate(time) {
  time *= 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)

const axisHelp = new THREE.AxesHelper(5)
scene.add(axisHelp)
