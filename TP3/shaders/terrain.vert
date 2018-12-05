attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;

uniform float heightScale;


void main()
{
	vTextureCoord = aTextureCoord;
    vec4 rgb = texture2D(uSampler2, vTextureCoord);
    vec3 offset = vec3(0.0, rgb.r*0.3+rgb.g*0.59+rgb.b*0.11, 0.0);
    offset= offset*heightScale;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}