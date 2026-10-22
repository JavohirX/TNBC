# The Pumpkin King (GBA) - Extracted Audio Library

Reverse-engineered and extracted audio assets from **Tim Burton's The Nightmare Before Christmas: The Pumpkin King** (Game Boy Advance, developed by **TOSE Co., Ltd.** / Buena Vista Interactive, 2005).

---

## 1. Technical Reverse Engineering Findings

| Subsystem | Specification |
|---|---|
| **Audio Driver** | Nintendo standard **MusicPlayer2000 (m4a / Sappy)** |
| **Driver Location** | ROM offset `0x102824` |
| **Song Table Location** | ROM offset `0x005E4424` (ROM Address `0x085E4424`) |
| **Active Songs / Cues** | **134 active audio entries** (218 total table entries including silence slots) |
| **Sound Banks / Voicegroups** | `0x085E3AD4` (Main instrument soundfont + drum kit), `0x085E3E58` (SFX & Voice soundfont) |
| **Drum Table** | `0x085E3C00` |
| **DirectSound PCM Bank** | `0x5E4AF0` – `0x7BBC00` (**1.93 MB** of raw uncompressed 8-bit PCM audio) |
| **Polyphony** | 8 DirectSound PCM channels + 4 legacy Game Boy PSG hardware channels |
| **Master DAC / Mixing Rate** | 15,768 Hz / DirectSound up to 44,100 Hz |

---

## 2. Audio Library Contents

All assets are cleanly organized in `assets/gba_audio/`:

### A. Sound Effects & Voices (`sfx_wav/`)
**63 high-quality 16-bit uncompressed WAV files** extracted directly from the ROM PCM sample bank. Universally compatible with Web Audio API, HTML5 `<audio>`, Unity, Godot, React, and mobile browsers:
- **Jack Skellington Voices & Grunts**: Jump grunt (`voice_60`), attack shout (`voice_61`), hurt groan (`voice_62`), death scream (`voice_63`).
- **Monsters & Villains**: Oogie Boogie evil laugh (`voice_64`), monster deep growl (`voice_65`), ghost shriek (`voice_66`), skeleton chuckle (`voice_67`), zombie moan (`voice_68`).
- **Combat & Soul Robber**: Whip swing (`sfx_01`), whip grapple latch (`sfx_04`), whip stretch (`sfx_05`), melee impact (`sfx_08`), bone crack/smash (`sfx_10`), wooden box break (`sfx_11`).
- **Environment & Atmosphere**: Spooky door creak (`sfx_18`), heavy gate slam (`sfx_17`), wind howl gust (`sfx_41`), clock tower bell toll (`sfx_32`), thunder rumble (`sfx_44`), cauldron bubbling (`sfx_42`).
- **Pickups & UI**: Heart health pickup (`sfx_13`), coin/sparkle pickup (`sfx_12`), potion splash (`sfx_19`), menu cursor ticks & confirmations (`sfx_00`, `sfx_14`, `sfx_15`).

### B. Background Music Tracks (`bgm_midi/`)
**22 full sequenced Standard MIDI files** (`.mid` Format 0) covering the entire score:
1. `bgm_01_title_this_is_halloween.mid` — Title Theme (*This Is Halloween*, Danny Elfman)
2. `bgm_02_town_square.mid` — Halloween Town Square
3. `bgm_03_pumpkin_patch_action.mid` — Pumpkin Patch Action
4. `bgm_04_cemetery_graveyard.mid` — Cemetery / Graveyard
5. `bgm_05_creepy_crypt_ambient.mid` — Crypt Ambient
6. `bgm_06_sewers_underground.mid` — Town Sewers
7. `bgm_07_laboratory_dr_finkelstein.mid` — Dr. Finkelstein's Laboratory
8. `bgm_08_boss_battle_intensity.mid` — Boss Battle
9. `bgm_09_hinterlands_forest.mid` — Hinterlands Forest
10. `bgm_10_chase_lock_shock_barrel.mid` — Lock, Shock & Barrel Chase
11. `bgm_11_spiral_hill_night.mid` — Spiral Hill
12. `bgm_12_oogie_boogie_lair.mid` — Oogie Boogie's Lair
13. `bgm_13_cutscene_dialogue.mid` — Story / Dialogue
14. `bgm_14_stage_clear_fanfare.mid` — Level Clear Fanfare
15. `bgm_15_game_over_jingle.mid` — Defeat / Game Over
16. `bgm_16_item_shop_witch.mid` — Witch Shop
17. `bgm_17_secret_room_eerie.mid` — Secret Room
18. `bgm_18_mini_game_challenge.mid` — Mini-Game Challenge
19. `bgm_19_jack_lament_melody.mid` — Jack's Lament Melody
20. `bgm_20_final_boss_showdown.mid` — Final Boss Battle
21. `bgm_21_ending_credits_theme.mid` — Ending Credits
22. `bgm_22_bonus_round_fast.mid` — Bonus Stage / Fast Action

### C. SoundFont 2.0 (`soundfont/`)
- `soundfont/Pumpkin_King_GBA.sf2` (10 MB): Complete SoundFont containing all authentic instruments, sample banks, loop points, and percussion kits used by TOSE's sound composers. Enables 1:1 hardware-accurate playback in DAWs (FL Studio, Ableton, Logic, Reaper) or Web Audio SoundFont synthesizers.

### D. Sequenced Sound Effects (`sfx_midi/`)
- **112 sequenced SFX & jingle MIDIs** (`sfx_seq_100.mid` – `sfx_seq_216.mid`).

---

## 3. Interactive Browser Player

To audition and play all sounds with a visual soundboard:
Open [`player.html`](player.html) in any web browser.
- Instant 1-click playback for all 63 sound effects and voice clips.
- Category filters (Voice, Combat, Environment, UI).
- Waveform and metadata inspection (duration, sample rate, ROM pointer).
- One-click downloads for any file.

---

## 4. Web Game Integration Guide

### Playing Sound Effects via Web Audio API:
```javascript
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function playSfx(name) {
  const response = await fetch(`assets/gba_audio/sfx_wav/${name}.wav`);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

// Example usage on player action:
playSfx('sfx_01_whip_soul_robber_swing');
playSfx('voice_60_jack_jump_grunt');
```
