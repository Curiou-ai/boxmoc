
"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreePreviewProps {
  imageUrl?: string;
  productType?: 'box' | 'card' | 'bag' | string;
  dimensions?: {
      width: number;
      height: number;
      depth: number;
  };
}

const ThreePreview: React.FC<ThreePreviewProps> = ({ 
    imageUrl, 
    productType = 'box',
    dimensions = { width: 4, height: 4, depth: 4 }
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;

    // Dimensions in inches, scale for visibility
    const { width, height, depth } = dimensions;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Modern Grid Helper
    const grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
    if (grid.material instanceof THREE.Material) {
      grid.material.opacity = 0.05;
      grid.material.transparent = true;
    }
    grid.position.y = -(height / 2) - 0.01;
    scene.add(grid);

    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    const baseColor = new THREE.Color(0xFFFFFF); // White cardboard base
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: baseColor, 
        metalness: 0.0, 
        roughness: 0.9 
    });

    let materials: THREE.Material[] = Array(6).fill(baseMaterial);
    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    if (imageUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, 
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                
                const designMaterial = new THREE.MeshStandardMaterial({ 
                    map: texture, 
                    metalness: 0.0, 
                    roughness: 0.7 
                });
                
                mesh.material = Array(6).fill(designMaterial);
                (mesh.material as THREE.Material[]).forEach(mat => mat.needsUpdate = true);
            }
        );
    }

    // High quality lighting for modern SaaS feel
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(5, 10, 7.5);
    scene.add(topLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 0.4);
    sideLight.position.set(-5, 5, -5);
    scene.add(sideLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Initial camera position
    const maxDim = Math.max(width, height, depth);
    camera.position.set(maxDim * 2, maxDim * 1.5, maxDim * 2.5);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if(currentMount){
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        geometry.dispose();
        (mesh.material as THREE.Material[]).forEach(material => material.dispose());
        renderer.dispose();
        controls.dispose();
    };
  }, [imageUrl, dimensions]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default ThreePreview;
