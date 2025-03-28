import { useState } from "react";

const Login = () => {

    //states created
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [jwt, setJwt] = useState("");

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
            setJwt(data.token)
            setMessage("Login Successful")
        }else {
            setMessage("login failed, check credentials")
            
        }

        }catch(error) {
            console.log("Error : " + error );
            setMessage("An error occured. plz try again.")
        }
        

    };
    return (

        <div>
            <h2>Login</h2>
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
            
            
            {message && <p>{message}</p>}
            {jwt && <p>{jwt}</p>}
        </div>
    );
}

export default Login;