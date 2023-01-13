App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  buffer: null,


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('https://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("BDML.json", function(data) {
      var bdml = data;
      // Instantiate a new truffle contract from the artifact
      App.contracts.BDML = TruffleContract(bdml);
      // Connect provider to interact with contract
      App.contracts.BDML.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.BDML.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.tnxUpdate({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
      // instance.blockUpdate({}, {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // }).watch(function(error, event) {
      //   console.log("event triggered", event)
      //   // Reload when a new vote is recorded
      //   App.render();
      // });
    });
  },

  render: function() {
    var bdmlInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.BDML.deployed().then(function(instance) {
      bdmlInstance = instance;
      return bdmlInstance.numTxns();
    }).then(function (numTxns) {
      
      $("#numTxns").html("Number of Transactions made on present block : " + numTxns);
      var txnsResults = $("#txnsResults");
      txnsResults.empty();
      //console.log(bdmlInstance.numTnxs.call().);

      var modelsSelect = $('#modelsSelect');
      modelsSelect.empty();

      var transactions = bdmlInstance.transactions;
      
      for (var i = 1; i <= numTxns; i++) {
        transactions(i).then(function(candidate) {
          var id = candidate[0]
          var model = candidate[1];
          var voteCount = candidate[3];
          
          // Render candidate Result
          var modelTemplate = "<tr> <th>" + id + "</th><td>" + model + "</td> <td>" +voteCount + "</td> </tr>"
          txnsResults.append(modelTemplate);

          // Render candidate ballot option
          var modelOption = "<option value='" + id + "' >" + model + "</ option>"
          modelsSelect.append(modelOption);
        });
      }
      
      loader.hide();
      content.show();

    }).catch(function(error) {
      console.warn(error);
    });

    App.contracts.BDML.deployed().then(function(instance) {
      bdmlInstance = instance;
      return bdmlInstance.blockNum();
    }).then(function (blockNum) {
      var blocks = bdmlInstance.blocks;
      $("#blockNumber").html("Present Block Number : " + blockNum);
        blocks(blockNum-1).then(function(candidate){
          $("#presentModel").html("Present Model on Block Chain : " + candidate);
        });
      
    }).catch(function(error) {
      console.warn(error);
    });

  },
  

  castVote: function() {
    var candidateId = $('#modelsSelect').val();
    console.log(candidateId);
    App.contracts.BDML.deployed().then(function(instance) {
      return instance.voting(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  addModel: function() {
    var model = $('#model').val();
      App.contracts.BDML.deployed().then(function(instance) {
        return instance.uploadModel(model, { from: App.account });
      }).then(function(result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
  },
  addParticipant: function() {
    var participant = $('#participant').val();
    App.contracts.BDML.deployed().then(function(instance) {
      return instance.addParticipants(participant, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});