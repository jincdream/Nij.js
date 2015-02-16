module.define('ie6Bug', function(require, module, exports) {
  var each = this.fastEach;
  var _self = this
  exports.png = function(els) {
    each(els, function(el, i) {
      var cStyle = els[i].currentStyle;
      var w = el.clientWidth;
      var h = el.clientHeight;
      var bg = cStyle.backgroundImage.replace(/url\(|\)/g, '');
      el.style.filter +=
      'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src=' +
      bg + ')';
      el.style.background = "url('fkie.jpg')";
      el.style.width = w + 'px';
      el.style.height = h + 'px';
    });
  }
  exports.hover = function(elms,classN){
    var _class = classN || 'Ie6Hover'
    each(elms,function(el,i){
      el.onmouseenter = function(){
        _self.addClass(el,classN)
      }
      el.onmouseleave = function(){
        _self.removeClass(el,classN)
      }
    })
  }
})
