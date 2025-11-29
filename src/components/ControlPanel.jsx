import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const ControlPanel = ({
    isPlaying,
    onPlayPause,
    currentVerseIndex,
    totalVerses,
    onNextVerse,
    onPrevVerse
}) => {
    return (
        <group position={[3, 0, -3]} rotation={[0, -0.3, 0]}>
            {/* Panel Background */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[1.8, 2.5]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    transparent
                    opacity={0.85}
                    roughness={0.2}
                    metalness={0.5}
                />
            </mesh>

            {/* Title */}
            <Text
                position={[0, 1, 0.01]}
                fontSize={0.12}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.005}
                outlineColor="#000000"
            >
                CONTROLS
            </Text>

            {/* Play/Pause Button */}
            <group position={[0, 0.5, 0]} onClick={onPlayPause}>
                <mesh>
                    <circleGeometry args={[0.25, 32]} />
                    <meshStandardMaterial
                        color={isPlaying ? "#ff6b6b" : "#00ff88"}
                        emissive={isPlaying ? "#ff6b6b" : "#00ff88"}
                        emissiveIntensity={0.5}
                    />
                </mesh>
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.15}
                    color="#000000"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    {isPlaying ? '⏸' : '▶'}
                </Text>
            </group>

            {/* Verse Counter */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.1}
                color="#ffe066"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.005}
                outlineColor="#000000"
            >
                Sloka {currentVerseIndex + 1} / {totalVerses}
            </Text>

            {/* Previous Button */}
            <group position={[-0.4, -0.4, 0]} onClick={onPrevVerse}>
                <mesh>
                    <boxGeometry args={[0.3, 0.3, 0.05]} />
                    <meshStandardMaterial
                        color="#4a4a4a"
                        emissive="#333333"
                        emissiveIntensity={0.3}
                    />
                </mesh>
                <Text
                    position={[0, 0, 0.03]}
                    fontSize={0.15}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    ◀
                </Text>
            </group>

            {/* Next Button */}
            <group position={[0.4, -0.4, 0]} onClick={onNextVerse}>
                <mesh>
                    <boxGeometry args={[0.3, 0.3, 0.05]} />
                    <meshStandardMaterial
                        color="#4a4a4a"
                        emissive="#333333"
                        emissiveIntensity={0.3}
                    />
                </mesh>
                <Text
                    position={[0, 0, 0.03]}
                    fontSize={0.15}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    ▶
                </Text>
            </group>

            {/* Labels */}
            <Text
                position={[-0.4, -0.7, 0.01]}
                fontSize={0.06}
                color="#cccccc"
                anchorX="center"
                anchorY="middle"
            >
                Previous
            </Text>
            <Text
                position={[0.4, -0.7, 0.01]}
                fontSize={0.06}
                color="#cccccc"
                anchorX="center"
                anchorY="middle"
            >
                Next
            </Text>
        </group>
    );
};
