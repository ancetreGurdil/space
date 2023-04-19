import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import { fromEvent, Observable, Subscription } from 'rxjs';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500 );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
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
    this.addGeometry();
    //
    this.render();
  }

  addRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    document.body.appendChild(this.renderer.domElement);
  }

  addControls(){
    this.controls.enabled = true;
    this.controls.enableZoom = false;
    this.camera.position.z = -0.01;
    this.camera.position.y = 25 ;


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


    /* const geometry = new THREE.BoxGeometry(400,400,400); */

    /* geometry.scale(0.5, 0.5, -0.5) */

   /*  const materials = [];

    let texture_ft = new THREE.TextureLoader().load('assets/front.png')
    let texture_bk = new THREE.TextureLoader().load('assets/back.png')
    let texture_up = new THREE.TextureLoader().load('assets/up.png')
    let texture_dn = new THREE.TextureLoader().load('assets/down.png')
    let texture_rt = new THREE.TextureLoader().load('assets/right.png')
    let texture_lt = new THREE.TextureLoader().load('assets/left.png')

    materials.push(new THREE.MeshBasicMaterial({map: texture_ft}));
    materials.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    materials.push(new THREE.MeshBasicMaterial({map: texture_up}));
    materials.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    materials.push(new THREE.MeshBasicMaterial({map: texture_rt}));
    materials.push(new THREE.MeshBasicMaterial({map: texture_lt})); */



    /* const skyBox = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:'grey'}));
    skyBox.layers.set(1);
    this.scene.add(skyBox); */


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

  }

  render() {
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
