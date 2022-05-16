// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./hts-precompile/HederaTokenService.sol";
import "./hts-precompile/HederaResponseCodes.sol";

contract FundMatcher is HederaTokenService{
    event Received(address _from, uint _amt);
    event Log(address _from, string mess);

    address public TOKEN_ID;
    uint public balance;

    struct Charity{
        string uniq;
        string desc;
        uint expiry;
        address recipient;
    }

    Charity public sgood;
    constructor(address _tokenAddr, string memory _desc, uint _expiry, address _recipient){
        TOKEN_ID = _tokenAddr;
        
        sgood.uniq = "UNIQ";
        sgood.desc = _desc;
        sgood.expiry = _expiry;
        sgood.recipient = _recipient;
    }

    function donate(uint _amount) public payable{
        int response = HederaTokenService.transferToken(TOKEN_ID, msg.sender, sgood.recipient, int64(uint64(_amount)));
    
        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Transfer Failed");
        }
    }

    receive() external payable{
        balance += msg.value;
        emit Received(msg.sender, msg.value);

        // Ming our custom token to the amount received => 1 Hbar = 1 HTS
        (int response, uint64 newTotalSupply, int64[] memory serialNumbers) = HederaTokenService.mintToken(TOKEN_ID, uint64(msg.value), new bytes[](0));
        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Mint Failed");
        }
    }
}