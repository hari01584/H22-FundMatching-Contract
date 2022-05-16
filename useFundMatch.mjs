// 0.0.34817761
import { ApiSession, Contract, Account, KeyType, Token, TokenTypes } from '@buidlerlabs/hedera-strato-js';
import * as fs from 'fs';
import { inspect } from 'util';

async function deploy(){
    const { session } = await ApiSession.default();
    const counterContract = await Contract.newFrom({ path: "./fund_matching.sol" });

    const liveContract = await session.getLiveContract({
        id: fs.readFileSync('/tmp/fundmatchid', { encoding: 'utf8' }),
        abi: counterContract.interface,
      });
      
    console.log(`Deployed contract id is ${liveContract.id}`);

    console.log(liveContract);

    liveContract.onEvent("Received", ({ sender, message }) => {
        console.log(`received: ${message}`);
    }); 

    liveContract.onEvent("Log", ({ sender, message }) => {
        console.log(`Log event received: ${message}`);
    });
      
    // console.log(`My wallet data js`);


    var dat = await liveContract.donate();

    console.log(b.toString());
}

deploy();