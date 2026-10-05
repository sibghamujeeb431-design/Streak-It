import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { LabBench } from '../3d/LabBench'
import { Microscope } from '../3d/Microscope'
import { ReagentBottle3D } from '../3d/ReagentBottle3D'
import { SlideTray } from '../3d/SlideTray'

export function GramStaining3DScene() {
  return (
    <div className="w-full h-[600px] bg-surface rounded-card overflow-hidden">
      <Canvas shadows>
        {/* Camera - slightly elevated perspective looking at workbench */}
        <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={45} />

        {/* Orbit controls for viewing */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />

        {/* Soft laboratory lighting */}
        <ambientLight intensity={0.4} color="#E8E8E8" />

        {/* Main directional light - overhead lab lighting */}
        <directionalLight
          position={[2, 5, 2]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={10}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />

        {/* Fill light - cool laboratory atmosphere */}
        <pointLight position={[-2, 3, -2]} intensity={0.3} color="#B8D4E8" />

        {/* Rim light for depth */}
        <pointLight position={[0, 2, -3]} intensity={0.2} color="#E8E8E8" />

        {/* Environment map for realistic reflections */}
        <Environment preset="studio" background={false} />

        {/* Ground plane */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.9} metalness={0.0} />
        </mesh>

        {/* Background wall */}
        <mesh position={[0, 2, -2]} receiveShadow>
          <planeGeometry args={[10, 6]} rotation={[0, 0, 0]} />
          <meshStandardMaterial color="#E8E4D9" roughness={0.95} metalness={0.0} />
        </mesh>

        {/* Laboratory workbench */}
        <LabBench />

        {/* Microscope */}
        <Microscope />

        {/* Slide tray with prepared slide */}
        <SlideTray />

        {/* Reagent bottles */}
        <ReagentBottle3D
          position={[-1.2, 0.84, 0.2]}
          liquidColor="#5B21B6"
          labelColor="#9333EA"
        />
        <ReagentBottle3D
          position={[-1.0, 0.84, 0.2]}
          liquidColor="#3B1A78"
          labelColor="#7C3AED"
        />
        <ReagentBottle3D
          position={[-0.8, 0.84, 0.2]}
          liquidColor="#8A7FB0"
          labelColor="#A78BFA"
        />
        <ReagentBottle3D
          position={[-0.6, 0.84, 0.2]}
          liquidColor="#B4344A"
          labelColor="#EF4444"
        />

        {/* Waste container */}
        <mesh position={[1.8, 0.9, -0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#D0D0D0" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[1.8, 1.01, -0.3]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Paper towel roll */}
        <mesh position={[1.6, 0.9, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
          <meshStandardMaterial color="#F5F5F0" roughness={0.9} metalness={0.0} />
        </mesh>
      </Canvas>
    </div>
  )
}
