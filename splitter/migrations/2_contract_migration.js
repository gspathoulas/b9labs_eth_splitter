var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter,"0xE4584f90D83EBa863fFaB755e2655ea842ff3E5d","0x5766B8Bebe481aF64827077e212b8E552B114122","0x54DAB00E9B13D13E5F273aA4D89Cb4e3571478a6");
};
