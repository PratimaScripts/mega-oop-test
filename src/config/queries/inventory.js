import { gql } from "apollo-boost";

const INVENTORY_RESPONSE = gql`
  fragment inventoryResponse on Inventory {
    _id
    userId
    role
    archived
    agreementData {
      _id
      agreementTitle
      tenants
      propertyAddress
      templateType
    }
    inventoryId
    status
    inventoryType
    tenancy
    meterReading {
      typeOfMeter
      serialNo
      m3
      condition
      notes
    }
    electricityMeterReading {
      typeOfMeter
      serialNo
      kwh
      condition
      notes
    }
    heatingSystem {
      typeOfMeter
      serialNo
      m3
      condition
      notes
    }
    waterAndHomeHeating {
      productType
      wearAndTear
      condition
      notes
    }
    keys {
      keyType
      number
      given
      date
      comments
    }
    otherItems {
      equipments
      description
      wearAndTear
      condition
      comments
    }
    rooms {
      name
      wallsCeilingFloor {
        item
        description
        wearAndTear
        comments
      }
      equipments {
        name
        description
        wearAndTear
        condition
        comments
      }
      comments
      images {
        name
        url
      }
    }
    notes
    signatures {
      signeeType
      name
      email
      ipAddress
      signedOn
      signatureType
      imageUrl
      typedName
      isSigned
    }
    createdAt
  }
`;

export const getInventories = gql`
  query GetInventories(
    $page: Int
    $pageSize: Int
    $property: String
    $tenant: String
    $archived: Boolean
  ) {
    getInventories(
      page: $page
      pageSize: $pageSize
      property: $property
      tenant: $tenant
      archived: $archived
    ) {
      success
      message
      count
      data {
        ...inventoryResponse
      }
    }
  }
  ${INVENTORY_RESPONSE}
`;

export const createInventory = gql`
  mutation CreateInventory(
    $inventoryId: String!
    $inventoryType: InventoryTypeEnum!
    $tenancy: String!
    $meterReading: [MeterReadingInput!]
    $electricityMeterReading: [ElectricityMeterReadingInput!]
    $heatingSystem: [HeatingSystemInput!]
    $waterAndHomeHeating: [WaterAndHomeHeatingInput!]
    $keys: [KeyInput!]
    $otherItems: [OtherItemInput!]
    $rooms: [RoomInput!]
    $notes: String!
  ) {
    createInventory(
      inventory: {
        inventoryId: $inventoryId
        inventoryType: $inventoryType
        tenancy: $tenancy
        meterReading: $meterReading
        electricityMeterReading: $electricityMeterReading
        heatingSystem: $heatingSystem
        waterAndHomeHeating: $waterAndHomeHeating
        keys: $keys
        otherItems: $otherItems
        rooms: $rooms
        notes: $notes
      }
    ) {
      _id
      userId
      role
      agreementData {
        _id
        agreementTitle
        tenants
        propertyAddress
        templateType
      }
      inventoryId
      status
      inventoryType
      tenancy
      meterReading {
        typeOfMeter
        serialNo
        m3
        condition
        notes
      }
      electricityMeterReading {
        typeOfMeter
        serialNo
        kwh
        condition
        notes
      }
      heatingSystem {
        typeOfMeter
        serialNo
        m3
        condition
        notes
      }
      waterAndHomeHeating {
        productType
        wearAndTear
        condition
        notes
      }
      keys {
        keyType
        number
        given
        date
        comments
      }
      otherItems {
        equipments
        description
        wearAndTear
        condition
        comments
      }
      rooms {
        name
        wallsCeilingFloor {
          item
          description
          wearAndTear
          comments
        }
        equipments {
          name
          description
          wearAndTear
          condition
          comments
        }
        comments
        images {
          name
          url
        }
      }
      notes
      signatures {
        signeeType
        name
        email
        ipAddress
        signedOn
        signatureType
        imageUrl
        typedName
      }
      createdAt
    }
  }
`;

export const updateInventory = gql`
  mutation UpdateInventory(
    $mongoId: ID!
    $inventoryId: String!
    $status: InventoryStatusEnum
    $inventoryType: InventoryTypeEnum!
    $tenancy: String!
    $meterReading: [MeterReadingInput!]
    $electricityMeterReading: [ElectricityMeterReadingInput!]
    $heatingSystem: [HeatingSystemInput!]
    $waterAndHomeHeating: [WaterAndHomeHeatingInput!]
    $keys: [KeyInput!]
    $otherItems: [OtherItemInput!]
    $rooms: [RoomInput!]
    $notes: String!
  ) {
    updateInventory(
      inventory: {
        inventoryId: $inventoryId
        status: $status
        inventoryType: $inventoryType
        tenancy: $tenancy
        meterReading: $meterReading
        electricityMeterReading: $electricityMeterReading
        heatingSystem: $heatingSystem
        waterAndHomeHeating: $waterAndHomeHeating
        keys: $keys
        otherItems: $otherItems
        rooms: $rooms
        notes: $notes
      }
      inventoryId: $mongoId
    ) {
      _id
    }
  }
`;

export const deleteInventory = gql`
  mutation DeleteInventory($inventoryId: [String]!) {
    deleteInventory(inventoryId: $inventoryId) {
      success
      message
    }
  }
`;

export const updateInventoryStatus = gql`
  mutation UpdateInventoryStatus(
    $inventoryId: [String]!
    $status: InventoryStatusEnum!
  ) {
    updateInventoryStatus(inventoryId: $inventoryId, status: $status) {
      success
      message
      data {
        _id
      }
    }
  }
`;

export const getInventoryById = gql`
  query GetInventoryById($inventoryId: String!) {
    getInventoryById(inventoryId: $inventoryId) {
      _id
      userId
      role
      agreementData {
        _id
        agreementTitle
        tenants
        propertyAddress
        templateType
      }
      inventoryId
      status
      inventoryType
      tenancy
      meterReading {
        typeOfMeter
        serialNo
        m3
        condition
        notes
      }
      electricityMeterReading {
        typeOfMeter
        serialNo
        kwh
        condition
        notes
      }
      heatingSystem {
        typeOfMeter
        serialNo
        m3
        condition
        notes
      }
      waterAndHomeHeating {
        productType
        wearAndTear
        condition
        notes
      }
      keys {
        keyType
        number
        given
        date
        comments
      }
      otherItems {
        equipments
        description
        wearAndTear
        condition
        comments
      }
      rooms {
        name
        wallsCeilingFloor {
          item
          description
          wearAndTear
          comments
        }
        equipments {
          name
          description
          wearAndTear
          condition
          comments
        }
        comments
        images {
          name
          url
        }
      }
      notes
      signatures {
        signeeType
        name
        email
        ipAddress
        signedOn
        signatureType
        imageUrl
        typedName
      }
      createdAt
    }
  }
`;

export const duplicateInventory = gql`
  mutation DuplicateInventory($inventoryId: ID!) {
    duplicateInventory(inventoryId: $inventoryId) {
      success
      message
      data {
        _id
      }
    }
  }
`;

export const getInventoryFilters = gql`
  query getInventoryFilters {
    getInventoryFilters {
      success
      message
      data
    }
  }
`;

export const sendInventoryForSign = gql`
  mutation sendInventoryForSign($inventoryId: ID!) {
    sendInventoryForSign(inventoryId: $inventoryId) {
      success
      message
    }
  }
`;
