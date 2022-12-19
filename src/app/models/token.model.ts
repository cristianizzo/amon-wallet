export enum TokenType {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ERC20 = 'ERC20',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ERC721 = 'ERC721',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ERC1155 = 'ERC1155',

  ETH = 'ETH',
}

export enum AssetTypeEnum {
  tokens = 'tokens',
  nfts = 'nfts',
}

export class TokenModel {
  selected?: boolean;
  coinGeckoId?: string;
  chainSymbol?: string;
  symbol?: string;
  chainId?: number;
  type?: TokenType | string;
  address?: string;
  name?: string;
  decimals?: number;
  balance?: string;
  image?: string;
  priceChange24h?: number;
  fiatPrice?: number;
  cryptoPrice?: number; // price of the main coin chain
  loadBalance?: boolean;
}
