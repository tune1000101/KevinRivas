import { useRef, useEffect } from 'react'

const vertSrc = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragSrc = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;
  uniform float u_speed;
  uniform float u_scale;
  uniform float u_freq;
  uniform float u_warp;
  uniform float u_noise;
  uniform float u_parallax;
  uniform int   u_iterations;
  uniform float u_intensity;
  uniform float u_band;
  uniform float u_rotation;
  uniform vec3  u_colors[5];
  uniform float u_mouseInfluence;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p, int iters) {
    float v = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= iters) break;
      v += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  mat2 rotate2d(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = (uv - 0.5) * u_scale;
    uv *= rotate2d(u_rotation);

    vec2 mouse = (u_mouse / u_resolution - 0.5) * u_mouseInfluence;
    float t = u_time * u_speed;

    vec2 q = vec2(
      fbm(uv * u_freq + t * 0.1 + mouse, u_iterations),
      fbm(uv * u_freq + vec2(1.7, 9.2) + t * 0.12 + mouse, u_iterations)
    );

    vec2 r = vec2(
      fbm(uv * u_freq + u_warp * q + vec2(1.7, 9.2) + t * 0.08, u_iterations),
      fbm(uv * u_freq + u_warp * q + vec2(8.3, 2.8) + t * 0.09, u_iterations)
    );

    float f = fbm(uv * u_freq + u_warp * r + t * 0.05 + mouse * u_parallax, u_iterations);
    f = f * 0.5 + 0.5;
    f += u_noise * (hash(uv + t) - 0.5);

    // Band modulation
    float band = sin(f * u_band * 3.14159);
    f = mix(f, f + band * 0.1, 0.3);

    // Map f → color
    float t1 = clamp(f * 4.0, 0.0, 1.0);
    float t2 = clamp(f * 4.0 - 1.0, 0.0, 1.0);
    float t3 = clamp(f * 4.0 - 2.0, 0.0, 1.0);
    float t4 = clamp(f * 4.0 - 3.0, 0.0, 1.0);

    vec3 col = mix(u_colors[0], u_colors[1], t1);
    col = mix(col, u_colors[2], t2);
    col = mix(col, u_colors[3], t3);
    col = mix(col, u_colors[4], t4);
    col *= u_intensity;

    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export default function ColorBends({
  colors = ['#6366F1', '#4F46E5', '#1a1040', '#0D0D1A', '#7C3AED'],
  rotation = 90,
  speed = 0.15,
  scale = 1.2,
  frequency = 0.8,
  warpStrength = 0.8,
  mouseInfluence = 0.3,
  noise = 0.08,
  parallax = 0.3,
  iterations = 2,
  intensity = 1.2,
  bandWidth = 5,
  style = {},
}) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const progRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return
    glRef.current = gl

    function compile(type, src) {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    progRef.current = prog

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    // Upload color uniforms
    const flatColors = colors.slice(0, 5).flatMap(c => hexToRgb(c))
    for (let i = 0; i < 5; i++) {
      const loc = gl.getUniformLocation(prog, `u_colors[${i}]`)
      gl.uniform3f(loc, flatColors[i*3], flatColors[i*3+1], flatColors[i*3+2])
    }

    gl.uniform1f(gl.getUniformLocation(prog, 'u_speed'), speed)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_scale'), scale)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_freq'), frequency)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_warp'), warpStrength)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_noise'), noise)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_parallax'), parallax)
    gl.uniform1i(gl.getUniformLocation(prog, 'u_iterations'), Math.min(iterations, 8))
    gl.uniform1f(gl.getUniformLocation(prog, 'u_intensity'), intensity)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_band'), bandWidth)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_rotation'), (rotation * Math.PI) / 180)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_mouseInfluence'), mouseInfluence)

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(gl.getUniformLocation(prog, 'u_resolution'), canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouse(e) {
      mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    function render() {
      const t = (Date.now() - startRef.current) / 1000
      gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), t)
      gl.uniform2f(gl.getUniformLocation(prog, 'u_mouse'), mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
