import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function House({ floors = 1, area = 120, style = 'modern' }) {
    const groupRef = useRef();
    const width = Math.sqrt(area / floors) * 0.08;
    const depth = width * 1.2;
    const floorHeight = 0.6;
    const totalHeight = floorHeight * floors;

    const isModern = style === 'modern' || style === 'minimalist';

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    const wallColor = isModern ? '#E8E0D8' : '#D4C4A8';
    const roofColor = isModern ? '#2C3E50' : '#8B4513';
    const windowColor = '#87CEEB';

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            {/* Foundation */}
            <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[width + 0.3, 0.1, depth + 0.3]} />
                <meshStandardMaterial color="#999" roughness={0.8} />
            </mesh>

            {/* Walls for each floor */}
            {Array.from({ length: floors }).map((_, i) => (
                <group key={i} position={[0, i * floorHeight + floorHeight / 2, 0]}>
                    {/* Main walls */}
                    <mesh>
                        <boxGeometry args={[width, floorHeight, depth]} />
                        <meshStandardMaterial color={wallColor} roughness={0.6} />
                    </mesh>

                    {/* Front windows */}
                    {[-width * 0.25, width * 0.25].map((x, j) => (
                        <mesh key={`fw-${j}`} position={[x, 0, depth / 2 + 0.01]}>
                            <planeGeometry args={[width * 0.18, floorHeight * 0.45]} />
                            <meshStandardMaterial
                                color={windowColor}
                                transparent
                                opacity={0.7}
                                metalness={0.5}
                                roughness={0.1}
                            />
                        </mesh>
                    ))}

                    {/* Side windows */}
                    <mesh position={[width / 2 + 0.01, 0, 0]}>
                        <planeGeometry args={[depth * 0.25, floorHeight * 0.45]} />
                        <meshStandardMaterial
                            color={windowColor}
                            transparent
                            opacity={0.7}
                            metalness={0.5}
                            roughness={0.1}
                        />
                    </mesh>

                    {/* Floor separator line */}
                    {i > 0 && (
                        <mesh position={[0, -floorHeight / 2, 0]}>
                            <boxGeometry args={[width + 0.02, 0.02, depth + 0.02]} />
                            <meshStandardMaterial color="#BBB" />
                        </mesh>
                    )}
                </group>
            ))}

            {/* Roof */}
            {isModern ? (
                /* Flat modern roof */
                <mesh position={[0, totalHeight + 0.05, 0]}>
                    <boxGeometry args={[width + 0.2, 0.1, depth + 0.2]} />
                    <meshStandardMaterial color={roofColor} roughness={0.4} metalness={0.2} />
                </mesh>
            ) : (
                /* Pitched traditional roof */
                <group position={[0, totalHeight, 0]}>
                    <mesh rotation={[0, 0, 0]}>
                        <coneGeometry args={[Math.max(width, depth) * 0.75, 0.6, 4]} />
                        <meshStandardMaterial color={roofColor} roughness={0.7} />
                    </mesh>
                </group>
            )}

            {/* Front door */}
            <mesh position={[0, floorHeight * 0.25, depth / 2 + 0.01]}>
                <planeGeometry args={[width * 0.15, floorHeight * 0.5]} />
                <meshStandardMaterial color="#5D4037" roughness={0.8} />
            </mesh>

            {/* Ground plane */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 6]} />
                <meshStandardMaterial color="#90C695" roughness={0.9} />
            </mesh>
        </group>
    );
}

export default function HouseViewer({ project }) {
    const floors = parseInt(project?.floors) || 1;
    const area = parseInt(project?.area) || 120;
    const style = project?.style || 'modern';

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '350px', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas
                camera={{ position: [3, 2.5, 4], fov: 45 }}
                style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #F0F8FF 100%)' }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
                <directionalLight position={[-3, 4, -3]} intensity={0.3} />

                <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0}>
                    <House floors={floors} area={area} style={style} />
                </Float>

                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    maxPolarAngle={Math.PI / 2.2}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
