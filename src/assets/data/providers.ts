// eslint-disable-next-line @typescript-eslint/naming-convention
export const ProvidersJson = [
  {
    name: 'Ethereum Mainnet',
    rpc: 'https://mainnet.infura.io/v3/',
    chainId: 1,
    symbol: 'ETH',
    explorer: 'https://etherscan.io/',
    default: true
  },
  {
    name: 'Ethereum Goerli',
    rpc: 'https://goerli.infura.io/v3/',
    chainId: 5,
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    default: false
  },
  {
    name: 'Binance Smart Chain Mainnet',
    rpc: 'https://bsc-dataseed1.ninicoin.io',
    chainId: 56,
    symbol: 'BNB',
    explorer: 'https://bscscan.com/',
    default: false
  },
  {
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com/',
    chainId: 137,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com/',
    default: false
  },
  {
    name: 'Avax C-Chain Mainnet',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 137,
    symbol: 'AVAX',
    explorer: 'https://cchain.explorer.avax.network/',
    default: false
  },
  {
    name: 'Fantom Mainnet',
    rpc: 'https://rpc.ftm.tools/',
    chainId: 250,
    symbol: 'FTM',
    explorer: 'https://ftmscan.com/',
    default: false
  }
];
