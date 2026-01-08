import React from 'react'
import { Row, Col } from "antd";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
const CardElement = ({
    cardErrors,
    setState,
    validZip,
    initialZip
}) => {
    return (
        <>
            <Row>
                <Col span={8}>
                    <CardNumberElement
                        className="cnuminput"
                        onChange={() => {
                            cardErrors !== "" && setState('cardErrors', '');
                        }}
                    />
                </Col>

                <Col offset={1} span={4}>
                    <CardExpiryElement
                        className="cexpinput"
                        onChange={() => cardErrors !== "" && setState('cardErrors', '')}
                    />
                </Col>

                {/* <Row style={{marginTop: "3%"}}> */}
                <Col offset={1} span={3}>
                    <CardCvcElement
                        className="ccsvinput"
                        onChange={() => cardErrors !== "" && setState('cardErrors', '')}
                    />
                </Col>

                <Col offset={1} span={5}>
                    <input
                        placeholder="ZIP"
                        className="czipinput"
                        onChange={(e) => {
                            setState('initialZip', e.target.value)
                        }}
                        style={
                            initialZip !== "" && !validZip
                                ? { border: "1px solid red" }
                                : { border: "1px solid #dfdfdf" }
                        }
                    />
                </Col>
            </Row>
        </>
    )
}
export default CardElement