/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash } from './strings'
import { TransactionResponse } from './TransactionResponse'

export type BlockResponse = BlockResponseWithTxHashes | BlockResponseWithTxResponses;

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L259
export interface BlockResponseWithTxHashes {
  hash: Hash,
  parentHash: Hash,
  number: number,
  timestamp: number,
  nonce?: HexString,
  difficulty: number,
  gasLimit: utils.BigNumber,
  gasUsed: utils.BigNumber,
  miner: Address,
  extraData: HexString,
  transactions: Hash[],
}

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L277
export interface BlockResponseWithTxResponses {
  hash: Hash,
  parentHash: Hash,
  number: number,
  timestamp: number,
  nonce?: HexString,
  difficulty: number,
  gasLimit: utils.BigNumber,
  gasUsed: utils.BigNumber,
  miner: Address,
  extraData: HexString,
  transactions: TransactionResponse[],
}
