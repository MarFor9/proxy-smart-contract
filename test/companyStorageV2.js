const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Company Storage V2", function () {
    let CompanyStorage, companyStorage, CompanyStorageV2, companyStorageV2;
    let proxyAddress;

    // upload first smart contract
    before(async function () {
        CompanyStorage = await ethers.getContractFactory("CompanyStorage");
        companyStorage = await upgrades.deployProxy(CompanyStorage, []);
        await companyStorage.deployed();
        proxyAddress = companyStorage.address;

        // Register companies using CompanyStorage in version 1
        await companyStorage.registerCompany("0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", "ACTIVE");
        await companyStorage.registerCompany("0xBB5B557E8Fb62b89F4916B721be55cEb828dXD00", "INACTIVE");
    });

    beforeEach(async function () {
        // update to CompanyStorage to version 2
        CompanyStorageV2 = await ethers.getContractFactory("CompanyStorageV2");
        companyStorageV2 = await upgrades.upgradeProxy(proxyAddress, CompanyStorageV2);
    });

    it("should retrieve all companies", async function () {
        const allCompanies = await companyStorageV2.getAll();
        expect(allCompanies).to.have.lengthOf(2);
        expect(allCompanies[0].publicAddress).to.equal("0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73");
        expect(allCompanies[0].status).to.equal("ACTIVE");
        expect(allCompanies[1].publicAddress).to.equal("0xBB5B557E8Fb62b89F4916B721be55cEb828dXD00");
        expect(allCompanies[1].status).to.equal("INACTIVE");
    });

    it("should retrieve companies by status", async function () {
        const activeCompanies = await companyStorageV2.getAllByStatus("ACTIVE");
        expect(activeCompanies).to.have.lengthOf(1);
        expect(activeCompanies[0].publicAddress).to.equal("0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73");
    });
});

