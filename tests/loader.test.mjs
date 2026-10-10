import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
test('shipped Wallet Core loader initializes adjacent WASM without unsupported options',async()=>{
 const filename=resolve('dist/core/wallet-core.js'),module={exports:{}};
 const context=vm.createContext({module,exports:module.exports,require:createRequire(filename),__filename:filename,__dirname:dirname(filename),process,console,WebAssembly,Buffer,TextDecoder,TextEncoder,setTimeout,clearTimeout});
 vm.runInContext(await readFile(filename,'utf8'),context,{filename});
 const core=await module.exports();
 const wallet=core.HDWallet.createWithMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about','');
 try{assert.equal(wallet.getAddressForCoin(core.CoinType.solana),'GjJyeC1r2RgkuoCWMyPYkCWSGSGLcz266EaAkLA27AhL');}finally{wallet.delete();}
});
