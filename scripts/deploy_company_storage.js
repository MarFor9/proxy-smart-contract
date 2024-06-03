const {ethers, upgrades} = require("hardhat");

async function main() {
    const CompanyStorage = await ethers.getContractFactory("CompanyStorage");
    const proxy = await upgrades.deployProxy(CompanyStorage, []);
    await proxy.deployed();

    console.log(proxy.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
