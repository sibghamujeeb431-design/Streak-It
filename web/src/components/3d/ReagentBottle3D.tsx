import { Text } from '@react-three/drei'

interface ReagentBottle3DProps {
  position: [number, number, number]
  liquidColor: string
  labelColor: string
  name: string
}

export function ReagentBottle3D({ position, liquidColor, labelColor, name }: ReagentBottle3DProps) {
  return (
    <group position={position}>
      {/* Bottle body - slightly tapered */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.22, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} transparent opacity={0.85} />
      </mesh>

      {/* Neck - narrower section */}
      <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} transparent opacity={0.85} />
      </mesh>

      {/* Liquid inside - fills most of body */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.16, 16]} />
        <meshStandardMaterial color={liquidColor} roughness={0.2} metalness={0.1} transparent opacity={0.8} />
      </mesh>

      {/* Cap - screw cap style */}
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Cap ridges for grip */}
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.047, 0.047, 0.04, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Label - larger and more prominent */}
      <mesh position={[0, 0.01, 0.08]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.09, 0.1, 0.01]} />
        <meshStandardMaterial color={labelColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Label border */}
      <mesh position={[0, 0.01, 0.081]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.092, 0.102, 0.005]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Text label - reagent name */}
      <Text
        position={[0, 0.01, 0.09]}
        fontSize={0.025}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.08}
        lineHeight={1.1}
      >
        {name}
      </Text>
    </group>
  )
}
