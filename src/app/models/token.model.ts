export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
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
}
