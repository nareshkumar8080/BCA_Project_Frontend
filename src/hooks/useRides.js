import { useEffect, useState } from "react";
import api from "../api";

export default function useRides(initialFilters = {}) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const fetchRides = async (overrideFilters) => {
    setLoading(true);
    try {
      const { data } = await api.get("/rides", {
        params: overrideFilters || filters,
      });
      setRides(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return {
    rides,
    loading,
    filters,
    setFilters,
    refresh: fetchRides,
  };
}


