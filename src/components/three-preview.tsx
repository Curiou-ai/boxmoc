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

    // Standard packaging dimensions often use inches. We scale them for visual representation.
    // Base unit: 1 unit = 1 inch
    const { width, height, depth } = dimensions;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    // Controls for full 3D rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = !imageUrl; // Auto-rotate only if no image yet
    controls.autoRotateSpeed = 1.0;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    // Cardboard base material
    const baseColor = new THREE.Color(0xc3a683);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: baseColor, 
        metalness: 0.05, 
        roughness: 0.8 
    });

    let materials: THREE.Material[] = Array(6).fill(baseMaterial);
    
    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    // Apply texture if provided
    if (imageUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, 
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // For a box, we usually apply the design to specific faces or all faces
                // For this preview, we'll wrap the design across all faces for impact
                const designMaterial = new THREE.MeshStandardMaterial({ 
                    map: texture, 
                    metalness: 0.1, 
                    roughness: 0.5 
                });
                
                mesh.material = Array(6).fill(designMaterial);
                (mesh.material as THREE.Material[]).forEach(mat => mat.needsUpdate = true);
            },
            undefined,
            (error) => {
                console.error('Texture loading failed:', error);
            }
        );
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Position camera based on box size
    const maxDim = Math.max(width, height, depth);
    camera.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 2);
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

  return <div ref={mountRef} className="w-full h-full rounded-lg cursor-grab active:cursor-grabbing" />;
};

export default ThreePreview;
