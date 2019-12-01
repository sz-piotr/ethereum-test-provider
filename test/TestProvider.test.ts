import { expect } from 'chai'
import { TestProvider } from '../src/TestProvider'
import { utils, Wallet } from 'ethers'

describe('TestProvider', () => {
  it('sets the network correctly', async () => {
    const provider = new TestProvider()
    expect(await provider.getNetwork()).to.deep.equal({
      name: 'test-chain',
      chainId: 1337,
    })
  })

  it('starts with block number 0', async () => {
    const provider = new TestProvider()
    expect(await provider.getBlockNumber()).to.equal(0)
  })

  it('returns 100 ETH balance for initial wallets', async () => {
    const [wallet] = new TestProvider().getWallets()
    const balance = await wallet.getBalance()
    expect(balance.eq(utils.parseEther('100'))).to.equal(true)
  })

  it('returns 0 transaction count for initial wallets', async () => {
    const [wallet] = new TestProvider().getWallets()
    expect(await wallet.getTransactionCount()).to.equal(0)
  })

  it('supports sending transactions', async () => {
    const provider = new TestProvider()
    const [wallet] = provider.getWallets()
    const other = Wallet.createRandom().connect(provider)

    await wallet.sendTransaction({
      to: other.address,
      value: utils.parseEther('10'),
    })

    const balance = await other.getBalance()
    expect(balance.eq(utils.parseEther('10'))).to.equal(true)
  })
})
