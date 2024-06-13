module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:2701',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        allowedHosts: ['hanbaoaaa.xyz']
    }
}
