/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString, Hash } from './strings'

// https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L184
export interface TransactionResponse {
  hash: Hash,
  blockHash?: Hash,
  blockNumber?: number,
  transactionIndex?: number,
  confirmations?: number,
  from: Address,
  gasPrice: utils.BigNumber,
  gasLimit: utils.BigNumber,
  to?: Address,
  value: utils.BigNumber,
  nonce: number,
  data: HexString,
  r: HexString,
  s: HexString,
  v?: number,
  creates?: Address,
  raw?: HexString,
  // https://github.com/ethers-io/ethers.js/blob/4ac08432b8e2c7c374dc4a0e141a39a369e2d430/src.ts/providers/base-provider.ts#L230
  networkId?: number,
}
