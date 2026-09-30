export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        game: "readonly",
        ui: "readonly",
        canvas: "readonly",
        CONFIG: "readonly",
        CONST: "readonly",
        Hooks: "readonly",
        foundry: "readonly",
        Actor: "readonly",
        Item: "readonly",
        Dialog: "readonly",
        Roll: "readonly",
        ChatMessage: "readonly",
        renderTemplate: "readonly",
        loadTemplates: "readonly",
        duplicate: "readonly",
        mergeObject: "readonly",
        console: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        setTimeout: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];