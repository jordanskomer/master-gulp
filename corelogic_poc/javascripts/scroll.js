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

export default {
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
}