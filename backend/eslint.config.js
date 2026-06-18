const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-restricted-properties": [
        "error",
        {
          "object": "fs",
          "property": "writeFile",
          "message": "Local file system writes are strictly banned. Use S3/R2 cloud storage for all uploads."
        },
        {
          "object": "fs",
          "property": "writeFileSync",
          "message": "Local file system writes are strictly banned. Use S3/R2 cloud storage for all uploads."
        },
        {
          "object": "fs",
          "property": "createWriteStream",
          "message": "Local file system writes are strictly banned. Use S3/R2 cloud storage for all uploads."
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          "paths": [{
            "name": "fs/promises",
            "message": "Local file system writes are strictly banned. Use S3/R2 cloud storage for all uploads."
          }]
        }
      ]
    }
  }
];
