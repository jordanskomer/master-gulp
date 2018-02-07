// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({5:[function(require,module,exports) {
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
},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':50681/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,5])