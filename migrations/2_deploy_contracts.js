const Voting = artifacts.require("Voting.sol");

module.exports = async function(deployer, network, accounts) {
  let votingInstanceFuture = Voting.new(['Ivan', 'David', 'Marta']);
  let votingInstance = await votingInstanceFuture;
  console.log(votingInstance.address);
}