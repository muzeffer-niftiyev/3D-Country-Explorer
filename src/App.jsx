import { Canvas } from "@react-three/fiber";
import Earth from "./components/Earth";

function App() {
  return (
    <div className="w-[100dvw] h-[100dvh]">
      <Canvas
        flat
        camera={{
          fov: 30,
          near: 0.1,
          far: 200,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
      >
        <Earth />
      </Canvas>
    </div>
  );
}

export default App;

// TODO

// GECE GUNDUZ CEVIRMEK ELAVE ELEMEK
// TEXTURE SEKLI DEYISECEK
