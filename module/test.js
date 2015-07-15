define('test',function(require,module,exports){
  exports.test = function(){
    var p = document.createElement('p')
    p.innerHTML = '1'
    document.body.appendChild(p)
  }
})
