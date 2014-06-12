var scene;
var camera;
var renderer;

var clock;
var light;

var agent_geo;


// arrays of objects
var agents;
var hazards;

// behaviour coefficients
var coeff_cohesion = 1.0;
var coeff_speed = 1.0;

var speed_target = 3.0;

// CONSTANTS
var NUM_AGENTS = 100;

var NEIGHBOUR_DIS = 8;

var X_MIN = -30;
var X_MAX =  30;
var Y_MIN = -30;
var Y_MAX =  30;
var Z_MAX =  30;
var Z_MIN = -30;

var V_MIN = -5;
var V_MAX = 5;

function render() {

	animate(clock.getDelta());

	requestAnimationFrame(render);
	renderer.render(scene, camera);
	
}

function animate(delta){

	for(var i = 0; i < agents.length; ++i){
	
		var agent = agents[i];
	
		var neighbours = [];
		// identity all "neighbours"
		for(var j = 0; j < agents.length; ++j){
			if(j != i){
				if(agent.position.distanceTo(agents[j].position) < NEIGHBOUR_DIS){
					neighbours.push(agents[j]);
				}
			}
		}
		
		// cohesion
		var cohesion = new THREE.Vector3(0, 0, 0);
		for(var j = 0; j < neighbours.length; ++j){
			cohesion.add(neighbours[j].position);
		}
		cohesion.divideScalar(neighbours.length);
		cohesion.sub(agent.position).normalize().multiplyScalar(coeff_cohesion);
		
		agent.velocity.add(cohesion);
		
		var vel = agent.velocity.clone();
		agent.position.add(vel.multiplyScalar(delta));
		
		var facing = agent.facing;
		
		facing.normalize();
		vel.normalize()

		
		//agents always face their velocity
		var ang = facing.angleTo(vel);
		
		if(ang !== NaN){
		
			var axis = facing.clone().cross(vel).normalize();
		
			facing.applyAxisAngle(axis, ang);
			agent.rotateOnAxis(axis, ang);
		}
		
		// check for edges
		if(agent.position.x > X_MAX || agent.position.x < X_MIN){
			agent.position.x = -agent.position.x;
		}
		
		if(agent.position.y > Y_MAX || agent.position.y < Y_MIN){
			agent.position.y = -agent.position.y;
		}
		
		if(agent.position.z > Z_MAX || agent.position.z < Z_MIN){
			agent.position.z = -agent.position.z;
		}
		
		

		//agents[i].velocity.applyAxisAngle( new THREE.Vector3(0, 0, 1), Math.PI / 256);
	
	}

}


function init() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,
			window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	//camera
	camera.position = new THREE.Vector3(0, 0, 100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	//light
	light = new THREE.PointLight(0x0040ff);
	light.position = new THREE.Vector3(0, 0, 30);
	
	scene.add(light);
	
	
	clock = new THREE.Clock();
	clock.getDelta();
	
	// create array of agents
	agents = [];

	//create agent geometry
	agent_geo = new THREE.Geometry();
	var v1 = new THREE.Vector3(0, 1.5, 0);
	var v2 = new THREE.Vector3(-.5, 0, 0);
	var v3 = new THREE.Vector3(.5, 0, 0);
	
	agent_geo.vertices.push(v1);
	agent_geo.vertices.push(v2);
	agent_geo.vertices.push(v3);
	
	agent_geo.faces.push( new THREE.Face3(0, 1, 2));
	agent_geo.computeFaceNormals();
	
	// create each agent 
	for(var i = 0; i < NUM_AGENTS; ++i){
		var temp_agent = new THREE.Mesh( 
			agent_geo,
			new THREE.MeshPhongMaterial({color: '#00abb1'}));
			
		temp_agent.position = new THREE.Vector3(
			rand(X_MIN, X_MAX), 
			rand(Y_MIN, Y_MAX), 
			0);
												
		temp_agent.velocity = new THREE.Vector3(
			rand(V_MIN, V_MAX),
			rand(V_MIN, V_MAX),
			0);
		
		temp_agent.facing = new THREE.Vector3(0, 1, 0);
		
		agents.push(temp_agent);
		scene.add(temp_agent);
		
	}
		
	// create array of hazards
	hazards = [];
	
	render();
}

function rand(low, high){
	return Math.random() * (high - low) + low;
}


//run init on window load

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