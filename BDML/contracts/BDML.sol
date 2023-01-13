// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "./Ownable.sol";

contract BDML is Ownable{

    struct Model{
        uint index;
        string model;
        address modelCreator;
        uint votes;
        mapping(address => bool) voteStatus;
    }
    
    mapping(uint => string) public blocks;
    uint public blockNum;
    
    uint public numTxns;
    uint public numParticipants;
    
    address[] participants;
    
    
    mapping(uint => Model) public transactions;
    
    event tnxUpdate(uint numTxns, uint blockNumber);
    event blockUpdate(uint blockNumber, string model);
    
    constructor() {
        participants.push(_owner);
        numParticipants = 1;
        blocks[blockNum] = "0x0";
    }

    function isParticipant(address _person) private view returns(bool){
        uint i;
        for(i = 0; i < participants.length; i++){
            if(participants[i] == _person)
                return true;
        }
        return false;
    }
    
    function addParticipants(address _person) public onlyOwner{
        require(numTxns == 0, "Should be changed at the beginning of BLOCK");
        require(!isParticipant(_person), "This Person is already one of the participants");
        participants.push(_person);
        numParticipants += 1;
    }
    
    function uploadModel(string memory  _model) public {
        require(isParticipant(msg.sender), "You are not in this Consortium. GET OUT!!!");
        numTxns++;
        Model storage m = transactions[numTxns];
        m.index = numTxns;
        m.model = _model;
        m.modelCreator = msg.sender;
        m.votes = numParticipants-1;
        	 	
        emit tnxUpdate(numTxns, blockNum);
    }
    
    function getModel(uint _txnNum) public view returns(string memory){
        require(isParticipant(msg.sender), "You are not in this Consortium. GET OUT!!!");
        return transactions[_txnNum].model;
    }
    
    function voting(uint _modelNumber) public{
        require(isParticipant(msg.sender), "You are not in this Consortium. GET OUT!!!");
        require(msg.sender != transactions[_modelNumber].modelCreator, "You should not vote your own Model, thats cheating!!");
        require(!(transactions[_modelNumber].voteStatus[msg.sender]), "You already voted myan!!");
        transactions[_modelNumber].voteStatus[msg.sender] = true;
        transactions[_modelNumber].votes -= 1;
        
        if(transactions[_modelNumber].votes == 0){
            updateBlock( transactions[_modelNumber].model);
        }
        
    }
    
    function updateBlock(string memory _model) private {
        blocks[blockNum] = _model;
        emit blockUpdate(blockNum, _model);
        blockNum +=1;
        numTxns = 0;
    }
}