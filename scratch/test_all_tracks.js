import fs from 'fs';

for (let i = 0; i <= 5; i++) {
    const file = `assets/audio/track_${i}.mid`;
    const buf = fs.readFileSync(file);
    const format = buf.readUInt16BE(8);
    const numTracks = buf.readUInt16BE(10);
    const division = buf.readUInt16BE(12);
    console.log(`Track ${i}: size=${buf.length}, format=${format}, numTracks=${numTracks}, division=${division}`);
}

