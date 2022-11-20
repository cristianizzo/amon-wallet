export class TokenModel {
  selected?: boolean;
  coinGeckoId?: string;
  chainSymbol?: string;
  symbol?: string;
  chainId?: number;
  type?: string;
  address?: string;
  name?: string;
  decimals?: number;
  balance?: string;
  image?: string;
  priceChange24h?: number;
  fiatPrice?: number;
  cryptoPrice?: number; // price of the main coin chain
}
