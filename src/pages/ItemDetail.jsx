import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, database } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [originalItem, setOriginalItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: get data from firestore
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          navigate('/login');
          return;
        }
        const itemDocRef = doc(database, 'users', userId, 'items', id);
        const itemDoc = await getDoc(itemDocRef);

        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          setProductName(itemData.productName);
          setCost(itemData.cost);
          setPrice(itemData.price);
          setStock(itemData.stock);
          setCategory(itemData.category);
          setOriginalItem(itemData);
        } else {
          setError('Cannot find item');
        }
      } catch (error) {
        console.error('Failed to load data: ', error);
        setError('Error occurs while data is loading');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  // useEffect: watch changes on detail
  useEffect(() => {
    if (originalItem) {
      const isModified =
        productName !== originalItem.productName ||
        cost !== originalItem.cost ||
        price !== originalItem.price ||
        stock !== originalItem.stock ||
        category !== originalItem.category;
      setIsChanged(isModified);
    }
  }, [productName, cost, price, stock, category, originalItem]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!isChanged) {
      alert('There is nothing to save');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const itemDocRef = doc(database, 'users', userId, 'items', id);

      await updateDoc(itemDocRef, {
        productName,
        cost,
        price,
        stock,
        category,
      });

      alert('✅Item updated successfully');

      setIsChanged(false);
      setOriginalItem({
        productName,
        cost,
        price,
        stock,
        category,
      });
    } catch (error) {
      console.error('Failed to update: ', error);
      alert('Error occurs while data update');
    }
  };

  if (loading) return <p>Loading details of item</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Item Details</h2>

      <form onSubmit={handleUpdate}>
        <div>
          <button
            type='submit'
            style={{
              backgroundColor: isChanged ? 'blue' : 'gray',
              color: 'white',
            }}
          >
            Save
          </button>
          <button
            type='button'
            style={{
              backgroundColor: isChanged ? 'gray' : 'red',
              color: 'white',
            }}
          >
            Delete
          </button>
          <button type='button' onClick={() => navigate(-1)}>
            Return to Inventory
          </button>
        </div>

        <div>
          <label htmlFor='productName'>Product Name</label>
          <input
            id='productName'
            type='text'
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
          <label htmlFor='price'>Price</label>
          <input
            id='price'
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            step='0.01'
          />
          <label htmlFor='stock'>Stock</label>
          <input
            id='stock'
            type='number'
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
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
        </div>
      </form>
    </div>
  );
}
