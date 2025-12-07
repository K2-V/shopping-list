import { useState, useEffect } from "react";
import {
    getShoppingLists,
    addShoppingList,
    deleteShoppingList,
    updateShoppingList,
} from "../index.js";

function normalizeLists(lists) {
    if (!Array.isArray(lists)) return [];
    return lists.map((list) => ({
        id: String(list.id),
        title: list.title || "",
        owner: list.owner || "",
        members: Array.isArray(list.members) ? list.members : [],
        items: Array.isArray(list.items) ? list.items : [],
        archived: !!list.archived,
    }));
}

function saveListsToStorage(lists) {
    try {
        localStorage.setItem("shoppingLists", JSON.stringify(lists));
    } catch {
        // ignore storage errors
    }
}

function loadListsFromStorage() {
    try {
        const stored = localStorage.getItem("shoppingLists");
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return normalizeLists(parsed);
    } catch {
        return [];
    }
}

export function useShoppingLists() {
    const [lists, setLists] = useState(() => loadListsFromStorage());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = "you";

    useEffect(() => {
        async function fetchLists() {
            try {
                const data = await getShoppingLists();
                const visibleLists = data.filter(
                    (list) =>
                        list.owner === currentUser ||
                        (Array.isArray(list.members) && list.members.includes(currentUser))
                );
                const normalized = normalizeLists(visibleLists);
                setLists(normalized);
                saveListsToStorage(normalized);
                setError(null);
            } catch (err) {
                console.error("Error loading lists:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLists();
    }, []);

    // Create new List
    async function addList(title, owner = "you") {
        try {
            const newList = {
                id: String(Date.now()),
                title,
                owner,
                members: [],
                items: [],
                archived: false,
            };
            const created = await addShoppingList(newList);
            const updatedLists = [...lists, created];
            setLists(updatedLists);
            saveListsToStorage(updatedLists);
        } catch (err) {
            console.error("Add failed:", err);
            alert("Failed to create list.");
        }
    }

    // Delete List
    async function removeList(id) {
        try {
            await deleteShoppingList(id);
            const updatedLists = lists.filter((list) => list.id !== id);
            setLists(updatedLists);
            saveListsToStorage(updatedLists);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete list.");
        }
    }

    async function updateList(id, data) {
        try {
            const updatedData = await updateShoppingList(id, data);
            const updatedLists = lists.map((l) =>
                l.id === id ? { ...l, ...data, ...updatedData } : l
            );
            setLists(updatedLists);
            saveListsToStorage(updatedLists);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update list.");
        }
    }

    // Invite member
    async function inviteMember(listId, newMember) {
        try {
            const list = lists.find((l) => l.id === listId);
            if (!list) throw new Error("List not found");

            if (!newMember || !newMember.trim()) {
                return;
            }

            const trimmed = newMember.trim();

            // Prevent duplicates
            if (list.members && list.members.includes(trimmed)) {
                alert(`User "${trimmed}" is already a member of this list.`);
                return;
            }

            const updatedMembers = [...(list.members || []), trimmed];

            await updateList(listId, { members: updatedMembers });

            alert(`User "${trimmed}" was invited successfully.`);
        } catch (err) {
            console.error("Invite failed:", err);
            alert("Failed to add member: " + err.message);
        }
    }

    // Remove member
    async function removeMember(listId, member) {
        try {
            const list = lists.find((l) => l.id === listId);
            if (!list) throw new Error("List not found");

            if (!list.members || !list.members.includes(member)) {
                alert(`User "${member}" is not a member of this list.`);
                return;
            }

            const updatedMembers = list.members.filter((m) => m !== member);

            await updateList(listId, { members: updatedMembers });

            alert(`User "${member}" was removed successfully.`);
        } catch (err) {
            console.error("Remove member failed:", err);
            alert("Failed to remove member: " + err.message);
        }
    }

    return {
        lists,
        setLists,
        loading,
        error,
        addList,
        removeList,
        updateList,
        inviteMember,
        removeMember,
    };
}