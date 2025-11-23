
let api = await import("./api.js");

export const {
    getShoppingLists,
    addShoppingList,
    deleteShoppingList,
    updateShoppingList,
} = api;