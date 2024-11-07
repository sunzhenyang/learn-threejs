// 基础代码
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const axesHelper = new THREE.AxesHelper(3)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
renderer.setSize(window.innerWidth, window.innerHeight)
controls.enableDamping = true
camera.position.set(3, 3, 3)
camera.lookAt(0, 0, 0)
document.body.appendChild(renderer.domElement)
scene.add(cube)
scene.add(axesHelper)

function animate() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

window.onresize = function () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

const eventObj = {
  fullScreen() {
    const isFullScreen = document.fullscreenElement
    if (!isFullScreen) {
      document.body.requestFullscreen()
      console.log('全屏')
    }
  },
  exitFullScreen() {
    const isFullScreen = document.fullscreenElement
    if (isFullScreen) {
      document.exitFullscreen()
      console.log('退出全屏')
    }
  }
}

// 创建 GUI
const gui = new GUI()

// 添加按钮并修改按钮文本
gui.add(eventObj, 'fullScreen').name('全屏')
gui.add(eventObj, 'exitFullScreen').name('退出全屏')

// 添加选项框，修改元素是否为线框样式
gui.add(material, 'wireframe').name('线框模式')

// 添加颜色选择
gui.addColor(material, 'color').name('颜色选择')

// 控制立方体位置
gui.add(cube.position, 'x').name('立方体X轴位置') // 值显示为输入框
gui.add(cube.position, 'y', -5, 5).name('立方体Y轴位置') // 值显示为滑块
gui.add(cube.position, 'z').min(-5).max(5).step(1).name('立方体Z轴位置') // 设置步长

// 设置组，控制立方体旋转 .close() 默认收起组内显示
const folder = gui.addFolder('立方体旋转').close()
folder
  .add(cube.rotation, 'x', -Math.PI, Math.PI)
  .name('X轴')
  .onChange(value => {
    // 值改变时触发事件函数
    console.log('change value：' + value)
  })
folder
  .add(cube.rotation, 'y', -Math.PI, Math.PI)
  .name('Y轴')
  .onFinishChange(value => {
    // 值改变结束时触发事件函数
    console.log('finish change value：' + value)
  })
folder.add(cube.rotation, 'z', -Math.PI, Math.PI).name('Z轴')
