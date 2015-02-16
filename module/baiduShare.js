module.define('baiduShare', function(require, module, exports) {
  var $ = this
  $.loadScript('http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5))
	module.exports = function() {
		window._bd_share_config = {
			"common": {
				"bdSnsKey": {},
				"bdText": "",
				"bdMini": "2",
				"bdMiniList": false,
				"bdPic": "",
				"bdStyle": "0",
				"bdSize": "16"
			},
			"share": {}
		}
  }
})
