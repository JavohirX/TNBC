# 1. Fix i.js b dispatcher
with open('engine/classes/i.js', 'r', encoding='utf-8') as f:
    i_code = f.read()

target_i = """    b(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_b_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_b_0`]) return this[`_b_0`].apply(this, args);
    }"""

repl_i = """    b(...args) {
        if (args.length === 0) return i.prototype._b_0.apply(this, args);
        if (args.length === 2) return i.prototype._b_1.apply(this, args);
        return i.prototype._b_0.apply(this, args);
    }"""

if target_i.replace('\n', '\r\n') in i_code:
    i_code = i_code.replace(target_i.replace('\n', '\r\n'), repl_i.replace('\n', '\r\n'))
    print("Replaced CRLF b dispatcher in i.js")
elif target_i in i_code:
    i_code = i_code.replace(target_i, repl_i)
    print("Replaced LF b dispatcher in i.js")
else:
    print("Target not found in i.js!")

with open('engine/classes/i.js', 'w', encoding='utf-8') as f:
    f.write(i_code)

# 2. Fix q.js dispatchers
with open('engine/classes/q.js', 'r', encoding='utf-8') as f:
    q_code = f.read()

target_q = """    a(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_a_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_a_0`]) return this[`_a_0`].apply(this, args);
    }

    b(...args) {
        const len = args.length;
        // Search available overload functions
        for (let idx = 0; idx < 12; idx++) {
            const fn = this[`_b_${idx}`];
            if (fn && fn.length === len) {
                return fn.apply(this, args);
            }
        }
        // Fallback to first overload if found
        if (this[`_b_0`]) return this[`_b_0`].apply(this, args);
    }"""

repl_q = """    a(...args) {
        if (args.length === 0) return q.prototype._a_1.apply(this, args);
        if (args.length === 3) return q.prototype._a_0.apply(this, args);
        return q.prototype._a_1.apply(this, args);
    }

    b(...args) {
        if (args.length === 0) return q.prototype._b_0.apply(this, args);
        if (args.length === 2) return q.prototype._b_1.apply(this, args);
        return q.prototype._b_0.apply(this, args);
    }"""

if target_q.replace('\n', '\r\n') in q_code:
    q_code = q_code.replace(target_q.replace('\n', '\r\n'), repl_q.replace('\n', '\r\n'))
    print("Replaced CRLF dispatchers in q.js")
elif target_q in q_code:
    q_code = q_code.replace(target_q, repl_q)
    print("Replaced LF dispatchers in q.js")
else:
    print("Target not found in q.js!")

with open('engine/classes/q.js', 'w', encoding='utf-8') as f:
    f.write(q_code)

