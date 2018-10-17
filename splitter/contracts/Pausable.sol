pragma solidity ^0.4.23;

contract Pausable{

        bool isPaused;

        modifier contractActive() {
                require(!isPaused,"Contract is paused");
                _;
        }
        modifier contractPaused() {
                require(isPaused,"Contract is active");
                _;
        }
        constructor() public {
                isPaused = false;
        }
        function pause() public contractActive {
                isPaused = true;
        }
        function unpause() public contractPaused {
                isPaused = false;
        }
        function getStatus() public view returns(bool status){
                return !isPaused;
        }
}