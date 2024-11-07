import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建场景
const scene = new THREE.Scene()

/**
 * 创建透视摄像机
 * 第一个参数是视野角度（FOV），指能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)
 * 第二个参数是长宽比， 也就是一个物体的宽除以它的高的值
 * 最后两个参数是近截面和远截面，
 *      当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中
 *      设置这两值可以获得更好的渲染性能
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 默认情况下，调用scene.add()的时候，物体将会被添加到(0,0,0)坐标
// 防止摄像机和立方体重合，需要将摄像机稍微向外移动一些
camera.position.set(3, 3, 3)

// 设置摄像机观察方向(注：先设置位置，再设置观察方向)
camera.lookAt(0, 0, 0)

// 创建渲染器 antialias：抗锯齿
const renderer = new THREE.WebGLRenderer({ antialias: true })

/**
 * 设置渲染器尺寸
 * 参数为渲染 宽度、渲染高度、updateStyle
 * 希望保持应用程序的尺寸，但是以较低的分辨率来渲染，可以在调用 setSize 时将 updateStyle 设为false
 * 假设 <canvas> 标签现在已经具有了100%的宽和高，调用 setSize(window.innerWidth/2, window.innerHeight/2, false) 将使得应用程序以一半的分辨率来进行渲染
 */
renderer.setSize(window.innerWidth, window.innerHeight)

// 将 renderer（渲染器）的 dom 元素（渲染器用来显示场景的 <canvas> 元素）添加到 HTML 文档中
document.body.appendChild(renderer.domElement)

// 添加坐标辅助观察
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 启用轨道控制器阻尼（惯性），如果该值被启用，必须在动画循环里调用 .update()
controls.enableDamping = true
// 当启用阻尼（惯性）时，阻尼惯性有多大，默认 0.05
controls.dampingFactor = 0.02

// 创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 创建一种材质(网格基础材质)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

/**
 * 创建一个 Mesh（网格）
 * 网格包含一个几何体以及作用在此几何体上的材质
 */
const cube = new THREE.Mesh(geometry, material)

// 将网格对象放入到场景中，并让它在场景中自由移动
scene.add(cube)

// 设置渲染循环（动画循环）
function animate(time) {
  time *= 0.001
  // 更新立方体的旋转角度
  cube.rotation.x = time
  cube.rotation.y = time
  // 重新渲染
  controls.update()
  renderer.render(scene, camera)
  /**
   * requestAnimationFrame 优点
   * 当用户切换到其它的标签页时，它会暂停
   * 不会浪费用户宝贵的处理器资源，也不会损耗电池的使用寿命
   */
  requestAnimationFrame(animate)
}

// 监听页面宽高变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

// 运行动画
animate()
