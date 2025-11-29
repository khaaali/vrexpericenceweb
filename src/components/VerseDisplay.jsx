import React, { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const VerseDisplay = ({ currentVerse, isPlaying }) => {
    const [opacity, setOpacity] = useState(0);

    useFrame((state, delta) => {
        // Smooth fade in/out based on isPlaying and presence of verse
        const targetOpacity = isPlaying && currentVerse ? 1 : 0;
        setOpacity(THREE.MathUtils.lerp(opacity, targetOpacity, delta * 2));
    });

    if (!currentVerse) return null;

    return (
        <group position={[0, 1.5, -5]} rotation={[0, 0, 0]}>
            {/* Sanskrit Text */}
            <group position={[0, 0.5, 0]}>
                {currentVerse.sanskrit.map((line, index) => (
                    <Text
                        key={`sanskrit-${index}`}
                        position={[0, -index * 0.4, 0]}
                        fontSize={0.25}
                        color="#ffe066"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/NotoSansDevanagari.ttf"
                        fillOpacity={opacity}
                        outlineWidth={0.015}
                        outlineColor="#000000"
                        strokeWidth={0.01}
                        strokeColor="#ff8800"
                    >
                        {line}
                    </Text>
                ))}
            </group>

            {/* English Translation */}
            <Text
                position={[0, -1.5, 0]}
                fontSize={0.12}
                color="#ffffff"
                maxWidth={4}
                textAlign="center"
                anchorX="center"
                anchorY="top"
                fillOpacity={opacity}
                outlineWidth={0.01}
                outlineColor="#000000"
            >
                {currentVerse.translation}
            </Text>
        </group>
    );
};
