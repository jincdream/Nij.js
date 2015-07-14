(function(win,doc){

  var each = (function(){
    var f = [].forEach
    if(f){
      return function(ary,cb){
        if(!cb || !ary)return;
        f.call(ary, cb)
      }
    }else{
      return function(ary,cb){
        if(!cb || !ary)return;
        var ln = ary.length
        var i = 0
        while(ln--){
          cb(ary[i], i++);
        }
      }
    }
  })()

  var _SCRIPT_ = doc.createElement('script')
  var _HEAD_ = doc.head || doc.getElementsByTagName('head')[0]
  var loadEvent = 'onload'
  var useOnload = loadEvent in _SCRIPT_
  var loadEvent = useOnload ? loadEvent : 'onreadystatechange'
  var readyState = /complete|loaded/

  var Script = function(id,name,fn){
    var _self = this
    _self.fns = [fn]
    _self.status = -1
    _self.id = id
    _self._name = name
  }
  Script.prototype = {
    constructor: Script,
    addFn: function(fn){
      this.fns.push(fn)
    },
    setStatus:function(n){
      this.status = n
    },
    load: function(id,src,charset,bind){
      var _self = this
      var script = doc.createElement('script')
      var onload = function(){
        _self.fire(bind)
      }
      var index = 0,loadID
      script[loadEvent] = useOnload ? onload : function(){
        if (readyState.test(script.readyState)) {
            ++index
            if (index === 1) {
                loadID = win.setTimeout(onload, 500)
            } else {
                win.clearTimeout(loadID)
                onload()
            }
        }
      }
      script.charset = charset
      script.setAttribute('charset',charset)
      script.setAttribute('src',src)
      script.id = id
      _HEAD_.appendChild(script)
      this.setStatus(0)
    },
    fire: function(bind){
      var _self = this
      each(_self.fns,function(fn,i){
        fn.call(bind || null,_self._name)
      })
      _self.setStatus(1)
    }
  }
  var Scripts = function(){
    var _self = this
    _self.point = 0
    _self.script = {}
  }
  Scripts.prototype = {
    constructor: Scripts,
    create: function(name,fn){
      var _self = this
      var _s = _self.script[name] = new Script(_self.point++,name,fn)
      return _s
    },
    get: function(name,next){
      var _self = this
      var script = _self.script[name]
      if(!script){
        script = _self.create(name,next)
      }
      return script
    }
  }
  var _sripts = new Scripts
  var loadScript = function(src,next,charset,_name) {
    var name = _name || src
    var cs = charset || doc.charset
    var script = _sripts.get(name,next)
    var status = script.status
    var id = 'js-id-' + (+new Date)
    switch (status) {
      case -1:
        script.load(src,id,cs)
        break;
      case 0:
        script.addFn(next)
        break;
      case 1:
        script.fire()
        break;
      default:
      break;
    }
    return id
  }
  var module = {}
  module.mods = {}
  module.w = {}
  module.config = function(config) {
    var base = config.baseUrl || ''
    this._alies = {}
    for (var n in config.alies) {
      var alies = this._alies[n] = {}
      alies.src = base + config.alies[n]
      alies.callback = []
    }
  }
  module.require = function(names, cb) {
    var self = module
    var mods = self.mods;
    var fn = [];
    var len = names.length
    var src = ''
    each(names, function(name, i) {
      if (mods[name] && mods[name].loaded) {
        fn[i] = mods[name].exports
        if (--len === 0) cb.apply(null, fn)
      } else {
        if (!self._alies) throw new Error(name + 'is not define by module.')
        src = self._alies[name].src
        loadScript(src, function(src) {
          if (name === 'pc') {
            mods[name] = {
              exports: window.pc
            }
          }
          fn[i] = mods[name].exports
          if (--len === 0) cb.apply(null, fn)
        },doc.charset,name)
      }
    })
  }
  module.define = function(deps,name,cb){
    var m = module
    !cb && (cb = name,name = deps,deps = [])
    var o = m.mods[name] = {};
    var e = m.mods[name].exports = {};
    if(deps.length > 0){
      m.require(deps,function(){
        var args = arguments

      })
    }
    var base = _module.mods['base']
    var requireOnce = function(name) {
      return _module.mods[name].exports
    }
    if (!_module.mods[name]) {
      var o = _module.mods[name] = {};
      var e = _module.mods[name].exports = {};
    } else {
      var o = _module.mods[name]
      var e = _module.mods[name].exports
    }
    fn.apply(base ? base.exports : _module.w, [requireOnce, o, e]);
    _module.mods[name].loaded = !0
  }
})(window,document)








var module = {};
module.mods = {};
module.w = {};
module.config = function(config) {
  var base = config.baseUrl || ''
  this._alies = {}
  for (var n in config.alies) {
    var alies = this._alies[n] = {}
    alies.src = base + config.alies[n]
    alies.callback = []
  }
}
module.until = {
  each: (function(){
    var f = [].forEach
    if(f){
      return function(ary,cb){
        if(!cb || !ary)return;
        f.call(ary, cb)
      }
    }else{
      return function(ary,cb){
        if(!cb || !ary)return;
        var ln = ary.length
        var i = 0
        while(ln--){
          cb(ary[i], i++);
        }
      }
    }
  })()
}
module.require = function(names, cb) {
  var self = this
  var mods = self.mods;
  var fn = [];
  var base = mods.base.exports;
  var len = names.length
  var src = ''
  base.each(names, function(name, i) {
    if (mods[name] && mods[name].loaded) {
      fn[i] = mods[name].exports
      if (--len === 0) cb.apply(base, fn)
    } else {
      if (!self._alies) throw new Error(name + 'is not define by module.')
      src = self._alies[name].src
      base.loadScript(name, src, function(src) {
        if (name === 'pc') {
          mods[name] = {
            exports: window.pc
          }
        }
        fn[i] = mods[name].exports
        if (--len === 0) cb.apply(base, fn)
      })
    }
  });
};

module.define = function(deps,name,fn) {
  var m = module
  var each = m.until.each
  if(arguments < 3){
    fn = name
    name = deps
    deps = []
  }
  deps.length > 0 && each(deps,function(v,i){

  })









  var _module = this;
  var base = _module.mods['base']
  var requireOnce = function(name) {
    return _module.mods[name].exports
  }
  if (!_module.mods[name]) {
    var o = _module.mods[name] = {};
    var e = _module.mods[name].exports = {};
  } else {
    var o = _module.mods[name]
    var e = _module.mods[name].exports
  }
  fn.apply(base ? base.exports : _module.w, [requireOnce, o, e]);
  _module.mods[name].loaded = !0
};
module.define('base', function(require, module, exports) {
  var div = document.createElement('div')
  var _getClsE = function(searchClass, node, tag) {
    var classElements = [];
    var end = [];
    var ln = node.length;
    var j = 0;
    if (!ln) {
      var n = node || document;
      var t = tag || '*';
      var els = n.getElementsByTagName(t);
      var elsLen = els.length;
      var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
      var i = elsLen;
      while (--i >= 0) {
        pattern.test(els[i].className) ? classElements.push(els[i]) :
          void(0);
      }
      return classElements.reverse();
    } else {
      while (ln--) {
        end = end.concat(_getClsE(searchClass, node[j++], tag));
      }
      return end;
    }
  };
  var _sizzle = function(str, node) {
    var ids = str.split(/\s/);
    var regA = /#/;
    var regB = /\./;
    var ln = ids.length;
    var node = node || document;
    var i = 0;

    var select = function(n) {
      var ary = n.split(/\#|\./);
      var tag = !1;
      if (ary.length > 1) {
        tag = ary[0];
        name = ary[1];
      } else if (ary[0]) {
        name = ary[0];
      } else {
        name = n;
      }
      if (regA.test(n)) {
        node = document.getElementById(name);
      } else if (regB.test(n)) {
        node = _getClsE(name, node, tag);
      } else {
        node = node.getElementsByTagName(name);
      }
    }
    while (ln--) {
      select(ids[i++]);
    }
    return node;
  };
  var checkCss3 = (function() {
    var style = div.style
    var regTrs = /^[webkit]*[Tt]ransition$/
    var n
    var trf = !0
    var css3 = {}
    for (n in style) {
      // if(/^[webkit|ms]*[Tt]ransform$/.test(n)){
      //   trf = !0
      // }
      if (trf && regTrs.test(n)) {
        trf = !1
        css3.trf = !0
      }
      if (!!~n.indexOf('transform')) {
        css3.transform = 'transform'
        css3.b = 't'
      } else if (!!~n.indexOf('webkitTransform')) {
        css3.transform = 'webkitTransition'
        css3.b = 'webkitT'
      } else if (!!~n.indexOf('msTransform')) {
        css3.transform = 'msTransform'
        css3.b = 'msT'
      }
      // case !!(~n.indexOf('msTransform')):
    }
    return css3
  }())
  var loadEvent = checkCss3.trf ? 'onload' : 'onreadystatechange'
    // >ie9( server )will trigger second onreadystatechange event:
    // And script.readyState is loading || loaded
  var loadEnd = checkCss3.trf ? 0 : 1
  var _loadedScript = {}
  var Core = {
    _merge: function(first, second) {
      var len = +second.length,
        j = 0,
        i = 0
      for (; j < len; j++) {
        first[i++] = second[j]
      }
      first.length = i
      return first
    },
    // var Create = $.createClass
    createClass: function(name, init) {
      var self = this
      self[name] = function() {
        var _p
        if (!(this instanceof self[name])) {
          _p = (new self[name])
          init && _p.init.apply(_p, arguments)
        } else {
          _p = this
        }
        return _p
      }
      return self[name]
    },
    makeArray: function(elms) {
      this._merge(this, elms)
      return this;
    },
    splice: [].splice,
    global: module.w,
    each: (function() {
      var f = [].forEach
      if (!f) {
        return function(ary, cb) {
          var elm = this.elm
          if (!cb && elm) {
            cb = ary
            ary = elm
          }
          var ln = ary.length;
          var i = 0;
          while (ln--) {
            cb(ary[i], i++);
          }
        }
      } else {
        return function(ary, cb) {
          var elm = this.elm
          if (!cb && elm) {
            cb = ary
            ary = elm
          }
          f.call(ary, cb)
        }
      }
    })(),
    fastEach: function(ary, cb) {
      var elm = this.elm
      if (!cb && elm) {
        cb = ary
        ary = elm
      }
      var ln = ary.length
      while (ln--) {
        cb(ary[ln], ln)
      }
    },
    browser: (function(ua) {
      return {
        chrome: /chrome/.test(ua),
        safari: /safari/.test(ua),
        webkit: /applewebkit/.test(ua),
        isIE:/msie/.test(ua),
        ie6: !window.XMLHttpRequest,
        ltIe10: !checkCss3.trf,
        ltIe9: checkCss3.transform,
				ie8: !checkCss3.transform && document.querySelector,
				lIe8: !document.querySelector
      };
    })(window.navigator.userAgent.toLowerCase()),
    extend: function(target, source) {
      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          target[p] = source[p];
        }
      }
      return target;
    },
    toAry: function(elms, splice) {
      var newAry = [];
      elms = elms || this.elm
      Core.each(elms, function(el, i) {
        newAry[i] = el;
      });
      if (splice) newAry.splice(splice[0], splice[1]);
      return newAry;
    },
    css3Fix: checkCss3,
    addStyle: function(cssTxt, id) {
      var styleElm = document.createElement('style')
      id = id || 'css-id-' + (+new Date)
      styleElm.id = id
      try {
        styleElm.innerHTML = cssTxt
      } catch (e) {
        // <ie9
        styleElm.type = "text/css"
        styleElm.styleSheet.cssText = cssTxt
      }
      DomHandle.j('head')[0].appendChild(styleElm)
      return id
    },
    loadScript: function(src, next) {
      var name
      if (arguments.length === 3) {
        name = arguments[0]
        src = arguments[1]
        next = arguments[2]
      }
      name = name || src
      if (_loadedScript[name] && !_loadedScript[name].loaded) {
        _loadedScript[name].handle.push(next)
        return _loadedScript[name].id
      } else {
        var id = 'js-id-' + (+new Date)
        _loadedScript[name] = {
          handle: [next],
          id: id,
          loaded: !1
        }
        var _script = document.createElement('script')
        var _loadEnd = loadEnd

        _script.setAttribute('src', src)
        _script.id = id
        document.body.appendChild(_script)
        _script[loadEvent] = function() {
          // console.log(_script.readyState)
          !(_loadEnd--) && next && (function() {
            var _scr = _loadedScript[name]
            var len = _scr.handle.length
            var i = 0
            _scr.loaded = !0
            for (; i < len; i++) {
              _loadedScript[name].handle[i].call(null, name)
            }
          })();
        }
        return id
      }
    },
    load: function(obj) {
      Core.fastEach(obj, function(src, i) {
        Core.loadScript(src)
      })
    },
    /*
     * jq:{
     *  dep: 'name',
     *  src: src,
     *  child:
     * }
     * */
    loader: function(scripts) {
      // var first
      // var _name = ''
      // for(_name in scripts){
      //   var obj = scripts[_name]
      //   if(obj.dep){
      //     obj
      //   }
      // }
    },
    isAry: function(obj) {
      var toS = {}.toString
      return toS.call(obj) === "[object Array]"
    },
    indexOf: (function() {
      if ([].indexOf) {
        return function(ary, x) {
          return [].indexOf.call(ary, x)
        }
      } else {
        return function(ary, x) {
          var n = -1
          Core.fastEach(ary, function(v, i) {
            if (v === x) {
              n = i
              return
            }
          })
          return n
        }
      }
    })()
  };
  var DomHandle = {
    j: (function() {
      var $;
      var _$ = document.querySelector;
      var _$s = document.querySelectorAll;
      if (_$) {
        _sizzle = null
        return function(el, node, splice) {
          var elm;
          if (/#/.test(el) && !/\s/.test(el)) $ = _$;
          else $ = _$s;
          elm = $.call(document, el, node || document);
          if ($ === _$s) return Core.toAry(elm, splice);
          return elm;
        };
      } else {
        return _sizzle;
      }
    })(),
    _checkArg: function(arg, name) {
      if (!name) {
        [].unshift.call(arg, this.elm)
      }
      return arg
    },
    _classHandle: function(elm, className, fn) {
      var ary = []
      var arg = this._checkArg([elm, className], className)
      elm = arg[0]
      className = arg[1]
      var reg = new RegExp(className);
      Core.isAry(elm) ? ary = elm : ary = [elm]
      Core.fastEach(ary, function(el, i) {
        var classes = el.className.split(' ')
        fn(reg, el, classes, className)
        el.className = classes.join(' ');
      })
    },
    addClass: function(elm, className) {
      this._classHandle(elm, className, function(reg, el, classes,
        className) {
        if (!reg.test(el.className)) {
          classes.push(className)
        }
      })
    },
    removeClass: function(elm, className) {
      this._classHandle(elm, className, function(reg, el, classes,
        className) {
        var index = Core.indexOf(classes, className)
        if (!index || !~index) return;
        classes.splice(index, 1)
      })
    },
    on: (function() {
      //cant support array
      if (document.addEventListener) {
        return function(elm, type, fn) {
          var arg = this._checkArg(arguments, fn)
          elm = arg[0]
          type = arg[1],
            fn = arg[2]
          elm.addEventListener(type, fn, false);
        };
      } else {
        return function(elm, type, fn) {
          var arg = this._checkArg(arguments, fn)
          elm = arg[0]
          type = arg[1],
            fn = arg[2]
          elm.attachEvent('on' + type, fn);
        };
      }
    })(),
    off: function(elm, type, fn) {
      var arg = this._checkArg(arguments, fn)
      elm = arg[0]
      type = arg[1],
        fn = arg[2]
      if (document.detachEvent) {
        elm.detachEvent('on' + type, fn);
      } else {
        elm.removeEventListener(type, fn, false);
      }
    },
    css3TransitionSupport: (function() {
      var style = div.style;
      var webkit = !1;
      var ok = !1;
      var no = !0;
      var rz = '';
      for (var name in style) {
        if (/^transition$/.test(name)) {
          ok = !0;
          break;
        } else if (/^webkitTransition$/.test(name)) {
          webkit = !0;
          break;
        } else {
          no = !1;
        }
      }
      rz = webkit ? 'webkit' : (ok ? ok : no);
      return rz;
    })()
  }

  var Nijc = module.exports = function(elmStr) {
    var obj
    if (elmStr instanceof Nijc) return elmStr;
    if (!(this instanceof Nijc)) {
      obj = new Nijc.prototype.init(elmStr)
    } else {
      obj = this
    }
    return obj
  }
  Core.extend(Nijc, Core)
  Core.extend(Nijc, DomHandle)
  Nijc.prototype = {
    constructor: Nijc,
    verson: 0.9,
    name: 'Nijc',
    length: 0,
    mobile: 'phone'
  }
  Core.extend(Nijc.prototype, Core)
  Core.extend(Nijc.prototype, DomHandle)
  Nijc.prototype.init = function(elmStr, node) {
    var elm
    var self = this
    if ((elmStr + '') !== elmStr && elmStr.length) {
      elm = Core.toAry(elmStr)
    } else {
      elm = this.j(elmStr, node)
      if (!elm) return self
      if (elm.nodeType) elm = [elm]
      if (!Core.isAry(elm)) elm = Core.toAry(elm)
    }
    this.elm = elm
    this.length = elm.length
    this.makeArray(elm)
    return this
  }
  Nijc.prototype.init.prototype = Nijc.prototype
});

module.require = function(names, cb) {
  var self = this
  var mods = self.mods;
  var fn = [];
  var base = mods.base.exports;
  var len = names.length
  var src = ''
  base.each(names, function(name, i) {
    if (mods[name] && mods[name].loaded) {
      fn[i] = mods[name].exports
      if (--len === 0) cb.apply(base, fn)
    } else {
      if (!self._alies) throw new Error(name + 'is not define by module.')
      src = self._alies[name].src
      base.loadScript(name, src, function(src) {
        if (name === 'pc') {
          mods[name] = {
            exports: window.pc
          }
        }
        fn[i] = mods[name].exports
        if (--len === 0) cb.apply(base, fn)
      })
    }
  });
};



module.define('animate', function(require, module, exports) {
  var sto = window.setTimeout;
  var now = function() {
    return +new Date
  }

  function unit(val) {
    var aotu = val === 'auto';
    var u = aotu ? 'px' : '';
    var v = aotu ? 0 : (val + '').replace(/(\d+)(.*)/, function(a, v, _u) {
      u = _u;
      return v;
    });
    return [v, u];
  }
  var animate = module.exports = function(elm, name, value, time) {
    var _startTime = now()
    var _endTime = _startTime + time
    var style = null;
    var oVal = '';
    if (!~'scrollTopscrollLeft'.indexOf(name)) {
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
    var fps = 27;
    var speed = val / time * fps;
    var _end = end - speed

    var timer = -1;
    var direction = val > 0 ? !0 : !1;

    function move() {
      start += speed;
      style[name] = start + u;
    }

    function moveA() {
      if (start <= _end) {
        move();
        sto(moveA, fps);
      } else {
        clear();
      }
    }

    function moveB() {
      if (start >= _end) {
        move();
        sto(moveB, fps);
      } else {
        clear();
      }
    }

    function clear() {
      style[name] = end + u;
      window.clearTimeout(timer);
    }
    if (direction) {
      sto(moveA, fps);
    } else {
      sto(moveB, fps);
    }
  }
})
module.define('Temp', function(require, module, exports) {
  var $ = this
  var Temp = module.exports = $.createClass('Temp', !0)
  Temp.prototype = {
    constructor: Temp,
    init: function(temp) {
      var self = this
      self._tempFn = temp
      self._string = temp.toString()
        .replace(/[\r\n\f\t]/g, '')
        .replace(/.*?\/\*(.*?)\*\/[\s]*\}$/, '$1')
    },
    toArray: function(dataObj, filter) {
      var self = this
      var _str = self._string
      var str = []
      if (!$.isAry(dataObj)) {
        dataObj = [dataObj]
      }
      var len = dataObj.length
      while (len--) {
        str[len] = _str.replace(/\{\{(\S*?)\}\}/g, function(m, a) {
          filter && filter(m, a)
          var obj = dataObj[len]
          if (obj[a]) return obj[a]
          else return ''
        })
      }
      return str
    },
    toHtml: function(dataObj, filter) {
      return this.toArray(dataObj, filter).join('')
    }
  }
})
// module.define('Slide', function(require, module, exports) {
//   var animate = require('animate')
//
//   var $ = this
//   var each = $.each
//   var addC = $.addClass
//   var ltIe10 = $.browser.ltIe10
//   var css3Fix = $.css3Fix.b
//   var moveHandle = (function(notSupTrs) {
//     if (notSupTrs) {
//       return function(elm, dir, v) {
//         if (dir === 'x') {
//           dir = 'scrollLeft'
//           v = -v * this.width
//         } else if (dir === 'y') {
//           dir = 'scrollTop'
//           v = -v * this.height
//         }
//         animate(this.parent, dir, v, 200)
//       }
//     } else {
//       return function(elm, dir, v) {
//         if (dir === 'x') v = 'translate3d(' + v * this.width +
//           'px,0,0)';
//         else if (dir === 'y') v = 'translate3d(0,' + v * this.height +
//           'px,0)';
//         elm.style[css3Fix + 'ransform'] = v
//       }
//     }
//   })( /*ltIe10*/ ltIe10)
//   var _trf = ltIe10 ? '' :
//     'transition:all .2s ease-out;-webkit-transition:all .2s ease-out;'
//   var _c3DFrom = 'Slide-3d-js'
//   var _cParent = 'Slide-parent-js'
//   var _cWrapper = 'Slide-wrapper-js'
//   var _cTarget = 'Slide-target-js'
//
//   var _class = '.' + _c3DFrom + '{' + 'backface-visibility: visible;' +
//     'perspective-origin: 50% 50%;' + 'transform-style: preserve-3d;' +
//     '-webkit-backface-visibility: visible;' +
//     '-webkit-perspective-origin: 50% 50%;' +
//     '-webkit-transform-style: preserve-3d;' + '}' + '.' + _cParent + '{' +
//     'position:relative;' + 'overflow:hidden;' + '}' + '.' + _cTarget + ',' +
//     '.' + _cWrapper + '{' + 'transform-style: preserve-3d;' +
//     '-webkit-transform-style: preserve-3d;' + 'float:left;' + _trf + '}'
//   $.addStyle(_class)
//   var Slide = module.exports = function(option) {
//       this.len = option.target.length
//       this.n = 0
//       this.elm = option.target
//       this.elms = this.elm.elm
//       this.delay = option.delay || 1400
//       this.extend = option.extend
//       this.onchanged = option.onchanged
//       this.showElm = !option.showElm ? this.len : this.len - option.showElm +
//         1
//       this.direction = option.direction || 'x'
//       var targetOne = this.elms[0]
//       this.wrapper = targetOne.parentNode
//       this.parent = this.wrapper.parentNode
//       this.width = targetOne.clientWidth
//       this.height = targetOne.clientHeight
//       this.step = this.direction === 'x' ? this.width : this.height
//       this.box = option.box || this.wrapper
//       this.moveHandle = moveHandle
//       this.init()
//       option.autoPlay && this._autoPlay()
//       option.control && this._ctrl(option.control)
//       option.nextBt && this._onNext(option.nextBt)
//       option.prevBt && this._onPrev(option.prevBt)
//       return this
//     }
//     //transform
//   Slide.prototype.init = function() {
//     var _slide = this
//     var slideId = +new Date
//     var slideCss = '.' + _cParent + slideId + '{'
//     if (_slide.showElm === _slide.len) slideCss += 'width:' + _slide.width +
//       'px;';
//
//     slideCss += 'height:' + _slide.height + 'px;}' + '.' + _cWrapper +
//       slideId + '{'
//     if (_slide.direction === 'x') {
//       slideCss += 'width:' + _slide.width * _slide.elms.length +
//         'px;height:' + _slide.height + 'px;}'
//     } else if (_slide.direction === 'y') {
//       slideCss += 'height:' + _slide.height * _slide.elms.length +
//         'px;width:' + _slide.width + 'px;}'
//     }
//
//     $.addStyle(slideCss)
//     $.addClass(_slide.parent, _cParent + ' ' + _cParent + slideId)
//     $.addClass(_slide.wrapper, _cWrapper + ' ' + _cWrapper + slideId)
//     _slide.elm.addClass(_cTarget)
//       // _slide.elm.fastEach(function(elm,i){
//       // 	_slide.moveHandle(elm,'x',i)
//       // })
//   }
//   Slide.prototype._move = function(n, fn) {
//     var _self = this
//     var exd = fn
//     _self.n = n || 0
//     _self.moveHandle(_self.wrapper, _self.direction, -_self.n)
//     fn && fn(_self.n)
//   }
//   Slide.prototype.move = function(n, fn) {
//     var _self = this
//     _self._move(n)
//     fn && fn()
//     _self.onchanged && _self.onchanged(n)
//   }
//   Slide.prototype.prev = function() {
//     var _self = this
//     if (_self.n > 0) {
//       _self.move(--_self.n)
//     } else if (_self.n === 0) {
//       _self.move(_self.n = _self.showElm - 1)
//     }
//   }
//   Slide.prototype.next = function() {
//     var _self = this
//     var len = _self.showElm - 1
//     if (_self.n < len) {
//       _self.move(++_self.n)
//     } else if (_self.n === len) {
//       _self.move(_self.n = 0)
//     }
//   }
//   Slide.prototype._autoPlay = function() {
//     var _self = this
//     _self._timer = window.setInterval(function() {
//       _self.next()
//     }, _self.delay)
//     $.on(_self.box, 'mouseenter', function(e) {
//       window.clearInterval(_self._timer)
//     })
//     $.on(_self.box, 'mouseleave', function(e) {
//       _self._timer = window.setInterval(function() {
//         _self.next()
//       }, _self.delay)
//     })
//   }
//   Slide.prototype._merge = function() {
//     var n = _self.showElm
//   }
//   Slide.prototype._ctrl = function(elms) {
//     var _self = this
//     var onChange = _self.onchanged
//     _self._cTimer = -1
//     _self.onchanged = function(i) {
//       elms.removeClass('current')
//       $.addClass(elms[i], 'current')
//       onChange && onChange.call(_self, i)
//     }
//     elms.each(function(el, i) {
//       $.on(el, 'mouseenter', function(e) {
//         window.clearTimeout(_self._cTimer)
//         _self._cTimer = window.setTimeout(function() {
//           _self.move(i)
//         }, 50)
//       })
//       $.on(el, 'mouseleave', function(e) {
//         window.clearTimeout(_self._cTimer)
//       })
//     })
//   }
//   Slide.prototype._onNext = function(elm) {
//     var _self = this
//     $.on(elm[0], 'click', function(e) {
//       _self.next()
//       return !1
//     })
//   }
//   Slide.prototype._onPrev = function(elm) {
//     var _self = this
//     $.on(elm[0], 'click', function(e) {
//       _self.prev()
//       return !1
//     })
//   }
// })
// module.require(['Slide'], function(Slide) {
//   var $ = this
//   var tab1 = $('#JTab1')[0]
//   var slideA = new Slide({
//     control: $('#JTab1 .dot-ctrl .dot-bt'),
//     target: $('#JTab1 .tab-show .box'),
//     nextBt: $('#JTab1 .next'),
//     prevBt: $('#JTab1 .prev'),
//     box: tab1,
//     autoPlay: !0,
//     delay: 2000
//   })
//   var slideC = new Slide({
//     target: $('#JTabC .tab-show .box'),
//     nextBt: $('#JTabC .next'),
//     prevBt: $('#JTabC .prev'),
//     showElm: 4
//   })
//   var slideEnd = new Slide({
//     target: $('#JTabEnd .box'),
//     nextBt: $('#JTabEnd .next'),
//     prevBt: $('#JTabEnd .prev'),
//     showElm: 3
//   })
//   var slideInfo = new Slide({
//     target: $('#JTabI .box'),
//     control: $('#JTabI .i-ctrl'),
//     autoPlay: !1,
//     direction: 'y',
//     delay: 1000
//   })
// })
// module.define('Timer', function(require, module, exports) {
//   /**
//    * @ignore
//    * single timer for the whole anim module
//    * @author yiminghe@gmail.com
//    */
//   var win = window,
//     // note in background tab, interval is set to 1s in chrome/firefox
//     // no interval change in ie for 15, if interval is less than 15
//     // then in background tab interval is changed to 15
//     INTERVAL = 15,
//     // https://gist.github.com/paulirish/1579671
//     requestAnimationFrameFn,
//     cancelAnimationFrameFn;
//
//   // http://bugs.jquery.com/ticket/9381
//   if (0) {
//     requestAnimationFrameFn = win.requestAnimationFrame;
//     cancelAnimationFrameFn = win.cancelAnimationFrame;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for (var x = 0; x < vendors.length && !requestAnimationFrameFn; ++x) {
//       requestAnimationFrameFn = win[vendors[x] + 'RequestAnimationFrame'];
//       cancelAnimationFrameFn = win[vendors[x] + 'CancelAnimationFrame'] ||
//         win[vendors[x] + 'CancelRequestAnimationFrame'];
//     }
//   } else {
//     requestAnimationFrameFn = function(fn) {
//       return setTimeout(fn, INTERVAL);
//     };
//     cancelAnimationFrameFn = function(timer) {
//       clearTimeout(timer);
//     };
//   }
//
//   //function check() {
//   //    if (runnings.head === runnings.tail) {
//   //        if (runnings.head && (runnings.head._ksNext || runnings.head._ksPrev)) {
//   //            debugger
//   //        }
//   //        return;
//   //    }
//   //}
//
//   var runnings = {
//     head: null,
//     tail: null
//   };
//
//   var manager = module.exports = {
//     runnings: runnings,
//
//     timer: null,
//
//     start: function(anim) {
//       //check();
//       anim._ksNext = anim._ksPrev = null;
//       if (!runnings.head) {
//         runnings.head = runnings.tail = anim;
//       } else {
//         anim._ksPrev = runnings.tail;
//         runnings.tail._ksNext = anim;
//         runnings.tail = anim;
//       }
//       //check();
//       manager.startTimer();
//     },
//
//     stop: function(anim) {
//       this.notRun(anim);
//     },
//
//     notRun: function(anim) {
//       //check();
//       if (anim._ksPrev) {
//         if (runnings.tail === anim) {
//           runnings.tail = anim._ksPrev;
//         }
//         anim._ksPrev._ksNext = anim._ksNext;
//         if (anim._ksNext) {
//           anim._ksNext._ksPrev = anim._ksPrev;
//         }
//       } else {
//         runnings.head = anim._ksNext;
//         if (runnings.tail === anim) {
//           runnings.tail = runnings.head;
//         }
//         if (runnings.head) {
//           runnings.head._ksPrev = null;
//         }
//       }
//       //check();
//       anim._ksNext = anim._ksPrev = null;
//       if (!runnings.head) {
//         manager.stopTimer();
//       }
//     },
//
//     pause: function(anim) {
//       this.notRun(anim);
//     },
//
//     resume: function(anim) {
//       this.start(anim);
//     },
//
//     startTimer: function() {
//       var self = this;
//       if (!self.timer) {
//         self.timer = requestAnimationFrameFn(function run() {
//           self.timer = requestAnimationFrameFn(run);
//           if (self.runFrames()) {
//             self.stopTimer();
//           }
//         });
//       }
//     },
//
//     stopTimer: function() {
//       var self = this,
//         t = self.timer;
//       if (t) {
//         cancelAnimationFrameFn(t);
//         self.timer = 0;
//       }
//     },
//
//     runFrames: function() {
//       var anim = runnings.head;
//       //var num = 0;
//       //var anims = [];
//       while (anim) {
//         //anims.push(anim);
//         var next = anim._ksNext;
//         // in case anim is stopped
//         anim.frame();
//         anim = next;
//         //num++;
//       }
//       //        anims.forEach(function (a) {
//       //            a.frame();
//       //        });
//       return !runnings.head;
//     }
//   };
// })
