const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");


module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage
} = {}) {

  logWarningFor(globalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const tokenAttributes = generateAttrsObject(token);

    const src = tokenAttributes.src;

    const tokenAttributesWithoutSrc = remove("src").from(tokenAttributes);

    const globalAttributesWithoutTitle = remove("title").from(globalAttributes);

    const imageAttributes = { ...globalAttributesWithoutTitle, ...tokenAttributesWithoutSrc }

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  }
}