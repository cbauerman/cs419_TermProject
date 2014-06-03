var scene;
var camera;
var renderer;


function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,
			window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	camera.position = new THREE.Vector3(0, 0, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	render();
}


if (window.attachEvent) {
	window.attachEvent('onload', init);
} else {
	if (window.onload) {
		var curronload = window.onload;
		var newonload = function () {
			curronload();
			init();
		};
		window.onload = newonload;
	} else {
		window.onload = init;
	}
}