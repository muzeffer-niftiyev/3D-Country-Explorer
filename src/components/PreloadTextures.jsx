import { useEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const PreloadTextures = () => {
  const gl = useThree((state) => state.gl);
  const textures = useLoader(TextureLoader, [
    "/lightTexture.jpg",
    "/darkTexture.jpg",
  ]);

  useEffect(() => {
    textures.forEach((texture) => {
      gl.initTexture(texture);
    });
  }, [textures, gl]);

  return null;
};

export default PreloadTextures;
