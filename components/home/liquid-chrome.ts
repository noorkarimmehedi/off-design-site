// Smoked glass: one small raymarched WebGL canvas per service tile, rendering a near-black glass object
// with pale edges and a band of the site yellow drifting through it. Each object keeps working on
// its own; on a fine pointer it turns toward the cursor on a slightly underdamped spring, a drop of glass
// follows the pointer and melts into it, and the yellow band brightens.
// One shared rAF loop ticks only the tiles on screen, and nothing runs in a hidden tab.
// With reduced motion each tile renders one still frame.

// Signed-distance bodies, one per service, in the order of `services` in lib/home.ts
const SHAPES = [
  // Web: browser slab, tipped back so the screen reflects the darker floor, with a drop of chrome sliding over it
  `q.yz*=R(-0.32+0.1*sin(uT*0.6)); q.xz*=R(0.5*sin(uT*0.45));
   float d=box(q,vec3(1.02,0.72,0.12),0.12);
   d=smax(d,-box(q-vec3(0.,-0.1,0.2),vec3(0.86,0.46,0.12),0.07),0.04);
   for(int i=0;i<3;i++) d=smin(d,length(q-vec3(-0.82+0.17*float(i),0.57,0.12))-0.05,0.03);
   d=smin(d,length(q-vec3(0.5*sin(uT*0.9),-0.1+0.22*sin(uT*1.8),0.1))-0.17,0.16);`,
  // Tools: a bar chart that keeps re-measuring itself
  `q.yz*=R(-0.3); q.xz*=R(0.55*sin(uT*0.4)+0.3);
   float d=box(q-vec3(0.,-0.78,0.),vec3(1.0,0.07,0.4),0.07);
   for(int i=0;i<4;i++){ float fi=float(i); float h=0.22+0.1*fi+0.26*(0.5+0.5*sin(uT*1.2+fi*1.9));
     d=smin(d,box(q-vec3(-0.69+0.46*fi,-0.72+h,0.),vec3(0.17,h,0.17),0.1),0.07); }`,
  // Automation: a gyroscope, two rings round a core, and an agent running laps
  `q.yz*=R(-0.35);
   vec3 a=q; a.xy*=R(uT*0.5); a.yz*=R(uT*0.8); float d=torus(a,vec2(0.92,0.085));
   vec3 b=q; b.xz*=R(uT*0.6); b.xy*=R(1.2+uT*0.9); d=min(d,torus(b,vec2(0.62,0.08)));
   d=smin(d,length(q)-(0.26+0.03*sin(uT*2.)),0.1);
   d=smin(d,length(b-vec3(cos(uT*2.)*0.62,0.,sin(uT*2.)*0.62))-0.13,0.1);`,
  // ERP: eight modules breathing apart and back into one block
  `q.yz*=R(-0.62); q.xz*=R(uT*0.35+0.6);
   float c=0.3+0.13*(0.5+0.5*sin(uT*1.1));
   float d=box(abs(q)-c,vec3(0.25),0.07);
   d=smin(d,length(q)-0.2,0.25);`,
  // Brand: the arc. mark, with a swell travelling along the arch
  `q.xz*=R(0.6*sin(uT*0.5)); q.yz*=R(0.2*sin(uT*0.7));
   vec3 a=q-vec3(-0.18,-0.25,0.);
   float d=capTorus(a,vec2(sin(1.75),cos(1.75)),0.7,0.17);
   float th=1.5*sin(uT*0.8);
   d=smin(d,length(a-vec3(sin(th),cos(th),0.)*0.7)-0.21,0.2);
   d=smin(d,length(q-vec3(0.92,-0.38+0.1*sin(uT*1.6),0.))-0.18,0.18);`,
]

const VERT = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`
// Smoked glass: near-black glass with pale edges, one band of the site yellow drifting through it.
// The ray refracts in, marches through the body, and leaves in three slightly different directions
// (one per channel) so the band gets a thin amber fringe. `lite` trims the march for phones.
const frag = (shape: string, deriv: boolean, lite: boolean) => `${deriv ? "#extension GL_OES_standard_derivatives : enable\n" : ""}precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec2 uRot; uniform vec3 uPtr;
mat2 R(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
float smax(float a,float b,float k){ return -smin(-a,-b,k); }
float box(vec3 p,vec3 b,float r){ vec3 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r; }
float torus(vec3 p,vec2 t){ vec2 q=vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
float capTorus(vec3 p,vec2 sc,float ra,float rb){ p.x=abs(p.x); float k=(sc.y*p.x>sc.x*p.y)?dot(p.xy,sc):length(p.xy); return sqrt(dot(p,p)+ra*ra-2.*ra*k)-rb; }
float map(vec3 p){
  vec3 q=p; q.yz*=R(uRot.y); q.xz*=R(uRot.x);
  ${shape}
  if(uPtr.z>0.01) d=smin(d,length(p-vec3(uPtr.xy,0.5))-0.25*uPtr.z,0.38*uPtr.z);
  return d;
}
vec3 nrm(vec3 p){ vec2 e=vec2(0.0015,-0.0015); return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx)); }
const vec3 Y=vec3(0.992,0.878,0.278);
// a drifting yellow band, a low amber strip, a quiet softbox and a thin white strip
// sh sharpens the band (transmitted light sees a thin band, reflections the full soft one)
vec3 env(vec3 r,float sh,float k){
  float y0=0.1+0.3*sin(uT*0.35);
  vec3 c=Y*pow(smoothstep(0.24,0.03,abs(r.y-y0-0.35*r.x)),sh)*(1.5+1.5*uPtr.z)*k;
  c+=vec3(1.,0.72,0.2)*0.5*smoothstep(0.16,0.02,abs(r.y+0.62));
  c+=vec3(0.9,0.95,1.)*0.4*smoothstep(0.6,0.98,dot(r,normalize(vec3(-0.6,0.6,0.5))));
  c+=vec3(1.)*0.3*smoothstep(0.1,0.02,abs(r.x-0.75));
  return c+0.008;
}
vec3 out2(vec3 ri,vec3 n2,float eta){ vec3 o=refract(ri,-n2,eta); return dot(o,o)<0.5?reflect(ri,-n2):o; }
void main(){
  float m=min(uRes.x,uRes.y);
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/m*2.;
  vec3 ro=vec3(0.,0.,4.2), rd=normalize(vec3(uv,-3.0));
  float t=2.3, d=1., md=1.;
  for(int i=0;i<${lite ? 52 : 68};i++){ d=map(ro+rd*t); md=min(md,d); if(d<0.002||t>6.4) break; t+=d; }
  float hit=step(d,0.01);
  vec3 col=vec3(0.); float a;
  if(hit>0.5){
    vec3 p=ro+rd*t, n=nrm(p);
    ${deriv ? "float edge=smoothstep(7.,16.,length(fwidth(n))*m/2.8);" : "float edge=0.;"}
    float l=0.5+0.5*dot(n,normalize(vec3(-0.4,0.7,0.6)));
    float cs=max(dot(n,-rd),0.);
    float F=0.04+0.96*pow(1.-cs,5.);
    vec3 ri=refract(rd,n,1./1.5);
    vec3 pi=p-n*0.03; float ti=0.;
    for(int i=0;i<${lite ? 14 : 20};i++){ float di=-map(pi+ri*ti); if(di<0.004||ti>2.6) break; ti+=max(di,0.012); }
    vec3 n2=nrm(pi+ri*ti);
    // light coming through sees a much thinner band that fades with depth, so a flat face reads as
    // dark glass with a line of yellow passing through it rather than a gold surface
    float k=0.85+0.15*uPtr.z;
    vec3 tr=vec3(env(out2(ri,n2,1.44),4.,k).r,env(out2(ri,n2,1.5),4.,k).g,env(out2(ri,n2,1.57),4.,k).b);
    col=tr*(1.-F)*exp(-ti*0.45);
    col+=env(reflect(rd,n),1.,1.)*F*0.8;
    col+=vec3(1.,0.97,0.9)*edge*(0.08+0.6*l*l);
    col+=vec3(1.)*0.1*(1.-cs)*(1.-cs);
    col=1.-exp(-1.35*max(col,0.));
    a=max(0.86,max(col.r,max(col.g,col.b)));
  } else {
    // anti-aliased pale silhouette and a faint yellow halo
    float aa=1.-smoothstep(0.,0.014,md);
    col=vec3(0.9,0.88,0.82)*aa*0.85+Y*(0.1+0.16*uPtr.z)*exp(-md*13.)*(1.-aa);
    a=clamp(max(col.r,max(col.g,col.b)),0.,1.);
  }
  gl_FragColor=vec4(clamp(col,0.,a),a);
}`

/* ── shared loop ── */
const active = new Set<Chrome>()
let raf = 0
let last = 0
function frame(now: number) {
  raf = 0
  const dt = last ? Math.min(50, now - last) : 16.7
  last = now
  active.forEach((c) => c.tick(dt))
  kick()
}
function kick() {
  if (!raf && active.size && !document.hidden) raf = requestAnimationFrame(frame)
}
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    last = 0
    kick()
  })
}

// A remount onto the same canvas (Strict Mode, Fast Refresh) must not find a context we just killed,
// so the release waits a tick and a new Chrome on that canvas cancels it
const releasing = new WeakMap<HTMLCanvasElement, number>()

type Uniforms = Record<"res" | "t" | "rot" | "ptr", WebGLUniformLocation | null>

export class Chrome {
  readonly ok: boolean
  private gl: WebGLRenderingContext | null
  private u = {} as Uniforms
  private W = 0
  private H = 0
  private time: number
  // spring state: rotation toward the pointer, hover amount, the follower drop's position
  private ry = 0
  private rx = 0
  private vy = 0
  private vx = 0
  private hov = 0
  private qx = 0
  private qy = 0
  private ptr = { x: 0, y: 0, on: false }
  private ro: ResizeObserver
  private io: IntersectionObserver
  private offs: (() => void)[] = []
  private lite = matchMedia("(pointer: coarse), (max-width: 700px)").matches

  constructor(
    private tile: HTMLElement,
    private host: HTMLElement,
    private canvas: HTMLCanvasElement,
    idx: number,
    private reduced: boolean,
  ) {
    this.time = idx * 1.9 + 2
    clearTimeout(releasing.get(canvas))
    releasing.delete(canvas)
    this.gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" })
    this.ro = new ResizeObserver(() => this.resize())
    this.io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !this.reduced) {
          if (!raf) last = 0
          active.add(this)
          kick()
        } else active.delete(this)
      },
      { rootMargin: "80px" },
    )
    this.ok = this.build(SHAPES[idx])
    if (!this.ok) return
    this.ro.observe(host)
    this.io.observe(tile)
    if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const move = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        this.ptr.x = e.clientX - r.left
        this.ptr.y = e.clientY - r.top
        this.ptr.on = true
      }
      const leave = () => (this.ptr.on = false)
      tile.addEventListener("pointermove", move)
      tile.addEventListener("pointerleave", leave)
      this.offs.push(() => {
        tile.removeEventListener("pointermove", move)
        tile.removeEventListener("pointerleave", leave)
      })
    }
    const lost = (e: Event) => e.preventDefault()
    canvas.addEventListener("webglcontextlost", lost)
    this.offs.push(() => canvas.removeEventListener("webglcontextlost", lost))
  }

  private build(shape: string) {
    const gl = this.gl
    if (!gl) return false
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    const deriv = !!gl.getExtension("OES_standard_derivatives")
    // phones and small screens get a shorter march and a 1x backing store
    const fs = sh(gl.FRAGMENT_SHADER, frag(shape, deriv, this.lite))
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (!gl.isContextLost()) console.error(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog))
      return false
    }
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(prog, n)
    this.u = { res: U("uRes"), t: U("uT"), rot: U("uRot"), ptr: U("uPtr") }
    gl.clearColor(0, 0, 0, 0)
    return true
  }

  private resize() {
    this.W = this.host.clientWidth
    this.H = this.host.clientHeight
    if (!this.W || !this.H || !this.gl) return
    // Raymarching is per pixel, so cap the backing store; the soft chrome hides the difference
    const dpr = Math.min(window.devicePixelRatio || 1, this.lite ? 1 : 1.5)
    this.canvas.width = Math.round(this.W * dpr)
    this.canvas.height = Math.round(this.H * dpr)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.draw()
  }

  private draw() {
    const gl = this.gl
    if (!gl || gl.isContextLost()) return
    const u = this.u
    gl.uniform2f(u.res, this.canvas.width, this.canvas.height)
    gl.uniform1f(u.t, this.time)
    gl.uniform2f(u.rot, this.ry, this.rx)
    gl.uniform3f(u.ptr, this.qx, this.qy, this.hov)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  tick(dt: number) {
    const f = dt / 1000
    const { W, H, ptr } = this
    if (!W || !H) return
    this.time += f * (1 + this.hov * 0.6) // hovered, the object works a little faster
    const nx = ptr.on ? (ptr.x / W) * 2 - 1 : 0
    const ny = ptr.on ? (ptr.y / H) * 2 - 1 : 0
    // underdamped spring toward the pointer: overshoots a touch, then settles
    this.vy += ((nx * 0.75 - this.ry) * 110 - this.vy * 11) * f
    this.ry += this.vy * f
    this.vx += ((-ny * 0.55 - this.rx) * 110 - this.vx * 11) * f
    this.rx += this.vx * f
    this.hov += ((ptr.on ? 1 : 0) - this.hov) * Math.min(1, f * 6)
    if (ptr.on) {
      // pointer → scene units on the z=0.5 plane, where the drop lives
      const m = Math.min(W, H)
      const k = 2 * (3.7 / 3.0)
      const wx = ((ptr.x - W / 2) / m) * k
      const wy = (-(ptr.y - H / 2) / m) * k
      if (this.hov < 0.05) {
        this.qx = wx
        this.qy = wy
      } else {
        const e = Math.min(1, f * 12)
        this.qx += (wx - this.qx) * e
        this.qy += (wy - this.qy) * e
      }
    }
    this.draw()
  }

  destroy() {
    active.delete(this)
    this.ro.disconnect()
    this.io.disconnect()
    this.offs.forEach((off) => off())
    const gl = this.gl
    const canvas = this.canvas
    releasing.set(
      canvas,
      window.setTimeout(() => {
        releasing.delete(canvas)
        gl?.getExtension("WEBGL_lose_context")?.loseContext()
      }, 0),
    )
  }
}
