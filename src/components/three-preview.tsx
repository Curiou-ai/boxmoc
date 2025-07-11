"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreePreviewProps {
  imageUrl?: string;
  productType?: 'box' | 'card' | 'bag';
}

const ThreePreview: React.FC<ThreePreviewProps> = ({ imageUrl, productType = 'box' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    let geometry: THREE.BufferGeometry;

    switch(productType) {
        case 'card':
            geometry = new THREE.BoxGeometry(3.5, 2, 0.05);
            break;
        case 'bag':
            // A simplified tote bag shape using a thin box
            geometry = new THREE.BoxGeometry(3, 3.5, 0.1);
            break;
        case 'box':
        default:
            geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            break;
    }
    
    const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x778BCA, metalness: 0.1, roughness: 0.5 });
    let materials: THREE.Material[] = Array(6).fill(defaultMaterial);
    
    const mesh = new THREE.Mesh(geometry, materials);
    scene.add(mesh);

    if (imageUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, 
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                const imageMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.5 });
                mesh.material = Array(6).fill(imageMaterial);
                (mesh.material as THREE.Material[]).forEach(mat => mat.needsUpdate = true);
            },
            undefined,
            (error) => {
                console.error('An error happened loading the texture.', error);
            }
        );
    }

    camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
      
      // subtle mouse follow
      camera.position.x += (mouseX * 0.5 - camera.position.x) * .05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * .05;
      camera.lookAt(scene.position);

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
        window.removeEventListener('mousemove', onMouseMove);
        if (currentMount) {
            currentMount.removeChild(renderer.domElement);
        }
        geometry.dispose();
        (mesh.material as THREE.Material[]).forEach(material => material.dispose());
        renderer.dispose();
    };
  }, [imageUrl, productType]);

  return <div ref={mountRef} className="w-full h-full rounded-lg" />;
};

export default ThreePreview;
