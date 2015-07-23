define('test',function(require,exports,module){
  exports.test = function(){
    var p = document.createElement('p')
    p.innerHTML = '1'
    document.body.appendChild(p)
  }
})
