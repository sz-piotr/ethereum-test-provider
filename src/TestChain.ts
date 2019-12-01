import { bufferToInt, bufferToHex } from 'ethereumjs-util'
import { FakeTransaction } from 'ethereumjs-tx'
import { utils, Wallet, providers } from 'ethers'
import {
  Address,
  BlockTag,
  Hash,
  HexString,
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
    return bufferToInt(block.header.number)
  }

  async getGasPrice (): Promise<utils.BigNumber> {
    return utils.bigNumberify(this.options.defaultGasPrice)
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
    return bufferToInt(nonce)
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

  async getStorageAt (address: Address, position: HexString, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(getStorageAt) Not implemented!')
  }

  async sendTransaction (signedTransaction: HexString): Promise<Hash> {
    const hash = await this.vm.addPendingTransaction(signedTransaction)
    await this.vm.mineBlock()
    return hash
  }

  async call (transaction: TransactionRequest, blockTag: BlockTag): Promise<HexString> {
    throw new Error('(call) Not implemented!')
  }

  async estimateGas (transaction: TransactionRequest): Promise<utils.BigNumber> {
    const tx = new FakeTransaction({
      from: transaction.from,
      to: transaction.to,
      data: transaction.data,
      gasLimit: transaction.gasLimit?.toHexString() ?? this.options.blockGasLimit,
      gasPrice: transaction.gasPrice?.toHexString(),
      nonce: transaction.nonce,
      value: transaction.value?.toHexString(),
    })
    const result = await this.vm.runIsolatedTransaction(tx)
    return utils.bigNumberify(result.gasUsed.toString())
  }

  async getBlock (blockTagOrHash: BlockTag | Hash, includeTransactions: boolean): Promise<BlockResponse> {
    if (blockTagOrHash === 'pending') {
      throw new Error('Querying for "pending" block not supported.')
    }

    const block = blockTagOrHash === 'latest'
      ? await this.vm.getLatestBlock()
      : await this.vm.getBlock(blockTagOrHash)

    // TODO: includeTransactions specifies that we resolve the transactions in the
    // block to be TransactionResponse instead of hashes
    return {
      difficulty: bufferToInt(block.header.difficulty),
      extraData: bufferToHex(block.header.extraData),
      gasLimit: utils.bigNumberify(block.header.gasLimit),
      gasUsed: utils.bigNumberify(block.header.gasUsed),
      hash: bufferToHex(block.hash()),
      miner: bufferToAddress(block.header.coinbase),
      nonce: bufferToHex(block.header.nonce),
      number: bufferToInt(block.header.number),
      parentHash: bufferToHex(block.header.parentHash),
      timestamp: bufferToInt(block.header.timestamp),
      transactions: block.transactions.map(x => bufferToHex(x.hash())),
    }
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
