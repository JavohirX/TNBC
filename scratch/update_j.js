import fs from 'fs';
import path from 'path';

const file = path.resolve('engine/classes/j.js');
let code = fs.readFileSync(file, 'utf8');

const oldA0 = `    static _a_0() {
    if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a != null) {
    try {
    j.var_javax_microedition_media_Player_a.stop();
    }
    catch (exception) {}
    try {
    j.var_javax_microedition_media_Player_a.deallocate();
    }
    catch (exception) {}
    try {
    j.var_javax_microedition_media_Player_a.close();
    }
    catch (exception) {}
    j.var_javax_microedition_media_Player_a = null;
    }
    j.var_int_a = -1;
    }`;

const newA0 = `    static _a_0() {
        if (typeof AudioManager !== 'undefined') {
            try { AudioManager.stopAudio(); } catch (e) {}
        }
        if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a != null) {
            try { j.var_javax_microedition_media_Player_a.stop(); } catch (exception) {}
            try { j.var_javax_microedition_media_Player_a.deallocate(); } catch (exception) {}
            try { j.var_javax_microedition_media_Player_a.close(); } catch (exception) {}
            j.var_javax_microedition_media_Player_a = null;
        }
        j.var_int_a = -1;
    }`;

const oldA1 = `            if (j.var_int_a >= 0 && j.var_javax_microedition_media_Player_a) {
                if (j.var_int_a === n2 && (n2 === 3 || n2 === 4 || n2 === 5)) {
                    return;
                }
                j.a();
            }`;

const newA1 = `            if (j.var_int_a >= 0) {
                if (j.var_int_a === n2 && (n2 === 3 || n2 === 4 || n2 === 5)) {
                    return;
                }
                j.a();
            }`;

const isCRLF = code.includes('\r\n');
code = code.replace(isCRLF ? oldA0.replace(/\n/g, '\r\n') : oldA0, isCRLF ? newA0.replace(/\n/g, '\r\n') : newA0);
code = code.replace(isCRLF ? oldA1.replace(/\n/g, '\r\n') : oldA1, isCRLF ? newA1.replace(/\n/g, '\r\n') : newA1);

fs.writeFileSync(file, code, 'utf8');
console.log("Updated j.js successfully");

