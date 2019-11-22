import { useState, useEffect } from "react";
import axios from "axios";

// Modified from https://stackoverflow.com/a/53878045/2807674
const useAxiosFetch = request => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let isCancelled = false;
    let cancelSource = axios.CancelToken.source();
    axios(request)
      .then(a => {
        if (!isCancelled) {
          setData(a.data);
          setIsLoading(false);
        }
      })
      .catch(function(e) {
        if (!isCancelled) {
          setError(true);
          setErrorMessage(e.message);
          setIsLoading(false);
          if (axios.isCancel(e)) {
            console.error(`request cancelled: ${e.message}`);
          } else {
            console.error(`axios error: ${e.message}`);
          }
        }
      });
    return () => {
      isCancelled = true;
      cancelSource.cancel("Cancelling in cleanup");
    };
  }, [request]);

  return { data, error, errorMessage, isLoading };
};

export default useAxiosFetch;
