const markdownIt = require("markdown-it");
const markdownItEleventyImg = require("./");
const path = require("path");

module.exports = config => {

  config.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItEleventyImg, {
    imgOptions: {
      widths: [800, 500, 300],
      urlPath: "/images/",
      outputDir: path.join("_site", "images"),
      formats: ["avif", "webp", "jpeg"]
    },
    globalAttributes: {
      class: "markdown-image",
      decoding: "async",
      sizes: "100vw",
      alt: "Uniform alt",
      title: "Uniform title"
    }
  }));

  return {
    dir: {
        input: 'eleventy',
        output: '_site'
    },
    pathPrefix: '/',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['html', 'md']
}
}
