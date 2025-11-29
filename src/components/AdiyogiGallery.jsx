import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import { TextureLoader, ShaderMaterial, Vector2, Color } from 'three';
import * as THREE from 'three';

// Extend ShaderMaterial to be usable in JSX
extend({ ShaderMaterial: THREE.ShaderMaterial });

// Custom Misty Shader with Fluid Noise
const MistyImageMaterial = {
    uniforms: {
        uTexture: { value: null },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
        uAspectRatio: { value: 1 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uOpacity;
        uniform float uTime;
        uniform float uAspectRatio;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                    -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            
            // Center coordinates adjusted for aspect ratio
            vec2 center = vUv - 0.5;
            center.x *= uAspectRatio;
            
            // Base distance from center
            float dist = length(center);
            
            // Generate fluid noise
            // Layer 1: Slow, large movement
            float noise1 = snoise(vUv * 2.0 + uTime * 0.1);
            // Layer 2: Faster, detailed movement
            float noise2 = snoise(vUv * 4.0 - uTime * 0.15);
            
            // Combine noise
            float fluidNoise = (noise1 + noise2 * 0.5);
            
            // Create dynamic mask
            // The threshold changes with noise to create irregular shape
            // We want center to be visible (dist small) and edges to fade (dist large)
            
            // Dynamic edge threshold based on noise
            // Base radius increased to show more image
            // Noise perturbs this radius
            float radius = 0.50 + fluidNoise * 0.15;
            
            // Smooth transition for misty edge
            // Reduced smoothing range slightly to keep edges defined but soft
            float mask = 1.0 - smoothstep(radius, radius + 0.15, dist);
            
            // Apply opacity and mask
            float alpha = texColor.a * mask * uOpacity;
            
            // Boost brightness slightly in the center for "divine" look
            vec3 color = texColor.rgb;
            color += vec3(0.1, 0.08, 0.05) * mask * 0.5; // Golden tint boost
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const adiyogiImages = [
    '/adiyogi/Adiyogi_Shiva_steel_burst_2018.jpg',
    '/adiyogi/adiyogi-shiva-statue-795092.jpg',
    '/adiyogi/wallpaper-149.jpeg',
    '/adiyogi/wallpaper-162.jpeg',
    '/adiyogi/wallpaper-174.jpeg',
    '/adiyogi/wallpaper-184.jpeg',
    '/adiyogi/wallpaper-288.jpeg',
    '/adiyogi/wallpaper-289.jpeg',
    '/adiyogi/wallpaper-311.jpeg',
    '/adiyogi/wallpaper-432.jpeg',
    '/adiyogi/wallpaper-436.jpeg',
    '/adiyogi/wallpaper-438.jpeg',
    '/adiyogi/wallpaper-471.jpeg',
    '/adiyogi/wallpaper-562.jpeg',
    '/adiyogi/wallpaper-578.jpeg',
    '/adiyogi/wallpaper-582.jpeg',
    '/adiyogi/wallpaper-601.jpeg',
    '/adiyogi/wallpaper-602.jpeg',
    '/adiyogi/wallpaper-68.jpeg',
    '/adiyogi/wallpaper-718.jpeg',
    '/adiyogi/wallpaper-730.jpeg',
    '/adiyogi/wallpaper-771.jpeg',
    '/adiyogi/wallpaper-819.jpeg',
    '/adiyogi/wallpaper-841.jpeg',
    '/adiyogi/wallpaper-847.jpeg',
    '/adiyogi/wallpaper-861.jpeg',
    '/adiyogi/wallpaper-871.jpeg',
    '/adiyogi/wallpaper-884.jpeg',
    '/adiyogi/wallpaper-892.jpeg',
    '/adiyogi/wallpaper-978.jpeg',
    '/adiyogi/wallpaper-983.jpeg'
];

export const AdiyogiGallery = ({ position = [0, 2, 8] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [opacity, setOpacity] = useState(0); // Start invisible
    const [targetOpacity, setTargetOpacity] = useState(1);
    const meshRef = useRef();
    const materialRef = useRef();
    const timeRef = useRef(0);
    const [aspectRatio, setAspectRatio] = useState(1);

    // Load the current texture
    const texture = useLoader(TextureLoader, adiyogiImages[currentImageIndex]);

    // Calculate aspect ratio when texture loads
    useEffect(() => {
        if (texture && texture.image) {
            const ratio = texture.image.width / texture.image.height;
            setAspectRatio(ratio);
            // Update shader uniform
            if (materialRef.current) {
                materialRef.current.uniforms.uAspectRatio.value = ratio;
            }
        }
    }, [texture]);

    useFrame((state, delta) => {
        timeRef.current += delta;

        // Smooth opacity transition
        // Fade in/out logic
        const fadeSpeed = 0.5;
        if (opacity < targetOpacity) {
            setOpacity(Math.min(targetOpacity, opacity + delta * fadeSpeed));
        } else if (opacity > targetOpacity) {
            setOpacity(Math.max(targetOpacity, opacity - delta * fadeSpeed));
        }

        // Cycle logic
        // Show for 10 seconds, then fade out
        if (timeRef.current > 10 && targetOpacity === 1) {
            setTargetOpacity(0);
        }

        // Once fully faded out, switch image and fade in
        if (targetOpacity === 0 && opacity <= 0.01) {
            // Pick a random image different from current
            setCurrentImageIndex((prev) => {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * adiyogiImages.length);
                } while (nextIndex === prev && adiyogiImages.length > 1);
                return nextIndex;
            });
            timeRef.current = 0;
            setTargetOpacity(1);
        }

        // Update shader uniforms
        if (materialRef.current) {
            materialRef.current.uniforms.uTexture.value = texture;
            materialRef.current.uniforms.uOpacity.value = opacity;
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }

        // Gentle floating animation
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    // Calculate dimensions based on aspect ratio
    const height = 12; // Even larger
    const width = height * aspectRatio;

    return (
        <group position={position} rotation={[0, 0.4, 0]}>
            <mesh ref={meshRef}>
                <planeGeometry args={[width, height, 32, 32]} />
                <shaderMaterial
                    ref={materialRef}
                    args={[MistyImageMaterial]}
                    transparent={true}
                    side={THREE.DoubleSide}
                    depthWrite={false} // Helps with transparency blending
                />
            </mesh>

            {/* Backlight for extra brightness/glow */}
            <pointLight
                position={[0, 0, -2]}
                intensity={3 * opacity}
                distance={20}
                color="#ffaa00"
            />
        </group>
    );
};
