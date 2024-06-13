module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.232.129:2501',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
