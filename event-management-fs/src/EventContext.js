import React, { createContext, useState, useEffect } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ date: '', category: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`/events?${query}`);
    const data = await response.json();
    setEvents(data);
  };

  return (
    <EventContext.Provider value={{ events, filters, setFilters }}>
      {children}
    </EventContext.Provider>
  );
};
