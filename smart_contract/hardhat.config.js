// https://eth-ropsten.alchemyapi.io/v2/O6D21TQOPgKWOCdBbjVwMkRu5nRtw2cx

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: process.env.HOST_URL,
      accounts: [process.env.ACOUNT_KEY],
    },
  },
};
