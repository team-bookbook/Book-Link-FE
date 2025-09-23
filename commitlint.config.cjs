/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(Feat|Fix|Chore|Style|Docs|Refactor|Init|Build)(?:\(([^)]+)\))?(!)?: (.+) \(#\d+\)$/u,
      headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', ['Feat', 'Fix', 'Chore', 'Style', 'Docs', 'Refactor', 'Init', 'Build']],
    'references-empty': [2, 'never'],
  },
};
