import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Spin, notification, Select, Alert } from 'antd';

import  PropertiesQuery from '../../../../../config/queries/property';

const PropertySelectList = ({
    placeholder='Select Property',
    className="w-100",
    size="large",
    onStateChanged = f => f
}) => {
    const { loading, error, data:propertyData } = useQuery(PropertiesQuery.fetchProperty);
    if (error) {
        notification['error']({
            message: 'Unable to fetch data',
            description: error,
        });
        return (
            <Alert message="Unable to fetch data" type="error" />
        )
    }
    // console.log("Property select data", propertyData);

    return (
        <>
            {loading ? <Spin /> : propertyData && propertyData.fetchProperty.success ? (
            
            <Select
                placeholder={placeholder}
                className={className}
                size={size}
                onChange={(value) => {onStateChanged(value)}}
                required
            >
                    { propertyData.fetchProperty.data.map(property => ( property.address &&
                        <option 
                            key={property.propertyId}
                            value={property.propertyId}
                        >{property.title}</option>
        )) }
        </Select>
            ) : <Alert message="Unable to fetch data" type="error" />}
        </>
        
    )
}

export default PropertySelectList;