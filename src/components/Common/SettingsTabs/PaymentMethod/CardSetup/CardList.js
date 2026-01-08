import React from "react";
import { Row, Col, Popconfirm } from "antd";
import visaLogo from "../../CommonInfo/image/visa.png";
import masterLogo from "../../CommonInfo/image/master.png";
import {
  EditFilled,
  DeleteFilled,
  CloseOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
const CardList = ({
  showEditCard,
  cards,
  clickedOnEdit,
  cardId,
  visible,
  confirmLoading,
  handleOk,
  handleCancel,
  showPopconfirm,
  closeEditCard,
  setState,
  year,
  month,
  editZipValid,
  updateCard,
  holderName,
  zip,
  loading,
  editSaveBtn,
}) => {
  const singleMonthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const d = new Date();
  const n = d.getFullYear();
  const t = d.getMonth();

  return (
    <div>
      {showEditCard ? (
        <p style={{ fontWeight: "bold", marginBottom: "0" }}>Edit Card</p>
      ) : (
        <p style={{ fontWeight: "bold", marginBottom: "0" }}>Added cards</p>
      )}

      {cards.length === 0 && <p>No cards added</p>}

      {cards.length !== 0 &&
        cards.map((card) => {
          return (
            <div className="form-row">
              <div className="col-md-12 mb-3">
                {!showEditCard && (
                  <div class="card its">
                    <div
                      class="card-body"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <Row>
                        <Col span={3}>
                          {card.card.brand === "visa" && (
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={visaLogo}
                              alt="visalog0"
                            />
                          )}
                          {card.card.brand === "mastercard" && (
                            <img
                              style={{
                                width: "50px",
                                height: "30px",
                                marginTop: "10px",
                              }}
                              src={masterLogo}
                              alt="masterlogo"
                            />
                          )}
                        </Col>
                        <Col span={15}>
                          <p
                            style={{
                              lineHeight: "20px",
                              marginTop: "0%",
                              fontSize: "15px",
                              marginBottom: "0",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bolder",
                                fontSize: "30px",
                                marginTop: "-30%",
                              }}
                            >
                              ....
                            </span>{" "}
                            <span>{card.card.last4}</span>
                          </p>{" "}
                          <p style={{ color: "#6A7486" }}>
                            Expires {card.card.exp_month}/{card.card.exp_year}
                          </p>
                        </Col>
                        <Col offset={2} span={4}>
                          <div style={{ marginTop: "15%" }}>
                            <EditFilled
                              style={{ color: "#4F566B" }}
                              onClick={() => clickedOnEdit(card)}
                            />

                            <Popconfirm
                              key={card.id}
                              title="Are you sure you want to delete the card?"
                              visible={cardId === card.id && visible}
                              onConfirm={() => handleOk(card.id, card.customer)}
                              okButtonProps={{ loading: confirmLoading }}
                              onCancel={handleCancel}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                            >
                              <DeleteFilled
                                style={{
                                  paddingLeft: "10px",
                                  color: "#4F566B",
                                }}
                                onClick={() => showPopconfirm(card)}
                              />
                            </Popconfirm>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}

                {showEditCard && cardId === card.id && (
                  <div class="card its editCardDiv">
                    <CloseOutlined
                      className="editCardClose"
                      onClick={() => closeEditCard(card)}
                    />
                    <div className="ecDiv2">
                      <Row style={{ marginTop: "5%" }}>
                        <Col span={9}>
                          <p className="editCardHead">CARD NUMBER</p>
                          <p
                            style={{
                              lineHeight: "20px",
                              marginTop: "0%",
                              fontSize: "1rem",
                              marginBottom: "0",
                            }}
                          >
                            xxxx-xxxx-xxxx-{card.card.last4}
                          </p>
                        </Col>

                        <Col span={8}>
                          <p className="editCardHead">EXPIRES</p>
                          <Row>
                            <Col span={9}>
                              {singleMonthArr.includes(card.card.exp_month) ? (
                                <input
                                  type="number"
                                  minLength="1"
                                  maxLength="2"
                                  className="cardEditInputMonth"
                                  defaultValue={card.card.exp_month}
                                  onChange={(e) =>
                                    setState("month", e.target.value)
                                  }
                                />
                              ) : (
                                <input
                                  type="number"
                                  minLength="1"
                                  maxLength="2"
                                  className="cardEditInputMonth"
                                  defaultValue={card.card.exp_month}
                                  onChange={(e) =>
                                    setState("month", e.target.value)
                                  }
                                />
                              )}
                            </Col>

                            <Col span={2}>
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "1rem",
                                }}
                              >
                                /
                              </p>
                            </Col>

                            <Col span={12}>
                              <input
                                minLength="4"
                                maxLength="4"
                                type="number"
                                className="cardEditInputYear"
                                defaultValue={card.card.exp_year}
                                onChange={(e) =>
                                  setState("year", e.target.value)
                                }
                              />
                            </Col>
                          </Row>
                          <p className="errorUpdateCard">
                            {((month >= 1) & (month <= 12) &&
                              (year >= n) & (year <= 2090)) ||
                              (year === n) & (month >= t + 1) ? (
                              ""
                            ) : (
                              <i>Invalid expiration date!</i>
                            )}
                          </p>
                        </Col>

                        <Col offset={1} span={6}>
                          <p className="editCardHead">ZIP</p>
                          <input
                            type="text"
                            className="cardEditInputZip"
                            defaultValue={
                              card.billing_details.address.postal_code
                                ? card.billing_details.address.postal_code
                                : "no"
                            }
                            onChange={(e) => setState("zip", e.target.value)}
                          />
                          <p className="errorUpdateCard">
                            {editZipValid ? "" : <i>Invalid ZIP code!</i>}
                          </p>
                        </Col>
                      </Row>
                    </div>

                    <button
                      className="btn btn-primary saveEditCard"
                      type="button"
                      onClick={() => updateCard(card.id, card.customer)}
                      disabled={
                        editSaveBtn ||
                        holderName === "default" ||
                        (card.billing_details.name === holderName) &
                        (card.card.exp_month === month) &
                        (card.card.exp_year === year) &
                        (card.billing_details.address.postal_code === zip) ||
                        holderName === "" ||
                        month < 1 ||
                        month > 12 ||
                        year < n ||
                        year > 2090 ||
                        (!editZipValid && true)
                      }
                    >
                      Save{" "}
                      {loading ? (
                        <LoadingOutlined />
                      ) : (
                        <i className="far fa-save"></i>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default CardList;
