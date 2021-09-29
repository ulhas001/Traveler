import './login.css'
import {Cancel, Room } from '@material-ui/icons'
import { useRef, useState } from 'react'
import axios from 'axios'

const Login = ({setShowLogin,myStorage,setCurrentUser}) => {
    
    const [error, setError] = useState(false)
    const nameRef = useRef()
    const passwordRef = useRef()
    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login",user);
            myStorage.setItem("user",res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)
        } catch (err) {
            setError(true)
        }
    }
    return (
        <div class ="loginContainer">
            <div className="logo">
                <Room/>
                Traveler
            </div>
            <form onSubmit={handleSubmit} >
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder= "password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
               
                {error && (<span className="failure"> Something went Wrong !</span>)}
                
            </form>
            <Cancel className= "loginCancel" onClick={()=>setShowLogin(false)}/>
        </div>
    )
}

export default Login
