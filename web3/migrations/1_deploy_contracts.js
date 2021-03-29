var TicTacToe = artifacts.require("./tictactoe.sol");

module.exports = function (deployer) {
  deployer.deploy(TicTacToe);
};
