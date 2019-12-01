[![CircleCI](https://circleci.com/gh/sz-piotr/ethereum-test-provider.svg?style=svg)](https://circleci.com/gh/sz-piotr/ethereum-test-provider)

# Ethereum TestProvider

An ethers provider used for testing applications using the ethereum blockchain.

This project aims to provide a painless solution for writing blockchain tests.
Main features include:

- Ethers.js based, no `web3` dependency
- Full TypeScript support
- Snapshots (not implemented)
- Changing time (not implemented)
- Multiple mining modes (not implemented)
- Provides wallets preloaded with ETH
- Multiple providers for the same test chain

## Installation (not published yet)

With Yarn:
```
yarn add --dev ethereum-test-provider
```

With npm:
```
npm install -D ethereum-test-provider
```

## Example

```typescript
import { TestProvider } from 'ethereum-test-provider'

const provider = new TestProvider()
const [sender] = provider.getWallets()
const recipient = provider.createEmptyWallet()

await sender.sendTransaction({
  to: recipient.address,
  value: utils.parseEther('3.1415'),
})

console.log(await recipient.getBalance()) // 3.1415
```
