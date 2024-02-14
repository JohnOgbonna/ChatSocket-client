import { useEffect, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get initial value from local storage or use provided initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if undefined
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Return initialValue on error
      console.error('Error retrieving data from local storage:', error);
      return initialValue;
    }
  });

  // Update local storage when storedValue changes
  const setValue = (value: T) => {
    try {
      // Allow value to be a function to match useState API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Serialize state to JSON and store in local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // Update storedValue state
      setStoredValue(valueToStore);
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };

  useEffect(() => {
    // Update storedValue if key or initialValue changes
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
