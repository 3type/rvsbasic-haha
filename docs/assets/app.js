(function () {
	'use strict';

	function _misc () {
	  var doc = document; // UA marking

	  var UA_LIST = ['iPhone', 'iPad', 'MQQBrowser', 'Android', 'MicroMessenger', 'Trident'];
	  var ua = navigator.userAgent;
	  var $html = doc.getElementsByTagName('html')[0];

	  for (var i = 0; i < UA_LIST.length; i++) {
	    var uaRegExp = new RegExp(UA_LIST[i]);

	    if (ua.match(uaRegExp)) {
	      $html.classList.add('ua-' + UA_LIST[i]);
	    }
	  }

	  if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
	    $html.classList.add('ua-Safari');
	  }

	  if (!('ontouchstart' in window)) {
	    $html.classList.add('ua-Pointer');
	  } // Enable the CSS `:active` interactions


	  doc.getElementsByTagName('body')[0].addEventListener('touchstart', function () {}, {
	    passive: true
	  });
	  doc.getElementsByTagName('main')[0].addEventListener('touchstart', function () {}, {
	    passive: true
	  }); // Twist HTML language
	  // doc.getElementsByTagName('html')[0].setAttribute('lang', 'en');
	}

	function viewIndex () {
	  var doc = document;
	  var win = window; // Volume meter
	  // Credit: https://github.com/cwilso/volume-meter/

	  function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
	    var _this = this;

	    var processor = audioContext.createScriptProcessor(1024);
	    processor.clipping = false;
	    processor.lastClip = 0;
	    processor.volume = 0;
	    processor.clipLevel = clipLevel || 0.98;
	    processor.averaging = averaging || 0.95;
	    processor.clipLag = clipLag || 750;
	    processor.onaudioprocess = volumeAudioProcess; // this will have no effect, since we don't copy the input to the output,
	    // but works around a current Chrome bug.

	    processor.connect(audioContext.destination);

	    processor.checkClipping = function () {
	      if (!_this.clipping) return false;
	      if (_this.lastClip + _this.clipLag < win.performance.now()) _this.clipping = false;
	      return _this.clipping;
	    };

	    processor.shutdown = function () {
	      _this.disconnect();

	      _this.onaudioprocess = null;
	    };

	    return processor;
	  }

	  function volumeAudioProcess(event) {
	    var buf = event.inputBuffer.getChannelData(0);
	    var bufLength = buf.length;
	    var sum = 0;
	    var x;

	    for (var i = 0; i < bufLength; i++) {
	      x = buf[i];

	      if (Math.abs(x) >= this.clipLevel) {
	        this.clipping = true;
	        this.lastClip = win.performance.now();
	      }

	      sum += x * x;
	    }

	    var rms = Math.sqrt(sum / bufLength);
	    this.volume = Math.max(rms, this.volume * this.averaging);
	    console.log('test');
	    console.log(rms, this.volume * this.averaging, this.volume);
	  }

	  var audioContext;
	  var mediaStreamSource;
	  var meter;
	  var $inst = doc.querySelector('.instruction');
	  var $text = doc.querySelector('.text');
	  var textStyle = $text.style;
	  $text.addEventListener('click', function () {
	    if ($text.classList.contains('is-clicked')) {
	      return;
	    } else {
	      $text.classList.add('is-clicked');
	      $inst.classList.add('is-clicked');
	    }

	    win.AudioContext = win.AudioContext || win.webkitAudioContext;
	    audioContext = new AudioContext();

	    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	      // console.log('clicked');
	      navigator.mediaDevices.getUserMedia({
	        audio: true
	      }).then(function (stream) {
	        mediaStreamSource = audioContext.createMediaStreamSource(stream);
	        meter = createAudioMeter(audioContext);
	        mediaStreamSource.connect(meter);
	        console.log('4');
	        updateFVS();
	      });
	    }
	  });

	  var updateFVS = function updateFVS() {
	    console.log(meter.volume);
	    var WDTH_LB = 50;
	    var WDTH_RATE = 5;
	    var SCALE_RATE = 5; // textStyle.fontVariationSettings = '"wdth"' + 50 * (1 + 2.5 * meter.volume);

	    textStyle.fontVariationSettings = '"wdth"' + WDTH_LB * (1 + WDTH_RATE * meter.volume);
	    textStyle.transform = 'translateY(-50%) scale(' + (1 + SCALE_RATE * meter.volume) + ')';
	    textStyle.webkitTransform = 'translateY(-50%) scale(' + (1 + SCALE_RATE * meter.volume) + ')';
	    requestAnimationFrame(updateFVS);
	  };
	}

	/*!
	 * @license
	 * Chris Wilson | MIT license | https://github.com/cwilso/volume-meter
	 */
	var doc = document; // Misc

	_misc(); // Class

	var view = doc.querySelector('body').classList[0];

	switch (view) {
	  case 'index':
	    {
	      viewIndex();
	      break;
	    }
	}

}());
//# sourceMappingURL=app.js.map
