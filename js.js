var flyAnimation,btnPauseAnimation=document.getElementById("btnPauseAnimation"),btnResetAnimation=document.getElementById("btnResetAnimation"),btnStopAnimation=document.getElementById("btnStopAnimation"),paused=!1,j=0;async function fly(){if(arrayWayPoints.length<2)return void alert("No hay ruta trazada");document.getElementById("infoTextBox").style.display="block",document.getElementById("animationMenu").style.display="flex",document.getElementById("menu").style.display="none";var t,a,e,n=[];for(infoStartFligthLat.innerHTML=toGMS(arrayWayPoints[0].P.lat),infoStartFligthLng.innerHTML=toGMS(arrayWayPoints[0].P.lng),infoEndFligthLat.innerHTML=toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lat),infoEndFligthLng.innerHTML=toGMS(arrayWayPoints[arrayWayPoints.length-1].P.lng),airplane.setEnabled(!0),j=0;j<arrayWayPoints.length-1;){let y,m;if(infoSection.innerHTML="TRAMO "+(j+1),infoSectionStartLat.innerHTML=toGMS(arrayWayPoints[j].P.lat),infoStartSectionLng.innerHTML=toGMS(arrayWayPoints[j].P.lng),infoEndSectionLat.innerHTML=toGMS(arrayWayPoints[j+1].P.lat),infoEndSectionLng.innerHTML=toGMS(arrayWayPoints[j+1].P.lng),a=new BABYLON.Animation("travel","position",20,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE),e=new BABYLON.Animation("tutoAnimation","rotation",20,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE),rdbtnFlyFlatdromic.checked)if(Earth.isEnabled())n=arrayWayPoints[j].flatdromic.points,y=arrayWayPoints[j].flatdromic.distance.toFixed(2);else{for(var r=0;r<arrayWayPoints[j].flatdromic.pointsFE.length;r++)m=arrayWayPoints[j].flatdromic.pointsFE[r],n[r]=m.multiply(scaling);m=arrayWayPoints[j].flatdromic.distanceFE*scaling.x,y=m.toFixed(2)}else if(rdbtnFlyLoxodromic.checked)if(Earth.isEnabled())n=arrayWayPoints[j].loxodromic.points,y=arrayWayPoints[j].loxodromic.distance.toFixed(2);else{for(r=0;r<arrayWayPoints[j].loxodromic.pointsFE.length;r++)m=arrayWayPoints[j].loxodromic.pointsFE[r],n[r]=m.multiply(scaling);m=arrayWayPoints[j].loxodromic.distanceFE*scaling.x,y=m.toFixed(2)}else if(Earth.isEnabled())n=arrayWayPoints[j].orthodromic.points,y=arrayWayPoints[j].orthodromic.distance.toFixed(2);else{for(r=0;r<arrayWayPoints[j].orthodromic.pointsFE.length;r++)m=arrayWayPoints[j].orthodromic.pointsFE[r],n[r]=m.multiply(scaling);m=arrayWayPoints[j].orthodromic.distanceFE*scaling.x,y=m.toFixed(2)}infoSectionDistance.innerHTML=y+" km",infoSectionFligthTime.innerHTML=(y/sldAverageSpeed.value).toFixed(2)+" horas",t=Earth.isEnabled()?n[0]:new BABYLON.Vector3(0,1,0);let u=new BABYLON.Path3D(n,t);var o=u.getTangents(),i=u.getNormals(),s=u.getBinormals(),l=u.getCurve(),d=[];for(r=0;r<l.length;r++)d.push({frame:r,value:l[r]});a.setKeys(d);var c,h=[];for(r=0;r<l.length;r++)h.push({frame:r,value:BABYLON.Vector3.RotationFromAxis(o[r],i[r],s[r])});e.setKeys(h),airplane.animations.push(a),airplane.animations.push(e),flyAnimation=scene.beginAnimation(airplane,0,l.length,!1,.1),scene.onBeforeRenderObservable.add((function(t){let a,e,n=BABYLON.Vector3.Normalize(airplane.position);if(airplane.isEnabled()){if(Earth.isEnabled())c=vector3ToLatLng(airplane.position),e=new BABYLON.Vector3(-Math.sin(c.lng*Math.PI/180),0,Math.cos(c.lng*Math.PI/180)),a=e.cross(n);else{c=vector3FEToLatLng(airplane.position),a=new BABYLON.Vector3(-n.x,0,-n.z);let t=a.cross(airplane.right);t.y=Math.abs(t.y),e=t.cross(a)}var r=180*BABYLON.Vector3.GetAngleBetweenVectors(a,airplane.right,n)/Math.PI;r<0&&(r=360+r),infoPositionLat.innerHTML=toGMS(c.lat),infoPositionLng.innerHTML=toGMS(c.lng),infoCourse.innerHTML=toGMS(r)}else t.onBeforeStepObservable.clear()})),await flyAnimation.waitAsync(),j+=1}flyAnimation.reset(),flyAnimation.stop(),document.getElementById("infoTextBox").style.display="none",document.getElementById("animationMenu").style.display="none",document.getElementById("menu").style.display="flex",airplane.setEnabled(!1)}btnPauseAnimation.onclick=function(){paused?(flyAnimation.restart(),paused=!1,btnPauseAnimation.innerHTML="PAUSA"):(flyAnimation.pause(),paused=!0,btnPauseAnimation.innerHTML="REANUDAR")},btnResetAnimation.onclick=function(){flyAnimation.reset()},btnStopAnimation.onclick=function(){flyAnimation.reset(),flyAnimation.stop(),document.getElementById("infoTextBox").style.display="none",document.getElementById("animationMenu").style.display="none",document.getElementById("menu").style.display="flex",airplane.setEnabled(!1),j=arrayWayPoints.length,paused=!1};var camera,observer1,moonCamera,Earth,FlatEarth,canvas=document.getElementById("canvas"),sldAlpha=document.getElementById("sldAlpha"),txtAlpha=document.getElementById("txtalpha"),sldBeta=document.getElementById("sldBeta"),txtBeta=document.getElementById("txtbeta"),sldRadius=document.getElementById("sldRadius"),txtRadius=document.getElementById("txtradius"),sldFOV=document.getElementById("sldFOV"),txtFOV=document.getElementById("txtFOV"),sldy=document.getElementById("sldy"),txty=document.getElementById("txty");const earthRadius=6371,flatEarthRadius=20004,sunDistance=1499e5,escala=.001;var airplane,timerLoaderText=setInterval(loadingText,2e3);function loadingText(){var t=["electromagnetizando el domo","refractando rayos crepusculares","inflando globo","proyectando el mapa sobre una esfera ficticia","conectando a NASA","agregando bases militares antárticas","aplicando punto de fuga a la fata morgana","tratando de resolver la hipotenusa angular del tío eléctrico","curvando agua","poniendo de cabeza a los australianos","descomponiendo los 9x3 ángulos interiores de un triángulo","llenando tanques de combustible del avión con aire comprimido","Ocultando edificios con paredes de agua","triangulando antenas GPS","satanizando satélites","vectorizando CGI","friendo empanadas"],a=t[Math.floor(Math.random()*t.length)];document.getElementById("loaderText").innerHTML=a,console.log(a)}function clone(t){if(null===t||"object"!=typeof t)return t;var a=t.constructor();for(var e in t)a[e]=clone(t[e]);return a}window.onload=function(){document.getElementById("pageLoader").style.display="none",document.body.classList.remove("hidden"),document.getElementById("infoTextBox").style.display="none",document.getElementById("animationMenu").style.display="none",clearInterval(timerLoaderText)};var engine=new BABYLON.Engine(canvas,!0),createScene=function(){var t=new BABYLON.Scene(engine);camera=new BABYLON.ArcRotateCamera("Camera",0,Math.PI/2-.05,(2*earthRadius+6500)*escala,new BABYLON.Vector3(0,0,0),t),t.activeCamera.attachControl(canvas),camera.upperRadiusLimit=earthRadius*escala*5,camera.wheelPrecision=20,camera.fov=65*Math.PI/180;new BABYLON.HemisphericLight("Sun",new BABYLON.Vector3(0,0,1499e5*escala),t).intensity=.7,cielo=BABYLON.MeshBuilder.CreateSphere("cielo",{segments:30,diameter:12e3,sideOrientation:BABYLON.Mesh.DOUBLESIDE},t);var a=new BABYLON.StandardMaterial("estrellas",t);a.diffuseTexture=new BABYLON.Texture("/starmapHQ.jpg",t),a.disableLighting=!0,a.emissiveColor=new BABYLON.Color3(1,1,1),a.diffuseTexture.uScale=1,a.diffuseTexture.vScale=-1,cielo.material=a,Earth=BABYLON.MeshBuilder.CreateSphere("Earth",{segments:30,diameter:2*earthRadius*escala},t);var e=new BABYLON.StandardMaterial("myMaterial",t);e.diffuseTexture=new BABYLON.Texture("/earth.jpeg",t),e.emissiveColor=new BABYLON.Color3(1,1,1),e.alpha=1,Earth.rotation.y=Math.PI,Earth.material=e;const n=[];n[0]=new BABYLON.Vector4(0,0,0,0),n[1]=new BABYLON.Vector4(0,0,0,0),n[2]=new BABYLON.Vector4(0,0,1,1),FlatEarth=BABYLON.MeshBuilder.CreateCylinder("Flatulandia",{tessellation:90,height:2*escala,diameter:2*flatEarthRadius*escala,faceUV:n},t);var r=new BABYLON.StandardMaterial("FEMaterial",t);return r.diffuseTexture=new BABYLON.Texture("/FEGls.jpg",t),r.emissiveColor=new BABYLON.Color3(1,1,1),FlatEarth.material=r,FlatEarth.rotation.y=-Math.PI/2+.014,FlatEarth.setEnabled(!1),t},scene=createScene();scene.collisionsEnabled=!0,camera.checkCollisions=!0,camera.ellipsoid=new BABYLON.Vector3(1,1,1),camera.collisionRadius=new BABYLON.Vector3(2,2,2),Earth.checkCollisions=!0,FlatEarth.checkCollisions=!0;var meshisin=BABYLON.AbstractMesh;meshisin=BABYLON.SceneLoader.ImportMesh("","/qantasplane/","qantasplane2.glb",scene,(function(t){(airplane=t[0]).scaling=new BABYLON.Vector3(.007,.007,.007),airplane.rotationQuaternion=null}));var arrayWayPointsMaterial=new BABYLON.StandardMaterial("arrayWayPointsMaterial",scene);arrayWayPointsMaterial.diffuseColor=new BABYLON.Color3(1,1,1),arrayWayPointsMaterial.specularColor=new BABYLON.Color3(1,1,1),arrayWayPointsMaterial.emissiveColor=BABYLON.Color3.Black(),arrayWayPointsMaterial.alpha=.4,engine.runRenderLoop((function(){scene.render()})),window.onresize=function(){engine.resize()};const xAxis=new BABYLON.Vector3(1,0,0),yAxis=new BABYLON.Vector3(0,1,0),zAxis=new BABYLON.Vector3(0,0,1);function latLngToVector3(t){var a,e,n;return a=Math.cos(t.lng*Math.PI/180)*Math.cos(t.lat*Math.PI/180),n=Math.sin(t.lng*Math.PI/180)*Math.cos(t.lat*Math.PI/180),e=Math.sin(t.lat*Math.PI/180),new BABYLON.Vector3(a,e,n)}function arrayLatLngToArrayVector3(t){for(var a=[],e=t.slice(),n=0;n<t.length;n++)a[n]=latLngToVector3(e[n]),a[n].x=a[n].x*earthRadius*escala,a[n].y=a[n].y*earthRadius*escala,a[n].z=a[n].z*earthRadius*escala;return a}function latLngToFEVector3(t){let a=flatEarthRadius/180,e=(t.lat,new BABYLON.Vector3((90-t.lat)/180,0,0)),n=BABYLON.Matrix.RotationAxis(yAxis,-t.lng*Math.PI/180),r=BABYLON.Vector3.TransformCoordinates(e,n);return r.x=r.x*flatEarthRadius*escala,r.y=2*escala,r.z=r.z*flatEarthRadius*escala,r}function arrayLatLngToArrayFEVector3(t){return t.map((t=>latLngToFEVector3(t)))}function vector3ToLatLng(t){var a=BABYLON.Vector3.Dot(yAxis,t),e=Math.acos(a/(yAxis.length()*t.length()));let n=180*e/Math.PI;n=n<90?90-n:-(n-90);let r=new BABYLON.Vector3(t.x,0,t.z);return a=BABYLON.Vector3.Dot(xAxis,r),e=Math.acos(a/(xAxis.length()*r.length())),r.z<0&&(e=-e),{lat:n,lng:180*e/Math.PI}}function arrayVector3ToArrayLatLng(t){return t.map((t=>vector3ToLatLng(t)))}function vector3ToFEVector3(t){var a=BABYLON.Vector3.Dot(yAxis,t),e=Math.acos(a/(yAxis.length()*t.length()));Math.PI;let n=new BABYLON.Vector3(t.x,0,t.z);return a=BABYLON.Vector3.Dot(xAxis,n),e=Math.acos(a/(xAxis.length()*n.length())),n.z<0&&(e=-e),180*e/Math.PI}function arrayVector3ToArrayFEVector3(t){return t.map((t=>vector3ToFEVector3(t)))}function vector3FEToLatLng(t){t.y=0;const a=new BABYLON.Vector3(0,0,0);var e=BABYLON.Vector3.Distance(t,a)/escala,n=180*e/flatEarthRadius;return n>90&&(n=90-n),n>0&&(n=90-n),lng=180*Math.acos(t.x/(escala*e))/Math.PI,t.z<0&&(lng=-lng),{lat:n,lng:lng}}function arrayVector3FEToArrayLatLng(t){return t.map((t=>vector3FEToLatLng(t)))}function angDistGreatCircle(t,a){var e,n,r,o,i;return e=t.lat*Math.PI/180,n=t.lng*Math.PI/180,r=a.lat*Math.PI/180,o=a.lng*Math.PI/180,i=Math.abs(n-o),Math.acos(Math.sin(e)*Math.sin(r)+Math.cos(e)*Math.cos(r)*Math.cos(i))}function orthodromicDistanceV(t,a){var e,n,r,o;return e=t.lat*Math.PI/180,n=t.lng*Math.PI/180,r=a.lat*Math.PI/180,o=a.lng*Math.PI/180,earthRadius*Math.acos((Math.cos(n)*Math.cos(o)+Math.sin(n)*Math.sin(o))*Math.cos(e)*Math.cos(r)+Math.sin(e)*Math.sin(r))}function orthodromicDistanceTE(t,a){return 180*angDistGreatCircle(t,a)/Math.PI*60*1.852}function orthodromicDistanceFE(t){for(var a=0,e=0;e<t.length-1;e++)a+=BABYLON.Vector3.Distance(t[e],t[e+1]);return a/escala}function lineLenght(t){for(var a=0,e=0;e<t.length-1;e++)a+=BABYLON.Vector3.Distance(t[e],t[e+1]);return a/escala}function flatdromicDistanceFE(t,a){var e=latLngToFEVector3(t),n=latLngToFEVector3(a);return BABYLON.Vector3.Distance(e,n)/escala}function flatdromicDistance(t){for(var a=0,e=0;e<t.length-1;e++)a+=BABYLON.Vector3.Distance(t[e],t[e+1]);return a/escala}function loxodromicDistanceFE(t){for(var a=0,e=0;e<t.length-1;e++)a+=BABYLON.Vector3.Distance(t[e],t[e+1]);return a/escala}function loxodromicDistance(t){for(var a=0,e=0;e<t.length-1;e++)a+=BABYLON.Vector3.Distance(t[e],t[e+1]);return a/escala}function ri(t,a){var e,n,r,o,i,s;e=t.lat*Math.PI/180,n=t.lng*Math.PI/180,r=a.lat*Math.PI/180,o=a.lng*Math.PI/180,i=Math.abs(n-o),s=Math.cos(e)*(Math.tan(r)/Math.sin(i)-Math.tan(e)/Math.tan(i));let l=e*r;return l<0?NS=e<0?"N":"S":l>0&&(NS=e<0?"S":"N"),Math.abs(Math.atan(1/s))}function riAcimutal(t,a){return"E"==EW(t,a)?"N"==NS?rinicial:Math.PI-rinicial:"S"==NS?Math.PI+rinicial:2*Math.PI-rinicial}function EW(t,a){var e,n,r;return t.lat,e=t.lng,a.lat,n=a.lng,r=Math.abs(e-n),e<n?r<180?"E":"W":r<180?"W":"E"}function orthodromicPoints(t,a){var e=latLngToVector3(t),n=latLngToVector3(a),r=earthRadius*escala,o=BABYLON.Vector3.Cross(e,n),i=BABYLON.Vector3.Dot(e,n),s=Math.acos(i/(e.length()*n.length())),l=[];var d=Math.floor(180*s/Math.PI);d<4&&(d=4);for(var c,h,y=BABYLON.Vector3.Normalize(e).scale(r),m=BABYLON.Vector3.Normalize(n).scale(r),u=s/d,E=0;E<d;E++)c=BABYLON.Matrix.RotationAxis(o,u*E),h=BABYLON.Vector3.TransformCoordinates(y,c),l.push(h);return l.push(m),l}function loxodromicPoints(t,a){let e=a.lng-t.lng,n=1;Math.abs(e)>180&&(e<0&&(n=-1),e=-(360-Math.abs(e))*n);let r=a.lat-t.lat;let o=Math.floor(Math.abs(e));o<Math.abs(r)&&(o=Math.floor(Math.abs(r))),o<4&&(o=4);let i=e/o,s=r/o;var l=[],d=[];let c=t.lat,h=t.lng;for(var y=0;y<o;y++)l.push({lat:c,lng:h}),d.push(latLngToVector3(l[y])),d[y].x=d[y].x*earthRadius*escala,d[y].y=d[y].y*earthRadius*escala,d[y].z=d[y].z*earthRadius*escala,c+=s,h+=i;return l.push(a),d.push(latLngToVector3(a)),d[d.length-1].x=d[d.length-1].x*earthRadius*escala,d[d.length-1].y=d[d.length-1].y*earthRadius*escala,d[d.length-1].z=d[d.length-1].z*earthRadius*escala,d}function flatdromicPoints(t,a){let e=latLngToFEVector3(t);e.y=0;e.length();let n=latLngToFEVector3(a);n.y=0;n.length();let r=2*Math.floor(BABYLON.Vector3.Distance(e,n));r<10&&(r=10);let o=(n.x-e.x)/r,i=(n.z-e.z)/r;for(var s=[],l=0;l<=r;l++)s[l]=new BABYLON.Vector3(e.x+o*l,4*escala,e.z+i*l);return s}var auxObject,PSal,PDest,pos,popupContent,NS,rinicial,Sal=!1,Dest=!1,PosAxis=null,arrayWayPoints=[],markers=[],arrayPath=[],arrayPathLine=[],latSal=document.getElementById("latSalContainer"),lonSal=document.getElementById("lonSalContainer"),latDest=document.getElementById("latDestContainer"),lonDest=document.getElementById("lonDestContainer"),angDistGC=document.getElementById("angDistGreatCircleContainer"),orthodromicDistanceVnm=document.getElementById("orthodromicDistanceVnmContainer"),orthodromicDistanceVkm=document.getElementById("orthodromicDistanceVkmContainer"),riAz=document.getElementById("riAzContainer"),riCuadrantal=document.getElementById("riCuadContainer"),course=document.getElementById("rContainer"),este=document.getElementById("eastVectorContainer"),norte=document.getElementById("northVectorContainer"),rumbo=document.getElementById("rumboContainer"),origin=new BABYLON.Vector3(0,0,0);function init(){console.log("init"),chkShowOrthodromicPath.checked=!0,chkShowLoxodromicPath.checked=!0,chkShowFlatdromicPath.checked=!0}function toGMS(t){var a,e;return e=t-(a=Math.floor(t)),a+"°"+(e=(e*=60).toFixed(2))+"'"}var infoTitle=document.getElementById("infoTableTitle"),infoStartFligthLat=document.getElementById("startFligthLatContainer"),infoStartFligthLng=document.getElementById("startFligthLngContainer"),infoEndFligthLat=document.getElementById("endFligthLatContainer"),infoEndFligthLng=document.getElementById("endFligthLngContainer"),infoTotalDistance=document.getElementById("totalDistanceContainer"),infoTotalFligthTime=document.getElementById("totalFligthTimeContainer"),infoSection=document.getElementById("sectionContainer"),infoSectionStartLat=document.getElementById("startSectionLatContainer"),infoStartSectionLng=document.getElementById("startSectionLngContainer"),infoEndSectionLat=document.getElementById("endSectionLatContainer"),infoEndSectionLng=document.getElementById("endSectionLngContainer"),infoSectionDistance=document.getElementById("sectionDistanceContainer"),infoSectionFligthTime=document.getElementById("sectionFligthTimeContainer"),infoPositionLat=document.getElementById("positionLatContainer"),infoPositionLng=document.getElementById("positionLngContainer"),infoCourse=document.getElementById("courseContainer");function updateInfoTable(){}class orthodromicData{constructor(t,a){let e=BABYLON.Color3.Green(),n=new BABYLON.StandardMaterial("orthoTubeMaterial",scene);n.emissiveColor=e,this.arc=angDistGreatCircle(t,a),this.points=orthodromicPoints(t,a),this.line=BABYLON.MeshBuilder.CreateTube("ortho"+(arrayWayPoints.length-1),{path:this.points,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.line.material=n,!FlatEarth.isEnabled()&&showOrthodromicPath||this.line.setEnabled(!1),this.distance=orthodromicDistanceTE(t,a),this.coords=arrayVector3ToArrayLatLng(this.points),this.pointsFE=arrayLatLngToArrayFEVector3(this.coords),this.lineFE=BABYLON.MeshBuilder.CreateTube("orthoFE"+(arrayWayPoints.length-1),{path:this.pointsFE,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.lineFE.scaling=FlatEarth.scaling,this.lineFE.material=n,!Earth.isEnabled()&&showOrthodromicPath||this.lineFE.setEnabled(!1),this.distanceFE=orthodromicDistanceFE(this.pointsFE),this.line.isPickable=!0,this.lineFE.isPickable=!0,this.line_length=lineLenght(this.points),this.lineFE_length=lineLenght(this.pointsFE)}}class loxodromicData{constructor(t,a){let e=BABYLON.Color3.Red(),n=new BABYLON.StandardMaterial("loxoTubeMaterial",scene);n.emissiveColor=e,this.points=loxodromicPoints(t,a),this.line=BABYLON.MeshBuilder.CreateTube("loxo"+(arrayWayPoints.length-1),{path:this.points,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.line.material=n,!FlatEarth.isEnabled()&&showLoxodromicPath||this.line.setEnabled(!1),this.distance=loxodromicDistance(this.points),this.coords=arrayVector3ToArrayLatLng(this.points),this.pointsFE=arrayLatLngToArrayFEVector3(this.coords),this.lineFE=BABYLON.MeshBuilder.CreateTube("loxoFE"+(arrayWayPoints.length-1),{path:this.pointsFE,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.lineFE.material=n,this.lineFE.scaling=FlatEarth.scaling,!Earth.isEnabled()&&showLoxodromicPath||this.lineFE.setEnabled(!1),this.distanceFE=loxodromicDistanceFE(this.pointsFE),this.line.isPickable=!0,this.lineFE.isPickable=!0,this.line_length=lineLenght(this.points),this.lineFE_length=lineLenght(this.pointsFE)}}class flatdromicData{constructor(t,a){let e=BABYLON.Color3.Yellow(),n=new BABYLON.StandardMaterial("flatTubeMaterial",scene);n.emissiveColor=e,this.pointsFE=flatdromicPoints(t,a),this.lineFE=BABYLON.MeshBuilder.CreateTube("flatFE"+(arrayWayPoints.length-1),{path:this.pointsFE,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.lineFE.material=n,this.lineFE.scaling=FlatEarth.scaling,!Earth.isEnabled()&&showFlatdromicPath||this.lineFE.setEnabled(!1),this.distanceFE=flatdromicDistanceFE(t,a),this.coords=arrayVector3FEToArrayLatLng(this.pointsFE),this.points=arrayLatLngToArrayVector3(this.coords),this.line=BABYLON.MeshBuilder.CreateTube("flat"+(arrayWayPoints.length-1),{path:this.points,radius:.03,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),this.line.material=n,!FlatEarth.isEnabled()&&showFlatdromicPath||this.line.setEnabled(!1),this.distance=flatdromicDistance(this.points),this.line.isPickable=!0,this.lineFE.isPickable=!0,this.line_length=lineLenght(this.points),this.lineFE_length=lineLenght(this.pointsFE)}}class WayPoint{constructor(t,a){this.id=t,this.P=a,this.vMarker=latLngToVector3(a),this.vFEMarker=latLngToFEVector3(a).multiply(FlatEarth.scaling),this.spFEMarker=BABYLON.MeshBuilder.CreateSphere("Waypoint TP "+this.id,{diameter:250*escala},scene),this.spFEMarker.material=arrayWayPointsMaterial,this.spFEMarker.position=this.vFEMarker,Earth.isEnabled()&&this.spFEMarker.setEnabled(!1),this.spMarker=BABYLON.MeshBuilder.CreateSphere("Waypoint "+this.id,{diameter:250*escala},scene),this.spMarker.material=arrayWayPointsMaterial,this.spMarker.position=new BABYLON.Vector3(this.vMarker.x*earthRadius*escala,this.vMarker.y*earthRadius*escala,this.vMarker.z*earthRadius*escala),FlatEarth.isEnabled()&&this.spMarker.setEnabled(!1),t>0&&(arrayWayPoints[arrayWayPoints.length-1].orthodromic=new orthodromicData(arrayWayPoints[arrayWayPoints.length-1].P,this.P),arrayWayPoints[arrayWayPoints.length-1].loxodromic=new loxodromicData(arrayWayPoints[arrayWayPoints.length-1].P,this.P),arrayWayPoints[arrayWayPoints.length-1].flatdromic=new flatdromicData(arrayWayPoints[arrayWayPoints.length-1].P,this.P))}updateWayPoint(t,a=this.P){this.P=a,this.vMarker=latLngToVector3(a),this.vFEMarker=latLngToFEVector3(a).multiply(FlatEarth.scaling),this.spFEMarker.dispose(),this.spFEMarker=BABYLON.MeshBuilder.CreateSphere("Waypoint TP "+this.id,{diameter:250*escala},scene),this.spFEMarker.material=arrayWayPointsMaterial,this.spFEMarker.position=this.vFEMarker,Earth.isEnabled()&&this.spFEMarker.setEnabled(!1),this.spMarker.dispose(),this.spMarker=BABYLON.MeshBuilder.CreateSphere("Waypoint "+this.id,{diameter:250*escala},scene),this.spMarker.material=arrayWayPointsMaterial,this.spMarker.position=new BABYLON.Vector3(this.vMarker.x*earthRadius*escala,this.vMarker.y*earthRadius*escala,this.vMarker.z*earthRadius*escala),FlatEarth.isEnabled()&&this.spMarker.setEnabled(!1),t!=arrayWayPoints.length-1&&(this.orthodromic.line.dispose(),this.orthodromic.lineFE.dispose(),this.orthodromic=new orthodromicData(arrayWayPoints[this.id].P,arrayWayPoints[this.id+1].P),this.loxodromic.line.dispose(),this.loxodromic.lineFE.dispose(),this.loxodromic=new loxodromicData(arrayWayPoints[this.id].P,arrayWayPoints[this.id+1].P),this.flatdromic.line.dispose(),this.flatdromic.lineFE.dispose(),this.flatdromic=new flatdromicData(arrayWayPoints[this.id].P,arrayWayPoints[this.id+1].P)),0!=t&&(arrayWayPoints[this.id-1].orthodromic.line.dispose(),arrayWayPoints[this.id-1].orthodromic.lineFE.dispose(),arrayWayPoints[this.id-1].orthodromic=new orthodromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P),arrayWayPoints[this.id-1].loxodromic.line.dispose(),arrayWayPoints[this.id-1].loxodromic.lineFE.dispose(),arrayWayPoints[this.id-1].loxodromic=new loxodromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P),arrayWayPoints[this.id-1].flatdromic.line.dispose(),arrayWayPoints[this.id-1].flatdromic.lineFE.dispose(),arrayWayPoints[this.id-1].flatdromic=new flatdromicData(arrayWayPoints[this.id-1].P,arrayWayPoints[this.id].P))}}var globeModel=!0;let popup=document.querySelector(".popup-wrapper");const close=document.querySelector(".popup-close");var iarray,btnMakeTrack=document.getElementById("btnMakeTrack"),btnAlternateModels=document.getElementById("btnAlternateModels"),btnTest=document.getElementById("btnTest"),btnTest2=document.getElementById("btnTest2"),btnTravel=document.getElementById("btnTravel"),dropdowns=document.getElementsByClassName("dropDownContent"),chkShowOrthodromicPath=document.getElementById("chkShowOrthodromicPath"),chkShowLoxodromicPath=document.getElementById("chkShowLoxodromicPath"),chkShowFlatdromicPath=document.getElementById("chkShowFlatdromicPath"),sldFlatEarthRadius=document.getElementById("sldFlatEarthRadius"),txtFlatEarthRadius=document.getElementById("txtFlatEarthRadius"),sldAverageSpeed=document.getElementById("sldAverageSpeed"),txtAverageSpeed=document.getElementById("txtAverageSpeed"),slctFEmapSelect=document.getElementById("slctFEmapSelect"),showOrthodromicPath=!0,showLoxodromicPath=!0,showFlatdromicPath=!0,rdbtnFlyOrthodromic=document.getElementById("rdbtnFlyOrthodromic"),rdbtnFlyLoxodromic=document.getElementById("rdbtnFlyLoxodromic"),rdbtnFlyFlatdromic=document.getElementById("rdbtnFlyFlatdromic");slctFEmapSelect.onchange=function(){var t=new BABYLON.StandardMaterial("FEMaterial",scene);"G"==slctFEmapSelect.value?(t.diffuseTexture=new BABYLON.Texture("/FEGls.jpg",scene),t.emissiveColor=new BABYLON.Color3(1,1,1),FlatEarth.material=t,FlatEarth.rotation.y=-Math.PI/2+.014):(t.diffuseTexture=new BABYLON.Texture("/FE.jpg",scene),t.emissiveColor=new BABYLON.Color3(1,1,1),FlatEarth.material=t,FlatEarth.rotation.y=-Math.PI/2)},rdbtnFlyOrthodromic.onclick=async function(){infoTitle.innerHTML="POR ORTODRÓMICAS";let t=0;for(i=0;i<arrayWayPoints.length-1;i++)Earth.isEnabled()?t+=arrayWayPoints[i].orthodromic.distance:t+=arrayWayPoints[i].orthodromic.distanceFE;Earth.isEnabled()||(t*=scaling.x),infoTotalDistance.innerHTML=t.toFixed(2)+" km",infoTotalFligthTime.innerHTML=(t/900).toFixed(2)+" horas ("+sldAverageSpeed.value+" km/h)",fly(),dropdowns[1].classList.remove("show")},rdbtnFlyLoxodromic.onclick=function(){infoTitle.innerHTML="POR LOXODRÓMICAS";let t=0;for(i=0;i<arrayWayPoints.length-1;i++)Earth.isEnabled()?t+=arrayWayPoints[i].loxodromic.distance:t+=arrayWayPoints[i].loxodromic.distanceFE;Earth.isEnabled()||(t*=scaling.x),infoTotalDistance.innerHTML=t.toFixed(2)+" km",infoTotalFligthTime.innerHTML=(t/900).toFixed(2)+" horas ("+sldAverageSpeed.value+" km/h)",fly(),dropdowns[1].classList.remove("show")},rdbtnFlyFlatdromic.onclick=function(){infoTitle.innerHTML="POR FLATDRÓMICAS";let t=0;for(i=0;i<arrayWayPoints.length-1;i++)Earth.isEnabled()?t+=arrayWayPoints[i].flatdromic.distance:t+=arrayWayPoints[i].flatdromic.distanceFE;Earth.isEnabled()||(t*=scaling.x),infoTotalDistance.innerHTML=t.toFixed(2)+" km",infoTotalFligthTime.innerHTML=(t/900).toFixed(2)+" horas ("+sldAverageSpeed.value+" km/h)",fly(),dropdowns[1].classList.remove("show")};var scaling=new BABYLON.Vector3(1,1,1);function showDropDownContent(t){for(let t=0;t<dropdowns.length;t++){var a=dropdowns[t];a.classList.contains("show")&&a.classList.remove("show")}document.getElementById(t).classList.toggle("show")}chkShowOrthodromicPath.onclick=function(){if(showOrthodromicPath=!showOrthodromicPath)if(Earth.isEnabled())for(var t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].orthodromic.line.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].orthodromic.lineFE.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].orthodromic.line.setEnabled(!1),arrayWayPoints[t].orthodromic.lineFE.setEnabled(!1)},chkShowLoxodromicPath.onclick=function(){if(showLoxodromicPath=!showLoxodromicPath)if(Earth.isEnabled())for(var t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].loxodromic.line.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].loxodromic.lineFE.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].loxodromic.line.setEnabled(!1),arrayWayPoints[t].loxodromic.lineFE.setEnabled(!1)},chkShowFlatdromicPath.onclick=function(){if(showFlatdromicPath=!showFlatdromicPath)if(Earth.isEnabled())for(var t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].flatdromic.line.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].flatdromic.lineFE.setEnabled(!0);else for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].flatdromic.line.setEnabled(!1),arrayWayPoints[t].flatdromic.lineFE.setEnabled(!1)},window.onclick=function(t){if(!document.getElementById("dropDownButtons").contains(t.target))for(let t=0;t<dropdowns.length;t++){var a=dropdowns[t];a.classList.contains("show")&&a.classList.remove("show")}},btnMakeTrack.onclick=function(){popup.style.display="block",setTimeout((function(){mymap.invalidateSize()}),100)},btnAlternateModels.onclick=function(){if(Earth.isEnabled()){btnAlternateModels.innerText="ver en globo",Earth.setEnabled(!1),camera.position.y=Math.abs(camera.position.y),camera.upperBetaLimit=BABYLON.Tools.ToRadians(80);for(var t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].spMarker.setEnabled(!1),arrayWayPoints[t].spFEMarker.setEnabled(!0),arrayWayPoints[t].orthodromic.line.setEnabled(!1),showOrthodromicPath&&arrayWayPoints[t].orthodromic.lineFE.setEnabled(!0),arrayWayPoints[t].loxodromic.line.setEnabled(!1),showLoxodromicPath&&arrayWayPoints[t].loxodromic.lineFE.setEnabled(!0),arrayWayPoints[t].flatdromic.line.setEnabled(!1),showFlatdromicPath&&arrayWayPoints[t].flatdromic.lineFE.setEnabled(!0);arrayWayPoints.length>0&&(arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(!1),arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(!0)),FlatEarth.setEnabled(!0)}else{btnAlternateModels.innerText="ver en Flatulandia",Earth.setEnabled(!0),camera.radius=(2*earthRadius+6500)*escala,camera.upperBetaLimit=Math.PI;for(t=0;t<arrayWayPoints.length-1;t++)arrayWayPoints[t].spMarker.setEnabled(!0),arrayWayPoints[t].spFEMarker.setEnabled(!1),showOrthodromicPath&&arrayWayPoints[t].orthodromic.line.setEnabled(!0),arrayWayPoints[t].orthodromic.lineFE.setEnabled(!1),showLoxodromicPath&&arrayWayPoints[t].loxodromic.line.setEnabled(!0),arrayWayPoints[t].loxodromic.lineFE.setEnabled(!1),showFlatdromicPath&&arrayWayPoints[t].flatdromic.line.setEnabled(!0),arrayWayPoints[t].flatdromic.lineFE.setEnabled(!1);arrayWayPoints.length>0&&(arrayWayPoints[arrayWayPoints.length-1].spMarker.setEnabled(!0),arrayWayPoints[arrayWayPoints.length-1].spFEMarker.setEnabled(!1)),FlatEarth.setEnabled(!1)}},close.addEventListener("click",(()=>{popup.style.display="none"})),sldFlatEarthRadius.oninput=function(){txtFlatEarthRadius.value=sldFlatEarthRadius.value,FlatEarth.diameter=sldFlatEarthRadius.value;let t=parseFloat(sldFlatEarthRadius.value)/flatEarthRadius;if(scaling=new BABYLON.Vector3(t,t,t),FlatEarth.scaling=scaling,arrayWayPoints.length>0){for(var a=0;a<arrayWayPoints.length-1;a++){arrayWayPoints[a].orthodromic.lineFE.scaling=scaling,arrayWayPoints[a].loxodromic.lineFE.scaling=scaling,arrayWayPoints[a].flatdromic.lineFE.scaling=scaling;let t=arrayWayPoints[a].vFEMarker;t=t.multiply(scaling),arrayWayPoints[a].spFEMarker.position=t}let t=arrayWayPoints[arrayWayPoints.length-1].vFEMarker;t=t.multiply(scaling),arrayWayPoints[arrayWayPoints.length-1].spFEMarker.position=t}},sldAverageSpeed.oninput=function(){txtAverageSpeed.value=sldAverageSpeed.value};var mymap=L.map("mapid").setView([0,0],2);L.tileLayer("https://maptiles.p.rapidapi.com/es/map/v1/{z}/{x}/{y}.png?rapidapi-key=31f25ca2abmshcd0d4037e122b23p127cfdjsn5401d61bc576",{attribution:'&copy: <a href="https://www.maptilesapi.com/">MapTiles API</a>, Datos de Mapa &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:15}).addTo(mymap),mymap.doubleClickZoom.disable(),mymap.options.minZoom=1;var southWest=L.latLng(-89.999,-180),northEast=L.latLng(89.999,180),bounds=L.latLngBounds(southWest,northEast);function clearMarker(t){mymap.removeLayer(markers[t]),markers.splice(t,1);for(var a=t;a<markers.length;a++){markers[a].options.id=markers[a].options.id-1;var e="<p>"+markers[a].options.id+"</p></br><p>"+markers[a].getLatLng()+'</p></br><button onclick="clearMarker('+markers[a].options.id+')">Clear Marker</button>';markers[a].bindPopup(e,{closeButton:!1})}t!=arrayWayPoints.length-1?(arrayWayPoints[t].orthodromic.line.dispose(),arrayWayPoints[t].orthodromic.lineFE.dispose(),arrayWayPoints[t].loxodromic.line.dispose(),arrayWayPoints[t].loxodromic.lineFE.dispose(),arrayWayPoints[t].flatdromic.line.dispose(),arrayWayPoints[t].flatdromic.lineFE.dispose()):0!=t&&(arrayWayPoints[t-1].orthodromic.line.dispose(),arrayWayPoints[t-1].orthodromic.lineFE.dispose(),arrayWayPoints[t-1].loxodromic.line.dispose(),arrayWayPoints[t-1].loxodromic.lineFE.dispose(),arrayWayPoints[t-1].flatdromic.line.dispose(),arrayWayPoints[t-1].flatdromic.lineFE.dispose()),arrayWayPoints[t].spMarker.dispose(),arrayWayPoints[t].spFEMarker.dispose(),arrayWayPoints.splice(t,1);for(a=t;a<arrayWayPoints.length;a++)arrayWayPoints[a].id=arrayWayPoints[a].id-1;t!=arrayWayPoints.length&&arrayWayPoints[t].updateWayPoint(t),arrayPath.splice(t,1),0!=arrayPathLine.length&&arrayPathLine.removeFrom(mymap),arrayPathLine=L.polyline(arrayPath).addTo(mymap)}mymap.setMaxBounds(bounds),mymap.on("drag",(function(){mymap.panInsideBounds(bounds,{animate:!1})})),mymap.on("dblclick",(t=>{let a=mymap.mouseEventToLatLng(t.originalEvent);if(a=a.wrap(),marker=new L.marker(L.latLng(a.lat,a.lng),{draggable:"true",clickable:"true",id:arrayWayPoints.length}),popupContent="<p>"+marker.options.id+"</p></br><p>"+a+'</p></br><button onclick="clearMarker('+marker.options.id+')">Clear Marker</button>',marker.bindPopup(popupContent,{closeButton:!1}).openPopup(),mymap.addLayer(marker),marker.addTo(mymap),markers[markers.length]=marker,arrayPath.push(a.wrap()),0!=arrayPathLine.length&&arrayPathLine.removeFrom(mymap),arrayPathLine=L.polyline(arrayPath).addTo(mymap),marker.on("dragend",(function(t){var a=t.target.getLatLng();a=a.wrap(),markers[t.target.options.id]._latlng=a,popupContent="<p>"+markers[t.target.options.id].options.id+"</p><p>"+a+'</p><button onclick="clearMarker('+markers[t.target.options.id].options.id+')">Clear Marker</button>',markers[t.target.options.id].bindPopup(popupContent,{closeButton:!1}).openPopup(),arrayPath[t.target.options.id]=a.wrap(),arrayPathLine.removeFrom(mymap),arrayPathLine=L.polyline(arrayPath).addTo(mymap),arrayWayPoints[t.target.options.id].P=a,arrayWayPoints[t.target.options.id].updateWayPoint(t.target.options.id,a)})),arrayWayPoints[arrayWayPoints.length]=new WayPoint(arrayWayPoints.length,a),null!=arrayWayPoints[0]&&null!=arrayWayPoints[arrayWayPoints.length-1]){let t,a;t=arrayWayPoints[0].P,a=arrayWayPoints[arrayWayPoints.length-1].P}}));