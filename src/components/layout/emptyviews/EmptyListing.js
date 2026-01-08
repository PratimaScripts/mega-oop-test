import React from "react"
import { Button, Result } from "antd"
import { useHistory } from "react-router"
import "./styles.scss"

const EmptyListing = (props) => {
    const history = useHistory()
    return (
        <Result
         status="404"
         title="No lisiting found right now"
         subTitle=""
         extra={<Button className="btn-new" type="primary" onClick={() => history.push("/landlord/listings/add")} >{" "}+ New Listing</Button>}                           />
    )
}

export default EmptyListing;