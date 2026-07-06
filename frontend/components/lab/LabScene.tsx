"use client";

import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useCursor, TransformControls } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { useLabStore, PhysicsObject } from '../../store';

function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0], type: 'Static' })) as any;
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#1a1a1a" roughness={1} metalness={0} />
    </mesh>
  );
}

function PhysicalCube({ id, position, mass, color, charge }: PhysicsObject) {
  const [ref, api] = useBox(() => ({ mass, position, args: [1, 1, 1] })) as any;
  const { selectedObjectId, setSelectedObjectId } = useLabStore();
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);
  const isSelected = selectedObjectId === id;

  // Simple anti-gravity / repulsion effect based on charge
  // If charge is high, apply an upward force constantly
  useEffect(() => {
    if (charge > 0) {
      const interval = setInterval(() => {
        api.applyForce([0, charge * 5, 0], [0, 0, 0]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [charge, api]);

  return (
    <mesh
      ref={ref}
      castShadow
      onPointerOver={(e: any) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e: any) => { e.stopPropagation(); setSelectedObjectId(id); }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={isSelected ? color : '#000'} emissiveIntensity={isSelected ? 0.5 : 0} />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new (require('three').BoxGeometry)(1.1, 1.1, 1.1)]} />
          <lineBasicMaterial color="#ffffff" />
        </lineSegments>
      )}
    </mesh>
  );
}

function PhysicalSphere({ id, position, mass, color, charge }: PhysicsObject) {
  const [ref, api] = useSphere(() => ({ mass, position, args: [0.75] })) as any;
  const { selectedObjectId, setSelectedObjectId } = useLabStore();
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);
  const isSelected = selectedObjectId === id;

  useEffect(() => {
    if (charge > 0) {
      const interval = setInterval(() => {
        api.applyForce([0, charge * 5, 0], [0, 0, 0]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [charge, api]);

  return (
    <mesh
      ref={ref}
      castShadow
      onPointerOver={(e: any) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e: any) => { e.stopPropagation(); setSelectedObjectId(id); }}
    >
      <sphereGeometry args={[0.75, 32, 32]} />
      <meshStandardMaterial color={color} emissive={isSelected ? color : '#000'} emissiveIntensity={isSelected ? 0.5 : 0} />
    </mesh>
  );
}

export default function LabScene() {
  const { gravity, objects, setSelectedObjectId } = useLabStore();

  return (
    <div className="h-full w-full relative outline-none" onClick={() => setSelectedObjectId(null)}>
      <Canvas shadows camera={{ position: [0, 8, 20], fov: 45 }}>
        <color attach="background" args={['#0A0A12']} />
        
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[10, 20, 10]} intensity={2} shadow-mapSize={[2048, 2048]} shadow-camera-far={50} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#534AB7" />
        
        <Environment preset="night" />
        <Grid infiniteGrid fadeDistance={100} sectionColor="#444" cellColor="#222" />
        
        <Physics gravity={[0, gravity, 0]} defaultContactMaterial={{ restitution: 0.5 }}>
          <Ground />
          {objects.map(obj => {
            if (obj.type === 'cube') {
              return <PhysicalCube key={obj.id} {...obj} />;
            }
            if (obj.type === 'sphere') {
              return <PhysicalSphere key={obj.id} {...obj} />;
            }
            return null;
          })}
        </Physics>
        
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>
    </div>
  );
}
