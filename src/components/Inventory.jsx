import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../api/firebase';
import { Link } from 'react-router-dom';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [productName, setProductName] = useState('');
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');

  const handleAddItem = () => {
    setIsAdding(true);
  };

  const handleFormClose = () => {
    setIsAdding(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !cost || !price || !stock || !category) {
      alert('Please check you filled every section for sure');
      return;
    }

    try {
      const itemsRef = collection(database, 'users', userId, 'items');

      const newDocRef = await addDoc(itemsRef, {
        productName,
        cost: Number(cost),
        price: Number(price),
        stock: Number(stock),
        category,
        createdAt: new Date(),
      });

      const newItem = {
        id: newDocRef.id,
        productName,
        cost: Number(cost),
        price: Number(price),
        stock: Number(stock),
        category,
        createdAt: new Date(),
      };

      setItems((prevItems) => [...prevItems, newItem]);

      // form init
      setProductName('');
      setCost(0);
      setPrice(0);
      setStock(0);
      setCategory('');

      alert('New item added!');
    } catch (error) {
      console.error('Falied to add item:', error);
      alert('Failed to add item. Please check console.');
    }
  };

  useEffect(() => {
    // Check whether user log in or not
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUserId(user.uid) : setUserId(null);
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchItems = async () => {
        try {
          // get reference on collection named 'items'
          const userId = auth.currentUser.uid;
          const itemsRef = collection(database, 'users', userId, 'items');
          // get all docs about collection named 'items', even actual data
          const querySnapshot = await getDocs(itemsRef);

          // Extract only data from snapshot, and replace to array
          const itemsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(itemsList);
        } catch (error) {
          console.error('Failed to load data: ', error);
        }
      };

      fetchItems();
    }
  }, [userId]);

  return (
    <div>
      <h3>Inventory List</h3>
      <button onClick={handleAddItem}>+ Add Item</button>

      {/* Show add item section while isAdding status is true  */}
      {/* 이 부분 css 할 때 팝업으로 만들기 */}
      <div className='modal'>
        {isAdding && (
          <form onSubmit={handleSubmit} className='add-form'>
            <label htmlFor='productName'>Product Name</label>
            <input
              id='productName'
              type='text'
              placeholder='Product Name'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <label htmlFor='cost'>Cost</label>
            <input
              id='cost'
              type='number'
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              required
              step='0.01'
            />

            <label htmlFor='price'>price</label>
            <input
              id='price'
              type='number'
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              step='0.01'
            />

            <label htmlFor='stock'>Count</label>
            <input
              id='stock'
              type='number'
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              step='0.01'
            />

            <label htmlFor='category'>Category</label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value=''>Choose category</option>
              <option value='K-Pop Album'>K-Pop Album</option>
              <option value='K-Pop Merch'>K-Pop Merch</option>
              <option value='Stationary'>Stationary</option>
              <option value='Plush'>Plush</option>
              <option value='etc'>etc</option>
            </select>

            <button onClick={handleFormClose}>Cancel</button>
            <button type='submit'>Complete</button>
          </form>
        )}
      </div>

      {items.length > 0 ? (
        <div className='item-list'>
          {items.map((item) => (
            <div key={item.id}>
              <Link to={`/inventory/${item.id}`}>{item.productName}</Link>
              <p>Inventory: {item.stock}</p>
              <p>Cost: ${item.cost.toLocaleString()}</p>
              <p>Price: ${item.price.toLocaleString()}</p>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>There's no stock for now</p>
      )}
    </div>
  );
}
