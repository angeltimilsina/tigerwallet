import {keccak_256} from '@noble/hashes/sha3';
import {toHex} from './evm.mjs';
import config from './fee-config.json' with {type:'json'};
export const feeConfig=config;
export function walletFee(amount){const raw=BigInt(amount);if(raw<=0n)throw Error('Invalid fee amount');return (raw*30n+9999n)/10000n;}
export function feeRecipient(network){const address=network==='mainnet-beta'||network==='devnet'?config.solana:config.evm;return address||null;}
const word=value=>BigInt(value).toString(16).padStart(64,'0');
export function routerData(token,recipient,amount){if(!/^0x[\da-f]{40}$/i.test(recipient)||token&&!/^0x[\da-f]{40}$/i.test(token))throw Error('Invalid router address');const signature=token?'sendToken(address,address,uint256)':'sendNative(address,uint256)';return toHex(keccak_256(new TextEncoder().encode(signature)).slice(0,4))+(token?token.slice(2).padStart(64,'0'):'')+recipient.slice(2).padStart(64,'0')+word(amount);}
export function allowanceData(owner,router){return '0xdd62ed3e'+owner.slice(2).padStart(64,'0')+router.slice(2).padStart(64,'0');}
export function approvalData(router,total){return '0x095ea7b3'+router.slice(2).padStart(64,'0')+word(total);}
