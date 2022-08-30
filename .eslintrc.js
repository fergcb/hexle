module.exports = {
  "extends": ["react-app"],
  "rules": {},
  "overrides": [
    {
      "files": ["**/*.ts?(x)"],
      "extends": ["standard-with-typescript"],
      "parserOptions": {
        "project": "./tsconfig.json",
      },
      "rules": {
        "comma-dangle": ["error", "always-multiline"]
      }
    }
  ]
}
