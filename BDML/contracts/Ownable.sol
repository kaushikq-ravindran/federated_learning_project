// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

contract Ownable{
    
    address _owner;
    
    constructor() {
        _owner = msg.sender;
    }
    
    modifier onlyOwner(){
        require(isOwner(), "You are not the OWNER");
        _;
    }
    
    function isOwner() public view returns(bool) {
        return(msg.sender == _owner);
    }
    
    function getOwner() public view returns(address){
        return _owner;
    }
}