require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
    networks: {
        hardhat: {
        },
        besu: {
            url: "http://localhost:8545",
            chainId: 2018,
            accounts: [privateKey],
            gasPrice: 0,
            gas: 9007199254740990,
            initialBaseFeePerGas: 0
        }
    },
    solidity: {
        version: "0.8.11",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
        },
    },
};
