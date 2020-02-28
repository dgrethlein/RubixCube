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

function up_layer_cubes() {
    var up_cubes = cube_arr.filter(cube => cube.position.y > 25);

    return up_cubes;
}

function equator_layer_cubes() {
    var eq_cubes = cube_arr.filter(cube => cube.position.y < 25 && cube.position.y > -25);

    return eq_cubes;
}

function down_layer_cubes() {
    var dn_cubes = cube_arr.filter(cube => cube.position.y < -25);

    return dn_cubes;
}

function front_layer_cubes() {
    var fr_cubes = cube_arr.filter(cube => cube.position.z > 25);

    return fr_cubes;
}

function standing_layer_cubes() {
    var st_cubes = cube_arr.filter(cube => cube.position.z < 25 && cube.position.z > -25);

    return st_cubes;
}

function back_layer_cubes() {
    var bk_cubes = cube_arr.filter(cube => cube.position.z < -25);

    return bk_cubes;
}

function left_layer_cubes() {
    var lf_cubes = cube_arr.filter(cube => cube.position.x < -25);

    return lf_cubes;
}

function middle_layer_cubes() {
    var md_cubes = cube_arr.filter(cube => cube.position.x < 25 && cube.position.x > -25);

    return md_cubes;
}

function right_layer_cubes() {
    var rg_cubes = cube_arr.filter(cube => cube.position.x > 25);

    return rg_cubes;
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
    camera.position.set(0, 0, 500);


    // Scene ambient lighting (soft white)
    var light1 = new THREE.AmbientLight( 0x404040 , 5);
    scene.add(light1);

    // Axes helper for debugging 3d graphics sides
    var axesHelper = new THREE.AxesHelper( 500 );
    scene.add(axesHelper);


    var geometry = new THREE.BoxGeometry(40,40,40);
    var material = new THREE.MeshLambertMaterial({color : 0xffffff,
                                                  vertexColors : THREE.FaceColors});

    // colors
    var front_color = new THREE.Color( 0x009b48 ); //Default Green
    var back_color = new THREE.Color( 0x0045ad );  // Default Blue
    var left_color = new THREE.Color( 0xff5900 );  // Default Orange
    var right_color = new THREE.Color( 0xb90000 ); // Default Red
    var up_color = new THREE.Color( 0xffffff );    // Default White
    var down_color = new THREE.Color( 0xffd500 );  // Default Yellow

    var colors = [ right_color, left_color, up_color, down_color, front_color, back_color ];

    for (var row_idx = 0; row_idx < 3; row_idx++) {
        for (var col_idx = 0; col_idx < 3; col_idx++) {
            for (var dep_idx = 0; dep_idx < 3; dep_idx++) {

                for (var i = 0; i < 3; i++) {

                    geometry.faces[4 * i].color = colors[2*i];
                    geometry.faces[4 * i + 1].color = colors[2*i];
                    geometry.faces[4 * i + 2].color = colors[2*i+1];
                    geometry.faces[4 * i + 3].color = colors[2*i+1];
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

    document.addEventListener("keydown", onDocumentKeyDown, false);



    function onDocumentKeyDown(event) {
        var keyCode = event.which || event.keyCode;
        var strKey = String.fromCharCode(keyCode);

        console.log(`KeyCode[${keyCode}] Str[${strKey}]`);

        if (strKey == 'L') {
            var lf_cubes = left_layer_cubes();

            for ( var l_idx = 0; l_idx < lf_cubes.length; l_idx++ ) {
                var l_cube = lf_cubes[l_idx];
                revolve_around_X_axis(l_cube, 10);
            }

        }
        if (strKey == 'M') {
            var md_cubes = middle_layer_cubes();

            for ( var m_idx = 0; m_idx < md_cubes.length; m_idx++ ) {
                var m_cube = md_cubes[m_idx];
                revolve_around_X_axis(m_cube, 10);
            }

        }
        if (strKey == 'R') {
            var rg_cubes = right_layer_cubes();

            for ( var r_idx = 0; r_idx < rg_cubes.length; r_idx++ ) {
                var r_cube = rg_cubes[r_idx];
                revolve_around_X_axis(r_cube, 10);
            }

        }

    };

    camera.lookAt( scene.position );
}



// render
function render() {


    renderer.render(scene, camera);
}


function animateBox() {
    let angle = 0.02;

    //revolve_around_X_axis(camera, -10*angle);
    revolve_around_Y_axis(camera, 5*angle);
    //revolve_around_Z_axis(camera, 10*angle);

    /*var up_cubes = up_layer_cubes();
    var eq_cubes = equator_layer_cubes();
    var dn_cubes = down_layer_cubes();

    for (var u_idx = 0; u_idx < up_cubes.length; u_idx++) {

        var up_cube = up_cubes[u_idx];

        revolve_around_Y_axis(up_cube, 10*angle);
    }
    for (var e_idx = 0; e_idx < eq_cubes.length; e_idx++) {

        var eq_cube = eq_cubes[e_idx];

        revolve_around_Y_axis(eq_cube, -20*angle);
    }
    for (var d_idx = 0; d_idx < dn_cubes.length; d_idx++) {

        var dn_cube = dn_cubes[d_idx];

        revolve_around_Y_axis(dn_cube, 20*angle);
    }*/

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