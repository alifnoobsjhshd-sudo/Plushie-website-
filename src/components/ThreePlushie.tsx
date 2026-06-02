import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playSqueak, playTickle } from './AudioSynth';

interface ThreePlushieProps {
  primaryColor: string;
  bellyColor: string;
  cheekColor: string;
  accentType: 'dino' | 'bear' | 'frog' | 'sprout';
  accessory: 'none' | 'scarf' | 'bow' | 'sprout_leaf' | 'flower';
  triggerSquish?: number; // incremental number to trigger squash-and-stretch
  triggerTickle?: number;
  triggerFeed?: number;
  isMuted?: boolean;
}

export default function ThreePlushie({
  primaryColor,
  bellyColor,
  cheekColor,
  accentType,
  accessory,
  triggerSquish = 0,
  triggerTickle = 0,
  triggerFeed = 0,
  isMuted = false,
}: ThreePlushieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Animation groups/refs to drive dynamic movement
  const plushGroupRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);
  const bodyRef = useRef<THREE.Mesh | null>(null);
  const tailRef = useRef<THREE.Mesh | null>(null);
  const earsGroupRef = useRef<THREE.Group | null>(null);
  const accessoryGroupRef = useRef<THREE.Group | null>(null);
  const accentGroupRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Mesh | null>(null);
  const rightArmRef = useRef<THREE.Mesh | null>(null);
  const leftLegRef = useRef<THREE.Mesh | null>(null);
  const rightLegRef = useRef<THREE.Mesh | null>(null);

  // Mouse tracking state
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const [isWaving, setIsWaving] = useState(false);
  
  // Custom interactive animations
  const squishProgress = useRef(0);
  const tickleProgress = useRef(0);
  const feedProgress = useRef(0);
  const isSqueezing = useRef(false);
  const isTickling = useRef(false);
  const isFeeding = useRef(false);

  // We save the latest props in a ref so they are accessible inside the render loop instantly
  const propsRef = useRef({ primaryColor, bellyColor, cheekColor, accentType, accessory });
  useEffect(() => {
    propsRef.current = { primaryColor, bellyColor, cheekColor, accentType, accessory };
    // Trigger sweet bubble or squeak on manual customization
    if (!isMuted) {
      // Just a gentle feedback
    }
  }, [primaryColor, bellyColor, cheekColor, accentType, accessory, isMuted]);

  // Handle external squeeze trigger
  useEffect(() => {
    if (triggerSquish > 0) {
      isSqueezing.current = true;
      squishProgress.current = 1.0;
      if (!isMuted) playSqueak();
    }
  }, [triggerSquish, isMuted]);

  // Handle external tickle ear trigger
  useEffect(() => {
    if (triggerTickle > 0) {
      isTickling.current = true;
      tickleProgress.current = 1.0;
      if (!isMuted) playTickle();
    }
  }, [triggerTickle, isMuted]);

  // Handle feed trigger
  useEffect(() => {
    if (triggerFeed > 0) {
      isFeeding.current = true;
      feedProgress.current = 1.5; // duration parameter
    }
  }, [triggerFeed]);

  // Re-build plushie meshes whenever colors, types, or accessories change
  const rebuildPlushieGeometry = () => {
    if (!sceneRef.current || !plushGroupRef.current) return;

    // 1. Clear current character child objects from the plush group
    const group = plushGroupRef.current;
    while(group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const { primaryColor: prCol, bellyColor: blCol, cheekColor: chCol, accentType: acc, accessory: accs } = propsRef.current;
    
    // Create consistent premium soft physical materials
    const mainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(prCol),
      roughness: 0.95, // felt texture absorption
      metalness: 0.05,
    });

    const bellyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(blCol),
      roughness: 0.95,
      metalness: 0.02,
    });

    const cheekMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(chCol),
      roughness: 0.98,
      metalness: 0.0,
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.8, // super glossy eye look
    });

    const eyeHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.01,
      metalness: 0.9,
    });

    const blackFeltMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9,
    });

    // Create the body group to hold the head, torso, accessories
    const bodyObjRef = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 24),
      mainMat
    );
    bodyObjRef.scale.set(1.1, 1.25, 1.0); // Slightly tall egg shape
    bodyObjRef.position.set(0, -0.4, 0);
    bodyRef.current = bodyObjRef;
    group.add(bodyObjRef);

    // Belly plate
    const bellyGeometry = new THREE.SphereGeometry(0.85, 24, 18);
    const bellyObj = new THREE.Mesh(bellyGeometry, bellyMat);
    bellyObj.scale.set(1.0, 1.15, 0.5); // Flat oval front belly
    bellyObj.position.set(0, -0.4, 0.8);
    group.add(bellyObj);

    // Head container group (to allow rotating the head towards the cursor!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.7, 0.1);
    headRef.current = headGroup;
    group.add(headGroup);

    // Main Head Sphere
    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 32, 24),
      mainMat
    );
    headMesh.scale.set(1.15, 1.05, 1.1); // cute slightly chubby head
    headGroup.add(headMesh);

    // Chubby Cheeks (left and right)
    const cheekGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const leftCheek = new THREE.Mesh(cheekGeom, cheekMat);
    leftCheek.position.set(-0.72, -0.22, 1.02);
    leftCheek.scale.set(1.3, 0.8, 0.8);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeom, cheekMat);
    rightCheek.position.set(0.72, -0.22, 1.02);
    rightCheek.scale.set(1.3, 0.8, 0.8);
    headGroup.add(rightCheek);

    // Glossy Anime Eyes with dual white highlights (gives pure life!)
    const eyeGeom = new THREE.SphereGeometry(0.15, 16, 16);
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.45, 0.08, 1.1);
    leftEye.scale.set(1, 1.15, 0.75);
    
    const leftHilite1 = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), eyeHighlightMat);
    leftHilite1.position.set(-0.4, 0.15, 1.18);
    const leftHilite2 = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), eyeHighlightMat);
    leftHilite2.position.set(-0.5, 0.02, 1.18);
    
    headGroup.add(leftEye);
    headGroup.add(leftHilite1);
    headGroup.add(leftHilite2);

    // Right eye
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.45, 0.08, 1.1);
    rightEye.scale.set(1, 1.15, 0.75);

    const rightHilite1 = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), eyeHighlightMat);
    rightHilite1.position.set(0.5, 0.15, 1.18);
    const rightHilite2 = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), eyeHighlightMat);
    rightHilite2.position.set(0.4, 0.02, 1.18);

    headGroup.add(rightEye);
    headGroup.add(rightHilite1);
    headGroup.add(rightHilite2);

    // Cute curved tiny mouth (using torus or a tiny black curve)
    // We can simulate an adorable tiny cat-like mouth 'w' or just a tiny upside-down triangle/smile
    const mouthGeom = new THREE.TorusGeometry(0.09, 0.028, 8, 16, Math.PI);
    const mNodeL = new THREE.Mesh(mouthGeom, blackFeltMat);
    mNodeL.position.set(-0.07, -0.16, 1.18);
    mNodeL.rotation.set(0, 0, Math.PI);
    headGroup.add(mNodeL);

    const mNodeR = new THREE.Mesh(mouthGeom, blackFeltMat);
    mNodeR.position.set(0.07, -0.16, 1.18);
    mNodeR.rotation.set(0, 0, Math.PI);
    headGroup.add(mNodeR);

    // Arms: Rounded capsules pointing slightly forward/outwards
    const armGeom = new THREE.SphereGeometry(0.35, 16, 16);
    
    const armL = new THREE.Mesh(armGeom, mainMat);
    armL.scale.set(0.9, 1.5, 0.9);
    armL.position.set(-1.15, -0.28, 0.2);
    armL.rotation.z = 0.5;
    leftArmRef.current = armL;
    group.add(armL);

    const armR = new THREE.Mesh(armGeom, mainMat);
    armR.scale.set(0.9, 1.5, 0.9);
    armR.position.set(1.15, -0.28, 0.2);
    armR.rotation.z = -0.5;
    rightArmRef.current = armR;
    group.add(armR);

    // Legs: Stubby oval feet on the bottom of the body
    const legGeom = new THREE.SphereGeometry(0.42, 16, 16);
    
    const footL = new THREE.Mesh(legGeom, mainMat);
    footL.scale.set(1.1, 0.9, 1.3);
    footL.position.set(-0.7, -1.35, 0.45);
    leftLegRef.current = footL;
    group.add(footL);

    const footR = new THREE.Mesh(legGeom, mainMat);
    footR.scale.set(1.1, 0.9, 1.3);
    footR.position.set(0.7, -1.35, 0.45);
    rightLegRef.current = footR;
    group.add(footR);

    // Custom pads on bottom of feet (cream/belly color!)
    const footPadGeom = new THREE.SphereGeometry(0.32, 16, 16);
    const padL = new THREE.Mesh(footPadGeom, bellyMat);
    padL.scale.set(1.0, 0.1, 1.2);
    padL.position.set(-0.7, -1.78, 0.48);
    padL.rotation.x = -0.2;
    group.add(padL);

    const padR = new THREE.Mesh(footPadGeom, bellyMat);
    padR.scale.set(1.0, 0.1, 1.2);
    padR.position.set(0.7, -1.78, 0.48);
    padR.rotation.x = -0.2;
    group.add(padR);

    // Create the Accents (Ear, Tail, Horns, Spikes based on type!)
    const accentGrp = new THREE.Group();
    accentGroupRef.current = accentGrp;
    
    if (acc === 'dino') {
      // Dino spikes: 3 elegant yellow-orange spikes on back of head and body
      const spikeGeom = new THREE.ConeGeometry(0.2, 0.4, 4);
      const spikeMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.9 });
      
      const spike1 = new THREE.Mesh(spikeGeom, spikeMat);
      spike1.position.set(0, 1.25, -0.3);
      spike1.rotation.set(-0.4, 0, 0);
      headGroup.add(spike1);

      const spike2 = new THREE.Mesh(spikeGeom, spikeMat);
      spike2.position.set(0, 0.9, -0.85);
      spike2.rotation.set(-0.8, 0, 0);
      headGroup.add(spike2);

      const spike3 = new THREE.Mesh(spikeGeom, spikeMat);
      spike3.position.set(0, -0.4, -1.35);
      spike3.rotation.set(-1.2, 0, 0);
      group.add(spike3);

      // Tail: thick soft dino tail
      const tailGeom = new THREE.ConeGeometry(0.45, 1.1, 16);
      const dinoTail = new THREE.Mesh(tailGeom, mainMat);
      dinoTail.position.set(0, -1.0, -1.0);
      dinoTail.rotation.set(-1.1, 0, 0); // pointing back and up
      tailRef.current = dinoTail;
      group.add(dinoTail);
      
    } else if (acc === 'bear') {
      // Bear ears: Two friendly chubby round ears on upper head sides
      const earGeom = new THREE.SphereGeometry(0.42, 16, 16);
      const innerEarGeom = new THREE.SphereGeometry(0.26, 16, 16);
      
      // Left ear
      const leftEar = new THREE.Mesh(earGeom, mainMat);
      leftEar.position.set(-0.9, 0.95, -0.1);
      leftEar.scale.set(1.0, 1.0, 0.5);
      leftEar.rotation.set(0, 0, -0.4);
      
      const leftInnerEar = new THREE.Mesh(innerEarGeom, cheekMat);
      leftInnerEar.position.set(-0.9, 0.95, 0.1);
      leftInnerEar.scale.set(1.0, 1.0, 0.4);
      leftInnerEar.rotation.set(0, 0, -0.4);
      
      headGroup.add(leftEar);
      headGroup.add(leftInnerEar);

      // Right ear
      const rightEar = new THREE.Mesh(earGeom, mainMat);
      rightEar.position.set(0.9, 0.95, -0.1);
      rightEar.scale.set(1.0, 1.0, 0.5);
      rightEar.rotation.set(0, 0, 0.4);

      const rightInnerEar = new THREE.Mesh(innerEarGeom, cheekMat);
      rightInnerEar.position.set(0.9, 0.95, 0.1);
      rightInnerEar.scale.set(1.0, 1.0, 0.4);
      rightInnerEar.rotation.set(0, 0, 0.4);

      headGroup.add(rightEar);
      headGroup.add(rightInnerEar);

      // Cute small bear muzzle
      const snoutGeom = new THREE.SphereGeometry(0.32, 16, 16);
      const snout = new THREE.Mesh(snoutGeom, bellyMat);
      snout.position.set(0, -0.18, 1.0);
      snout.scale.set(1.2, 0.8, 0.6);
      headGroup.add(snout);

      // Bear nose node
      const noseGeom = new THREE.SphereGeometry(0.1, 16, 16);
      const nose = new THREE.Mesh(noseGeom, blackFeltMat);
      nose.position.set(0, -0.06, 1.25);
      nose.scale.set(1.3, 0.7, 0.7);
      headGroup.add(nose);
      
    } else if (acc === 'frog') {
      // Frog: Large round eyes extending on top of head
      const frogEyeBaseGeom = new THREE.SphereGeometry(0.38, 16, 16);
      
      const leftEyeBase = new THREE.Mesh(frogEyeBaseGeom, mainMat);
      leftEyeBase.position.set(-0.55, 1.1, 0.2);
      headGroup.add(leftEyeBase);

      const rightEyeBase = new THREE.Mesh(frogEyeBaseGeom, mainMat);
      rightEyeBase.position.set(0.55, 1.1, 0.2);
      headGroup.add(rightEyeBase);

      // Redefine standard eyes in higher position for froggy look!
      const leftFrogEyeInner = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eyeMat);
      leftFrogEyeInner.position.set(-0.5, 1.18, 0.42);
      leftFrogEyeInner.scale.set(1, 1, 0.6);
      headGroup.add(leftFrogEyeInner);

      const rightFrogEyeInner = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eyeMat);
      rightFrogEyeInner.position.set(0.5, 1.18, 0.42);
      rightFrogEyeInner.scale.set(1, 1, 0.6);
      headGroup.add(rightFrogEyeInner);

      // Tiny highlights
      const frogH1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeHighlightMat);
      frogH1.position.set(-0.45, 1.24, 0.49);
      const frogH2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeHighlightMat);
      frogH2.position.set(0.55, 1.24, 0.49);
      headGroup.add(frogH1);
      headGroup.add(frogH2);

    } else if (acc === 'sprout') {
      // Sprout branch on top of head!
      const stemGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x8d5b4c, roughness: 0.9 });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.set(0, 1.45, 0);
      stem.rotation.z = -0.15;
      headGroup.add(stem);

      // Two green leaves springing from the stem
      const leafGeom = new THREE.SphereGeometry(0.25, 16, 16);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.8 });
      
      const leafL = new THREE.Mesh(leafGeom, leafMat);
      leafL.scale.set(1.4, 0.1, 0.65);
      leafL.position.set(-0.18, 1.74, 0.05);
      leafL.rotation.set(0.3, 0.2, 0.5);
      headGroup.add(leafL);

      const leafR = new THREE.Mesh(leafGeom, leafMat);
      leafR.scale.set(1.4, 0.1, 0.65);
      leafR.position.set(0.18, 1.74, -0.05);
      leafR.rotation.set(-0.3, -0.2, -0.5);
      headGroup.add(leafR);
    }

    // Render Accessories
    const accGrpObj = new THREE.Group();
    accessoryGroupRef.current = accGrpObj;
    
    if (accs === 'scarf') {
      // Cozy Red wrap-around scarf!
      const scarfMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.92 });
      
      // Neck loop representing the scarf wrap
      const scarfRingGeom = new THREE.TorusGeometry(0.85, 0.16, 12, 32);
      const scarfRing = new THREE.Mesh(scarfRingGeom, scarfMat);
      scarfRing.position.set(0, 0.18, 0.08);
      scarfRing.rotation.x = Math.PI / 2 + 0.15;
      scarfRing.scale.set(0.9, 0.9, 1.2);
      accGrpObj.add(scarfRing);

      // Hanging scarf tails
      const tailP1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.08), scarfMat);
      tailP1.position.set(-0.35, -0.15, 0.8);
      tailP1.rotation.set(0.2, 0.1, 0.35);
      accGrpObj.add(tailP1);

      const tailP2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.08), scarfMat);
      tailP2.position.set(-0.18, -0.18, 0.82);
      tailP2.rotation.set(0.2, -0.1, 0.2);
      accGrpObj.add(tailP2);
      
    } else if (accs === 'bow') {
      // Big yellow Collar Bow-tie!
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xfca311, roughness: 0.85 });
      
      const knotGeom = new THREE.SphereGeometry(0.1, 16, 16);
      const knot = new THREE.Mesh(knotGeom, bowMat);
      knot.position.set(0, 0.08, 0.95);
      accGrpObj.add(knot);

      const leftLoopGeom = new THREE.ConeGeometry(0.18, 0.44, 16);
      const leftLoop = new THREE.Mesh(leftLoopGeom, bowMat);
      leftLoop.position.set(-0.24, 0.08, 0.92);
      leftLoop.rotation.z = Math.PI / 2;
      leftLoop.rotation.y = 0.2;
      accGrpObj.add(leftLoop);

      const rightLoop = leftLoop.clone();
      rightLoop.position.set(0.24, 0.08, 0.92);
      rightLoop.rotation.z = -Math.PI / 2;
      rightLoop.rotation.y = -0.2;
      accGrpObj.add(rightLoop);
      
    } else if (accs === 'sprout_leaf') {
      // Extra companion leaf pinned behind the ear!
      const accessoryLeafGeom = new THREE.SphereGeometry(0.18, 16, 16);
      const accessoryLeafMat = new THREE.MeshStandardMaterial({ color: 0x81c784, roughness: 0.8 });
      
      const pinLeaf = new THREE.Mesh(accessoryLeafGeom, accessoryLeafMat);
      pinLeaf.scale.set(1.5, 0.12, 0.8);
      pinLeaf.position.set(0.85, 1.05, 0.32);
      pinLeaf.rotation.set(0.4, 0.5, 1.2);
      accGrpObj.add(pinLeaf);

      const leafStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18), new THREE.MeshStandardMaterial({color:0x3e2723}));
      leafStem.position.set(0.72, 0.98, 0.32);
      leafStem.rotation.z = 0.5;
      accGrpObj.add(leafStem);

    } else if (accs === 'flower') {
      // Golden yellow flower crown or single hair clip flower
      const flowerCenterMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.9 });
      const petalMat = new THREE.MeshStandardMaterial({ color: 0xfff, roughness: 0.9 });
      
      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(-0.55, 1.15, 0.65);
      flowerGroup.rotation.set(-0.6, -0.4, 0.3);

      const center = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), flowerCenterMat);
      center.scale.set(1.0, 1.0, 0.5);
      flowerGroup.add(center);

      // 5 petals surrounding center
      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), petalMat);
        petal.scale.set(1.5, 0.6, 0.4);
        const angle = (pIdx * Math.PI * 2) / 5;
        petal.position.set(Math.cos(angle) * 0.15, Math.sin(angle) * 0.15, 0.0);
        petal.rotation.z = angle;
        flowerGroup.add(petal);
      }
      
      accGrpObj.add(flowerGroup);
    }

    group.add(accGrpObj);
  };

  // Setup the Main Three Scene, Lights, Camera
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    // Set explicit starting container width/height
    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // Create scene, camera, renderer with anti-aliasing and shadow-map
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Use a lovely subtle cream/warm transparent light-themed skybox
    scene.background = null; // transparent background so web layouts bubble through

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5); // frame the cute plushie beautifully
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create custom plushie central anchor group
    const plushGroup = new THREE.Group();
    // Tilt a tiny bit forward for optimal soft visual presentation
    plushGroup.rotation.set(0.08, 0, 0);
    plushGroup.position.set(0, -0.1, 0);
    scene.add(plushGroup);
    plushGroupRef.current = plushGroup;

    // Setup beautiful high-fidelity lighting
    const ambientLight = new THREE.AmbientLight(0xfffaee, 0.84); // ambient glow
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.15);
    mainLight.position.set(5, 5, 6);
    scene.add(mainLight);

    const pinkBakeLight = new THREE.DirectionalLight(0xffe3e0, 0.5); // peach backlighting
    pinkBakeLight.position.set(-6, -2, -4);
    scene.add(pinkBakeLight);

    const softFillLight = new THREE.DirectionalLight(0xdcfce7, 0.4); // light green ground bounce light
    softFillLight.position.set(0, -6, 2);
    scene.add(softFillLight);

    // Initial builder pass
    rebuildPlushieGeometry();

    // Mouse interactive movement listeners
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      // Map to normal coordinates (-1 to 1)
      const nx = (clientX / rect.width) * 2 - 1;
      const ny = -(clientY / rect.height) * 2 + 1;

      mousePos.current.x = nx;
      mousePos.current.y = ny;

      // Bound character rotation limits
      targetRotation.current.y = nx * 0.45; // Turn left/right
      targetRotation.current.x = -ny * 0.3 + 0.08; // Pitch up/down slightly
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = event.touches[0].clientX - rect.left;
      const clientY = event.touches[0].clientY - rect.top;

      const nx = (clientX / rect.width) * 2 - 1;
      const ny = -(clientY / rect.height) * 2 + 1;

      mousePos.current.x = nx;
      mousePos.current.y = ny;

      targetRotation.current.y = nx * 0.35;
      targetRotation.current.x = -ny * 0.2 + 0.08;
    };

    const handleMouseLeave = () => {
      // Slowly return plushie head & body to clean center
      targetRotation.current.x = 0.08;
      targetRotation.current.y = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    // WebGL Canvas responsive resizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = Math.floor(entry.contentRect.width || width);
      const newHeight = Math.floor(entry.contentRect.height || height);
      
      if (rendererRef.current && cameraRef.current) {
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // Animation Tick Frame Loop
    let lastTime = 0;
    let clock = new THREE.Clock();
    let animId: number;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (plushGroupRef.current) {
        // 1. Idle rotation/breathing animation
        // Gently bob up and down
        plushGroupRef.current.position.y = -0.1 + Math.sin(elapsedTime * 1.8) * 0.06;
        
        // Gentle breathing scale expansion
        const scaleBreath = 1.0 + Math.sin(elapsedTime * 2.1) * 0.012;
        if (bodyRef.current) {
          bodyRef.current.scale.set(1.1 * scaleBreath, 1.25, 1.0 * scaleBreath);
        }

        // Tail wagging if we have a tail spike (Dino)
        if (tailRef.current) {
          tailRef.current.rotation.y = Math.sin(elapsedTime * 3.5) * 0.18;
          tailRef.current.rotation.z = Math.cos(elapsedTime * 3.5) * 0.1;
        }

        // Left/Right hands swaying like a cute wave
        if (leftArmRef.current && rightArmRef.current) {
          if (isWaving) {
            // Cute active wave
            leftArmRef.current.rotation.z = 0.5 + Math.sin(elapsedTime * 10) * 0.3;
            leftArmRef.current.rotation.x = -0.2;
            rightArmRef.current.rotation.z = -0.5 + Math.sin(elapsedTime * 2) * 0.05;
          } else {
            // Idle arm float
            leftArmRef.current.rotation.z = 0.5 + Math.sin(elapsedTime * 1.5) * 0.06;
            rightArmRef.current.rotation.z = -0.5 - Math.sin(elapsedTime * 1.5) * 0.06;
          }
        }

        // 2. Head follow interaction using tracking targets
        if (headRef.current) {
          // Double-check head rotation limits
          headRef.current.rotation.y += (targetRotation.current.y * 1.5 - headRef.current.rotation.y) * 0.12;
          headRef.current.rotation.x += (targetRotation.current.x - headRef.current.rotation.x) * 0.12;
          
          // Cute head tilt
          headRef.current.rotation.z = headRef.current.rotation.y * 0.22;
        }

        // 3. Dynamic squash and stretch animation for "Squeeze" action
        if (isSqueezing.current) {
          squishProgress.current -= delta * 3.2; // decay quick
          if (squishProgress.current <= 0) {
            squishProgress.current = 0;
            isSqueezing.current = false;
          }
          // Apply sinusoidal bounce squish
          const currentSquishAmount = Math.sin(squishProgress.current * Math.PI) * 0.4;
          plushGroupRef.current.scale.set(
            1 + currentSquishAmount * 0.4,  // X stretches out
            1 - currentSquishAmount * 0.9,  // Y squashes down
            1 + currentSquishAmount * 0.3   // Z stretches
          );
        }

        // 4. Dynamic shimmy wiggle for "Tickle ears"
        if (isTickling.current) {
          tickleProgress.current -= delta * 2.5;
          if (tickleProgress.current <= 0) {
            tickleProgress.current = 0;
            isTickling.current = false;
          }
          const tickleWiggle = Math.sin(tickleProgress.current * Math.PI * 6.0) * 0.24;
          plushGroupRef.current.rotation.z = tickleWiggle;
          if (headRef.current) {
            headRef.current.rotation.z += tickleWiggle * 0.5;
          }
        }

        // 5. Idle general slow base spin around vertical axis
        if (!isSqueezing.current && !isTickling.current && mousePos.current.x === 0) {
          // Slow passive rotation
          plushGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.4) * 0.18;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    // Trigger sweet active wave cycle on entry
    const waveTimer = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2400);
    }, 12000);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      clearInterval(waveTimer);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseLeave);
      resizeObserver.disconnect();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  // Update geometry when properties are modified
  useEffect(() => {
    rebuildPlushieGeometry();
  }, [primaryColor, bellyColor, cheekColor, accentType, accessory]);

  const handleModelClick = () => {
    // Squeeze the plushie natively on click!
    isSqueezing.current = true;
    squishProgress.current = 1.0;
    if (!isMuted) {
      playSqueak();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleModelClick();
    }
  };

  return (
    <div
      ref={containerRef}
      id="three-plushie-canvas-container"
      onClick={handleModelClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Interactive 3D preview of cartoon plushie model. Press Enter or Space to squeeze!"
      className="relative w-full h-full min-h-[420px] md:min-h-[480px] cursor-grab active:cursor-grabbing select-none group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 rounded-[48px]"
      title="Click & squeeze me!"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full drop-shadow-[0_20px_50px_rgba(46,125,50,0.18)]"
      />
      
      {/* 3D Model Floating Bubble Label */}
      <div className="absolute top-4 right-4 pointer-events-none bg-white/80 backdrop-blur-md text-emerald-800 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm border border-emerald-100 flex items-center gap-1.5 animate-bounce">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Squeeze Me!
      </div>

      {/* Sweet ambient floor shadow mapping */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 h-5 bg-emerald-950/5 rounded-full blur-xl pointer-events-none" />
    </div>
  );
}
