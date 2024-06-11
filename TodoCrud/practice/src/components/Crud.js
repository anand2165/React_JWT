import React, { useState, useEffect } from 'react';

const Crud = () => {
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({ id: null, name: "" });
    const [editing, setEditing] = useState(false);
  
    useEffect(() => {
      const items = JSON.parse(localStorage.getItem("items")) || [];
      setItems(items);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("items", JSON.stringify(items));
    }, [items]);
  
    const handleInputChange = (e) => {
      setCurrentItem({ ...currentItem, name: e.target.value });
    };
  
    const addItem = () => {
      if (currentItem.name.trim()) {
        setItems([...items, { id: Date.now(), name: currentItem.name }]);
        setCurrentItem({ id: null, name: "" });
      }
    };
  
    const editItem = (item) => {
      setEditing(true);
      setCurrentItem({ id: item.id, name: item.name });
    };
  
    const updateItem = () => {
      if (currentItem.name.trim()) {
        setItems(items.map((item) => (item.id === currentItem.id ? currentItem : item)));
        setCurrentItem({ id: null, name: "" });
        setEditing(false);
      }
    };
  
    const deleteItem = (id) => {
      setItems(items.filter((item) => item.id !== id));
    };
  
    return (
      <div>
        <h1>CRUD App with localStorage</h1>
        <div>
          <input
            type="text"
            placeholder="Enter item name"
            value={currentItem.name}
            onChange={handleInputChange}
          />
          {editing ? (
            <button className='btn btn-primary mb-2' onClick={updateItem}>Update Item</button>
          ) : (
            <button className='btn btn-primary mb-2' onClick={addItem}>Add Item</button>
          )}
        </div>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name}
              <button className='btn btn-primary mb-2' onClick={() => editItem(item)}>Edit</button>
              <button className='btn btn-primary mb-2' onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default Crud;
