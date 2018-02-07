/**
 * Used to determine how many frames to load in for the transition
 */
const frameCount = 150;
let image1 = document.getElementById('j-scene1__image1')

function getLength(x, y, x0, y0) {
  return Math.sqrt((x -= x0) * x + (y -= y0) * y)
}

function odometer() {
  let odometer = document.getElementsByClassName('odometer')[0]
  document.getElementsByClassName('infographic')[0].classList.toggle('-active')
  odometer.innerHTML = ''
  new Odometer({
    el: odometer,
    duration: 300
  })
  odometer.innerHTML = odometer.getAttribute('info')
}

function setupLines() {
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

/**
 * GSAP and ScrollMagic. Isn't animation easy?
 *
 * @author jordanskomer
 */
let animateThangs = () => {
  let timeline = new TimelineMax()
  let lineAnimLength = 0.75
  let lineTweens = [
    TweenMax.to('.line1', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line2', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line3', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line4', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line5', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line6', lineAnimLength, { strokeDashoffset: 0 }),
    TweenMax.to('.line7', lineAnimLength, { strokeDashoffset: 0 }),
  ]

  let graphTween = [
    TweenMax.to('#graph', 0.1, { fill: 'white' }),
    TweenMax.to('#graph', 0.6, { attr: { points: '67,286 90,240 140,260 160,250 175,255 180,240 200,235 220,220 225,200 230,220 235,210 270,225 290,200 310,225 327,233' } }),
    TweenMax.staggerTo('.a-graphText', 0.6, { opacity: 1 }, 0.1)
  ]

  let barTweens = [
    TweenMax.to('#lineBarFill1', 0.5, { attr: { opacity: '0.5', points: '600,665 602,610 620,602 618,659' }}),
    TweenMax.to('#lineBarFill2', 0.5, { attr: { opacity: '0.5', points: '628,654 629,625 646,618 645,647' } }),
    TweenMax.to('#lineBarFill3', 0.5, { attr: { opacity: '0.5', points: '655,642 656,605 670,599 669,636' } })
  ]

  let bulletTweens = [
    TweenMax.staggerTo('.bulletLine1', 0.5, { strokeDashoffset: 0 }, 0.2),
    TweenMax.staggerTo('.bulletCircle1', 0.25, { opacity: 1 }, 0.3),
    TweenMax.staggerTo('.bulletText1', 0.3, { opacity: 1 }, 0.32),
    TweenMax.staggerTo('.bulletLine2', 0.5, { strokeDashoffset: 0 }, 0.2),
    TweenMax.staggerTo('.bulletCircle2', 0.25, { opacity: 1 }, 0.3),
    TweenMax.staggerTo('.bulletText2', 0.3, { opacity: 1 }, 0.32),
    TweenMax.staggerTo('.bulletLine3', 0.5, { strokeDashoffset: 0 }, 0.2),
    TweenMax.staggerTo('.bulletCircle3', 0.25, { opacity: 1 }, 0.3),
    TweenMax.staggerTo('.bulletText3', 0.3, { opacity: 1 }, 0.32)
  ]

  for (let i = 0; i < lineTweens.length; i++) {
    timeline.add(lineTweens[i], i * (lineAnimLength - 0.15))
  }

  for (let i = 0; i < bulletTweens.length; i+=3) {
    let base = i
    timeline.add(bulletTweens[i], (base * 0.1) + 1)
    timeline.add(bulletTweens[i+1], (base * 0.1) + 1.2)
    timeline.add(bulletTweens[i+2], (base * 0.1) + 1.3)
    console.log(i)
  }

  timeline.add(graphTween[0], 1)
  timeline.add(graphTween[1], 1.1)
  timeline.add(graphTween[2], 1.5)

  timeline.add(barTweens[0], 2)
  timeline.add(barTweens[1], 2.3)
  timeline.add(barTweens[2], 2.15)



  let animController = new ScrollMagic.Controller({
    globalSceneOptions: {
      offset: 5
    }
  })
  new ScrollMagic.Scene()
    .setTween(timeline)
    // .addIndicators()
    .addTo(animController)

  // 3d Animation
  let tl = new TimelineMax()
    .add(TweenMax.staggerTo('.m-images__image', 0.05, { opacity: 1 }, 0.05), 1)
  let controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      offset: 50
    }
  })
  new ScrollMagic.Scene()
    .on('enter', () => {
      timeline.reverse(0).timeScale(4)
    })
    .setTween(tl)
    // .addIndicators()
    .addTo(controller)
}
/**
 * Preloads images in the background that will be used for the '3D' transition
 *
 * @author jordanskomer
 */
let preloader = () => {
  // Insert all of the divs
  for (let i = 2; i <= frameCount; i+=5) {
    let newDiv = document.createElement('div')
    newDiv.classList.add('m-images__image')
    newDiv.id = 'j-scene1__image' + i
    image1.parentNode.insertBefore(newDiv, image1.nextSibling)
    newDiv.style.backgroundImage = 'url(\'./images/image' + i + '.jpg\')'
  }
  setupLines()
  animateThangs()
}

/**
 * Support for making sure the preloader gets loaded in once the page has been painted and rendered
 *
 * @author jordanskomer
 */
let addLoadingEvent = (func) => {
  let defaultLoad = window.onload
  if(typeof window.onload !== 'function') {
    window.onload = func
  } else {
    window.onload = () => {
      if (defaultLoad) { defaultLoad() }
      func()
    }
  }
}

addLoadingEvent(preloader)