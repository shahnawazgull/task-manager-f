const BASE_URL = "https://task-manager-b-uaf0.onrender.com/api/tasks";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.msg || data.message || "Something went wrong");
  return data;
};

export const taskService = {
  getAll: () =>
    fetch(BASE_URL).then(handleResponse),

  create: (payload) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  update: (id, payload) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  toggle: (id) =>
    fetch(`${BASE_URL}/${id}/toggle`, {
      method: "PATCH",
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    }).then(handleResponse),
};