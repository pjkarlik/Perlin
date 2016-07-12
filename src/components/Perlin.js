// src: http://www.html5gamedevelopment.org/html5-game-tutorials/2012-01-procedural-textures-in-html5-canvas

/* eslint no-param-reassign: 0 */
/* eslint no-nested-ternary: 0 */
export function fastfloor(x) {
  return x << 0; // x > 0 ? x : x - 1;
}

export function fade(t) {
  // This eases coordinate values
  // so that they will ease towards integral values.
  // This ends up smoothing the final output.
  // 6t^5 - 15t^4 + 10t^3
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Linear interpolation - lerp(transform, vector0/start, vector1/amt)
export function lerp(t, a, b) {
  // Imprecise method which does not guarantee v = v1 when t = 1, due to floating-point arithmetic error.
  // return a + t * (b - a);
  // Precise method which guarantees v = v1 when t = 1
  return (1 - t) * a + t * b;
}

export function grad(hash, x, y, z) {
  // Take the hashed value and take the first 4 bits of it (15 == 0b1111)
  const h = hash & 15;
  // If the most significant bit (MSB) of the hash is 0 then set u = x.  Otherwise y.
  const u = h < 8 ? x : y;
  // If the first and second significant bits are 0 set v = y
  // If the first and second significant bits are 1 set v = x
  // If the first and second significant bits are not equal (0/1, 1/0) set v = z
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  // Use the last 2 bits to decide if u and v are positive or negative.  Then return their addition.
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function scale(n) {
  return (1 + n) / 2;
}

export default function perlin(x, y, z) {
  const perm = new Array(512);
  const permutation = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];
  for (let i = 0; i < 512; i++) {
    perm[i] = permutation[i % 256];
  }

  const X = fastfloor(x) & 255;
  const Y = fastfloor(y) & 255;
  const Z = fastfloor(z) & 255;
  x -= fastfloor(x);
  y -= fastfloor(y);
  z -= fastfloor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  // Hash the 8 Corners of the Cube.
  const A = perm[X] + Y;
  const AA = perm[A] + Z;
  const AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y;
  const BA = perm[B] + Z;
  const BB = perm[B + 1] + Z;
  // Add Blended Results from 8 Corners of the Cube.
  return this.scale(
    lerp(w,
      lerp(v,
        lerp(u,
          grad(perm[AA], x, y, z),
            grad(perm[BA], x - 1, y, z)),
              lerp(u,
                grad(perm[AB], x, y - 1, z),
                  grad(perm[BB], x - 1, y - 1, z))),
                    lerp(v,
                      lerp(u,
                        grad(perm[AA + 1], x, y, z - 1),
                          grad(perm[BA + 1], x - 1, y, z - 1)),
                            lerp(u,
                              grad(perm[AB + 1], x, y - 1, z - 1),
                                 grad(perm[BB + 1], x - 1, y - 1, z - 1)
                               ))));
}
