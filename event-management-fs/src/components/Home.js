import React, { useContext } from 'react';
import { EventContext } from '../EventContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


  
function Home() {
  const { user } = useContext(AuthContext);
  const { events, filters, setFilters } = useContext(EventContext);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const toAdminDashboard = () =>{
      console.log("Role:", user.role)
      if(user.role==="ADMIN"){
        navigate('/admin')
      }else{
        alert("You are not authorized")
      }    
}

const toEventRegistration = () =>{
  navigate('/user')
}
  return (
    <div>
      <h1>Upcomming Events</h1>
      <div>
      <button style= {{margin:"10px"}} onClick={toAdminDashboard}>Admin Board</button>
      </div>
      <div>
      <button style= {{margin:"10px"}} onClick={toEventRegistration}>Event Registration</button>
      </div>
      <h3>Filters</h3>
      <div>
        <input name="date" type="date" onChange={handleFilterChange} />
        <input name="category" placeholder="Category" onChange={handleFilterChange} />
        <input name="location" placeholder="Location" onChange={handleFilterChange} />
      </div>
      
      <table class="table">
  <thead>
    <tr>
     
      <th scope="col">Title</th>
      <th scope="col">Description</th>
      <th scope="col">Date</th>
      <th scope="col">Category</th>
    </tr>
  </thead>
  <tbody>
  {events.map((event) => (
    <tr key={event.id}>
      <th scope="row">{event.title}</th> 
      <td>{event.description}</td> 
      <td>{event.date}</td> 
      <td>{event.category}</td> 
 
    </tr>
  ))}
</tbody>
    
</table>
    </div>
  );
}

export default Home;
