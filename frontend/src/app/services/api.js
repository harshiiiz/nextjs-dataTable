import axios from "axios";

const API_URL = "http://localhost:5001/locations";

export const fetchLocations = async ({ search = "", sort = "name", order = "asc", page = 1, limit = 5 }) => {
  try {
    const response = await axios.get(API_URL, {
      params: { q: search, _sort: sort, _order: order, _page: page, _limit: limit },
    });

    console.log("Raw API Response:", response.data); 

    // Convert object to array
    const formattedData = Array.isArray(response.data)
      ? response.data
      : Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
        }));

    return {
      data: formattedData,
      total: parseInt(response.headers["x-total-count"], 10) || formattedData.length,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], total: 0 }; 
  }
};

export const createLocation = async (data) => {
  try {
    return await axios.post(API_URL, data);
  } catch (error) {
    console.error("Error creating record:", error);
  }
};

export const updateLocation = async (id, data) => {
  try {
    return await axios.put(`${API_URL}/${id}`, data);
  } catch (error) {
    console.error("Error updating record:", error);
  }
};

export const deleteLocation = async (id) => {
  try {
    console.log(`Deleting ID: ${id}`);
    return await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
