// Dithered 3D "mind" for the service tiles: 2D SDF icons extruded into slabs, raymarched, then ordered-dithered
// (4x4 Bayer) at one fragment per 2 css px. Shapes and the conjure/morph behaviour are adapted from
// shridharathi/visual-agent-chat; the dithering core follows Paper Shaders (Apache-2.0).

export const SHAPES = {
  diamond: 1,
  star: 8,
  search: 19,
  calculator: 22,
  bulb: 23,
  globe: 24,
  laptop: 29,
  jigsaw: 32,
  bars: 40,
  browser: 41,
  sparkle: 42,
  flow: 43,
  gears: 44,
  check: 45,
  chat: 46,
} as const

export type ShapeName = keyof typeof SHAPES

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform int uA; uniform int uB; uniform float uT;
uniform float uScale; uniform vec3 uFront; uniform float uForm; uniform float uPix; uniform float uShimmer; uniform float uSeed;
out vec4 outColor;
float dot2(vec2 v){return dot(v,v);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdCircle(vec2 p,float r){return length(p)-r;}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}
float sdRBox(vec2 p,vec2 b,float r){return sdBox(p,b-r)-r;}
float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}
float sdTri(vec2 p,vec2 p0,vec2 p1,vec2 p2){
  vec2 e0=p1-p0,e1=p2-p1,e2=p0-p2,v0=p-p0,v1=p-p1,v2=p-p2;
  vec2 q0=v0-e0*clamp(dot(v0,e0)/dot(e0,e0),0.,1.),q1=v1-e1*clamp(dot(v1,e1)/dot(e1,e1),0.,1.),q2=v2-e2*clamp(dot(v2,e2)/dot(e2,e2),0.,1.);
  float s=sign(e0.x*e2.y-e0.y*e2.x);
  vec2 d=min(min(vec2(dot(q0,q0),s*(v0.x*e0.y-v0.y*e0.x)),vec2(dot(q1,q1),s*(v1.x*e1.y-v1.y*e1.x))),vec2(dot(q2,q2),s*(v2.x*e2.y-v2.y*e2.x)));
  return -sqrt(d.x)*sign(d.y);}
float sdTrap(vec2 p,float r1,float r2,float he){
  vec2 k1=vec2(r2,he),k2=vec2(r2-r1,2.*he);p.x=abs(p.x);
  vec2 ca=vec2(p.x-min(p.x,(p.y<0.)?r1:r2),abs(p.y)-he);
  vec2 cb=p-k1+k2*clamp(dot(k1-p,k2)/dot2(k2),0.,1.);
  float s=(cb.x<0.&&ca.y<0.)?-1.:1.;return s*sqrt(min(dot2(ca),dot2(cb)));}
float sdStar5(vec2 p,float r,float rf){
  const vec2 k1=vec2(0.809016994375,-0.587785252292);const vec2 k2=vec2(-0.809016994375,-0.587785252292);
  p.x=abs(p.x);p-=2.*max(dot(k1,p),0.)*k1;p-=2.*max(dot(k2,p),0.)*k2;p.x=abs(p.x);p.y-=r;
  vec2 ba=rf*vec2(-k1.y,k1.x)-vec2(0,1);float h=clamp(dot(p,ba)/dot(ba,ba),0.,r);
  return length(p-ba*h)*sign(p.y*ba.x-p.x*ba.y);}
float sdRhombus(vec2 p,vec2 b){p=abs(p);vec2 q=b-2.*p;float h=clamp((q.x*b.x-q.y*b.y)/dot(b,b),-1.,1.);
  float d=length(p-.5*b*vec2(1.-h,1.+h));return d*sign(p.x*b.y+p.y*b.x-b.x*b.y);}
float sparkle(vec2 p,float s){p/=s;return min(sdRhombus(p,vec2(.17,.62)),sdRhombus(p,vec2(.62,.17)))*s;}
float gear(vec2 p,float r,float n,float a){p=rot(a)*p;float t=smoothstep(-.3,.3,cos(atan(p.y,p.x)*n));return (length(p)-(r+.07*t))*.8;}
float cut(float d,float g,float w){return max(d,w-g);}
float lines(float v,float st){return abs(fract(v/st+.5)-.5)*st;}

float shape(int id,vec2 p){
  float d=1.,g=1.;
  if(id==1){ // diamond
    d=min(sdTrap(p-vec2(0,.285),.62,.36,.165),sdTri(p,vec2(-.62,.12),vec2(.62,.12),vec2(0,-.64)));
    g=min(min(sdSeg(p,vec2(-.36,.45),vec2(-.2,.12)),sdSeg(p,vec2(.36,.45),vec2(.2,.12))),abs(p.y-.12));
    g=min(g,min(sdSeg(p,vec2(-.2,.12),vec2(0,-.64)),sdSeg(p,vec2(.2,.12),vec2(0,-.64))));
    g=min(g,min(sdSeg(p,vec2(0,.45),vec2(-.2,.12)),sdSeg(p,vec2(0,.45),vec2(.2,.12))));
    d=cut(d,g,.016);}
  else if(id==8){d=sdStar5(rot(sin(uTime*.4)*.1)*p,.66,.45);}
  else if(id==19){ // search
    vec2 q=p-.14*vec2(sin(uTime*1.7),cos(uTime*1.3));
    d=abs(length(q-vec2(-.1,.1))-.32)-.07;d=min(d,sdSeg(q,vec2(.16,-.16),vec2(.5,-.5))-.08);}
  else if(id==22){ // calculator
    d=sdRBox(p,vec2(.4,.6),.06);d=cut(d,abs(sdBox(p-vec2(0,.36),vec2(.3,.12))),.016);
    g=max(min(lines(p.x+.1,.2),lines(p.y+.1,.2)),sdBox(p-vec2(0,-.2),vec2(.3,.3)));d=cut(d,g,.018);}
  else if(id==23){ // bulb
    d=min(sdCircle(p-vec2(0,.16),.38),sdRBox(p-vec2(0,-.36),vec2(.16,.15),.03));
    d=cut(d,max(lines(p.y,.08),sdBox(p-vec2(0,-.36),vec2(.2,.12))),.012);
    d=cut(d,sdSeg(p,vec2(-.1,.05),vec2(.1,.05)),.018);}
  else if(id==24){ // globe
    d=sdCircle(p,.56);float c=cos(uTime*.7);
    g=min(min(abs(p.y),abs(abs(p.y)-.3)),abs(length(vec2(p.x/max(abs(c)*.56,.02),p.y/.56))-1.)*abs(c)*.56);
    g=min(g,abs(length(vec2(p.x/max(abs(sin(uTime*.7))*.56,.02),p.y/.56))-1.)*abs(sin(uTime*.7))*.56);
    d=cut(d,g,.015);}
  else if(id==29){ // laptop
    d=min(sdRBox(p-vec2(0,.12),vec2(.5,.34),.03),sdRBox(p-vec2(0,-.3),vec2(.64,.04),.03));
    d=cut(d,abs(sdBox(p-vec2(0,.12),vec2(.43,.27))),.014);}
  else if(id==32){ // jigsaw
    p=rot(.14*sin(uTime*1.8))*p;float k=.13+.018*sin(uTime*3.2);
    d=sdRBox(p,vec2(.36),.02);
    d=min(d,sdCircle(p-vec2(0,.47),k));d=min(d,sdCircle(p-vec2(.47,0),k));
    d=max(d,-sdCircle(p-vec2(-.36,0),k));d=max(d,-sdCircle(p-vec2(0,-.36),k));}
  else if(id==40){ // bar chart breathing on a baseline
    float h1=.42+.14*sin(uTime*1.6),h2=.72+.12*sin(uTime*1.3+1.),h3=1.0+.08*sin(uTime*1.1+2.);
    d=sdRBox(p-vec2(-.38,-.5+h1*.5),vec2(.13,h1*.5),.03);
    d=min(d,sdRBox(p-vec2(0,-.5+h2*.5),vec2(.13,h2*.5),.03));
    d=min(d,sdRBox(p-vec2(.38,-.5+h3*.5),vec2(.13,h3*.5),.03));
    d=min(d,sdRBox(p-vec2(0,-.58),vec2(.62,.035),.02));}
  else if(id==41){ // browser window
    d=sdRBox(p,vec2(.62,.46),.06);
    d=cut(d,abs(p.y-.3),.014);
    d=max(d,-min(sdCircle(p-vec2(-.5,.38),.032),min(sdCircle(p-vec2(-.41,.38),.032),sdCircle(p-vec2(-.32,.38),.032))));
    float s=.04*sin(uTime*1.2);
    d=cut(d,abs(sdBox(p-vec2(0,.08+s*.3),vec2(.5,.13))),.014);
    d=cut(d,sdSeg(p,vec2(-.5,-.17),vec2(.22+s,-.17)),.022);
    d=cut(d,sdSeg(p,vec2(-.5,-.3),vec2(-.02-s,-.3)),.022);}
  else if(id==42){ // sparkle
    float b=1.+.05*sin(uTime*2.);
    d=sparkle(p-vec2(-.08,-.06),b);
    d=min(d,sparkle(p-vec2(.42,.42),.36*(1.+.12*sin(uTime*2.+2.4))));}
  else if(id==43){ // workflow: three nodes in a loop, a token travelling the edges
    vec2 a=vec2(-.42,.3),b=vec2(.42,.3),c=vec2(0,-.38);
    d=min(sdRBox(p-a,vec2(.17,.13),.05),min(sdRBox(p-b,vec2(.17,.13),.05),sdRBox(p-c,vec2(.17,.13),.05)));
    d=min(d,min(sdSeg(p,a,b),min(sdSeg(p,b,c),sdSeg(p,c,a)))-.028);
    float u=fract(uTime*.3)*3.;float f=smoothstep(0.,1.,fract(u));
    vec2 P0=u<1.?a:u<2.?b:c,P1=u<1.?b:u<2.?c:a;
    d=min(d,sdCircle(p-mix(P0,P1,f),.085));}
  else if(id==44){ // two meshing gears
    vec2 c1=vec2(-.16,.14),c2=vec2(.3,-.26);
    d=min(gear(p-c1,.32,9.,uTime*.5),gear(p-c2,.18,6.,-uTime*.75+.26));
    d=max(d,-min(sdCircle(p-c1,.1),sdCircle(p-c2,.06)));}
  else if(id==45){ // ring with a check
    d=abs(length(p)-.5)-.06;
    d=min(d,min(sdSeg(p,vec2(-.22,0),vec2(-.06,-.17)),sdSeg(p,vec2(-.06,-.17),vec2(.25,.17)))-.075);}
  else if(id==46){ // chat bubble with typing dots
    d=sdRBox(p-vec2(0,.08),vec2(.58,.38),.16);
    d=min(d,sdTri(p,vec2(-.36,-.2),vec2(-.08,-.2),vec2(-.44,-.52)));
    for(int i=0;i<3;i++){float r=.055+.03*max(0.,sin(uTime*4.-float(i)*.9));d=max(d,-sdCircle(p-vec2(-.22+.22*float(i),.08),r));}}
  else {d=sdCircle(p,.56);}
  return d;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
const int bayer4x4[16]=int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5);
mat3 R;
float slab(int id,vec3 p){vec2 q=vec2(shape(id,p.xy)+.04,abs(p.z)-.16);return min(max(q.x,q.y),0.)+length(max(q,0.))-.04;}
float map(vec3 w){
  vec3 p=R*w/uScale;float d;
  if(uT<=.001) d=slab(uA,p); else if(uT>=.999) d=slab(uB,p); else d=mix(slab(uA,p),slab(uB,p),uT);
  return d*uScale;}
vec3 calcN(vec3 p){const vec2 k=vec2(1,-1);float e=.004;
  return normalize(k.xyy*map(p+k.xyy*e)+k.yyx*map(p+k.yyx*e)+k.yxy*map(p+k.yxy*e)+k.xxx*map(p+k.xxx*e));}
void main(){
  vec2 fc=(floor(gl_FragCoord.xy/uPix)+.5)*uPix;
  vec2 uv=(fc-.5*uRes)/(min(uRes.x,uRes.y)*.5);
  float kf=1.-uForm; kf=kf*kf;
  vec2 cellc=floor(fc);
  float sang=atan(uv.y,uv.x);
  float sedge=.8+.1*sin(sang*3.+uTime*.6)+.07*sin(sang*5.-uTime*.9);
  float fall=1.-smoothstep(sedge-.6,sedge+.12,length(uv));
  vec2 jit=vec2(hash(cellc+uSeed),hash(cellc+17.3+uSeed))-.5;
  jit+=.18*vec2(sin(uTime*1.7+hash(cellc+3.1)*6.283),cos(uTime*1.4+hash(cellc+9.7)*6.283));
  uv=rot(kf*(2.6+uTime*.35))*uv*(1.+kf*1.4)+jit*kf*2.6;
  float fr=mix(uA==19?1.:0.,uB==19?1.:0.,uT);
  float yaw=(.55+.32*sin(uTime*.45+uSeed))*(1.-.9*fr),pitch=(.42+.04*sin(uTime*.7))*(1.-.9*fr);
  float cy=cos(yaw),sy=sin(yaw),cp=cos(pitch),sp=sin(pitch);
  R=mat3(cy,0.,sy,0.,1.,0.,-sy,0.,cy)*mat3(1.,0.,0.,0.,cp,-sp,0.,sp,cp);
  vec3 ro=vec3(0.,.05,3.3),rd=normalize(vec3(uv*.92,-2.6)),L=normalize(vec3(-.55,.85,.5));
  float lum=0.;
  float b=dot(ro,rd),c=dot(ro,ro)-1.3*1.3*uScale*uScale,disc=b*b-c;
  bool hit=false;float t=0.;
  if(disc>0.){t=max(-b-sqrt(disc),0.);float tmax=-b+sqrt(disc);
    for(int i=0;i<72;i++){float d=map(ro+rd*t);if(d<.0015){hit=true;break;}t+=d*.85;if(t>tmax)break;}}
  if(hit){vec3 pos=ro+rd*t,n=calcN(pos);float dif=max(dot(n,L),0.);
    float rim=pow(1.-max(dot(n,-rd),0.),3.)*.25;float lit=clamp(.18+.82*dif+rim,0.,1.);lum=.12+.82*(1.-lit);}
  else if(rd.y<0.){float tg=(-.82*uScale-ro.y)/rd.y;vec3 g=ro+rd*tg;vec2 sp2=(g.xz-vec2(.18,-.05)*uScale)/uScale;
    lum=(1.-smoothstep(.1,.75,length(sp2*vec2(1.,1.6))))*.2;}
  if(!hit){lum+=step(.992-.012*uShimmer,hash(cellc+floor(uTime*10.)))*.35*uShimmer*smoothstep(1.4,.4,length(uv));}
  lum*=mix(1.,fall,kf);
  lum=max(lum,step(.972,hash(cellc+3.1+uSeed))*kf*.95*step(hash(cellc+7.7),fall));
  float tone=clamp(lum,0.,1.),on;
  if(tone<1./17.)on=0.;else if(tone>16./17.)on=1.;
  else{float f=floor(uTime*9.)*uShimmer;vec2 q=mod(floor(gl_FragCoord.xy-.5*uRes)+vec2(f,f*3.),4.);
    on=step(float(bayer4x4[int(q.y)*4+int(q.x)]+1)/17.,tone);}
  outColor=on>.5?vec4(uFront,1.):vec4(0.);
}`

const VERT = `#version 300 es
in vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}`

const CELL = 2 // css px per dither cell
export const MORPH_MS = 900
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

type Uniforms = Record<"res" | "time" | "a" | "b" | "t" | "scale" | "front" | "form" | "pix" | "shimmer" | "seed", WebGLUniformLocation | null>

// One canvas and one GL context per tile. A single shared rAF loop draws only the minds that are on screen.
const minds = new Set<Mind>()
// Canvases whose GPU context is due to be freed after an unmount
const releasing = new WeakMap<HTMLCanvasElement, number>()
let raf = 0
let last = 0
const start = typeof performance !== "undefined" ? performance.now() : 0

function loop(now: number) {
  const dt = Math.min(64, last ? now - last : 16)
  last = now
  const time = ((now - start) / 1000) * 0.7
  let any = false
  for (const m of minds) any = m.frame(now, time, dt) || any
  raf = any ? requestAnimationFrame(loop) : 0
  if (!raf) last = 0
}
function kick() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(loop)
}

export class Mind {
  private gl: WebGL2RenderingContext | null
  private u = {} as Uniforms
  private A: number
  private B: number
  private t0 = -1e9
  private form: number
  private hold: boolean
  private shimmer = 0
  private pulseUntil = 0
  private visible = false
  private dirty = true
  private ro: ResizeObserver
  private io: IntersectionObserver
  private mo: MutationObserver
  readonly ok: boolean
  shape: ShapeName

  constructor(
    private host: HTMLElement,
    private canvas: HTMLCanvasElement,
    shape: ShapeName,
    private seed: number,
    private reduced: boolean,
  ) {
    this.shape = shape
    this.A = this.B = SHAPES[shape]
    this.form = reduced ? 1 : 0
    this.hold = !reduced
    // A remount on the same canvas (React Strict Mode, Fast Refresh) cancels the pending release
    clearTimeout(releasing.get(canvas))
    releasing.delete(canvas)
    const gl = (this.gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" }))
    this.ro = new ResizeObserver(() => this.resize())
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting
      kick()
    }, { rootMargin: "80px" })
    // The ink follows the page text colour, so a light/dark switch recolours the objects
    this.mo = new MutationObserver(() => this.setInk())
    // The browser can hand back a context it has already taken away (too many canvases, a GPU
    // reset). Building on it fails with empty logs, so wait for webglcontextrestored instead.
    const lost = !!gl && gl.isContextLost()
    this.ok = !!gl && (lost || this.build())
    if (!this.ok) return
    this.ro.observe(host)
    this.io.observe(host)
    this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    canvas.addEventListener("webglcontextlost", this.onLost)
    canvas.addEventListener("webglcontextrestored", this.onRestored)
    if (!lost) minds.add(this)
  }

  private onLost = (e: Event) => {
    e.preventDefault()
    minds.delete(this)
  }
  private onRestored = () => {
    if (this.build()) {
      minds.add(this)
      this.resize()
    }
  }

  private build() {
    const gl = this.gl!
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const fs = sh(gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // A lost context fails every call with empty logs; webglcontextrestored rebuilds it
      if (gl.isContextLost()) return false
      console.error(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog))
      return false
    }
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "aPos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(prog, n)
    this.u = {
      res: U("uRes"), time: U("uTime"), a: U("uA"), b: U("uB"), t: U("uT"), scale: U("uScale"), front: U("uFront"),
      form: U("uForm"), pix: U("uPix"), shimmer: U("uShimmer"), seed: U("uSeed"),
    }
    this.setInk()
    gl.uniform1f(this.u.seed, this.seed)
    gl.clearColor(0, 0, 0, 0)
    return true
  }

  private resize() {
    if (!this.gl) return
    const r = this.host.getBoundingClientRect()
    const w = Math.max(1, Math.round(r.width / CELL))
    const h = Math.max(1, Math.round(r.height / CELL))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.gl.viewport(0, 0, w, h)
    }
    this.gl.uniform2f(this.u.res, w, h)
    this.dirty = true
    kick()
  }

  /** Let the loose dots pull together into the shape. */
  conjure() {
    this.hold = false
    kick()
  }

  /** Morph to another shape; a retarget mid-morph starts from whichever shape is closer. */
  show(name: ShapeName) {
    if (name === this.shape) return
    const now = performance.now()
    const k = Math.min(1, (now - this.t0) / MORPH_MS)
    this.A = k < 0.5 ? this.A : this.B
    this.B = SHAPES[name]
    this.shape = name
    if (this.reduced) {
      this.A = this.B
      this.t0 = -1e9
      this.dirty = true
    } else {
      this.t0 = now
      this.pulseUntil = now + 700 // shimmer while it "works"
    }
    kick()
  }

  /** Draws one frame if needed. Returns whether it wants another. */
  frame(now: number, time: number, dt: number) {
    const gl = this.gl
    if (!gl || !this.visible) return false
    const morphing = now - this.t0 < MORPH_MS
    const forming = !this.hold && this.form < 1
    if (this.reduced && !this.dirty && !morphing && !forming) return false
    const u = this.u
    const t = easeInOut(Math.min(1, (now - this.t0) / MORPH_MS))
    if (forming) this.form = Math.min(1, this.form + (dt / 1000) * 0.55)
    this.shimmer += ((now < this.pulseUntil ? 1 : 0) - this.shimmer) * 0.12
    const fe = 1 - Math.pow(1 - this.form, 3)
    gl.uniform1f(u.time, this.reduced ? 0 : time + this.seed * 3.1)
    gl.uniform1i(u.a, this.A)
    gl.uniform1i(u.b, this.B)
    gl.uniform1f(u.t, t)
    gl.uniform1f(u.form, fe)
    gl.uniform1f(u.pix, fe < 0.3 ? 4 : fe < 0.6 ? 3 : fe < 0.85 ? 2 : 1) // coarse to fine while it forms
    gl.uniform1f(u.shimmer, !this.reduced && this.shimmer > 0.5 ? 1 : 0)
    gl.uniform1f(u.scale, 1 + 0.06 * Math.sin(Math.PI * t))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    this.dirty = false
    return !this.reduced || morphing || forming
  }

  // Reads the .ah --fg token (#333333 light, #e6e6e6 dark) into the shader's ink uniform
  private setInk() {
    const gl = this.gl
    if (!gl || gl.isContextLost()) return
    const m = getComputedStyle(this.host).color.match(/[\d.]+/g)
    const [r, g, b] = m ? m.slice(0, 3).map((v) => +v / 255) : [0.2, 0.2, 0.2]
    gl.uniform3f(this.u.front, r, g, b)
    this.dirty = true
    kick()
  }

  destroy() {
    minds.delete(this)
    this.mo.disconnect()
    this.ro.disconnect()
    this.io.disconnect()
    this.canvas.removeEventListener("webglcontextlost", this.onLost)
    this.canvas.removeEventListener("webglcontextrestored", this.onRestored)
    // Free the GPU context, but a tick later: if the component remounts onto this same canvas
    // straight away, the new Mind cancels this and reuses the live context instead of a dead one
    const ext = this.gl?.getExtension("WEBGL_lose_context")
    if (ext) releasing.set(this.canvas, window.setTimeout(() => {
      releasing.delete(this.canvas)
      ext.loseContext()
    }, 0))
  }
}

if (typeof document !== "undefined") document.addEventListener("visibilitychange", kick)
