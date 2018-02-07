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
})({13:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let MouseWheelHandler = function (e, callback) {
  e.delta = null;
  if (e.originalEvent) {
    if (e.originalEvent.wheelDelta) {
      e.delta = e.originalEvent.wheelDelta / -40;
    }
    if (e.originalEvent.deltaY) {
      e.delta = e.originalEvent.deltaY;
    }
    if (e.originalEvent.detail) {
      e.delta = e.originalEvent.detail;
    }
  }

  if (typeof callback === 'function') {
    callback.call(this, e);
  }
};

exports.default = {
  /**
   * Disable scrolling on the page
   *
   * @param func - function - The function to execute when scrolling
   * @author jordanskomer
   */
  disable: () => {
    if (document.body.addEventListener) {
      // IE9, Chrome, Safari, Opera
      document.body.addEventListener('mousewheel', e => {
        MouseWheelHandler(e, () => {
          console.log('test ');
        });
      }, false);
      // Firefox
      document.body.addEventListener('DOMMouseScroll', MouseWheelHandler, false);
    }
    // IE 6/7/8
    else {
        document.body.attachEvent('onmousewheel', MouseWheelHandler);
      }
  },

  /**
   * Enable scrolling on the page
   *
   * @author jordanskomer
   */
  enable: () => {
    document.removeEventListener('mousewheel', 'DOMMouseScroll', 'onmousewheel');
  }
};
},{}],14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Preloads images in the background that will be used for the '3D' transition
 *
 * @author jordanskomer
 */
let loadImages = () => {
  const frameCount = 150;
  let firstImage = document.getElementById('j-image1');
  // Insert all of the divs
  for (let frameNumber = 2; frameNumber <= frameCount; frameNumber += 5) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('m-animation__image');
    newDiv.id = 'j-image' + frameNumber;
    firstImage.parentNode.insertBefore(newDiv, firstImage.nextSibling);
    console.log('broken');
    let image = require('./images/frames/frame' + frameNumber + '.jpg');
    console.log(image);
    newDiv.style.backgroundImage = 'url(' + image + ')';
  }
};

exports.default = {
  /**
   * Support for making sure the preloader gets loaded in once the page has been painted and rendered
   *
   * @author jordanskomer
   */
  init: () => {
    let defaultLoad = window.onload;
    if (typeof window.onload !== 'function') {
      window.onload = loadImages;
    } else {
      window.onload = () => {
        if (defaultLoad) {
          defaultLoad();
        }
        loadImages();
      };
    }
  }
};
},{}],15:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let ratio = 9 / 16;
let width,
    height = 0;

async function resizeCanvases() {
  let canvases = document.getElementsByClassName('j-canvas');
  for (const canvas of canvases) {
    canvas.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    canvas.style.paddingBottom = height / width * 100 + '%';
  }
}

async function resizeImages() {
  let images = document.getElementsByClassName('m-animation__image');
  for (const image of images) {
    image.style.width = width + 'px';
    image.style.height = height + 'px';
  }
}

let resizer7000 = () => {
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  height = Math.round(width * ratio * 100) / 100;
  resizeImages();
};

exports.default = {
  init: () => {
    resizer7000();
    resizeCanvases();
    if (window.attachEvent) {
      window.attachEvent('onresize', resizer7000);
    } else if (window.addEventListener) {
      window.addEventListener('resize', resizer7000, true);
    }
  }
};
},{}],16:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Set the strokeDashoffset and array to be the length of the line
 *
 * @author jordanskomer
 */
let setupLines = () => {
  let $lines = document.getElementsByClassName('line');
  for (let i = 0; i < $lines.length; i++) {
    let length = getLength($lines[i].getAttribute('x1'), $lines[i].getAttribute('y1'), $lines[i].getAttribute('x2'), $lines[i].getAttribute('y2'));
    $lines[i].style.strokeDashoffset = $lines[i].getAttribute('inverse') ? -length : length;
    $lines[i].style.strokeDasharray = length;
  }
};

exports.default = {
  /**
   * Creates the canvas to be the size of the user browser window. Enabled listeners
   * to handle responive. Configures all of the lines for animation.
   *
   * @author jordanskomer
   */
  setup: () => {
    setupLines();
  }
};
},{}],5:[function(require,module,exports) {
"use strict";

var _scroll = require("./javascripts/scroll");

var _scroll2 = _interopRequireDefault(_scroll);

var _preload = require("./javascripts/preload");

var _preload2 = _interopRequireDefault(_preload);

var _resize = require("./javascripts/resize");

var _resize2 = _interopRequireDefault(_resize);

var _svg = require("./javascripts/svg");

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let isMobile = 'ontouchstart' in window || 'onmsgesturechange' in window;

/**
 * Magic happens here
 */
let animate = () => {
  let scrollController = new ScrollMagic.Controller();
  let tl = new TimelineMax().add(TweenMax.staggerTo('.m-animation__image', 0.05, { opacity: 1 }, 0.05));
  new ScrollMagic.Scene({
    triggerElement: '#j-3dAnimation',
    offset: 250
  }).on('enter', () => {
    // scroll.disable()
    console.log('huh');
    console.log(tl);
    tl.play();
    // scroll.disable()
  }).setTween(tl).addIndicators().addTo(scrollController);

  //   // 3d Animation
  //   let controller = new ScrollMagic.Controller({
  //     globalSceneOptions: {
  //       offset: 50
  //     }
  //   })
  //   new ScrollMagic.Scene()
  //     .on('enter', () => {
  //       timeline.reverse(0).timeScale(4)
  //     })
  //     .setTween(tl)
  //     // .addIndicators()
  //     .addTo(controller)
  // }
};

let doall = () => {
  _svg2.default.setup();
  _resize2.default.init();
  animate();
};

/**
 * Preloads images in the background that will be used for the '3D' transition
 *
 * @author jordanskomer
 */
let loadImages = () => {
  const frameCount = 150;
  let firstImage = document.getElementById('j-image1');
  // Insert all of the divs
  for (let frameNumber = 2; frameNumber <= frameCount; frameNumber += 5) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('m-animation__image');
    newDiv.id = 'j-image' + frameNumber;
    firstImage.parentNode.insertBefore(newDiv, firstImage.nextSibling);
    // remove this to just be  newDiv.style.backgroundImage = 'url(\'../images/frames/frame' + frameNumber + '.jpg\')'
    newDiv.style.backgroundImage = 'url(\'images/frames/frame' + frameNumber + '.jpg\')';
  }
  doall();
};

/**
 * Support for making sure the preloader gets loaded in once the page has been painted and rendered
 *
 * @author jordanskomer
 */
let init = () => {
  let defaultLoad = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = loadImages;
  } else {
    window.onload = () => {
      if (defaultLoad) {
        defaultLoad();
      }
      loadImages();
    };
  }
};

document.addEventListener("DOMContentLoaded", function () {
  if (isMobile) {
    console.log('im mobile!');
  } else {
    init();
  }
});
},{"./javascripts/scroll":13,"./javascripts/preload":14,"./javascripts/resize":15,"./javascripts/svg":16}],0:[function(require,module,exports) {
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
  var ws = new WebSocket('ws://' + window.location.hostname + ':51914/');
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