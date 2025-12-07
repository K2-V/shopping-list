const API_URL = "http://localhost:3000/shoppingLists";

async function handleResponse(res, errorMessage) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${errorMessage}: ${text || res.status}`);
    }
    return res.json();
}

/** Fetch all shopping lists */
export async function getShoppingLists() {
    const res = await fetch(API_URL);
    return handleResponse(res, "Failed to fetch shopping lists");
}

/** Fetch a shopping list by ID */
export async function getShoppingListById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return handleResponse(res, "Failed to fetch shopping list");
}

/** Add a new shopping list */
export async function addShoppingList(list) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
    });
    return handleResponse(res, "Failed to add list");
}

/** Partial update of a shopping list (PATCH) */
export async function updateShoppingList(id, updatedData) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    return handleResponse(res, "Failed to update list");
}

/** Delete a shopping list */
export async function deleteShoppingList(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete list: ${text || res.status}`);
    }
    return true;
}