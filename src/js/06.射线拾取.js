import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const pixelRatio = window.devicePixelRatio
const width = Math.floor(window.innerWidth * pixelRatio)
const height = Math.floor(window.innerHeight * pixelRatio)
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1, 4)
camera.lookAt(0, 0, 0)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
sphere.position.x = -2
cylinder.position.x = 2
scene.add(sphere)
scene.add(box)
scene.add(cylinder)

// 创建射线
const raycaster = new THREE.Raycaster()

// 创建鼠标向量
const mouse = new THREE.Vector2()

window.addEventListener('mousedown', event => {
  // 设置鼠标向量的x/y值（归一化处理）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)

  // 计算物体和射线的焦点，返回依次经过的物体
  const intersects = raycaster.intersectObjects([sphere, box, cylinder])

  // 如过经过物体则给经过的第一个物体设置或取消选中状态
  if (intersects && intersects.length) {
    if (intersects[0].object._isSelect) {
      intersects[0].object._isSelect = false
      intersects[0].object.material.color.set(intersects[0].object._originColor)
    } else {
      intersects[0].object._isSelect = true
      intersects[0].object._originColor = intersects[0].object.material.color.getHex()
      intersects[0].object.material.color.set(0xff0000)
    }
  }
})

function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

new OrbitControls(camera, renderer.domElement)

const axisHelp = new THREE.AxesHelper(5)
scene.add(axisHelp)
