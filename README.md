# proxy-smart-contract

**How to start?**

```Shell
npm install - install all dependencies
```

**How to compile smart contract?**
In root directory run:
```Shell
npx hardhat compile
```
in /artifacts and /cache are all info about build

in the artifacts/contracts/CompanyStorageV2/CompanyStorageV2.sol is the ABI of the smart contract in CompanyStorage.json

**Where put test for testing smart contract?**
In the /test

Test are written in nodejs or in solidity (in more cases in nodejs)
**How to run tests?**
```Shell
npx hardhat test
```
Expected output:

    Company Storage
    ✔ should register a company (52ms)
    ✔ should not allow register a company with the same DID (48ms)
    ✔ should retrieve a company by did
    ✔ should not retrieve a company that does not exist
    ✔ should retrieve companies by status (52ms)
    ✔ should change the status of a company (47ms)
    ✔ should emit a CompanyRegistered event when company registered
    ✔ should emit a CompanyStatusChanged event on status change
    
    Company Storage V2
    ✔ should retrieve all companies
    ✔ should retrieve companies by status
    10 passing (1s)


**How to deploy smart contract 1 version?**
```Shell
npx hardhat run scripts/deploy_company_storage.js --network besu
```

copy from console output address of deployed smart contract, will need it in next step.


**How to verify smart contract?**

log in into besu console:
```Shell
npx hardhat console --network besu 
```

in the console write:
```Shell
const v1 = await ethers.getContractAt("CompanyStorageV2", "0x5c7cB2D007218404a2f38aDE9738735Faf56a8C6");
const v1 = await ethers.getContractAt("State", "0x338F940F4231662Dd9a689DdC4691450de932Be5");
await v1.registerCompany("test:4bqLeZuVpqTNFZsdq48qUt9y5pAZfRdFtruoY3uVP3", "ACTIVE");
console.log(await v1.getByCompanyDid("test:4bqLeZuVpqTNFZsdq48qUt9y5pAZfRdFtruoY3uVP3"))
```

**How to upgrade smart contract to 2 version?**

Put the address of the deployed smart contract in the deploy_company_storage_v2.js file under proxyAddress

Run:
```Shell
npx hardhat run scripts/deploy_company_storage_v2.js --network besu
```

**How to verify upgraded smart contract?**
in the console write:
```Shell
const v2 = await ethers.getContractAt("CompanyStorageV2", "0x5c7cB2D007218404a2f38aDE9738735Faf56a8C6");
console.log(await v2.getAll())
```
In output shuold be one record which was added in previous step.
```Shell
expected output:
[
'test:4bqLeZuVpqTNFZsdq48qUt9y5pAZfRdFtruoY3uVP3',
'ACTIVE',
did: 'test:4bqLeZuVpqTNFZsdq48qUt9y5pAZfRdFtruoY3uVP3',
status: 'ACTIVE'
]
```
To exit from console:
```Shell
.exit or ctrl + C
```
