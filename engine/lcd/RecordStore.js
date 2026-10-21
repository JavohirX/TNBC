/**
 * RecordStore.js
 * Implements javax.microedition.rms.RecordStore over window.localStorage.
 */
export class RecordStore {
    static stores = new Map();

    constructor(name) {
        this.name = name;
        this.prefix = `j2me_rms_${name}_`;
        this.records = [];
        this._load();
    }

    _load() {
        const countKey = `${this.prefix}count`;
        const count = parseInt(localStorage.getItem(countKey) || "0", 10);
        this.records = [null]; // 1-indexed

        for (let i = 1; i <= count; i++) {
            const hex = localStorage.getItem(`${this.prefix}rec_${i}`);
            if (hex !== null) {
                const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
                this.records[i] = bytes;
            } else {
                this.records[i] = null;
            }
        }
    }

    _save(id) {
        const bytes = this.records[id];
        if (bytes) {
            let hex = "";
            for (let i = 0; i < bytes.length; i++) {
                hex += ("0" + bytes[i].toString(16)).slice(-2);
            }
            localStorage.setItem(`${this.prefix}rec_${id}`, hex);
        } else {
            localStorage.removeItem(`${this.prefix}rec_${id}`);
        }
        localStorage.setItem(`${this.prefix}count`, (this.records.length - 1).toString());
    }

    getNumRecords() {
        return this.records.length - 1;
    }

    getRecord(id) {
        const rec = this.records[id];
        if (!rec) return null;
        return new Int8Array(rec.buffer, rec.byteOffset, rec.byteLength);
    }

    setRecord(id, data, offset = 0, numBytes = null) {
        const len = numBytes !== null ? numBytes : data.length - offset;
        const copy = new Uint8Array(len);
        copy.set(data.subarray ? data.subarray(offset, offset + len) : data.slice(offset, offset + len));
        this.records[id] = copy;
        this._save(id);
    }

    addRecord(data, offset = 0, numBytes = null) {
        const id = this.records.length;
        this.setRecord(id, data, offset, numBytes);
        return id;
    }

    deleteRecord(id) {
        this.records[id] = null;
        this._save(id);
    }

    closeRecordStore() {}

    static openRecordStore(name, createIfNecessary = true) {
        let store = RecordStore.stores.get(name);
        if (!store) {
            store = new RecordStore(name);
            RecordStore.stores.set(name, store);
        }
        return store;
    }
}

