#version 300 es
precision highp float;
layout(location = 0) in vec3 in_pos;
layout(location = 1) in vec3 in_normal;
out vec4 color;

uniform mat4 wvp;
uniform mat4 w;
uniform mat4 winv;

void main()
{
    gl_Position = wvp * vec4(in_pos, 1);
    color = vec4(in_pos, 1);
    vec4 normal = winv * vec4(in_normal, 1);
    color = normal;
    // color = vec4(1, 0, 0, 1);
}
