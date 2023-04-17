import { animate } from '@angular/animations';
import { Component,OnInit,AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit,AfterViewInit {

  /* @ViewChild('canvas')
  private canvasRef!: ElementRef
  //proprieté du cube
  @Input() public texture: string = '/assets/texture.jpg'
  @Input() public size: number = 200;
  @Input() public rotationSpeedY:number = 0.01
  @Input() public rotationSpeedX:number = 0.05
  //proprieté de la scene
  @Input() public cameraZ: number = 400;
  @Input() public fov: number = 1;
  @Input('nearClipping') public nearClippingPlane = 1;
  @Input('farClipping') public farClippingPlane = 1000;

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1,1,1);
  private material = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry,this.material);
  private renderer!: THREE.WebGL1Renderer;
  private scene!: THREE.Scene ;



  private createScene(){
    //*Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private cubeAnimation(){
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop(){
    //*Renderer
    this.renderer = new THREE.WebGL1Renderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight);

    let component = this;
    (function render(){
      requestAnimationFrame(render);
      component.cubeAnimation();
      component.renderer.render(component.scene,component.camera);
    })
  } */


  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene ;
  private controls!: OrbitControls;

  ngOnInit(): void {
    this.scene = new THREE.Scene;

    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    this.camera.layers.enable(1);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    /* this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = -0.25;
    */
    this.controls.listenToKeyEvents(window);
    document.body.appendChild(this?.renderer?.domElement)


    let materialArray: Array<any> = [];
    let texture_ft = new THREE.TextureLoader().load('assets/1.png');
    let texture_bk = new THREE.TextureLoader().load('assets/2.png');
    let texture_up = new THREE.TextureLoader().load('assets/3.png');
    let texture_dn = new THREE.TextureLoader().load('assets/4.png');
    let texture_rt = new THREE.TextureLoader().load('assets/5.png');
    let texture_lt = new THREE.TextureLoader().load('assets/6.png');


    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lt}))

    for(let i=0;i<6;i++){
      materialArray[i].side  = THREE.BackSide;
    }


    let skyBoxGeo = new THREE.BoxGeometry(100,100,100);
    skyBoxGeo.scale(1,1,1);
    let skybox = new THREE.Mesh(skyBoxGeo);
    skybox.layers.enable(1);

    this.camera.layers.enable(3);
    let cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe : true}));
    cube.position.x = 0.5;
    cube.position.y = 0.5;
    cube.position.z = -0.5;
    cube.layers.set(3);
    this.scene.add(cube);
    this.scene.add(skybox);


    this.renderer.render(this?.scene,this?.camera);
    requestAnimationFrame(animate);

  }


  render(){
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  ngAfterViewInit(): void {
    this.render();
  }

}
