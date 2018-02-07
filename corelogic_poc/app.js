import scroll from './javascripts/scroll'
import preloader from './javascripts/preload'
import resize from './javascripts/resize'
import svg       from './javascripts/svg'

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
  svg.setup()
  resize.init()
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
    runOnLoad(resize.all)
    console.log('im mobile!')
  } else {
    runOnLoad(doall)
  }
})
