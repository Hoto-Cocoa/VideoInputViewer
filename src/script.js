const video = document.querySelector('video'), loading = document.querySelector('.loading'), img = document.querySelector('img');

let sources = [];
let index = 0;

window.onload = () => navigator.mediaDevices.enumerateDevices().then(devices => sources = devices.filter(d => d.kind === 'videoinput')).then(() => play(sources[index]));

function play(source) {
	toggleLoading().then(() => video.srcObject && video.srcObject.getTracks().forEach(t => t.stop())).then(() => navigator.mediaDevices.getUserMedia({ video: { deviceId: source.deviceId, width: 1280, height: 720 }}).then(stream => document.querySelector('video').srcObject = stream).then(toggleLoading));
}

function getVideoIndex() {
	return ++index >= sources.length ? index = 0 : index;
}

async function toggleLoading() {
	if(loading.style.display === 'none') {
		loading.style.display = '';
		img.style.display = '';
		img.style.opacity = 0.3;
		if(video.srcObject) {
			let bitmap = await (new ImageCapture(video.srcObject.getVideoTracks()[0])).grabFrame();
			let canvas = document.createElement('canvas');
			canvas.width = bitmap.width;
			canvas.height = bitmap.height;
			canvas.getContext('2d').drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
			img.src = canvas.toDataURL();
			return true;
		} else {
			return true;
		}
	} else {
		loading.style.display = 'none';
		img.style.display = 'none';
		img.style.opacity = '';
		img.src = '';
		return true;
	}
}
