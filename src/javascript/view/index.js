/* global randomColor, autosize */
export default function () {

let doc = document;
let win = window;



// Volume meter
// Credit: https://github.com/cwilso/volume-meter/
function createAudioMeter (audioContext, clipLevel, averaging, clipLag) {
	let processor = audioContext.createScriptProcessor(1024);
	
	processor.clipping       = false;
	processor.lastClip       = 0;
	processor.volume         = 0;
	processor.clipLevel      = clipLevel || 0.98;
	processor.averaging      = averaging || 0.95;
	processor.clipLag        = clipLag || 750;
	processor.onaudioprocess = volumeAudioProcess;
	
	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);
	
	processor.checkClipping = () => {
		if (!this.clipping)
			return false;
		if ((this.lastClip + this.clipLag) < win.performance.now())
			this.clipping = false;
		return this.clipping;
	};
	processor.shutdown = () => {
		this.disconnect();
		this.onaudioprocess = null;
	};
	
	return processor;
}
function volumeAudioProcess (event) {
	let buf = event.inputBuffer.getChannelData(0);
	let bufLength = buf.length;
	let sum = 0;
	let x;
	
	for (let i = 0; i < bufLength; i++) {
		x = buf[i];
		if (Math.abs(x) >= this.clipLevel) {
			this.clipping = true;
			this.lastClip = win.performance.now();
		}
		sum += x * x;
	}
	
	var rms = Math.sqrt(sum / bufLength);
	this.volume = Math.max(rms, this.volume * this.averaging);
	
	// console.log('test');
	// console.log(rms, this.volume * this.averaging, this.volume);
}



let audioContext;
let mediaStreamSource;
let meter;

let $inst = doc.querySelector('.instruction');
let $text = doc.querySelector('.text');
let textStyle = $text.style;

$text.addEventListener('click', () => {
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
		}).then((stream) => {
			mediaStreamSource = audioContext.createMediaStreamSource(stream);
			meter = createAudioMeter(audioContext);
			mediaStreamSource.connect(meter);
			// console.log('4');
			updateFVS();
		});
	}
});

let updateFVS = () => {
	// console.log(meter.volume);
	const WDTH_LB = 50;
	const WDTH_RATE = 5;
	const SCALE_RATE = 2;
	// textStyle.fontVariationSettings = '"wdth"' + 50 * (1 + 2.5 * meter.volume);
	textStyle.fontVariationSettings = '"wdth"' + WDTH_LB * (1 + WDTH_RATE * meter.volume);
	textStyle.transform       = 'translateY(-50%) scale(' + (1 + SCALE_RATE * meter.volume) + ')';
	textStyle.webkitTransform = 'translateY(-50%) scale(' + (1 + SCALE_RATE * meter.volume) + ')';
	requestAnimationFrame(updateFVS);
};



// Record caret position
/* let caretPos = $text.innerHTML.length;
let updateCaretPos = () => {
	// Credit: https://stackoverflow.com/a/3976125
	let sel = 0, range = 0;
	let editableDiv = $text;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.rangeCount) {
			range = sel.getRangeAt(0);
			if (range.commonAncestorContainer.parentNode === editableDiv) {
				caretPos = range.endOffset;
			}
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		if (range.parentElement() === editableDiv) {
			let tempEl = document.createElement("span");
			editableDiv.insertBefore(tempEl, editableDiv.firstChild);
			
			let tempRange = range.duplicate();
			tempRange.moveToElementText(tempEl);
			tempRange.setEndPoint("EndToEnd", range);
			caretPos = tempRange.text.length;
		}
	}
	console.log(caretPos);
};
$text.addEventListener('mousedown', updateCaretPos);
$text.addEventListener('mouseup',   updateCaretPos);
$text.addEventListener('keydown',   updateCaretPos);
$text.addEventListener('keyup',     updateCaretPos); */

// Auto resize for textarea
autosize($text);
// Pre-fill with `哈哈哈哈哈哈哈哈`
$text.value = '哈哈哈哈哈哈哈哈';

let caretPos = $text.value.length;
let updateCaretPos = (e) => {
	caretPos = e.target.selectionStart
	console.log(caretPos);
};
$text.addEventListener('mousedown', updateCaretPos);
$text.addEventListener('mouseup',   updateCaretPos);
$text.addEventListener('keydown',   updateCaretPos);
$text.addEventListener('keyup',     updateCaretPos);

// Insert clicked text into the caret position
let $glyfList = doc.querySelector('.glyf-list');
/* let insertChar = (char) => {
	let $lastBr = $text.querySelector('br:first-child');
	if ($lastBr) {
		$lastBr.remove();
	}
	
	let str = $text.innerHTML;
	$text.innerHTML = str.slice(0, caretPos) + char + str.slice(caretPos);
	
	// Update caretPos
	caretPos += char.length;
}; */
let insertChar = (char) => {
	let str = $text.value;
	$text.value = str.slice(0, caretPos) + char + str.slice(caretPos);
	
	// Update caretPos
	caretPos += char.length;
	
	// Re-focus
	// $text.focus();
	// $text.selectionStart = caretPos;
	
};
$glyfList.addEventListener('click', (e) => {
	let $target = e.target;
	while (!$target.matches('.glyf-item') && !$target.matches('.glyf-list') && $target) {
		$target = $target.parentElement;
		insertChar($target.getAttribute('data-char'));
	}
});



// Random color
const COLOR_DURATION = 5000;
let changeColor = () => {
	/* let bg = randomColor({
		luminosity: 'light',
		format: 'rgb'
	});
	let ink = randomColor({
		luminosity: 'dark',
		format: 'rgb'
	}); */
	let ink = randomColor({
		luminosity: 'light',
		format: 'rgb'
	});
	
	doc.documentElement.style.setProperty('--color-ink', ink);
	// doc.documentElement.style.setProperty('--color-bg',  bg);
};
changeColor();
setInterval(changeColor, COLOR_DURATION);

}
