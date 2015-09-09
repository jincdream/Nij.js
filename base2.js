// require
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
      _self.setStatus(0)
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
  module._path = {}
  module._short = {}
  module.w = {}
  module.config = function(config){
    var _self      = this,n,short
    var _base      = config.baseUrl || _self._baseUrl || ''
    var _deps      = config.deps
    var _combo     = config.combo
    var _comboUrl  = config.comboUrl
    var _path      = config.path
    var _alies     = config.alies
    for (n in _path) {
      var path = _self._path[n] = _self._path[_path[n]] = {}
      path.src = _path[n]
      path.callback = []
    }
    for (short in _alies){
      _self._short[short] = _alies[short]
    }
    _self._baseUrl = _base
    _deps     && (_self._deps     = _deps)
    _combo    && (_self._combo    = _combo)
    _comboUrl && (_self._comboUrl = _comboUrl)
  }
  var _getDeps = function(obj){
    var mDeps = module._deps || {}
    var deps = mDeps[obj]
    var rz = []
    deps && each(deps,function(dep,i){
      var otherDep = mDeps[dep]
      otherDep && rz.push.apply(rz,otherDep)
    })
    rz.push.apply(rz,deps || [])
    return rz
  }
  var require = function(names, cb , charset , _noCombo) {
    var _self    = module
    var mods     = _self.mods
    var path     = _self._path
    var baseUrl  = _self._baseUrl
    var src      = ''
    var loads    = []
    var callback = function(){
      var fn = []
      each(loads,function(name,i){
        name = _self._short[name] || name
        var mod = mods[name]
        mod.factory && mod.factory()
      })
      each(names,function(name,i){
        name = _self._short[name] || name
        fn[i] = mods[name].exports
      })
      cb.apply(null, fn)
    }
    each(names,function(name,i){
      loads.push.apply(loads,_getDeps(name))
    })
    loads.push.apply(loads,names)
    var len = loads.length
    ;(!_self._combo || _noCombo) && each(loads, function(name, i, ary) {
      // if(mods[name].exports)
      name = _self._short[name] || name
      console.log(_self._short[name])
      var mod      = mods[name]
      var thisPath = path[name]
      var loadSrc  = thisPath ? baseUrl + thisPath.src : name
      if (mod && mod.loaded) {
        if (--len === 0) callback()
      } else {
        // if (!path[name]) throw new Error(name + 'is not define by module.')
        src = loadSrc
        loadScript(src, function(src) {
          if(!mods[name])mods[name] = {}
          mods[name].loaded = !0
          if (--len === 0) callback()
        },charset || doc.charset,name)
      }
    })
    if(_self._combo && !_noCombo){
      var combo = []
      each(loads, function(name, i){
        name = _self._short[name] || name
        var mod = mods[name]
        if(!mod || !mod.loaded){
          var src = path[name].src
          if(!path[name]) throw new Error(name + 'is not define by module.')
          combo.push(src)
        }
      })
      console.log(baseUrl)
      combo.length > 0 ? loadScript((baseUrl + _self._comboUrl || '')+combo.join(','),function(){
        callback()
      },charset || doc.charset,combo.join(',')) : callback()
    }
    // console.log(_self._comboUrl+combo.join(','))
  }
  var requireOnce = function(name){
    var mod = module.mods[name]
    mod.factory && mod.factory()
    return mod.exports
  }
  var define = function(name,deps,fn){
    !fn && (fn = deps,deps = [])
    var _name = name.split('|')
    var short = _name[0]
    var _ln = _name.length > 1
    var id = _ln ? _name[1] : short
    var m = module
    var o = m.mods[id] = {};
    var e = o.exports = {};
    _ln && (m._short[short] = id)
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
