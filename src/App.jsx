import React from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Experience } from './components/Experience';
import './App.css';

const store = createXRStore();

function App() {
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <Experience />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
