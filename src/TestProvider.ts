import { providers } from 'ethers'

export class TestProvider extends providers.BaseProvider {
  constructor () {
    super({
      name: 'test-provider',
      chainId: 0,
    })
  }

  async perform (method: string, params: any) {
    switch (method) {
      default:
        return super.perform(method, params)
    }
  }
}
