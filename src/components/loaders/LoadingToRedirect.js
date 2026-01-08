import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BasicHeader from 'components/layout/headers/BasicHeader';

const LoadingToRedirect = ({path="/", messageToDisplay="", time=5}) => {
    const [count, setCount] = useState(time);
    let history = useHistory();
    let url = undefined
    try {
        url = new URL(path)
    } catch (error) {
        // console.log("Not a valid url")
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000);
        // redirect once count is equal to 0
        if(count === 0) {
            // if(url && url.origin !== window.location.origin) {
                if(url) {
                window.location.assign(url)
            } else {
                history.push(path)
            }   
        }
        // cleanup
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    return (
        <>
        <BasicHeader />
        <div className="container p-5 text-center" 
        style={{marginTop: "100px"}}>
           {messageToDisplay}
           <p>Redirecting you to next page in {count} seconds</p>
        </div>
        </>
    );
};

export default LoadingToRedirect;
