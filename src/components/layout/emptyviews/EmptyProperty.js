import React from "react"
import { Button, Result } from "antd"
import { useHistory } from "react-router"
import "./styles.scss"

const EmptyProperty = (props) => {
    const history = useHistory()
    return (
        <Result
         status="404"
         title="No property found right now"
         subTitle=""
         extra={<Button className="btn-new" type="primary" onClick={() => history.push("/landlord/property/add")} >{" "}+ New Property</Button>}                           />
    )
}

export default EmptyProperty