import { useState, useEffect } from "react";

export function useListItems(list, setList, updateList) {
    const [items, setItems] = useState(list?.items || []);
    const [adding, setAdding] = useState({
        name: "",
        quantity: "",
        unit: "",
        note: "",
    });

    // Sync
    useEffect(() => {
        if (list) setItems(list.items || []);
    }, [list]);

    // Update items — local state
    const updateItems = async (newItems) => {
        if (!list) return;

        // Local Update
        setItems(newItems);
        const updatedList = { ...list, items: newItems };
        setList(updatedList);

        await updateList(list.id, { items: newItems });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!adding.name.trim()) return;

        const newItem = {
            id: String(Date.now()),
            name: adding.name.trim(),
            quantity: adding.quantity ? Number(adding.quantity) : undefined,
            unit: adding.unit || "",
            note: adding.note || "",
            isDone: false,
        };

        await updateItems([newItem, ...items]);

        setAdding({
            name: "",
            quantity: "",
            unit: "",
            note: "",
        });
    };

    const deleteItem = async (itemId) => {
        await updateItems(items.filter((i) => i.id !== itemId));
    };

    const toggleDone = async (itemId) => {
        const updated = items.map((i) =>
            i.id === itemId ? { ...i, isDone: !i.isDone } : i
        );
        await updateItems(updated);
    };

    const clearCompleted = async () => {
        await updateItems(items.filter((i) => !i.isDone));
    };

    return {
        items,
        adding,
        setAdding,
        handleAddItem,
        deleteItem,
        toggleDone,
        clearCompleted,
        doneCount: items.filter((i) => i.isDone).length,
        totalCount: items.length,
    };
}