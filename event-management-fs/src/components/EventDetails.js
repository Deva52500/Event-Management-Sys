import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/${id}`);
      const data = await response.json();
      setEvent(data);
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    await fetch(`/events/${id}/register`, { method: 'POST' });
    alert('Registered successfully!');
  };

  return (
    event && (
      <div>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <button onClick={handleRegister}>Register</button>
      </div>
    )
  );
}

export default EventDetails;
