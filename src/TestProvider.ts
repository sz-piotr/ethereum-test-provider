import { providers } from 'ethers'
import { Hardfork } from './model'
import { TestChain } from './TestChain'

// chainId of 1337 is the default for private networks as per EIP-155
const CHAIN_ID = 1337
const CHAIN_NAME = 'test-chain'

export class TestProvider extends providers.BaseProvider {
  private chain: TestChain

  constructor(chainOrFork?: TestChain | Hardfork) {
    super({ name: CHAIN_NAME, chainId: CHAIN_ID })
    if (chainOrFork instanceof TestChain) {
      this.chain = chainOrFork
    } else {
      this.chain = new TestChain(chainOrFork)
    }
  }

  async perform(method: string, params: any) {
    switch (method) {
      case 'getBlockNumber':
        return this.chain.getBlockNumber()
      case 'getGasPrice':
        return this.chain.getGasPrice()
      case 'getBalance':
        return this.chain.getBalance(params.address, params.blockTag)
      case 'getTransactionCount':
        return this.chain.getTransactionCount(params.address, params.blockTag)
      case 'getCode':
        return this.chain.getCode(params.address, params.blockTag)
      case 'getStorageAt':
        return this.chain.getStorageAt(params.address, params.position, params.blockTag)
      case 'sendTransaction':
        return this.chain.sendTransaction(params.signedTransaction)
      case 'call':
        return this.chain.call(params.transaction, params.blockTag)
      case 'estimateGas':
        return this.chain.estimateGas(params.transaction)
      case 'getBlock':
        if (params.blockTag) {
          return this.chain.getBlockByNumber(params.blockTag, params.includeTransactions)
        } else {
          return this.chain.getBlockByHash(params.blockHash, params.includeTransactions)
        }
      case 'getTransaction':
        return this.chain.getTransaction(params.transactionHash)
      case 'getTransactionReceipt':
        return this.chain.getTransactionReceipt(params.transactionHash)
      case 'getLogs':
        return this.chain.getLogs(params.filter)
      default:
        return super.perform(method, params)
    }
  }
}
