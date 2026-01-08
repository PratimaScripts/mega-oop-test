import React from "react"

const AppLoader = () => {
    return (
      <div className={"loaderStyling"}>
        <img
          width="100"
          className="logo__img--loader"
          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/v1631209662/images/LOGO_COLOR_2.png"
          alt="Please wait while we load ROC!"
        />
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      </div>
    );
}

export default AppLoader;