import React from "react";
import moment from "moment";
import {
  Document,
  View,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import SectionB from "./section-b.json";
import SectionC from "./section-c.json";

Font.register({
  family: "'Roboto', sans-serif !important",
  fontWeight: "bold",
});

const dateFormat = "DD-MM-YYYY";

const breakEmailWords = (text) => {
  const string = String(text);
  return string.length > 15 ? string.split("@").join("\n@") : string;
};

const SignatureHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={styles.tableText}>Signature</Text>
    <Text style={styles.tableText}>Printed Name</Text>
    <Text style={styles.tableText}>Date signed</Text>
    <Text style={styles.tableText}>Signed link by email</Text>
    <Text style={styles.tableText}>IP address</Text>
  </View>
);

const SignatureRow = ({ item }) => (
  <View style={styles.tableRow} key={item.email}>
    {!item.imageUrl ? (
      <Text style={styles.tableText}>
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
    <Text style={styles.tableText}>{item.name}</Text>
    <Text style={styles.tableText}>
      {item.signedOn ? moment(item.signedOn).format(dateFormat) : "Not signed"}
    </Text>
    <Text style={styles.tableText}>{breakEmailWords(item.email)}</Text>
    <Text style={styles.tableText}>{item.ipAddress || "-"}</Text>
  </View>
);

const PDF = ({ agreement }) => {
  const tenantSignatures = agreement.signatures.filter(
    (item) => item.signeeType === "tenant"
  );

  const landlordSignatures = agreement.signatures.filter(
    (item) => item.signeeType === "landlord"
  );
  // console.log(agreement);
  return (
    <Document
      creator="Powered by RentOnCloud"
      producer="Powered by RentOnCloud"
      title="Agreement Details"
    >
      <Page wrap={false} style={styles.page}>
        <Text style={styles.title}>ASSURED SHORTHOLD TENANCY AGREEMENT</Text>
        <Text style={styles.boldText}>
          This Agreement is dated&nbsp;
          <Text style={styles.text}>
            {moment(agreement.duration.start).format(dateFormat)}
          </Text>
        </Text>
        <Text style={styles.text}>
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
        <Text style={styles.sectionHeader}>
          Section A - Summary of Core Terms
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Property</Text>
            <Text style={styles.tableRowDescription}>
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
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Landlord</Text>
            <Text style={styles.tableRowDescription}>
              {`${agreement.landlordData.firstName} ${agreement.landlordData.lastName}\n`}
              {`${agreement.landlordData.email}\n`}
              {`${agreement.landlordData.address.fullAddress}\n`}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Tenant</Text>

            {agreement.contacts.length && (
              <Text style={styles.tableRowDescription}>
                {agreement.contacts.map(
                  (contact) =>
                    `${contact.userDetails.firstName} ${contact.userDetails.lastName}, `
                )}
                {"\n"}
                {agreement.contacts.map(
                  (contact) => `${contact.userDetails.email}, `
                )}
                {"\n"}
                {`${agreement?.contacts[0]?.userDetails?.address?.fullAddress}`}
              </Text>
            )}
          </View>

          {agreement.guarantors.length > 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableRowTitle}>Guarantor</Text>
              <Text style={styles.tableRowDescription}>
                {agreement.guarantors.map((item, i) => (
                  <Text key={`guarantor-item-${i}`} style={styles.text}>
                    {item.name},&nbsp;
                  </Text>
                ))}
              </Text>
            </View>
          ) : null}

          {agreement.exclusions ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableRowTitle}>
                Exclusions from the Let Property
              </Text>
              <Text style={styles.tableRowDescription}>
                {agreement.exclusions}
              </Text>
            </View>
          ) : null}

          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Maximum Occupancy</Text>
            <Text style={styles.tableRowDescription}>
              {agreement.occupation.adults} Adults, {agreement.occupation.kids}{" "}
              Kids and {agreement.occupation.pets} Pets
              {"\n"}
              <Text style={styles.text}>
                Nobody else is allowed to live in the Property without the
                Landlord’s written permission.
              </Text>
              {"\n"}
              {agreement.occupation.occupantNames.length
                ? "Name of occupants: "
                : ""}
              {agreement.occupation.occupantNames.join(", ")}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Term</Text>
            <Text style={styles.tableRowDescription}>
              An initial fixed term of {agreement.duration.humanReadableFormat}{" "}
              Commencing on and including{" "}
              {moment(agreement.duration.start).format(dateFormat)} Ending to
              and including {moment(agreement.duration.end).format(dateFormat)}{" "}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Rent</Text>
            <Text style={styles.tableRowDescription}>
              £ {agreement.renterTransaction.rate} per{" "}
              {agreement.renterTransaction.paymentScheduleType} payable in advance. The
              first rent payment or proportionate part is to be made on the
              signing of this agreement. Rental Payment due in cleared fund
              starts from{" "}
              {moment(agreement.renterTransaction.paymentStartDate).format(
                dateFormat
              )}{" "}
              and subsequent following each{" "}
              {agreement.renterTransaction.paymentScheduleType}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Deposit</Text>
            <Text style={styles.tableRowDescription}>
              {agreement.renterTransaction.deposit.hasSecurityDeposit
                ? `£ ${agreement.renterTransaction.deposit.amount} is paid by the Tenant to the Landlord/Agent on or before the signing of this agreement. The Landlord/Agent will protect with a government approved deposit ${agreement.renterTransaction.deposit.type} scheme, will supply the Tenants with tenancy deposit prescribed information within 30 days of receipt.`
                : "Security Deposit amount is not required by Landlord."}
              {"\n\n"}
              {agreement.renterTransaction.information}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTitle}>Right to Rent</Text>
            <Text style={styles.tableRowDescription}>
              It is a condition of this tenancy that the Tenant and anyone
              living in the Property must have a ‘right to rent’ as set out in
              Section 22 of the Immigration Act 2014.
            </Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Section B - Definitions</Text>
        {SectionB.data.map((item, i) => (
          <Text style={styles.text} key={`section-b-${i}`}>
            {item}
          </Text>
        ))}
        <Text style={styles.sectionHeader}>
          Section C – Terms and Conditions
        </Text>
        {SectionC.data.map((item, i) => (
          <View key={`section-c-${i}`}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.details.map((subItem, index) => (
              <View key={`section-c-sub-${index}`}>
                {subItem.subtitle ? (
                  <Text style={styles.sectionSubTitle}>{subItem.subtitle}</Text>
                ) : null}
                <Text style={styles.text}>{subItem.description}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.sectionHeader}>
          Section D – Special clauses individually negotiated by the parties
        </Text>
        <View>
          <Text style={styles.text}>
            This Agreement shall be effective and legally binding when signed
            below. Photocopy, facsimile, electronic or other copies shall have
            the same effect for all purposes as well as or in absence of an
            ink-signed original.
          </Text>
          <Text style={styles.text}>{agreement.additionalInfo}</Text>
          <Text style={styles.text}>{agreement.exclusions}</Text>
        </View>
        <Text style={styles.sectionHeader}>
          Section E – Contact details of all parties
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableText}>Parties</Text>
            <Text style={styles.tableText}>Full Name</Text>
            <Text style={styles.tableText}>Email</Text>
            <Text style={styles.tableText}>Phone number</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableText}>Landlord</Text>
            <Text
              style={styles.tableText}
            >{`${agreement.landlordData.firstName} ${agreement.landlordData.lastName}`}</Text>
            <Text style={styles.tableText}>{agreement.landlordData.email}</Text>
            <Text style={styles.tableText}>
              {agreement.landlordData.phoneNumber}
            </Text>
          </View>

          {agreement.contacts.map((contact) => (
            <View style={styles.tableRow} key={contact.phoneNumber}>
              <Text style={styles.tableText}>Tenant</Text>
              <Text
                style={styles.tableText}
              >{`${contact.userDetails.firstName} ${contact.userDetails.lastName}`}</Text>
              <Text style={styles.tableText}>{contact.userDetails.email}</Text>
              <Text style={styles.tableText}>
                {contact.userDetails.phoneNumber}
              </Text>
            </View>
          ))}

          {agreement.guarantors.map((item) => (
            <View style={styles.tableRow} key={item.name}>
              <Text style={styles.tableText}>Guarantor</Text>
              <Text style={styles.tableText}>{item.name}</Text>
              <Text style={styles.tableText}>{item.email}</Text>
              <Text style={styles.tableText}>{item.mobile}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionHeader}>
          Section F – SIGNATURES of the PARTIES
        </Text>
        <Text style={styles.text}>Commented Views below about signing</Text>

        <View>
          <Text style={styles.boldText}>
            You are about to sign an Assured Shorthold Tenancy for the following
            property:
          </Text>
          <Text style={styles.text}>
            {agreement.propertyId.address.addressLine1}{" "}
            {agreement.propertyId.address.city}{" "}
            {agreement.propertyId.address.state}{" "}
            {agreement.propertyId.address.zip},{" "}
            {agreement.propertyId.address.country}
          </Text>
          <Text style={styles.smallText}>
            By signing this agreement all parties have agreed to adhere to their
            obligations as mentioned in this agreement and the special clauses
            individually negotiated between the parties as set in section. Once
            signed electronically and dated this agreement will be legally
            binding and may be enforced by a court. Make sure that it does not
            contain terms that you do not agree with and that it contains
            everything you want to form part of the agreement. Both parties are
            advised to obtain confirmation in writing when the Landlord gives
            the Tenant consent to carry out any action under this agreement.
          </Text>
          <Text style={styles.boldText}>
            If you are in any doubt about the content or effect of this
            agreement, we recommend that you seek independent legal advice
            before signing.
          </Text>
        </View>

        <Text style={styles.boldText}>Signed as an Agreement</Text>

        {landlordSignatures.length !== 0 && (
          <View>
            <Text style={styles.boldText}>Between the Landlord</Text>
            <View style={styles.table}>
              <SignatureHeader />
              {landlordSignatures.map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </View>
          </View>
        )}

        {tenantSignatures.length !== 0 && (
          <View>
            <Text style={styles.boldText}>And the Tenant, or the Tenants</Text>
            <View style={styles.table}>
              <SignatureHeader />
              {tenantSignatures.map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </View>
          </View>
        )}

        {agreement.guarantors.length > 0 && (
          <View>
            <Text style={styles.boldText}>The Guarantors</Text>
            <View style={styles.table}>
              <SignatureHeader />
              {[
                ...agreement.signatures.filter(
                  (item) => item.signeeType === "guarantor"
                ),
              ].map((item) => (
                <SignatureRow item={item} key={item.email} />
              ))}
            </View>
          </View>
        )}
        <Text
          style={styles.footerPageNo}
          fixed
          render={({ pageNumber }) => `Page | ${pageNumber}`}
        />
        <Text
          style={styles.footerWatermark}
          fixed
          render={() => `Powered by RentOnCloud`}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  footerPageNo: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 50,
    right: 0,
    textAlign: "left",
    color: "grey",
  },
  footerWatermark: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 50,
    textAlign: "right",
    color: "grey",
  },
  page: { padding: "40px 50px" },
  title: {
    width: "100%",
    margin: "auto",
    fontSize: "18px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  tableRowDescription: {
    fontSize: "11px",
    padding: "5px",
    width: "70%",
  },
  tableRowTitle: {
    fontSize: "12px",
    width: "30%",
    padding: "5px",
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    margin: 0,
    padding: "0 10px",
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fafafa",
    fontSize: "15px",
    borderRadius: "2px",
    padding: "0 10px",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    margin: "5px 0",
    color: "#000000",
    fontWeight: "bold",
  },
  tableText: {
    flex: 1,
    margin: 10,
    fontSize: "10px",
    flexWrap: "wrap",
    textAlign: "left",
    // display: "flex",
    // flexDirection: "row",
    // wordWrap: "break-word",
    // whiteSpace: "nowrap"
  },
  table: { display: "table", width: "100%" },
  text: {
    fontSize: "10px",
    flexWrap: "wrap",
    margin: "10px 0",
    textAlign: "left",
  },
  smallText: {
    fontSize: "8px",
    flexWrap: "wrap",
    margin: "10px 0",
  },
  boldText: {
    fontSize: "10px",
    fontWeight: "bold",
    margin: "5px 0",
  },
  sectionSubTitle: {
    fontSize: "10px",
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: "14px",
    fontWeight: "700",
    margin: "20px 0",
  },
});

export default PDF;
