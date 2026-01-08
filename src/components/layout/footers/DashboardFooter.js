import React from "react";

const DashboardFooter = () => {

    const footerSpace = window.screen.width > 2048 ? true : false

    const currentYear = new Date().getFullYear()


    const fspace = footerSpace
        ? "footer__txt--center footer__txt--padding_s"
        : "footer__txt--center";

    const footerClass =
        window.location.pathname === "/login" ||
            window.location.pathname.includes("auth") ||
            window.location.pathname.includes("reference") ||
            window.location.pathname === "/"
            ? "footer__txt--center"
            : fspace;

    return (
        <p className={footerClass}>
            Copyright ©{currentYear} RentOnCloud. All rights reserved. Beta 1.0 |{" "}
            <a
                rel="noopener noreferrer"
                href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
                target="_blank"
            >
                Terms
              </a>{" "}
              |&nbsp;
            <a
                rel="noopener noreferrer"
                href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`}
                target="_blank"
            >
                Privacy
              </a>
        </p>
    )
}

export default DashboardFooter;