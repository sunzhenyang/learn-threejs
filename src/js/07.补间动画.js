import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)
camera.lookAt(0, 0, 0)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(geometry, material)
cube.position.x = -4
scene.add(cube)

// 创建补间动画对象
const tween = new TWEEN.Tween(cube.position)

// 位移属性
tween.to({ x: 4 })

// 动画时长(ms)
tween.duration = 1000

// 重复次数
tween.repeat(Infinity)

// 是否在下一周期逆向地播放
tween.yoyo(true)

// 动画播放延时(ms)
tween.delay(500)

// 设置缓动函数
tween.easing(TWEEN.Easing.Elastic.Out)

// 开始事件
tween.onStart(() => {
  console.log('开始')
})

// 结束事件
tween.onComplete(() => {
  console.log('结束')
})

// 停止事件
tween.onStop(() => {
  console.log('停止')
})

// 更新事件
tween.onUpdate(val => {
  console.log(val)
})

tween.start()

function animate() {
  renderer.render(scene, camera)
  // 更新动画
  TWEEN.update()
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)

const axisHelp = new THREE.AxesHelper(7)
scene.add(axisHelp)
