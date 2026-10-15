import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**"],
    },
    js.configs.recommended,
    {
        files: ["Step*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: {
                ...globals.browser,
                go_manual: "readonly",
                wan_button_action: "readonly",
            },
        },
    },
    {
        files: ["tests/**/*.js", "eslint.config.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
    },
    prettier,
];
