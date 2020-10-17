module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": 0,
    "no-console": 0,
    "no-undef": 0,
    "no-empty": 0,
    "no-cond-assign": 0,
    "no-redeclare": 0,
    "no-useless-escape": 0,
    "vue/no-unused-components": 0
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
