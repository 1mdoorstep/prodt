module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React Native Reanimated
      'react-native-reanimated/plugin',
      
      // Module resolver for path aliases
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@constants': './src/constants',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@store': './store',
            '@utils': './src/utils',
            '@types': './src/types',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};