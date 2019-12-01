declare module 'ethereumjs-block' {
  import Blockchain from 'ethereumjs-blockchain'
  import Common from 'ethereumjs-common'
  import { BN, rlp } from 'ethereumjs-util'

  class Block {
    header: BlockHeader
    uncleList: BlockHeader[]
    raw: Buffer[]
    constructor(data?: SerializedBlock | Buffer | BlockData, opts?: BlockOpts)

    hash(): Buffer
    isGenesis(): boolean
    setGenesisParams(): void

    serialize(rlpEncode?: boolean): Buffer | SerializedBlock
    genTxTrie(cb: (err: unknown) => void)
    validateTransactionsTrie(): boolean
    validateTransactions(stringError?: boolean): boolean | string
    validate(blockchain: Blockchain, cb: (err: unknown) => void)
    validateUnclesHash(): boolean
    validateUncles(blockchain: Blockchain, cb: (err: unknown) => void)
    toJSON(labeled?: boolean): any
  }

  type SerializedBlock = [Buffer[], Buffer[], Buffer[]]

  class BlockHeader {
    parentHash: Buffer
    uncleHash: Buffer
    coinbase: Buffer
    stateRoot: Buffer
    transactionTrie: Buffer
    receiptTrie: Buffer
    bloom: Buffer
    difficulty: Buffer
    number: Buffer
    gasLimit: Buffer
    gasUsed: Buffer
    timestamp: Buffer
    extraData: Buffer
    raw: Buffer[]

    canonicalDifficulty(parentBlock: Block): BN
    validateDifficulty(parentBlock: Block): boolean
    validateGasLimit(parentBlock: Block): boolean
    validate(blockchain: Blockchain, height: BN, cb: (err: unknown) => void)
    hash(): Buffer
    isGenesis(): boolean
    setGenesisParams(): void
  }

  type BufferInput = string | number | Buffer | BN | null | undefined

  export interface BlockData {
    header?: BlockHeaderData,
    uncleHeaders?: BlockHeaderData[],
    transactions?: any,
  }

  export interface BlockHeaderData {
    parentHash?: BufferInput,
    uncleHash?: BufferInput,
    coinbase?: BufferInput,
    stateRoot?: BufferInput,
    transactionsTrie?: BufferInput,
    receiptTrie?: BufferInput,
    bloom?: BufferInput,
    difficulty?: BufferInput,
    number?: BufferInput,
    gasLimit?: BufferInput,
    gasUsed?: BufferInput,
    timestamp?: BufferInput,
    extraData?: BufferInput,
    mixHash?: BufferInput,
    nonce?: BufferInput,
  }

  export interface BlockOpts {
    chain?: string
    hardfork?: string
    common?: Common
  }

  export default Block
}
