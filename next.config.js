const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withReactSvg = require('next-react-svg');
const path = require('path');

const baseUrl = '';
const svgPlugin = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  poweredByHeader: false,
  trailingSlash: true,
  basePath: baseUrl,
  env: {
    baseUrl: baseUrl,
  },
});

// TODO: too werid to make the codes like this
module.exports = withPlugins([[svgPlugin], [bundleAnalyzer], [svgPlugin]]);
