import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../AuthContext";

function AdminDashboard() {
  let { user } = useContext(AuthContext); 
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    locationId: "", 
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/events');
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  
  const handleCreateEvent = async () => {
    if (isLoading) return; 
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized.');
      return;
    }
  

    const formattedEvent = {
      ...newEvent,
      date: new Date(newEvent.date).toISOString(), 
      locationId: parseInt(newEvent.locationId),   
    };
  
    try {
      
      const response = await fetch('/event', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(formattedEvent),
      });
  
      if (response.ok) {
        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
        setNewEvent({
          title: "",
          description: "",
          date: "",
          category: "",
          locationId: "",
        });
        
      } else {
        const error = await response.json();
        //alert(`Error: ${error.message}`);
      }


    } catch (err) {
    //  console.error('Error while creating event:', err);
    //  alert('error');
    }
  };


  const handleDelete = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized.');
      return;
    }
    console.log("Delete event: ",token)
    const response = await fetch(`/events/${selectedEvent.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.ok) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setIsModalOpen(false);
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  };

  const handleUpdateEvent = async (updatedEvent) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized');
      return;
    }

    const response = await fetch(`/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(updatedEvent),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setEvents(events.map((event) => (event.id === updatedData.id ? updatedData : event)));
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  };

//  console.log("Admin: ",localStorage.getItem("token"));
//  function parseJwt (token) {
//    var base64Url = token.split('.')[1];
//    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//    }).join(''));

//    return JSON.parse(jsonPayload);
//}

//user = parseJwt(localStorage.getItem("token"));

  let isAdmin = false;  
  console.log("Admin: ", user.role)
  user.role === 'ADMIN' ? isAdmin = true : isAdmin = false;

  

  return (
    <div>
      <h1>Admin Dashboard</h1>  
      
      {isAdmin && (
        <div>
          <h2>Create Event</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateEvent(); 
              //disabled={isLoading}
            }}
          >
          <div class="form-group">
              <label for="formGroupExampleInput">Title</label>
              <input type="text" value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required class="form-control" id="formGroupExampleInput" placeholder="Title"/>
          </div>
          <div class="form-group">
              <label for="formGroupExampleInput">Description</label>
              <input type="text" value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                required class="form-control" id="formGroupExampleInput" placeholder="Description"/>
          </div>
          <div class="form-group">
              <label for="formGroupExampleInput">Date</label>
              <input type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required class="form-control" id="formGroupExampleInput" placeholder="Date"/>
          </div>
          <div class="form-group">
              <label for="formGroupExampleInput">Category</label>
              <input type="text"
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                required class="form-control" id="formGroupExampleInput" placeholder="Category"/>
          </div>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Location ID:</label>
            <select class="form-control" id="exampleFormControlSelect1" value={newEvent.locationId}
                onChange={(e) => setNewEvent({ ...newEvent, locationId: e.target.value })}
                required>
              <option>Select ID</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}



<h2>Total Events</h2>
      <table class="table">
  <thead>
    <tr>
     
      <th scope="col">Title</th>
      <th scope="col">Date</th>
 
    </tr>
  </thead>
  <tbody>
  {events.map((event) => (
    <tr key={event.id}>
      <th scope="row">{event.title}</th> 
      <td>{event.date}</td> 
      {isAdmin && (
              <div>
                <button onClick={() => setIsModalOpen(true) || setSelectedEvent(event)}>Delete</button>
              </div>
            )}
    </tr>
  ))}
</tbody>
    
</table>

      {isModalOpen && (
        <div>
          <p>Are you sure you want to delete this event?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setIsModalOpen(false)}>No</button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
