const fs = require('fs');
let code = fs.readFileSync('src/workers/bm25.worker.ts', 'utf8');

// Update removeVietnameseTones to support keepCase
code = code.replace(
  /function removeVietnameseTones\(str: string\): string \{\s*if \(\!str\) return '';\s*return str\s*\.normalize\('NFD'\)\s*\.replace\(\/\[\\u0300-\\u036f\]\/g, ''\)\s*\.replace\(\/đ\/g, 'd'\)\s*\.replace\(\/Đ\/g, 'D'\)\s*\.toLowerCase\(\);\s*\}/s,
  `function removeVietnameseTones(str: string, keepCase: boolean = false): string {
  if (!str) return '';
  const res = str
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  return keepCase ? res : res.toLowerCase();
}`
);

// Update tokenizeWords to support exact case
const tokenizeWordsOld = `function tokenizeWords(text: string, addIfMissing: boolean = true): number[] {
  const cleanText = text.toLowerCase().replace(/[^\\p{L}\\p{N}\\s_]/gu, ' ');
  const words = cleanText.split(/\\s+/).filter(w => w.length > 0 && !STOP_WORDS.has(w));
  const tokens: number[] = [];

  // Single word tokens (Unigrams)
  for (const w of words) {
    const id = getTokenId(w, addIfMissing);
    if (id !== undefined) tokens.push(id);

    // Thêm bản không dấu nếu khác bản có dấu
    const noTone = removeVietnameseTones(w);
    if (noTone !== w && noTone.length > 0) {
      const ntId = getTokenId(\`nt_\${noTone}\`, addIfMissing);
      if (ntId !== undefined) tokens.push(ntId);
    }
  }

  // 2-word combinations (Bigrams)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = \`\${words[i]}_\${words[i + 1]}\`;
    const id = getTokenId(bigram, addIfMissing);
    if (id !== undefined) tokens.push(id);

    const noToneBigram = removeVietnameseTones(bigram);
    if (noToneBigram !== bigram) {
      const ntId = getTokenId(\`nt_\${noToneBigram}\`, addIfMissing);
      if (ntId !== undefined) tokens.push(ntId);
    }
  }

  // 3-word combinations (Trigrams cho các thuật ngữ cụm từ ghép nhập vai)
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = \`\${words[i]}_\${words[i + 1]}_\${words[i + 2]}\`;
    const id = getTokenId(trigram, addIfMissing);
    if (id !== undefined) tokens.push(id);
  }

  return tokens;
}`;

const tokenizeWordsNew = `function tokenizeWords(text: string, addIfMissing: boolean = true): number[] {
  const cleanTextLower = text.toLowerCase().replace(/[^\\p{L}\\p{N}\\s_]/gu, ' ');
  const cleanTextExact = text.replace(/[^\\p{L}\\p{N}\\s_]/gu, ' ');
  
  const wordsLower = cleanTextLower.split(/\\s+/).filter(w => w.length > 0 && !STOP_WORDS.has(w));
  const wordsExact = cleanTextExact.split(/\\s+/).filter(w => w.length > 0 && !STOP_WORDS.has(w.toLowerCase()));
  
  const tokens: number[] = [];

  // Single word tokens (Unigrams)
  for (let i = 0; i < wordsLower.length; i++) {
    const wL = wordsLower[i];
    const wE = wordsExact[i];
    
    const id = getTokenId(wL, addIfMissing);
    if (id !== undefined) tokens.push(id);

    // Tokens phân biệt chữ hoa/thường (Exact Case Boost)
    if (wE !== wL) {
      const idEx = getTokenId(\`ex_\${wE}\`, addIfMissing);
      if (idEx !== undefined) tokens.push(idEx);
    }

    // Thêm bản không dấu nếu khác bản có dấu
    const noTone = removeVietnameseTones(wL);
    if (noTone !== wL && noTone.length > 0) {
      const ntId = getTokenId(\`nt_\${noTone}\`, addIfMissing);
      if (ntId !== undefined) tokens.push(ntId);
    }
  }

  // 2-word combinations (Bigrams)
  for (let i = 0; i < wordsLower.length - 1; i++) {
    const bigramL = \`\${wordsLower[i]}_\${wordsLower[i + 1]}\`;
    const bigramE = \`\${wordsExact[i]}_\${wordsExact[i + 1]}\`;
    
    const id = getTokenId(bigramL, addIfMissing);
    if (id !== undefined) tokens.push(id);

    if (bigramE !== bigramL) {
      const idEx = getTokenId(\`ex_\${bigramE}\`, addIfMissing);
      if (idEx !== undefined) tokens.push(idEx);
    }

    const noToneBigram = removeVietnameseTones(bigramL);
    if (noToneBigram !== bigramL) {
      const ntId = getTokenId(\`nt_\${noToneBigram}\`, addIfMissing);
      if (ntId !== undefined) tokens.push(ntId);
    }
  }

  // 3-word combinations (Trigrams)
  for (let i = 0; i < wordsLower.length - 2; i++) {
    const trigramL = \`\${wordsLower[i]}_\${wordsLower[i + 1]}_\${wordsLower[i + 2]}\`;
    const trigramE = \`\${wordsExact[i]}_\${wordsExact[i + 1]}_\${wordsExact[i + 2]}\`;
    
    const id = getTokenId(trigramL, addIfMissing);
    if (id !== undefined) tokens.push(id);
    
    if (trigramE !== trigramL) {
      const idEx = getTokenId(\`ex_\${trigramE}\`, addIfMissing);
      if (idEx !== undefined) tokens.push(idEx);
    }
  }

  return tokens;
}`;

code = code.replace(tokenizeWordsOld, tokenizeWordsNew);

fs.writeFileSync('src/workers/bm25.worker.ts', code);
console.log("Patched tokenizeWords and removeVietnameseTones");
