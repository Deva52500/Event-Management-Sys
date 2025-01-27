import React, { useState, useEffect } from "react";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Fetch all events
    const fetchEvents = async () => {
      const response = await fetch("/events");
      const data = await response.json();
      setEvents(data);
    };

    // Fetch registrations for the logged-in user
    const fetchRegistrations = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/events/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data", data)
        setRegistrations(data);
      }
    };

    fetchEvents();
    fetchRegistrations();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to register.");
      return;
    }

    const response = await fetch(`/events/${eventId}/registerevent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Successfully registered for the event!");
      const registration = await response.json();
      setRegistrations([...registrations, registration]);
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Available Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {event.date}
            <div>
            <button onClick={() => handleRegisterEvent(event.id)}>Register</button>
            </div>
            
          </li>
        ))}
      </ul>

      <h2>Your Registrations</h2>
      <ul>
        {registrations.map((registration) => (
          <li key={registration.id}>
            Event: {registration.event.title} | Date:{" "}
            {new Date(registration.registrationDate).toLocaleDateString()}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default UserDashboard;
