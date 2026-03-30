import React, { use, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  useGLTF,
  OrbitControls,
  useTexture,
  useAnimations,
  useProgress,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Light } from "three";
import LightWithHelper from "./LightWithHelper";
import { texture } from "three/tsl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Model() {
  const { scene, animations } = useGLTF("/models/dog.drc.glb");

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [normalMap] = useTexture([
    "/textures/dog_normals.jpg",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [branchNormalMap, branchMatCap] = useTexture([
    "/textures/branches_normals.jpg",
    "/Materials/branches_diffuse.jpg",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
    mat6,
    mat7,
    mat8,
    mat9,
    mat10,
    mat11,
    mat12,
    mat13,
    mat14,
    mat15,
    mat16,
    mat17,
    mat18,
    mat19,
    mat20,
  ] = useTexture([
    "/Materials/mat-1.png",
    "/Materials/mat-2.png",
    "/Materials/mat-3.png",
    "/Materials/mat-4.png",
    "/Materials/mat-5.png",
    "/Materials/mat-6.png",
    "/Materials/mat-7.png",
    "/Materials/mat-8.png",
    "/Materials/mat-9.png",
    "/Materials/mat-10.png",
    "/Materials/mat-11.png",
    "/Materials/mat-12.png",
    "/Materials/mat-13.png",
    "/Materials/mat-14.png",
    "/Materials/mat-15.png",
    "/Materials/mat-16.png",
    "/Materials/mat-17.png",
    "/Materials/mat-18.png",
    "/Materials/mat-19.png",
    "/Materials/mat-20.png",
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

const uniforms = useRef({
  uMatcap1: { value: mat19 },
  uMatcap2: { value: mat2 },
  uProgress: { value: 1.0 },
});


const branchUniforms = useRef({
  uTex1: { value: mat19 },
  uTex2: { value: mat2 },
  uProgress: { value: 1.0 },
});

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat2,
  });

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    matcap: branchMatCap,
  });

  function onBeforeCompile(shader) {
  shader.uniforms.uMatcap1 = uniforms.current.uMatcap1;
  shader.uniforms.uMatcap2 = uniforms.current.uMatcap2;
  shader.uniforms.uProgress = uniforms.current.uProgress;

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    #include <common>

    uniform sampler2D uMatcap1;
    uniform sampler2D uMatcap2;
    uniform float uProgress;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "vec4 matcapColor = texture2D( matcap, uv );",
    `
    vec4 color1 = texture2D(uMatcap1, uv);
    vec4 color2 = texture2D(uMatcap2, uv);

    vec4 matcapColor = mix(color1, color2, uProgress);
    `
  );
}
function branchBeforeCompile(shader) {
  shader.uniforms.uTex1 = branchUniforms.current.uTex1;
  shader.uniforms.uTex2 = branchUniforms.current.uTex2;
  shader.uniforms.uProgress = branchUniforms.current.uProgress;

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    #include <common>
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uProgress;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "vec4 matcapColor = texture2D( matcap, uv );",
    `
    vec4 tex1 = texture2D(uTex1, uv);
    vec4 tex2 = texture2D(uTex2, uv);

    vec4 matcapColor = mix(tex1, tex2, uProgress);
    `
  );
}
dogMaterial.onBeforeCompile = onBeforeCompile;
branchMaterial.onBeforeCompile = branchBeforeCompile;

  scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial;
    } else {
      child.material = branchMaterial;
    }
  });

  gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);

  const dogModel = useRef(scene);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-4",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(dogModel.current.position, {
      z: "-=0.75",
      y: "+=0.1",
    })
      .to(dogModel.current.rotation, {
        x: `+=${Math.PI / 15}`,
      })
      .to(
        dogModel.current.rotation,
        {
          y: `-=${Math.PI}`,
        },
        "third",
      )
      .to(
        dogModel.current.position,
        {
          x: `-=0.4`,
          z: `+=0.48`,
          y: `-=0.05`,
        },
        "third",
      );
  });

  useEffect(()=>{
    document.querySelector(`.title[img-title="tomorrowland"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat19;
      branchUniforms.current.uTex1.value = mat19;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      
    });
    document.querySelector(`.title[img-title="navy-pier"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat8;
      branchUniforms.current.uTex1.value = mat8;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
      }}, "same" )
    });
    document.querySelector(`.title[img-title="msi-chicago"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat9;
      branchUniforms.current.uTex1.value = mat9;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
    });
    document.querySelector(`.title[img-title="phone"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat12;
      branchUniforms.current.uTex1.value = mat12;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
    });
    document.querySelector(`.title[img-title="kikk"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat10;
      branchUniforms.current.uTex1.value = mat10;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
    });
    document.querySelector(`.title[img-title="kennedy"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat8;
      branchUniforms.current.uTex1.value = mat8;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
    });
    document.querySelector(`.title[img-title="opera"]`).addEventListener("mouseenter", () => {
      uniforms.current.uMatcap1.value = mat13;
      branchUniforms.current.uTex1.value = mat13;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
      gsap.to(branchUniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same" )
    });
    document.querySelector(`.titles`).addEventListener("mouseleave", () => {
      uniforms.current.uMatcap1.value = mat2;
      branchUniforms.current.uTex1.value = mat2;
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          uniforms.current.uMatcap2.value = uniforms.current.uMatcap1.value;
          uniforms.current.uProgress.value = 1.0;
        }
      }, "same")
      gsap.to(uniforms.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          branchUniforms.current.uTex2.value = branchUniforms.current.uTex1.value;
          branchUniforms.current.uProgress.value = 1.0;
        }
      }, "same")
    });
  },[])

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0.18, -0.58, 0]}
      rotation={[0, Math.PI / 4.8, 0]}
    />
  );
}

const Dog = () => {
  const { camera, scene, gl } = useThree();
  camera.position.z = 0.5;
  gl.toneMapping = THREE.ReinhardToneMapping;
  gl.outputColorSpace = THREE.SRGBColorSpace;
  return (
    <>
      <ambientLight intensity={1} />
      <LightWithHelper />
      <Model />
      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
