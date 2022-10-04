const path = require("path");
const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");

module.exports = function markdownItEleventyImg(
  md,
  { imgOptions = {}, globalAttributes = {}, renderImage, baseDir } = {}
) {
  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");

  const normalizedGlobalAttributes = propertiesFrom(globalAttributes)
    .lowerCased()
    .trimmed()
    .object();

  logWarningFor(normalizedGlobalAttributes);

  md.renderer.rules.image = (tokens, index, rendererOptions, env, renderer) => {
    const token = tokens[index];

    const normalizedTokenAttributes =
      generateAttrsObject(token).addContentTo("alt").attrs;

    const src = normalizedTokenAttributes.src;
    const isRemoteUrl = Image.Util.isRemoteUrl(src);
    const isGif = src.endsWith(".gif");
    const absoluteSrc = isRemoteUrl || baseDir !== "current-file"
      ? src
      : path.resolve(
        path.dirname(env.page.inputPath),
        normalizedTokenAttributes.src
      );

    const normalizedTokenAttributesWithoutSrc = remove("src").from(
      normalizedTokenAttributes
    );

    const imageAttributes = {
      ...normalizedGlobalAttributes,
      ...normalizedTokenAttributesWithoutSrc,
    };

    if (renderImage) {
      const image = [Image, imgOptions];
      const attributes = [absoluteSrc, imageAttributes];
      return renderImage(image, attributes);
    }

    if (isRemoteUrl || isGif) {
      token.attrs[token.attrIndex("alt")][1] = token.content;
      return renderer.renderToken(tokens, index, rendererOptions);
    }

    Image(absoluteSrc, imgOptions);

    const metadata = Image.statsSync(absoluteSrc, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline",
    });

    return imageMarkup;
  };
};
