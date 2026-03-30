import React, { useRef } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

function LightWithHelper() {
  const lightRef = useRef();

  useHelper(lightRef, DirectionalLightHelper, 1);

  return (
    <directionalLight
      // ref={lightRef}
      position={[0, 5, 5]}
      intensity={10}
    />
  );
}

export default LightWithHelper;