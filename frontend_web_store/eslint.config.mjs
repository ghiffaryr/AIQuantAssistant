import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  },
  {
    "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:prettier/recommended"]
  }
];