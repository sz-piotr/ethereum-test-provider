import { expect } from 'chai'
import { TestProvider } from '../src/TestProvider'

describe('TestProvider.getBlockNumber', () => {
  it('starts with block number 0', async () => {
    const provider = new TestProvider()
    expect(await provider.getBlockNumber()).to.equal(0)
  })
})
