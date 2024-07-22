import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Task = () => {
  const [all, setAll] = useState([]);
  const [text, setText] = useState('');
  const [importa, setImporta] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/menu/tasks');
      setAll(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/menu/tasks', { importa, text });
      setMessage(response.data.message);
      if (response.status === 201) {
        fetchItems(); // Re-fetch sorted tasks after adding a new task
        setText('');
        setImporta(0);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error adding task');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/menu/tasks/${id}`);
      fetchItems(); // Re-fetch sorted tasks after deleting a task
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit}>
        <label>Your Task:</label>
        <input
          placeholder='Write'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label>Importance:</label>
        <input type='number' value={importa} onChange={(e) => setImporta(e.target.value)} />
        <button type='submit'>Add</button>
      </form>

      <p>{message}</p>

      <ul>
        {all.map((task) => (
          <li key={task.id}>
            <label>Importance:</label>
            <h3>{task.importa}</h3>
            <label>Task:</label>
            <h3>{task.text}</h3>
            <button onClick={() => deleteItem(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Task;
