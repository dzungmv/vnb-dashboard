import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState((any) => any);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setIsPending(true);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw Error('Could not fetch the data for that resource');
                }
                const data = await response.json();
                setData(data);
                setIsPending(false);
                setError(null);
            } catch (error) {
                setIsPending(false);
                setError(error.message);
            }
        })();
    }, [url]);

    return { data, isPending, error };
};

export default useFetch;
