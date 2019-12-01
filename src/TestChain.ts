import { BN } from 'ethereumjs-util'
import { utils } from 'ethers'
import {
  Hardfork,
  Address,
  BlockTag,
  Hash,
  HexString,
  HexStringNoZeroes,
  TransactionRequest,
  FilterRequest,
  LogResponse,
  TransactionResponse,
  BlockResponse,
  TransactionReceiptResponse,
} from './model'
import { FriendlyVM } from './FriendlyVM'

export class TestChain {
  private vm: FriendlyVM

  constructor (hardfork?: Hardfork) {
    this.vm = new FriendlyVM(hardfork)
  }

  async getBlockNumber (): Promise<number> {
    const block = await this.vm.getLatestBlock()
    return new BN(block.header.number).toNumber()
  }

  async getGasPrice (): Promise<utils.BigNumber> {
    throw new Error('Not implemented!')
  }

  async getBalance (address: Address, blockTag: BlockTag): Promise<utils.BigNumber> {
    throw new Error('Not implemented!')
  }

  async getTransactionCount (address: Address, blockTag: BlockTag): Promise<number> {
    throw new Error('Not implemented!')
  }

  async getCode (address: Address, blockTag: BlockTag): Promise<HexString> {
    throw new Error('Not implemented!')
  }

  async getStorageAt (address: Address, position: HexStringNoZeroes, blockTag: BlockTag): Promise<HexString> {
    throw new Error('Not implemented!')
  }

  async sendTransaction (signedTransaction: HexString): Promise<Hash> {
    const hash = this.vm.addPendingTransaction(signedTransaction)
    await this.vm.mineBlock()
    return hash
  }

  async call (transaction: TransactionRequest, blockTag: BlockTag): Promise<HexString> {
    throw new Error('Not implemented!')
  }

  async estimateGas (transaction: TransactionRequest): Promise<utils.BigNumber> {
    throw new Error('Not implemented!')
  }

  // NOTE: includeTransactions specifies that we resolve the transactions in the
  // block to be TransactionResponse instead of hashes
  async getBlockByNumber (blockTag: BlockTag, includeTransactions: boolean): Promise<BlockResponse> {
    throw new Error('Not implemented!')
  }

  // NOTE: includeTransactions specifies that we resolve the transactions in the
  // block to be TransactionResponse instead of hashes
  async getBlockByHash (blockHash: Hash, includeTransactions: boolean): Promise<BlockResponse> {
    throw new Error('Not implemented!')
  }

  async getTransaction (transactionHash: Hash): Promise<TransactionResponse> {
    throw new Error('Not implemented!')
  }

  async getTransactionReceipt (transactionHash: Hash): Promise<TransactionReceiptResponse> {
    throw new Error('Not implemented!')
  }

  async getLogs (filter: FilterRequest): Promise<LogResponse[]> {
    throw new Error('Not implemented!')
  }
}
