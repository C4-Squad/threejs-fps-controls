var Harvest = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function startGame() {

    // Singleton

	var camera, scene, renderer;
	var geometry, material, mesh;
	var controls;
	const raycaster = new THREE.Raycaster();
	var showCords = false;
	var objects = [];

	var WON = false;
	var timer;
    var fog = 100;

	var playerBoxGeometry;
	var playerboxmaterial;
	var playerboxmesh;
	var texture = THREE.ImageUtils.loadTexture("img/test1.png");

	init();
	animate();

	var prevTime = performance.now();
	var velocity = new THREE.Vector3();

	function createBox(x,y,z,xx,yy,zz) {
		playerBoxGeometry = new THREE.BoxGeometry( xx, yy, zz );
		playerboxmaterial = new THREE.MeshNormalMaterial( {wireframe: true, reflectivity: 0.5} );

		playerboxmesh = new THREE.Mesh( playerBoxGeometry, playerboxmaterial );
		playerboxmesh.position.x = x;
		playerboxmesh.position.y = y;
		playerboxmesh.position.z = z;

		objects.push( playerboxmesh );
		scene.add( playerboxmesh );
	}

	


	function init() {

		initialiseTimer();
		initialiseCords();
		eventHandlers();
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xffffff, 0, fog + 1000 );

		// Sky
		var pwd = window.location.href.substring(0, window.location.href.indexOf('/'));
		var sky = new THREE.SphereGeometry(8000, 32, 32); // radius, widthSegments, heightSegments

		skyBox = new THREE.Mesh(sky);
		skyBox.scale.set(-1, 1, 1);
		skyBox.eulerOrder = 'XZY';
		skyBox.renderDepth = 1000.0;
		scene.add(skyBox);

		// Floor
		//geometry = new THREE.BoxGeometry(25, 10, 25, 1, 1, 1);
		geometry = new THREE.BoxGeometry(1000, 10, 1000, 1, 1, 1);
		var material = new THREE.MeshNormalMaterial( {wireframe: false, reflectivity: 0, opacity: 0.5, transparent: true} );
		var floorMesh = new THREE.Mesh( geometry, material );
		objects.push( floorMesh );
		scene.add( floorMesh  );

		playerSphereGeometry = new THREE.SphereGeometry( 10, 10, 10 );
		playerspherematerial = new THREE.MeshNormalMaterial( {wireframe: true, reflectivity: 0.5} );
		playerspheremesh = new THREE.Mesh( playerSphereGeometry, playerspherematerial );
		playerspheremesh.position.x = 0;
		playerspheremesh.position.y = 0;
		playerspheremesh.position.z = 0;

		objects.push( playerspheremesh );
		scene.add( playerspheremesh );

		/*for (var i = -25; i < 25; i++ ) {
			for (var j = -25; j < 25; j++ ) {
			
				//var material = new THREE.MeshBasicMaterial( {vertexColors: true} );
				//var material = new THREE.MeshDepthMaterial( {vertexColors: false} );
				var material = new THREE.MeshNormalMaterial( {wireframe: false, reflectivity: 0, opacity: 0.5, transparent: true} );
				
				//material.setValues( {map: texture} );

				var floorMesh = new THREE.Mesh( geometry, material );
	
				//floorMesh.position.x = i*25;
				//floorMesh.position.z = j*25;
				objects.push( floorMesh );
				scene.add( floorMesh  );
			}
		}*/

		// Boxes
		/*var boxGeometry = new THREE.BoxGeometry( 25, 25, 25 );
		for ( var i = 0; i < 10; i ++ ) {
			
			var boxmaterial = new THREE.MeshNormalMaterial( {wireframe: true, reflectivity: 0.5} );

			var boxmesh = new THREE.Mesh( boxGeometry, boxmaterial );

			boxZ = 0;
			boxmesh.position.x = Math.floor( Math.random() * 25 ) * 25;
			//boxmesh.position.y = Math.floor( Math.random() * 20 ) * boxZ + 10;
			boxmesh.position.z = Math.floor( Math.random() * 25 ) * 25;

			boxes.push( boxmesh );
			objects.push( boxmesh );
			scene.add( boxmesh );
		}*/


		camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 1000 );
		controls = new THREE.PointerLockControls( camera, 100, 100, true, objects );
		scene.add( controls.getPlayer() );

		renderer = new THREE.WebGLRenderer({ antialias: true }); //new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		ScreenOverlay(controls); //
		document.body.appendChild( renderer.domElement );

	}

	function animate() {

		requestAnimationFrame( animate );

		if ( controls.enabled ) {

            controls.updateControls();

		}

		if ( showCords == true) {

			document.getElementById("x").innerHTML = String(controls.getPlayer().position.x.toPrecision(5));
			document.getElementById("y").innerHTML = String(controls.getPlayer().position.y.toPrecision(5));
			document.getElementById("z").innerHTML = String(controls.getPlayer().position.z.toPrecision(5));

		}

		//createBox(controls.getPlayer().position.x,controls.getPlayer().position.y,controls.getPlayer().position.z,50,50,50)

		controls.updateWorldObjects(objects);
		const pointer = new THREE.Vector2();
		pointer.x = 0;
		pointer.y = 0;
		raycaster.setFromCamera( pointer, camera );
		const intersects = raycaster.intersectObjects( scene.children );

		for ( let i = 0; i < intersects.length; i ++ ) {
			
			playerspheremesh.position.copy( intersects[ i ].point );

		}


		renderer.render( scene, camera );

	}

	function randomTexture(maxTextures) {
		return Math.floor(Math.random() * maxTextures) + 1;
	}

	function initialiseTimer() {
		var sec = 0;
		function pad ( val ) { return val > 9 ? val : "0" + val; }

		timer = setInterval( function(){
			document.getElementById("seconds").innerHTML = String(pad(++sec%60));
			document.getElementById("minutes").innerHTML = String(pad(parseInt(sec/60,10)));
		}, 1000);
	}

	function initialiseCords() {
		showCords = true;
	}

	function eventHandlers() {

		// Keyboard press handlers
		var onKeyDown = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, true); };
		var onKeyUp = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, false); };
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );

		// Resize Event
		window.addEventListener( 'resize', onWindowResize, false );
	}

	// HANDLE KEY INTERACTION
	function handleKeyInteraction(keyCode, boolean) {
		var isKeyDown = boolean;

		switch(keyCode) {
			case 38: // up
			case 87: // w
				controls.movements.forward = boolean;
				playerboxmesh.position = controls.getPlayer().position.clone();
				break;

			case 40: // down
			case 83: // s
				controls.movements.backward = boolean;
				playerboxmesh.position = controls.getPlayer().position.clone();
				break;

			case 37: // left
			case 65: // a
				controls.movements.left = boolean;
				playerboxmesh.position = controls.getPlayer().position.clone();
				break;

			case 39: // right
			case 68: // d
				controls.movements.right = boolean;
				playerboxmesh.position = controls.getPlayer().position.clone();
				break;

			case 32: // space
				if (!isKeyDown) {
					controls.jump();
					playerboxmesh.position = controls.getPlayer().position.clone();
				}
				break;

            case 16: // shift
                controls.walk(boolean);
				playerboxmesh.position = controls.getPlayer().position.clone();
                break;

            case 67: // crouch (CTRL + W etc destroys tab in Chrome!)
                controls.crouch(boolean);
				playerboxmesh.position = controls.getPlayer().position.clone();

		}
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}


	function fallingBoxes(cube, pos, delay) {
		//console.log(cube,pos,delay)
		setTimeout(function() { cube.position.setY(pos); }, delay);
	}

    return {
		// Public methods and variables
		setFog: function (setFog) {
			fog = setFog;
		},
		setJumpFactor: function (setJumpFactor) {
			jumpFactor = setJumpFactor;
		}

    };

  };

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if ( !instance ) {
        instance = startGame();
      }

      return instance;
    }

  };

})();

harvest = Harvest.getInstance();
