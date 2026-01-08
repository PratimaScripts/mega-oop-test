import React from "react";
import styled from "@react-pdf/styled-components";
import moment from "moment";
import { Document, Image } from "@react-pdf/renderer";

import RoomIndicatorImage from "../../../../../../img/room-indicator.jpg";

const Page = styled.Page`
  padding: 40px;
`;

const PageView = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.Text`
  width: 100%;
  margin: 0 auto;
  font-size: 25px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const CreatedAtDate = styled.Text`
  width: 100%;
  font-size: 10px;
  font-weight: 500;
  margin: 10px 0;
`;

const AddressWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
`;

const Table = styled.View`
  display: table;
  width: 100%;
  margin: 10px 0;
`;

const TableRow = styled.View`
  width: 100%;
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
`;

const TableTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  width: 100%;
`;

const TableHeader = styled(TableRow)`
  justify-content: space-between;
  width: 100%;
  background-color: #fafafa;
  font-size: 15px;
  border-radius: 2px;
  color: #000000;
  font-weight: bold;
`;

const Text = styled.Text`
  font-size: 10px;
  flex-wrap: wrap;
`;
// text-align: "left";

const SmallTitle = styled.Text`
  width: 100%;
  font-size: 16px;
  margin: 5px 0;
`;

const RoomView = styled.View`
  margin: 10px auto;
  width: 100%;
`;

const RoomHead = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 0;
  width: 100%;
`;

const RoomCommentsWrapper = styled.View`
  margin: 5px 0;
  width: 100%;
`;

const RoomImagesWrapper = styled.View`
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const RoomImage = styled.View`
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const View = styled.View`
  padding: 5px;
`;

const Room = ({ room }) => (
  <RoomView>
    <RoomHead>
      <Image
        style={{ width: 150, height: 150, objectFit: "contain" }}
        source={RoomIndicatorImage}
      />
      <View>
        <Text>
          For each room and for each equipment, precise the nature, the wear
          state and its functioning.
        </Text>
        <Text>
          Example:
          {
            "<<New>>, <<In good condition>>, <<working order>>, <<out of order>>"
          }
          .
        </Text>
        <Text>
          The image indicates the position of the walls(N-north, E-east,
          S-south, W-west)
        </Text>
      </View>
    </RoomHead>
    <RoomCommentsWrapper>
      <SmallTitle>Comments:</SmallTitle>
      <Text>{room.comments}</Text>
    </RoomCommentsWrapper>

    {room.equipments.length > 0 && (
      <Table>
        <TableHeader>
          {[
            "Equipment(s)",
            "Description",
            "Wear & tear",
            "Condition",
            "Comments",
          ].map((item) => (
            <Text key={`table-header-${item}`}>{item}</Text>
          ))}
        </TableHeader>
        {room.equipments.map((item, index) => (
          <TableRow key={`table-data-${index}`}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.wearAndTear}</Text>
            <Text>{item.condition}</Text>
            <Text>{item.comments}</Text>
          </TableRow>
        ))}
      </Table>
    )}

    {room.wallsCeilingFloor.length > 0 && (
      <Table>
        <TableHeader>
          {["Wall", "Description", "Wear & tear", "Comments"].map((item) => (
            <Text key={`table-header-${item}`}>{item}</Text>
          ))}
        </TableHeader>
        {room.wallsCeilingFloor.map((item, index) => (
          <TableRow key={`table-data-${index}`}>
            <Text>{item.item}</Text>
            <Text>{item.description}</Text>
            <Text>{item.wearAndTear}</Text>
            <Text>{item.comments}</Text>
          </TableRow>
        ))}
      </Table>
    )}
    <RoomImagesWrapper>
      {room.images.map((image) => (
        <RoomImage>
          <Image
            src={image.url}
            style={{ width: 150, height: 150, objectFit: "contain" }}
          />
          <Text>{image.name}</Text>
        </RoomImage>
      ))}
    </RoomImagesWrapper>
  </RoomView>
);

const SignatureHeader = () => (
  <TableHeader>
    <Text>Signee</Text>
    <Text>Signature</Text>
    <Text>Printed Name</Text>
    <Text>Date signed</Text>
    <Text>Signed link by email</Text>
    <Text>IP address</Text>
  </TableHeader>
);

const SignatureRow = ({ item }) => (
  <TableRow key={item.email}>
    <Text>{item.signeeType}</Text>
    {!item.imageUrl ? (
      <Text>
        {item.typedName} ({item.signatureType})
      </Text>
    ) : (
      <Image
        src={item.imageUrl}
        style={{
          width: 100,
          height: 100,
          objectFit: "contain",
          backgroundColor: "#fafafa",
        }}
      />
    )}
    <Text>{item.name}</Text>
    <Text>
      {item.signedOn
        ? moment(item.signedOn).format("DD/MM/YYYY")
        : "Not signed"}
    </Text>
    <Text>{item.email}</Text>
    <Text>{item.ipAddress}</Text>
  </TableRow>
);

const InventoryPDF = ({ inventory }) => {
  // console.log(inventory);

  return (
    <Document>
      <Page>
        <PageView>
          <Title>Inventory {inventory.inventoryType}</Title>
          <CreatedAtDate>
            {moment(inventory.createdAt).format("YYYY-MM-DD")}
          </CreatedAtDate>
          <AddressWrapper>
            <Text>Property address</Text>
            <Text>{inventory?.agreementData?.propertyAddress}</Text>
          </AddressWrapper>
          <AddressWrapper>
            <Text>Landlord</Text>
            <Text>{inventory?.agreementData?.tenants?.[0] ?? ''}</Text>
          </AddressWrapper>
          <AddressWrapper>
            <Text>Tenant(s)</Text>
            {inventory?.agreementData?.tenants.length ?
              inventory?.agreementData?.tenants.map(ten => {
                return <Text>{`${ten}${inventory?.agreementData?.tenants.length > 1 ? ', ' : ''}`}</Text>
              })
              : ''}
          </AddressWrapper>

          {inventory.meterReading.length > 0 && (
            <>
              <TableTitle>Meter Readings (water, gas, etc.)</TableTitle>
              <Table>
                <TableHeader>
                  {[
                    "Type of meter",
                    "Serial No",
                    "M3",
                    "Condition",
                    "Notes",
                  ].map((item) => (
                    <Text key={`table-header-${item}`}>{item}</Text>
                  ))}
                </TableHeader>
                {inventory.meterReading.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.typeOfMeter}</Text>
                    <Text>{item.serialNo}</Text>
                    <Text>{item.m3}</Text>
                    <Text>{item.condition}</Text>
                    <Text>{item.notes}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          {inventory.electricityMeterReading.length > 0 && (
            <>
              <TableTitle>Electricity Meter Reading</TableTitle>
              <Table>
                <TableHeader>
                  {[
                    "Type of meter",
                    "Serial No",
                    "Kwh",
                    "Condition",
                    "Notes",
                  ].map((item) => (
                    <Text key={`table-header-${item}`}>{item}</Text>
                  ))}
                </TableHeader>
                {inventory.electricityMeterReading.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.typeOfMeter}</Text>
                    <Text>{item.serialNo}</Text>
                    <Text>{item.kwh}</Text>
                    <Text>{item.condition}</Text>
                    <Text>{item.notes}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          {inventory.heatingSystem.length > 0 && (
            <>
              <TableTitle>Heating system</TableTitle>
              <Table>
                <TableHeader>
                  {[
                    "Type of meter",
                    "Serial No",
                    "m3",
                    "Condition",
                    "Notes",
                  ].map((item) => (
                    <Text key={`table-header-${item}`}>{item}</Text>
                  ))}
                </TableHeader>
                {inventory.heatingSystem.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.typeOfMeter}</Text>
                    <Text>{item.serialNo}</Text>
                    <Text>{item.m3}</Text>
                    <Text>{item.condition}</Text>
                    <Text>{item.notes}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          {inventory.waterAndHomeHeating.length > 0 && (
            <>
              <TableTitle>Water And Home Heating</TableTitle>
              <Table>
                <TableHeader>
                  {["Product type", "Wear & Tear", "Condition", "Notes"].map(
                    (item) => (
                      <Text key={`table-header-${item}`}>{item}</Text>
                    )
                  )}
                </TableHeader>
                {inventory.waterAndHomeHeating.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.productType}</Text>
                    <Text>{item.wearAndTear}</Text>
                    <Text>{item.condition}</Text>
                    <Text>{item.notes}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          {inventory.waterAndHomeHeating.length > 0 && (
            <>
              <TableTitle>Keys</TableTitle>
              <Table>
                <TableHeader>
                  {["Key type", "Number", "Given", "Date", "Notes"].map(
                    (item) => (
                      <Text key={`table-header-${item}`}>{item}</Text>
                    )
                  )}
                </TableHeader>
                {inventory.waterAndHomeHeating.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.keyType}</Text>
                    <Text>{item.number}</Text>
                    <Text>{item.given}</Text>
                    <Text>{item.date}</Text>
                    <Text>{item.comments}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          {inventory.otherItems.length > 0 && (
            <>
              <TableTitle>Other items</TableTitle>
              <Table>
                <TableHeader>
                  {[
                    "Equipments",
                    "Description",
                    "Wear & tear",
                    "Condition",
                    "Comments",
                  ].map((item) => (
                    <Text key={`table-header-${item}`}>{item}</Text>
                  ))}
                </TableHeader>
                {inventory.otherItems.map((item, index) => (
                  <TableRow key={`table-data-${index}`}>
                    <Text>{item.equipments}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.wearAndTear}</Text>
                    <Text>{item.condition}</Text>
                    <Text>{item.comments}</Text>
                  </TableRow>
                ))}
              </Table>
            </>
          )}

          <SmallTitle>Property description</SmallTitle>

          {inventory.rooms.map((room, index) => (
            <Room room={room} key={`room-${index}`} />
          ))}

          <SmallTitle>Observation</SmallTitle>
          <Text>{inventory.notes}</Text>

          <SmallTitle>Signature</SmallTitle>

          <Table>
            <SignatureHeader />
            {inventory.signatures.map((item) => (

              <SignatureRow item={item} key={item.email} />

            ))}
          </Table>
        </PageView>
      </Page>
    </Document>
  );
};

export default InventoryPDF;
