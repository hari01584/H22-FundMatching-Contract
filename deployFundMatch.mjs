import { ApiSession, Contract, Account, KeyType, Token, TokenTypes } from '@buidlerlabs/hedera-strato-js';
import * as fs from 'fs';

async function deploy(){
    const { session } = await ApiSession.default();
    const counterContract = await Contract.newFrom({ path: "./fund_matching.sol" });

    // Create a token
    const token = new Token({
        name: "Do Good",
        symbol: "DGD",
        initialSupply: 1000,
        decimals: 3,
        type: TokenTypes.FungibleCommon,
    });
    const liveToken = await session.create(token);
    console.log(`Token ${liveToken.id} has been successfully created.`);
    
    // Create a funding account
    const liveAccount = await session.create(
        new Account({ keyType: KeyType.ECDSA })
    );  
    console.log(`Recipent account id is ${liveAccount.id}`)

    // Upload and finally make contract :)
    const liveContract = await session.upload(
        counterContract,
        {
            _contract: { gas: 1000000 },
            _file: { fileMemo: "Fund Matching " },
        },
        liveToken.id.toSolidityAddress(),
        "A contract for some good cause",
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        liveAccount.id.toSolidityAddress()
    );

    liveToken.assignSupplyControlTo(liveContract);

    console.log(`Deployed contract id is ${liveContract.id}`);
    fs.writeFileSync('/tmp/fundmatchid', "" + liveContract.id);
}

deploy();