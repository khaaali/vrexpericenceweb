import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const BreathingGuide = ({ position = [0, 1.5, -3] }) => {
    const meshRef = useRef();
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold

    // 4-7-8 Breathing Technique
    // Inhale: 4s, Hold: 7s, Exhale: 8s
    // For visual simplicity, let's start with a simpler 4-4-4-4 box breathing or similar rhythmic pattern
    // Let's do: Inhale 4s, Hold 2s, Exhale 4s, Hold 2s

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();
        // Cycle duration = 12s (4+2+4+2)
        const cycle = time % 12;

        let scale = 1;
        let label = '';
        let color = new THREE.Color('#00ff88');

        if (cycle < 4) {
            // Inhale (0-4s)
            const t = cycle / 4;
            scale = 1 + t * 1.5; // Grow from 1 to 2.5
            label = 'Inhale';
            color.setHSL(0.3 + t * 0.1, 1, 0.5);
        } else if (cycle < 6) {
            // Hold (4-6s)
            scale = 2.5;
            label = 'Hold';
            color.setHSL(0.4, 1, 0.6);
        } else if (cycle < 10) {
            // Exhale (6-10s)
            const t = (cycle - 6) / 4;
            scale = 2.5 - t * 1.5; // Shrink from 2.5 to 1
            label = 'Exhale';
            color.setHSL(0.4 - t * 0.1, 1, 0.5);
        } else {
            // Hold (10-12s)
            scale = 1;
            label = 'Hold';
            color.setHSL(0.3, 1, 0.4);
        }

        // Smooth interpolation for scale could be added, but linear is okay for guide
        meshRef.current.scale.setScalar(scale);
        meshRef.current.material.color.lerp(color, 0.1);

        // Update text if we had a text ref, but we can just pass props to Text component
        // Since Text is a separate child, we'll need state or ref for it. 
        // Using state in useFrame is bad for performance. 
        // Let's just use the cycle to determine text in the render, 
        // but for high perf, we should use a ref for text content too if it changes often.
        // However, 'phase' state update might trigger re-renders. 
        // Let's optimize: only update React state when phase changes.

        let currentPhase = 'Hold';
        if (cycle < 4) currentPhase = 'Inhale';
        else if (cycle < 6) currentPhase = 'Hold';
        else if (cycle < 10) currentPhase = 'Exhale';

        if (currentPhase !== phase) {
            setPhase(currentPhase);
        }
    });

    return (
        <group position={position}>
            {/* Core Glowing Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    transparent
                    opacity={0.9}
                    roughness={0.1}
                    metalness={0.1}
                    emissive={new THREE.Color('#00ffcc')}
                    emissiveIntensity={2.0}
                />
            </mesh>

            {/* Outer Glow Layer */}
            <mesh ref={meshRef} scale={1.15}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial
                    transparent
                    opacity={0.3}
                    color="#00ffcc"
                />
            </mesh>

            {/* Text Label */}
            <Text
                position={[0, 0, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {phase}
            </Text>

            {/* Reference Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.4, 2.45, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 0.95, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};
