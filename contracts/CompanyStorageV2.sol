pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CompanyStorageV2 is Initializable {
    struct Company {
        string publicAddress;
        string status;
    }

    mapping(string => Company) internal companies;
    mapping(string => string[]) internal publicAddressByStatus;
    mapping(string => uint256) internal indexOfPublicAddress;

    event CompanyRegistered(string publicAddress, string status);
    event CompanyStatusChanged(string publicAddress, string oldStatus, string newStatus);


    function initialize() public initializer {
        // Initializer can be empty
    }

    function registerCompany(string memory publicAddress, string memory status) public {
        require(keccak256(abi.encodePacked(companies[publicAddress].publicAddress)) == keccak256(abi.encodePacked("")), "publicAddress already registered");

        companies[publicAddress] = Company(publicAddress, status);
        publicAddressByStatus[status].push(publicAddress);
        indexOfPublicAddress[publicAddress] = publicAddressByStatus[status].length - 1;

        emit CompanyRegistered(publicAddress, status);
    }

    function getByCompanyPublicAddress(string memory publicAddress) public view returns (Company memory) {
        require(keccak256(abi.encodePacked(companies[publicAddress].publicAddress)) != keccak256(abi.encodePacked("")), "publicAddress not found");
        return companies[publicAddress];
    }

    function getAllByStatus(string memory status) public view returns (Company[] memory) {
        string[] memory publicAddress = publicAddressByStatus[status];
        Company[] memory companiesList = new Company[](publicAddress.length);
        for (uint256 i = 0; i < publicAddress.length; i++) {
            companiesList[i] = companies[publicAddress[i]];
        }
        return companiesList;
    }

    function changeCompanyStatus(string calldata publicAddress, string calldata newStatus) external {
        Company storage company = companies[publicAddress];
        require(bytes(company.publicAddress).length != 0, "Company not found");

        string memory oldStatus = company.status;
        uint256 index = indexOfPublicAddress[publicAddress];
        require(index < publicAddressByStatus[oldStatus].length, "Index out of bounds");

        // Remove publicAddress from old status list and adjust indexes
        uint256 lastIndex = publicAddressByStatus[oldStatus].length - 1;
        if (index < lastIndex) {
            string memory lastPublicAddress = publicAddressByStatus[oldStatus][lastIndex];
            publicAddressByStatus[oldStatus][index] = lastPublicAddress;
            indexOfPublicAddress[lastPublicAddress] = index;
        }
        publicAddressByStatus[oldStatus].pop();
        delete indexOfPublicAddress[publicAddress];

        // update the company's status and add it to a new status
        company.status = newStatus;
        publicAddressByStatus[newStatus].push(publicAddress);
        indexOfPublicAddress[publicAddress] = publicAddressByStatus[newStatus].length - 1;

        emit CompanyStatusChanged(publicAddress, oldStatus, newStatus);
    }

    function getAll() external view returns (Company[] memory) {
        uint256 totalCompanyCount = publicAddressByStatus["ACTIVE"].length + publicAddressByStatus["INACTIVE"].length + publicAddressByStatus["DEACTIVATED"].length;

        Company[] memory allCompanies = new Company[](totalCompanyCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < publicAddressByStatus["ACTIVE"].length; i++) {
            allCompanies[currentIndex] = companies[publicAddressByStatus["ACTIVE"][i]];
            currentIndex++;
        }

        for (uint256 i = 0; i < publicAddressByStatus["INACTIVE"].length; i++) {
            allCompanies[currentIndex] = companies[publicAddressByStatus["INACTIVE"][i]];
            currentIndex++;
        }

        for (uint256 i = 0; i < publicAddressByStatus["DEACTIVATED"].length; i++) {
            allCompanies[currentIndex] = companies[publicAddressByStatus["DEACTIVATED"][i]];
            currentIndex++;
        }
        return allCompanies;
    }

}

