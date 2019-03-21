// @flow
/* eslint-disable prettier/prettier */
declare module 'bn.js' {
  declare type Endianness = 'le' | 'be'

  declare class BN {
    abs(): BN,
    add(b: BN): BN,
    and(b: BN): BN,
    bincn(b: number): BN,
    bitLength(): number,
    byteLength(): number,
    clone(): BN,
    cmp(b: any): number,
    constructor(
      number:
        | number
        | string
        | $ReadOnlyArray<number>
        | $ReadOnlyArray<number>
        | Buffer,
      base?: number,
      endian?: Endianness
    ): BN,
    div(b: BN): BN,
    divRound(b: BN): BN,
    egcd(b: BN): { a: BN, b: BN, gcd: BN },
    eq(b: any): boolean,
    gcd(b: BN): BN,
    gt(b: any): boolean,
    gte(b: any): boolean,
    invm(b: BN): BN,
    isBN(b: any): boolean,
    isEven(): boolean,
    isNeg(): boolean,
    isOdd(): boolean,
    isZero(): boolean,
    lt(b: any): boolean,
    lte(b: any): boolean,
    maskn(b: number): BN,
    mod(b: BN): BN,
    mul(b: BN): BN,
    neg(): BN,
    notn(w: number): BN,
    or(b: BN): BN,
    pow(b: BN): BN,
    setn(b: number): BN,
    shln(b: number): BN,
    shrn(b: number): BN,
    sqr(): BN,
    sub(b: BN): BN,
    testn(b: number): boolean,
    toArray(endian?: Endianness, length?: number): $ReadOnlyArray<number>,
    toBuffer(endian?: Endianness, length?: number): Buffer,
    toJSON(): string,
    toNumber(): number,
    toString(base?: number, length?: number): string,
    xor(b: BN): BN,
    zeroBits(): number,
  }

  declare module.exports: typeof BN
}
