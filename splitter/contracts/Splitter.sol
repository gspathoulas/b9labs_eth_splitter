pragma solidity ^0.4.23;

contract Splitter {

    struct user{
        bool isMember;
        uint balance;
    }

    mapping(address => user) users;
    address[3] addresses;
    modifier senderIsUser(){
        require(users[msg.sender].isMember);
        _;
    }

    constructor(address _address1, address _address2, address _address3) public {
        users[_address1] = user(true,0);
        addresses[0] = _address1;
        users[_address2] = user(true,0);
        addresses[1] = _address2;
        users[_address3] = user(true,0);
        addresses[2] = _address3;
    }

    function getOtherUsers() public view senderIsUser returns (address address_a, address address_b) {
        uint index;
        for (uint i=0;i<3;i++){
            if (addresses[i] == msg.sender) {
                index = i;
            }
        }
        return (addresses[(index+1)%3],addresses[(index+2)%3]);
    }

    function sendEther() public payable senderIsUser{

        address a1;
        address a2 ;
        (a1,a2) = getOtherUsers();
        user storage u1  = users[a1];
        u1.balance = u1.balance + msg.value/2;
        user storage u2  = users[a2];
        u2.balance = u2.balance + msg.value/2;
    }

    function splitBalance() public senderIsUser returns(bool success){
        address a1;
        address a2;
        (a1,a2) = getOtherUsers();
        uint cur_bal = users[msg.sender].balance;
        users[msg.sender].balance = 0;
        users[a1].balance = users[a1].balance  + cur_bal/2;
        users[a2].balance = users[a2].balance  + cur_bal/2;
    }

    function getUserBalance() view public senderIsUser returns(uint userBalance){
        return users[msg.sender].balance;
    }

    function getSplitterBalance() view public returns(uint splitterBalance){
        return users[addresses[0]].balance + users[addresses[1]].balance + users[addresses[2]].balance;
    }
}
