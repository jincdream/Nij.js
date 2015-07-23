(function(exports,doc){
  var win = exports
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
  var log = function(){
    win.console && win.console.log(arguments)
  }

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
      script.onError = function(){
        win.clearTimeout(loadID);
        log(id,src,url,' is load error')
      }
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
        script.load(id,src,charset)
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
    module._alies = {}
    for (var n in config.alies) {
      var alies = this._alies[n] = {}
      alies.src = base + config.alies[n]
      alies.callback = []
    }
    module._deps = config.deps
    module._combom = config.combom
    module._combomUrl = config.combomUrl
  }
  var _getDeps = function(obj){
    var mDeps = module._deps
    var deps = mDeps[obj]
    var rz = []
    each(deps,function(dep,i){
      var otherDep = mDeps[dep]
      otherDep && rz.push.apply(rz,otherDep)
    })
    rz.push.apply(rz,deps)
    return rz
  }
  var require = function(names, cb) {
    var _self = module
    var mods = _self.mods;
    var alias = _self._alies
    var src = ''
    var loads = []
    var callback = function(){
      var fn = []
      each(loads,function(name,i){
        var mod = mods[name]
        mod.factory && mod.factory()
      })
      each(names,function(name,i){
        fn[i] = mods[name].exports
      })
      cb.apply(null, fn)
    }
    each(names,function(name,i){
      loads.push.apply(loads,_getDeps(name))
    })
    loads.push.apply(loads,names)
    var len = loads.length
    !_self._combom && each(loads, function(name, i) {
      // if(mods[name].exports)
      var mod = mods[name]
      if (mod && mod.loaded) {
        if (--len === 0) callback()
      } else {
        if (!alias[name]) throw new Error(name + 'is not define by module.')
        src = alias[name].src
        loadScript(src, function(src) {
          if (name === 'pc') {
            mods[name] = {
              exports: window.pc
            }
          }
          mods[name].loaded = !0
          if (--len === 0) callback()
        },doc.charset,name)
      }
    })
    if(_self._combom){
      var combom = []
      each(loads, function(name, i){
        var mod = mods[name]
        if(!mod || !mod.loaded){
          var src = alias[name].src
          if(!alias[name]) throw new Error(name + 'is not define by module.')
          combom.push(src)
        }
      })
      loadScript(_self._combomUrl+combom.join(','),function(){
        callback()
      },doc.charset,combom.join(','))
    }
    // console.log(_self._combomUrl+combom.join(','))
  }
  var requireOnce = function(name) {
    return module.mods[name].exports
  }
  var define = function(name,deps,fn){
    !fn && (fn = deps,deps = [])
    var m = module
    var o = m.mods[name] = {};
    var e = o.exports = {};
    o.factory = function(){
      fn.apply(m.w,[requireOnce, e, o]);
      delete this.factory
    }
    o.loaded = !0
  }
  require.config = function(config){
    module.config(config)
  }
  exports.define = define
  exports.require = require
  // exports. = module
})(window,document)
