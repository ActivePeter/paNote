module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:2706', // the waverless backend
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        allowedHosts: ['hanbaoaaa.xyz']
    }
}
