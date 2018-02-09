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
      document.body.addEventListener('mousewheel', MouseWheelHandler, false)
      // Firefox
      document.body.addEventListener('DOMMouseScroll', MouseWheelHandler, false)
    }
    // IE 6/7/8
    else {
      document.body.attachEvent('onmousewheel', MouseWheelHandler)
    }
  },

  /**
   * Reanables scrolling on the page
   *
   * @author jordanskomer
   */
  enable: () => {
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
}