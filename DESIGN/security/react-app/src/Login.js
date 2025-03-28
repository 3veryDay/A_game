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
            setMessgae("An error occured. plz try again.")
        }
        

    }
}
