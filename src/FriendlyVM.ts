import VM from 'ethereumjs-vm'
import Blockchain from 'ethereumjs-blockchain'
import Block, { BlockHeaderData } from 'ethereumjs-block'
import { BN, toBuffer } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import Account from 'ethereumjs-account'
import { utils, Wallet } from 'ethers'
import { Hash, HexString, Address } from './model'
import { TestChainOptions } from './TestChainOptions'

export class FriendlyVM {
  private vm?: Promise<VM>
  private pendingTransactions: Transaction[] = []

  constructor (private options: TestChainOptions) {
  }

  getWallets () {
    return this.options.privateKeys.map(x => new Wallet(x))
  }

  private async getVM () {
    this.vm = this.vm ?? initializeVM(this.options)
    return this.vm
  }

  async getLatestBlock (): Promise<Block> {
    const vm = await this.getVM()
    return new Promise((resolve, reject) => {
      vm.blockchain.getLatestBlock((err: unknown, block: Block) => {
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

    const vm = await this.getVM()
    await vm.runBlock({
      block,
      generate: true,
      skipBlockValidation: true,
    })
  }

  private async getNextBlockTemplate (): Promise<Block> {
    const latestBlock = await this.getLatestBlock()

    const header: BlockHeaderData = {
      gasLimit: this.options.blockGasLimit,
      nonce: 42,
      timestamp: Math.floor(Date.now() / 1000),
      number: new BN(latestBlock.header.number).addn(1),
      parentHash: latestBlock.hash(),
      coinbase: this.options.coinbaseAddress,
    }
    const block = new Block({ header })
    block.validate = (blockchain, cb) => cb(null)

    block.header.difficulty = toBuffer(block.header.canonicalDifficulty(latestBlock))
    return block
  }

  async getAccount (address: Address) {
    const vm = await this.getVM()
    const psm = vm.pStateManager
    const account = await psm.getAccount(toBuffer(address))
    return account
  }
}

async function initializeVM (options: TestChainOptions) {
  const blockchain = new Blockchain({ hardfork: options.hardfork, validate: false })
  const vm = new VM({ hardfork: options.hardfork, blockchain })
  await initAccounts(vm, options)
  await addGenesisBlock(vm, options)
  return vm
}

async function initAccounts (vm: VM, options: TestChainOptions) {
  const psm = vm.pStateManager
  const balance = new BN(options.initialBalance).toBuffer()
  for (const privateKey of options.privateKeys) {
    const { address } = new Wallet(privateKey)
    await psm.putAccount(toBuffer(address), new Account({ balance }))
  }
}

async function addGenesisBlock (vm: VM, options: TestChainOptions) {
  const genesisBlock = new Block({
    header: {
      bloom: '0x' + '0'.repeat(512),
      coinbase: options.coinbaseAddress,
      gasLimit: options.blockGasLimit,
      gasUsed: '0x00',
      nonce: 42,
      number: 0,
      parentHash: '0x' + '0'.repeat(64),
      timestamp: 0,
    },
  }, { common: vm._common })

  await new Promise((resolve, reject) => {
    vm.blockchain.putGenesis(genesisBlock, (err: unknown) => {
      err ? reject(err) : resolve()
    })
  })
}
