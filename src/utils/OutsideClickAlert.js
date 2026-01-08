import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, functionToRun) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && Object.values(event.target.classList).indexOf("fa-bars") !== 1) {
        //   console.log(event.target)
        // alert("You clicked outside of me!");
        if(functionToRun !== undefined && typeof(functionToRun) === "function") {
            functionToRun()
        } 
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //eslint-disable-next-line
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.functionToRun);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
  functionToRun: PropTypes.func.isRequired
};

export default OutsideAlerter;
