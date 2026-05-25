const fs = require('fs');
let c = fs.readFileSync('C:/Users/25371/Desktop/self/src/app/api/publish/route.ts', 'utf8');
c = c.replace('"SET_VIA_ENV"', 'process.env.GITHUB_TOKEN');
fs.writeFileSync('C:/Users/25371/Desktop/self/src/app/api/publish/route.ts', c, 'utf8');
console.log('done');
