const { createProxyMiddleware } = require("http-proxy-middleware");

const backend = {
    target: 'http://konnekt-backend-prod.herokuapp.com',
    changeOrigin: true
};

const nodefluxAuth = {
    target: 'https://backend.cloud.nodeflux.io/auth',
    changeOrigin: true,
};

const nodefluxAnalytics = {
    target: 'https://api.cloud.nodeflux.io/v1/analytics',
    changeOrigin: true
};

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/jobseeker/', backend)
    );
    app.use(
        createProxyMiddleware('/jobpost/', backend)
    );
    app.use(
        createProxyMiddleware('/jobs/', backend)
    )
    app.use(
        createProxyMiddleware('/signatures', nodefluxAuth)
    );
    app.use(
        createProxyMiddleware('/create-face-enrollment', nodefluxAnalytics)
    );
    app.use(
        createProxyMiddleware('/delete-face-enrollment', nodefluxAnalytics)
    );
    app.use(
        createProxyMiddleware('/face-match-enrollment', nodefluxAnalytics)
    );
};