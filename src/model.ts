import { utils, providers } from 'ethers'

export type Hardfork = 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul'

/**
 * Identifies the desired block.
 * Represented as a hex string without leading zeroes, e.g. `'0x1F3'`.
 * The smallest value is `'0x0'`.
 * Can also have one of the special values: `'latest'` or `'pending'`.
 */
export type BlockTag = string

/**
 * A hexadecimal string representing a hash. Always lower-cased and of length 66.
 */
export type Hash = string

/**
 * An ethereum address. Always normalized through `utils.getAddress`
 */
export type Address = string

/**
 * A hexadecimal string
 */
export type HexString = string

/**
 * A hexadecimal string without leading zeroes
 */
export type HexStringNoZeroes = string

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L287
export interface TransactionRequest {
  from?: Address,
  nonce?: number,
  gasLimit?: utils.BigNumber,
  gasPrice?: utils.BigNumber,
  to?: Address,
  value?: utils.BigNumber,
  data?: HexString,
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L376
export type FilterRequest = FilterByRangeRequest | FilterByBlockRequest

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L363
export interface FilterByRangeRequest {
  fromBlock?: BlockTag,
  toBlock?: BlockTag,
  address?: Address,
  topics?: unknown,
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L370
export interface FilterByBlockRequest {
  blockHash?: Hash,
  address?: Address,
  topics?: unknown,
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L383
export interface LogResponse {
  blockNumber?: number,
  blockHash?: Hash,
  transactionIndex?: number,
  removed?: boolean,
  address: Address,
  data: HexString,
  topics: Hash[],
  transactionHash: Hash,
  logIndex: number,
}

export interface TransactionResponse extends providers.TransactionResponse {
  // TODO: Investigate what exactly has to be included in the result
}

export interface TransactionReceiptResponse extends providers.TransactionReceipt {
  // TODO: Investigate what exactly has to be included in the result
}

export interface BlockResponse extends providers.Block {
  // TODO: Investigate what exactly has to be included in the result
}
