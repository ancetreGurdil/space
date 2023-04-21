import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import { fromEvent, Observable, Subscription } from 'rxjs';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { log } from 'console';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {

  public controls: OrbitControls;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public resizeObservable: Observable<Event> = new Observable;
  public resizeSubscription: Subscription = new Subscription;
  raycaster = new THREE.Raycaster();
  public pointer : THREE.Vector2;
  meshBoxPtOurse!: THREE.MeshBasicMaterial;
  ptOursMesh!: THREE.Mesh;
  lineMaterial!: THREE.LineBasicMaterial;

  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500 );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.pointer = new THREE.Vector2(0,0);
  }

  ngOnInit(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.onWindowResize()
    });


  }

  ngAfterViewInit(): void {
    this.addRenderer()
    this.addControls();
    this.addPtOurse();
    this.addGeometry();
    this.render();
    this.addAudio();
    window.addEventListener('mousemove', ((event)=> {
      // Mettre à jour les coordonnées de la souris
      console.log('c\'est moi');
      this.pointer = new THREE.Vector2(0,0);
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    }));
   }

  addRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    document.body.appendChild(this.renderer.domElement);
  }

  addControls(){
    this.controls.enabled = true;
    this.controls.enableZoom = true;
    this.camera.position.z = -0.01;
    this.camera.position.y = 25 ;
  }
  addAudio(){
    const listener = new THREE.AudioListener();
    this.camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'assets/Outer-Wilds.ogg', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 1);
      sound.play();
    });
  }

  addGeometry(){
    let axesHelper = new THREE.AxesHelper( 5 ).setColors(new THREE.Color("rgb(255, 0, 0)"),new THREE.Color("rgb(0,255, 0)"),new THREE.Color("rgb(0, 0, 255)"));
    this.scene.add( axesHelper );
    this.camera.layers.enable(1);

    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      vertices.push(
        new THREE.Vector3(
          Math.random() * 600 - 300 + 100,
          Math.random() * 600 - 300 + 100,
          Math.random() * 600 - 300 + 100
        )
      );
    }
    const bufferGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const material = new THREE.PointsMaterial({ size: 1, color: 0xffffff });
    const mesh = new THREE.Points(bufferGeometry, material);
    this.scene.add(mesh);
  }


  addPtOurse(){
    let meshSpheresPtOursArray = [];
    for(let i = 0;i<7;i++){
      let meshSphere : THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(1,32,16), new THREE.MeshBasicMaterial({color: 'rgb(0,255,0)'}));
      meshSpheresPtOursArray.push(meshSphere)
      this.scene.add(meshSphere);
    }
    // position de la petite ourse
    meshSpheresPtOursArray[0].position.set(0,-150,300);
    meshSpheresPtOursArray[1].position.set(10,-150,260);
    meshSpheresPtOursArray[2].position.set(12,-150,210);
    meshSpheresPtOursArray[3].position.set(-2,-150,170);
    meshSpheresPtOursArray[4].position.set(-25,-150,140);
    meshSpheresPtOursArray[5].position.set(14,-150,153);
    meshSpheresPtOursArray[6].position.set(-15,-150,120);


    this.lineMaterial = new THREE.LineBasicMaterial({ transparent:true,opacity:0 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      // tracé de tous les points
      new THREE.Vector3(meshSpheresPtOursArray[0].position.x, meshSpheresPtOursArray[0].position.y, meshSpheresPtOursArray[0].position.z), // Premier point
      new THREE.Vector3(meshSpheresPtOursArray[1].position.x, meshSpheresPtOursArray[1].position.y, meshSpheresPtOursArray[1].position.z), // Premier point
      new THREE.Vector3(meshSpheresPtOursArray[2].position.x, meshSpheresPtOursArray[2].position.y, meshSpheresPtOursArray[2].position.z), // Premier point
      new THREE.Vector3(meshSpheresPtOursArray[3].position.x, meshSpheresPtOursArray[3].position.y, meshSpheresPtOursArray[3].position.z),
      new THREE.Vector3(meshSpheresPtOursArray[4].position.x, meshSpheresPtOursArray[4].position.y, meshSpheresPtOursArray[4].position.z), // Premier point
      new THREE.Vector3(meshSpheresPtOursArray[6].position.x, meshSpheresPtOursArray[6].position.y, meshSpheresPtOursArray[6].position.z), // Premier point
      new THREE.Vector3(meshSpheresPtOursArray[5].position.x, meshSpheresPtOursArray[5].position.y, meshSpheresPtOursArray[5].position.z),
      new THREE.Vector3(meshSpheresPtOursArray[3].position.x, meshSpheresPtOursArray[3].position.y, meshSpheresPtOursArray[3].position.z),
    ]);
    const line = new THREE.Line(lineGeometry, this.lineMaterial);
    this.scene.add(line);
    const boxPtOurse = new THREE.BoxGeometry(50,10,190)
    this.meshBoxPtOurse = new THREE.MeshBasicMaterial({opacity:0,transparent:true});
    this.ptOursMesh = new THREE.Mesh(boxPtOurse, this.meshBoxPtOurse);
    this.ptOursMesh.position.set(-6,-149,210);
    this.scene.add(this.ptOursMesh);
  }

  render() {
    // Utiliser le détecteur pour récupérer les objets cliqués
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    // Parcourir les objets cliqués
    if(intersects.length == 0) {
      this.lineMaterial.opacity = 0;
      this.lineMaterial.transparent = true;
    }else {
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        // Si l'objet est la GeometryBox que vous souhaitez modifier
        if (obj === this.ptOursMesh) {
          // Modifiez la couleur de l'objet
          this.lineMaterial.opacity = 1;
          this.lineMaterial.transparent = false;
        }
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  ngOnDestroy(){
    this.resizeSubscription.unsubscribe()
  }

    //TODO: https://www.npmjs.com/package/buttonvr
}
