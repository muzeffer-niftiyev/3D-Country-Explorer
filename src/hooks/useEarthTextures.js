import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";

const ORIGINAL_TEXTURES = {
  day: "/lightTexture.jpg",
  night: "/darkTexture.jpg",
  specular: "/specularTexture.jpg",
};

const PHONE_TEXTURES = {
  day: "/textures/earth-day-4k.webp",
  night: "/textures/earth-night-4k.webp",
  specular: "/specularTexture.jpg",
};

const isPhone = () =>
  window.matchMedia("(pointer: coarse)").matches &&
  Math.min(window.screen.width, window.screen.height) < 1024;

const pickTextures = (maxTextureSize) =>
  isPhone() || maxTextureSize < 8192 ? PHONE_TEXTURES : ORIGINAL_TEXTURES;

class BitmapTextureLoader extends THREE.Loader {
  load(url, onLoad, onProgress, onError) {
    if (typeof createImageBitmap !== "function") {
      return new THREE.TextureLoader(this.manager).load(
        url,
        onLoad,
        onProgress,
        onError
      );
    }
    const loader = new THREE.ImageBitmapLoader(this.manager);
    loader.setOptions({
      imageOrientation: "flipY",
      premultiplyAlpha: "none",
    });
    loader.load(
      url,
      (bitmap) => {
        const texture = new THREE.Texture(bitmap);
        texture.flipY = false;
        texture.needsUpdate = true;
        onLoad?.(texture);
      },
      onProgress,
      onError
    );
  }
}

export const useEarthTextures = () => {
  const { gl } = useThree();
  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

  const textures = pickTextures(gl.capabilities.maxTextureSize);
  const [day, night, specular] = useLoader(BitmapTextureLoader, [
    textures.day,
    textures.night,
    textures.specular,
  ]);

  day.colorSpace = THREE.SRGBColorSpace;
  night.colorSpace = THREE.SRGBColorSpace;
  [day, night, specular].forEach((texture) => {
    texture.anisotropy = anisotropy;
  });

  return { day, night, specular };
};
