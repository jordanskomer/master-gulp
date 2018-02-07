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

let slides = document.getElementsByClassName('scene')
let headers = document.getElementsByClassName('header')
let triggers = document.getElementsByClassName('trigger')
let views = document.getElementsByClassName('view')

let headerTween = TweenMax.to('.header', 1, { opacity: 1 })

let viewTween = TweenMax.staggerTo('.view', 1, { opacity: 1 }, 0.5)

let plusTweens = [
  TweenMax.to('.plus1', 0.5, { opacity: 1 }),
  TweenMax.to('.plus2', 0.5, { opacity: 1 }),
  TweenMax.to('.plus3', 0.5, { opacity: 1 }),
]
let lineTweens = [
  TweenMax.staggerTo('.line1', 0.75, { strokeDashoffset: 0 }, 0.2),
  TweenMax.staggerTo('.line2', 0.75, { strokeDashoffset: 0 }, 0.5),
  TweenMax.staggerTo('.line3', 0.75, { strokeDashoffset: 0 }, 0.4)
]
let graphTween = [
  TweenMax.to('#graph', 0.1, { fill: 'white' }),
  TweenMax.to('.graphLine', 0.5, { strokeDashoffset: 0, onComplete: odometer, onReverseComplete: odometer }),
  TweenMax.to('#graph', 0.6, { attr: { points: '274,66 300,40 325,65 400,75 425,110 500,100 575,150 600,185' } })
]
let bulletTweens = [
  TweenMax.staggerTo('.bulletLine', 0.5, { strokeDashoffset: 0 }, 0.2),
  TweenMax.staggerTo('.bulletCircle', 0.25, { opacity: 1 }, 0.3),
  TweenMax.staggerTo('.bulletText', 0.3, { opacity: 1 }, 0.25)
]

let timeline = new TimelineMax()
let tl = new TimelineMax()
        .add(viewTween, 0)
let animStart = 0.5

timeline.add(headerTween, 0)
// roof
timeline.add(plusTweens[0], animStart)
timeline.add(lineTweens[0], animStart + 0.05)
// ground
timeline.add(plusTweens[1], animStart + 0.1)
timeline.add(lineTweens[1], animStart + 0.15)
// garage
timeline.add(plusTweens[2], animStart + 0.2)
timeline.add(lineTweens[2], animStart + 0.25)

// roof graph
timeline.add(graphTween[0], animStart + 0.5)
timeline.add(graphTween[2], animStart + 1)
// sale price
timeline.add(graphTween[1], animStart + 1.25)
// bullets
// line
timeline.add(bulletTweens[0], animStart + 1.2)
// circle
timeline.add(bulletTweens[1], animStart + 1.3)
// text
timeline.add(bulletTweens[2], animStart + 1.5)

let panelController = new ScrollMagic.Controller({
  globalSceneOptions: {
    offset: 100,
    triggerHook: 'onCenter',
  }
})
let controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    offset: 300
  }
})

new ScrollMagic.Scene()
  .setTween(timeline)
  .addIndicators()
  .addTo(panelController)
new ScrollMagic.Scene({ triggerElement: '#trigger'})
  .setTween(tl)
  .setClassToggle('.panel', '-blur')
  .on('enter leave', () => {
    headers[0].classList.toggle('-active')
    headers[1].classList.toggle('-active')
  })
  .addIndicators()
  .addTo(controller)