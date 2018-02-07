webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(6);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__javascripts_scroll__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__javascripts_preload__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__javascripts_resize__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__javascripts_svg__ = __webpack_require__(5);





let isMobile = 'ontouchstart' in window || 'onmsgesturechange' in window
let tl = null


/**
 * Disable scrolling on the page
 *
 * @param func - function - The function to execute when scrolling
 * @author jordanskomer
 */
let disable = () => {
  if (document.body.addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.body.addEventListener('mousewheel', MouseWheelHandler, false)
    // Firefox
    document.body.addEventListener('DOMMouseScroll', MouseWheelHandler, false)
  }
  // IE 6/7/8
  else {
    document.body.attachEvent('onmousewheel', MouseWheelHandler)
  }
}

/**
 * Reanables scrolling on the page
 *
 * @author jordanskomer
 */
let enable = () => {
  if (document.body.addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.body.removeEventListener('mousewheel', MouseWheelHandler, false);
    // Firefox
    document.body.removeEventListener('DOMMouseScroll', MouseWheelHandler, false);
  }
  // IE 6/7/8
  else {
    document.body.detachEvent('onmousewheel', MouseWheelHandler)
  }
}

let johnson = 0.01

let MouseWheelHandler = function (e) {
  e.preventDefault()
  let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (e.originalEvent) {
    if (e.originalEvent.wheelDelta) { e.delta = e.originalEvent.wheelDelta / -40 }
    if (e.originalEvent.deltaY) { e.delta = e.originalEvent.deltaY }
    if (e.originalEvent.detail) { e.delta = e.originalEvent.detail }
  }
  let direction = Math.ceil(e.deltaY / height)
  // johnson = e.deltaY > 0 ? johnson : -johnson
  let delta = 0.005 * e.deltaY
  let number = delta + tl.time()
  // let number = direction === 1 ? johnson + tl.time() : -johnson + tl.time()
  let newPercent = Math.round((number) / tl.duration() * 100) / 100
  if (newPercent > 1 || newPercent < 0) { newPercent = Math.round(newPercent) }
  console.log(number, newPercent)
  if ((tl.progress() === 1 && direction === 1) || (tl.progress() === 0 && direction === 0)) {
    enable()
  } else {
    tl.progress(newPercent).pause()
  }

}
/**
 * Magic happens here
 */
let animate = () => {
  let scrollController = new ScrollMagic.Controller()
  let video = document.getElementById('j-video')

  video.onloadeddata = () => {
    tl = new TimelineMax({
      paused: true,
      yoyo: true
    })
    tl.add(TweenMax.to(video, 1, { currentTime: 20, ease: Power0.easeNone }))
    // tl.add(TweenMax.staggerTo('.a-image', 0.05, { opacity: 1 }, 0.05))
    new ScrollMagic.Scene({
      triggerElement: '#j-animationTrigger',
    })
    .on('start', () => {
      disable()
    })
    .addIndicators()
    .addTo(scrollController)
  }
  video.src = "https://www.apple.com/media/us/mac-pro/2013/16C1b6b5-1d91-4fef-891e-ff2fc1c1bb58/videos/macpro_main_desktop.mp4";
  // video.src = './video.mp4'
}


let doall = () => {
  __WEBPACK_IMPORTED_MODULE_3__javascripts_svg__["a" /* default */].setup()
  __WEBPACK_IMPORTED_MODULE_2__javascripts_resize__["a" /* default */].init()
  animate()
}

/**
 * Preloads images in the background that will be used for the '3D' transition
 *
 * @author jordanskomer
 */
let loadImages = () => {
  const frameCount = 150
  let firstImage = document.getElementById('j-image1')
  // Insert all of the divs
  for (let frameNumber = 2; frameNumber <= frameCount; frameNumber += 5) {
    let newDiv = document.createElement('div')
    newDiv.classList.add('a-image')
    newDiv.id = 'j-image' + frameNumber
    firstImage.parentNode.insertBefore(newDiv, firstImage.nextSibling)
    // remove this to just be  newDiv.style.backgroundImage = 'url(\'../images/frames/frame' + frameNumber + '.jpg\')'
    newDiv.style.backgroundImage = 'url(\'images/frames/frame' + frameNumber + '.jpg\')'
  }
  doall()
}

  /**
   * Support for making sure the preloader gets loaded in once the page has been painted and rendered
   *
   * @author jordanskomer
   */
let runOnLoad = (func) => {
  let defaultLoad = window.onload
  if (typeof window.onload !== 'function') {
    window.onload = func
  } else {
    window.onload = () => {
      if (defaultLoad) { defaultLoad() }
      func()
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (isMobile) {
    runOnLoad(__WEBPACK_IMPORTED_MODULE_2__javascripts_resize__["a" /* default */].all)
    console.log('im mobile!')
  } else {
    runOnLoad(doall)
  }
})


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let MouseWheelHandler = function (e) {
  e.preventDefault()
  e.delta = null;
  if (e.originalEvent) {
    if (e.originalEvent.wheelDelta) { e.delta = e.originalEvent.wheelDelta / -40 }
    if (e.originalEvent.deltaY) { e.delta = e.originalEvent.deltaY }
    if (e.originalEvent.detail) { e.delta = e.originalEvent.detail }
  }
  console.log(e.deltaY)


  // if (typeof callback === 'function') {
  //   callback.call(this, e);
  // }
}

/* unused harmony default export */ var _unused_webpack_default_export = ({
  /**
   * Disable scrolling on the page
   *
   * @param func - function - The function to execute when scrolling
   * @author jordanskomer
   */
  disable: () => {
      if (document.body.addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.body.addEventListener('mousewheel', MouseWheelHandler, false);
        // Firefox
        document.body.addEventListener('DOMMouseScroll', MouseWheelHandler, false);
      }
      // IE 6/7/8
      else {
        document.body.attachEvent('onmousewheel', MouseWheelHandler)
      }
  },

  /**
   * Enable scrolling on the page
   *
   * @author jordanskomer
   */
  enable: () => {
    document.removeEventListener('mousewheel', 'DOMMouseScroll', 'onmousewheel')
  }
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Preloads images in the background that will be used for the '3D' transition
 *
 * @author jordanskomer
 */
let loadImages = () => {
  const frameCount = 150
  let firstImage = document.getElementById('j-image1')
  // Insert all of the divs
  for (let frameNumber = 2; frameNumber <= frameCount; frameNumber += 5) {
    let newDiv = document.createElement('div')
    newDiv.classList.add('m-animation__image')
    newDiv.id = 'j-image' + frameNumber
    firstImage.parentNode.insertBefore(newDiv, firstImage.nextSibling)
    newDiv.style.backgroundImage = 'url(\'./images/frames/frame' + frameNumber + '.jpg\')'
  }
}

/* unused harmony default export */ var _unused_webpack_default_export = ({
  /**
   * Support for making sure the preloader gets loaded in once the page has been painted and rendered
   *
   * @author jordanskomer
   */
  init: () => {
    let defaultLoad = window.onload
    if (typeof window.onload !== 'function') {
      window.onload = loadImages
    } else {
      window.onload = () => {
        if (defaultLoad) { defaultLoad() }
        loadImages()
      }
    }
  }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let ratio = (22 / 39)
let width, height = 0

async function resizeCanvases() {
  let canvases = document.getElementsByClassName('j-canvas')
  for (const canvas of canvases) {
    canvas.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
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
  let video = document.getElementById('j-video')
  video.style.width = width + 'px'
  video.style.height = height + 'px'
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
  // resizeImages()
}

/* harmony default export */ __webpack_exports__["a"] = ({
  init: () => {
    resizer7000()
    resizeCanvases()
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
    // resizeImages()
    resizeCanvases()
  },
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Set the strokeDashoffset and array to be the length of the line
 *
 * @author jordanskomer
 */
let setupLines = () => {
  let $lines = document.getElementsByClassName('line')
  for (let i = 0; i < $lines.length; i++) {
    let length = getLength(
      $lines[i].getAttribute('x1'),
      $lines[i].getAttribute('y1'),
      $lines[i].getAttribute('x2'),
      $lines[i].getAttribute('y2')
    )
    $lines[i].style.strokeDashoffset = $lines[i].getAttribute('inverse') ? -length : length
    $lines[i].style.strokeDasharray = length
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  /**
   * Creates the canvas to be the size of the user browser window. Enabled listeners
   * to handle responive. Configures all of the lines for animation.
   *
   * @author jordanskomer
   */
  setup: () => {
    setupLines()
  }
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[0]);