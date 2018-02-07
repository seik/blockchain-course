// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'
// Voting is our usable abstraction, which we'll use through the code below.
const Voting = contract(voting_artifacts);

// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
const contractInstance = Voting.at('0x658146f01a63e1cd179a3dae99afd6e4007af51a');
const candidates = {"David": "option-1", "Ivan": "option-2", "Marta": "option-3"};

window.App = {
    start: function() {
      const self = this;

      Voting.setProvider(web3.currentProvider);
      Voting.defaults({from: web3.eth.coinbase});

      web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
          alert("there was an error fetching your accoutns.");
          return;
        }
        if (accs.length == 0) {
          alert("No accounts");
          return;
        }
      });

      var candidateNames = Object.keys(candidates);
      for (var i = 0; i < candidateNames.length; i++) {
        const candidateName = candidateNames[i];

        self.refreshCandidate(candidateName);
      }
    },

    voteForCandidate: async function(message) {
      const self = this;

      const candidateName = $("#candidate").val();
      const address = web3.eth.coinbase;
      const voted = await contractInstance.voteForCandidate(candidateName, {from: address});

      await self.refreshCandidate(candidateName);
    },

    refreshCandidate: function(candidateName) {
      let div_id = candidates[candidateName];
      const totalVotesPromise = contractInstance.totalVotesFor.call(candidateName);
      totalVotesPromise.then(votes => $("#"+ div_id).html(votes.toString()));
    }
};


window.addEventListener('load', function(){
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
