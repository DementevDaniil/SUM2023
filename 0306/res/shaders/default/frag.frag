#version 300 es
precision highp float;
out vec4 o_color;
in vec4 color;
uniform float time;

float
    W = 500.0,
    H = 500.0,
    X0 = -2.0,
    X1 = 2.0,
    Y0 = -2.0,
    Y1 = 2.0;

float Julia( vec2 Z, vec2 C )
{
  for (float i = 0.0; i < 256.0; i += 1.0)
  {
    if (dot(Z, Z) > 4.0)
      return i;
    Z = C + vec2(Z.x * Z.x - Z.y * Z.y, Z.x * Z.y * 2.0);
  }
  return 256.0;
}

void main()
{
  vec2 C = vec2(0.35 + 0.08 * sin(time + 3.0), 0.39 + 0.08 * sin(1.1 * time));

  float a = X0 + gl_FragCoord.x * (X1 - X0) / W;
  float b = Y0 + gl_FragCoord.y * (Y1 - Y0) / H;
  vec2 Z = vec2(a, b);
  float n = Julia(Z, C) / 256.0;
  o_color = vec4(n / 128.0, n, n, 1);
  // o_color = vec4(1, 1, 0, 1);
  o_color = color;
}