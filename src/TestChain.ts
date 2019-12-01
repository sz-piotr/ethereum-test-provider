import { BN } from 'ethereumjs-util'
import { utils, Wallet, providers } from 'ethers'
import {
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
import { TestChainOptions, getOptionsWithDefaults } from './TestChainOptions'
import { bufferToAddress } from './utils'

export class TestChain {
  private vm: FriendlyVM
  private options: TestChainOptions

  constructor (options?: Partial<TestChainOptions>) {
    this.options = getOptionsWithDefaults(options)
    this.vm = new FriendlyVM(this.options)
  }

  getWallets (provider?: providers.Provider) {
    return this.options.privateKeys.map(x => new Wallet(x, provider))
  }

  async getBlockNumber (): Promise<number> {
    const block = await this.vm.getLatestBlock()
    return new BN(block.header.number).toNumber()
  }

  async getGasPrice (): Promise<utils.BigNumber> {
    return utils.bigNumberify(this.options.minGasPrice)
  }

  async getBalance (address: Address, blockTag: BlockTag): Promise<utils.BigNumber> {
    if (blockTag !== 'latest') {
      throw new Error(`Unable to getBalance for blockTag = "${blockTag}". Only "latest" is supported.`)
    }
    const { balance } = await this.vm.getAccount(address)
    return utils.bigNumberify(balance)
  }

  async getTransactionCount (address: Address, blockTag: BlockTag): Promise<number> {
    if (blockTag === 'latest') {
      return this.getLatestTransactionCount(address)
    } else if (blockTag === 'pending') {
      return this.getPendingTransactionCount(address)
    } else {
      throw new Error(
        `Unable to getTransactionCount for blockTag = "${blockTag}". Only "latest" and "pending" are supported.`,
      )
    }
  }

  private async getLatestTransactionCount (address: Address): Promise<number> {
    const { nonce } = await this.vm.getAccount(address)
    const txCount = utils.bigNumberify(nonce).toNumber()
    return txCount
  }

  private async getPendingTransactionCount (address: Address): Promise<number> {
    const txCount = await this.getLatestTransactionCount(address)
    const transactionsFromAddress = this.vm.pendingTransactions
      .filter(tx => bufferToAddress(tx.getSenderAddress()) === address)
      .length
    return txCount + transactionsFromAddress
  }

  async getCode (address: Address, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(getCode) Not implemented!')
  }

  async getStorageAt (address: Address, position: HexStringNoZeroes, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(getStorageAt) Not implemented!')
  }

  async sendTransaction (signedTransaction: HexString): Promise<Hash> {
    const hash = this.vm.addPendingTransaction(signedTransaction)
    await this.vm.mineBlock()
    return hash
  }

  async call (transaction: TransactionRequest, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(call) Not implemented!')
  }

  async estimateGas (transaction: TransactionRequest): Promise<utils.BigNumber> {
    throw new Error('(estimateGas) Not implemented!')
  }

  // NOTE: includeTransactions specifies that we resolve the transactions in the
  // block to be TransactionResponse instead of hashes
  async getBlockByNumber (blockTag: BlockTag, includeTransactions: boolean): Promise<BlockResponse> {
    throw new Error('(getBlockByNumber) Not implemented!')
  }

  // NOTE: includeTransactions specifies that we resolve the transactions in the
  // block to be TransactionResponse instead of hashes
  async getBlockByHash (blockHash: Hash, includeTransactions: boolean): Promise<BlockResponse> {
    throw new Error('(getBlockByHash) Not implemented!')
  }

  async getTransaction (transactionHash: Hash): Promise<TransactionResponse> {
    throw new Error('(getTransaction) Not implemented!')
  }

  async getTransactionReceipt (transactionHash: Hash): Promise<TransactionReceiptResponse> {
    throw new Error('(getTransactionReceipt) Not implemented!')
  }

  async getLogs (filter: FilterRequest): Promise<LogResponse[]> {
    throw new Error('(getLogs) Not implemented!')
  }
}
