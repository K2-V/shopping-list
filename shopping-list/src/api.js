// api.js
const API_URL = "http://localhost:3000/shoppingLists";

async function handleResponse(res, errorMessage) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${errorMessage}: ${text || res.status}`);
    }
    return res.json();
}

/**
 * 🧾 Načtení všech seznamů
 */
export async function getShoppingLists() {
    const res = await fetch(API_URL);
    return handleResponse(res, "Failed to fetch shopping lists");
}

/**
 * 🧾 Načtení jednoho seznamu podle ID
 */
export async function getShoppingListById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return handleResponse(res, "Failed to fetch shopping list");
}

/**
 * ➕ Přidání nového seznamu
 */
export async function addShoppingList(list) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
    });
    return handleResponse(res, "Failed to add list");
}

/**
 * 🔁 Částečná aktualizace seznamu (PATCH)
 */
export async function updateShoppingList(id, updatedData) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    return handleResponse(res, "Failed to update list");
}

/**
 * 🗑️ Smazání seznamu
 */
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

/**
 * ✅ Aliasy (pokud máš někde starší importy)
 */
export {
    deleteShoppingList as deleteList,
    updateShoppingList as updateList,
};