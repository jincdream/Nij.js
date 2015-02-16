module.defined('Fix', function(mocule, exports) {
  var $ = this;
  var jin = $.j;

  function Fix(el) {
    var fix;
    if (el === null) return {
      scrollFix: function() {}
    };
    if (!(this instanceof Fix)) {
      fix = new Fix(el);
      return fix.init(el);
    }
  }
  Fix.prototype.init = function(el) {
    var self = this;
    var un = void(0);
    self._isIe = !window.XMLHttpRequest;
    self.cache = {};
    self.cache.elm = self.elm = el;
    self.doc = $.browser.webkit ? document.body : document.documentElement;
    return this;
  };
  Fix.prototype.ieFix = function() {
    var self = this;
    var oHtml = jin('html')[0];
    var oHtmlStyle = oHtml.style;
    if (oHtml.currentStyle.backgroundAttachment !== 'fixed') {
      oHtmlStyle.backgroundImage = 'url(about:blank)';
      oHtmlStyle.backgroundAttachment = 'fixed';
    }
    self.elm.style.position = 'absolute';
  };
  Fix.prototype.scIe = function(t, scrollTop, cacheTop) {
    var self = this;
    var des = 'documentElement.scrollTop';
    var scroll = scrollTop || 0;
    if (t === 'auto') t = 0;
    cacheTop = cacheTop || 0;
    self.ieFix();
    self.elm.style.setExpression('top', 'eval(' + des + '>' + scroll +
      '?' + des + '+' + t + ':' + cacheTop + ')');
  };
  Fix.prototype._arg = function(top, left, right, callback) {
    var t = this._getVal(top)
    var l = this._getVal(left)
    var r = this._getVal(right)

    callback(t, l, r);
  };
  Fix.prototype._getVal = function(val) {
    return !!val ? (val === 'auto' ? 'auto' : val + 'px') : (val === 0 ?
      '0' : 'auto');
  };
  Fix.prototype.fix = function(top, left, right, scroll) {
    var un = void(0);
    var self = this;
    scroll ? handle(top, left, right) : self._arg(top, left, right,
      handle);

    function handle(top, left, right) {
      self.elm.style.left = left;
      self.elm.style.right = right;
      self._isIe && !scroll ? (function(top) {
        var ieTop = top.replace('px', '');
        self.scIe(ieTop, 0, ieTop);
      })(top) : (function(top) {
        self.elm.style.top = top;
      })(top);
    }
  };
  Fix.prototype.scrollFix = function(option, callback) {
    var un = void(0);
    var self = this;
    var cache = self.cache;
    var el = self.elm;
    var syl = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle;
    var val = option.val;
    var once = !0;
    var ieOnce = !0;
    if (!self.cache.top) {
      cache.position = syl.position;
      cache.top = syl.top === 'auto' ? 'auto' : syl.top;
      cache.right = syl.right === 'auto' ? 'auto' : syl.right;
      cache.left = syl.left === 'auto' ? 'auto' : syl.left;
    } else {
      var _l = +cache.left.replace('px', '');
      if (_l !== option.left) cache.left = option.left + 'px';
    }
    var h = function(top, left, right) {
      var _h = null;
      if (window.onscroll !== null) _h = window.onscroll;
      window.onscroll = function() {
        var st = self.doc.scrollTop;
        if (st >= val && once) {
          el.style.position = 'fixed';
          self.fix(top, left, right, !0);
          once = !1;
        } else if (st < val && !once) {
          el.style.position = cache.position;
          self.fix(cache.top, left, cache.right, !0);
          once = !0;
        }
        if (_h) _h();
        if (callback) callback(st);
      };
    };
    var ieH = function(top, left, right) {
      var ieTop = top.replace('px', '');
      self.scIe(ieTop, val, cache.top.replace('px', ''));
      if (callback) {
        window.onscroll = function() {
          var st = self.doc.scrollTop;
          callback(st);
        };
      }
    };
    var handle = self._isIe ? (function() {
      h = null;
      return ieH;
    })() : (function() {
      ieH = null;
      return h;
    })();
    self._arg(option.top, cache.left.replace('px', '') || option.left,
      option.right, handle);
  };
  mocule.exports = Fix;
});
