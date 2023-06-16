#version 300 es
precision highp float;
in vec4 in_pos;
out vec4 color;

void main()
{
    gl_Position.x = in_pos.x;
    gl_Position.y = in_pos.y;
    color = vec4(1, 1, 0, 1);
}
