import { ApiSession, Contract } from '@buidlerlabs/hedera-strato-js';

async function deploy(){
    const { session } = await ApiSession.default();
    const counterContract = await Contract.newFrom({ path: "./increment.sol" });
    const liveContract = await session.upload(counterContract);

    // Increment then retrieve the counter
    await liveContract.inc();
    console.log(await liveContract.get());
}

deploy();