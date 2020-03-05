// three.js shape to line


var renderer, scene, camera , raycaster;

var activeCanvas = false;

var line;
var MAX_POINTS = 500;
var drawCount;
var value = 1;
var delta = -0.01;
var cube_arr = [];
var keys = {};
keys[16] = false;   // pre-ensures shift key works
var controls;
var last = false;
var quaternion = new THREE.Quaternion;
var axis = new THREE.Vector3(0,1,0);
var mouse = new THREE.Vector2();

// Flags for indicating which animation is in progress
var anim_L = false;
var L_count = 0;
var anim_Li = false;
var Li_count = 0;
var anim_M = false;
var M_count = 0;
var anim_Mi = false;
var Mi_count = 0;
var anim_R = false;
var R_count = 0;
var anim_Ri = false;
var Ri_count = 0;

var anim_U = false;
var U_count = 0;
var anim_Ui = false;
var Ui_count = 0;
var anim_E = false;
var E_count = 0;
var anim_Ei = false;
var Ei_count = 0;
var anim_D = false;
var D_count = 0
var anim_Di = false;
var Di_count = 0;

var anim_F = false;
var F_count = 0
var anim_Fi = false;
var Fi_count = 0;
var anim_S = false;
var S_count = 0;
var anim_Si = false;
var Si_count = 0;
var anim_B = false;
var B_count = 0;
var anim_Bi = false;
var Bi_count = 0;

// Re-orientation flags
var anim_X = false;
var X_count = 0;
var anim_Xi = false;
var Xi_count = 0;
var anim_Y = false;
var Y_count = 0;
var anim_Yi = false;
var Yi_count = 0;
var anim_Z = false;
var Z_count = 0;
var anim_Zi = false;
var Zi_count = 0;

var gameEvents = [];
var cubeGameEventTypes;
var cubeData;
var colors;

var changeCubeState = false;
var loadedMovesDone = false;

init();
animate();


// Loads a default cube game from file
function loadCubeJSON() {
    var script = document.getElementById('cube_js');
    var game_name = script.getAttribute('game_cube');
    return $.getJSON(`/api/cube_games/PUBLIC_GAMES/${game_name}.json`, cubeData, function (data) {
        cubeData = data;
    });
}

// Loads the japan game from file
function getJapanCube() {
    return $.getJSON('/api/cube_games/PUBLIC_GAMES/japan_game.json', cubeData, function (data) {
        cubeData = data;
    });
}

// Loads the checkboard game from file
function getCheckboardCube() {
    return $.getJSON('/api/cube_games/PUBLIC_GAMES/japan_game.json', cubeData, function (data) {
        cubeData = data;
    });
}

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

// Identifying different layers of the rubix cube by their positions
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

function turn_left_layer() {
    // Left Quarter Turn
    if (anim_L && L_count < 9) {

        var lf_cubes = left_layer_cubes();

        for ( var l_idx = 0; l_idx < lf_cubes.length; l_idx++ ) {
            var l_cube = lf_cubes[l_idx];

            revolve_around_X_axis(l_cube, 10);

        }
        L_count++;
    }
    else if (anim_L && L_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "L",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_L = false;
                L_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "L"});
            });
    }
}

function turn_left_layer_inverse() {
    // Left Inverse Quarter Turn
    if (anim_Li && Li_count < 9) {

        var lf_cubes = left_layer_cubes();

        for ( var l_idx = 0; l_idx < lf_cubes.length; l_idx++ ) {
            var l_cube = lf_cubes[l_idx];

            revolve_around_X_axis(l_cube, -10);

        }
        Li_count++;
    }
    else if (anim_Li && Li_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Li",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Li = false;
                Li_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Li"});
            });
    }
}

function turn_middle_layer() {
    // Middle Quarter Turn
    if (anim_M && M_count < 9) {

        var md_cubes = middle_layer_cubes();

        for ( var m_idx = 0; m_idx < md_cubes.length; m_idx++ ) {
            var m_cube = md_cubes[m_idx];
            revolve_around_X_axis(m_cube, 10);
        }
        M_count++;
    }
    else if (anim_M && M_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "M",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_M = false;
                M_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "M"});
            });
    }
}

function turn_middle_layer_inverse() {
    // Middle Inverse Quarter Turn
    if (anim_Mi && Mi_count < 9) {

        var md_cubes = middle_layer_cubes();

        for ( var m_idx = 0; m_idx < md_cubes.length; m_idx++ ) {
            var m_cube = md_cubes[m_idx];
            revolve_around_X_axis(m_cube, -10);
        }
        Mi_count++;
    }
    else if (anim_Mi && Mi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Mi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Mi = false;
                Mi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Mi"});
            });
    }
}

function turn_right_layer() {
    // Right Quarter Turn
    if (anim_R && R_count < 9) {

        var rg_cubes = right_layer_cubes();

        for ( var r_idx = 0; r_idx < rg_cubes.length; r_idx++ ) {
            var r_cube = rg_cubes[r_idx];
            revolve_around_X_axis(r_cube, -10);
        }
        R_count++;
    }
    else if (anim_R && R_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "R",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_R = false;
                R_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "R"});
            });
    }
}

function turn_right_layer_inverse() {
    // Right Inverse Quarter Turn
    if (anim_Ri && Ri_count < 9) {

        var rg_cubes = right_layer_cubes();

        for ( var r_idx = 0; r_idx < rg_cubes.length; r_idx++ ) {
            var r_cube = rg_cubes[r_idx];
            revolve_around_X_axis(r_cube, 10);
        }
        Ri_count++;
    }
    else if (anim_Ri && Ri_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Ri",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Ri = false;
                Ri_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Ri"});
            });
    }
}

function turn_up_layer() {
    // Up Quarter Turn
    if (anim_U && U_count < 9) {

        var up_cubes = up_layer_cubes();

        for ( var u_idx = 0; u_idx < up_cubes.length; u_idx++ ) {
            var u_cube = up_cubes[u_idx];

            revolve_around_Y_axis(u_cube, -10);

        }
        U_count++;
    }
    else if (anim_U && U_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "U",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_U = false;
                U_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "U"});
            });
    }
}

function turn_up_layer_inverse() {
    // Up Inverse Quarter Turn
    if (anim_Ui && Ui_count < 9) {

        var up_cubes = up_layer_cubes();

        for ( var u_idx = 0; u_idx < up_cubes.length; u_idx++ ) {
            var u_cube = up_cubes[u_idx];

            revolve_around_Y_axis(u_cube, 10);

        }
        Ui_count++;
    }
    else if (anim_Ui && Ui_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Ui",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Ui = false;
                Ui_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Ui"});
            });
    }
}

function turn_equator_layer() {
    // Equator Quarter Turn
    if (anim_E && E_count < 9) {

        var eq_cubes = equator_layer_cubes();

        for ( var e_idx = 0; e_idx < eq_cubes.length; e_idx++ ) {
            var e_cube = eq_cubes[e_idx];

            revolve_around_Y_axis(e_cube, 10);
        }
        E_count++;
    }
    else if (anim_E && E_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "E",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_E = false;
                E_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "E"});
            });
    }
}

function turn_equator_layer_inverse() {
    // Equator Inverse Quarter Turn
    if (anim_Ei && Ei_count < 9) {

        var eq_cubes = equator_layer_cubes();

        for ( var e_idx = 0; e_idx < eq_cubes.length; e_idx++ ) {
            var e_cube = eq_cubes[e_idx];

            revolve_around_Y_axis(e_cube, -10);
        }
        Ei_count++;
    }
    else if (anim_Ei && Ei_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Ei",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Ei = false;
                Ei_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Ei"});
            });
    }
}

function turn_down_layer() {
    // Down Quarter Turn
    if (anim_D && D_count < 9) {

        var dw_cubes = down_layer_cubes();

        for ( var d_idx = 0; d_idx < dw_cubes.length; d_idx++ ) {
            var d_cube = dw_cubes[d_idx];
            revolve_around_Y_axis(d_cube, 10);
        }
        D_count++;
    }
    else if (anim_D && D_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "D",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_D = false;
                D_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "D"});
            });
    }
}

function turn_down_layer_inverse() {
    // Down Inverse Quarter Turn
    if (anim_Di && Di_count < 9) {

        var dw_cubes = down_layer_cubes();

        for ( var d_idx = 0; d_idx < dw_cubes.length; d_idx++ ) {
            var d_cube = dw_cubes[d_idx];
            revolve_around_Y_axis(d_cube, -10);
        }
        Di_count++;
    }
    else if (anim_Di && Di_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Di",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Di = false;
                Di_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Di"});
            });
    }
}

function turn_front_layer() {
    // Front Quarter Turn
    if (anim_F && F_count < 9) {

        var ft_cubes = front_layer_cubes();

        for ( var f_idx = 0; f_idx < ft_cubes.length; f_idx++ ) {
            var f_cube = ft_cubes[f_idx];
            revolve_around_Z_axis(f_cube, -10);
        }
        F_count++;
    }
    else if (anim_F && F_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "F",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_F = false;
                F_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "F"});
            });
    }
}

function turn_front_layer_inverse() {
    // Front Inverse Quarter Turn
    if (anim_Fi && Fi_count < 9) {

        var ft_cubes = front_layer_cubes();

        for ( var f_idx = 0; f_idx < ft_cubes.length; f_idx++ ) {
            var f_cube = ft_cubes[f_idx];
            revolve_around_Z_axis(f_cube, 10);
        }
        Fi_count++;
    }
    else if (anim_Fi && Fi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Fi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Fi = false;
                Fi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Fi"});
            });
    }
}

function turn_standing_layer() {
    // Standing Quarter Turn
    if (anim_S && S_count < 9) {

        var st_cubes = standing_layer_cubes();

        for ( var s_idx = 0; s_idx < st_cubes.length; s_idx++ ) {
            var s_cube = st_cubes[s_idx];
            revolve_around_Z_axis(s_cube, -10);
        }
        S_count++;
    }
    else if (anim_S && S_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "S",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_S = false;
                S_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "S"});
            });
    }
}

function turn_standing_layer_inverse() {
    // Standing Inverse Quarter Turn
    if (anim_Si && Si_count < 9) {

        var st_cubes = standing_layer_cubes();

        for ( var s_idx = 0; s_idx < st_cubes.length; s_idx++ ) {
            var s_cube = st_cubes[s_idx];
            revolve_around_Z_axis(s_cube, 10);
        }
        Si_count++;
    }
    else if (anim_Si && Si_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Si",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Si = false;
                Si_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Si"});
            });
    }
}

function turn_back_layer() {
    // Back Quarter Turn
    if (anim_B && B_count < 9) {

        var bk_cubes = back_layer_cubes();

        for ( var b_idx = 0; b_idx < bk_cubes.length; b_idx++ ) {
            var b_cube = bk_cubes[b_idx];
            revolve_around_Z_axis(b_cube, 10);
        }
        B_count++;
    }
    else if (anim_B && B_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "B",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_B = false;
                B_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "B"});
            });
    }
}

function turn_back_layer_inverse() {
    // Back Inverse Quarter Turn
    if (anim_Bi && Bi_count < 9) {

        var bk_cubes = back_layer_cubes();

        for ( var b_idx = 0; b_idx < bk_cubes.length; b_idx++ ) {
            var b_cube = bk_cubes[b_idx];
            revolve_around_Z_axis(b_cube, -10);
        }
        Bi_count++;
    }
    else if (anim_Bi && Bi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Bi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Bi = false;
                Bi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Bi"});
            });
    }
}

function turn_roll() {
    // Z-Axis Quarter Rotation
    if (anim_Z && Z_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_Z_axis(cube, -10);
        }
        Z_count++;
    }
    else if (anim_Z && Z_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Z",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Z = false;
                Z_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Z"});
            });
    }
}

function turn_roll_inverse() {
    // Z-Axis Inverse Quarter Rotation
    if (anim_Zi && Zi_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_Z_axis(cube, 10);
        }
        Zi_count++;
    }
    else if (anim_Zi && Zi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Zi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Zi = false;
                Zi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Zi"});
            });
    }
}

function turn_pitch() {
    // X-Axis Quarter Rotation
    if (anim_X && X_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_X_axis(cube, -10);
        }
        X_count++;
    }
    else if (anim_X && X_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "X",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_X = false;
                X_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "X"});
            });
    }
}

function turn_pitch_inverse() {
    // X-Axis Inverse Quarter Rotation
    if (anim_Xi && Xi_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_X_axis(cube, 10);
        }
        Xi_count++;
    }
    else if (anim_Xi && Xi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Xi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Xi = false;
                Xi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Xi"});
            });
    }
}

function turn_yaw() {
    // Y-Axis Quarter Rotation
    if (anim_Y && Y_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_Y_axis(cube, -10);
        }
        Y_count++;
    }
    else if (anim_Y && Y_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Y",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Y = false;
                Y_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Y"});
            });
    }
}

function turn_yaw_inverse() {
    // Y-Axis Inverse Quarter Rotation
    if (anim_Yi && Yi_count < 9) {
        for ( var c_idx = 0; c_idx < cube_arr.length; c_idx++ ) {
            var cube = cube_arr[c_idx];

            revolve_around_Y_axis(cube, 10);
        }
        Yi_count++;
    }
    else if (anim_Yi && Yi_count == 9) {

        $.post("/updateGameState",
            { 'game_state_update' : "Yi",
              'change_cube_state' : changeCubeState }).done(function () {
                anim_Yi = false;
                Yi_count = 0;
                changeCubeState = false;
                gameEvents.push({"type" : "Yi"});
            });
    }
}


// Closing the side Navigation Bar
function closeNav() {
    /* Closes any open side nav drop downs when closing sidenav */
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;

    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].classList.remove('active');
        var dropdownContent = dropdown[i].nextElementSibling;

        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        }
    }
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "auto";
    document.getElementById("header_bar").style.marginLeft = "auto";
}

function checkToSetActiveCanvas(event) {

    var target = event.target.tagName;

    if (target == 'CANVAS') {
        activeCanvas = true;
        closeNav();
    }
    else {
        activeCanvas = false;
    }
}

function onDocumentKeyDown(event) {

    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }

    var keyCode = event.which || event.keyCode;
    var strKey = String.fromCharCode(keyCode);
    keys[keyCode] = true

    console.log(`KeyCode[${keyCode}] Str[${strKey}]`);

    if (strKey == 'S' && !keys[16] && !anim_L && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_Li &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_L = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'S' && keys[16] && !anim_Li && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_L &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Li = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'D' && !keys[16] && !anim_M && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_Mi &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_M = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'D' && keys[16] && !anim_Mi && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_M &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Mi = true;
            changeCubeState = true;
        }

    }
    if (strKey == 'F' && !keys[16] && !anim_R && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_R = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'F' && keys[16] && !anim_Ri && activeCanvas && loadedMovesDone) {

        // Must avoid conflicts with other movements
        if (!anim_R &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Ri = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'X' && !keys[16] && !anim_F && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Fi &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_F = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'X' && keys[16] && !anim_Fi && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_F &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Fi = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'C' && !keys[16] && !anim_S && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Si &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_S = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'C' && keys[16] && !anim_Si && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_S &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Si = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'V' && !keys[16] && !anim_B && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Bi &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_B = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'V' && keys[16] && !anim_Bi && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_B &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Bi = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'W' && !keys[16] && !anim_U && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Ui &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_U = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'W' && keys[16] && !anim_Ui && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_U &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Ui = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'E' && !keys[16] && !anim_E && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Ei &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_E = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'E' && keys[16] && !anim_Ei && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_E &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Ei = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'R' && !keys[16] && !anim_D && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Di &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_D = true;
            changeCubeState = true;
        }
    }
    if (strKey == 'R' && keys[16] && !anim_Di && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_D &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_X && !anim_Xi &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Di = true;
            changeCubeState = true;
        }
    }
    // Up Arrow Key (Revolve Around X Axis)
    if (keys[38] && !anim_X && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Xi &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_X = true;
            changeCubeState = true;
        }
    }
    // Down Arrow Key (Inverse Revolve Around X Axis)
    if (keys[40] && !anim_Xi && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_X &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_Y && !anim_Yi &&
            !anim_Z && !anim_Zi) {

            anim_Xi = true;
            changeCubeState = true;
        }
    }
    // Left Arrow Key (Revolve Around Y Axis)
    if (keys[37] && !anim_Y && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Yi &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_X && !anim_Xi &&
            !anim_Z && !anim_Zi) {

            anim_Y = true;
            changeCubeState = true;
        }
    }
    // Right Arrow Key (Inverse Revolve Around Y Axis)
    if (keys[39] && !anim_Yi && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Y &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_X && !anim_Xi &&
            !anim_Z && !anim_Zi) {

            anim_Yi = true;
            changeCubeState = true;
        }
    }
    // Space Bar (Revolve Around Z Axis)
    if (keys[32] && !anim_Z && !keys[16] && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Zi &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_Y && !anim_Yi &&
            !anim_X && !anim_Xi) {

            anim_Z = true;
            changeCubeState = true;
        }
    }
    // Space Bar + Shift (Inverse Revolve Around Z Axis)
    if (keys[32] && !anim_Zi && keys[16] && activeCanvas && loadedMovesDone) {
        // Must avoid conflicts with other movements
        if (!anim_Z &&
            !anim_F && !anim_Fi &&
            !anim_S && !anim_Si &&
            !anim_B && !anim_Bi &&
            !anim_L && !anim_Li &&
            !anim_M && !anim_Mi &&
            !anim_R && !anim_Ri &&
            !anim_U && !anim_Ui &&
            !anim_E && !anim_Ei &&
            !anim_D && !anim_Di &&
            !anim_Y && !anim_Yi &&
            !anim_X && !anim_Xi) {

            anim_Zi = true;
            changeCubeState = true;
        }
    }
}

function init() {



    // io
    var info = document.createElement('div');
    info.setAttribute("id", "canvasDiv");
    info.style.position = 'absolute';
    info.style.top = '30px';

    info.style.margin = "auto";
    info.style.textAlign = 'center';
    info.style.color = '#fff';
    info.style.backgroundColor = 'transparent';
    info.style.zIndex = '1';
    info.tabIndex = '1';


    document.body.appendChild(info);


    // ray-caster
    raycaster = new THREE.Raycaster();

    // renderer
    renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth , window.innerHeight );
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(250, 250, 350);


    // Scene ambient lighting (soft white)
    var light1 = new THREE.AmbientLight( 0x404040 , 5);
    scene.add(light1);

    // Axes helper for debugging 3d graphics sides
    var axesHelper = new THREE.AxesHelper( 500 );
    scene.add(axesHelper);

      // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0x0f0f0f,
        side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);

    // Cubie Prototype
    var geometry = new THREE.BoxGeometry(40,40,40);
    var material = new THREE.MeshLambertMaterial({color : 0xf0f0f0,
                                                  vertexColors : THREE.FaceColors});

    // Loads a Cube from JSON
    loadCubeJSON().done(function() {

        // Grabs the colors indicated from the loaded game cube
        var cube_colors = cubeData['gameLog']['gameCube']['colors'];
        var loadedGameEvents = cubeData['gameLog']['events'];

        // Extracts the face colors saved in file
        var front_color = new THREE.Color( cube_colors['FRONT_COLOR'] ); // Default Green : 0x009b48
        var back_color = new THREE.Color( cube_colors['BACK_COLOR'] );   // Default Blue : 0x0045ad
        var left_color = new THREE.Color( cube_colors['LEFT_COLOR'] );   // Default Orange : 0xff5900
        var right_color = new THREE.Color( cube_colors['RIGHT_COLOR'] ); // Default Red : 0xb90000
        var up_color = new THREE.Color( cube_colors['UP_COLOR'] );       // Default White : 0xffffff
        var down_color = new THREE.Color( cube_colors['DOWN_COLOR'] );   // Default Yellow : 0xffd500

        // Assembles a color vector for painting the faces
        colors = [ right_color, left_color, up_color, down_color, front_color, back_color ];

        // Constructs the 27 cubies
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
                }
            }
        }

        activeCanvas = true;
        console.log(`Pre-loaded game events:`)
        var e_idx = 0

        function loadedEventsLoop() {
            setTimeout(
                function() {

                    var loaded_event = loadedGameEvents[e_idx];
                    var e_type = loaded_event['type'];

                    console.log(e_type)

                    if (e_type == "L") {
                        anim_L = true;
                    }
                    else if (e_type == "Li") {
                        anim_Li = true;
                    }
                    else if (e_type == "M") {
                        anim_M = true;
                    }
                    else if (e_type == "Mi") {
                        anim_Mi = true;
                    }
                    else if (e_type == "R") {
                        anim_R = true;
                    }
                    else if (e_type == "Ri") {
                        anim_Ri = true;
                    }
                    else if (e_type == "U") {
                        anim_U = true;
                    }
                    else if (e_type == "Ui") {
                        anim_Ui = true;
                    }
                    else if (e_type == "E") {
                        anim_E = true;
                    }
                    else if (e_type == "Ei") {
                        anim_Ei = true;
                    }
                    else if (e_type == "D") {
                        anim_D = true;
                    }
                    else if (e_type == "Di") {
                        anim_Di = true;
                    }
                    else if (e_type == "F") {
                        anim_F = true;
                    }
                    else if (e_type == "Fi") {
                        anim_Fi = true;
                    }
                    else if (e_type == "S") {
                        anim_S = true;
                    }
                    else if (e_type ==  "Si") {
                        anim_Si = true;
                    }
                    else if (e_type == "B") {
                        anim_B = true;
                    }
                    else if (e_type == "Bi") {
                        anim_Bi = true;
                    }
                    else if (e_type == "X") {
                        anim_X = true;
                    }
                    else if (e_type == "Xi") {
                        anim_Xi = true;
                    }
                    else if (e_type == "Y") {
                        anim_Y = true;
                    }
                    else if (e_type == "Yi") {
                        anim_Yi = true;
                    }
                    else if (e_type == "Z") {
                        anim_Z = true;
                    }
                    else if (e_type == "Zi") {
                        anim_Zi = true;
                    }

                    // Recursive calls to delayed loop (250ms per iteration)
                    e_idx++;
                    if ( e_idx < loadedGameEvents.length ) {
                        loadedEventsLoop();
                    }
                    else {
                        // Only gives the user control after an aditional 500 ms
                        setTimeout( function() { loadedMovesDone = true; }, 500);
                    }
                },
            250);
        }
        loadedEventsLoop();



    });





    // Camera rotating around centered cube controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.update();

    document.addEventListener("click", checkToSetActiveCanvas, false);



    // Listens for keyboard button presses
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("keyup", function (e) {
                                            keys[e.keyCode] = false;
                                        },false);



    camera.lookAt( scene.position );
}



// render
function render() {

    //revolve_around_Y_axis(camera, 0.2)
    renderer.render(scene, camera);
}


function animateLayers() {

    turn_left_layer();
    turn_left_layer_inverse();
    turn_middle_layer();
    turn_middle_layer_inverse();
    turn_right_layer();
    turn_right_layer_inverse();

    turn_up_layer();
    turn_up_layer_inverse();
    turn_equator_layer();
    turn_equator_layer_inverse();
    turn_down_layer();
    turn_down_layer_inverse();

    turn_front_layer();
    turn_front_layer_inverse();
    turn_standing_layer();
    turn_standing_layer_inverse();
    turn_back_layer();
    turn_back_layer_inverse();

    turn_roll();
    turn_roll_inverse();
    turn_yaw();
    turn_yaw_inverse();
    turn_pitch();
    turn_pitch_inverse();

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


// animate
function animate() {
  animateLayers();
  controls.update();
  //changeFaceColors();
  requestAnimationFrame(animate);
  render();
}