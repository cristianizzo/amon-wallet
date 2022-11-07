/* eslint-disable @typescript-eslint/naming-convention */
export const ProvidersJson = [
  {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
    // rpc: 'https://mainnet.infura.io/v3/',
    chainId: 1,
    symbol: 'ETH',
    explorer: 'https://etherscan.io/',
    default: true,
    // name: 'Binance Smart Chain',
    // rpc: 'https://bsc-dataseed1.ninicoin.io',
    // chainId: 56,
    // symbol: 'BNB',
    // explorer: 'https://bscscan.com/',
  },
  {
    id: 2,
    name: 'Ethereum Goerli',
    rpc: 'https://goerli.infura.io/v3/',
    chainId: 5,
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    default: false
  },
  {
    id: 3,
    name: 'Binance Smart Chain',
    rpc: 'https://bsc-dataseed1.ninicoin.io',
    chainId: 56,
    symbol: 'BNB',
    explorer: 'https://bscscan.com/',
    default: false
  },
  {
    id: 4,
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com/',
    chainId: 137,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com/',
    default: false
  },
  {
    id: 5,
    name: 'Avax C-Chain Mainnet',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 137,
    symbol: 'AVAX',
    explorer: 'https://cchain.explorer.avax.network/',
    default: false
  },
  {
    id: 6,
    name: 'Fantom Mainnet',
    rpc: 'https://rpc.ftm.tools/',
    chainId: 250,
    symbol: 'FTM',
    explorer: 'https://ftmscan.com/',
    default: false
  }
];
