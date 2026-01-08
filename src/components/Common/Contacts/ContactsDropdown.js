import React, { useEffect, useState, useContext } from "react";
import { Select } from "antd";
import { useLazyQuery } from "react-apollo";
import contactQueries from "../../../config/queries/contacts";
// import AddContact from "../AddContact";
import AddContact from "components/Common/Contacts/AddContact";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import get from "lodash/get";

const ContactsDropdown = ({
  contacts = [],
  onContactUpdate,
  beingRenderedFrom = "",
}) => {
  const [executeQuery, { loading }] = useLazyQuery(
    contactQueries.getContactList,
    {
      onCompleted: ({ getContactList }) => {
        if (get(getContactList, "success", false)) {
          setContacts(getContactList.data);
        }
      },
    }
  );
  // const [openAddContactModal, setOpenModal] = useState(false);
  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);
  const { openAddContactModal } = interfaceState;
  const [contactsData, setContacts] = useState([]);

  useEffect(() => {
    let filter = {};
    if (beingRenderedFrom) {
      filter = {
        filterString: JSON.stringify({
          receiverRole: ["renter", "landlord"],
        }),
      };
    }
    executeQuery({ variables: { ...filter } });

    //eslint-disable-next-line
  }, []);

  const handleChange = (items) => {
    // console.log(items)
    if (items.includes("addContact")) {
      interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" });
    } else {
      onContactUpdate(items);
    }
  };

  const filteredOptions = contactsData.filter((o) => !contacts.includes(o));

  return (
    <div className="d-flex">
      <Select
        mode="multiple"
        placeholder="Choose contacts!"
        value={contacts}
        loading={loading}
        onChange={handleChange}
        style={{ width: "100%", marginRight: "10px" }}
        allowClear
        maxTagCount={"responsive"}
      >
        <Select.Option
          style={{ fontWeight: "bold" }}
          key={"add_contact"}
          value={"addContact"}
        >
          + Add New Contact
        </Select.Option>
        {filteredOptions.map((item) => (
          <Select.Option key={item.contactId} value={item.contactId}>
            {`${item.firstName} ${item.lastName}`}
          </Select.Option>
        ))}
      </Select>
      {openAddContactModal && (
        <AddContact setContacts={(val) => setContacts(val)} />
      )}
    </div>
  );
};

export default ContactsDropdown;
