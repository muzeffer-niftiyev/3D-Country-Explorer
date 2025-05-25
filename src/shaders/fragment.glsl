uniform sampler2D uLightTexture;
uniform sampler2D uDarkTexture;
uniform sampler2D uSpecularTexture;
uniform vec3 uSunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    float sunOrientation = dot(uSunDirection, normal);

    float lightMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec3 lightColor = texture(uLightTexture, vUv).rgb;
    vec3 darkColor = texture(uDarkTexture, vUv).rgb;
    color = mix(darkColor, lightColor, lightMix);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}