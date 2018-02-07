// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      gas: '4600000',
      gasPrice: '100e9',
      network_id: '*' // Match any network id
    }
  }
}
