import { randomBytes } from "crypto";
 
const AMBIGUOUS = /[0O1lI]/g;
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
 
export function generateTempPassword(length = 10): string {
  let out = "";
  while (out.length < length) {
    const byte = randomBytes(1)[0];
    const char = CHARSET[byte % CHARSET.length];
    if (!AMBIGUOUS.test(char)) out += char;
  }
  return out;
}
