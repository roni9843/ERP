/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      ['api', 'web', 'shared', 'config', 'docs', 'infra', 'ci', 'deps', 'release'],
    ],
  },
};
