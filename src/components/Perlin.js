// src: http://www.html5gamedevelopment.org/html5-game-tutorials/2012-01-procedural-textures-in-html5-canvas
// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.
export default class Perlin {
  constructor() {
    this.p = new Array(512);
    this.permutation = [151, 160, 137, 91, 90, 15,
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
      this.p[i] = this.p[256 + i] = this.p[i] = this.permutation[i];
      // Math.floor(Math.random() * 256);
    }
    this.fastfloor = this.fastfloor.bind(this);
    this.fade = this.fade.bind(this);
    this.lerp = this.lerp.bind(this);
    this.grad = this.grad.bind(this);
    this.scale = this.scale.bind(this);
    this.noise = this.noise.bind(this);
  }
  // Optimized Math.Floor function - better performace.
  fastfloor(x) {
    return x << 0; // x > 0 ? x : x - 1;
  }
  // Fade function as defined by Ken Perlin.
  fade(t) {
    // This eases coordinate values
    // so that they will ease towards integral values.
    // This ends up smoothing the final output.
    // 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  // Linear interpolation
  // lerp(transform, vector0/start, vector1/amt)
  lerp(t, a, b) {
    // Imprecise method which does not guarantee v = v1 when t = 1, due to floating-point arithmetic error.
    // return a + t * (b - a);
    // Precise method which guarantees v = v1 when t = 1
    return (1 - t) * a + t * b;
  }
  grad(hash, x, y, z) {
    // const h = hash & 15;
    // const u = h < 8 ? x : y;
    // /* eslint no-nested-ternary: 0 */
    // const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    // return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    switch (hash & 0xF) {
      case 0x0: return x + y;
      case 0x1: return -x + y;
      case 0x2: return x - y;
      case 0x3: return -x - y;
      case 0x4: return x + z;
      case 0x5: return -x + z;
      case 0x6: return x - z;
      case 0x7: return -x - z;
      case 0x8: return y + z;
      case 0x9: return -y + z;
      case 0xA: return y - z;
      case 0xB: return -y - z;
      case 0xC: return y + x;
      case 0xD: return -y + z;
      case 0xE: return y - x;
      case 0xF: return -y - z;
      default: return 0; // never happens
    }
  }
  scale(n) {
    return (1 + n) / 2;
  }
  /* eslint no-param-reassign: 0 */
  noise(x, y, z) {
    const X = this.fastfloor(x) & 255;
    const Y = this.fastfloor(y) & 255;
    const Z = this.fastfloor(z) & 255;
    x -= this.fastfloor(x);
    y -= this.fastfloor(y);
    z -= this.fastfloor(z);
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    // Hash the 8 Corners of the Cube.
    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;
    // Add Blended Results from 8 Corners of the Cube.
    return this.scale(
      this.lerp(w,
        this.lerp(v,
          this.lerp(u,
            this.grad(this.p[AA], x, y, z),
              this.grad(this.p[BA], x - 1, y, z)),
                this.lerp(u,
                  this.grad(this.p[AB], x, y - 1, z),
                    this.grad(this.p[BB], x - 1, y - 1, z))),
                      this.lerp(v,
                        this.lerp(u,
                          this.grad(this.p[AA + 1], x, y, z - 1),
                            this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                              this.lerp(u,
                                this.grad(this.p[AB + 1], x, y - 1, z - 1),
                                   this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)
                                 ))));
  }
  }
