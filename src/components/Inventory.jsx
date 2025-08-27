import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../api/firebase';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

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
