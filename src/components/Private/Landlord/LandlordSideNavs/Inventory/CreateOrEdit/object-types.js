export const electricityMeter = {
  typeOfMeter: "",
  serialNo: 0,
  kwh: 0,
  condition: "notVerified",
  notes: "",
};

export const key = {
  keyType: "",
  number: 0,
  given: false,
  date: "",
  comments: "",
};

export const meterReading = {
  typeOfMeter: "",
  serialNo: 0,
  m3: 0,
  condition: "notVerified",
  notes: "",
};

export const otherItem = {
  equipments: "",
  description: "",
  wearAndTear: "notVerified",
  condition: "notVerified",
  comments: "",
};

export const heatingMeter = {
  productType: "",
  wearAndTear: "notVerified",
  condition: "notVerified",
  notes: "",
};

export const wallsRow = {
  item: "",
  description: "",
  wearAndTear: "notVerified",
  comments: "",
};

export const equipmentRow = {
  name: "",
  description: "",
  wearAndTear: "notVerified",
  condition: "notVerified",
  comments: "",
};

export const newRoom = {
  name: "New Room",
  wallsCeilingFloor: [wallsRow],
  equipments: [equipmentRow],
  comments: "",
  images: [],
};
