import React from "react";

const Visibility = (props) => {
    console.log("Props in visibility" , props)
    function handleVisibilityChange() {
        if (document.hidden) {
            console.log("Someone is cheating")
            window.location.pathname='/cheater'
            
        } else {
            console.log("Everything is good, no calls")
        }
    }

    React.useEffect(() => {
        console.log('hey is this working')
        document.addEventListener('visibilitychange', handleVisibilityChange, false);
        return () => document.removeEventListener('visibility', handleVisibilityChange)
        
    }, [])

    return null;
    
}

export default Visibility;