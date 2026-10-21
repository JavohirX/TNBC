import struct

with open(r"D:\source\nightmare-b4-xmas\assets\font", "rb") as f:
    data = f.read()

print("Font file size:", len(data))
pos = 0

var_int_a = struct.unpack(">h", data[pos:pos+2])[0]
pos += 2
print("var_int_a (num fonts):", var_int_a)

for i in range(var_int_a):
    by = data[pos]
    pos += 1
    s2 = struct.unpack(">h", data[pos:pos+2])[0]
    pos += 2
    bl = False
    if (by & 2) == 0:
        bl = True
    print(f"Font image {i}: flags={by}, s2 (data length)={s2}, bl={bl}")
    img_data = data[pos:pos+s2]
    pos += s2
    n4 = 1
    if not bl:
        n4 = struct.unpack(">h", data[pos:pos+2])[0]
        pos += 2
    print(f"  img bytes start: {img_data[:8].hex()} (is PNG? {img_data.startswith(b'\x89PNG')})")

utflen1 = struct.unpack(">H", data[pos:pos+2])[0]
pos += 2
s1 = data[pos:pos+utflen1].decode('utf-8', errors='ignore')
pos += utflen1
print("String 1:", s1)

utflen2 = struct.unpack(">H", data[pos:pos+2])[0]
pos += 2
s2_str = data[pos:pos+utflen2].decode('utf-8', errors='ignore')
pos += utflen2
print("String 2:", s2_str)
