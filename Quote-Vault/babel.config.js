module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: [
//       // "@babel/plugin-transform-react-jsx",
//       "react-native-reanimated/plugin",
//       [
//         "module:react-native-dotenv",
//         {
//           moduleName: "@env",
//           path: ".env",
//           blacklist: null,
//           whitelist: null,
//           safe: false,
//           allowUndefined: true,
//         },
//       ],
//       require.resolve("expo-router/babel"),
//     ],
//   };
// };
