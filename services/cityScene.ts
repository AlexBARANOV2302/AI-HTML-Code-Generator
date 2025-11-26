export const citySceneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>3D City Simulation</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: radial-gradient(circle at 20% 20%, #1d2d44, #0b1321 50%, #050912 100%);
      color: #e8eef5;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    #overlay {
      position: fixed;
      top: 12px;
      left: 12px;
      background: rgba(12, 18, 34, 0.72);
      border: 1px solid rgba(111, 213, 255, 0.35);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 0 25px rgba(71, 197, 255, 0.25);
      padding: 14px 16px;
      border-radius: 12px;
      max-width: 360px;
      backdrop-filter: blur(8px);
    }
    #overlay h1 {
      margin: 0 0 6px;
      font-size: 18px;
      letter-spacing: 0.4px;
      color: #73e6ff;
    }
    #overlay p {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      color: #c9d8e8;
    }
    #legend {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 10px;
      margin-top: 8px;
      font-size: 12px;
      color: #e4f2ff;
    }
    .swatch {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-top: 3px;
    }
    .swatch.building { background: linear-gradient(145deg, #99b3cc, #6d829c); }
    .swatch.road { background: linear-gradient(145deg, #2c2f36, #16181d); }
    .swatch.park { background: linear-gradient(145deg, #5fd37b, #2f8b4a); }
    .swatch.traffic { background: linear-gradient(145deg, #ff8b5f, #ff3b3b); }
    canvas { display: block; }
  </style>
</head>
<body>
  <div id="overlay">
    <h1>3D City Simulation</h1>
    <p>
      Procedural downtown with animated traffic, strolling people, lush parks, and responsive camera controls.
      Use your mouse or trackpad to orbit, zoom, and pan around the living city.
    </p>
    <div id="legend">
      <span class="swatch building"></span><span>Buildings & skyline</span>
      <span class="swatch road"></span><span>Road grid with lane markers</span>
      <span class="swatch park"></span><span>Parks, plazas, and tree canopy</span>
      <span class="swatch traffic"></span><span>Cars following realistic loops</span>
    </div>
  </div>
  <canvas id="scene"></canvas>

  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script src="https://unpkg.com/three@0.160.0/examples/js/controls/OrbitControls.js"></script>
  <script>
    const canvas = document.getElementById('scene');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1421, 0.009);
    scene.background = new THREE.Color(0x0b1321);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(70, 65, 70);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0xc7e8ff, 0x0f1623, 0.9);
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(80, 120, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -120;
    sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120;
    sun.shadow.camera.bottom = -120;
    scene.add(sun);

    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x0f1928 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2027, roughness: 0.4, metalness: 0.2 });
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f7ff, emissive: 0xf4f7ff, emissiveIntensity: 0.35 });

    const createRoad = (width, length, x, z, rotation = 0) => {
      const roadGeo = new THREE.PlaneGeometry(width, length);
      const road = new THREE.Mesh(roadGeo, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotation;
      road.position.set(x, 0.01, z);
      road.receiveShadow = true;
      scene.add(road);

      const dashCount = Math.floor(length / 10);
      const dashGeo = new THREE.BoxGeometry(width * 0.08, 0.02, 4);
      for (let i = 0; i < dashCount; i++) {
        const dash = new THREE.Mesh(dashGeo, lineMaterial);
        dash.position.set(x, 0.03, z - length / 2 + i * 10 + 5);
        dash.rotation.y = rotation;
        scene.add(dash);
      }
    };

    // Road grid
    createRoad(14, 240, 0, 0);
    createRoad(14, 240, 0, 32);
    createRoad(14, 240, 0, -32);
    createRoad(14, 240, 32, 0);
    createRoad(14, 240, -32, 0);
    createRoad(14, 200, 64, 0);
    createRoad(14, 200, -64, 0);

    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x7f8fa6, metalness: 0.45, roughness: 0.28 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fd2ff, emissive: 0x2da4ff, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 });

    const createBuilding = (x, z, w, d, h) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const building = new THREE.Mesh(geom, buildingMat);
      building.castShadow = true;
      building.receiveShadow = true;
      building.position.set(x, h / 2, z);
      scene.add(building);

      const windowGeom = new THREE.BoxGeometry(w * 0.96, h * 0.06, d * 0.04);
      for (let i = 0; i < h / 3.5; i++) {
        const stripe = new THREE.Mesh(windowGeom, glassMat);
        stripe.position.set(x, i * 3.5 + 2, z + d / 2 + 0.02);
        stripe.rotation.y = Math.PI;
        scene.add(stripe.clone());
        stripe.position.set(x, i * 3.5 + 2, z - d / 2 - 0.02);
        scene.add(stripe.clone());
      }
    };

    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        if (Math.abs(i) < 1 && Math.abs(j) < 1) continue;
        const posX = i * 20;
        const posZ = j * 20;
        const width = 12 + Math.random() * 4;
        const depth = 10 + Math.random() * 6;
        const height = 12 + Math.random() * 32;
        createBuilding(posX, posZ, width, depth, height);
      }
    }

    const parkGeo = new THREE.PlaneGeometry(28, 28);
    const parkMat = new THREE.MeshStandardMaterial({ color: 0x2d8b4a, roughness: 0.9 });
    const park = new THREE.Mesh(parkGeo, parkMat);
    park.rotation.x = -Math.PI / 2;
    park.position.set(48, 0.015, 48);
    park.receiveShadow = true;
    scene.add(park);

    const benchGeo = new THREE.BoxGeometry(6, 0.6, 1.5);
    const benchLegGeo = new THREE.BoxGeometry(0.4, 1, 0.4);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0xc2a476, roughness: 0.7 });
    for (let i = -1; i <= 1; i++) {
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(48 + i * 8, 1, 40);
      bench.castShadow = true;
      scene.add(bench);
      const leg1 = new THREE.Mesh(benchLegGeo, benchMat);
      leg1.position.set(bench.position.x - 2.6, 0.5, bench.position.z - 0.4);
      leg1.castShadow = true;
      const leg2 = leg1.clone();
      leg2.position.x = bench.position.x + 2.6;
      scene.add(leg1, leg2);
    }

    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const treeLeafMat = new THREE.MeshStandardMaterial({ color: 0x4ac174, roughness: 0.5 });

    const createTree = (x, z) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 4, 8), treeTrunkMat);
      trunk.position.set(x, 2, z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 12), treeLeafMat);
      foliage.position.set(x, 5, z);
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      scene.add(foliage);
    };

    for (let k = 0; k < 28; k++) {
      const angle = (Math.PI * 2 * k) / 28;
      const radius = 14 + Math.random() * 3;
      createTree(48 + Math.cos(angle) * radius, 48 + Math.sin(angle) * radius);
    }

    for (let t = 0; t < 35; t++) {
      const x = -70 + Math.random() * 140;
      const z = -70 + Math.random() * 140;
      if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;
      createTree(x, z);
    }

    const createPerson = (x, z, color) => {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 2.5, 6, 12), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
      body.position.set(x, 2, z);
      body.castShadow = true;
      body.receiveShadow = true;
      scene.add(body);
      return body;
    };

    const people = [
      { mesh: createPerson(45, 40, 0xf2a65a), offset: 0 },
      { mesh: createPerson(51, 44, 0x7ad7f0), offset: 4 },
      { mesh: createPerson(40, 50, 0xff7f98), offset: 8 },
      { mesh: createPerson(55, 54, 0xb9ff66), offset: 12 }
    ];

    const createCar = (color) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2), new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 }));
      body.castShadow = true;
      body.receiveShadow = true;
      body.position.y = 1.2;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.8), new THREE.MeshStandardMaterial({ color: color + 0x111111, opacity: 0.9, transparent: true }));
      cabin.position.set(0.2, 1.8, 0);
      cabin.castShadow = true;
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 14);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      const wheels = [
        new THREE.Mesh(wheelGeo, wheelMat),
        new THREE.Mesh(wheelGeo, wheelMat),
        new THREE.Mesh(wheelGeo, wheelMat),
        new THREE.Mesh(wheelGeo, wheelMat)
      ];
      wheels[0].position.set(-1.6, 0.7, 1.1);
      wheels[1].position.set(1.6, 0.7, 1.1);
      wheels[2].position.set(-1.6, 0.7, -1.1);
      wheels[3].position.set(1.6, 0.7, -1.1);
      wheels.forEach(w => { w.castShadow = true; w.receiveShadow = true; group.add(w); });
      group.add(body, cabin);
      scene.add(group);
      return group;
    };

    const cars = [
      { mesh: createCar(0xff7b59), speed: 0.006, lane: 'east', offset: 0 },
      { mesh: createCar(0x67c2ff), speed: 0.0045, lane: 'west', offset: 30 },
      { mesh: createCar(0x82ff9e), speed: 0.0055, lane: 'north', offset: 60 },
      { mesh: createCar(0xffe066), speed: 0.004, lane: 'south', offset: 90 },
      { mesh: createCar(0xdeafff), speed: 0.0065, lane: 'ring', offset: 10 }
    ];

    const trafficLightMat = new THREE.MeshStandardMaterial({ color: 0xff5b61, emissive: 0xff5b61, emissiveIntensity: 0.7 });
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x222733, roughness: 0.8 });
    const createTrafficLight = (x, z) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6, 8), poleMat);
      pole.position.set(x, 3, z);
      pole.castShadow = true;
      scene.add(pole);
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), trafficLightMat);
      light.position.set(x, 5.2, z);
      light.castShadow = true;
      scene.add(light);
      return light;
    };

    const lights = [
      createTrafficLight(7, 7),
      createTrafficLight(-7, 7),
      createTrafficLight(7, -7),
      createTrafficLight(-7, -7)
    ];

    let time = 0;

    const updateCars = (delta) => {
      time += delta;
      const signal = Math.sin(time * 0.35) > 0;
      lights.forEach((light, idx) => {
        light.material.emissive.setHex(signal ? 0x63ff7c : 0xff5b61);
        light.material.color.setHex(signal ? 0x63ff7c : 0xff5b61);
        light.scale.set(1, signal ? 1.05 : 0.85, 1);
      });

      cars.forEach((car, index) => {
        const loop = 110;
        const t = (time * car.speed * 120 + car.offset) % loop;
        let x = 0, z = 0, heading = 0;

        switch (car.lane) {
          case 'east':
            if (t < 55) { x = -80 + t * 3; z = 7; heading = 0; }
            else { x = 80 - (t - 55) * 3; z = 7; heading = Math.PI; }
            break;
          case 'west':
            if (t < 55) { x = 80 - t * 3; z = -7; heading = Math.PI; }
            else { x = -80 + (t - 55) * 3; z = -7; heading = 0; }
            break;
          case 'north':
            if (t < 55) { x = 7; z = -80 + t * 3; heading = Math.PI / 2; }
            else { x = 7; z = 80 - (t - 55) * 3; heading = -Math.PI / 2; }
            break;
          case 'south':
            if (t < 55) { x = -7; z = 80 - t * 3; heading = -Math.PI / 2; }
            else { x = -7; z = -80 + (t - 55) * 3; heading = Math.PI / 2; }
            break;
          case 'ring':
            const radius = 36 + 6 * Math.sin(time * 0.5 + index);
            const ang = (t / loop) * Math.PI * 2;
            x = Math.cos(ang) * radius;
            z = Math.sin(ang) * radius;
            heading = -ang + Math.PI / 2;
            break;
        }

        if (!signal && Math.abs(x) < 8 && Math.abs(z) < 8) {
          car.mesh.visible = true;
        }

        car.mesh.position.set(x, 0, z);
        car.mesh.rotation.y = heading;
      });
    };

    const updatePeople = (delta) => {
      people.forEach((person, idx) => {
        const radius = 6 + idx * 1.4;
        const speed = 0.3 + idx * 0.05;
        const angle = (time * speed + person.offset) * 0.25;
        const px = 48 + Math.cos(angle) * radius;
        const pz = 48 + Math.sin(angle) * radius;
        person.mesh.position.set(px, 2, pz);
        person.mesh.rotation.y = -angle + Math.PI / 2;
        person.mesh.position.y = 2 + Math.sin(time * 2 + idx) * 0.08;
      });
    };

    const stars = new THREE.Group();
    const starGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0x9ccaff });
    for (let s = 0; s < 150; s++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set((Math.random() - 0.5) * 300, 90 + Math.random() * 60, (Math.random() - 0.5) * 300);
      stars.add(star);
    }
    scene.add(stars);

    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      controls.update();
      updateCars(delta);
      updatePeople(delta);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  </script>
</body>
</html>`;
