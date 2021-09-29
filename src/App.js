import { useState ,useEffect} from 'react';
import ReactMapGL,{Marker ,Popup} from 'react-map-gl';
import {Room,Star} from '@material-ui/icons'
import './app.css';
import axios from 'axios';
import {format} from 'timeago.js'
import Register from './components/Register';
import Login from './components/Login';
import dotenv from 'dotenv'
dotenv.config()

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] =useState([])
  const [title,setTitle] =useState(null)
  const [desc,setDesc] =useState(null)
  const [rating,setRating] =useState(0)
  const [currentPlaceId, setCurrentPlaceId]= useState(null)
  const [newPlace, setNewPlace]= useState(null)
  const [showRegister,setShowRegister] = useState(false)
  const [showLogin,setShowLogin] = useState(false)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.59,
    longitude: 78.96,
    zoom: 4
  });
  useEffect(()=>{
    const getPins = async ()=>{
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins()
  },[])

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude:lat,longitude:long})
  }

  const handleAddClick = (e)=>{
   const [long,lat] = e.lngLat;
   setNewPlace({
     long:long,
     lat:lat,
   })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin ={
      username:currentUser,
      title:title,
      desc :desc,
      rating:rating,
      lat: newPlace.lat,
      long :newPlace.long,
    }

    try {
      const res = await axios.post("/pins",newPin)
      setPins([...pins, res.data])
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }

  }
  const handleLogout =()=>{
    myStorage.removeItem("user")
    setCurrentUser(null)
  }
  return (
    <div className="App" >
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken ={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/ulhas001/cku5cdhc00kz117nti4ei58o0"
      onDblClick = {handleAddClick}
      transitionDuration ="300"
    >
      {pins.map(data=>(
<>
      <Marker latitude={data.lat} longitude={data.long} offsetLeft={-viewport.zoom *3.5} offsetTop={-viewport.zoom *7}>
        <Room style={{fontSize:viewport.zoom *7,color: data.username === currentUser ? "tomato" : "royalblue" ,cursor:"pointer"}}
          onClick = {()=>handleMarkerClick(data._id,data.lat,data.long)}
        />
      </Marker>
      {data._id === currentPlaceId &&
      <Popup
          latitude={data.lat}
          longitude={data.long}
          closeButton={true}
          closeOnClick={false}
          onClose = {()=>setCurrentPlaceId(null)}
          anchor="left" >
          <div className="card">
            <label >Place</label>
            <span className="place" >{data.title}</span>
            <label >Review</label>
            <p className="desc" >{data.desc}</p>
            <label >Rating</label>
            <div className="stars">
              {Array(data.rating).fill(<Star className="star"/>)}
            </div>
            <label >Information</label>
            <span className="username">Created by <b>{data.username}</b></span>
            <span className="date">{format(data.createdAt)}</span>
          </div>
        </Popup>
      }
        </>
      ))}
      {newPlace &&
      <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose = {()=>setNewPlace(null)}
          anchor="left" >
            <div>
              <form onSubmit={handleSubmit} >
                <label >Title</label>
                <input placeholder="Enter a title"  
                onChange={(e)=>setTitle(e.target.value)} />
                <label >Review</label>
                <textarea placeholder = "Your views about this place" 
                onChange={(e)=>setDesc(e.target.value)}></textarea>
                <label >Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit" >Add Pin</button>
              </form>
            </div>
          </Popup>
      }
      {currentUser ? (<button className="button logout" onClick={handleLogout}>Log Out</button>
      ):(<div className="buttons">
      <button className="button login" onClick={()=>setShowLogin(true)}>Log In</button>
      <button className="button register" onClick={()=>setShowRegister(true)}>Log Out</button>
      </div>)}
      
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
    </ReactMapGL>
    </div>
  );
}

export default App;
