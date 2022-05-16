import { Account, ApiSession, Contract, Token, TokenTypes } from '@buidlerlabs/hedera-strato-js';

const { session } = await ApiSession.default();
const token = new Token({
  name: "Do Good",
  symbol: "DGD",
  initialSupply: 1000,
  decimals: 3,
  type: TokenTypes.FungibleCommon,
});
const liveToken = await session.create(token);

console.log(`Token ${liveToken.id} has been successfully created.`);

// Token Created : 0.0.34817660