/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__javascripts_resize__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__javascripts_svg__ = __webpack_require__(3);



let graphTimeLines = [],
    videoTimeLines = [],
    scenes = document.getElementsByClassName('m-scene').length,
    isMobile = 'ontouchstart' in window || 'onmsgesturechange' in window || window.innerWidth < 700,
    currentScene = 0,
    scrolled = false,
    started = false,
    scrolly = null

/**
 * Toggles scroller after the duration passed in
 *
 * @param {int} duration - THe time to delay in seconds
 * @author jordanskomer
 */
let setScroller = (duration=0) => {
  setTimeout(() => {
    if (duration) {
      document.getElementById('j-scrollAnimation').classList.add('-active')
    } else {
      clearTimeout(scrolly)
      document.getElementById('j-scrollAnimation').classList.remove('-active')
    }
  }, duration * 1000)
}

let MouseWheelHandler = function(e) {
  e.preventDefault()
  let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  let direction = Math.ceil(e.deltaY / height)
  // Forward handler
  if (direction === 1) {
    if (currentScene === 0 && videoTimeLines[0].progress() === 0 && !started) {
      videoTimeLines[0].play()
      scrolly = setScroller(videoTimeLines[0].duration())
      started = true
    } else if (videoTimeLines[currentScene].progress() === 1) {
      setScroller()
      if (currentScene === scenes-1) {
        started = false
        enableScroll()
      } else {
        currentScene++
        scrolled = true
        document.getElementById('j-scene' + (currentScene-1)).classList.add('-hidden')
        videoTimeLines[currentScene].play()
        scrolly = setScroller(videoTimeLines[currentScene].duration())
      }
    } else if (currentScene !== 0 && videoTimeLines[currentScene-1].progress() === 0) {
      scrolled = false
    }
  }
  // Reverse Scroll
  else {
    // If we are on the empty first slide scroll should be enabled
    if (currentScene === 0 && videoTimeLines[0].progress() === 0) {
      enableScroll()
    }

    if (videoTimeLines[currentScene].progress() === 1 && !scrolled) {
      setScroller()
      document.getElementById('j-scene' + currentScene).classList.remove('-hidden')
      if (currentScene === 0) {
        videoTimeLines[0].reverse()
        started = false
        enableScroll()
      } else {
        scrolled = true
        videoTimeLines[currentScene].reverse()
        scrolly = setScroller(videoTimeLines[currentScene].duration())
        if (currentScene < scenes) {
          currentScene--
        }
      }
    } else if (currentScene === scenes-1 || videoTimeLines[currentScene+1].progress() === 0) {
      scrolled = false
    }
  }
  // if (direction === 1) {
  //   // Kick of the scene
  //   if (currentScene === 0 && !started) {
  //     graphTimeLines[0].play()
  //     started = true
  //   }
  //   // When the scene is finished
  //   if (graphTimeLines[currentScene].progress() === 1 && !scrolled) {
  //     scrolled = true
  //     // Enable scrolling if last scene or advance to the next scene
  //     if (currentScene === scenes-1) {
  //       enableScroll()
  //       scrolled = started = false
  //     } else {
  //       // Fade out current infographic
  //       graphTimeLines[currentScene].timeScale(reverseSpeed).reverse()
  //       // Hide current scene and start video after fade out
  //       setTimeout(() => {
  //         document.getElementById('j-scene' + currentScene).classList.add('-hidden')
  //         videoTimeLines[currentScene].play()
  //         // Wait until video is done before showing infographics
  //         setTimeout(() => {
  //           currentScene++
  //           graphTimeLines[currentScene].timeScale(1).play()
  //           scrolled = false
  //         }, (videoTimeLines[currentScene].duration() * 1000))
  //       }, (graphTimeLines[currentScene].duration() / reverseSpeed) * 1000)
  //     }
  //   }
  // }
  // // Reverse scrolling handler
  // else {
  //   // If on first scene reanable scroll
  //   if (currentScene === 0 && videoTimeLines[currentScene].progress() === 0) {
  //     enableScroll()
  //     scrolled = started = false
  //   }
  //   if (graphTimeLines[currentScene].progress() === 1 && !scrolled && currentScene !== 0) {
  //     scrolled = true
  //     // Fade out current infographic
  //     graphTimeLines[currentScene].timeScale(reverseSpeed).reverse()
  //     // Once graphic is rolled out reverse video
  //     setTimeout(() => {
  //       currentScene--
  //       videoTimeLines[currentScene].reverse()
  //       // Fade in previous infographics
  //       setTimeout(() => {
  //         document.getElementById('j-scene' + currentScene).classList.remove('-hidden')
  //         graphTimeLines[currentScene].timeScale(1).play()
  //         scrolled = false
  //       }, videoTimeLines[currentScene].duration() * 1000)
  //     }, (graphTimeLines[currentScene].duration() / reverseSpeed)* 1000)
  //   }
  // }
}

/**
 * Disable scrolling on the page
 *
 * @param func - function - The function to execute when scrolling
 * @author jordanskomer
 */
let disableScroll = () => {
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
let enableScroll = () => {
  if (document.body.addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.body.removeEventListener('mousewheel', MouseWheelHandler, false)
    // Firefox
    document.body.removeEventListener('DOMMouseScroll', MouseWheelHandler, false)
  }
  // IE 6/7/8
  else {
    document.body.detachEvent('onmousewheel', MouseWheelHandler)
  }
}



let durations = {
  scrollIcon: 1.25,
  lines: 1.5
}

let sceneAnimations = {
  scene0: {
    text: [],
    svg: [
      {
        class: '.scene0Line',
        duration: 1.5,
        offset: 0
      }
    ]
  },

  scene1: {
    text: [],
    svg: [
      {
        class: '.scene1Line',
        duration: 1.5,
        offset: 0
      }
    ],
  },

  scene2: {
    text: [],
    svg: [
      {
        class: '.scene2Line',
        duration: 1.5,
        offset: 0
      }
    ],
  },

  scene3: {
    text: [],
    svg: [
      {
        class: '.scene3Line',
        duration: 1.5,
        offset: 0
      }
    ],
  },
}

let addVideoToTimeline = (sceneNumber) => {
  return new Promise((resolve) => {
    let video = document.getElementById('j-scene' + sceneNumber + 'Video')
    let poller = setInterval(() => {
      if (video.readyState === 4) {
        let timeline = new TimelineLite({
          paused: true,
          yoyo: true,
        })
        let tween = TweenLite
        tween.ticker.fps(24)
        timeline.add(tween.to(video, video.duration, {
          currentTime: video.duration,
          ease: Power0.easeNone,
        }))
        videoTimeLines.push(timeline)
        clearInterval(poller)
        resolve()
      }

    }, 200)
  })
}
/**
 * Setups both text and svg animations defined in sceneAnimations and adds them to graphTimeLines
 *
 * @param {int} sceneNumber - The scene to setup
 * @author jordanskomer
 */
let addAnimationsToTimeLine = (sceneNumber) => {
  let timeline = new TimelineLite({
    paused: true, yoyo: true,
  })
  let scene = sceneAnimations['scene' + sceneNumber]
  // Svg animations
  for (const anim of scene.svg) {
    timeline.add(TweenLite.to(anim.class, anim.duration, { strokeDashoffset: 0 }), anim.offset)
  }
  // Text animations
  // for (const anim of scene.text) {
  //   timeline.add(anim)
  // }
  if (sceneNumber < scenes-1) {
    timeline.add(TweenLite.to('#j-scrollAnimation', 0.5, { opacity: 1 }), '-=0.25')
  }
  graphTimeLines.push(timeline)
}

let setupSceneTimeline = (sceneNumber) => {
  if (sceneNumber < scenes) {
    addVideoToTimeline(sceneNumber).then(() => {
      return setupSceneTimeline(sceneNumber+1)
    })
  }
}


let letItAnimation = () => {
  // Setup Initial Scene
  // addAnimationsToTimeLine(0)
  // Setup rest of scenes
  setupSceneTimeline(0)
}

/**
 * Magic happens here
 */
let animate = () => {
  let scrollController = new ScrollMagic.Controller()
  new ScrollMagic.Scene({
    triggerElement: '#j-animationTrigger',
  })
  .on('start', () => {
    disableScroll()
  })
  // .addIndicators()
  .addTo(scrollController)

  letItAnimation()
}

document.addEventListener('DOMContentLoaded', function () {
  if (isMobile) {
    for (let i = 0; i < scenes; i++) {
      let video = document.getElementById('j-scene' + i + 'Video')
      video.parentNode.removeChild(video)
    }
    __WEBPACK_IMPORTED_MODULE_0__javascripts_resize__["a" /* default */].all()

  } else {
    // svg.setup()
    __WEBPACK_IMPORTED_MODULE_0__javascripts_resize__["a" /* default */].init()
    animate()
  }
})


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = ({
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
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function getLength(x, y, x0, y0) {
  return Math.sqrt((x -= x0) * x + (y -= y0) * y)
}

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

/* unused harmony default export */ var _unused_webpack_default_export = ({
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
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);