import { utils } from 'ethers'

export const bufferToAddress = (buffer: Buffer) =>
  utils.getAddress(utils.hexlify(buffer))
