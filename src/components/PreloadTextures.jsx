import { useEffect } from "react";
import { TextureLoader } from "three";
import { useThree, useLoader } from "@react-three/fiber";

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
