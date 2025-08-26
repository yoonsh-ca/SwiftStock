import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../api/firebase';

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // get reference on collection named 'items'
        const itemsRef = collection(database, 'items');
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
  }, []);

  return (
    <div>
      <h3>Inventory List</h3>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id}>
            <p>{item.productName}</p>
            <p>Inventory: {item.stock}</p>
          </div>
        ))
      ) : (
        <p>There's no stock for now</p>
      )}
    </div>
  );
}
