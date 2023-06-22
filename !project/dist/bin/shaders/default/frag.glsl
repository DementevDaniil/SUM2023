#version 300 es
precision highp float;

out vec4 o_color;
uniform float time;
uniform vec3 camLoc;

uniform int isTex0;
uniform int isTex1;
uniform int isTex2;
uniform int isTex3;

in vec3 v_position;
in vec2 v_texCoords;
in vec3 v_normal;
in vec4 v_color;

uniform vec3 in_Ka;
uniform vec3 in_Kd;
uniform vec3 in_Ks;
uniform float in_Ph;
uniform float in_Trans;
uniform float in_IsShade;

uniform sampler2D texture0;

vec3 shade(vec3 p, vec3 n) {
    vec3 l = normalize(vec3(1, 15, 10));
    vec3 lc = vec3(1);
    vec3 color = vec3(0);
    vec3 v = normalize(p - camLoc);
    color = in_Ka;
    vec3 kd = in_Kd;
    if (isTex0 == 1)
      kd *= texture(texture0, v_texCoords).rgb;
    n = faceforward(n, v, n);
    color += max(0.0, dot(n, l)) * kd * lc; 
    vec3 r = reflect(v, n);
    color += pow(max(0.0, dot(r, l)), in_Ph) * in_Ks * lc;
    return color;
}

void main() {
    if (in_IsShade == 1.0) {
        o_color = vec4(pow(shade(v_position, normalize(v_normal)), vec3(1.0 / 2.2)), 1);
    }
    else if (isTex0 == 1) {
        o_color = texture(texture0, vec2(1, -1) * v_texCoords);
    }
    else {
        o_color = v_color;
    }
}