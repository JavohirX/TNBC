const fs = require('fs');
const path = require('path');

// 1. Fix q.js
{
    const file = path.resolve('engine/classes/q.js');
    let content = fs.readFileSync(file, 'utf8');
    const oldCode = `    a(...args) {
        if (args.length === 0) return q.prototype._a_1.apply(this, args);
        if (args.length === 3) return q.prototype._a_0.apply(this, args);
        return q.prototype._a_1.apply(this, args);
    }`;
    const newCode = `    a(...args) {
        if (args.length === 0) return q.prototype._a_1.apply(this, args);
        if (args.length === 3) return q.prototype._a_0.apply(this, args);
        return super.a(...args);
    }`;
    if (!content.includes(oldCode.replace(/\n/g, '\r\n')) && !content.includes(oldCode)) {
        console.error('Could not find target in q.js');
    } else {
        content = content.replace(
            content.includes('\r\n') ? oldCode.replace(/\n/g, '\r\n') : oldCode,
            content.includes('\r\n') ? newCode.replace(/\n/g, '\r\n') : newCode
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully updated q.js');
    }
}

// 2. Fix i.js
{
    const file = path.resolve('engine/classes/i.js');
    let content = fs.readFileSync(file, 'utf8');
    const oldCode = `    a(...args) {
        if (args.length === 0) return i.prototype._a_1.apply(this, args);
        if (args.length === 3) return i.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return this._i_laser_a(args[0]);
            return i.prototype._a_2.apply(this, args);
        }
    }`;
    const newCode = `    a(...args) {
        if (args.length === 0) return i.prototype._a_1.apply(this, args);
        if (args.length === 3) return i.prototype._a_0.apply(this, args);
        if (args.length === 1) {
            if (typeof args[0] === 'number') return this._i_laser_a(args[0]);
            return i.prototype._a_2.apply(this, args);
        }
        if (args.length === 2) {
            if (typeof args[0] === 'number') return this.void_a(args[0], args[1]);
            return super.a(args[0], args[1]);
        }
        return super.a(...args);
    }`;
    if (!content.includes(oldCode.replace(/\n/g, '\r\n')) && !content.includes(oldCode)) {
        console.error('Could not find target in i.js');
    } else {
        content = content.replace(
            content.includes('\r\n') ? oldCode.replace(/\n/g, '\r\n') : oldCode,
            content.includes('\r\n') ? newCode.replace(/\n/g, '\r\n') : newCode
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log('Successfully updated i.js');
    }
}

// 3. Fix b.js
{
    const file = path.resolve('engine/classes/b.js');
    let content = fs.readFileSync(file, 'utf8');
    // Replace b() method with _b_0 and b(...args) dispatcher
    const oldB = `    b() {
    this.var_char_a = 1;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }`;
    const newB = `    _b_0() {
    this.var_char_a = 1;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }

    b(...args) {
        if (args.length === 0) return this._b_0();
        return super.b(...args);
    }`;

    // Replace a(...args) in b.js
    const oldA = `    a(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[\`_a_\${idx}\`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[\`_a_0\`]) return this[\`_a_0\`].apply(this, args);
    }`;
    const newA = `    a(...args) {
        if (args.length === 0) return this._a_1();
        if (args.length === 3) return this._a_0(...args);
        return super.a(...args);
    }`;

    const isCRLF = content.includes('\r\n');
    content = content.replace(isCRLF ? oldB.replace(/\n/g, '\r\n') : oldB, isCRLF ? newB.replace(/\n/g, '\r\n') : newB);
    content = content.replace(isCRLF ? oldA.replace(/\n/g, '\r\n') : oldA, isCRLF ? newA.replace(/\n/g, '\r\n') : newA);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated b.js');
}

// 4. Fix m.js
{
    const file = path.resolve('engine/classes/m.js');
    let content = fs.readFileSync(file, 'utf8');
    // Replace b() with _b_0 and b(...args)
    const oldB = `    b() {
    this.var_char_a = 16;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }`;
    const newB = `    _b_0() {
    this.var_char_a = 16;
    this.var_char_b = 0;
    this.var_char_c = 0;
    }

    b(...args) {
        if (args.length === 0) return this._b_0();
        return super.b(...args);
    }`;

    // Replace a() with _a_0 and a(...args)
    const oldA = `    a() {`;
    const newA = `    _a_0() {`;

    const isCRLF = content.includes('\r\n');
    content = content.replace(isCRLF ? oldB.replace(/\n/g, '\r\n') : oldB, isCRLF ? newB.replace(/\n/g, '\r\n') : newB);
    content = content.replace(isCRLF ? oldA.replace(/\n/g, '\r\n') : oldA, isCRLF ? newA.replace(/\n/g, '\r\n') : newA);

    // Append a(...args) to end of class m
    const endMatch = isCRLF ? '\r\n}' : '\n}';
    const lastIndex = content.lastIndexOf(endMatch);
    if (lastIndex !== -1) {
        const dispatcher = (isCRLF ? '\r\n' : '\n') + `    a(...args) {
        if (args.length === 0) return this._a_0();
        return super.a(...args);
    }` + endMatch;
        content = content.substring(0, lastIndex) + dispatcher;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated m.js');
}

