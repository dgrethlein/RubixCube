// three.js shape to line


var renderer, scene, camera , raycaster;

var line;
var MAX_POINTS = 500;
var drawCount;
var value = 1;
var delta = -0.01;
var cube_arr = [];

var last = false;
var quaternion = new THREE.Quaternion;
var axis = new THREE.Vector3(0,1,0);
var mouse = new THREE.Vector2();

init();

// Camera rotating around centered cube controls
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

animate();


// Conversion between degrees and radians
function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180.0);
}

// Revolving objects around world axes (adaptive orientation)
function revolve_around_X_axis(object , degrees) {
    var y = object.position.y;
    var z = object.position.z;

    var radians = degrees_to_radians(degrees);

    object.position.y = (y * Math.cos(radians)) - (z * Math.sin(radians));
    object.position.z = (z * Math.cos(radians)) + (y * Math.sin(radians));

    object.rotateOnWorldAxis(new THREE.Vector3(1,0,0), 1.0 * radians);
}

function revolve_around_Y_axis(object , degrees) {
    var x = object.position.x;
    var z = object.position.z;

    var radians = degrees_to_radians(degrees);

    object.position.x = (x * Math.cos(radians)) + (z * Math.sin(radians));
    object.position.z = (z * Math.cos(radians)) - (x * Math.sin(radians));

    object.rotateOnWorldAxis(new THREE.Vector3(0,1,0), 1.0 * radians);
}

function revolve_around_Z_axis(object , degrees) {
    var x = object.position.x;
    var y = object.position.y;

    var radians = degrees_to_radians(degrees);

    object.position.x = (x * Math.cos(radians)) - (y * Math.sin(radians));
    object.position.y = (y * Math.cos(radians)) + (x * Math.sin(radians));

    object.rotateOnWorldAxis(new THREE.Vector3(0,0,1), 1.0 * radians);
}

function init() {



    // io
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '30px';
    info.style.width = '80%';
    info.style.textAlign = 'center';
    info.style.color = '#fff';
    info.style.backgroundColor = 'transparent';
    info.style.zIndex = '1';


    document.body.appendChild(info);

    // ray-caster
    raycaster = new THREE.Raycaster();

    // renderer
    renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth  * 2 / 3, window.innerHeight * 2 / 3);
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(250, 250, 500);


    var light = new THREE.DirectionalLight( 0xffffff , 1);
    light.position.set(1,1,1).normalize();
    scene.add(light);



    var geometry = new THREE.BoxGeometry(40,40,40);
    var material = new THREE.MeshBasicMaterial({color : 0xffffff,
                                                vertexColors : THREE.FaceColors});

    // colors
    var red = new THREE.Color(1, 0, 0);
    var green = new THREE.Color(0, 1, 0);
    var blue = new THREE.Color(0, 0, 1);
    var colors = [red, green, blue];

    for (var row_idx = 0; row_idx < 3; row_idx++) {
        for (var col_idx = 0; col_idx < 3; col_idx++) {
            for (var dep_idx = 0; dep_idx < 3; dep_idx++) {

                for (var i = 0; i < 3; i++) {
                    if (row_idx == 0) {
                        geometry.faces[4 * i].color = colors[i];
                        geometry.faces[4 * i + 1].color = colors[i];
                    }

                    geometry.faces[4 * i + 2].color = colors[i];
                    geometry.faces[4 * i + 3].color = colors[i];
                }

                // mesh
                var box = new THREE.Mesh(geometry, material);
                cube_arr.push(box)
                box.position.set(-42 + row_idx * 42,
                                 -42 + col_idx * 42,
                                 -42 + dep_idx * 42)

                scene.add(box);
                console.log(cube_arr[-1]);
            }
        }
    }
    camera.lookAt( scene.position );
}



// render
function render() {


    renderer.render(scene, camera);
}


function animateBox() {
    let angle = 0.02;

    for (var cube_idx = 0; cube_idx < cube_arr.length; cube_idx++) {

        var cube = cube_arr[cube_idx];

        revolve_around_X_axis(cube, -1*angle);
        revolve_around_Z_axis(cube, 2.5*angle);
        revolve_around_Y_axis(cube, 1.5*angle);
    }
}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


// animate
function animate() {
  animateBox();
  controls.update();
  //changeFaceColors();
  requestAnimationFrame(animate);
  render();
}