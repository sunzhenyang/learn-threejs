import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 3)
camera.lookAt(0, 0, 0)

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

const textureLoader = new THREE.TextureLoader()

// 颜色贴图
const map = textureLoader.load('./texture/watercover/CityNewYork002_COL_VAR1_1K.png')

// 设置贴图颜色空间
map.colorSpace = THREE.SRGBColorSpace

// 环境遮挡贴图（加深图片阴影）：纹理的红色通道用作环境遮挡贴图
const aoMap = textureLoader.load('./texture/watercover/CityNewYork002_AO_1K.jpg')

// 透明度贴图：灰度纹理，用于控制整个表面的不透明度（黑色：完全透明；白色：完全不透明）
const alphaMap = textureLoader.load('./texture/door/height.jpg')

// 光照贴图
const lightMap = textureLoader.load('./texture/colors.png')

// 高光贴图（根据黑白灰显示图片反射强度）
const specularMap = textureLoader.load('./texture/watercover/CityNewYork002_GLOSS_1K.jpg')

const material = new THREE.MeshBasicMaterial({
  color: 0xffffff, // 材质的颜色
  side: THREE.DoubleSide, // 双面显示
  map, // 颜色贴图
  transparent: true, // 材质是否透明
  aoMap, // 环境遮挡贴图
  alphaMap, // 透明度贴图
  lightMap, // 光照贴图
  specularMap // 高光贴图
})

const gui = new GUI()
//aoMapIntensity 默认值为 1，0 是不遮挡效果
gui.add(material, 'aoMapIntensity').min(0).max(1).name('环境遮挡效果的强度')
gui.add(material, 'lightMapIntensity').min(0).max(1).name('烘焙光的强度')
// reflectivity 默认值为1，有效范围介于0（无反射）和1（完全反射）之间
gui.add(material, 'reflectivity').min(0).max(1).name('环境贴图对表面的影响程度')
gui
  .add(map, 'colorSpace', {
    sRGB: THREE.SRGBColorSpace,
    Linear: THREE.LinearSRGBColorSpace
  })
  .name('颜色空间')
  .onChange(() => {
    map.needsUpdate = true
  })

const geometry = new THREE.PlaneGeometry(3, 3)
const palne = new THREE.Mesh(geometry, material)
scene.add(palne)

function animate(time) {
  time *= 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)

const axisHelp = new THREE.AxesHelper(5)
scene.add(axisHelp)
