const fs = require('fs');
const path = require('path');

const classesDir = path.resolve('engine/classes');
const files = fs.readdirSync(classesDir).filter(f => f.endsWith('.js'));

console.log('Class files:', files);

// Let's inspect class definitions and method declarations
for (const file of files) {
    const code = fs.readFileSync(path.join(classesDir, file), 'utf8');
    const classMatch = code.match(/export class (\w+)(?: extends (\w+))?/);
    if (!classMatch) continue;
    const className = classMatch[1];
    const superName = classMatch[2] || null;

    // Find all methods
    const methodMatches = [...code.matchAll(/(?:^|\n)\s*(?:static\s+)?([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g)];
    const methods = methodMatches.map(m => ({ name: m[1], params: m[2].trim() ? m[2].split(',').map(s => s.trim()) : [] }));

    console.log(`Class ${className} extends ${superName}: ${methods.map(m => `${m.name}(${m.params.length})`).join(', ')}`);
}

