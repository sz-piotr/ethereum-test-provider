/* eslint-disable max-len */
import { utils } from 'ethers'
import { Address, HexString } from './strings'

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
