import React, { useRef, useState } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import { UserOutlined, PhoneOutlined, MailOutlined, LoadingOutlined } from "@ant-design/icons";
import showNotification from 'config/Notification';



const ComingSoon = props => {
  const emailForm = useRef(null);
  const [loading, setLoading] = useState(false)

  const formSubmit = event => {
    event.preventDefault();
    setLoading(true)

    const form = event.target;

    const data = {
      name: form.name.value,
      number: form.number.value,
      email: form.email.value,
      message: form.message.value,
      demo: form.demo.checked,
      brandPartner: form.brandPartner.checked,
      investment: form.investment.checked,
      earlyAdoption: form.earlyAdoption.checked
    };

    axios
      .post("https://formcarry.com/s/alnnXoXLAtg", data, {
        headers: { Accept: "application/json" }
      })
      .then(function(response) {
          setLoading(false)
        if (response?.data?.status ==="success") {
            showNotification("success", "Your message has been sent", "")
        } else {
        //   console.log(response.data.message);
        showNotification("error", "Couldn't able to send message", "")

        }
        // props.hide();
      })
      .catch(function(error) {
          setLoading(false)
        // alert(error);
        // props.hide();
        showNotification("error", "Couldn't able to send message", "")
      });
  };

  return (
    
      <>
        <h3 className="modal-title">COMING SOON</h3>
        <div className="container">
        <p className="text-center" style={{ fontSize: "14px" }}>
          We are working smart to launch this featiure! Join waitlist to know as soon as we launch this feature?{" "}
        </p>

        <form ref={emailForm} onSubmit={formSubmit} disabled={loading}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i>
                    <UserOutlined />
                  </i>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
                name="name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i>
                    <PhoneOutlined />
                  </i>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Contact Number"
                name="number"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i>
                    <MailOutlined />
                  </i>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Your Email ID"
                name="email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Message"
              rows={3}
              defaultValue={""}
              name="message"
            />
          </div>
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                name="demo"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Demo
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck2"
                name="brandPartner"
              />
              <label className="custom-control-label" htmlFor="customCheck2">
                Brand Partner
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck3"
                name="investment"
              />
              <label className="custom-control-label" htmlFor="customCheck3">
                Investment
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck4"
                name="earlyAdoption"
              />
              <label className="custom-control-label" htmlFor="customCheck4">
                Early adoption
              </label>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
             {loading ? <LoadingOutlined /> : "Keep in touch"} 
            </button>
          </div>
        </form>
        <p style={{ fontSize: "12px" }}>
          By submitting above details, your agree to our{" "}
          <a href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`} target="_blank" rel="noreferrer">Terms</a>
         
          &amp;{" "}
          <a href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`} target="_blank" rel="noreferrer">Privacy</a>
         
        </p>
        </div>
        </>
  );
};

export default ComingSoon;
