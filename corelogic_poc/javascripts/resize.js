let ratio = (22 / 39)
let width, height = 0

async function resizeCanvases() {
  let canvases = document.getElementsByClassName('m-scene__svg')
  for (const canvas of canvases) {
    canvas.style.paddingBottom = ((height / width) * 100) + '%'
  }
}

async function resizeImages() {
  let images = document.getElementsByClassName('a-image')
  for (const image of images) {
    image.style.width = width + 'px'
    image.style.height = height + 'px'
  }
}

async function resizeScenes() {
  let scenes = document.getElementsByClassName('m-scene')
  for (const scene of scenes) {
    scene.style.height = height + 'px'
  }
}

async function resizeVideo() {
  let videos = document.getElementsByClassName('m-scene__video')
  for(const video of videos) {
    video.style.width = width + 'px'
    video.style.height = height + 'px'
  }
}

let getScreenDimensions = () => {
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  height = Math.round((width * ratio) * 100) / 100
}

let resizer7000 = () => {
  getScreenDimensions()
  document.getElementsByClassName('o-animation')[0].style.height = height + 'px'
  resizeScenes()
  resizeVideo()
  // resizeCanvases()
}

export default {
  init: () => {
    resizer7000()
    if (window.attachEvent) {
      window.attachEvent('onresize', resizer7000);
    }
    else if (window.addEventListener) {
      window.addEventListener('resize', resizer7000, true);
    }
  },
  all: () => {
    getScreenDimensions()
    resizeScenes()
    // resizeCanvases()
  },
}