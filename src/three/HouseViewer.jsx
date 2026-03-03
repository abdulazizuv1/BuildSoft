import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ── Helper: window panel with frame ── */
function WindowPanel({ position, width, height, rotation = [0, 0, 0] }) {
    const frameW = 0.03;
    return (
        <group position={position} rotation={rotation}>
            {/* Glass */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshPhysicalMaterial
                    color="#B8D8E8"
                    transparent
                    opacity={0.55}
                    metalness={0.3}
                    roughness={0.05}
                    envMapIntensity={1.5}
                />
            </mesh>
            {/* Frame - top */}
            <mesh position={[0, height / 2, 0.005]}>
                <boxGeometry args={[width + frameW * 2, frameW, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Frame - bottom */}
            <mesh position={[0, -height / 2, 0.005]}>
                <boxGeometry args={[width + frameW * 2, frameW, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Frame - left */}
            <mesh position={[-width / 2, 0, 0.005]}>
                <boxGeometry args={[frameW, height, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Frame - right */}
            <mesh position={[width / 2, 0, 0.005]}>
                <boxGeometry args={[frameW, height, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Crossbar */}
            <mesh position={[0, 0, 0.006]}>
                <boxGeometry args={[width, frameW * 0.7, 0.01]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.006]}>
                <boxGeometry args={[frameW * 0.7, height, 0.01]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
        </group>
    );
}

/* ── Helper: door with panels ── */
function Door({ position, width, height }) {
    return (
        <group position={position}>
            {/* Door panel */}
            <mesh>
                <boxGeometry args={[width, height, 0.06]} />
                <meshStandardMaterial color="#5D3A1A" roughness={0.7} />
            </mesh>
            {/* Door frame */}
            <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[width + 0.06, height + 0.04, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Knob */}
            <mesh position={[width * 0.3, -0.02, 0.05]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#C8A84E" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Upper door panel inset */}
            <mesh position={[0, height * 0.2, 0.035]}>
                <boxGeometry args={[width * 0.65, height * 0.3, 0.01]} />
                <meshStandardMaterial color="#4A2E10" roughness={0.6} />
            </mesh>
            {/* Lower door panel inset */}
            <mesh position={[0, -height * 0.18, 0.035]}>
                <boxGeometry args={[width * 0.65, height * 0.3, 0.01]} />
                <meshStandardMaterial color="#4A2E10" roughness={0.6} />
            </mesh>
        </group>
    );
}

/* ── Helper: chimney ── */
function Chimney({ position, height = 0.5 }) {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[0.2, height, 0.2]} />
                <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>
            {/* Chimney cap */}
            <mesh position={[0, height / 2 + 0.03, 0]}>
                <boxGeometry args={[0.26, 0.06, 0.26]} />
                <meshStandardMaterial color="#666" roughness={0.7} />
            </mesh>
        </group>
    );
}

/* ── Helper: Porch ── */
function Porch({ width, depth, height, position }) {
    const pillarRadius = 0.04;
    return (
        <group position={position}>
            {/* Porch floor */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width, 0.05, depth]} />
                <meshStandardMaterial color="#D4A574" roughness={0.7} />
            </mesh>
            {/* Steps */}
            <mesh position={[0, -0.08, depth / 2 + 0.08]}>
                <boxGeometry args={[width * 0.5, 0.06, 0.16]} />
                <meshStandardMaterial color="#CCC" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.15, depth / 2 + 0.2]}>
                <boxGeometry args={[width * 0.55, 0.06, 0.16]} />
                <meshStandardMaterial color="#BBB" roughness={0.8} />
            </mesh>
            {/* Pillars */}
            {[-width / 2 + 0.06, width / 2 - 0.06].map((x, i) => (
                <mesh key={i} position={[x, height / 2, depth / 2 - 0.04]}>
                    <cylinderGeometry args={[pillarRadius, pillarRadius, height, 8]} />
                    <meshStandardMaterial color="#F5F0EB" roughness={0.3} />
                </mesh>
            ))}
            {/* Porch roof */}
            <mesh position={[0, height, 0]}>
                <boxGeometry args={[width + 0.08, 0.04, depth + 0.1]} />
                <meshStandardMaterial color="#4A4A4A" roughness={0.5} />
            </mesh>
        </group>
    );
}

/* ── Helper: single tree ── */
function Tree({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
                <meshStandardMaterial color="#6B4226" roughness={0.9} />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial color="#3A7D44" roughness={0.9} />
            </mesh>
            <mesh position={[0.08, 0.45, 0.06]}>
                <sphereGeometry args={[0.16, 8, 8]} />
                <meshStandardMaterial color="#2D6A30" roughness={0.9} />
            </mesh>
            <mesh position={[-0.06, 0.48, -0.05]}>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color="#4A8F52" roughness={0.9} />
            </mesh>
        </group>
    );
}

/* ── Helper: bush ── */
function Bush({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.1, 8, 6]} />
                <meshStandardMaterial color="#4A8F52" roughness={0.9} />
            </mesh>
            <mesh position={[0.07, 0.05, 0.03]}>
                <sphereGeometry args={[0.07, 6, 6]} />
                <meshStandardMaterial color="#3A7D44" roughness={0.9} />
            </mesh>
        </group>
    );
}

/* ── Helper: fence segment ── */
function FenceSegment({ x1, x2, z, y = 0 }) {
    const length = Math.abs(x2 - x1);
    const cx = (x1 + x2) / 2;
    return (
        <group>
            {/* Horizontal rail */}
            <mesh position={[cx, y + 0.12, z]}>
                <boxGeometry args={[length, 0.02, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            <mesh position={[cx, y + 0.06, z]}>
                <boxGeometry args={[length, 0.02, 0.02]} />
                <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
            </mesh>
            {/* Pickets */}
            {(() => {
                const pickets = [];
                const count = Math.max(2, Math.floor(length / 0.08));
                for (let i = 0; i <= count; i++) {
                    const px = x1 + (i / count) * (x2 - x1);
                    pickets.push(
                        <mesh key={i} position={[px, y + 0.09, z]}>
                            <boxGeometry args={[0.015, 0.18, 0.015]} />
                            <meshStandardMaterial color="#F5F0EB" roughness={0.5} />
                        </mesh>
                    );
                }
                return pickets;
            })()}
        </group>
    );
}


/* ════════════════════════════════════════
   ▸  MAIN HOUSE COMPONENT
   ════════════════════════════════════════ */
function House({ floors = 1, area = 120, style = 'modern' }) {
    const groupRef = useRef();

    // ── Size derived from area slider ──
    const baseUnit = useMemo(() => Math.sqrt(area / floors), [area, floors]);
    const scale = Math.max(0.3, baseUnit * 0.07);
    const width = 1.6 * scale;
    const depth = 2.0 * scale;
    const floorH = 0.55 * scale;
    const totalH = floorH * floors;

    const isModern = style === 'modern' || style === 'minimalist';
    const isClassic = style === 'classic' || style === 'european';

    // Slow gentle spin
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
        }
    });

    // ── Color palette per style ──
    const palette = useMemo(() => {
        if (isModern) return {
            wall: '#E8E0D5',
            wallAccent: '#D4CCC2',
            roof: '#3A3A3A',
            trim: '#F5F0EB',
            accent: '#C8A84E',
        };
        if (isClassic) return {
            wall: '#D4C4A8',
            wallAccent: '#C4B498',
            roof: '#8B4513',
            trim: '#FFFDF5',
            accent: '#6B4226',
        };
        return {
            wall: '#CFC4B0',
            wallAccent: '#BFB4A0',
            roof: '#6A5040',
            trim: '#F0EBE3',
            accent: '#8B6914',
        };
    }, [isModern, isClassic]);

    const winW = width * 0.14;
    const winH = floorH * 0.42;

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* ── Foundation / Base plate ── */}
            <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[width + 0.25, 0.08, depth + 0.25]} />
                <meshStandardMaterial color="#A09080" roughness={0.9} />
            </mesh>

            {/* ── Walls per floor ── */}
            {Array.from({ length: floors }).map((_, i) => {
                const yBase = i * floorH + floorH / 2;
                return (
                    <group key={i} position={[0, yBase, 0]}>
                        {/* Main walls */}
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={[width, floorH, depth]} />
                            <meshStandardMaterial color={palette.wall} roughness={0.7} />
                        </mesh>

                        {/* Horizontal trim between floors */}
                        <mesh position={[0, -floorH / 2 + 0.015, 0]}>
                            <boxGeometry args={[width + 0.03, 0.03, depth + 0.03]} />
                            <meshStandardMaterial color={palette.trim} roughness={0.4} />
                        </mesh>
                        <mesh position={[0, floorH / 2 - 0.015, 0]}>
                            <boxGeometry args={[width + 0.03, 0.03, depth + 0.03]} />
                            <meshStandardMaterial color={palette.trim} roughness={0.4} />
                        </mesh>

                        {/* ── Front windows ── */}
                        {[-width * 0.28, width * 0.28].map((x, j) => (
                            <WindowPanel
                                key={`fw-${i}-${j}`}
                                position={[x, 0.02, depth / 2 + 0.015]}
                                width={winW}
                                height={winH}
                            />
                        ))}

                        {/* ── Back windows ── */}
                        {[-width * 0.28, width * 0.28].map((x, j) => (
                            <WindowPanel
                                key={`bw-${i}-${j}`}
                                position={[x, 0.02, -depth / 2 - 0.015]}
                                width={winW}
                                height={winH}
                                rotation={[0, Math.PI, 0]}
                            />
                        ))}

                        {/* ── Side windows ── */}
                        <WindowPanel
                            position={[width / 2 + 0.015, 0.02, 0]}
                            width={depth * 0.18}
                            height={winH}
                            rotation={[0, Math.PI / 2, 0]}
                        />
                        <WindowPanel
                            position={[-width / 2 - 0.015, 0.02, 0]}
                            width={depth * 0.18}
                            height={winH}
                            rotation={[0, -Math.PI / 2, 0]}
                        />

                        {/* Accent stripe on wall */}
                        {isModern && (
                            <mesh position={[0, 0, depth / 2 + 0.005]}>
                                <planeGeometry args={[width, 0.015]} />
                                <meshStandardMaterial color={palette.accent} metalness={0.5} roughness={0.3} />
                            </mesh>
                        )}
                    </group>
                );
            })}

            {/* ── Roof ── */}
            {isModern ? (
                /* Flat modern roof with parapet */
                <group position={[0, totalH, 0]}>
                    <mesh position={[0, 0.03, 0]}>
                        <boxGeometry args={[width + 0.18, 0.06, depth + 0.18]} />
                        <meshStandardMaterial color={palette.roof} roughness={0.4} metalness={0.15} />
                    </mesh>
                    {/* Parapet edge */}
                    <mesh position={[0, 0.08, 0]}>
                        <boxGeometry args={[width + 0.22, 0.04, depth + 0.22]} />
                        <meshStandardMaterial color={palette.trim} roughness={0.4} />
                    </mesh>
                </group>
            ) : (
                /* Classic gable roof */
                <group position={[0, totalH, 0]}>
                    {/* Roof ridge using a custom shape */}
                    <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
                        <coneGeometry args={[Math.max(width, depth) * 0.78, 0.55 * scale, 4]} />
                        <meshStandardMaterial color={palette.roof} roughness={0.8} />
                    </mesh>
                    {/* Roof overhang trim */}
                    <mesh position={[0, -0.02, 0]}>
                        <boxGeometry args={[width + 0.2, 0.03, depth + 0.2]} />
                        <meshStandardMaterial color={palette.trim} roughness={0.5} />
                    </mesh>
                </group>
            )}

            {/* ── Chimney ── */}
            {!isModern && (
                <Chimney
                    position={[width * 0.3, totalH + 0.25 * scale, -depth * 0.25]}
                    height={0.45 * scale}
                />
            )}

            {/* ── Front door with porch ── */}
            <Door
                position={[0, floorH * 0.3, depth / 2 + 0.03]}
                width={width * 0.13}
                height={floorH * 0.58}
            />
            <Porch
                width={width * 0.45}
                depth={0.35}
                height={floorH * 0.65}
                position={[0, 0, depth / 2 + 0.18]}
            />

            {/* ── Garage extension (modern only) ── */}
            {isModern && (
                <group position={[-width / 2 - 0.25 * scale, floorH * 0.4, 0]}>
                    <mesh castShadow>
                        <boxGeometry args={[0.5 * scale, floorH * 0.8, depth * 0.55]} />
                        <meshStandardMaterial color={palette.wallAccent} roughness={0.7} />
                    </mesh>
                    {/* Garage door */}
                    <mesh position={[0, -0.04, depth * 0.55 / 2 + 0.01]}>
                        <planeGeometry args={[0.42 * scale, floorH * 0.6]} />
                        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.3} />
                    </mesh>
                    {/* Horizontal lines on garage door */}
                    {[-0.06, 0, 0.06].map((dy, idx) => (
                        <mesh key={idx} position={[0, dy - 0.04, depth * 0.55 / 2 + 0.015]}>
                            <boxGeometry args={[0.4 * scale, 0.005, 0.005]} />
                            <meshStandardMaterial color="#777" />
                        </mesh>
                    ))}
                </group>
            )}

            {/* ── Landscaping ── */}
            <Tree position={[width / 2 + 0.7, 0, depth / 2 + 0.3]} scale={scale * 1} />
            <Tree position={[-width / 2 - 0.8, 0, -depth / 4]} scale={scale * 1.1} />
            <Tree position={[width / 2 + 0.5, 0, -depth / 2 - 0.5]} scale={scale * 0.8} />

            <Bush position={[width / 2 + 0.15, 0, depth / 2 + 0.15]} scale={scale * 1} />
            <Bush position={[-width / 2 - 0.15, 0, depth / 2 + 0.1]} scale={scale * 1} />
            <Bush position={[width / 2 + 0.15, 0, depth / 4]} scale={scale * 0.8} />

            {/* ── Fence (front yard) ── */}
            <FenceSegment x1={-width / 2 - 0.5} x2={-0.3} z={depth / 2 + 0.55} />
            <FenceSegment x1={0.3} x2={width / 2 + 0.5} z={depth / 2 + 0.55} />

            {/* ── Driveway / path ── */}
            <mesh position={[0, -0.035, depth / 2 + 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.35, 0.4]} />
                <meshStandardMaterial color="#B0A89A" roughness={0.95} />
            </mesh>

            {/* ── Ground plane ── */}
            <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial color="#7DB87A" roughness={0.95} />
            </mesh>
        </group>
    );
}

/* ════════════════════════════════════════
   ▸  EXPORTED VIEWER
   ════════════════════════════════════════ */
export default function HouseViewer({ project }) {
    const floors = parseInt(project?.floors) || 1;
    const area = parseInt(project?.area) || 120;
    const style = project?.style || 'modern';

    return (
        <div style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
            <Canvas
                camera={{ position: [3, 2.5, 3.5], fov: 45 }}
                shadows
                style={{
                    background: 'linear-gradient(180deg, #6BAFE4 0%, #A7D3F0 30%, #D1EAF8 60%, #E8F4E8 100%)',
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[6, 10, 6]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight position={[-4, 5, -4]} intensity={0.25} />
                <hemisphereLight
                    skyColor="#87CEEB"
                    groundColor="#4A8F52"
                    intensity={0.35}
                />

                <Float speed={0.4} floatIntensity={0.12} rotationIntensity={0}>
                    <House floors={floors} area={area} style={style} />
                </Float>

                <ContactShadows
                    position={[0, -0.08, 0]}
                    opacity={0.25}
                    scale={8}
                    blur={2}
                    far={4}
                />

                <OrbitControls
                    enablePan={false}
                    target={[0, 0.5, 0]}
                    minDistance={2.5}
                    maxDistance={12}
                    maxPolarAngle={Math.PI / 2.15}
                    autoRotate
                    autoRotateSpeed={0.6}
                />
            </Canvas>
        </div>
    );
}
