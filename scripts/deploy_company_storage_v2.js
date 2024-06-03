require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

const proxyAddress = process.env.PROXY_ADDRESS;

async function main() {
  
  const CompanyStorageV2 = await ethers.getContractFactory("CompanyStorageV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, CompanyStorageV2);

  console.log(upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
