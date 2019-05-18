import React, { useState } from "react";

const Visibility = (props) => {
    function handleVisibilityChange() {
        if (document.hidden) {
            console.log("Someone is cheating")
            // this.setState({ curChoice: '' }) 
            // console.log(curChoice);
            // call the handlesubmit function and set curChoice as ""
            
        } else {
            console.log("Everything is good, no calls")
        }
    }

    React.useEffect(() => {
        console.log('hey is this working')
        document.addEventListener('visibilitychange', handleVisibilityChange, false);
        return () => document.removeEventListener('visibility')
        
    }, [])

    return null;
    
}

export default Visibility;