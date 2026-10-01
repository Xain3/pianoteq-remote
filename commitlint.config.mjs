const acceptedTypes = ['feat', 'fix', 'docs', 'test', 'refactor', 'build', 'chore'];

const commitBodyPolicy = (parsed) => {
  const message = parsed.raw ?? '';
  const lines = message.split(/\r?\n/).slice(1);
  const content = lines.join('\n');
  const hasWhy = /^Why:\s*\S/im.test(content);
  const detailsHeading = lines.findIndex((line) => /^What changed:\s*$/i.test(line));
  const hasDetails =
    /^What changed:\s*\S/im.test(content) ||
    (detailsHeading >= 0 &&
      lines.slice(detailsHeading + 1).some((line) => {
        const content = line.trim();
        return content.length > 0 && !/^(Why:|Breaking changes:)/i.test(content);
      }));
  const hasNoBreakingChanges = /^Breaking changes:\s*None\s*$/im.test(content);
  const hasBreakingFooter = (parsed.notes ?? []).some(
    (note) => note.title === 'BREAKING CHANGE' && note.text.trim().length > 0,
  );

  return [
    hasWhy && hasDetails && hasNoBreakingChanges !== hasBreakingFooter,
    "Commit body must include Why:, What changed: details, and either 'Breaking changes: None' or a non-empty BREAKING CHANGE: footer.",
  ];
};

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'commit-body-policy': commitBodyPolicy,
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', acceptedTypes],
    'scope-empty': [2, 'never'],
    'commit-body-policy': [2, 'always'],
  },
};
