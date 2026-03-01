/*
var animationObserver = null;
var followCamera = null;
var paused = false;
var totalDistance = 0;
var cumulativeDistances = [];
var fullPath = [];
var currentDistance = 0;

function buildFullPath() {

    fullPath = [];

    for (let j = 0; j < arrayWayPoints.length - 1; j++) {

        let section;

        if (rdbtnFlyFlatdromic.checked) {
            section = Earth.isEnabled()
                ? arrayWayPoints[j].flatdromic.points
                : arrayWayPoints[j].flatdromic.pointsFE;
        }
        else if (rdbtnFlyLoxodromic.checked) {
            section = Earth.isEnabled()
                ? arrayWayPoints[j].loxodromic.points
                : arrayWayPoints[j].loxodromic.pointsFE;
        }
        else {
            section = Earth.isEnabled()
                ? arrayWayPoints[j].orthodromic.points
                : arrayWayPoints[j].orthodromic.pointsFE;
        }

        // Evitar duplicar punto inicial de cada tramo
        if (j > 0) section = section.slice(1);

        

        fullPath = fullPath.concat(section);
    }

    // Construir distancias acumuladas
    cumulativeDistances = [0];
    totalDistance = 0;
 

    for (let i = 1; i < fullPath.length; i++) {
        totalDistance += BABYLON.Vector3.Distance(fullPath[i - 1], fullPath[i]);
        cumulativeDistances.push(totalDistance);
    }
}

function fly() {

    if (arrayWayPoints.length < 2) {
        alert("No hay ruta trazada");
        return;
    }

    buildFullPath();

    airplane.setEnabled(true);

    currentDistance = 0;
    paused = false;

    // Cámara
    if (followCamera) followCamera.dispose();

    followCamera = new BABYLON.FollowCamera(
        "FollowCam",
        airplane.position.clone(),
        scene
    );

    followCamera.lockedTarget = airplane;
    followCamera.radius = 3;
    followCamera.heightOffset = 2;
    followCamera.rotationOffset = -90;
    followCamera.cameraAcceleration = 0.1;
    followCamera.maxCameraSpeed = 100;

    const speed = parseFloat(sldAverageSpeed.value) * 0.005;

    if (animationObserver) {
        scene.onBeforeRenderObservable.remove(animationObserver);
    }

    animationObserver = scene.onBeforeRenderObservable.add(() => {

        if (paused) return;

        let delta = engine.getDeltaTime() / 1000;
        currentDistance += speed * delta;

        if (currentDistance >= totalDistance) {
            stopAnimation();
            return;
        }

        // --- Encontrar segmento actual ---
        let i = 1;
        while (i < cumulativeDistances.length && cumulativeDistances[i] < currentDistance) {
            i++;
        }

        if (i >= cumulativeDistances.length) return;

        let d1 = cumulativeDistances[i - 1];
        let d2 = cumulativeDistances[i];

        let t = (currentDistance - d1) / (d2 - d1);

        let p1 = fullPath[i - 1];
        let p2 = fullPath[i];

        //------------------------------------------------------------------------------------------
        // la variable i sirve además para recorrer el arrayWayPoints y actualizar la info de cada tramo
        //-------------------------------------------------------------------------------------------



        // --- Posición interpolada ---
        airplane.position = BABYLON.Vector3.Lerp(p1, p2, t);

        // --- Orientación correcta (forward en +X del modelo) ---
        let forward = p2.subtract(p1);
        if (forward.lengthSquared() === 0) return;
        forward = forward.normalize();

        let up = Earth.isEnabled() ? airplane.position.normalize() : new BABYLON.Vector3(0, 1, 0);

        // Quaternion absoluto que apunta +X local hacia 'forward' y usa 'up'
        let q = BABYLON.Quaternion.FromLookDirectionLH(forward, up);

        // Aplicar offset del modelo si existe (definido al cargar el mesh)
        if (airplane && airplane.modelOrientationOffset) {
            // Aplicar primero la orientación base del modelo y luego la
            // rotación que apunta hacia la dirección de vuelo.
            airplane.rotationQuaternion = airplane.modelOrientationOffset.multiply(q);
        } else {
            airplane.rotationQuaternion = q;
        }

        // --- Actualizar info ---
        let posLL = Earth.isEnabled()
            ? vector3ToLatLng(airplane.position)
            : vector3FEToLatLng(airplane.position);

        infoPositionLat.innerHTML = toGMS(posLL.lat);
        infoPositionLng.innerHTML = toGMS(posLL.lng);
    });
}


function pauseAnimation() {
    paused = !paused;
}

function stopAnimation() {

    if (animationObserver) {
        scene.onBeforeRenderObservable.remove(animationObserver);
        animationObserver = null;
    }

    airplane.setEnabled(false);


    if (followCamera) {
        followCamera.dispose();
        followCamera = null;
    }

    paused = false;
}

*/

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//------------     CODIGO VIEJO DE BACKUP         ---------------------------------------------------------------------------------------------------------------------------------------------------------

var flyAnimation; 
var camFlyAnimation; 
var infoObserver; // usado por fly() para actualizar datos y poderlo remover desde fuera
var isFlying = false; // flag para evitar llamadas concurrentes
var btnPauseAnimation = document.getElementById("btnPauseAnimation"); 
var btnResetAnimation = document.getElementById("btnResetAnimation"); 
var btnStopAnimation = document.getElementById("btnStopAnimation"); 
var paused = false; 
var xAirplaneNormal = document.getElementById("xAirplaneNormal"); 
var yAirplaneNormal = document.getElementById("yAirplaneNormal"); 
var zAirplaneNormal = document.getElementById("zAirplaneNormal"); 
var xCamNormal = document.getElementById("xCamNormal"); 
var yCamNormal = document.getElementById("yCamNormal"); 
var zCamNormal = document.getElementById("zCamNormal"); 




btnPauseAnimation.onclick = function(){ 
    if (paused){ 
        flyAnimation.restart(); 
        camFlyAnimation.restart(); 
        paused = false; 
        btnPauseAnimation.innerHTML="PAUSA"; 
    } else { 
        flyAnimation.pause(); 
        camFlyAnimation.pause(); 
        paused = true; 
        btnPauseAnimation.innerHTML="REANUDAR"; 
    } 
} 

btnResetAnimation.onclick = function(){ 
    flyAnimation.reset(); 
    camFlyAnimation.reset(); 
} 

btnStopAnimation.onclick = function(){ 
    // detener cualquier animación en curso
    if (flyAnimation){ flyAnimation.reset(); flyAnimation.stop(); }
    if (camFlyAnimation){ camFlyAnimation.reset(); camFlyAnimation.stop(); }
    // quitar observador informativo si existe
    if (infoObserver){
        scene.onBeforeRenderObservable.remove(infoObserver);
        infoObserver = null;
    }
    document.getElementById("infoTrackTextBox").style.display = "none"; 
    document.getElementById("animationMenu").style.display = "none"; 
    document.getElementById("menu").style.display = "flex"; 
    airplane.setEnabled(false);
    paused = false; btnPauseAnimation.innerHTML="PAUSA"; 
    isFlying = false;
} 

async function fly(){ 
    if (isFlying) return; // evitar llamadas múltiples
    isFlying = true;
    //validar que haya una ruta 
    if (arrayWayPoints.length<2){ 
        alert("No hay ruta trazada"); 
        isFlying = false;
        return; 
    } 
    
    document.getElementById("infoTextBox").style.display = "block";
    document.getElementById("infoTable").style.display = "none"; 
    document.getElementById("infoTrackTextBox").style.display = "block"; 
    document.getElementById("animationMenu").style.display = "flex"; 
    document.getElementById("menu").style.display = "none"; 
    const frameRate = 20; 
    let track = []; 
    let initialNormalVector; 

    //infoStartFligthLat.innerHTML = toGMS(arrayWayPoints[0].P.lat); 
    //infoStartFligthLng.innerHTML = toGMS(arrayWayPoints[0].P.lng); 
    //infoEndFligthLat.innerHTML = toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lat); 
    //infoEndFligthLng.innerHTML = toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lng); 
    
    airplane.setEnabled(true); 
    airplane.animations = []; 
    if (Earth.isEnabled()){ 
        // CAMERA Parameters: name, alpha, beta, radius, target position, scene 
        followCamera = new BABYLON.FlyCamera("FollowCam", new BABYLON.Vector3(0, 7, 0), scene); 
        followCamera.fov = 0.9; 
    } else { 
        // Parameters: name, position, scene 
        followCamera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 1, 0), scene); 
        // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5 
        // targetMesh created here. 
        // followCamera.target = airplane; // version 2.4 and earlier 
        followCamera.lockedTarget = airplane; 
        //version 2.5 onwards followCamera.fov = 0.8; 
        // // The goal distance of camera from target 
        followCamera.radius = 3; 
        // The goal height of camera above local origin (centre) of target 
        followCamera.heightOffset = 2; 
        // The goal rotation of camera around local origin (centre) of target in x y plane 
        followCamera.rotationOffset = -90; 
        // Acceleration of camera in moving from current to goal position 
        followCamera.cameraAcceleration = 0.1; 
        // The speed at which acceleration is halted 
        followCamera.maxCameraSpeed = 100; 
    } 
    
    followCamera.minZ = 0; 
    // MULTIVIEW 
    // // Two Viewports 
    camera.viewport = new BABYLON.Viewport(0, 0, 1, 1); 
    followCamera.viewport = new BABYLON.Viewport(0.69, 0.69,0.3, 0.3); 
    let sectionDist; 
    let vaux; 
    let path3d; 
    var tangents; 
    var normals; 
    var binormals; 
    var curvePath; 
    var aiplanePositionInLatLng; 
    var j = 0; 
    
// registrar un solo observador que actualiza información durante el vuelo
    infoObserver = scene.onBeforeRenderObservable.add(function(theScene){
        //console.log(j);
       // console.log(rdbtnFlyLoxodromic.checked);
        if (airplane.isEnabled()){
            if (Earth.isEnabled()){
                aiplanePositionInLatLng = vector3ToLatLng(airplane.position);
                infoCourse.innerHTML = rdbtnFlyLoxodromic.checked
                    ? toGMS(arrayWayPoints[j].loxodromic.initialLoxoCourse)
                    : toGMS(getCourse(airplane.position,airplane.right));
                
                
                //toGMS(getCourse(airplane.position,airplane.right));
            } else {
                aiplanePositionInLatLng = vector3FEToLatLng(airplane.position);
                infoCourse.innerHTML = rdbtnFlyLoxodromic.checked
                    ? toGMS(arrayWayPoints[j].loxodromic.initialLoxoCourse)
                    : toGMS(getCourseFE(airplane.position,airplane.right));
            }

            infoPositionLat.innerHTML = toGMS(aiplanePositionInLatLng.lat);
            infoPositionLng.innerHTML = toGMS(aiplanePositionInLatLng.lng);
        } else {
            // no quitar aquí, se hará al finalizar el bucle
        }
    });

    while (j<arrayWayPoints.length-1){ 
        // limpiar animaciones acumuladas antes de iniciar el tramo
        airplane.animations = [];
        if (Earth.isEnabled()){
            followCamera.animations = [];
        }
        // reiniciar track y orientación para evitar acoplamiento entre tramos
        track = [];
        if (airplane){
            if (airplane.modelOrientationOffset){
                airplane.rotationQuaternion = airplane.modelOrientationOffset.clone();
            } else {
                airplane.rotationQuaternion = BABYLON.Quaternion.Identity();
            }
        }

        infoSectionStartLat.innerHTML = toGMS(arrayWayPoints[j].P.lat); 
        infoStartSectionLng.innerHTML = toGMS(arrayWayPoints[j].P.lng); 
        infoEndSectionLat.innerHTML = toGMS(arrayWayPoints[j+1].P.lat); 
        infoEndSectionLng.innerHTML = toGMS(arrayWayPoints[j+1].P.lng); 
        let travel = new BABYLON.Animation("travelAnimation", "position", 
            frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE); 
        let rotation = new BABYLON.Animation("rotationAnimation", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE); 
        var initialCourse = ""; 

        //---------------------------
        //console.log(distanciaLoxodromica(arrayWayPoints[j].P,arrayWayPoints[j+1].P));

        //-----------------------------
        
        if (rdbtnFlyFlatdromic.checked){ 
            infoSection.innerHTML = "VIAJANDO POR FLATDRÓMICA - TRAMO " + (j+1); 
            
            if (Earth.isEnabled()){ 
                track = arrayWayPoints[j].flatdromic.points; 
                sectionDist = arrayWayPoints[j].flatdromic.distance.toFixed(2); 
            } else { 
                for (var i=0; i <arrayWayPoints[j].flatdromic.pointsFE.length; i++){ 
                    vaux = arrayWayPoints[j].flatdromic.pointsFE[i]; 
                    track.push(vaux.multiply(scaling)); 
                } 
                
                vaux = arrayWayPoints[j].flatdromic.distanceFE * scaling.x; 
                sectionDist = vaux.toFixed(2); 
            } 
             infoInitialCourse.innerHTML = toGMS(arrayWayPoints[j].flatdromic.initialFlatCourse) ;
            infoSection.style.color= "yellow";

        } else if(rdbtnFlyLoxodromic.checked){ 

            infoSection.innerHTML = "VIAJANDO POR LOXODRÓMICA - TRAMO " + (j+1); 
            infoInitialCourse.innerHTML = toGMS(arrayWayPoints[j].loxodromic.initialLoxoCourse);
            if (Earth.isEnabled()){ 
                track = arrayWayPoints[j].loxodromic.points; 
                sectionDist = arrayWayPoints[j].loxodromic.distance.toFixed(2); 
            } else { 
                for (var i=0; i <arrayWayPoints[j].loxodromic.pointsFE.length; i++){ 
                    vaux = arrayWayPoints[j].loxodromic.pointsFE[i]; 
                    track.push(vaux.multiply(scaling)); 
                } 
            vaux = arrayWayPoints[j].loxodromic.distanceFE * scaling.x; 
            sectionDist = vaux.toFixed(2); 
        } 
        
        infoSection.style.color= "red"; 
    
    } else { 
        infoSection.innerHTML = "VIAJANDO POR ORTODRÓMICA - TRAMO " + (j+1); 
         infoInitialCourse.innerHTML = toGMS(arrayWayPoints[j].orthodromic.initialOrthoCourse);
        if (Earth.isEnabled()){ 
            track = arrayWayPoints[j].orthodromic.points; 
            sectionDist = arrayWayPoints[j].orthodromic.distance.toFixed(2); 
        } else { 

            for (var i=0; i <arrayWayPoints[j].orthodromic.pointsFE.length; i++){ 
                vaux = arrayWayPoints[j].orthodromic.pointsFE[i]; 
                track.push(vaux.multiply(scaling)); 
            } 
            
            vaux = arrayWayPoints[j].orthodromic.distanceFE * scaling.x; 
            sectionDist = vaux.toFixed(2); 
        } 
        
        infoSection.style.color= "green"; 


    } 
    
    infoSectionDistance.innerHTML = sectionDist + " km"; 
    infoSectionFligthTime.innerHTML = (sectionDist/sldAverageSpeed.value).toFixed(2) + " horas, " + sldAverageSpeed.value + " km/h"; 
    
    if (Earth.isEnabled()){ 
        initialNormalVector = track[0]; 
    } else {
         initialNormalVector = new BABYLON.Vector3(0,1,0); 
        } 
        path3d = new BABYLON.Path3D(track, initialNormalVector); 
        // Transform the curves into a proper Path3D object and get its orientation information 
        //var path3d = new BABYLON.Path3D(curve.getPoints()); 
        tangents = path3d.getTangents(); 
        normals = path3d.getNormals(); 
        binormals = path3d.getBinormals(); 
        curvePath = path3d.getCurve(); 
        /*
        // visualisar triedros de Frenet
         let pathGroup = new BABYLON.Mesh("pathGroup"); 
        for(var p = 0; p < curvePath.length; p++) { 
            var tg = BABYLON.MeshBuilder.CreateLines('tg', {points: [ curvePath[p], curvePath[p].add(tangents[p]) ]}, scene); 
            tg.color = BABYLON.Color3.Red(); 
            tg.parent = pathGroup; 
            var no = BABYLON.MeshBuilder.CreateLines('no', {points: [ curvePath[p], curvePath[p].add(normals[p]) ]}, scene); 
            no.color = BABYLON.Color3.Blue(); 
            no.parent = pathGroup; 
            var bi = BABYLON.MeshBuilder.CreateLines('bi', {points: [ curvePath[p], curvePath[p].add(binormals[p]) ]}, scene); 
            bi.color = BABYLON.Color3.Green(); 
            bi.parent = pathGroup; } 
             */
           
            //----------------------Position animation ----------------------------------- 
       
            var keyFramesPos = []; 
            for (var i=0; i < curvePath.length ; i++){ 
                keyFramesPos.push({ frame: i, value: curvePath[i] }); 
            } 
            
            travel.setKeys(keyFramesPos); 
            
            //---------------------------------------------------------------------------- 
            // //----------------------Rotation animation ----------------------------------- 
        
            var keyFramesRot = []; 
            for (var i=0; i < curvePath.length ; i++){ 
                keyFramesRot.push({ frame: i, value: BABYLON.Vector3.RotationFromAxis(tangents[i], normals[i], binormals[i]) }); 
            } 
            rotation.setKeys(keyFramesRot); 
            airplane.animations.push(travel); 
            airplane.animations.push(rotation); 
            if (Earth.isEnabled()){ 
                followCamera.animations.push(travel); 
                followCamera.animations.push(rotation); 
            } 
            
            flyAnimation = scene.beginAnimation(airplane, 0, curvePath.length,false,sldAnimationSpeed.value); 
            if (Earth.isEnabled()){ 
                camFlyAnimation = scene.beginAnimation(followCamera, 0, curvePath.length,false,sldAnimationSpeed.value); 
            } 
            
            await flyAnimation.waitAsync(); 
            // si el usuario detuvo la animación, salir del bucle
            if (!isFlying){
                break;
            }
            // limpiar animaciones y detener cámara antes del próximo tramo
            flyAnimation.reset(); flyAnimation.stop(); 
            if (camFlyAnimation){ camFlyAnimation.reset(); camFlyAnimation.stop(); }
            j = j+1; 
        } 
        
        flyAnimation.reset(); 
        flyAnimation.stop(); 
        //camFlyAnimation.reset(); 
        camFlyAnimation.stop(); 
        document.getElementById("infoTable").style.display = "block"; 
        document.getElementById("infoTrackTextBox").style.display = "none"; 
        document.getElementById("animationMenu").style.display = "none"; 
        document.getElementById("menu").style.display = "flex"; 
        airplane.animations = []; 
        airplane.setEnabled(false); 
        if (followCamera) { followCamera.dispose(); }
        // quitar el observador informativo
        scene.onBeforeRenderObservable.remove(infoObserver);
        isFlying = false;
        }

        
//lienzo
var canvas=document.getElementById("canvas");
//controles cámara
var camera;
var sldAlpha = document.getElementById("sldAlpha");
var txtAlpha = document.getElementById("txtalpha");
var sldBeta = document.getElementById("sldBeta");
var txtBeta = document.getElementById("txtbeta");
var sldRadius = document.getElementById("sldRadius");
var txtRadius = document.getElementById("txtradius");
var sldFOV = document.getElementById("sldFOV");
var txtFOV = document.getElementById("txtFOV");

//cámaras de puntos de vista de observadores
var observer1;


// rotacion
var sldy = document.getElementById("sldy");
var txty = document.getElementById("txty");

//objects
var Earth;
var FlatEarth;
var Mercator;
var PosAxis;


//constantes
const earthRadius = 6371; //kilometros
const sunDistance = 149600000; //kilómetros
const flatEarthRadius = 20004; //kilómetros

const escala= 0.001;

//timer loader text
var timerLoaderText = setInterval(loadingText,2000);

var airplane;


window.onload = function() {

   document.getElementById("pageLoader").style.display = "none";
    //let b = document.getElementsByClassName("hidden");
    //b.classList.remove('hidden');
   document.body.classList.remove('hidden');
   document.getElementById("infoTextBox").style.display = "none";
   document.getElementById("animationMenu").style.display = "none";
   clearInterval(timerLoaderText);
   
}

function loadingText(){
   var loadingStrings = [
      "electromagnetizando el domo",
      "refractando rayos crepusculares",
      "inflando globo",
      "proyectando el mapa sobre una esfera ficticia",
      "conectando a NASA",
      "agregando bases militares antárticas",
      "aplicando punto de fuga a la fata morgana",
      "tratando de resolver la hipotenusa angular del tío eléctrico",
      "curvando agua",
      "poniendo de cabeza a los australianos",
      "descomponiendo los 9x3 ángulos interiores de un triángulo",
      "llenando tanques de combustible del avión con aire comprimido",
      "Ocultando edificios con paredes de agua",
      "triangulando antenas GPS",
      "satanizando satélites",
      "vectorizando CGI",
      "friendo empanadas",
      "bajando el morro del avión para seguir la curvatura",
      "calculando opasidá"

  ];

  var rand = loadingStrings[Math.floor(Math.random() * loadingStrings.length)];
   document.getElementById('loaderText').innerHTML = rand;
  
}

/*
//clona un objeto
function clone(obj){
   if ( obj === null || typeof obj  !== 'object' ) {
       return obj;
   }

   var temp = obj.constructor();
   for (var key in obj) {
       temp[key] = clone(obj[key]);
   }

   return temp;
}*/

var engine = new BABYLON.Engine(canvas, true);

var createScene  = function() {
   var scene = new BABYLON.Scene(engine);
   //scene.clearColor = new BABYLON.Color3(0, 0, 0.5);
 
   // CAMERA Parameters: name, alpha, beta, radius, target position, scene
   camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/2-0.05, (2*earthRadius+6500)*escala, new BABYLON.Vector3(0, 0, 0), scene);

   scene.activeCamera.attachControl(canvas);
   //camera.lowerRadiusLimit =(earthRadius)*escala*1.8;
   camera.upperRadiusLimit = (earthRadius)*escala*5;
   camera.wheelPrecision=20;
   //camera.upperBetaLimit = Math.PI;
   //camera.lowerBetaLimit = 0;
   camera.fov = 65*Math.PI/180;
   
   //camera.target
   

   // EJES
 /*
   var showAxis = function(size) {
      var makeTextPlane = function(text, color, size) {
         var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
         dynamicTexture.hasAlpha = true;
         dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
         
         var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
         plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
         plane.material.backFaceCulling = false;
         
         plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
         plane.material.diffuseTexture = dynamicTexture;
         return plane;
      };

      var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
         new BABYLON.Vector3(-size * 0.95, 0.05 * size, 0),
         new BABYLON.Vector3(-size, 0, 0), 
         new BABYLON.Vector3(-size * 0.95, -0.05 * size, 0),
         new BABYLON.Vector3(-size, 0, 0),
         new BABYLON.Vector3.Zero(), 
         new BABYLON.Vector3(size, 0, 0), 
         new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
         new BABYLON.Vector3(size, 0, 0), 
         new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
      
      axisX.color = new BABYLON.Color3(1, 0, 0);
      var xChar = makeTextPlane("X", "red", size / 10);
      xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

      var xChar1 = makeTextPlane("-X", "red", size / 10);
      xChar1.position = new BABYLON.Vector3(-0.9 * size, 0.05 * size, 0);

      var axisY = BABYLON.Mesh.CreateLines("axisY", [
         new BABYLON.Vector3( -0.05 * size, -size * 0.95, 0),
         new BABYLON.Vector3(0, -size, 0),
         new BABYLON.Vector3(0.05 * size, -size * 0.95, 0),
         new BABYLON.Vector3(0, -size, 0), 
         new BABYLON.Vector3.Zero(), 
         new BABYLON.Vector3(0, size, 0), 
         new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
         new BABYLON.Vector3(0, size, 0), 
         new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
      
      axisY.color = new BABYLON.Color3(0, 1, 0);
      var yChar = makeTextPlane("Y", "green", size / 5);
      yChar.position = new BABYLON.Vector3(1, 0.9 * size, -0.05 * size);
      var yChar1 = makeTextPlane("-Y", "green", size / 5);
      yChar1.position = new BABYLON.Vector3(1, -0.9 * size, 0.05 * size);

      var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
         new BABYLON.Vector3( 0 , -0.05 * size, -size * 0.95), 
         new BABYLON.Vector3(0, 0, -size),
         new BABYLON.Vector3( 0 , 0.05 * size, -size * 0.95),
         new BABYLON.Vector3(0, 0, -size), 
         new BABYLON.Vector3.Zero(), 
         new BABYLON.Vector3(0, 0, size), 
         new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
         new BABYLON.Vector3(0, 0, size), 
         new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
      
      axisZ.color = new BABYLON.Color3(0, 0, 1);
      var zChar = makeTextPlane("Z", "blue", size / 5);
      zChar.position = new BABYLON.Vector3(1, 0.05 * size, 0.9 * size);
      var zChar1 = makeTextPlane("-Z", "blue", size / 5);
      zChar1.position = new BABYLON.Vector3(1, 0.05 * size, -0.9 * size);

      var RotAxis = BABYLON.Mesh.CreateLines("RotAxis", [
         new BABYLON.Vector3( -0.05 * size, -size * 0.95, 0),
         new BABYLON.Vector3(0, -size, 0),
         new BABYLON.Vector3(0.05 * size, -size * 0.95, 0),
         new BABYLON.Vector3(0, -size, 0), 
         new BABYLON.Vector3.Zero(), 
         new BABYLON.Vector3(0, size, 0), 
         new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
         new BABYLON.Vector3(0, size, 0), 
         new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
    
      var yChar = makeTextPlane("Y", "Green", size / 10);
      yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
      var yChar1 = makeTextPlane("-Y", "Green", size / 10);
      yChar1.position = new BABYLON.Vector3(0, -0.9 * size, 0.05 * size);

   };
   showAxis((flatEarthRadius/2)*escala);
*/
   //-------------- END EJES --------------------

   // LUZ
   
   var light0 = new BABYLON.HemisphericLight("Sun", new BABYLON.Vector3(0, 0, sunDistance*escala), scene);
   light0.intensity = 0.7;
   

   //skySphere
   
   cielo = BABYLON.MeshBuilder.CreateSphere("cielo",{segments: 30, diameter: 12000, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
   var estrellas = new BABYLON.StandardMaterial("estrellas",scene);
   estrellas.diffuseTexture = new BABYLON.Texture("https://guilleoem.github.io/starmapHQ.jpg",scene);
   estrellas.disableLighting = true;
   estrellas.emissiveColor = new BABYLON.Color3(1, 1, 1);
   estrellas.diffuseTexture.uScale=1;
   estrellas.diffuseTexture.vScale=-1;
   cielo.material = estrellas;
   
   
   
   //TIERRA
   
   Earth = BABYLON.MeshBuilder.CreateSphere("Earth",{segments: 120, diameter: 2*earthRadius*escala}, scene);
   var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
   myMaterial.diffuseTexture = new BABYLON.Texture("https://guilleoem.github.io/earth.jpeg", scene);
   myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

   //myMaterial.specularPower=1000;
   myMaterial.alpha = 1;

   Earth.rotation.y = Math.PI;

   Earth.material = myMaterial;


   
   //FLATULANDIA
   
   const faceUV = [];
	faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0); //bottom
   faceUV[1] =	new BABYLON.Vector4(0, 0, 0, 0); //side
   faceUV[2] = new BABYLON.Vector4(0, 0, 1, 1); //top

   FlatEarth = BABYLON.MeshBuilder.CreateCylinder("Flatulandia", {tessellation: 90, height: 2*escala, diameter: 2*flatEarthRadius*escala, faceUV: faceUV}, scene);
   var FEMaterial = new BABYLON.StandardMaterial("FEMaterial", scene);
   FEMaterial.diffuseTexture = new BABYLON.Texture("https://guilleoem.github.io/FEGls.jpg", scene);
   FEMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
   //FEMaterial.specularPower=10000;
   FlatEarth.material = FEMaterial;

   FlatEarth.rotation.y = -Math.PI/2+0.014;
   FlatEarth.setEnabled(false);

   // MAPA MERCATOR como plano horizontal (ground) centrado en Y=0
   var mercatorSize = 2*flatEarthRadius*escala; // mismo diámetro que FlatEarth
   Mercator = BABYLON.MeshBuilder.CreateGround("Mercator", {width: mercatorSize, height: mercatorSize, subdivisions: 1, faceUV: faceUV}, scene);
   var MercatorMaterial = new BABYLON.StandardMaterial("MercatorMaterial", scene);
   MercatorMaterial.diffuseTexture = new BABYLON.Texture("https://guilleoem.github.io/Mercator.jpg", scene);
   MercatorMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
   MercatorMaterial.backFaceCulling = false;
   MercatorMaterial.disableLighting = true;
   Mercator.material = MercatorMaterial;
   Mercator.position.y = 0;
   Mercator.rotation.y = -Math.PI/2;
   Mercator.rotation.z = 0;
   Mercator.rotation.x = -Math.PI/2;
   Mercator.setEnabled(false);
  
   return scene;
 
};
var scene = createScene();

// Enable Collisions
//scene.collisionsEnabled = true;

//Then apply collisions and gravity to the active camera
camera.checkCollisions = true;
 //Set the ellipsoid around the camera (e.g. your player's size)
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
camera.collisionRadius = new BABYLON.Vector3(2, 2, 2);
//finally, say which mesh will be collisionable
Earth.checkCollisions = true;
FlatEarth.checkCollisions = true;
Mercator.checkCollisions = true;

//AEROPLANO (PORQUE VUELA SOBRE UN PLANO :V)  BORRAR ESTO DESPUÉS DE PROBAR QUE FUNCIONA EL MODELO
BABYLON.SceneLoader.ImportMesh(
    "",
    "https://guilleoem.github.io/",
    "qantasplane2.glb",
    scene,
    function (meshes) {

        const airplaneRoot = meshes.find(m => m.name === "__root__");

        airplaneRoot.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        airplaneRoot.setEnabled(false);

      // Ajuste de orientación inicial del modelo:
      // Si el forward del modelo no coincide con +X, definir aquí un quaternion
      // de compensación. Cambia los ángulos si el forward real es otro eje.
      // Ejemplo: rotar -90° en Y para pasar de +Z a +X.
      // El offset aplicado al modelo: ajustar para que el morro quede hacia +X
      // Si el avión sigue de cola, invertir 180° (ej: usar Math.PI/2).
      airplaneRoot.modelOrientationOffset = BABYLON.Quaternion.FromEulerAngles(0, Math.PI / 2, 0);

      // Aplicar la rotación inicial al mesh para que se vea correcto antes
      // de iniciar la animación.
      airplaneRoot.rotationQuaternion = airplaneRoot.modelOrientationOffset.clone();

      airplane = airplaneRoot;


    }
);

//marcador arrayWayPoints
var arrayWayPointsMaterial = new BABYLON.StandardMaterial("arrayWayPointsMaterial", scene);
arrayWayPointsMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
arrayWayPointsMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
arrayWayPointsMaterial.emissiveColor = BABYLON.Color3.Black();
arrayWayPointsMaterial.alpha = 0.4;


engine.runRenderLoop(function() {
   scene.render();
});

window.onresize = function() {
   engine.resize();
};


const xAxis = new BABYLON.Vector3(1,0,0);
const yAxis = new BABYLON.Vector3(0,1,0);
const zAxis = new BABYLON.Vector3(0,0,1);



//----------------------------------------------------------------------
//                                                                     -
//     CONVERSIONES ENTRE PUNTOS (LATLNG TO VECTOR3 TO VECTOR3FE)      -
//                                                                     -
//----------------------------------------------------------------------

//devuelve el vector unitario a partir de coordenadas esféricas
//-----------------------------------------------------------------------------------------------------------------------------------
function latLngToVector3(ll){  //ll es por latitud-longitud
var x,y,z
    //ll.lng=ll.lng-Earth.rotation.y*90/Math.PI;
    x = Math.cos(ll.lng*Math.PI/180)*Math.cos((ll.lat)*Math.PI/180);
    z =  Math.sin(ll.lng*Math.PI/180)*Math.cos((ll.lat)*Math.PI/180);
    y =  Math.sin((ll.lat)*Math.PI/180);
    return new BABYLON.Vector3(x,y,z);

}

//recibe un array de lat,lng y devuelve un array en x,y,z sobre globo

function arrayLatLngToArrayVector3(arrayLatLng){
    var aux = [];
    var copy = arrayLatLng.slice();
    for (var i = 0; i < arrayLatLng.length; i++){
        aux[i] = latLngToVector3(copy[i]);
        aux[i].x = aux[i].x * earthRadius * escala;
        aux[i].y = aux[i].y * earthRadius * escala;
        aux[i].z = aux[i].z * earthRadius * escala;
    }

    return aux;
}



//devuelve el vector sobre Flatulandia a partir de coordenadas esféricas
//-----------------------------------------------------------------------------------------------------------------------------------
function latLngToFEVector3(ll){
    let kmPerLat = flatEarthRadius/180; //km por cada grado de latitud
    let distFromPole = (90-ll.lat)*kmPerLat; //distancia en km desde el polo
    let vAux = new BABYLON.Vector3((90-ll.lat)/180,0,0);

    let matrix = BABYLON.Matrix.RotationAxis(yAxis,-ll.lng*Math.PI/180);
    let  rotated = BABYLON.Vector3.TransformCoordinates(vAux, matrix);
    rotated.x = rotated.x*flatEarthRadius*escala;
    rotated.y = 2*escala;
    rotated.z = rotated.z*flatEarthRadius*escala;
    return rotated;
}

//recibe un array de puntos en latlng y devuelve un array de vector3 en planilandia
function arrayLatLngToArrayFEVector3(arrayLatLng){

    let aux = arrayLatLng.map(x => latLngToFEVector3(x));

    return aux;
}

//devuelve el vector sobre Mercator a partir de latitud y longitud
function latLngToVectorMercator(ll){
    
    let coefM = 6.371;//earthRadius 
    return new BABYLON.Vector3(0.002*coefM, 
        Math.log(Math.tan(Math.PI/4 + ll.lat*Math.PI/360))*coefM,
        Math.PI*ll.lng*coefM/180);

};


//recibe un array de latlng y devuelve un array de puntos en coordenadas de Mercator
function arrayLatLngToMercator(arrayLatLng){
    let corte = 0;
    for (var i=0; i<arrayLatLng.length - 1; i++){
        if (arrayLatLng[i].lng - arrayLatLng[i+1].lng > 180 || arrayLatLng[i].lng - arrayLatLng[i+1].lng < -180){
            corte = i;
            break;
        }
    }
    
    //si no hay corte se devuelven dos arrays para evitar conflictos con line 1 y line2
    if (corte == 0){
        corte = Math.trunc(arrayLatLng.length/2);
    }

    let aux1 = arrayLatLng.slice(0,corte+1).map(x => latLngToVectorMercator(x));
    let aux2 = arrayLatLng.slice(corte+1).map(x => latLngToVectorMercator(x));

    return [aux1, aux2];
}


//transforma un vector3 a coordenadas esféricas en latitud y longitud
//-----------------------------------------------------------------------------------------------------------------------------------
function vector3ToLatLng(v){
    var dot = BABYLON.Vector3.Dot(yAxis, v);
    var angle = Math.acos(dot / (yAxis.length() * v.length()));
    let arg = angle*180/Math.PI;
    if (arg<90){
        arg = 90-arg; 
    } else {
        arg = -(arg-90);
    }
    //proyeccion del vector sobre plano xz
    let proy_xz = new BABYLON.Vector3(v.x,0,v.z);
    dot = BABYLON.Vector3.Dot(xAxis, proy_xz);
    angle = Math.acos(dot / (xAxis.length() * proy_xz.length()));
    if (proy_xz.z<0){angle = -angle};
    return {lat: arg, lng: angle*180/Math.PI};

}

//recibe un array de puntos en Vector 3 y devuelve un array en coordenadas esféricas
function arrayVector3ToArrayLatLng(arrayVector3){

    let aux = arrayVector3.map(v => vector3ToLatLng(v));
    return aux;
}

//transforma un vector3 en el globo a su correspondiente en el plano    REVISAR FUNCION
//-----------------------------------------------------------------------------------------------------------------------------------
function vector3ToFEVector3(v){
    var dot = BABYLON.Vector3.Dot(yAxis, v);
    var angle = Math.acos(dot / (yAxis.length() * v.length()));
    let arg = angle*180/Math.PI;
    
    //proyeccion del vector sobre plano xz
    let proy_xz = new BABYLON.Vector3(v.x,0,v.z);
    dot = BABYLON.Vector3.Dot(xAxis, proy_xz);
    angle = Math.acos(dot / (xAxis.length() * proy_xz.length()));
    if (proy_xz.z<0){angle = -angle};
    return angle*180/Math.PI;

}

//recibe un array de vector3 y devuelve un array de vector3 en planilandia
function arrayVector3ToArrayFEVector3(arrayVector3){

    let aux = arrayVector3.map(x => vector3ToFEVector3(x));
    return aux;
}

//transforma un vector3FE a latlng
//-----------------------------------------------------------------------------------------------------------------------------------
function vector3FEToLatLng(v){

    v.y = 0;
    const origin = new BABYLON.Vector3(0,0,0);
    var mod = BABYLON.Vector3.Distance(v, origin)/escala;
    var lat = 180*mod/flatEarthRadius;
    if (lat>90){lat = 90-lat};
    if (lat>0){lat = 90 - lat};
    
    lng = Math.acos(v.x/(escala*mod))*180/Math.PI;
    if (v.z<0){lng = -lng};
    
    return {lat, lng};
}

//recibe un array de vector3FE y devuelve un array de latlng
function arrayVector3FEToArrayLatLng(arrayVector3FE){

    let aux = arrayVector3FE.map(x => vector3FEToLatLng(x));
    return aux;
}


//----------------------------------------------------------------------
//                                                                     -
//                       CÁLCULOS DE DISTANCIAS                        -
//                                                                     -
//----------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
//             DISTANCIAS ORTORÓMICAS
//------------------------------------------------------------------------------------------------------------------------------

//cálculo de arco de círculo máximo entre dos puntos. Valor en radianes
//---------------------------------------------------------------------
function angDistGreatCircle(PSal,PDest){
    var latSal, longSal, latDest, longDest;
    var DeltaLon;

    latSal = PSal.lat*Math.PI/180;
    longSal = PSal.lng*Math.PI/180;
    latDest = PDest.lat*Math.PI/180;
    longDest = PDest.lng*Math.PI/180;

    DeltaLon = Math.abs(longSal-longDest);

    return Math.acos(Math.sin(latSal)*Math.sin(latDest)+Math.cos(latSal)*Math.cos(latDest)*Math.cos(DeltaLon));

}


//cálculo de distancia ortodrómica a partir de puntos de salida y llegada y sus coordenadas
//método vectorial (TIERRA ESFÉRICA)
//-------------------------------------------------------------------------
function orthodromicDistanceV(PSal,PDest){
    var latSal, longSal, latDest, longDest;
    latSal = PSal.lat*Math.PI/180;
    longSal = PSal.lng*Math.PI/180;
    latDest = PDest.lat*Math.PI/180;
    longDest = PDest.lng*Math.PI/180;
    return earthRadius*Math.acos((Math.cos(longSal)*Math.cos(longDest)+Math.sin(longSal)*Math.sin(longDest))*Math.cos(latSal)*Math.cos(latDest)+Math.sin(latSal)*Math.sin(latDest));
}

//cálculo de distancia ortodrómica (en millas náuticas) a partir de puntos de salida y llegada y sus coordenadas
//método con trigonometría esférica (TIERRA ESFÉRICA, OBVIO!!)
//---------------------------------------------------------------------------------------
function orthodromicDistanceTE(PSal,PDest){

    return angDistGreatCircle(PSal,PDest)*180/Math.PI*60*1.852;
}

//cálculo de distancia ortodrómica a partir de array de puntos 
//en Tierra pizza
//-------------------------------------------------------------------------------------------
function orthodromicDistanceFE(points){
    var distance = 0;
    for (var i = 0; i<points.length -1 ; i++){
        distance = distance + BABYLON.Vector3.Distance(points[i],points[i+1]);
    }
    return distance/escala;

}

//--------------------------------------------------------------------------------------------------------------------------------------
//           FUNCION LARGO LÍNEA PARA COMPARAR DISTANCIAS
//--------------------------------------------------------------------------------------------------------------------------------------

function lineLenght(points){
    var llength = 0;
    for (var i = 0; i<points.length-1; i++){
        llength = llength + BABYLON.Vector3.Distance(points[i],points[i+1]);
    }

    return llength/escala;

}

//--------------------------------------------------------------------------------------------------------------------------------------
//             DISTANCIAS FLATDRÓMICAS
//--------------------------------------------------------------------------------------------------------------------------------------

//cálculo de distancia flatdrómica en Flatulandia a partir de puntos de salida y llegada y sus coordenadas
function flatdromicDistanceFE(PSal,PDest){
    var vectorSal = latLngToFEVector3(PSal);
    var vectorDestino = latLngToFEVector3(PDest);
    return  BABYLON.Vector3.Distance(vectorSal,vectorDestino)/escala;
    
}

//cálculo de distancia flatdrómica en globo a partir de puntos 
function flatdromicDistance(points){
    var distance = 0;
    for (var i = 0; i<points.length -1 ; i++){
        distance = distance + BABYLON.Vector3.Distance(points[i],points[i+1]);
    }
    return distance/escala;
}
//---------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------
//             DISTANCIAS LOXODRÓMICAS
//--------------------------------------------------------------------------------------------------------------------------------------------

//cálculo de distancia loxodrómica en Flatulandia a partir de puntos 
function loxodromicDistanceFE(points){
    var distance = 0;
    for (var i = 0; i<points.length -1 ; i++){
        distance = distance + BABYLON.Vector3.Distance(points[i],points[i+1]);
    }
    return distance/escala;
}

//cálculo de distancia flatdrómica en globo a partir de puntos 
/*
function loxodromicDistance(points){
    var distance = 0;
    for (var i = 0; i<points.length -1 ; i++){
        distance = distance + BABYLON.Vector3.Distance(points[i],points[i+1]);
    }
    return distance/escala;
}
*/
function loxodromicDistance(PSal, PDest) {

    const R = 6371; // radio Tierra en km

    const φ1 = PSal.lat * Math.PI / 180;
    const φ2 = PDest.lat * Math.PI / 180;
    let Δφ = φ2 - φ1;
    let Δλ = (PDest.lng - PSal.lng) * Math.PI / 180;

    // Ajuste si cruza el antimeridiano
    if (Math.abs(Δλ) > Math.PI) {
        Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);
    }

    const Δψ = Math.log(
        Math.tan(Math.PI / 4 + φ2 / 2) /
        Math.tan(Math.PI / 4 + φ1 / 2)
    );

    let q = Math.abs(Δψ) > 1e-12 ? Δφ / Δψ : Math.cos(φ1);

    const distancia = Math.sqrt(Δφ * Δφ + (q * Δλ) * (q * Δλ)) * R;

    return distancia; // km
}

//-------------------------------------------------------------------------------------------------------------------------------------------
//             RUMBOS INICIALES ORTODRÓMICOS
//--------------------------------------------------------------------------------------------------------------------------------------------


//cálculo rumbo inicial circular acimutal
//-----------------------------------------------------------------------------------------------------------------------------------
function riAcimutal(PSal,PDest){


    const φ1 = PSal.lat * Math.PI / 180;
    const φ2 = PDest.lat * Math.PI / 180;
    const Δλ = (PDest.lng - PSal.lng) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    let θ = Math.atan2(y, x); // resultado en radianes

    // Convertir a rumbo circular [0, 2π)
    θ = (θ + 2 * Math.PI) % (2 * Math.PI);

    return θ;
}



//-------------------------------------------------------------------------------------------------------------------------------------------
//             RUMBOS INICIALES LOXODRÓMICOS
//--------------------------------------------------------------------------------------------------------------------------------------------
function riLoxoCourse(PSal,PDest){
/*
    var latSal, longSal, latDest, longDest;
    var DeltaLon;

    latSal = PSal.lat*Math.PI/180;
    longSal = PSal.lng*Math.PI/180;
    latDest = PDest.lat*Math.PI/180;
    longDest = PDest.lng*Math.PI/180;

    DeltaLon = longDest - longSal;

    
    return Math.atan(DeltaLon/Math.log(Math.tan(latDest/2+Math.PI/4)/Math.tan(latSal/2+Math.PI/4)));
*/
const φ1 = PSal.lat * Math.PI / 180;
    const φ2 = PDest.lat * Math.PI / 180;
    let Δλ = (PDest.lng - PSal.lng) * Math.PI / 180;

    // Ajuste si cruza el antimeridiano
    if (Math.abs(Δλ) > Math.PI) {
        Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);
    }

    const Δψ = Math.log(
        Math.tan(Math.PI / 4 + φ2 / 2) /
        Math.tan(Math.PI / 4 + φ1 / 2)
    );

    let θ = Math.atan2(Δλ, Δψ);

    // Convertir a rumbo circular [0, 2π)
    θ = (θ + 2 * Math.PI) % (2 * Math.PI);

    return θ; // en radianes

}

//-------------------------------------------------------------------------------------------------------------------------------------------
//             RUMBOS INICIALES FLATDRÓMICOS
//--------------------------------------------------------------------------------------------------------------------------------------------

function riFlatCourse(PSal,PDest){

    var vectorSal = latLngToFEVector3(PSal);
    var vectorDestino = latLngToFEVector3(PDest);
    var DeltaX = vectorDestino.x - vectorSal.x;
    var DeltaZ = vectorDestino.z - vectorSal.z;

    return Math.atan(DeltaX/DeltaZ);

}





//----------------------------------------------------------------------------------------------------------------------------------------
//ortodrómica entre PSal (punto salida) y PDest (punto destino)
//retorna los puntos xyz de la sección de círculo máximo entre los ubicaciones

function orthodromicPoints(PSal, PDest) {

    var vector1 = latLngToVector3(PSal);
    var vector2 = latLngToVector3(PDest);
    var radius = earthRadius*escala;//*1.0001;
    var cross = BABYLON.Vector3.Cross(vector1, vector2);
    var dot = BABYLON.Vector3.Dot(vector1, vector2);
    var angle = Math.acos(dot / (vector1.length() * vector2.length()));
    var points = [];
    const minnbPoints = 4;
    var nbPoints = Math.trunc(orthodromicDistanceTE(PSal, PDest)/10); //aproximadamente cada 10 km
    if (nbPoints<minnbPoints){nbPoints = minnbPoints};

    var firstPoint = ((BABYLON.Vector3.Normalize(vector1)).scale(radius));
    var lastPoint = ((BABYLON.Vector3.Normalize(vector2)).scale(radius));

    var matrix;
    var ang = angle / nbPoints;
    var rotated;
    for (var i = 0; i < nbPoints; i++) {
      matrix = BABYLON.Matrix.RotationAxis(cross, ang * i);
      rotated = BABYLON.Vector3.TransformCoordinates(firstPoint, matrix);
      //console.log(rotated);

      points.push(rotated);

    }
    points.push(lastPoint);
    
    return points;
}

//---------------------------------------------------------------------------------------------------------------------------------------------
//loxodrómica entre PSal (punto salida) y PDest (punto destino)
//PSal y PDest en {lat,lng}
//retorna array de puntos x,y,z
function loxodromicPoints(PSal, PDest){
    let DeltaLng = PDest.lng  - PSal.lng;
    let signo=1;

    if (Math.abs(DeltaLng) > 180){
        if (DeltaLng<0){signo= -1};
        DeltaLng = -(360-Math.abs(DeltaLng))*signo;
    }

    let DeltaLat =PDest.lat - PSal.lat;
    const minnbPoints = 4;
    //let nbPoints = Math.floor(Math.abs(DeltaLng))*8; //aproximadamente cada grado de longitud
    let nbPoints = Math.trunc(loxodromicDistance(PSal, PDest)/10); //aproximadamente cada 10 km
    if (nbPoints<Math.abs(DeltaLat)){
        nbPoints = Math.floor(Math.abs(DeltaLat));  //si la diferencia en latitud es mayor a la diferencia en longitud, entonces dividir el arco por delta lat
    }
    if (nbPoints<minnbPoints){nbPoints = minnbPoints};

    let incLng = DeltaLng/nbPoints; //incremento en longitud
    
    let incLat = DeltaLat/nbPoints; //incremento en latitud
    var pointsLL = [];
    var points = [];
    
     //genero array de puntos de trayectoria loxodrómica
    let lat = PSal.lat;
    let lng = PSal.lng;
  
    for (var i = 0; i < nbPoints; i++) {
        pointsLL.push({lat,lng});
        points.push(latLngToVector3(pointsLL[i]));

        points[i].x = points[i].x* earthRadius * escala;
        points[i].y = points[i].y* earthRadius * escala;
        points[i].z = points[i].z* earthRadius * escala;

        lat = lat +  incLat;
        lng = lng + incLng;
        
      }
    //añado el último punto (el destino)
    pointsLL.push(PDest);
    points.push(latLngToVector3(PDest));
    points[points.length-1].x = points[points.length-1].x* earthRadius * escala;
    points[points.length-1].y = points[points.length-1].y* earthRadius * escala;
    points[points.length-1].z = points[points.length-1].z* earthRadius * escala;
      
    return points;
    
}

//---------------------------------------------------------------------------------------------------------------------------------------------
//flatodrómica entre PSal (punto salida) y PDest (punto destino)
//PSal y PDest en {lat,lng}
//retorna array de puntos x,y,z sobre plano
function flatdromicPoints(PSal, PDest){
    let vectorSalida = latLngToFEVector3(PSal);
    vectorSalida.y = 0;
    let modVectorSalida = vectorSalida.length();
    let vectorDestino = latLngToFEVector3(PDest);
    vectorDestino.y = 0;
    let modVectorDestino = vectorDestino.length();

    let nbPoints = 40 * Math.floor(BABYLON.Vector3.Distance(vectorSalida,vectorDestino)); 
    let minnbPoints = 10;
    if (nbPoints<minnbPoints){nbPoints = minnbPoints};

    let inc_x = (vectorDestino.x - vectorSalida.x)/nbPoints;
    let inc_z = (vectorDestino.z - vectorSalida.z)/nbPoints;

    var points = [];
    for (var i=0;i<=nbPoints;i++){
        points[i] = new BABYLON.Vector3(vectorSalida.x + (inc_x*i), 4*escala, vectorSalida.z + (inc_z*i));
        //points[i].scaling = FlatEarth.scaling;
    }

    return points;
}

// Devuelve el rumbo (grados, 0-360) entre la posición actual y un punto en la dirección indicada (Tierra esférica)
function getCourse(positionVector3, directionVector3){
    if (!positionVector3 || !directionVector3) return 0;
    // punto ligeramente adelantado en la dirección dada
    var ahead = positionVector3.add(directionVector3.normalize());
    var p1 = vector3ToLatLng(positionVector3);
    var p2 = vector3ToLatLng(ahead);
    if (!p1 || !p2) return 0;

    var lat1 = p1.lat * Math.PI/180;
    var lat2 = p2.lat * Math.PI/180;
    var dLon = (p2.lng - p1.lng) * Math.PI/180;

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var theta = Math.atan2(y, x);
    var bearing = (theta * 180/Math.PI + 360) % 360;
    return bearing;
}

// Versión para FlatEarth (flatulandia)
function getCourseFE(positionVector3, directionVector3){
    if (!positionVector3 || !directionVector3) return 0;
    var ahead = positionVector3.add(directionVector3.normalize());
    var p1 = vector3FEToLatLng(positionVector3);
    var p2 = vector3FEToLatLng(ahead);
    if (!p1 || !p2) return 0;

    var lat1 = p1.lat * Math.PI/180;
    var lat2 = p2.lat * Math.PI/180;
    var dLon = (p2.lng - p1.lng) * Math.PI/180;

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var theta = Math.atan2(y, x);
    var bearing = (theta * 180/Math.PI + 360) % 360;
    return bearing;
}



var auxObject;

var PSal, PDest, pos;
var Sal = false;
var Dest = false;
var PosAxis = null;
//array de puntos de ruta
var arrayWayPoints = [];
//array de marcadores
var markers = [];
//array de path points (latlng de marcadores)
var arrayPath = [];
//array de polylines
var arrayPathLine = [];
//info adicional sobre marcador
var popupContent;

//tabla de info
var latSal = document.getElementById("latSalContainer"); //latitud de salida
var lonSal = document.getElementById("lonSalContainer"); //longitud de salida
var latDest = document.getElementById("latDestContainer"); //latitud de destino
var lonDest = document.getElementById("lonDestContainer"); //longitud de destino
var angDistGC = document.getElementById("angDistGreatCircleContainer"); //distancia angular círculo máximo
//var orthodromicDistanceTEnm = document.getElementById("orthodromicDistanceTEnmContainer"); //distancia ortodrómica por trigonometría esférica en millas náuticas
//var orthodromicDistanceTEkm = document.getElementById("orthodromicDistanceTEkmContainer"); //distancia ortodrómica por trigonometría esférica en kilómetros
var orthodromicDistanceVnm = document.getElementById("orthodromicDistanceVnmContainer"); //distancia ortodrómica por vectores en millas náuticas
var orthodromicDistanceVkm = document.getElementById("orthodromicDistanceVkmContainer"); //distancia ortodrómica por vectores esférica en kilómetros
var riAz = document.getElementById("riAzContainer"); //rumbo inicial circular acimutal
var riCuadrantal = document.getElementById("riCuadContainer"); //rumbo inicial cuadrantal
var course = document.getElementById("rContainer");
var este = document.getElementById("eastVectorContainer");
var norte = document.getElementById("northVectorContainer");
var rumbo = document.getElementById("rumboContainer");

var NS; //componente norte o sur del rumbo
var rinicial;

var origin = new BABYLON.Vector3(0, 0, 0);



function init() {
    console.log("init");
    chkShowOrthodromicPath.checked = true;
    chkShowLoxodromicPath.checked = true;
    chkShowFlatdromicPath.checked = true;
}

function toGMS(ang) {
    var g, m;

    g = Math.floor(ang);
    m = ang - g;
    m = m * 60;
    m = m.toFixed(2);

    return g + "°" + m + "'";

}

var infoTitle = document.getElementById("infoTableTitle");			
var infoStartFligthLat = document.getElementById("startFligthLatContainer");
var infoStartFligthLng = document.getElementById("startFligthLngContainer");
var infoEndFligthLat = document.getElementById("endFligthLatContainer");
var infoEndFligthLng = document.getElementById("endFligthLngContainer");
var infoTotalDistance = document.getElementById("totalDistanceContainer");		
var infoTotalFligthTime = document.getElementById("totalFligthTimeContainer");			
			
var infoSection = document.getElementById("sectionContainer");			
var infoSectionStartLat = document.getElementById("startSectionLatContainer");
var infoStartSectionLng = document.getElementById("startSectionLngContainer");
var infoEndSectionLat = document.getElementById("endSectionLatContainer");
var infoEndSectionLng = document.getElementById("endSectionLngContainer");
var infoSectionDistance = document.getElementById("sectionDistanceContainer");			
var infoSectionFligthTime = document.getElementById("sectionFligthTimeContainer");	
var infoInitialCourse = document.getElementById("sectionInitialCourseContainer");		
			
var infoPositionLat = document.getElementById("positionLatContainer");
var infoPositionLng = document.getElementById("positionLngContainer");
var infoCourse = document.getElementById("courseContainer");

// Variables para mostrar infoTable
var totalOrthodromicDistance = document.getElementById("totalOrthodromicDistanceContainer"); 
var totalLoxodromicDistance = document.getElementById("totalLoxodromicDistanceContainer"); 
var totalFlatdromicDistance = document.getElementById("totalFlatdromicDistanceContainer");
var initialOrthodromicCourse = document.getElementById("initialOrthodromicCourseContainer");
var initialLoxodromicCourse = document.getElementById("initialLoxodromicCourseContainer");
var initialFlatdromicCourse = document.getElementById("initialFlatdromicCourseContainer");


function updateInfoTable(){
    /*---actualizar info de tabla---*/
    if (arrayWayPoints.length>1){

        document.getElementById("infoTextBox").style.display = "block";
        document.getElementById("infoTable").style.display = "block";

        let totalOrthodromicDistanceValue = 0;
        let totalLoxodromicDistanceValue = 0;
        let totalFlatdromicDistanceValue = 0;
        let totalOrthodromicFEDistanceValue = 0;
        let totalLoxodromicFEDistanceValue = 0;
        let totalFlatdromicFEDistanceValue = 0;

        infoStartFligthLat.innerHTML = toGMS(arrayWayPoints[0].P.lat);
        infoStartFligthLng.innerHTML = toGMS(arrayWayPoints[0].P.lng);
        infoEndFligthLat.innerHTML = toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lat);
        infoEndFligthLng.innerHTML = toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lng);
        

        for (let i=0; i<arrayWayPoints.length-1; i++){

            totalOrthodromicDistanceValue += arrayWayPoints[i].orthodromic.distance;
            totalLoxodromicDistanceValue += arrayWayPoints[i].loxodromic.distance;
            totalFlatdromicDistanceValue += arrayWayPoints[i].flatdromic.distance;
            totalOrthodromicFEDistanceValue += arrayWayPoints[i].orthodromic.distanceFE;
            totalLoxodromicFEDistanceValue += arrayWayPoints[i].loxodromic.distanceFE;
            totalFlatdromicFEDistanceValue += arrayWayPoints[i].flatdromic.distanceFE;
        }

        totalOrthodromicDistance.innerHTML = Earth.isEnabled() || Mercator.isEnabled()
            ? totalOrthodromicDistanceValue.toFixed(2) + " km" 
            : totalOrthodromicFEDistanceValue.toFixed(2) + " km";
        totalLoxodromicDistance.innerHTML = Earth.isEnabled() || Mercator.isEnabled()
            ? totalLoxodromicDistanceValue.toFixed(2) + " km" 
            : totalLoxodromicFEDistanceValue.toFixed(2) + " km";
        totalFlatdromicDistance.innerHTML = Earth.isEnabled() || Mercator.isEnabled()
            ? totalFlatdromicDistanceValue.toFixed(2) + " km" 
            : totalFlatdromicFEDistanceValue.toFixed(2) + " km";

        initialOrthodromicCourse.innerHTML = toGMS(arrayWayPoints[0].orthodromic.initialOrthoCourse);
        initialLoxodromicCourse.innerHTML = toGMS(arrayWayPoints[0].loxodromic.initialLoxoCourse);
        initialFlatdromicCourse.innerHTML = toGMS(arrayWayPoints[0].flatdromic.initialFlatCourse);

    } else {
        document.getElementById("infoTextBox").style.display = "none";
        document.getElementById("infoTable").style.display = "none";
    }
}


//------------------Objeto orthodromic
//----- contiene toda la info de una línea ortodrómica entre dos WayPoints
 class orthodromicData {
    constructor(PSal, PDest){
        let colorGreen = BABYLON.Color3.Green();
        let orthoTubeMaterial = new BABYLON.StandardMaterial("orthoTubeMaterial", scene);
	    orthoTubeMaterial.emissiveColor = colorGreen; 
        //sobre el globo;
        this.arc = angDistGreatCircle(PSal,PDest); //arco de círculo máximo en radianes
        this.points = orthodromicPoints(PSal, PDest);
        this.line = BABYLON.MeshBuilder.CreateTube("ortho"+(arrayWayPoints.length-1), {path: this.points, radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

        this.line.material = orthoTubeMaterial;
        if (FlatEarth.isEnabled() || !showOrthodromicPath){this.line.setEnabled(false)};
        this.distance = orthodromicDistanceTE(PSal,PDest);
        this.coords = arrayVector3ToArrayLatLng(this.points);
        //sobre Flatulandia
        this.pointsFE = arrayLatLngToArrayFEVector3(this.coords);
        this.lineFE = BABYLON.MeshBuilder.CreateTube("orthoFE"+(arrayWayPoints.length-1), {path: this.pointsFE, radius: 0.05, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineFE.scaling = FlatEarth.scaling;
        this.lineFE.material = orthoTubeMaterial;
        if (Earth.isEnabled()  || !showOrthodromicPath){this.lineFE.setEnabled(false)};
        this.distanceFE = orthodromicDistanceFE(this.pointsFE);

        //sobre Mercator
        this.pointsMercator = arrayLatLngToMercator(this.coords);
        
        this.lineMercator1 = BABYLON.MeshBuilder.CreateTube("orthoMercator1"+(arrayWayPoints.length-1), {path: this.pointsMercator[0], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator1.material = orthoTubeMaterial;
        this.lineMercator2 = BABYLON.MeshBuilder.CreateTube("orthoMercator2"+(arrayWayPoints.length-1), {path: this.pointsMercator[1], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator2.material = orthoTubeMaterial;
        this.lineMercator1.setEnabled(false); this.lineMercator2.setEnabled(false);
        //this.distanceMercator = orthodromicDistanceMercator(this.pointsMercator);

        this.line.isPickable = true;
        this.lineFE.isPickable = true;
        //this.lineMercator.isPickable = true;
        
        this.line_length = lineLenght(this.points);
        this.lineFE_length = lineLenght(this.pointsFE);
        //rumbo inicial ortodrómico
        this.initialOrthoCourse = riAcimutal(PSal, PDest) * 180/Math.PI;

    }
 }

//---------Objeto loxodromic
//-----contiene toda la info de una línea loxodrómica entre dos WayPoints

class loxodromicData {
    constructor(PSal, PDest){
        let colorRed = BABYLON.Color3.Red();
        let loxoTubeMaterial = new BABYLON.StandardMaterial("loxoTubeMaterial", scene);
	    loxoTubeMaterial.emissiveColor = colorRed;
        //sobre el globo
        this.points = loxodromicPoints(PSal, PDest);
        this.line = BABYLON.MeshBuilder.CreateTube("loxo"+(arrayWayPoints.length-1), {path: this.points, radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.line.material = loxoTubeMaterial;
        if (FlatEarth.isEnabled()  || !showLoxodromicPath){this.line.setEnabled(false)};
        this.distance = loxodromicDistance(PSal, PDest);
        this.coords = arrayVector3ToArrayLatLng(this.points);
        //sobre Flatulandia
        this.pointsFE = arrayLatLngToArrayFEVector3(this.coords);      
        this.lineFE = BABYLON.MeshBuilder.CreateTube("loxoFE"+(arrayWayPoints.length-1), {path: this.pointsFE, radius: 0.05, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineFE.material = loxoTubeMaterial;
        this.lineFE.scaling = FlatEarth.scaling;
        if (Earth.isEnabled()  || !showLoxodromicPath){this.lineFE.setEnabled(false)};
        this.distanceFE = loxodromicDistanceFE(this.pointsFE);

        //sobre Mercator
        this.pointsMercator = arrayLatLngToMercator(this.coords);
        
        this.lineMercator1 = BABYLON.MeshBuilder.CreateTube("loxoMercator1"+(arrayWayPoints.length-1), {path: this.pointsMercator[0], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator1.material = loxoTubeMaterial;
        this.lineMercator2 = BABYLON.MeshBuilder.CreateTube("loxoMercator2"+(arrayWayPoints.length-1), {path: this.pointsMercator[1], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator2.material = loxoTubeMaterial;
        this.lineMercator1.setEnabled(false); this.lineMercator2.setEnabled(false);
        //this.distanceMercator = loxodromicDistanceMercator(this.pointsMercator);  

        this.line.isPickable = true;
        this.lineFE.isPickable = true;

        this.line_length = lineLenght(this.points);
        this.lineFE_length = lineLenght(this.pointsFE);

        //rumbo inicial loxodrómico
        this.initialLoxoCourse = riLoxoCourse(PSal, PDest) * 180/Math.PI;

    }
}

//---------Objeto flatdromic
//-----contiene toda la info de una línea flatdrómica entre dos WayPoints

class flatdromicData {
    constructor(PSal,PDest){
        //sobre Flatulandia
        let colorYellow = BABYLON.Color3.Yellow();
        let flatTubeMaterial = new BABYLON.StandardMaterial("flatTubeMaterial", scene);
	    flatTubeMaterial.emissiveColor = colorYellow;
        this.pointsFE = flatdromicPoints(PSal,PDest);
        this.lineFE = BABYLON.MeshBuilder.CreateTube("flatFE"+(arrayWayPoints.length-1), {path: this.pointsFE, radius: 0.05, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineFE.material = flatTubeMaterial;
        
        this.lineFE.scaling = FlatEarth.scaling;

        if (Earth.isEnabled()  || !showFlatdromicPath){this.lineFE.setEnabled(false)};
        this.distanceFE = flatdromicDistanceFE(PSal, PDest);
        this.coords = arrayVector3FEToArrayLatLng(this.pointsFE);
        //sobre el globo
        this.points = arrayLatLngToArrayVector3(this.coords);
        this.line = BABYLON.MeshBuilder.CreateTube("flat"+(arrayWayPoints.length-1), {path: this.points, radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.line.material = flatTubeMaterial;
        if (FlatEarth.isEnabled() || !showFlatdromicPath){this.line.setEnabled(false)};
        this.distance = flatdromicDistance(this.points);

        //sobre Mercator
        this.pointsMercator = arrayLatLngToMercator(this.coords);
        //se crean dos lineas sobre Mercator para simular la discontinuidad del mapa en el meridiano de 180º, una para la parte de la ruta a la izquierda del meridiano y otra para la parte a la derecha del meridiano
        this.lineMercator1 = BABYLON.MeshBuilder.CreateTube("flatMercator1"+(arrayWayPoints.length-1), {path: this.pointsMercator[0], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator1.material = flatTubeMaterial;
        this.lineMercator1.setEnabled(false);
        this.lineMercator2 = BABYLON.MeshBuilder.CreateTube("flatMercator2"+(arrayWayPoints.length-1), {path: this.pointsMercator[1], radius: 0.03, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
        this.lineMercator2.material = flatTubeMaterial;
        this.lineMercator2.setEnabled(false);
        //this.distanceMercator = flatdromicDistanceMercator(this.pointsMercator);

        this.line.isPickable = true;
        this.lineFE.isPickable = true;

        this.line_length = lineLenght(this.points);
        this.lineFE_length = lineLenght(this.pointsFE);

        //rumbo inicial flatdromico
        this.initialFlatCourse = riFlatCourse(PSal, PDest) * 180/Math.PI;
    }
}


//---------------------------------------------------------------------------------------------------
//---------------- OBJETO WayPoint ----------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//  Contiene un punto de la ruta, las líneas hasta el próximo punto, el rumbo inicial al próximo punto, el rumbo final desde punto anterior, 
//    coordenada en latitud y longitud, como vector sobre globo y vector sobre Flatulandia
class WayPoint {
    constructor(id, P) {
        this.id = id; //es igual al id del marcador, también es el indice dentro de arrayWayPoints
        //coordenadas esféricas
        this.P = P; //P es un objeto {lat:xxxxxx,lng:xxxxxxxxx}
        //vector x,y,z a partir de coordenadas esféricas
        this.vMarker = latLngToVector3(P); 
        //vector x,y,z sobre Flatulandia
        this.vFEMarker = latLngToFEVector3(P).multiply(FlatEarth.scaling);

        //esferita marcador FE
        this.spFEMarker = BABYLON.MeshBuilder.CreateSphere("Waypoint TP "+this.id, {diameter:200 * escala}, scene);
        this.spFEMarker.material = arrayWayPointsMaterial;
        this.spFEMarker.position=this.vFEMarker;
        if (Earth.isEnabled()){this.spFEMarker.setEnabled(false)};


        //esferita marcador
        this.spMarker = BABYLON.MeshBuilder.CreateSphere("Waypoint "+this.id, {diameter:200 * escala}, scene);
        this.spMarker.material = arrayWayPointsMaterial;
        this.spMarker.position=new BABYLON.Vector3(this.vMarker.x * earthRadius * escala ,
            this.vMarker.y * earthRadius * escala ,
            this.vMarker.z * earthRadius * escala );
        if (FlatEarth.isEnabled()){this.spMarker.setEnabled(false)};
        if (id>0){ //si hay por lo menos 2 puntos en la ruta, entonces se puede calcular la ruta desde al WayPoint anterior hasta el actual
            
            //líneas ortodrómica en globo y Flatulandia
            arrayWayPoints[arrayWayPoints.length-1].orthodromic = new orthodromicData(arrayWayPoints[arrayWayPoints.length-1].P, this.P);
           
            //línea loxodrómica en globo y Flatulandia
            arrayWayPoints[arrayWayPoints.length-1].loxodromic = new loxodromicData(arrayWayPoints[arrayWayPoints.length-1].P, this.P);

           //línea flatdrómica en globo y Flatulandia
           arrayWayPoints[arrayWayPoints.length-1].flatdromic = new flatdromicData(arrayWayPoints[arrayWayPoints.length-1].P, this.P);


        } 
    }

    updateWayPoint(id, P = this.P){
        this.P = P;
        this.vMarker = latLngToVector3(P); //vector x,y,z a partir de coordenadas esféricas
        this.vFEMarker = latLngToFEVector3(P).multiply(FlatEarth.scaling); //vector x,y,z en planilandia a partir de coordenadas esféricas

        //esferita marcador FE
        this.spFEMarker.dispose();
        this.spFEMarker = BABYLON.MeshBuilder.CreateSphere("Waypoint TP "+this.id, {diameter:250 * escala}, scene);
        this.spFEMarker.material = arrayWayPointsMaterial;
        this.spFEMarker.position=this.vFEMarker;
        if (Earth.isEnabled()){this.spFEMarker.setEnabled(false)};

        //vector marcador
        this.spMarker.dispose();
        this.spMarker = BABYLON.MeshBuilder.CreateSphere("Waypoint "+this.id, {diameter:250 * escala}, scene);
        this.spMarker.material = arrayWayPointsMaterial;
        this.spMarker.position=new BABYLON.Vector3(this.vMarker.x * earthRadius * escala ,
            this.vMarker.y * earthRadius * escala ,
            this.vMarker.z * earthRadius * escala );
        if (FlatEarth.isEnabled()){this.spMarker.setEnabled(false)};

        
        if (id != arrayWayPoints.length-1){  //si no es el último
            
            //borrar y rehacer líneas ortodrómicas
            this.orthodromic.line.dispose();
            this.orthodromic.lineFE.dispose();
            this.orthodromic.lineMercator1.dispose();
            this.orthodromic.lineMercator2.dispose();

            //nueva ortodrómica sobre globo y Flatulandia
            this.orthodromic = new orthodromicData(arrayWayPoints[this.id].P, arrayWayPoints[this.id+1].P);

            //borrar y rehacer líneas loxodrómicas
            this.loxodromic.line.dispose();
            this.loxodromic.lineFE.dispose();
            this.loxodromic.lineMercator1.dispose();
            this.loxodromic.lineMercator2.dispose();
             //nueva loxodrómica sobre globo y Flatulandia
            this.loxodromic = new loxodromicData(arrayWayPoints[this.id].P,arrayWayPoints[this.id+1].P);

            //borrar y rehacer  líneas flatdrómicas
            this.flatdromic.line.dispose();
            this.flatdromic.lineFE.dispose();
            this.flatdromic.lineMercator1.dispose();
            this.flatdromic.lineMercator2.dispose();
             //nueva flatdromica sobre globo y Flatulandia
            this.flatdromic = new flatdromicData(arrayWayPoints[this.id].P,arrayWayPoints[this.id+1].P);
            
            

        }

        if (id != 0){  //si no es el primero
             //nuevas líneas ortodrómicas
            arrayWayPoints[this.id-1].orthodromic.line.dispose();
            arrayWayPoints[this.id-1].orthodromic.lineFE.dispose();
            arrayWayPoints[this.id-1].orthodromic.lineMercator1.dispose();
            arrayWayPoints[this.id-1].orthodromic.lineMercator2.dispose();
            arrayWayPoints[this.id-1].orthodromic = new orthodromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P);

            //nuevas líneas loxodrómicas sobre el globo
            arrayWayPoints[this.id-1].loxodromic.line.dispose();
            arrayWayPoints[this.id-1].loxodromic.lineFE.dispose();
            arrayWayPoints[this.id-1].loxodromic.lineMercator1.dispose();
            arrayWayPoints[this.id-1].loxodromic.lineMercator2.dispose();
            arrayWayPoints[this.id-1].loxodromic  = new loxodromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P);

            //nuevas líneas flatdrómicas sobre el globo
            arrayWayPoints[this.id-1].flatdromic.line.dispose();
            arrayWayPoints[this.id-1].flatdromic.lineFE.dispose();
            arrayWayPoints[this.id-1].flatdromic.lineMercator1.dispose();
            arrayWayPoints[this.id-1].flatdromic.lineMercator2.dispose();
            arrayWayPoints[this.id-1].flatdromic  = new flatdromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P);
        
        
        }
    }
}


var globeModel = true;
//var wraper = document.getElementById("popupWrapper");
//wraper.style.display= "block";
//menu
var btnMakeTrack = document.getElementById("btnMakeTrack");
var btnAlternateModels = document.getElementById("btnAlternateModels");
var btnTest = document.getElementById("btnOptions");

//para la vista Mercator
var btnMercator = document.getElementById("btnMercator");
var btnCloseMercator = document.getElementById("btnCloseMercator");
var EarthIsEnabled = false; //flag para saber si el modelo del globo terráqueo está activo o no
var FEIsEnabled = false; //flag para saber si el modelo de Flat Earth está activo o no
// para guardar/restaurar estado de cámara al entrar/salir de Mercator
var prevCameraState = null;



btnMercator.onclick = function(){
  document.getElementById("MercatorViewMenu").style.display = "block";
  document.getElementById("menu").style.display = "none";
  // guardar estado de cámara actual antes de cambiar la vista
  if (typeof camera !== 'undefined' && camera){
    prevCameraState = {
      lowerBetaLimit: camera.lowerBetaLimit,
      upperBetaLimit: camera.upperBetaLimit,
      lowerAlphaLimit: camera.lowerAlphaLimit,
      upperAlphaLimit: camera.upperAlphaLimit,
      lowerRadiusLimit: camera.lowerRadiusLimit,
      upperRadiusLimit: camera.upperRadiusLimit,
      wheelPrecision: camera.wheelPrecision,
      radius: camera.radius,
      alpha: camera.alpha,
      beta: camera.beta
    };

    // configurar cámara para vista Mercator (plana, cenital)
    // Limitar la cámara para vista plana (bloquear inclinación, permitir giro limitado)
   camera.beta = Math.PI/2;
   camera.lowerBetaLimit = Math.PI/2;
   camera.upperBetaLimit = Math.PI/2;
   camera.lowerAlphaLimit = 0; // permitir rotar ligeramente con el ratón
   camera.upperAlphaLimit =0;
  };

  Mercator.setEnabled(true);
  if (Earth.isEnabled()){
    EarthIsEnabled = true;
    Earth.setEnabled(false);
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].spMarker.setEnabled(false);
      arrayWayPoints[i].orthodromic.line.setEnabled(false);
      if (showOrthodromicPath){arrayWayPoints[i].orthodromic.lineMercator1.setEnabled(true); arrayWayPoints[i].orthodromic.lineMercator2.setEnabled(true)};
      arrayWayPoints[i].loxodromic.line.setEnabled(false);
      if (showLoxodromicPath){arrayWayPoints[i].loxodromic.lineMercator1.setEnabled(true); arrayWayPoints[i].loxodromic.lineMercator2.setEnabled(true)};
      arrayWayPoints[i].flatdromic.line.setEnabled(false);
      if (showFlatdromicPath){arrayWayPoints[i].flatdromic.lineMercator1.setEnabled(true); arrayWayPoints[i].flatdromic.lineMercator2.setEnabled(true)};
    }
    if (arrayWayPoints.length > 0){arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(false)};

  } else {
    FEIsEnabled = true;
    FlatEarth.setEnabled(false);
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].spFEMarker.setEnabled(false);
      arrayWayPoints[i].orthodromic.lineFE.setEnabled(false);
      if (showOrthodromicPath){arrayWayPoints[i].orthodromic.lineMercator1.setEnabled(true); arrayWayPoints[i].orthodromic.lineMercator2.setEnabled(true)};
      arrayWayPoints[i].loxodromic.lineFE.setEnabled(false);
      if (showLoxodromicPath){arrayWayPoints[i].loxodromic.lineMercator1.setEnabled(true); arrayWayPoints[i].loxodromic.lineMercator2.setEnabled(true)};
      arrayWayPoints[i].flatdromic.lineFE.setEnabled(false);
      if (showFlatdromicPath){arrayWayPoints[i].flatdromic.lineMercator1.setEnabled(true); arrayWayPoints[i].flatdromic.lineMercator2.setEnabled(true)}
    }
    if (arrayWayPoints.length > 0){arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(false)};
  }
  updateInfoTable();
}

btnCloseMercator.onclick = function(){
  document.getElementById("MercatorViewMenu").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  Mercator.setEnabled(false);
  // restaurar estado de cámara previo si se guardó
  if (prevCameraState && typeof camera !== 'undefined' && camera){
    var s = prevCameraState;
    camera.lowerBetaLimit = s.lowerBetaLimit;
    camera.upperBetaLimit = s.upperBetaLimit;
    camera.lowerAlphaLimit = s.lowerAlphaLimit;
    camera.upperAlphaLimit = s.upperAlphaLimit;
    camera.lowerRadiusLimit = s.lowerRadiusLimit;
    camera.upperRadiusLimit = s.upperRadiusLimit;
    camera.wheelPrecision = s.wheelPrecision;
    camera.radius = s.radius;
    camera.alpha = s.alpha;
    camera.beta = s.beta;
    prevCameraState = null;
  }
  if (EarthIsEnabled){
    Earth.setEnabled(true);
    EarthIsEnabled = false;
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].spMarker.setEnabled(true);
      if(showOrthodromicPath) arrayWayPoints[i].orthodromic.line.setEnabled(true);
      if(showLoxodromicPath) arrayWayPoints[i].loxodromic.line.setEnabled(true);
      if(showFlatdromicPath) arrayWayPoints[i].flatdromic.line.setEnabled(true);
      arrayWayPoints[i].orthodromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].orthodromic.lineMercator2.setEnabled(false);
      arrayWayPoints[i].loxodromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].loxodromic.lineMercator2.setEnabled(false);
      arrayWayPoints[i].flatdromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].flatdromic.lineMercator2.setEnabled(false);
    }
    if (arrayWayPoints.length > 0){arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(true)};
  } else if (FEIsEnabled){
    FlatEarth.setEnabled(true);    
    FEIsEnabled = false;
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].spFEMarker.setEnabled(true);
      if (showOrthodromicPath) arrayWayPoints[i].orthodromic.lineFE.setEnabled(true);
      if (showLoxodromicPath) arrayWayPoints[i].loxodromic.lineFE.setEnabled(true);
      if (showFlatdromicPath) arrayWayPoints[i].flatdromic.lineFE.setEnabled(true);
      arrayWayPoints[i].orthodromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].orthodromic.lineMercator2.setEnabled(false);
      arrayWayPoints[i].loxodromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].loxodromic.lineMercator2.setEnabled(false);
      arrayWayPoints[i].flatdromic.lineMercator1.setEnabled(false);
      arrayWayPoints[i].flatdromic.lineMercator2.setEnabled(false);
    }
    if (arrayWayPoints.length > 0){arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(true)};
}
  updateInfoTable();
}

var btnFly = document.getElementById("btnFly");
//var btnTest3 = document.getElementById("btnTest3");
var btnTravel = document.getElementById("btnTravel");
var dropdowns = document.getElementsByClassName("dropDownContent");
var chkShowOrthodromicPath = document.getElementById("chkShowOrthodromicPath");
var chkShowLoxodromicPath = document.getElementById("chkShowLoxodromicPath");
var chkShowFlatdromicPath = document.getElementById("chkShowFlatdromicPath");
var sldFlatEarthRadius = document.getElementById("sldFlatEarthRadius");
var txtFlatEarthRadius = document.getElementById("txtFlatEarthRadius");
var sldAverageSpeed = document.getElementById("sldAverageSpeed");
var txtAverageSpeed = document.getElementById("txtAverageSpeed");
var sldAnimationSpeed = document.getElementById("sldAnimationSpeed");
var txtAnimationSpeed = document.getElementById("txtAnimationSpeed");

var slctFEmapSelect = document.getElementById("slctFEmapSelect");

var infoTitle = document.getElementById("infoTrackTitle");
var infoTotalDistance = document.getElementById("infoTotalDistance");
var infoTotalFligthTime = document.getElementById("infoTotalFligthTime");


var showOrthodromicPath = true;
var showLoxodromicPath = true;
var showFlatdromicPath = true;

//radio buttons de vuelo

var rdbtnFlyOrthodromic = document.getElementById("rdbtnFlyOrthodromic");
var rdbtnFlyLoxodromic = document.getElementById("rdbtnFlyLoxodromic");
var rdbtnFlyFlatdromic = document.getElementById("rdbtnFlyFlatdromic");

//funciones que controlan la visibilidad del popup para trazar la ruta y el de información  
function openPopup(id) {

    const wrapper = document.getElementById("popupWrapper");

    // Ocultar todos los popups internos
    document.querySelectorAll("#popupWrapper .popup")
        .forEach(p => p.classList.remove("active"));

    // Activar el que corresponde
    document.getElementById(id).classList.add("active");

    // Mostrar overlay
    wrapper.classList.add("active");
}

function closePopup() {

    document.querySelectorAll("#popupWrapper .popup")
        .forEach(p => p.classList.remove("active"));

    document.getElementById("popupWrapper").classList.remove("active");
}

openPopup("popupInfo");


slctFEmapSelect.onchange = function(){
  var FEMaterial = new BABYLON.StandardMaterial("FEMaterial", scene); 
  if (slctFEmapSelect.value == "G") {

    FEMaterial.diffuseTexture = new BABYLON.Texture("/FEGls.jpg", scene);
    FEMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    FlatEarth.material = FEMaterial;

    FlatEarth.rotation.y = -Math.PI/2+0.014;
  } else {
    FEMaterial.diffuseTexture = new BABYLON.Texture("/FE.jpg", scene);
    FEMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    FlatEarth.material = FEMaterial;

    FlatEarth.rotation.y = -Math.PI/2;
  }
  /*
  FEMaterial.diffuseTexture = new BABYLON.Texture("/FEGls.jpg", scene);
   FEMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
   //FEMaterial.specularPower=10000;
   FlatEarth.material = FEMaterial;

   FlatEarth.rotation.y = -Math.PI/2+0.014;*/
}

rdbtnFlyOrthodromic.onclick = function(){
  infoTitle.innerHTML="POR ORTODRÓMICAS";
  let dist=0;
  for (i=0;i<arrayWayPoints.length-1;i++){

    if (Earth.isEnabled()){
      dist += arrayWayPoints[i].orthodromic.distance;
    } else {
      dist += arrayWayPoints[i].orthodromic.distanceFE;  
    }
  }
  if (!Earth.isEnabled()){
    dist = dist*scaling.x;
  }
  //infoTotalDistance.innerHTML = dist.toFixed(2) + " km";
  //infoTotalFligthTime.innerHTML = (dist/sldAverageSpeed.value).toFixed(2) + " horas (" + sldAverageSpeed.value + " km/h)";
  fly();
  dropdowns[1].classList.remove('show');
}

rdbtnFlyLoxodromic.onclick = function(){
  
  infoTitle.innerHTML="POR LOXODRÓMICAS";
  let dist=0;
  for (i=0;i<arrayWayPoints.length-1;i++){

    if (Earth.isEnabled()){
      dist += arrayWayPoints[i].loxodromic.distance;
    } else {
      dist += arrayWayPoints[i].loxodromic.distanceFE;  
    }
  }
  if (!Earth.isEnabled()){
    dist = dist*scaling.x;
  }
  //infoTotalDistance.innerHTML = dist.toFixed(2) + " km";
  //infoTotalFligthTime.innerHTML = (dist/sldAverageSpeed.value).toFixed(2)  + " horas (" + sldAverageSpeed.value + " km/h)";
  fly();
  dropdowns[1].classList.remove('show');
}

rdbtnFlyFlatdromic.onclick = function(){

  infoTitle.innerHTML="POR FLATDRÓMICAS";
  let dist=0;
  for (i=0;i<arrayWayPoints.length-1;i++){

    if (Earth.isEnabled()){
      dist += arrayWayPoints[i].flatdromic.distance;
    } else {
      dist += arrayWayPoints[i].flatdromic.distanceFE;  
    }
  }

  if (!Earth.isEnabled()){
    dist = dist*scaling.x;
  }
  //infoTotalDistance.innerHTML = dist.toFixed(2) + " km";
  //infoTotalFligthTime.innerHTML = (dist/sldAverageSpeed.value).toFixed(2)  + " horas (" + sldAverageSpeed.value + " km/h)";
  fly();
  dropdowns[1].classList.remove('show');
}

//Indices y array de puntos de ruta
var iarray;

var scaling = new BABYLON.Vector3(1,1,1);

chkShowOrthodromicPath.onclick = function(){
  showOrthodromicPath = !showOrthodromicPath;
  if (showOrthodromicPath){
    document.getElementById("infoOrthodromic").style.display = "block";
    if (Earth.isEnabled()){
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].orthodromic.line.setEnabled(true); 
      }
     
    } else {
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].orthodromic.lineFE.setEnabled(true); 
      }
    }
  } else {
    document.getElementById("infoOrthodromic").style.display = "none";
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].orthodromic.line.setEnabled(false);
      arrayWayPoints[i].orthodromic.lineFE.setEnabled(false) 
    }
  }
}

chkShowLoxodromicPath.onclick = function(){
  showLoxodromicPath  = !showLoxodromicPath;
  if (showLoxodromicPath){
    document.getElementById("infoLoxodromic").style.display = "block";
    if (Earth.isEnabled()){
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].loxodromic.line.setEnabled(true); 
      }
     
    } else {
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].loxodromic.lineFE.setEnabled(true); 
      }
    }
  } else {
    document.getElementById("infoLoxodromic").style.display = "none";
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].loxodromic.line.setEnabled(false);
      arrayWayPoints[i].loxodromic.lineFE.setEnabled(false) 
    }
  }
}

chkShowFlatdromicPath.onclick =function(){
  showFlatdromicPath = !showFlatdromicPath;
  if (showFlatdromicPath){
    document.getElementById("infoFlatdromic").style.display = "block";
    if (Earth.isEnabled()){
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].flatdromic.line.setEnabled(true); 
      }
     
    } else {
      for (var i=0; i<arrayWayPoints.length-1;i++){
        arrayWayPoints[i].flatdromic.lineFE.setEnabled(true); 
      }
    }
  } else {
    document.getElementById("infoFlatdromic").style.display = "none";
    for (var i=0; i<arrayWayPoints.length-1;i++){
      arrayWayPoints[i].flatdromic.line.setEnabled(false);
      arrayWayPoints[i].flatdromic.lineFE.setEnabled(false) 
    }
  }
}

function showDropDownContent(id){
    //ocultar todas
    
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    //cambiar el estado de dropDown correspondiente
    document.getElementById(id).classList.toggle("show");
}


// Close the dropdown if the user clicks outside of it

window.onclick = function(event) {
    if (!document.getElementById('dropDownButtons').contains(event.target)) {

      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

//Botón "Trazar ruta" muestra el popup con el mapa para trazar la ruta
btnMakeTrack.onclick = function() {
    openPopup("popupMap");

    setTimeout(function() {
        mymap.invalidateSize();
    }, 100);
};

btnInfo.onclick = function(){
  openPopup("popupInfo");
  infoTab.style.borderBottomColor = "gray";
  aboutTab.style.borderBottomColor = "white";
  document.getElementById("aboutTabContent").style.display = "none";
  document.getElementById("infoTabContent").style.display = "block";

}
//Alternar vista entre modelos
btnAlternateModels.onclick = function(){
    
  if (Earth.isEnabled()){
        btnAlternateModels.innerText="Ver en globo";
        Earth.setEnabled(false);
        camera.position.y = Math.abs(camera.position.y);
        //console.log(camera.upperBetaLimit);
        camera.upperBetaLimit = BABYLON.Tools.ToRadians(80);
        for (var i=0; i<arrayWayPoints.length-1;i++){
            arrayWayPoints[i].spMarker.setEnabled(false);
            arrayWayPoints[i].spFEMarker.setEnabled(true);
            arrayWayPoints[i].orthodromic.line.setEnabled(false);
            if (showOrthodromicPath){arrayWayPoints[i].orthodromic.lineFE.setEnabled(true)};
            arrayWayPoints[i].loxodromic.line.setEnabled(false);
            if (showLoxodromicPath){arrayWayPoints[i].loxodromic.lineFE.setEnabled(true)};
            arrayWayPoints[i].flatdromic.line.setEnabled(false);
            if (showFlatdromicPath){arrayWayPoints[i].flatdromic.lineFE.setEnabled(true)};
             
        }
        if (arrayWayPoints.length>0){
            arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(false);
            arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(true);
        }
        FlatEarth.setEnabled(true);
    } else {
        btnAlternateModels.innerText = "Ver en Flatulandia";
        Earth.setEnabled(true);
        camera.radius = (2*earthRadius+6500)*escala;
        camera.upperBetaLimit = Math.PI;
        for (var i=0; i<arrayWayPoints.length-1;i++){
            arrayWayPoints[i].spMarker.setEnabled(true);
            arrayWayPoints[i].spFEMarker.setEnabled(false);
            if (showOrthodromicPath){arrayWayPoints[i].orthodromic.line.setEnabled(true)};
            arrayWayPoints[i].orthodromic.lineFE.setEnabled(false);
            if (showLoxodromicPath){arrayWayPoints[i].loxodromic.line.setEnabled(true)};
            arrayWayPoints[i].loxodromic.lineFE.setEnabled(false);
            if (showFlatdromicPath){arrayWayPoints[i].flatdromic.line.setEnabled(true)};
            arrayWayPoints[i].flatdromic.lineFE.setEnabled(false);           
        }
        if (arrayWayPoints.length>0){
            arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(true);
            arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(false);
        }
        FlatEarth.setEnabled(false);
    }

    updateInfoTable();
}



sldFlatEarthRadius.oninput = function(){
  txtFlatEarthRadius.value = sldFlatEarthRadius.value;
  FlatEarth.diameter = sldFlatEarthRadius.value;
  let ratio = parseFloat(sldFlatEarthRadius.value)/flatEarthRadius;
  scaling = new BABYLON.Vector3(ratio, ratio, ratio);
  FlatEarth.scaling= scaling; 
  if (arrayWayPoints.length>0){ 
    for (var i=0; i < arrayWayPoints.length-1; i++){
      arrayWayPoints[i].orthodromic.lineFE.scaling = scaling;

      arrayWayPoints[i].loxodromic.lineFE.scaling = scaling;
      arrayWayPoints[i].flatdromic.lineFE.scaling = scaling;
      let newVFEMarker = arrayWayPoints[i].vFEMarker;
      newVFEMarker = newVFEMarker.multiply(scaling);
      arrayWayPoints[i].spFEMarker.position= newVFEMarker;

      
    }
    let newVFEMarker = arrayWayPoints[arrayWayPoints.length-1].vFEMarker;
    newVFEMarker = newVFEMarker.multiply(scaling);
    arrayWayPoints[arrayWayPoints.length-1].spFEMarker.position= newVFEMarker;
  }
}
/*
sldFlatEarthRadius.onchange = function(){
  
  for (var i=0; i < arrayWayPoints.length-1; i++){
    let PSal, Pdest;
    PSal = arrayWayPoints[i].P;
    PDest = arrayWayPoints[i+1].P;
    for (var j=0; j < arrayWayPoints[i].orthodromic.pointsFE.length; j++){
      arrayWayPoints[i].orthodromic.pointsFE[j] = arrayWayPoints[i].orthodromic.pointsFE[j].multiply(scaling);
    }
    arrayWayPoints[i].orthodromic.distanceFE = orthodromicDistanceFE(arrayWayPoints[i].orthodromic.pointsFE);
    for (var j=0; j < arrayWayPoints[i].loxodromic.pointsFE.length; j++){
      arrayWayPoints[i].loxodromic.pointsFE[j] = arrayWayPoints[i].loxodromic.pointsFE[j].multiply(scaling);
    }
    arrayWayPoints[i].loxodromic.distanceFE = loxodromicDistanceFE(arrayWayPoints[i].loxodromic.pointsFE);
    for (var j=0; j < arrayWayPoints[i].flatdromic.pointsFE.length; j++){
      arrayWayPoints[i].flatdromic.pointsFE[j] = arrayWayPoints[i].flatdromic.pointsFE[j].multiply(scaling);
    }
    arrayWayPoints[i].flatdromic.distanceFE = flatdromicDistanceFE(PSal,PDest)*scaling.x;

    
  }
}*/

sldAverageSpeed.oninput = function(){
  txtAverageSpeed.value = sldAverageSpeed.value;
}

sldAnimationSpeed.oninput = function(){
  txtAnimationSpeed.value = sldAnimationSpeed.value;
}

var popupInfo = document.getElementById("popupInfo");
const gl = BABYLON.Engine.LastCreatedEngine._gl;
const webglVersion = gl instanceof WebGL2RenderingContext ? "WebGL 2" : "WebGL 1";
document.getElementById("webglVersion").textContent = webglVersion;


const closeInfo = document.getElementById("btnPopupInfoClose");

closeInfo.addEventListener('click', closePopup);

const infoTab = document.getElementById("infoTab");
infoTab.style.borderBottomColor = "gray";
const aboutTab = document.getElementById("aboutTab");
aboutTab.style.borderBottomColor = "white";
const projectsTab = document.getElementById("projectsTab");
projectsTab.style.borderBottomColor = "white";

document.getElementById("aboutTabContent").style.display = "none";

infoTab.onclick= function(){
    infoTab.style.borderBottomColor = "gray";
    aboutTab.style.borderBottomColor = "white";
    document.getElementById("infoTabContent").style.display = "block";
    document.getElementById("aboutTabContent").style.display = "none";
    document.getElementById("ProjectsContent").style.display = "none";
}

aboutTab.onclick= function(){
    infoTab.style.borderBottomColor = "white";
    aboutTab.style.borderBottomColor = "gray";
    document.getElementById("infoTabContent").style.display = "none";
    document.getElementById("aboutTabContent").style.display = "block";
    document.getElementById("ProjectsContent").style.display = "none";
}

projectsTab.onclick= function(){
    infoTab.style.borderBottomColor = "white";
    aboutTab.style.borderBottomColor = "white";
    projectsTab.style.borderBottomColor = "gray";
    document.getElementById("infoTabContent").style.display = "none";
    document.getElementById("aboutTabContent").style.display = "none";
    document.getElementById("ProjectsContent").style.display = "block";
}   

document.getElementById("author").innerHTML = "Guillermo Mulvihill";
document.getElementById("authoremail").innerHTML = "guilleoem@gmail.com";
document.getElementById("babylonVersion").textContent = BABYLON.Engine.Version;
document.getElementById("leafletVersion").textContent = L.version;



var mymap = L.map('mapid').setView([0, 0], 2);



let popupMap = document.getElementById("popupMap");

const closeMap = document.getElementById("btnPopupMapClose"); //querySelector('.popup-close');

/*L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ©',
    //noWrap: true,
    maxZoom: 15,
}).addTo(mymap);*/


L.tileLayer('https://maptiles.p.rapidapi.com/es/map/v1/{z}/{x}/{y}.png?rapidapi-key=31f25ca2abmshcd0d4037e122b23p127cfdjsn5401d61bc576', {
attribution: '&copy: <a href="https://www.maptilesapi.com/">MapTiles API</a>, Datos de Mapa &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 15
}).addTo(mymap);


mymap.doubleClickZoom.disable();
mymap.options.minZoom = 1;

//limitar mapa a los límites
var southWest = L.latLng(-89.999, -180),
northEast = L.latLng(89.999, 180);
var bounds = L.latLngBounds(southWest, northEast);

mymap.setMaxBounds(bounds);
mymap.on('drag', function() {
	mymap.panInsideBounds(bounds, { animate: false });
});

closeMap.addEventListener('click', closePopup);





//------------------------------------------------------------------------------------------------------------------------------------------
//borra un marcador específico 
function clearMarker(id) {
    //alert(id);
    mymap.removeLayer(markers[id]);
    
     //borrar también el marcador del array
     markers.splice(id,1);
    //actualizar id e info de los demás marcadores
    for (var i = id; i < markers.length; i++){
        markers[i].options.id = markers[i].options.id -1;
        //actualizar info adicional en popup de marcador
        var popupContent = '<p>' + markers[i].options.id + '</p></br>' +
                '<p>' + markers[i].getLatLng() + '</p></br>' +
                '<button onclick="clearMarker(' +markers[i].options.id + ')">Clear Marker</button>';

        markers[i].bindPopup(popupContent, { closeButton: false });
    }

    if (id != (arrayWayPoints.length-1)){
        arrayWayPoints[id].orthodromic.line.dispose();
        arrayWayPoints[id].orthodromic.lineFE.dispose();
        arrayWayPoints[id].loxodromic.line.dispose();
        arrayWayPoints[id].loxodromic.lineFE.dispose();
        arrayWayPoints[id].flatdromic.line.dispose();
        arrayWayPoints[id].flatdromic.lineFE.dispose(); 
    } else if(id != 0){
        arrayWayPoints[id-1].orthodromic.line.dispose();
        arrayWayPoints[id-1].orthodromic.lineFE.dispose();
        arrayWayPoints[id-1].loxodromic.line.dispose();  
        arrayWayPoints[id-1].loxodromic.lineFE.dispose();
        arrayWayPoints[id-1].flatdromic.line.dispose();  
        arrayWayPoints[id-1].flatdromic.lineFE.dispose();
    }

    arrayWayPoints[id].spMarker.dispose();
    arrayWayPoints[id].spFEMarker.dispose();
    //borrar también el WayPoint del arrayWayPointsPoint
    arrayWayPoints.splice(id,1);
    
    //corregir los indices de arrayWayPointsPoints
    for (var i = id; i < arrayWayPoints.length; i++){
        arrayWayPoints[i].id = arrayWayPoints[i].id-1;
    }
    //console.log(arrayWayPoints);
    //update arraypoints
    if (id !=(arrayWayPoints.length)){ arrayWayPoints[id].updateWayPoint(id);}
    
    //líneas sobre el minimapa

    arrayPath.splice(id,1);
    if (arrayPathLine.length != 0) {arrayPathLine.removeFrom(mymap)};
    arrayPathLine = L.polyline(arrayPath).addTo(mymap);

    updateInfoTable();

  }

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//evento dblclick agrega un nuevo marcador a la ruta
mymap.on('dblclick', e => {

    //coordenadas donde se hizo dblclick
    let latlng = mymap.mouseEventToLatLng(e.originalEvent);
    latlng = latlng.wrap();

    //opciones del marcador
    marker = new L.marker(L.latLng(latlng.lat, latlng.lng),
        {
            draggable: 'true',
            clickable: 'true',
            id: arrayWayPoints.length
        });
    //info adicional en popup de marcador
    popupContent = '<p>' + marker.options.id + '</p></br>' +
            '<p>' + latlng + '</p></br>' +
        '<button onclick="clearMarker(' +marker.options.id + ')">Clear Marker</button>';

    marker.bindPopup(popupContent, { closeButton: false }).openPopup();
    
    //añadir el marcador al mapa
    mymap.addLayer(marker);
    marker.addTo(mymap);

    //añadir el marcador al array de marcadores
    markers[markers.length] = marker;

    //líneas sobre minimapa

    arrayPath.push(latlng.wrap());
    if (arrayPathLine.length != 0) {arrayPathLine.removeFrom(mymap)};
    arrayPathLine = L.polyline(arrayPath).addTo(mymap);

    //controlar evento arrastrar marcador
    marker.on('dragend', function (e) {
        // Get position of dropped marker
        var latLng = e.target.getLatLng();
        latLng = latLng.wrap();
        markers[e.target.options.id]._latlng = latLng;

        //info adicional
        popupContent = '<p>' + markers[e.target.options.id].options.id + '</p>' +
            '<p>' + latLng + '</p>' +
        '<button onclick="clearMarker(' + markers[e.target.options.id].options.id + ')">Clear Marker</button>';
        markers[e.target.options.id].bindPopup(popupContent, { closeButton: false }).openPopup();

        //actualizar path
        arrayPath[e.target.options.id]= latLng.wrap();
        arrayPathLine.removeFrom(mymap);
        arrayPathLine = L.polyline(arrayPath).addTo(mymap);


        //
        arrayWayPoints[e.target.options.id].P = latLng;
        arrayWayPoints[e.target.options.id].updateWayPoint(e.target.options.id, latLng);
    });

    //añadir un nuevo WayPoint en las coordenada donde se hizo doble click
    arrayWayPoints[arrayWayPoints.length] = new WayPoint(arrayWayPoints.length, latlng);

    updateInfoTable();

    if (arrayWayPoints[0] != null){
        if (arrayWayPoints[arrayWayPoints.length-1] != null){
            let aux,S,D;

            S= arrayWayPoints[0].P; D = arrayWayPoints[arrayWayPoints.length-1].P;


            //angDistGC.innerHTML = toGMS(angDistGreatCircle(S,D)*180/Math.PI);
            //orthodromicDistanceTEnm.innerHTML  = orthodromicDistanceTE(S,D).toFixed(2) + " nm";
            //aux = orthodromicDistanceTE(S,D)*1.852;
            //orthodromicDistanceTEkm.innerHTML = aux.toFixed(2)+ " km";
            //aux = orthodromicDistanceV(S,D)/1.852;
            //orthodromicDistanceVnm.innerHTML = aux.toFixed(2)+ " nm";
            //orthodromicDistanceVkm.innerHTML = orthodromicDistanceV(S,D).toFixed(2)+ " km"; 

            //rumbo
            //rinicial = ri(S,D);    
            //riCuadrantal.innerHTML = NS+toGMS(rinicial*180/Math.PI)+EW(S,D);
            //riAz.innerHTML = toGMS(riAcimutal(S,D)*180/Math.PI);


        }
    }

})    

