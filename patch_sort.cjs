const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const oldSort = `        // Sắp xếp tự động danh sách models theo đúng yêu cầu
        const sortedModels = sortModels(models);`;

const newSort = `        // Sắp xếp tự động danh sách models theo đúng yêu cầu: Ưu tiên models có chữ 'pro'
        const sortedModels = sortModels(models).sort((a, b) => {
          const aIsPro = a.toLowerCase().includes('pro');
          const bIsPro = b.toLowerCase().includes('pro');
          if (aIsPro && !bIsPro) return -1;
          if (!aIsPro && bIsPro) return 1;
          return 0;
        });`;

code = code.replace(oldSort, newSort);
fs.writeFileSync('src/components/Settings.tsx', code);
console.log("Patched sorting logic in Settings.tsx");
