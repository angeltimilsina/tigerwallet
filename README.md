# Tiger Wallet

Experimental browser self-custody wallet. Solana Mainnet/Devnet and BNB Smart Chain Mainnet/Testnet. Native asset balances and transfers, standard SPL transfers, Token-2022 balance viewing, and imported BEP20 token balances and transfers. Wallet creation and signing are independent of external wallets.

## Architecture

- Trust Wallet Core 4.8.4, self-hosted C++/WebAssembly: BIP39 mnemonic handling, default Solana/Ethereum key derivation, Ed25519 and EVM secp256k1 signing.
- Browser Web Crypto: 256-bit OS-backed entropy passed explicitly to Wallet Core; AES-256-GCM vault encryption; PBKDF2-SHA256 with 600,000 iterations, random 32-byte salt and 12-byte nonce.
- Solana web3.js 1.99.0 and SPL Token 0.4.15: transaction preparation, fees, account creation, balances, broadcast and confirmation.
- Buildless HTML/CSS with an esbuild JavaScript bundle. Runtime assets are served locally; no third-party JavaScript or analytics.
- Encrypted vault persists only in browser localStorage. Decryption and signing run locally. RPCs receive public account requests and signed transactions only.
- Lock after five minutes of inactivity and immediately on tab hiding. C++ key and HD-wallet instances are deleted on lock; JavaScript cannot guarantee physical memory erasure.

## Capabilities

Create a 24-word wallet, verify backup words, restore a valid BIP39 phrase with optional BIP39 passphrase, unlock, lock, download/restore an encrypted vault, and reauthenticate to display the recovery phrase. Recovery uses Trust Wallet's default Solana derivation; another wallet's different derivation path may yield another address.

## Build and verification

`npm ci`, `npm run build`, `npm test`. Tests validate deterministic derivation, generation/restoration, encrypted vault roundtrip and rejection, and real cryptographic signatures for SOL and SPL transactions. Test fixtures use public test phrases and generated ephemeral test keys; no real wallet secrets are included.

No independent audit or browser/on-chain end-to-end testing has been completed. Browser-hosted signing exposes keys to any authorized future script update and local browser compromise. The WebAssembly loader requires CSP unsafe-eval for generated bindings. This software does not provide hardware-backed isolation, native mobile secure storage, or Trust Wallet's full product capabilities. Use Devnet before any real-funds evaluation.

BNB uses chain IDs 56 and 97, verified against eth_chainId. Transactions use pending nonces, gas estimates with a 20% gas-limit buffer, maximum fee and available balance checks, a two-minute quote expiry, and EIP155 replay protection. BEP20 tokens are imported manually by contract address. BNB activity lists transactions submitted from this browser; the explorer provides full account history. No bridging, swaps, automatic token discovery or other EVM chains are implemented.

## Primary references

- https://github.com/trustwallet/wallet-core
- https://developer.trustwallet.com/developer/wallet-core
- https://developer.trustwallet.com/developer/wallet-core/integration-guide/wallet-core-usage
- https://solana.com/docs/rpc/http
- https://docs.bnbchain.org/bnb-smart-chain/developers/json_rpc/json-rpc-endpoint/

Trust Wallet Core is maintained by Trust Wallet. Tiger Wallet is an independent implementation, not a Trust Wallet product or endorsement. Preserve dependency licenses and notices when distributing.
