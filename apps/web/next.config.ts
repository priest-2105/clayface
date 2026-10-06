import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  transpilePackages: ['@clayface/schema', '@clayface/registry', '@clayface/editor', '@clayface/components'],
  turbopack: { root: path.resolve(__dirname, '../..') },
  devIndicators: false,
  async rewrites() { return [{ source: '/api/:path*', destination: 'http://127.0.0.1:4000/api/:path*' }]; },
};
export default config;
