module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                publish: [
                    {
                        provider: 'generic',
                        url: '' // 放置安装包和latest.yml的服务器地址
                    }
                ],
            },
            nodeIntegration: true
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                }
            ]
        }
    }
}