var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(buying) {

  it("first account sends 10 ether => check balances in contract", async function() {
    let s = await Splitter.deployed();
    receipt = await s.sendValue({value:web3.toWei(10, 'ether')});

    let expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    let actualBalance =  await s.getUserBalance({from:web3.eth.accounts[0]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "1st account is not 0 ether");
    
    expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[1]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "2nd account is not 5 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[2]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "3nd account is not 5 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(10, 'ether'));
    actualBalance =  await s.getSplitterBalance().then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "Splitter balance is not 10 ether");

  });

  it("second account sends 5 ether => check balances in contract", async function() {
    let s = await Splitter.deployed();
    await s.sendValue({from:web3.eth.accounts[1], value:web3.toWei(5, 'ether')});
    
    let expectedBalance = web3.toBigNumber(web3.toWei(2.5, 'ether'));
    let actualBalance =  await s.getUserBalance({from:web3.eth.accounts[0]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "1st account is not 2.5 ether");
    
    expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[1]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "2nd account is not 5 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(7.5, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[2]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "3nd account is not 7.5 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(15, 'ether'));
    actualBalance =  await s.getSplitterBalance().then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "Splitter balance is not 15 ether");
  });
  
  it("second account splits balance => check balances in contract", async function() {
    let s = await Splitter.deployed();
    await s.splitBalance({from:web3.eth.accounts[1]});
    
    let expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    let actualBalance =  await s.getUserBalance({from:web3.eth.accounts[0]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "1st account is not 5 ether");
    
    expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[1]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "2nd account is not 0 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(10, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[2]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "3nd account is not 10 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(15, 'ether'));
    actualBalance =  await s.getSplitterBalance().then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "Splitter balance is not 15 ether");
  });

  it("third account withdraws balance  => check balances in contract", async function() {
    let s = await Splitter.deployed();
    await s.withdrawBalance({from:web3.eth.accounts[2]});
    
    let expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    let actualBalance =  await s.getUserBalance({from:web3.eth.accounts[0]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "1st account is not 5 ether");
    
    expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[1]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "2nd account is not 0 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[2]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "3nd account is not 0 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    actualBalance =  await s.getSplitterBalance().then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "Splitter balance is not 5 ether");
  });

  it("unregistered account sends value  => check reverting and balances in contract", async function() {
    let s = await Splitter.deployed();
    let mes = "";
    try{
      await s.sendValue({from:web3.eth.accounts[3], value:web3.toWei(5, 'ether')});
    }
    catch(e){
      mes = e.message;
    }
    assert.include(mes,"sender is not user","sendValue has not reverted properly");
    let expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    let actualBalance =  await s.getUserBalance({from:web3.eth.accounts[0]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "1st account is not 5 ether");
    
    expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[1]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "2nd account is not 0 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(0, 'ether'));
    actualBalance =  await s.getUserBalance({from:web3.eth.accounts[2]}).then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "3nd account is not 0 ether");

    expectedBalance = web3.toBigNumber(web3.toWei(5, 'ether'));
    actualBalance =  await s.getSplitterBalance().then(a=>a.toNumber());
    assert.equal(expectedBalance, actualBalance, "Splitter balance is not 5 ether");
  });

  it("first account sends 3 ether => check proper amount of weis spent", async function() {
    let s = await Splitter.deployed();
    u1_bal = await web3.eth.getBalance(web3.eth.accounts[0]);
    receipt = await s.sendValue({value:web3.toWei(3, 'ether'),gasPrice:1000000000});
    u1_bal_upd = await web3.eth.getBalance(web3.eth.accounts[0]);
    tx_fees = Number(receipt.receipt.gasUsed * 1000000000);
    weiSpent = tx_fees + Number(web3.toWei(3, 'ether'));
    weiSpentActual = u1_bal - u1_bal_upd;
    assert.equal(weiSpentActual, weiSpent,"first account has not spend the proper ether amount");
  });

})
