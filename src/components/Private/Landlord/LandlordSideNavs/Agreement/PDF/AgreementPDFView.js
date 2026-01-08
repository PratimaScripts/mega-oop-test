import React from "react";
import moment from "moment";
import styled from "styled-components";
import SectionB from "./section-b.json";
import SectionC from "./section-c.json";

const dateFormat = "DD-MM-YYYY";

const breakEmailWords = (text) => {
  const string = String(text);
  return string.length > 15 ? string.split("@").join("\n@") : string;
};

const FooterPageNo = styled.div`
  position: absolute;
  font-size: 10px;
  bottom: 20px;
  left: 50px;
  right: 0px;
  text-align: left;
  color: grey;
`;

const FooterWatermark = styled.div`
  position: absolute;
  font-size: 10px;
  bottom: 20px;
  left: 0;
  right: 50px;
  text-align: right;
  color: grey;
`;

const Page = styled.div`
  padding: 30px 30px;
  @media only screen and (max-width: 728px) {
    padding: 10px 10px;
  }
`;

const Title = styled.h2`
  width: 100%;
  margin: auto;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
`;

const TableRowDescription = styled.div`
  font-size: 14px;
  padding: 5px;
  width: 70%;
`;

const TableRowTitle = styled.span`
  font-size: 15px;
  width: 30%;
  padding: 5px;
`;
const TableRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin: 0;
  padding: 0 10px;
`;

const Thead = styled.thead`
  background-color: #fafafa;
  font-size: 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #000000;
  font-weight: bold;
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #fafafa;
  font-size: 15px;
  border-radius: 2px;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin: 5px 0;
  color: #000000;
  font-weight: bold;
`;

const TableText = styled.p`
  display: inline;
  flex: 1;
  margin: 10;
  font-size: 14px;
  flex-wrap: wrap;
  text-align: left;
`;

const Table = styled.div`
  display: table;
  width: 100%;
`;

const Text = styled.p`
  font-size: 14px;
  flex-wrap: wrap;
  margin: 10px 0;
  text-align: left;
`;

const SmallText = styled.p`
  font-size: 12px;
  flex-wrap: wrap;
  margin: 10px 0;
`;

const BoldText = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 5px 0;
`;

const SectionSubTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const SectionHeader = styled.h4`
  font-size: 15px;
  font-weight: 700;
  margin: 20px 0;
`;

const SignatureHeader = () => (
  <TableHeader>
    <TableText>Signature</TableText>
    <TableText>Printed Name</TableText>
    <TableText>Date signed</TableText>
    <TableText>Signed link by email</TableText>
    <TableText>IP address</TableText>
  </TableHeader>
);

const SignatureRow = ({ item }) => (
  <TableRow key={item.email}>
    {!item.imageUrl ? (
      <TableText>
        {item.typedName} ({item.signatureType})
      </TableText>
    ) : (
      <img
        alt="signature"
        src={item.imageUrl}
        style={{
          width: 100,
          height: 100,
          objectFit: "contain",
          backgroundColor: "#fafafa",
        }}
      />
    )}
    <TableText>{item.name}</TableText>
    <TableText>
      {item.signedOn ? moment(item.signedOn).format(dateFormat) : "Not signed"}
    </TableText>
    <TableText>{breakEmailWords(item.email)}</TableText>
    <TableText>{item.ipAddress || "-"}</TableText>
  </TableRow>
);

const AgreementPDFView = ({ agreement }) => {
  const tenantSignatures = agreement.signatures.filter(
    (item) => item.signeeType === "tenant"
  );

  const landlordSignatures = agreement.signatures.filter(
    (item) => item.signeeType === "landlord"
  );

  return (
    <div>
      <Page>
        <Title>ASSURED SHORTHOLD TENANCY AGREEMENT</Title>
        <BoldText style={{ textAlign: "center" }}>
          This Agreement is dated{" "}
          {moment(agreement.duration.start).format(dateFormat)}
        </BoldText>
        <Text>
          This Agreement contains the terms and obligations of the Tenancy. It
          sets out the legally binding obligations that will be placed upon the
          Tenant and the Landlord once the Agreement is dated above. You should
          read this Agreement carefully to ensure you are prepared to agree to
          it all and that it contains everything you require. If you do not
          understand this Agreement, or anything in it, then you should ask for
          an explanation before signing it. Alternatively, you should consider
          consulting a solicitor, Citizen’s Advice, or Housing Advice Centre for
          assistance.
        </Text>
        <SectionHeader>Section A - Summary of Core Terms</SectionHeader>

        <Table>
          <TableRow>
            <TableRowTitle>Property</TableRowTitle>
            <TableRowDescription>
              <Text>
                {agreement.propertyId.address.Label ? (
                  agreement.propertyId.address.Label
                ) : (
                  <>
                    {agreement.propertyId.address.addressLine1}
                    {"\n"}
                    {agreement.propertyId.address.city} {"\n"}
                    {agreement.propertyId.address.state} {"\n"}
                    {agreement.propertyId.address.zip} {"\n"}
                    {agreement.propertyId.address.country}
                  </>
                )}
              </Text>
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Landlord</TableRowTitle>
            <TableRowDescription>
              {`${agreement.landlordData.firstName} ${agreement.landlordData.lastName}`}
              <br />
              {`${agreement.landlordData.email}\n`}
              <br />
              {`${agreement.landlordData.address.fullAddress}\n`}
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Tenant</TableRowTitle>

            {agreement.contacts.length && (
              <TableRowDescription>
                {agreement.contacts.map(
                  (contact) =>
                    `${contact.userDetails.firstName} ${contact.userDetails.lastName}, `
                )}
                <br />
                {agreement.contacts.map(
                  (contact) => `${contact.userDetails.email}, `
                )}
                <br />
                {`${agreement.contacts[0].userDetails.address.fullAddress}`}
              </TableRowDescription>
            )}
          </TableRow>

          {agreement.guarantors.length > 0 ? (
            <TableRow>
              <TableRowTitle>Guarantor</TableRowTitle>
              <TableRowDescription>
                {agreement.guarantors.map((item, i) => (
                  <Text key={`guarantor-item-${i}`}>
                    {item.name} <br />
                  </Text>
                ))}
              </TableRowDescription>
            </TableRow>
          ) : null}

          {agreement.exclusions ? (
            <TableRow>
              <TableRowTitle>Exclusions from the Let Property</TableRowTitle>
              <TableRowDescription>{agreement.exclusions}</TableRowDescription>
            </TableRow>
          ) : null}

          <TableRow>
            <TableRowTitle>Maximum Occupancy</TableRowTitle>
            <TableRowDescription>
              {agreement.occupation.adults} Adults, {agreement.occupation.kids}{" "}
              Kids and {agreement.occupation.pets} Pets
              <br />
              <Text>
                Nobody else is allowed to live in the Property without the
                Landlord’s written permission.
              </Text>
              <br />
              {agreement.occupation.occupantNames.length
                ? "Name of occupants: "
                : ""}
              {agreement.occupation.occupantNames.join(", ")}
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Term</TableRowTitle>
            <TableRowDescription>
              An initial fixed term of {agreement.duration.humanReadableFormat}{" "}
              Commencing on and including{" "}
              {moment(agreement.duration.start).format(dateFormat)} Ending to
              and including {moment(agreement.duration.end).format(dateFormat)}{" "}
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Rent</TableRowTitle>
            <TableRowDescription>
              £ {agreement.renterTransaction.rate} per{" "}
              {agreement.renterTransaction.paymentScheduleType} payable in
              advance. The first rent payment or proportionate part is to be
              made on the signing of this agreement. Rental Payment due in
              cleared fund starts from{" "}
              {moment(agreement.renterTransaction.paymentStartDate).format(
                dateFormat
              )}{" "}
              and subsequent following each{" "}
              {agreement.renterTransaction.paymentScheduleType}
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Deposit</TableRowTitle>
            <TableRowDescription>
              {agreement.renterTransaction.deposit.hasSecurityDeposit
                ? `£ ${agreement.renterTransaction.deposit.amount} is paid by the Tenant to the Landlord/Agent on or before the signing of this agreement. The Landlord/Agent will protect with a government approved deposit ${agreement.renterTransaction.deposit.type} scheme, will supply the Tenants with tenancy deposit prescribed information within 30 days of receipt.`
                : "Security Deposit amount is not required by Landlord"}
              <br />
              <br />
              {agreement.renterTransaction.information}
            </TableRowDescription>
          </TableRow>
          <TableRow>
            <TableRowTitle>Right to Rent</TableRowTitle>
            <TableRowDescription>
              It is a condition of this tenancy that the Tenant and anyone
              living in the Property must have a ‘right to rent’ as set out in
              Section 22 of the Immigration Act 2014.
            </TableRowDescription>
          </TableRow>
        </Table>
        <SectionHeader>Section B - Definitions</SectionHeader>
        {SectionB.data.map((item, i) => (
          <Text key={`section-b-${i}`}>{item}</Text>
        ))}
        <SectionHeader>Section C – Terms and Conditions</SectionHeader>
        {SectionC.data.map((item, i) => (
          <div key={`section-c-${i}`}>
            <SectionTitle>{item.title}</SectionTitle>
            {item.details.map((subItem, index) => (
              <div key={`section-c-sub-${index}`}>
                {subItem.subtitle ? (
                  <SectionSubTitle>{subItem.subtitle}</SectionSubTitle>
                ) : null}
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {subItem.description}
                </Text>
              </div>
            ))}
          </div>
        ))}
        <SectionHeader>
          Section D – Special clauses individually negotiated by the parties
        </SectionHeader>
        <div>
          <Text>
            This Agreement shall be effective and legally binding when signed
            below. Photocopy, facsimile, electronic or other copies shall have
            the same effect for all purposes as well as or in absence of an
            ink-signed original.
          </Text>
          <Text>{agreement.additionalInfo}</Text>
          <Text>{agreement.exclusions}</Text>
        </div>
        <SectionHeader>
          Section E – Contact details of all parties
        </SectionHeader>
        <div class="table-responsive">
          <table class="table table-sm table-borderless">
            <Thead>
              <td>Parties</td>
              <td>Full Name</td>
              <td>Email</td>
              <td>Phone number</td>
            </Thead>
            <tbody>
              <tr>
                <td>Landlord</td>
                <td>{`${agreement.landlordData.firstName} ${agreement.landlordData.lastName}`}</td>
                <td>{agreement.landlordData.email}</td>
                <td>{agreement.landlordData.phoneNumber}</td>
              </tr>

              {agreement.contacts.map((contact) => (
                <tr key={contact.phoneNumber}>
                  <td>Tenant</td>
                  <td>{`${contact.userDetails.firstName} ${contact.userDetails.lastName}`}</td>
                  <td>{contact.userDetails.email}</td>
                  <td>{contact.userDetails.phoneNumber}</td>
                </tr>
              ))}

              {agreement.guarantors.map((item) => (
                <tr key={item.name}>
                  <td>Guarantor</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SectionHeader>Section F – SIGNATURES of the PARTIES</SectionHeader>
        <Text>Commented Views below about signing</Text>

        <div>
          <BoldText>
            You are about to sign an Assured Shorthold Tenancy for the following
            property:
          </BoldText>
          <Text>
            {agreement.propertyId.address.addressLine1}{" "}
            {agreement.propertyId.address.city}{" "}
            {agreement.propertyId.address.state}{" "}
            {agreement.propertyId.address.zip},{" "}
            {agreement.propertyId.address.country}
          </Text>
          <SmallText>
            By signing this agreement all parties have agreed to adhere to their
            obligations as mentioned in this agreement and the special clauses
            individually negotiated between the parties as set in section. Once
            signed electronically and dated this agreement will be legally
            binding and may be enforced by a court. Make sure that it does not
            contain terms that you do not agree with and that it contains
            everything you want to form part of the agreement. Both parties are
            advised to obtain confirmation in writing when the Landlord gives
            the Tenant consent to carry out any action under this agreement.
          </SmallText>
          <BoldText>
            If you are in any doubt about the content or effect of this
            agreement, we recommend that you seek independent legal advice
            before signing.
          </BoldText>
        </div>

        <BoldText>Signed as an Agreement</BoldText>

        {landlordSignatures.length !== 0 && (
          <div>
            <BoldText>Between the Landlord</BoldText>
            <Table>
              <SignatureHeader />
              {landlordSignatures.map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </Table>
          </div>
        )}

        {tenantSignatures.length !== 0 && (
          <div>
            <BoldText>And the Tenant, or the Tenants</BoldText>
            <Table>
              <SignatureHeader />
              {tenantSignatures.map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </Table>
          </div>
        )}

        {agreement.guarantors.length > 0 && (
          <div>
            <BoldText>The Guarantors</BoldText>
            <Table>
              <SignatureHeader />
              {[
                ...agreement.signatures.filter(
                  (item) => item.signeeType === "guarantor"
                ),
              ].map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </Table>
          </div>
        )}
        <FooterPageNo>
          {({ pageNumber }) => `Page | ${pageNumber}`}
        </FooterPageNo>
        <FooterWatermark>Powered by RentOnCloud</FooterWatermark>
      </Page>
    </div>
  );
};

export default AgreementPDFView;
