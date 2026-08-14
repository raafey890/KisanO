const { execSync } = require('child_process');
const fs = require('fs');

try {
  execSync('npx eslint "src/**/*.{js,jsx}" --format json', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
} catch (e) {
  const data = JSON.parse(e.stdout);
  const hookErrors = [];
  data.forEach(file => {
    file.messages.forEach(msg => {
      if (msg.ruleId && msg.ruleId.startsWith('react-hooks/')) {
        hookErrors.push({
          file: file.filePath,
          line: msg.line,
          rule: msg.ruleId,
          message: msg.message
        });
      }
    });
  });
  fs.writeFileSync('hook-errors.json', JSON.stringify(hookErrors, null, 2), 'utf8');
}
