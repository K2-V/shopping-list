import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/** INITIAL DATA — po reloadu se vše vrátí do tohoto stavu */
const INITIAL_LIST = {
    id: "1",
    title: "For dinner",
    items: [
        { id: "i1", name: "Milk", quantity: 1, unit: "l", note: "", isDone: false },
        { id: "i2", name: "Bread", quantity: 1, unit: "pc", note: "rye", isDone: true },
        { id: "i3", name: "Eggs", quantity: 10, unit: "pcs", note: "", isDone: false },
    ],
};

export default function ShoppingListDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Pro tento úkol ignorujeme id z URL a bereme demo data z konstanty:
    const [title, setTitle] = useState(INITIAL_LIST.title);
    const [items, setItems] = useState(INITIAL_LIST.items);
    const [showCompleted, setShowCompleted] = useState(false);
    const [adding, setAdding] = useState({ name: "", quantity: "", unit: "", note: "" });

    const visibleItems = showCompleted ? items : items.filter(i => !i.isDone);

    function toggleDone(itemId) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, isDone: !i.isDone } : i));
    }

    function deleteItem(itemId) {
        setItems(prev => prev.filter(i => i.id !== itemId));
    }

    function addItem(e) {
        e.preventDefault();
        const name = adding.name.trim();
        if (!name) return;
        const newItem = {
            id: String(Date.now()),
            name,
            quantity: adding.quantity ? Number(adding.quantity) : undefined,
            unit: adding.unit || undefined,
            note: adding.note || "",
            isDone: false,
        };
        setItems(prev => [newItem, ...prev]);
        setAdding({ name: "", quantity: "", unit: "", note: "" });
    }

    function checkAll() {
        setItems(prev => prev.map(i => ({ ...i, isDone: true })));
    }

    function uncheckAll() {
        setItems(prev => prev.map(i => ({ ...i, isDone: false })));
    }

    return (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <button onClick={() => navigate(-1)}>← Back</button>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="List title"
                    style={{ fontSize: 22, fontWeight: 600, flex: 1, border: "none", outline: "none", background: "transparent" }}
                />
                {/* Akce nad seznamem – pro ukázku jednoduše */}
                <button onClick={checkAll} title="Check all">Check all</button>
                <button onClick={uncheckAll} title="Uncheck all">Uncheck all</button>
            </div>

            {/* Filtr */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                    />
                    Show completed
                </label>
            </div>

            {/* Seznam položek */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                {visibleItems.length === 0 && (
                    <li style={{ color: "#777" }}>No items to show.</li>
                )}
                {visibleItems.map(item => (
                    <ItemRow
                        key={item.id}
                        item={item}
                        onToggleDone={() => toggleDone(item.id)}
                        onDelete={() => deleteItem(item.id)}
                    />
                ))}
            </ul>

            {/* Přidání položky */}
            <form onSubmit={addItem} style={{
                marginTop: 16, display: "grid", gap: 8,
                gridTemplateColumns: "1fr 110px 110px 1fr 110px"
            }}>
                <input
                    placeholder="Name *"
                    value={adding.name}
                    onChange={(e) => setAdding(a => ({ ...a, name: e.target.value }))}
                    required
                />
                <input
                    placeholder="Qty"
                    type="number"
                    value={adding.quantity}
                    onChange={(e) => setAdding(a => ({ ...a, quantity: e.target.value }))}
                />
                <input
                    placeholder="Unit"
                    value={adding.unit}
                    onChange={(e) => setAdding(a => ({ ...a, unit: e.target.value }))}
                />
                <input
                    placeholder="Note"
                    value={adding.note}
                    onChange={(e) => setAdding(a => ({ ...a, note: e.target.value }))}
                />
                <button type="submit">+ Add</button>
            </form>
        </div>
    );
}

/** Prezentační radek položky */
function ItemRow({ item, onToggleDone, onDelete }) {
    return (
        <li style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr auto",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: item.isDone ? "#f8fafc" : "white",
            opacity: item.isDone ? 0.7 : 1
        }}>
            <input type="checkbox" checked={item.isDone} onChange={onToggleDone} />
            <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, textDecoration: item.isDone ? "line-through" : "none" }}>
                    {item.name}
                    {item.quantity ? ` · ${item.quantity}${item.unit ? ` ${item.unit}` : ""}` : ""}
                </div>
                {!!item.note && <div style={{ color: "#6b7280", fontSize: 13 }}>{item.note}</div>}
            </div>
            <button onClick={onDelete} title="Delete" aria-label="Delete">🗑</button>
        </li>
    );
}