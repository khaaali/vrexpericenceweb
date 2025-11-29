import React, { useState, useEffect, useRef } from 'react';
import { Stars, OrbitControls, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { VerseDisplay } from './VerseDisplay';
import { Particles } from './Particles';
import { BreathingGuide } from './BreathingGuide';
import { MeditationTimer } from './MeditationTimer';
import { Effects } from './Effects';
import { ControlPanel } from './ControlPanel';
import { AdiyogiGallery } from './AdiyogiGallery';
import { verses } from '../data/verses';
import * as THREE from 'three';

export const Experience = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const audioRef = useRef(new Audio('/nirvana_shatakam.mp3'));

    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;

        let interval;
        if (isPlaying) {
            audio.play().catch(e => console.error("Audio play failed", e));
            interval = setInterval(() => {
                setCurrentVerseIndex(prev => (prev + 1) % verses.length);
            }, 35000);
        } else {
            audio.pause();
        }

        return () => {
            clearInterval(interval);
            audio.pause();
        };
    }, [isPlaying]);

    const handleStart = () => {
        setIsPlaying(!isPlaying);
    };

    const lastClickTimeRef = useRef(0);

    const handleNextVerse = () => {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 300) return; // 300ms debounce
        lastClickTimeRef.current = now;
        setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
    };

    const handlePrevVerse = () => {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 300) return; // 300ms debounce
        lastClickTimeRef.current = now;
        setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
    };

    return (
        <>
            {/* Custom HDRI Environment - Artificial Planet */}
            <Environment
                files="/HDR_artificial_planet.hdr"
                background
                blur={0.6}
            />

            {/* Warm atmospheric fog */}
            <fog attach="fog" args={['#ff9a56', 20, 80]} />

            {/* Creative Lighting Setup */}
            {/* Warm ambient base */}
            <ambientLight intensity={0.6} color="#fff5e6" />

            {/* Main sun - strong directional light */}
            <directionalLight
                position={[20, 15, 10]}
                intensity={2.5}
                color="#ffd700"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Secondary sun rays from opposite side */}
            <directionalLight
                position={[-15, 10, -8]}
                intensity={0.8}
                color="#ffb86c"
            />

            {/* Accent lights for meditation atmosphere */}
            <pointLight position={[0, 5, -10]} intensity={1.2} color="#ff6ec7" distance={20} />
            <pointLight position={[-8, 4, 5]} intensity={1.0} color="#8be9fd" distance={18} />
            <pointLight position={[8, 4, 5]} intensity={1.0} color="#ffcc99" distance={18} />

            {/* Reduced stars for daytime feel */}
            <Stars radius={150} depth={80} count={2000} factor={3} saturation={0} fade speed={0.3} />

            {/* Golden Reflective Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#1a0f0a"
                    roughness={0.08}
                    metalness={0.98}
                    envMapIntensity={2.5}
                />
            </mesh>

            {/* Verse Display - Center (Shifted Right) */}
            <group position={[1.5, 0, 0]}>
                <VerseDisplay
                    currentVerse={verses[currentVerseIndex]}
                    isPlaying={isPlaying}
                />
            </group>

            {/* Control Panel - Right Side (Shifted Right) */}
            <ControlPanel
                isPlaying={isPlaying}
                onPlayPause={handleStart}
                currentVerseIndex={currentVerseIndex}
                totalVerses={verses.length}
                onNextVerse={handleNextVerse}
                onPrevVerse={handlePrevVerse}
            />

            {/* Adiyogi Gallery - Left Side (Next to controls in field of view) */}
            <React.Suspense fallback={null}>
                <AdiyogiGallery position={[-3.5, 2, -5]} />
            </React.Suspense>

            {/* Start/Stop Interaction */}
            <group position={[0, -1, -2]} onClick={handleStart}>
                <mesh visible={!isPlaying} castShadow>
                    <boxGeometry args={[1.5, 0.5, 0.1]} />
                    <meshStandardMaterial color="#444" emissive="#222" emissiveIntensity={0.2} />
                </mesh>
            </group>

            <mesh position={[0, 0, -2]} onClick={handleStart} visible={!isPlaying} castShadow>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color="#00ff88"
                    emissive="#00ff88"
                    emissiveIntensity={1.0}
                    roughness={0.2}
                    metalness={0.3}
                />
            </mesh>

            <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />

            {/* Post-Processing Effects */}
            <Effects />
        </>
    );
};
