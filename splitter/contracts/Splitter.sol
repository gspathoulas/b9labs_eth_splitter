pragma solidity ^0.4.23;

import "./Pausable.sol";


contract Splitter is Pausable{

        struct user{  // struct to represent users
                bool isMember;
                uint balance;
        }

        mapping(address => user) users;  //mapping to hold users
        address[3] addresses;  //array to be able to enumerate users

        event ContractInitiated(address a1, address a2, address a3);
        event ValueSent(address sender, uint value);
        event BalanceSplit(address sender);
        event Withdrawal(address sender);


        modifier senderIsUser(){ //modifier to restrice some functions only to users
                require(users[msg.sender].isMember, "sender is not user");
                _;
        }
        
        //constructor gets the three addresses and creates the contract
        // It populates both the array and the mapping
        // It sets initial balance equal to zero for all users
        constructor(address _address1, address _address2, address _address3) public {
                users[_address1] = user(true,0);
                addresses[0] = _address1;
                users[_address2] = user(true,0);
                addresses[1] = _address2;
                users[_address3] = user(true,0);
                addresses[2] = _address3;

                emit ContractInitiated(_address1, _address2, _address3);
        }

        // Overriding pause function to add senderIsUser modifier
        function pause() public senderIsUser{
                super.pause();
        }

        // Overriding unpause function to add senderIsUser modifier
        function unpause() public senderIsUser{
                super.unpause();
        }
        
        // Overriding getStatus function to add senderIsUser modifier
        function getStatus() public view senderIsUser returns(bool status){
                return super.getStatus();
        }

        // helper function to retrieve the other two user with regard to the function caller
        // This is internal as there is no need to be called outside of the contract
        function getOtherUsers() internal view senderIsUser returns (address address_a, address address_b) {
                uint index;
                for (uint i = 0 ; i < 3 ; i++){
                        if (addresses[i] == msg.sender) {
                                index = i;
                        }
                }
                return (addresses[(index+1)%3],addresses[(index+2)%3]);
        }

        // this function enables a user of the contract to send wei to be splitted
        // it is payable and only restricted to the three users
        function sendValue() public payable senderIsUser contractActive returns(bool success){
                address a1;
                address a2;
                (a1,a2) = getOtherUsers();
                user storage u1 = users[a1];
                u1.balance = u1.balance + msg.value/2;
                user storage u2 = users[a2];
                u2.balance = u2.balance + msg.value/2;
                emit ValueSent(msg.sender,msg.value);
                return true;
        }

        // it enables the calling user to split his current balnce to the other two users
        // it is also restricted to users only
        function splitBalance() public senderIsUser returns(bool success){
                address a1;
                address a2;
                (a1,a2) = getOtherUsers();
                uint cur_bal = users[msg.sender].balance;
                users[msg.sender].balance = 0;
                users[a1].balance = users[a1].balance + cur_bal/2;
                users[a2].balance = users[a2].balance + cur_bal/2;
                emit BalanceSplit(msg.sender);
                return true;
        }

        // this function returns the balance of the caller in the contracts
        // it is restricted to users only and it is a view function
        function getUserBalance() public view senderIsUser returns(uint userBalance){
                return users[msg.sender].balance;
        }

        // this function returns the global balance for the Splitter contract
        // it is a view function
        function getSplitterBalance() public view returns(uint splitterBalance){
                return users[addresses[0]].balance + users[addresses[1]].balance + users[addresses[2]].balance;
        }

        // this enable one of the user to withdraw its getBalance
        // it is restricted to users only
        function withdrawBalance() public senderIsUser returns(bool succes){
                uint amount = users[msg.sender].balance;
                users[msg.sender].balance = 0;
                msg.sender.transfer(amount);
                emit Withdrawal(msg.sender);
                return true;
        }
}
