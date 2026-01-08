import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Spin, notification, Select, Alert } from 'antd';

import ContactsQuery from '../../../../../config/queries/contacts';

const ContactSelectList = ({
    placeholder = 'Select Payee',
    className = "w-100",
    size = "large",
    onStateChanged = f => f
}) => {


    const { loading, error, data } = useQuery(ContactsQuery.getContactList);
    if (error) {
        notification['error']({
            message: 'Unable to fetch data',
            description: error,
        });
        return (
            <Alert message="Unable to fetch data, try again!" type="error" />
        )
    }
    // console.log("Contacts data", data);

    return (
        <>
            {loading ? <Spin /> : (data && data.getContactList.success ? (
                <Select
                    placeholder={placeholder}
                    className={className}
                    size={size}
                    onChange={(value) => onStateChanged(value)}
                >
                    { data.getContactList.data.map(contact => (contact.firstName &&
                        <option
                            key={contact.contactId}
                            value={contact.contactId}
                        >
                            {contact.firstName} {contact.lastName}
                        </option>
                    ))}
                </Select>
            ) : <Alert message="Unable to fetch data, try again!" type="error" />)}
        </>
    )
}

export default ContactSelectList;