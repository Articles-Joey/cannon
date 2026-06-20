import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/hooks/useStore'
import { degToRad } from 'three/src/math/MathUtils.js'

export function ModelToontownBetterSkybox({
  size = 500,
  height = 175,
  y = height / 2,
  cloudCubeSize = 500,
  cloudRotationSpeed = 0.0125,
  followCamera = false,
  skyTextureUrl = '/img/toontown/middaysky.jpg',
  cloudTextureUrl = '/img/toontown/toontown_central_clouds.png',
  ...props
}) {
  const rootRef = useRef()
  const cloudCubeRef = useRef()
  const { camera } = useThree()
  const skyTexture = useTexture(skyTextureUrl)
  const cloudTexture = useTexture(cloudTextureUrl)

  const darkMode = useStore(state => state.darkMode);

  skyTexture.colorSpace = THREE.SRGBColorSpace
  skyTexture.wrapS = THREE.ClampToEdgeWrapping
  skyTexture.wrapT = THREE.ClampToEdgeWrapping
  skyTexture.flipY = true
  skyTexture.needsUpdate = true

  cloudTexture.colorSpace = THREE.SRGBColorSpace
  cloudTexture.wrapS = THREE.RepeatWrapping
  cloudTexture.wrapT = THREE.RepeatWrapping
  cloudTexture.repeat.set(2, 1)
  cloudTexture.offset.set(0, 0)
  cloudTexture.flipY = false
  cloudTexture.needsUpdate = true

  const transparentMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    [],
  )

  const skyMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false }),
    [skyTexture],
  )

  useEffect(() => {
    skyMaterial.color.setScalar(darkMode ? 0.25 : 1)
    skyMaterial.needsUpdate = true
  }, [darkMode, skyMaterial])

  const cloudSideMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.35,
        alphaTest: 0.08,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    [cloudTexture],
  )

  useFrame((_, delta) => {
    if (followCamera && rootRef.current) {
      rootRef.current.position.x = camera.position.x
      rootRef.current.position.z = camera.position.z
    }

    if (cloudCubeRef.current) {
      cloudCubeRef.current.rotation.y += cloudRotationSpeed * delta
    }
  })

  return (
    <group ref={rootRef} {...props}>
      <mesh position={[0, y, 0]} renderOrder={-100} frustumCulled={false}>
        <boxGeometry args={[size, height, size]} />
        <primitive object={skyMaterial} attach="material-0" />
        <primitive object={skyMaterial} attach="material-1" />
        <primitive object={transparentMaterial} attach="material-2" />
        <primitive object={transparentMaterial} attach="material-3" />
        <primitive object={skyMaterial} attach="material-4" />
        <primitive object={skyMaterial} attach="material-5" />
      </mesh>

      <mesh ref={cloudCubeRef} position={[0, y, 0]} rotation={[degToRad(180), 0, 0]} renderOrder={-99} frustumCulled={false}>
        <boxGeometry args={[cloudCubeSize, cloudCubeSize / 2, cloudCubeSize]} />
        <primitive object={cloudSideMaterial} attach="material-0" />
        <primitive object={cloudSideMaterial} attach="material-1" />
        <primitive object={transparentMaterial} attach="material-2" />
        <primitive object={transparentMaterial} attach="material-3" />
        <primitive object={cloudSideMaterial} attach="material-4" />
        <primitive object={cloudSideMaterial} attach="material-5" />
      </mesh>
    </group>
  )
}

useTexture.preload('/img/toontown/middaysky.jpg')
useTexture.preload('/img/toontown/toontown_central_clouds.png')