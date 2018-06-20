const innerPathRegex = "[\\w\\.\\-\\~\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=\\:\\@]+";

export default {
    path: `^((${innerPathRegex}\\/)+)?$`,
    page: `^(${innerPathRegex}(\\/${innerPathRegex})*)?$`,
    imageName: `^([\\w\\-]+\\.[\\w]+)?$`,
    contentId: `^(\\w+(-\\w+)*)?$`,
    htmlId: `^([a-zA-Z0-9][\\w\\-\\:\\.]*)?$`,
    fourCoords: `^(\\d+,\\d+,\\d+,\\d+)?$`,
    threeCoords: `^(\\d+,\\d+,\\d+)?$`
};