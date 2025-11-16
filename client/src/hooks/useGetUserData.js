import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // assuming you're using axios for API requests
import { getUserDataAPI } from '../utils/APIroutes';

const useGetUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(getUserDataAPI, {withCredentials: true}); // replace with your actual API route
        setUserData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate('/auth');
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { userData, loading, error };
};

export default useGetUserData;
