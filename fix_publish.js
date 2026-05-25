const fs = require('fs');

let c = fs.readFileSync('C:/Users/25371/Desktop/self/src/app/api/publish/route.ts', 'utf8');

// Replace broken tokens
c = c.replace(/process\.[A-Z_]+(?:\u2026|[a-z\u0600-\u06FF]+)[A-Z_]+/g, 'process.env.GITHUB_TOKEN');
c = c.replace(/proces\u2026[A-Z_]+/g, 'process.env.GITHUB_TOKEN');

fs.writeFileSync('C:/Users/25371/Desktop/self/src/app/api/publish/route.ts', c, 'utf8');
console.log('fixed');
