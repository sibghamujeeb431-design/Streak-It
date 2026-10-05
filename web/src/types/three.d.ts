import type { Object3DNode } from '@react-three/fiber'
import type * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>
      hemisphereLight: Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>
      boxGeometry: any
      sphereGeometry: any
      cylinderGeometry: any
      planeGeometry: any
      circleGeometry: any
      coneGeometry: any
      torusGeometry: any
      meshStandardMaterial: any
      meshBasicMaterial: any
      meshPhongMaterial: any
      meshLambertMaterial: any
    }
  }
}

export {}
