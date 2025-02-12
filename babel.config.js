const presets = [
  [
    '@babel/env',
    {
      targets: "last 2 versions",
    },
  ],
  '@babel/preset-typescript',
  [
    '@babel/preset-react',
    {
      // for new jsx transform in react 17 https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154
      runtime: 'automatic',
    }
  ],
];

module.exports = { presets };
