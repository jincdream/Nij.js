module.define('animate',function(module,exports){
  var animate = module.exports = function(elm, name, value, time) {
    var style = null;
    var oVal = '';
    if (name !== 'scrollTop') {
      var syl = window.getComputedStyle ? getComputedStyle(elm) : elm.currentStyle;
      oVal = syl[name];
      style = elm.style;
    } else {
      style = elm;
      oVal = elm[name];
    }
    var _unit = unit(oVal);
    var start = +_unit[0];
    var u = _unit[1];
    var end = value;
    var css = name;
    var val = end - start;
    var fps = 21;
    var speed = val / time * fps;
    var timer = 0;
    var direction = val > 0 ? !0 : !1;

    function move() {
      start += speed;
      style[name] = start + u;
    }

    function moveA() {
      if (start < end) {
        move();
        sto(moveA, fps);
      } else {
        clear();
      }
    }

    function moveB() {
      if (start > end) {
        move();
        sto(moveB, fps);
      } else {
        clear();
      }
    }

    function clear() {
      style[name] = end + u;
      clearTimeout(timer);
    }
    if (direction) {
      sto(moveA, fps);
    } else {
      sto(moveB, fps);
    }
  }
})
