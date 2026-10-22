import fs from 'fs';
import path from 'path';

globalThis.window = globalThis;
String.prototype.equals = function(other) { return other !== null && other !== undefined && String(this) === String(other); };
String.prototype.equalsIgnoreCase = function(other) { return other !== null && other !== undefined && this.toLowerCase() === String(other).toLowerCase(); };

class JavaRandom {
    constructor(seed = 12345678) { this.seed = BigInt(seed); }
    nextInt() {
        this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);
        let res = Number(this.seed >> 16n);
        return (res << 0);
    }
}
globalThis.Random = JavaRandom;
globalThis.System = { currentTimeMillis: () => Date.now(), arraycopy: () => {}, gc: () => {} };
globalThis.FullCanvas = class {
    constructor() { this.width = 240; this.height = 320; }
    getWidth() { return 240; }
    getHeight() { return 320; }
    setFullScreenMode() {}
    repaint() {}
    serviceRepaints() {}
};
globalThis.StringBuffer = class StringBuffer {
    constructor(capacity = 16) { this.s = ''; }
    append(c) { this.s += (typeof c === 'number' ? String.fromCharCode(c) : c); return this; }
    get length() { return this.s.length; }
    toString() { return this.s; }
    setLength(n) { this.s = this.s.substring(0, n); }
};
globalThis.MIDlet = class {};
global.MIDlet = globalThis.MIDlet;

globalThis.Graphics = class {
    setClip() {}
    drawImage() {}
    setColor() {}
    fillRect() {}
};

// ResourceManager loading real assets from assets directory
const marPath = path.resolve('assets/levels.mar');
const datPath = path.resolve('assets/levels.dat');
const marBuffer = fs.readFileSync(marPath);
const datBuffer = fs.readFileSync(datPath);

class DataInputStreamMock {
    constructor(buf) {
        this.buf = buf;
        this.pos = 0;
    }
    read(dst, off = 0, len) {
        if (dst === undefined) {
            if (this.pos >= this.buf.length) return -1;
            return this.buf[this.pos++];
        }
        if (len === undefined) len = dst.length;
        let count = 0;
        for (let i = 0; i < len; i++) {
            if (this.pos >= this.buf.length) break;
            dst[off + i] = this.buf[this.pos++];
            count++;
        }
        return count;
    }
    skip(n) {
        this.pos += n;
        return n;
    }
    close() {}
}

globalThis.ResourceManager = {
    getResourceAsStream: (p) => {
        if (p.includes('levels.mar')) return new DataInputStreamMock(marBuffer);
        if (p.includes('levels.dat')) return new DataInputStreamMock(datBuffer);
        return new DataInputStreamMock(Buffer.alloc(0));
    }
};

const CLASS_NAMES = [
    'k', 'l', 'd', 'p', 'c', 'o', 'h', 'f', 'g', 's', 'j', 'e', 'r', 'i', 'b', 'm', 'q', 'n', 'a', 't', 'GMIDlet'
];

async function runVerification() {
    for (const c of CLASS_NAMES) {
        const mod = await import('../classes/' + c + '.js');
        globalThis[c] = mod[c];
    }

    console.log('====================================================');
    console.log('   NIGHTMARE BEFORE CHRISTMAS - ENEMY TEST SUITE    ');
    console.log('====================================================');

    let passed = 0;
    let failed = 0;
    function assert(cond, msg) {
        if (cond) {
            console.log('  [PASS]', msg);
            passed++;
        } else {
            console.error('  [FAIL]', msg);
            failed++;
        }
    }

    t.var_int_c = 16;
    r.var_int_a = 15;
    r.var_int_b = 20;
    r.var_int_c = 15 * 20;

    const mockT = { var_int_e: 1, var_int_f: 0, var_int_g: 0, f_k: 0, b: () => {} };

    function createFreshMap() {
        const mockR = new r();
        mockR.var_int_a = 15;
        mockR.var_int_b = 20;
        mockR.f_e = Array.from({length: 15}, () => new Array(20).fill(0));
        mockR.var_short_arr_arr_a = Array.from({length: 15}, () => new Array(20).fill(0));
        mockR.var_i_arr_arr_a = Array.from({length: 15}, () => new Array(20).fill(null));

        const mockN = {
            var_t_a: mockT,
            var_r_a: mockR,
            var_q_a: null,
            var_g_a: new g(),
            f_n: false,
            f_m: false,
            var_boolean_j: false,
            a: (l, layer) => {},
            j: () => {}
        };
        mockR.var_n_a = mockN;
        i.var_n_a = mockN;
        return { mockR, mockN };
    }

    console.log('\n--- PART 1: ENEMY BEHAVIOR & MECHANICS UNIT TESTS ---');

    // 1. Enemy 11
    console.log('\n[TEST 1] Enemy Type 11 (Skeleton / Patroller):');
    {
        const { mockR, mockN } = createFreshMap();
        const jack = new q(5, 5);
        mockN.var_q_a = jack;
        mockR.var_i_arr_arr_a[5][5] = jack;

        const enemy11 = new b(5, 8, 11);
        assert(enemy11.f_q === 11, 'Enemy 11 has f_q === 11');
        assert((enemy11.var_char_a & 2) !== 0, 'Enemy 11 has whip-stunnable bit 2 set');
        assert((enemy11.var_char_a & 4) !== 0, 'Enemy 11 has Jack-hurting bit 4 set');
        assert(enemy11.f_r === 0, 'Enemy 11 starts unstunned (f_r === 0)');

        enemy11.d();
        assert(jack.var_boolean_h === true, 'Enemy 11 contact catches Jack Skellington');
        jack.var_boolean_h = false;

        mockR.f_e[5][5] = 32; // Safe zone
        enemy11.d();
        assert(jack.var_boolean_h === false, 'Enemy 11 does not catch Jack when Jack is in safe tile 32');
        mockR.f_e[5][5] = 0;

        enemy11.e();
        assert(enemy11.f_r === 1, 'Enemy 11 e() puts enemy in stunned state (f_r === 1)');
        enemy11.d();
        assert(jack.var_boolean_h === false, 'Enemy 11 cannot catch Jack while stunned');

        for (let tick = 0; tick < 90; tick++) enemy11.c();
        assert(enemy11.f_r === 0, 'Enemy 11 recovers from stun after exactly 90 ticks');
    }

    // 2. Enemy 12
    console.log('\n[TEST 2] Enemy Type 12 (Shadow / Ghost):');
    {
        const { mockR, mockN } = createFreshMap();
        const jack = new q(5, 5);
        mockN.var_q_a = jack;
        mockR.var_i_arr_arr_a[5][5] = jack;

        const enemy12 = new b(5, 10, 12);
        assert(enemy12.f_q === 12, 'Enemy 12 has f_q === 12');
        assert((enemy12.var_char_a & 2) === 0, 'Enemy 12 is immune to whip stun (bit 2 is 0)');
        assert((enemy12.var_char_a & 4) !== 0, 'Enemy 12 has Jack-hurting bit 4 set');

        mockR.f_e[5][10] = 0x40; // Light tile
        enemy12.c();
        assert(enemy12.f_e === 3, 'Enemy 12 enters death state (f_e === 3) upon light contact');
        assert((enemy12.var_char_a & 4) === 0, 'Enemy 12 no longer hurts Jack during dying animation');
        for (let tick = 0; tick < 30; tick++) {
            enemy12.c();
            if (enemy12.var_boolean_d) break;
        }
        assert(enemy12.var_boolean_d === true, 'Enemy 12 marked as destroyed (var_boolean_d === true)');
    }

    // 3. Sentry Gargoyles
    console.log('\n[TEST 3] Sentry / Searchlight Enemy m (All 4 Directions + Occlusion):');
    {
        // Facing UP
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            const sentryUp = new m(5, 10, 0);
            sentryUp.l();
            assert(jack.var_boolean_h === true && sentryUp.var_boolean_e === true, 'Sentry facing UP detects Jack in line-of-sight');
        }

        // Occlusion by enemy
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            const blocker = new b(5, 8, 11);
            mockR.var_i_arr_arr_a[5][8] = blocker;
            const sentryUp = new m(5, 10, 0);
            sentryUp.l();
            assert(jack.var_boolean_h === false && sentryUp.var_boolean_e === false, 'Sentry beam is correctly blocked by another enemy in front');
        }

        // Occlusion by wall
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            mockR.f_e[5][7] = 0x01; // Wall
            const sentryUp = new m(5, 10, 0);
            sentryUp.l();
            assert(jack.var_boolean_h === false && sentryUp.var_boolean_e === false, 'Sentry blocked by wall does not detect Jack');
        }

        // Facing RIGHT
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            const sentryRight = new m(2, 5, 1);
            sentryRight.l();
            assert(jack.var_boolean_h === true && sentryRight.var_boolean_e === true, 'Sentry facing RIGHT detects Jack in line-of-sight');
        }

        // Facing DOWN
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            const sentryDown = new m(5, 2, 2);
            sentryDown.l();
            assert(jack.var_boolean_h === true && sentryDown.var_boolean_e === true, 'Sentry facing DOWN detects Jack in line-of-sight');
        }

        // Facing LEFT
        {
            const { mockR, mockN } = createFreshMap();
            const jack = new q(5, 5);
            mockN.var_q_a = jack;
            mockR.var_i_arr_arr_a[5][5] = jack;
            const sentryLeft = new m(8, 5, 3);
            sentryLeft.l();
            assert(jack.var_boolean_h === true && sentryLeft.var_boolean_e === true, 'Sentry facing LEFT detects Jack in line-of-sight');
        }
    }

    console.log('\n--- PART 2: FULL LEVEL SIMULATION (ALL 100 LEVELS) ---');
    r.var_int_a = 11;
    r.var_int_b = 12;
    r.var_int_c = 132;

    let levelsTested = 0;
    let totalEnemiesSpawned = 0;
    let errors = [];

    for (let lvl = 0; lvl < 100; lvl++) {
        try {
            const gameCanvas = new t();
            gameCanvas.var_int_e = 1;
            gameCanvas.var_int_f = 0;
            gameCanvas.var_int_g = 0;

            const levelManager = new n(gameCanvas);
            i.var_n_a = levelManager;

            levelManager.d(lvl * 132);

            let enemyCount = 0;
            levelManager.var_g_a.b();
            while (levelManager.var_g_a.boolean_a()) {
                const ent = levelManager.var_g_a.var_i_a;
                if (ent instanceof b || ent instanceof m) {
                    enemyCount++;
                }
            }
            totalEnemiesSpawned += enemyCount;

            for (let frame = 0; frame < 50; frame++) {
                levelManager.f();
                levelManager.i();
                levelManager.g();
                levelManager.k();
            }

            levelsTested++;
        } catch (err) {
            errors.push({ level: lvl, error: err.message, stack: err.stack });
        }
    }

    assert(levelsTested === 100, 'All 100 levels successfully initialized and simulated');
    assert(errors.length === 0, 'Zero runtime exceptions during 5,000 enemy frames');
    assert(totalEnemiesSpawned === 312, 'All 312 enemy instances (b and m) loaded and simulated');

    console.log('\n====================================================');
    console.log('TOTAL TESTS: ' + passed + ' PASSED, ' + failed + ' FAILED.');
    console.log('TOTAL ENEMIES VERIFIED ACROSS GAME: ' + totalEnemiesSpawned);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
}

runVerification().catch(err => {
    console.error(err);
    process.exit(1);
});
