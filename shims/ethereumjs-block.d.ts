declare module 'ethereumjs-block' {
  import Common from 'ethereumjs-common'
  import { Transaction, TxData } from 'ethereumjs-tx'
  import { BN } from 'ethereumjs-util'
  import Trie from 'merkle-patricia-tree'
  import { Buffer } from 'buffer'

  /**
   * An object that represents the block header
   */
  export class BlockHeader {
    public raw!: Buffer[]
    public parentHash!: Buffer
    public uncleHash!: Buffer
    public coinbase!: Buffer
    public stateRoot!: Buffer
    public transactionsTrie!: Buffer
    public receiptTrie!: Buffer
    public bloom!: Buffer
    public difficulty!: Buffer
    public number!: Buffer
    public gasLimit!: Buffer
    public gasUsed!: Buffer
    public timestamp!: Buffer
    public extraData!: Buffer
    public mixHash!: Buffer
    public nonce!: Buffer

    /**
     * Creates a new block header.
     * @param data - The data of the block header.
     * @param opts - The network options for this block, and its header, uncle headers and txs.
     */
    constructor(
      data: Buffer | PrefixedHexString | BufferLike[] | BlockHeaderData = {},
      opts: ChainOptions = {},
    )

    /**
     * Returns the canonical difficulty for this block.
     *
     * @param parentBlock - the parent `Block` of the this header
     */
    canonicalDifficulty(parentBlock: Block): BN

    /**
     * Checks that the block's `difficulty` matches the canonical difficulty.
     *
     * @param parentBlock - this block's parent
     */
    validateDifficulty(parentBlock: Block): boolean

    /**
     * Validates the gasLimit.
     *
     * @param parentBlock - this block's parent
     */
    validateGasLimit(parentBlock: Block): boolean

    /**
     * Validates the entire block header, throwing if invalid.
     *
     * @param blockchain - the blockchain that this block is validating against
     * @param height - If this is an uncle header, this is the height of the block that is including it
     */
    async validate(blockchain: Blockchain, height?: BN): Promise<void>

    /**
     * Returns the hash of the block header.
     */
    hash(): Buffer

    /**
     * Checks if the block header is a genesis header.
     */
    isGenesis(): boolean

    /**
     * Turns the header into the canonical genesis block header.
     */
    setGenesisParams(): void

    /**
     * Returns the rlp encoding of the block header
     */
    serialize(): Buffer

    /**
     * Returns the block header in JSON format
     *
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(_labels: boolean = false): { [key: string]: string } | string[]
  }

  /**
   * An object that represents the block
   */
  export default class Block {
    public readonly header: BlockHeader
    public readonly transactions: Transaction[] = []
    public readonly uncleHeaders: BlockHeader[] = []
    public readonly txTrie: Trie

    /**
     * Creates a new block object
     *
     * @param data - The block's data.
     * @param opts - The network options for this block, and its header, uncle headers and txs.
     */
    constructor(
      data: Buffer | [Buffer[], Buffer[], Buffer[]] | BlockData = {},
      opts: ChainOptions = {},
    )

    get raw(): [Buffer[], Buffer[], Buffer[]]

    /**
     * Produces a hash the RLP of the block
     */
    hash(): Buffer

    /**
     * Determines if this block is the genesis block
     */
    isGenesis(): boolean

    /**
     * Turns the block into the canonical genesis block
     */
    setGenesisParams(): void

    /**
     * Produces a serialization of the block.
     *
     * @param rlpEncode - If `true`, the returned object is the RLP encoded data as seen by the
     * Ethereum wire protocol. If `false`, a tuple with the raw data of the header, the txs and the
     * uncle headers is returned.
     */
    serialize(): Buffer
    serialize(rlpEncode: true): Buffer
    serialize(rlpEncode: false): [Buffer[], Buffer[], Buffer[]]

    /**
     * Generate transaction trie. The tx trie must be generated before the transaction trie can
     * be validated with `validateTransactionTrie`
     */
    async genTxTrie(): Promise<void>

    /**
     * Validates the transaction trie
     */
    validateTransactionsTrie(): boolean

    /**
     * Validates the transactions
     *
     * @param stringError - If `true`, a string with the indices of the invalid txs is returned.
     */
    validateTransactions(): boolean
    validateTransactions(stringError: false): boolean
    validateTransactions(stringError: true): string

    /**
     * Validates the entire block, throwing if invalid.
     *
     * @param blockChain - the blockchain that this block wants to be part of
     */
    async validate(blockChain: Blockchain): Promise<void>

    /**
     * Validates the uncle's hash
     */
    validateUnclesHash(): boolean

    /**
     * Validates the uncles that are in the block, if any. This method throws if they are invalid.
     *
     * @param blockChain - the blockchain that this block wants to be part of
     */
    async validateUncles(blockchain: Blockchain): Promise<void>

    /**
     * Returns the block in JSON format
     *
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labeled: boolean = false): any
  }


  /**
   * An object to set to which blockchain the blocks and their headers belong. This could be specified
   * using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
   * hardfork.
   */
  export interface ChainOptions {
    /**
     * A Common object defining the chain and the hardfork a block/block header belongs to.
     */
    common?: Common

    /**
     * The chain of the block/block header, default: 'mainnet'
     */
    chain?: number | string

    /**
     * The hardfork of the block/block header, default: 'petersburg'
     */
    hardfork?: string
  }

  /**
   * Any object that can be transformed into a `Buffer`
   */
  export interface TransformableToBuffer {
    toBuffer(): Buffer
  }

  /**
   * A hex string prefixed with `0x`.
   */
  export type PrefixedHexString = string

  /**
   * A Buffer, hex string prefixed with `0x`, Number, or an object with a toBuffer method such as BN.
   */
  export type BufferLike = Buffer | TransformableToBuffer | PrefixedHexString | number

  /**
   * A block header's data.
   */
  export interface BlockHeaderData {
    parentHash?: BufferLike
    uncleHash?: BufferLike
    coinbase?: BufferLike
    stateRoot?: BufferLike
    transactionsTrie?: BufferLike
    receiptTrie?: BufferLike
    bloom?: BufferLike
    difficulty?: BufferLike
    number?: BufferLike
    gasLimit?: BufferLike
    gasUsed?: BufferLike
    timestamp?: BufferLike
    extraData?: BufferLike
    mixHash?: BufferLike
    nonce?: BufferLike
  }

  /**
   * A block's data.
   */
  export interface BlockData {
    header?: Buffer | PrefixedHexString | BufferLike[] | BlockHeaderData
    transactions?: Array<Buffer | PrefixedHexString | BufferLike[] | TxData>
    uncleHeaders?: Array<Buffer | PrefixedHexString | BufferLike[] | BlockHeaderData>
  }

  export interface Blockchain {
    getBlock(hash: Buffer, callback: (err: Error | null, block?: Block) => void): void
  }
}
