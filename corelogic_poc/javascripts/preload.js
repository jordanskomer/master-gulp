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

export default {
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
}