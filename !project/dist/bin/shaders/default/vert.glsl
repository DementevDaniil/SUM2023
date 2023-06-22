#version 300 es
precision highp float;

layout(location = 0) in vec3 in_pos;
layout(location = 1) in vec2 in_tex;
layout(location = 2) in vec3 in_normal;
layout(location = 3) in vec4 in_color;

out vec3 v_position;
out vec2 v_texCoords;
out vec3 v_normal;
out vec4 v_color;

uniform mat4 wvp;
uniform mat4 w;
uniform mat4 winv;
uniform mat4 vp;

void main()
{
    gl_Position = wvp * vec4(in_pos, 1);
    // gl_PointSize = 4.0;
    v_color = in_color;
    v_position = (w * vec4(in_pos, 1)).xyz;
    v_normal = mat3(winv) * in_normal;
    v_texCoords = in_tex;
}