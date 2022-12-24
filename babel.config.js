module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // eslint-disable-next-line prettier/prettier
  plugins: [
    'babel-plugin-styled-components',
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
          '~': './src',
          '@Utils': './src/Utils',
          '@Context': './src/Context',
          '@Router': './src/Router',
          '@Images': './src/Assets/Images',
          '@Icons': './src/Assets/Icons',
          '@Fonts': './src/Assets/Fonts',
          '@Hooks': './src/Hooks',
          '@Screens': './src/Screens',
          '@Store': './src/Store',
          '@Styles': './src/Styles',
          '@Symbols': './src/Symbols',
          '@Components': './src/Components',
          '@Data': './src/Data',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
