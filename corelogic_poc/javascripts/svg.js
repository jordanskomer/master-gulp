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

export default {
  /**
   * Creates the canvas to be the size of the user browser window. Enabled listeners
   * to handle responive. Configures all of the lines for animation.
   *
   * @author jordanskomer
   */
  setup: () => {
    setupLines()
  }
}