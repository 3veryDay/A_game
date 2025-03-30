import { useState } from "react";
import './Login.css'; // Path to your CSS file
//rest of your code
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
            const response = await fetch("http://localhost:8080/users/login",{
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
            setMessage("Please check your username or password");
            
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

        <div className = "login-container">
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
                    {message && <div className="message">{message}</div>}

                </div>

                <button type = "submit">
                    Login
                </button>
                
            </form>
            
            ) : ( 


                //everything to render profile
                <div className="profile-container">
                    <h3>User Profile</h3>
                    <p>Username : {profile.username}</p>
                    <p>Role : {profile.roles.join(", ")}</p>
                    <div className = "message">Message : {profile.message}</div>
                </div>
            )}
            

        </div>
    );
}

export default Login;