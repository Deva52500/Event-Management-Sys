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
  const [editingEvent, setEditingEvent] = useState(null); 
  const [updatedEvent, setUpdatedEvent] = useState({
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

// Create a new event
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
        alert(`Error: ${error.message}`);
      }


    } catch (err) {
      console.error('Error while creating event:', err);
      alert('error');
    }
  };

// Delete an event
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

// Update an event
  const handleUpdateClick = (event) => {
    setEditingEvent(event); 
    setUpdatedEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0], 
      category: event.category,
      locationId: event.locationId,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized.");
      return;
    }

    const response = await fetch(`/events/${editingEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEvent),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedData.id ? updatedData : event
        )
      );
      setEditingEvent(null); 
      alert("Event updated successfully!");
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelUpdate = () => {
    setEditingEvent(null); 
  };

  let isAdmin = false;  
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
            }}
          >
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Title"
              />
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
             <div>
             <button type="submit">Create Event</button> 
             </div> 
            
          </form>
        </div>
      )}
  
      <h2>Total Events</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            {isAdmin && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <th scope="row">{event.title}</th>
              <td>{event.date}</td>
              {isAdmin && (
                <td>
                  <button style= {{margin:"10px"}}
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedEvent(event);
                    }}
                  >
                    Delete
                  </button>
                  <button style= {{margin:"10px"}} onClick={() => handleUpdateClick(event)}>Update</button>
                </td>
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
  
      {editingEvent && (
        <div>
          <h2>Update Event</h2>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={updatedEvent.title || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div class="form-group">
                <label for="formGroupExampleInput">Date:</label>
                <input type="date"
                name="date"
                value={updatedEvent.date || ""}
                onChange={handleUpdateChange}
                  />
            </div>
            <div class="form-group">
                <label for="formGroupExampleInput">Category:</label>
                <input type="text"
                name="category"
                  value={updatedEvent.category || ""}
                  onChange={handleUpdateChange} 
                  />
            </div>
            <div class="form-group">
              <label for="exampleFormControlSelect1">Location ID:</label>
              <select class="form-control" id="exampleFormControlSelect1" value={updatedEvent.locationId || ""}
              name="locationId"
                  onChange={handleUpdateChange}
                  required>
                <option>Select ID</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
             </div>
            <button style= {{margin:"10px"}} type="submit">Save Changes</button>
            <button style= {{margin:"10px"}} type="button" onClick={handleCancelUpdate}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );

  
}

export default AdminDashboard;



