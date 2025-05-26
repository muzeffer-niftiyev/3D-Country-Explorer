uniform sampler2D uLightTexture;
uniform sampler2D uDarkTexture;
uniform sampler2D uSpecularTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereLightColor;
uniform vec3 uAtmosphereTwilightColor;

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

    vec2 specularCloudsColor = texture(uSpecularTexture, vUv).rg;

    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    float atmosphereLightMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereLightColor, atmosphereLightMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereLightMix);

    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 64.0);
    specular *= specularCloudsColor.r;
    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color += specular * specularColor;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}