export default function () {
	let doc = document;

	// UA marking
	const UA_LIST = ['iPhone', 'iPad', 'MQQBrowser', 'Android', 'MicroMessenger', 'Trident'];
	let ua = navigator.userAgent;
	let $html = doc.getElementsByTagName('html')[0];
	for (let i = 0; i < UA_LIST.length; i++) {
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
	}

	// Enable the CSS `:active` interactions
	doc.getElementsByTagName('body')[0].addEventListener('touchstart', function(){}, {passive: true});
	doc.getElementsByTagName('main')[0].addEventListener('touchstart', function(){}, {passive: true});

	// Twist HTML language
	// doc.getElementsByTagName('html')[0].setAttribute('lang', 'en');
}
