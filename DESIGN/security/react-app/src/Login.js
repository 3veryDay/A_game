import { useState } from "react";

const Login = () => {

    //states created
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [jwt, setJwt] = useState("");
    const [profile, setProfile] = useState(null);

    //function
    const handleLogin = async (e) => {
        //don't want default to come here
        e.preventDefault();
        try {
            //until fetch request is complete - fetch(url)
            const response = await fetch("http://localhost:8080/signin",{
            method : "POST" ,
            headers : {
                "Content-Type" : "application/json",

            },
            body : JSON.stringify({username, password}),
        }
        );
        
        if (response.ok) {
            //pass json body of the response
            const data = await response.json();
            console.log(data);
            setJwt(data.jwtToken);
            setMessage("Login Successful");
            fetchUserProfile(data.jwtToken);
        }else {
            setMessage("login failed, check credentials");
            
        }

        }catch(error) {
            console.log("Error : " + error );
            setMessage("An error occured. plz try again.");
        }
        

    };


//function
const fetchUserProfile = async (token) => {
    try {
        const response = await fetch("http://localhost:8080/profile",{
        method : "GET" ,
        headers : {
            //need authentication
            "Authorization" : `Bearer ${token}`, 

        },
    }
    );
    
    if (response.ok) {
        //pass json body of the response
        const data = await response.json();
        console.log(data);
        setProfile(data)
    }else {
        setMessage("failed to fetch the profile")
        
    }

    }catch(error) {
        console.log("Error : " + error );
        setMessage("An error occured. plz try again.")
    }
    

};



    return (

        <div>
            {!profile ?(
            <form onSubmit = {handleLogin} >
                <div>
                    <label>Username : </label>
                    <input
                    type = "text"
                    value = {username}
                    //event handler, change in input box,
                    //  change username right away (recorded in state)
                    onChange = {(e) => setUsername(e.target.value)} />

                </div>
                <div>
                    <label>Password : </label>
                    <input
                    type = "password"
                    value = {password}
                    //event handler, change in input box,
                    //  change username right away (recorded in state)
                    onChange = {(e) => setPassword(e.target.value)} />

                </div>

                <button type = "submit">
                    Login
                </button>
                
            </form>
            
            ) : ( 


                //everything to render profile
                <div>
                    <h3>User Profile</h3>
                    <p>Username : {profile.username}</p>
                    <p>Role : {profile.roles.join(", ")}</p>
                    <p>Message : {profile.message}</p>
                </div>
            )}
            

        </div>
    );
}

export default Login;