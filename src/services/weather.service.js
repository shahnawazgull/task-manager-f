const BASE_URL = "https://task-manager-b-uaf0.onrender.com/api/weather";
// const BASE_URL = "http://localhost:8080/api/weather";


const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const weatherService = {
  getByCity: (city) =>
    fetch(`${BASE_URL}?city=${encodeURIComponent(city)}`).then(handleResponse),
};