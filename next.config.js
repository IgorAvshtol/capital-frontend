module.exports = {
    images: {
        domains: [
            'localhost',
            'ikfk.ru',
            'admin.ikfk.ru'
        ]
    },

    async redirects() {
        return [
            {
                source: '/categories',
                destination: '/',
                permanent: true,
            },
        ]
    },
}