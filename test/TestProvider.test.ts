import { expect } from 'chai'
import { TestProvider } from '../src/TestProvider'

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
})
