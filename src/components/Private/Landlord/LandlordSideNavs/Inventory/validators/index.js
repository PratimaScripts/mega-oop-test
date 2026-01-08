import * as yup from "yup"

const isRequiredString = (msg) => yup.string().required(msg)
const isString = (msg) => yup.string(msg).notRequired()
const isNumber = (msg) => yup.number(msg).notRequired()
const isBoolean = (msg) => yup.boolean(msg).notRequired()

export const inventoryRoomValidation = yup.object({
  name: isString("Room Name must be a string!"),
  comments: isString("Room comments must be a string!"),
  wallsCeilingFloor: yup.array().of(
    yup.object({
      item: isString("Room's walls, ceiling & floor must be a string!"),
      description: isString("Room's walls, ceiling & floor description must be a string!"),
      wearAndTear: isString("Room's walls, ceiling & floor wear and tear must be a single string!"),
      comments: isString("Room's walls, ceiling & floor comments must be a string!")
    })
  ),
  equipments: yup.array().of(
    yup.object({
      name: isString("Room equipment's name must be a string!"),
      description: isString("Room equipment's description must be a string!"),
      wearAndTear: isString("Room equipment's wear and tear must be a single string!"),
      condition: isString("Room's condition must be a string"),
      comments: isString("Room's comments must be a string!")
    })
  ),
  images: yup.array().of(
    yup.object({
      name: isString("Room image's alias must be a string!"),
      url: isString("Room image's url must be a string!")
    })
  )
})

export const inventoryValidation = yup.object({
  inventoryId: isRequiredString("Inventory id required!"),
  inventoryType: isRequiredString("Inventory type required!"),
  tenancy: isRequiredString("Tenancy required!"),
  meterReading: yup.array().of(
    yup.object({
      typeOfMeter: isRequiredString("Meter reading type must be a string!"),
      serialNo: isNumber("Reading meter's  serial number must be a number!"),
      m3: isNumber("Reading meter's M3 must be a number!"),
      condition: isRequiredString("Reading meter's condition must be a string!"),
      notes: isRequiredString("Reading meter's notes must be a string!")
    })
  ),
  electricityMeterReading: yup.array().of(
    yup.object({
      typeOfMeter: isRequiredString("Electricity meter reading type must be a string!"),
      serialNo: isNumber("Electricity meter's serial number must be a number!"),
      kwh: isNumber("Electricity meter reading KWH must be a number!"),
      condition: isRequiredString("Electricity meter readingCondition must be a string!"),
      notes: isRequiredString("Electricity meter reading notes must be a string!")
    })
  ),
  heatingSystem: yup.array().of(
    yup.object({
      typeOfMeter: isRequiredString("Heating system's type of meter must be a string!"),
      serialNo: isNumber("Heating system's serial number must be a number!"),
      m3: isNumber("Heating system's M3 must be a number!"),
      condition: isRequiredString("Heating system's condition must be a string!"),
      notes: isRequiredString("Heating system's notes must be a string!")
    })
  ),
  waterAndHomeHeating: yup.array().of(
    yup.object({
      productType: isRequiredString("Water and home heating's product type must be a string!"),
      wearAndTear: isRequiredString("Water and home heating's wear and tear must be a single string!"),
      condition: isRequiredString("Water and home heating's condition must be a string!"),
      notes: isRequiredString("Water and home heating's notes must be a string!")
    })
  ),
  keys: yup.array().of(
    yup.object({
      keyType: isRequiredString("Key type must be a string!"),
      number: isNumber("Key number must be a number!"),
      given: isBoolean("Key status either true or false(given or not)!"),
      date: isRequiredString("Key givin date must be a string!"),
      comments: isRequiredString("Key comments must be a string!")
    })
  ),
  otherItems: yup.array().of(
    yup.object({
      equipments: isRequiredString("Equipment name of other item must be a string!"),
      description: isRequiredString("Equipment description of other item must be a string!"),
      wearAndTear: isRequiredString("Wear and tear of other item must be a single string!"),
      condition: isRequiredString("Condition must of other item be a string!"),
      comments: isRequiredString("Comments must of other item be a string!")
    })
  ),
  rooms: yup.array().of(inventoryRoomValidation),
  notes: isString("Notes must be a string!"),
  signature: yup.array().of(
    yup.object({
      name: isRequiredString("Signature name must be a string!"),
      image: isRequiredString("Signature image must be a string!")
    })
  )
})