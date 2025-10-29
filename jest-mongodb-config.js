module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '4.0.3', //should be the same version on prod
            skipMD5: true,
        },
        autoStart: false,
        instance: {},
    },
};
