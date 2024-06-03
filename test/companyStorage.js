const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Company Storage", function () {
    const expectedPublicAddress = "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73";
    const expectedActiveStatus = "ACTIVE";

    let companyStorage;

    beforeEach(async function () {
        let CompanyStorage = await ethers.getContractFactory("CompanyStorage");
        companyStorage = await CompanyStorage.deploy();
    });

    it("should register a company", async function () {
        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        const company = await companyStorage.getByCompanyPublicAddress(expectedPublicAddress);

        expect(company.publicAddress).to.equal(expectedPublicAddress);
        expect(company.status).to.equal(expectedActiveStatus);
    });

    it('should not allow register a company with the same publicAddress', async function () {
        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        await expect(companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus))
            .to.be.revertedWith("publicAddress already registered");
    });

    it("should retrieve a company by publicAddress", async function () {
        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        const response = await companyStorage.getByCompanyPublicAddress(expectedPublicAddress)
        expect(response.publicAddress).to.equal(expectedPublicAddress);
    });

    it("should not retrieve a company that does not exist", async function () {
        await expect(companyStorage.getByCompanyPublicAddress("PUBLIC KEY NOT FUND"))
            .to.be.revertedWith("publicAddress not found");
    });

    it("should retrieve companies by status", async function () {
        const otherPublicAddress = "0xBB3B557E8Fb62b89F4916B721be55cEb828dBzg4";
        const inActive = "INACTIVE";

        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        await companyStorage.registerCompany(otherPublicAddress, inActive);

        const companies = await companyStorage.getAllByStatus(expectedActiveStatus);
        const registeredPublicAddresses = companies.map(c => c.publicAddress);

        expect(registeredPublicAddresses).to.include(expectedPublicAddress);
        expect(companies.every(c => c.status === expectedActiveStatus)).to.be.true;
    });

    it("should change the status of a company", async function () {
        const newStatus = "INACTIVE";

        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        await companyStorage.changeCompanyStatus(expectedPublicAddress, newStatus);

        const updatedCompany = await companyStorage.getByCompanyPublicAddress(expectedPublicAddress);
        expect(updatedCompany.status).to.equal(newStatus);
    });

    it("should emit a CompanyRegistered event when company registered", async function () {
        const tx = await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        const receipt = await tx.wait();

        expect(receipt.events.some(event => event.event === "CompanyRegistered")).to.be.true;
        const event = receipt.events.find(event => event.event === "CompanyRegistered");
        expect(event.args.publicAddress).to.equal(expectedPublicAddress);
        expect(event.args.status).to.equal(expectedActiveStatus);
    });

    it("should emit a CompanyStatusChanged event on status change", async function () {
        const newStatus = "INACTIVE";

        await companyStorage.registerCompany(expectedPublicAddress, expectedActiveStatus);
        const tx = await companyStorage.changeCompanyStatus(expectedPublicAddress, newStatus);
        const receipt = await tx.wait();

        expect(receipt.events.some(event => event.event === "CompanyStatusChanged")).to.be.true;
        const event = receipt.events.find(event => event.event === "CompanyStatusChanged");
        expect(event.args.publicAddress).to.equal(expectedPublicAddress);
        expect(event.args.oldStatus).to.equal(expectedActiveStatus);
        expect(event.args.newStatus).to.equal(newStatus);
    });
});
