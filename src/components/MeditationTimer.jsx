import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';

export const MeditationTimer = ({ duration = 300, onComplete, position = [2, 1.5, -2], rotation = [0, -0.5, 0] }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (onComplete) onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Panel Background */}
            <mesh onClick={toggleTimer}>
                <boxGeometry args={[1.5, 0.8, 0.1]} />
                <meshStandardMaterial color="#222" opacity={0.8} transparent />
            </mesh>

            {/* Timer Display */}
            <Text
                position={[0, 0.1, 0.06]}
                fontSize={0.3}
                color={isActive ? "#00ff88" : "#ffffff"}
                anchorX="center"
                anchorY="middle"
            >
                {formatTime(timeLeft)}
            </Text>

            {/* Label/Button Hint */}
            <Text
                position={[0, -0.2, 0.06]}
                fontSize={0.1}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
            >
                {isActive ? "Tap to Pause" : "Tap to Start"}
            </Text>
        </group>
    );
};
