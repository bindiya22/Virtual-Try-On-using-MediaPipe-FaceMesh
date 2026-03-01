// /*import * as THREE from '../node_modules/three/build/three.module.js';
// import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';*/

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import Webcam from 'webcam-easy';


// const webcamElement = document.getElementById('webcam');
// const canvasElement = document.getElementById('canvas');
// const webcam = new Webcam(webcamElement, 'user');
// let selectedglasses = $(".selected-glasses img");
// let isVideo = false;
// let model = null;
// let cameraFrame = null;
// let detectFace = false;
// let clearglasses = false;
// let glassesOnImage = false;
// let glassesArray = [];
// let scene;
// let camera;
// let renderer;
// let obControls;
// let glassesKeyPoints = {midEye:168, leftEye:143, noseBottom:2, rightEye:372};

// $( document ).ready(function() {
//     setup3dScene();
//     setup3dCamera();
//     setup3dGlasses();
// });

// $("#webcam-switch").change(function () {
//     if(this.checked){
//         $('.md-modal').addClass('md-show');
//         webcam.start()
//             .then(result =>{
//                 console.log("webcam started"); 
//                 isVideo = true;
//                 cameraStarted();
//                 switchSource();                            
//                 glassesOnImage = false;
//                 startVTGlasses();
//             })
//             .catch(err => {
//                 displayError();
//             });
//     }
//     else {      
//         webcam.stop();
//         if(cameraFrame!= null){
//             clearglasses = true;
//             detectFace = false;
//             cancelAnimationFrame(cameraFrame);
//         }
//         isVideo = false;
//         switchSource();
//         cameraStopped(); 
//         console.log("webcam stopped");
//     }        
// });

// $("#arrowLeft").click(function () {
//     let itemWidth = parseInt($("#glasses-list ul li").css("width")) 
//                     + parseInt($("#glasses-list ul li").css("margin-left")) 
//                     + parseInt($("#glasses-list ul li").css("margin-right"));
//     let marginLeft = parseInt($("#glasses-list ul").css("margin-left"));
//     $("#glasses-list ul").css({"margin-left": (marginLeft+itemWidth) +"px", "transition": "0.3s"});
// });

// $("#arrowRight").click(function () {
//     let itemWidth = parseInt($("#glasses-list ul li").css("width")) 
//     + parseInt($("#glasses-list ul li").css("margin-left")) 
//     + parseInt($("#glasses-list ul li").css("margin-right"));
//     let marginLeft = parseInt($("#glasses-list ul").css("margin-left"));
//     $("#glasses-list ul").css({"margin-left": (marginLeft-itemWidth) +"px", "transition": "0.3s"});
// });

// $("#glasses-list ul li").click(function () {
//     $(".selected-glasses").removeClass("selected-glasses");
//     $(this).addClass("selected-glasses");
//     selectedglasses = $(".selected-glasses img");
//     clearCanvas();
//     if(!isVideo){
//         setup3dGlasses();
//         setup3dAnimate();
//     }
// });

// $('#closeError').click(function() {
//     $("#webcam-switch").prop('checked', false).change();
// });

// async function startVTGlasses() {
//     return new Promise((resolve, reject) => {
//         $(".loading").removeClass('d-none');
//         faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh).then(mdl => { 
//             model = mdl;            
//             console.log("model loaded");
//             if(isVideo && webcam.facingMode == 'user'){
//                 detectFace = true;
//             }
            
//             cameraFrame =  detectFaces().then(() => {
//                 $(".loading").addClass('d-none');
//                 resolve();
//             }); 
//         })
//         .catch(err => {
//             displayError('Fail to load face mesh model<br/>Please refresh the page to try again');
//             reject(error);
//         });
//     });
// }

// async function detectFaces() {
//     let inputElement = webcamElement;
//     let flipHorizontal = !isVideo;
    
//     await model.estimateFaces
//     ({
//         input: inputElement,
//         returnTensors: false,
//         flipHorizontal: flipHorizontal,
//         predictIrises: false
//     }).then(faces => {
//         //console.log(faces);
//         drawglasses(faces).then(() => {
//             if(clearglasses){
//                 clearCanvas();
//                 clearglasses = false;
//             }
//             if(detectFace){
//                 cameraFrame = requestAnimFrame(detectFaces);
//             }
//         });
//     });
// }

// async function drawglasses(faces){
//     if(isVideo && (glassesArray.length != faces.length) ){
//         clearCanvas();
//         for (let j = 0; j < faces.length; j++) {
//             await setup3dGlasses();
//         }
//     }   

//     for (let i = 0; i < faces.length; i++) {
//         let glasses = glassesArray[i];
//         let face = faces[i];
//         if(typeof glasses !== "undefined" && typeof face !== "undefined")
//         {
//             let pointMidEye = face.scaledMesh[ glassesKeyPoints.midEye ];
//             let pointleftEye = face.scaledMesh[ glassesKeyPoints.leftEye ];
//             let pointNoseBottom = face.scaledMesh[ glassesKeyPoints.noseBottom ];
//             let pointrightEye = face.scaledMesh[ glassesKeyPoints.rightEye ];

//             glasses.position.x = pointMidEye[ 0 ];
//             glasses.position.y = -pointMidEye[ 1 ] + parseFloat(selectedglasses.attr("data-3d-up"));
//             glasses.position.z = -camera.position.z + pointMidEye[ 2 ];

//             glasses.up.x = pointMidEye[ 0 ] - pointNoseBottom[ 0 ];
//             glasses.up.y = -( pointMidEye[ 1 ] - pointNoseBottom[ 1 ] );
//             glasses.up.z = pointMidEye[ 2 ] - pointNoseBottom[ 2 ];
//             const length = Math.sqrt( glasses.up.x ** 2 + glasses.up.y ** 2 + glasses.up.z ** 2 );
//             glasses.up.x /= length;
//             glasses.up.y /= length;
//             glasses.up.z /= length;

//             const eyeDist = Math.sqrt(
//                 ( pointleftEye[ 0 ] - pointrightEye[ 0 ] ) ** 2 +
//                 ( pointleftEye[ 1 ] - pointrightEye[ 1 ] ) ** 2 +
//                 ( pointleftEye[ 2 ] - pointrightEye[ 2 ] ) ** 2
//             );
//             glasses.scale.x = eyeDist * parseFloat(selectedglasses.attr("data-3d-scale")) ;
//             glasses.scale.y = eyeDist * parseFloat(selectedglasses.attr("data-3d-scale")) ;
//             glasses.scale.z = eyeDist * parseFloat(selectedglasses.attr("data-3d-scale")) ;

//             glasses.rotation.y = Math.PI;
//             glasses.rotation.z = Math.PI / 2 - Math.acos( glasses.up.x );
            
//             renderer.render(scene, camera);
//         }
//     }
// }


// function clearCanvas(){
//     for( var i = scene.children.length - 1; i >= 0; i--) { 
//         var obj = scene.children[i];
//         if(obj.type=='Group'){
//             scene.remove(obj);
//         }
//     }
//     renderer.render(scene, camera);
//     glassesArray = [];
// }

// function switchSource(){
//     clearCanvas();
//     let containerElement
//     if(isVideo){
//         containerElement = $("#webcam-container");
//     }else{
//         containerElement = $("#image-container");
//         setup3dGlasses();
//     }
//     setup3dCamera();
//     $("#canvas").appendTo(containerElement);
//     $(".loading").appendTo(containerElement);
//     $("#glasses-slider").appendTo(containerElement);
// }

// function setup3dScene(){
//     scene = new THREE.Scene();
//     renderer = new THREE.WebGLRenderer({
//         canvas: canvasElement,
//         alpha: true
//     });
//     //light
//     var frontLight = new THREE.SpotLight( 0xffffff, 0.3 );
//     frontLight.position.set( 10, 10, 10 );
//     scene.add( frontLight );
//     var backLight = new THREE.SpotLight( 0xffffff, 0.3  );
//     backLight.position.set( 10, 10, -10)
//     scene.add(backLight);
// }
    

// function setup3dCamera(){  
//     if(isVideo){
//         camera = new THREE.PerspectiveCamera( 45, 1, 0.1, 2000 );
//         let videoWidth = webcamElement.width;
//         let videoHeight = webcamElement.height;
//         camera.position.x = videoWidth / 2;
//         camera.position.y = -videoHeight / 2;
//         camera.position.z = -( videoHeight / 2 ) / Math.tan( 45 / 2 ); 
//         camera.lookAt( { x: videoWidth / 2, y: -videoHeight / 2, z: 0, isVector3: true } );
//         renderer.setSize(videoWidth, videoHeight);
//         renderer.setClearColor(0x000000, 0);
//     }
//     else{  
//         camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//         camera.position.set(0, 0, 1.5);
//         camera.lookAt(scene.position);
//         renderer.setSize( window.innerWidth, window.innerHeight );
//         renderer.setClearColor( 0x3399cc, 1 ); 
//         obControls = new OrbitControls(camera, renderer.domElement);  
//     }
//     let cameraExists = false;
//     scene.children.forEach(function(child){
//         if(child.type=='PerspectiveCamera'){
//             cameraExists = true;
//         }
//     });
//     if(!cameraExists){
//         camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );
//         scene.add( camera );
//     }
//     setup3dAnimate();
// }

// async function setup3dGlasses(){
//     return new Promise(resolve => {
//         var threeType = selectedglasses.attr("data-3d-type");
//         if(threeType == 'gltf'){
//             var gltfLoader = new GLTFLoader();
//             gltfLoader.setPath(selectedglasses.attr("data-3d-model-path"));
//             gltfLoader.load( selectedglasses.attr("data-3d-model"), function ( object ) {
//                 object.scene.position.set(selectedglasses.attr("data-3d-x"), selectedglasses.attr("data-3d-y"), selectedglasses.attr("data-3d-z"));
//                 var scale = selectedglasses.attr("data-3d-scale");
//                 if(window.innerWidth < 480){
//                     scale = scale * 0.5;
//                 }
//                 object.scene.scale.set(scale, scale,scale);
//                 scene.add( object.scene );
//                 glassesArray.push(object.scene);
//                 resolve('loaded');        
//             });
//         }
//     });
// }

// var setup3dAnimate = function () {
//     if(!isVideo){
//         requestAnimationFrame( setup3dAnimate );
//         obControls.update();
//     }
//     renderer.render(scene, camera);
// };

/* full updated file with improved scaling, GLOBAL_SCALE and calibration wiring */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Webcam from 'webcam-easy';

const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user');

let selectedglasses = $(".selected-glasses img");
let isVideo = false;
let model = null;
let cameraFrame = null;
let detectFace = false;
let clearglasses = false;
let glassesOnImage = false;
let glassesArray = [];
let prevTransforms = []; // per-model smoothing state
const SMOOTHING_ALPHA = 0.6; // 0..1, higher = slower updates (more smoothing)
const GLOBAL_SCALE = 1.0; // increase to scale models globally (e.g. 1.5, 2.0)

let scene;
let camera;
let renderer;
let obControls;

// key landmark indices (mediapipe facemesh). Adjust if you need other points.
let glassesKeyPoints = {
    midEye: 168, // approximate midpoint between eyes
    leftEyeInner: 133, // inner corner left
    leftEyeOuter: 33, // outer corner left
    rightEyeInner: 362,
    rightEyeOuter: 263,
    leftEyeCenter: 145,
    rightEyeCenter: 374,
    noseTop: 6,
    noseBottom: 2,
    leftTemple: 127,
    rightTemple: 356
};

$(document).ready(function () {
    setup3dScene();
    setup3dCamera();
    setup3dGlasses();
});

/* UI wiring */
$("#webcam-switch").change(function () {
    if (this.checked) {
        $('.md-modal').addClass('md-show');
        webcam.start()
            .then(result => {
                console.log("webcam started");
                isVideo = true;
                cameraStarted();
                switchSource();
                glassesOnImage = false;
                startVTGlasses();
            })
            .catch(err => {
                displayError();
            });
    } else {
        webcam.stop();
        if (cameraFrame != null) {
            clearglasses = true;
            detectFace = false;
            cancelAnimationFrame(cameraFrame);
        }
        isVideo = false;
        switchSource();
        cameraStopped();
        console.log("webcam stopped");
    }
});

$("#glasses-list ul li").click(function () {
    $(".selected-glasses").removeClass("selected-glasses");
    $(this).addClass("selected-glasses");
    selectedglasses = $(".selected-glasses img");
    clearCanvas();
    if (!isVideo) {
        setup3dGlasses();
        setup3dAnimate();
    }
});

/* start model + detection */
async function startVTGlasses() {
    return new Promise((resolve, reject) => {
        $(".loading").removeClass('d-none');
        faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh)
            .then(mdl => {
                model = mdl;
                console.log("face mesh model loaded");
                if (isVideo && webcam.facingMode == 'user') {
                    detectFace = true;
                }
                // start detection loop
                cameraFrame = detectFaces().then(() => {
                    $(".loading").addClass('d-none');
                    resolve();
                });
            })
            .catch(err => {
                displayError('Fail to load face mesh model<br/>Please refresh the page to try again');
                reject(err);
            });
    });
}

async function detectFaces() {
    try {
        const inputElement = webcamElement;
        const flipHorizontal = !isVideo;

        await model.estimateFaces({
            input: inputElement,
            returnTensors: false,
            flipHorizontal: flipHorizontal,
            predictIrises: true // enable for more accurate eye centers when available
        }).then(async faces => {
            await drawglasses(faces);
            if (clearglasses) {
                clearCanvas();
                clearglasses = false;
            }
            if (detectFace) {
                cameraFrame = requestAnimFrame(detectFaces);
            }
        });
    } catch (e) {
        console.warn("detectFaces error", e);
    }
}

/* Main alignment: compute transform from landmarks, apply smoothing */
async function drawglasses(faces) {
    // ensure one model per face
    if (isVideo && (glassesArray.length != faces.length)) {
        clearCanvas();
        prevTransforms = [];
        for (let j = 0; j < faces.length; j++) {
            await setup3dGlasses();
            prevTransforms.push({
                position: new THREE.Vector3(),
                quaternion: new THREE.Quaternion(),
                scale: 1
            });
        }
    }

    for (let i = 0; i < faces.length; i++) {
        const glasses = glassesArray[i];
        const face = faces[i];
        if (typeof glasses === "undefined" || typeof face === "undefined") continue;

        // choose robust points: left/right eye outer corners and nose bridge/mid-eye
        const lm = face.scaledMesh;

        const midEyePt = lm[glassesKeyPoints.midEye] || lm[glassesKeyPoints.leftEyeCenter] || lm[glassesKeyPoints.rightEyeCenter];
        const leftOuter = lm[glassesKeyPoints.leftEyeOuter] || lm[glassesKeyPoints.leftEyeInner];
        const rightOuter = lm[glassesKeyPoints.rightEyeOuter] || lm[glassesKeyPoints.rightEyeInner];
        const noseTop = lm[glassesKeyPoints.noseTop] || lm[glassesKeyPoints.noseBottom];
        const noseBottom = lm[glassesKeyPoints.noseBottom] || noseTop;

        // convert to THREE coordinates (flip Y, invert Z)
        const mid = new THREE.Vector3(midEyePt[0], -midEyePt[1], -midEyePt[2]);
        const left = new THREE.Vector3(leftOuter[0], -leftOuter[1], -leftOuter[2]);
        const right = new THREE.Vector3(rightOuter[0], -rightOuter[1], -rightOuter[2]);
        const nose = new THREE.Vector3(noseTop[0], -noseTop[1], -noseTop[2]);
        const noseB = new THREE.Vector3(noseBottom[0], -noseBottom[1], -noseBottom[2]);

        // read per-model offsets from attributes (editable in index.html)
        const offsetY = parseFloat(selectedglasses.attr("data-3d-up")) || 0;
        const offsetX = parseFloat(selectedglasses.attr("data-3d-x")) || 0;
        const offsetZ = parseFloat(selectedglasses.attr("data-3d-z")) || 0;
        const modelScaleAttr = parseFloat(selectedglasses.attr("data-3d-scale")) || 1;

        // compute target position in scene coordinates
        // camera.position.z is set so world coords line up with video px; preserve that relationship
        const targetPos = new THREE.Vector3(
            mid.x + offsetX,
            mid.y + offsetY,
            -camera.position.z + mid.z + offsetZ
        );

        // smoothing state for this model
        const prev = prevTransforms[i] || { position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), scale: 1 };

        // position lerp
        prev.position.lerp(targetPos, SMOOTHING_ALPHA);
        glasses.position.copy(prev.position);

        // Build orthonormal basis:
        // x axis => eye-to-eye (right - left)
        // y axis => (midEye - nose bridge) approximate up
        // z axis => forward = cross(x, y)
        const xAxis = new THREE.Vector3().subVectors(right, left).normalize();
        const approxUp = new THREE.Vector3().subVectors(mid, nose).normalize();
        let zAxis = new THREE.Vector3().crossVectors(xAxis, approxUp).normalize();

        // if zAxis degenerates (flat face), fallback using camera-facing Z
        if (zAxis.lengthSq() < 1e-6) {
            zAxis = new THREE.Vector3(0, 0, 1);
        }

        // re-orthonormalize y to ensure orthogonality
        const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

        // Build rotation matrix and convert to quaternion
        const rotMat = new THREE.Matrix4();
        rotMat.makeBasis(xAxis, yAxis, zAxis);
        const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMat);

        // optional model-specific tweak: many GLTFs are modeled facing -Z or with rotated origin.
        // If the model appears mirrored or inverted, tweak with a base rotation stored per-model data
        const baseRotX = parseFloat(selectedglasses.attr("data-3d-rot-x")) || 0;
        const baseRotY = parseFloat(selectedglasses.attr("data-3d-rot-y")) || 0;
        const baseRotZ = parseFloat(selectedglasses.attr("data-3d-rot-z")) || 0;
        if (baseRotX || baseRotY || baseRotZ) {
            const baseEuler = new THREE.Euler(THREE.MathUtils.degToRad(baseRotX), THREE.MathUtils.degToRad(baseRotY), THREE.MathUtils.degToRad(baseRotZ), 'XYZ');
            const baseQ = new THREE.Quaternion().setFromEuler(baseEuler);
            targetQuat.multiply(baseQ);
        }

        // slerp rotation for smoothness
        prev.quaternion.slerp(targetQuat, SMOOTHING_ALPHA);
        glasses.quaternion.copy(prev.quaternion);

        // use temples to compute frame width (more robust for sides)
        const leftTemple = lm[glassesKeyPoints.leftTemple] || leftOuter;
        const rightTemple = lm[glassesKeyPoints.rightTemple] || rightOuter;
        const templeLeftVec = new THREE.Vector3(leftTemple[0], -leftTemple[1], -leftTemple[2]);
        const templeRightVec = new THREE.Vector3(rightTemple[0], -rightTemple[1], -rightTemple[2]);
        const templeDist = templeLeftVec.distanceTo(templeRightVec);

        // existing eyeDist
        const eyeDist = left.distanceTo(right);

        // prefer temple distance for width if available; fallback to eyeDist
        const widthBase = (templeDist > 0.1) ? templeDist : eyeDist;

        // apply per-model scale and global multiplier; allow an extra yaw compensation factor
        // yawComp: reduce scale slightly when face is turned (helps fit on sides)
        let yawComp = 1.0;
        try {
            const camDir = new THREE.Vector3();
            camera.getWorldDirection(camDir);
            yawComp = 1.0 + Math.abs(xAxis.dot(camDir)) * 0.15;
        } catch (e) {
            yawComp = 1.0;
        }

        const targetScale = Math.max(widthBase * modelScaleAttr * GLOBAL_SCALE * yawComp, 0.0001);
        prev.scale = prev.scale + (targetScale - prev.scale) * SMOOTHING_ALPHA;
        glasses.scale.set(prev.scale, prev.scale, prev.scale);

        // save state
        prevTransforms[i] = prev;

        // final render for this frame
        renderer.render(scene, camera);
    }
}

/* clean scene */
function clearCanvas() {
    for (var i = scene.children.length - 1; i >= 0; i--) {
        var obj = scene.children[i];
        // remove loaded GLTF groups only (keeps camera/light)
        if (obj.type === 'Group' || obj.userData && obj.userData.isGlassesModel) {
            scene.remove(obj);
        }
    }
    renderer.render(scene, camera);
    glassesArray = [];
    prevTransforms = [];
}

/* handle switching between video/image */
function switchSource() {
    clearCanvas();
    let containerElement;
    if (isVideo) {
        containerElement = $("#webcam-container");
    } else {
        containerElement = $("#image-container");
        setup3dGlasses();
    }
    setup3dCamera();
    $("#canvas").appendTo(containerElement);
    $(".loading").appendTo(containerElement);
    $("#glasses-slider").appendTo(containerElement);
}

/* initialize three.js scene & lights */
function setup3dScene() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    // lights for realism
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    hemi.position.set(0, 200, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(0, 200, 100);
    dir.castShadow = true;
    scene.add(dir);

    // environment-like soft fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // enable shadows for contact realism (models must opt-in to cast/receive)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

/* camera: compute using actual video resolution and correct FOV math so projection matches video */
function setup3dCamera() {
    if (isVideo) {
        // prefer actual video pixel size
        const videoWidth = webcamElement.videoWidth || webcamElement.width || 640;
        const videoHeight = webcamElement.videoHeight || webcamElement.height || 480;
        const fovDeg = 45;
        camera = new THREE.PerspectiveCamera(fovDeg, videoWidth / videoHeight, 0.1, 2000);
        camera.position.x = videoWidth / 2;
        camera.position.y = -videoHeight / 2;
        const fovRad = THREE.MathUtils.degToRad(fovDeg);
        camera.position.z = -(videoHeight / 2) / Math.tan(fovRad / 2); // convert deg -> rad
        camera.lookAt(new THREE.Vector3(videoWidth / 2, -videoHeight / 2, 0));
        renderer.setSize(videoWidth, videoHeight);
        renderer.setClearColor(0x000000, 0);
    } else {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 1.5);
        camera.lookAt(scene.position);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x3399cc, 1);
        obControls = new OrbitControls(camera, renderer.domElement);
    }

    // ensure camera/light is in scene once
    let cameraExists = false;
    scene.children.forEach(function (child) {
        if (child.type == 'PerspectiveCamera') {
            cameraExists = true;
        }
    });
    if (!cameraExists) {
        camera.add(new THREE.PointLight(0xffffff, 0.8));
        scene.add(camera);
    }

    setup3dAnimate();
}

/* load GLTF model for selected item and apply initial per-model offsets */
async function setup3dGlasses() {
    return new Promise(resolve => {
        const threeType = selectedglasses.attr("data-3d-type");
        if (threeType === 'gltf') {
            const gltfLoader = new GLTFLoader();
            const modelPath = selectedglasses.attr("data-3d-model-path") || "";
            gltfLoader.setPath(modelPath);
            gltfLoader.load(selectedglasses.attr("data-3d-model"), function (gltf) {
                // parse numeric attributes (safe parse)
                const px = parseFloat(selectedglasses.attr("data-3d-x")) || 0;
                const py = parseFloat(selectedglasses.attr("data-3d-y")) || 0;
                const pz = parseFloat(selectedglasses.attr("data-3d-z")) || 0;
                let scale = parseFloat(selectedglasses.attr("data-3d-scale"));
                if (isNaN(scale)) scale = 1;
                if (window.innerWidth < 480) scale = scale * 0.5;

                // set initial transform: these are model-local tweaks you can tune in index.html
                gltf.scene.position.set(px, py, pz);
                gltf.scene.scale.set(scale, scale, scale);

                // enable shadows where appropriate
                gltf.scene.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                // mark as glasses model so clearCanvas can detect
                gltf.scene.userData = gltf.scene.userData || {};
                gltf.scene.userData.isGlassesModel = true;

                scene.add(gltf.scene);
                glassesArray.push(gltf.scene);

                // initialize smoothing state if missing
                if (!prevTransforms[glassesArray.length - 1]) {
                    prevTransforms.push({
                        position: new THREE.Vector3().copy(gltf.scene.position),
                        quaternion: new THREE.Quaternion().copy(gltf.scene.quaternion),
                        scale: scale
                    });
                }

                resolve('loaded');
            }, undefined, function (err) {
                console.warn("gltf load error", err);
                resolve('error');
            });
        } else {
            resolve('no-model');
        }
    });
}

/* render loop for non-video mode and keep single render call for video handling */
var setup3dAnimate = function () {
    if (!isVideo) {
        requestAnimationFrame(setup3dAnimate);
        if (obControls) obControls.update();
    }
    renderer.render(scene, camera);
};

/* Calibration UI helpers (index.html has #cal-* inputs) */
function openCalibration() {
    const img = selectedglasses;
    if (!img || img.length === 0) return;
    $("#calibration-panel").show();
    $("#cal-y").val(parseFloat(img.attr("data-3d-up")) || 0);
    $("#cal-x").val(parseFloat(img.attr("data-3d-x")) || 0);
    $("#cal-z").val(parseFloat(img.attr("data-3d-z")) || 0);
    $("#cal-scale").val(parseFloat(img.attr("data-3d-scale")) || 1);
}

function closeCalibration() {
    $("#calibration-panel").hide();
}
$("#cal-close").click(closeCalibration);
$("#cal-save").click(function () {
    const img = selectedglasses;
    if (!img || img.length === 0) return;
    img.attr("data-3d-up", $("#cal-y").val());
    img.attr("data-3d-x", $("#cal-x").val());
    img.attr("data-3d-z", $("#cal-z").val());
    img.attr("data-3d-scale", $("#cal-scale").val());
    // reload model transforms immediately
    clearCanvas();
    setup3dGlasses();
    closeCalibration();
});
// optional keyboard shortcut to open
$(document).keydown(e => {
    if (e.key === 'c') openCalibration();
});

/* export nothing (module loaded as script type=module in index.html) */