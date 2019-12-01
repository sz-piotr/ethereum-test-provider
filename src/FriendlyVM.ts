import VM from 'ethereumjs-vm'
import Blockchain from 'ethereumjs-blockchain'
import Block, { BlockHeaderData } from 'ethereumjs-block'
import { BN, toBuffer } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import { utils } from 'ethers'
import {
  Hardfork,
  Hash,
  HexString,
} from './model'

const BLOCK_GAS_LIMIT = 8_000_000
const COINBASE_ADDRESS = '0x' + '12345678'.repeat(8)

export class FriendlyVM {
  private vm: VM
  private pendingTransactions: Transaction[]

  constructor (hardfork?: Hardfork) {
    const blockchain = new Blockchain({ hardfork })
    this.vm = new VM({ blockchain })
    this.pendingTransactions = []
  }

  async getLatestBlock (): Promise<Block> {
    return new Promise((resolve, reject) => {
      this.vm.blockchain.getLatestBlock((err: unknown, block: Block) => {
        if (err) reject(err)
        resolve(block)
      })
    })
  }

  addPendingTransaction (signedTransaction: HexString): Hash {
    const transaction = new Transaction(signedTransaction)
    this.pendingTransactions.push(transaction)
    return utils.hexlify(transaction.hash())
  }

  async mineBlock () {
    const block = await this.getNextBlockTemplate()
    block.transactions.push(...this.pendingTransactions)
    this.pendingTransactions = []

    await new Promise((resolve, reject) => {
      block.genTxTrie(err => err ? reject(err) : resolve())
    })
    block.header.transactionsTrie = block.txTrie.root

    await this.vm.runBlock({
      block,
      generate: true,
      skipBlockValidation: true,
    })
  }

  private async getNextBlockTemplate (): Promise<Block> {
    const latestBlock = await this.getLatestBlock()

    const header: BlockHeaderData = {
      gasLimit: BLOCK_GAS_LIMIT,
      nonce: 42,
      timestamp: Math.floor(Date.now() / 1000),
      number: new BN(latestBlock.header.number).addn(1),
      parentHash: latestBlock.hash(),
      coinbase: COINBASE_ADDRESS,
    }
    const block = new Block({ header })
    block.validate = (blockchain, cb) => cb(null)

    block.header.difficulty = toBuffer(block.header.canonicalDifficulty(latestBlock))
    return block
  }
}
