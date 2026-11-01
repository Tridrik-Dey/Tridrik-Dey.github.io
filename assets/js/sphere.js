// Hero "signal blob": a sphere displaced by noise plus a travelling sine wave,
// like a signal on an oscilloscope. It leans towards the pointer.
// Idea inspired by the displacement sphere in HamishMW/portfolio (MIT); this
// implementation and shaders are original.
import * as THREE from 'three';

// 3D simplex noise by Ian McEwan & Stefan Gustavson (Ashima Arts), MIT licence.
const noise = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */`
uniform float uTime;
uniform float uEnergy;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vView;
${noise}
float field(vec3 p){
  float n = snoise(p * 0.9 + uTime * 0.12) * 0.55;
  // A carrier wave travelling along y, amplitude-modulated by slower noise.
  float wave = sin(p.y * 7.0 - uTime * 1.6) * 0.09 * (0.6 + 0.4 * snoise(p * 0.5 + uTime * 0.05));
  return (n + wave) * uEnergy;
}
void main(){
  vec3 p = position;
  float d = field(normalize(p));
  vDisp = d;
  vec3 displaced = p + normal * d;
  // Approximate the new normal from neighbouring samples.
  vec3 t = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
  vec3 b = normalize(cross(normal, t));
  float e = 0.02;
  vec3 pt = normalize(p + t * e); vec3 pb = normalize(p + b * e);
  vec3 dt = pt * length(p) + pt * field(pt) - displaced;
  vec3 db = pb * length(p) + pb * field(pb) - displaced;
  vec3 n = normalize(cross(dt, db));
  if (dot(n, normal) < 0.0) n = -n;
  vNormal = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = /* glsl */`
uniform vec3 uCore;
uniform vec3 uRim;
uniform vec3 uHot;
uniform float uTime;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
  vec3 col = mix(uCore, uRim, fres);
  col = mix(col, uHot, smoothstep(0.18, 0.55, vDisp) * 0.75);
  // Thin scan lines, like a sampled signal.
  float scan = smoothstep(0.92, 1.0, sin(gl_FragCoord.y * 0.9 + uTime * 2.0)) * 0.06;
  float light = 0.35 + 0.65 * max(dot(vNormal, normalize(vec3(0.4, 0.8, 0.6))), 0.0);
  gl_FragColor = vec4(col * light + scan + fres * uRim * 0.5, 1.0);
}`;

const PALETTES = {
  dark: { core: 0x0b1f2a, rim: 0x2dd4bf, hot: 0x38bdf8 },
  light: { core: 0xdff7f3, rim: 0x0d9488, hot: 0x0284c7 },
};

export function initSphere(canvas) {
  if (!canvas) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const uniforms = {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uCore: { value: new THREE.Color() },
    uRim: { value: new THREE.Color() },
    uHot: { value: new THREE.Color() },
  };
  const setPalette = () => {
    const p = PALETTES[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'];
    uniforms.uCore.value.set(p.core); uniforms.uRim.value.set(p.rim); uniforms.uHot.value.set(p.hot);
  };
  setPalette();
  document.addEventListener('theme:change', () => { setPalette(); if (reduceMotion) render(0); });

  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.4, 48),
    new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader }),
  );
  scene.add(mesh);

  const target = { x: 0, y: 0, energy: 1 };
  const layout = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Sit to the right of the text on wide screens, behind it on phones.
    const wide = w > 860;
    mesh.position.set(wide ? 2.9 : 0.6, wide ? -0.1 : 1.4, 0);
    mesh.scale.setScalar(wide ? 0.78 : 0.72);
    canvas.style.opacity = wide ? '1' : '0.45';
  };
  layout();
  addEventListener('resize', layout);

  addEventListener('pointermove', e => {
    target.x = (e.clientX / innerWidth - 0.5);
    target.y = (e.clientY / innerHeight - 0.5);
    target.energy = 1.35;
  }, { passive: true });

  const render = t => {
    uniforms.uTime.value = t / 1000;
    mesh.rotation.y += (target.x * 0.9 - mesh.rotation.y) * 0.04;
    mesh.rotation.x += (target.y * 0.6 - mesh.rotation.x) * 0.04;
    target.energy += (1 - target.energy) * 0.01;
    uniforms.uEnergy.value += (target.energy - uniforms.uEnergy.value) * 0.05;
    renderer.render(scene, camera);
  };

  if (reduceMotion) { render(4000); return; }

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  const loop = t => {
    if (visible && !document.hidden) render(t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
