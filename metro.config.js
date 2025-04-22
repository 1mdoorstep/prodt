const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Add support for environment variables
config.resolver.sourceExts.push('env');

// Optimize resolver for faster bundling
config.resolver.useWatchman = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

// Add support for path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@navigation': path.resolve(__dirname, 'src/navigation'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@store': path.resolve(__dirname, 'store'),
  '@config': path.resolve(__dirname, 'src/config')
};

// Performance optimizations for development
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
config.maxWorkers = 4;
config.resetCache = false;
config.transformer.minifierConfig = {
  compress: {
    // Remove console statements for performance
    drop_console: false,
  }
};

module.exports = config; 