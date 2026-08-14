const fs = require('fs');
const path = require('path');
const glob = require('glob');

const loaders = glob.sync('src/components/ui/**/*Loader.jsx');

loaders.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('renderRow')) {
    content = content.replace(/(\[.*?)(]\s*,?\s*)$/gm, (match, p1, p2) => {
      if (p1.includes('renderRow') || p1.includes('renderItem') || p1.includes('prefersReducedMotion')) return match;
      if (p1.includes('rows') && p1.includes('size')) {
        changed = true;
        return `${p1}, renderRow${p2}`;
      }
      return match;
    });
  }
  
  if (content.includes('renderItem')) {
    content = content.replace(/(\[.*?)(]\s*,?\s*)$/gm, (match, p1, p2) => {
      if (p1.includes('renderRow') || p1.includes('renderItem') || p1.includes('prefersReducedMotion')) return match;
      if (p1.includes('items') || p1.includes('count')) {
        changed = true;
        return `${p1}, renderItem${p2}`;
      }
      return match;
    });
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

// For SkeletonText:
let textLoader = 'src/components/ui/Skeleton/SkeletonText.jsx';
if (fs.existsSync(textLoader)) {
  let c = fs.readFileSync(textLoader, 'utf8');
  c = c.replace(/\[lines, size, variant, isAnimated, disabled\]/g, '[lines, size, variant, isAnimated, disabled, lastLineWidth, width]');
  c = c.replace(/\[lines, size, variant, isAnimated\]/g, '[lines, size, variant, isAnimated, lastLineWidth, width]');
  fs.writeFileSync(textLoader, c, 'utf8');
}
