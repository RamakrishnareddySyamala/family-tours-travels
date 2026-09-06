import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8082/api/settings';

function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to load settings. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);

        setError('Unable to load business settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
  };
}

export default useSettings;