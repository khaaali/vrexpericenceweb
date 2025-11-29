import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise, ColorAverage, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

export const Effects = () => {
    return (
        <EffectComposer>
            {/* Bloom for glowing elements */}
            <Bloom
                intensity={0.4}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.5}
                mipmapBlur
            />

            {/* Vignette for focus */}
            <Vignette
                offset={0.3}
                darkness={0.5}
                eskil={false}
                blendFunction={BlendFunction.NORMAL}
            />

            {/* Subtle film grain */}
            <Noise
                opacity={0.02}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* Warm color tint */}
            <ColorAverage
                blendFunction={BlendFunction.OVERLAY}
                opacity={0.05}
            />

            {/* Tone mapping for better contrast */}
            <ToneMapping
                mode={ToneMappingMode.ACES_FILMIC}
                resolution={256}
                whitePoint={4.0}
                middleGrey={0.6}
                minLuminance={0.01}
                averageLuminance={1.0}
                adaptationRate={1.0}
            />
        </EffectComposer>
    );
};
