/**
 * Reads the input chain's RPC URL from the available environment variables.
 * @param chain - The chain to read the RPC URL for.
 * @throws 'CHAIN_RPC_${chain}' environment variable is not set.'
 */
export function requireRpcUrlEnv(chain: string): string {
  const rpcUrlKey = rpcUrlEnvKeyFromChain(chain);
  const rpcUrl = process.env[rpcUrlKey];
  if (!rpcUrl) {
    throw new Error(`${rpcUrlKey} environment variable is not set.`);
  }
  return rpcUrl;
}

/**
 * Returns the environment variable key for the input chain's RPC URL.
 * @param chain - The chain to read the RPC URL for.
 */
export function rpcUrlEnvKeyFromChain(chain: string): string {
  return `CHAIN_RPC_${chain.toUpperCase()}`;
}

const CAIP2_MAPPING = {
  'ETHEREUM': {
    getTxUrl: (tx) => `https://etherscan.io/tx/${tx}`,
    getAddressUrl: (address) => `https://etherscan.io/address/${address}`,
  },
  'SEPOLIA': {
    getTxUrl: (tx) => `https://sepolia.etherscan.io/tx/${tx}`,
    getAddressUrl: (address) => `https://sepolia.etherscan.io/address/${address}`,
  },
  'BSCTESTNET': {
    getTxUrl: (tx) => `https://testnet.bscscan.com/tx/${tx}`,
    getAddressUrl: (address) => `https://testnet.bscscan.com/address/${address}`,
  },
  'POLYGONMUMBAI': {
    getTxUrl: (tx) => `https://mumbai.polygonscan.com/tx/${tx}`,
    getAddressUrl: (address) => `https://mumbai.polygonscan.com/address/${address}`,
  },
  'TRONSHASTA': {
    getTxUrl: (tx) => `https://shasta.tronscan.org/#/transaction/${tx}`,
    getAddressUrl: (address) => `https://shasta.tronscan.org/#/address/${address}`,
  },
};

export function blockExplorerTransactionLink(
  caip2Identifier: string,
  transactionHash: string
): string | null {
  const mapping = CAIP2_MAPPING[caip2Identifier];
  const url = mapping?.getTxUrl(transactionHash);

  if (!url) {
    return null;
  }

  return url;
}

export function blockExplorerAddressLink(
  caip2Identifier: string,
  address: string
): string | null {
  const mapping = CAIP2_MAPPING[caip2Identifier];
  const url = mapping?.getAddressUrl(address);

  if (!url) {
    return null;
  }

  return url;
}