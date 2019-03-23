const path = require("path");

module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            "@core": path.resolve(__dirname, "src/core"),
            "@utils": path.resolve(__dirname, "src/utils"),
        },
    };

    return config;
};
