import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { LabBench } from '../3d/LabBench'
import { Microscope } from '../3d/Microscope'
import { ReagentBottle3D } from '../3d/ReagentBottle3D'
import { SlideTray } from '../3d/SlideTray'

export function GramStaining3DScene() {
  return (
    <div className="w-full h-[600px] bg-surface rounded-card overflow-hidden">
      <Canvas shadows>
        {/* Fixed overhead camera - wide view of entire workstation */}
        <PerspectiveCamera makeDefault position={[0, 4.5, 2.5]} fov={55} />

        {/* Enhanced laboratory lighting */}
        <ambientLight intensity={0.5} color="#F0F4F8" />

        {/* Main directional light - overhead lab lighting */}
        <directionalLight
          position={[0, 8, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={15}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />

        {/* Fill light - cool laboratory atmosphere */}
        <pointLight position={[-3, 4, -2]} intensity={0.4} color="#C8E8F8" />

        {/* Rim light for depth */}
        <pointLight position={[0, 3, -4]} intensity={0.3} color="#E8E8E8" />

        {/* Environment map for realistic reflections */}
        <Environment preset="studio" background={false} />

        {/* Ground plane */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.9} metalness={0.0} />
        </mesh>

        {/* Background wall */}
        <mesh position={[0, 2.5, -2.5]} rotation={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="#E8E4D9" roughness={0.95} metalness={0.0} />
        </mesh>

        {/* Laboratory workbench */}
        <LabBench />

        {/* Slide tray with prepared slide - PRIMARY work area, center */}
        <SlideTray />

        {/* Reagent bottles - left side, well-spaced row */}
        {/* Crystal Violet - violet */}
        <ReagentBottle3D
          position={[-1.6, 0.84, 0.3]}
          liquidColor="#8B5CF6"
          labelColor="#7C3AED"
          name="CRYSTAL\nVIOLET"
        />
        {/* Gram's Iodine - amber/brown */}
        <ReagentBottle3D
          position={[-1.1, 0.84, 0.3]}
          liquidColor="#D97706"
          labelColor="#B45309"
          name="GRAM'S\nIODINE"
        />
        {/* Decolorizer - clear */}
        <ReagentBottle3D
          position={[-0.6, 0.84, 0.3]}
          liquidColor="#E5E7EB"
          labelColor="#9CA3AF"
          name="DECOLORIZER"
        />
        {/* Safranin - pink/red */}
        <ReagentBottle3D
          position={[-0.1, 0.84, 0.3]}
          liquidColor="#EF4444"
          labelColor="#DC2626"
          name="SAFRANIN"
        />

        {/* Staining/rinse basin - center */}
        <mesh position={[0.3, 0.85, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.1, 0.5]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0.3, 0.86, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.08, 0.4]} />
          <meshStandardMaterial color="#F0F8FF" roughness={0.1} metalness={0.0} transparent opacity={0.6} />
        </mesh>

        {/* Bacterial culture/sample container - center */}
        <mesh position={[0.7, 0.85, 0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.03, 32]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.3} metalness={0.1} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.7, 0.86, 0.3]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.01, 32]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.8} metalness={0.0} />
        </mesh>
        <mesh position={[0.7, 0.87, 0.3]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
          <meshStandardMaterial color="#E8E0D0" roughness={0.3} metalness={0.1} transparent opacity={0.7} />
        </mesh>

        {/* Microscope - right side */}
        <Microscope />

        {/* Inoculating loop - right side */}
        <mesh position={[1.8, 0.86, 0.2]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 16]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[1.8, 0.86, 0.2]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 16]} />
          <meshStandardMaterial color="#D0D0D0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Loop at the end */}
        <mesh position={[1.93, 1.1, 0.2]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <torusGeometry args={[0.025, 0.004, 8, 16]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Paper towel roll - drying area */}
        <mesh position={[1.9, 0.93, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.4, 16]} />
          <meshStandardMaterial color="#FAFAF5" roughness={0.95} metalness={0.0} />
        </mesh>
        <mesh position={[1.9, 0.93, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 16]} />
          <meshStandardMaterial color="#E8E8E0" roughness={0.9} metalness={0.0} />
        </mesh>
      </Canvas>
    </div>
  )
}
