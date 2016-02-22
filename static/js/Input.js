/**
 * This class keeps track of the user input in global variables.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Empty constructor for the Input object.
 * @constructor
 */
function Input() {}

Input.LEFT_CLICK = false;
Input.RIGHT_CLICK = false;
Input.MOUSE = {};

Input.onMouseDown = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = true;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = true;
  }
};

Input.onMouseUp = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = false;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = false;
  }
};

/**
 * This should be called during initialization to allow the Input
 * class to track user input.
 */
Input.applyEventHandlers = function() {
  window.addEventListener("mousedown", Input.onMouseDown);
  window.addEventListener("mouseup", Input.onMouseUp);
};

/**
 * This should be called any time an element needs to track mouse coordinates
 * over it.
 * @param {Element} element The element to apply the event listener to.
 * @param {string} identifier A unique identifier which the mouse coordinates
 *   will be stored with. This identifier should be a global constant since it
 *   will be used to access the mouse coordinates.
 */
Input.addMouseTracker = function(element, identifier) {
  if (Input.MOUSE[identifier]) {
    throw new Exception("Non-unique identifier used!");
  }
  element.addEventListener("mousemove", function(event) {
    var boundingRect = element.getBoundingClientRect();
    Input.MOUSE[identifier] = [event.pageX - boundingRect.left,
                               event.pageY - boundingRect.top];
  });
};
