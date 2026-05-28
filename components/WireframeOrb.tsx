"use client";
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform float uSpeaking;
varying vec3 vPosition;

// Classic 3D Perlin Noise by Stefan Gustavson
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main() {
  vec3 pos = position;

  // The speed of the wave
  float t = uTime * mix(1.0, 1.5, uSpeaking);
  
  // Frequency of the noise
  float noiseFreq = 1.2;
  
  // Amplitude based on speaking
  float noiseAmp = mix(0.1, 0.35, uSpeaking);
  
  vec3 noisePos = vec3(pos.x * noiseFreq + t, pos.y * noiseFreq + t, pos.z * noiseFreq);

  float n = cnoise(noisePos);
  pos += normal * n * noiseAmp;

  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec3 vPosition;

void main() {
  vec3 colorCyan = vec3(0.0, 0.7, 1.0); // Cyan/Blue
  vec3 colorBlue = vec3(0.2, 0.2, 1.0); // Deeper blue
  vec3 colorPink = vec3(1.0, 0.0, 1.0); // Magenta/Pink

  // Compute a 0 to 1 value across the mesh diagonally
  float t1 = (vPosition.x - vPosition.y + 1.5) / 3.0; // Tune parameters based on expected positions
  
  vec3 finalColor = mix(colorPink, colorCyan, clamp(t1, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const OrbMesh = ({ isSpeaking }: { isSpeaking: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate uniforms
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.4;
      
      const targetIntensity = isSpeaking ? 1.0 : 0.0;
      materialRef.current.uniforms.uSpeaking.value += (targetIntensity - materialRef.current.uniforms.uSpeaking.value) * 0.05;
    }
    if (meshRef.current) {
       meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
       meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeaking: { value: isSpeaking ? 1.0 : 0.0 },
    }),
    [isSpeaking]
  );

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 60, 60]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
      />
    </mesh>
  );
};

const BackgroundParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 1000;
    
    const positions = useMemo(() => {
        const p = new Float32Array(particleCount * 3);
        const color = new Float32Array(particleCount * 3);
        const colorCyan = new THREE.Color('#00dbff');
        const colorPink = new THREE.Color('#ff00ff');
        
        const rand = (n: number) => {
            const x = Math.sin(n) * 10000;
            return x - Math.floor(x);
        };
        
        for (let i = 0; i < particleCount; i++) {
            // spherical distribution
            const r = 2.0 + rand(i * 1.1) * 0.8;
            const theta = rand(i * 2.2) * Math.PI * 2;
            const phi = Math.acos(2 * rand(i * 3.3) - 1);
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            p[i * 3] = x;
            p[i * 3 + 1] = y;
            p[i * 3 + 2] = z;
            
            // color based on position
            const t = (x - y + 4.0) / 8.0;
            const mixedColor = colorPink.clone().lerp(colorCyan, Math.max(0, Math.min(1, t)));
            color[i * 3] = mixedColor.r;
            color[i * 3 + 1] = mixedColor.g;
            color[i * 3 + 2] = mixedColor.b;
        }
        return { p, color };
    }, []);
    
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02;
        }
    });
    
    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions.p, 3]} />
                <bufferAttribute attach="attributes-color" args={[positions.color, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.02} vertexColors={true} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>
    );
};

export default function WireframeOrb({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full block">
         <OrbMesh isSpeaking={isSpeaking} />
         <BackgroundParticles />
      </Canvas>
    </div>
  );
}
