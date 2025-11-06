import { Routes, Route, useParams } from 'react-router-dom';
import ShoppingListDetail from './pages/ShoppingListDetail';

const list = [
    {
        id: "1",
        title: "For dinner",
        owner: "you",
        members: ["Jane"],
        items: [
            { id: "i1", name: "Spaghetti", quantity: 1, unit: "pack", note: "", isDone: false },
            { id: "i2", name: "Pecorino romano", quantity: 300, unit: "g", note: "", isDone: true },
            { id: "i3", name: "Eggs", quantity: 10, unit: "pcs", note: "", isDone: false },
            { id: "i4", name: "Parmigiano", quantity: 300, unit: "g", note: "", isDone: false },
            { id: "i5", name: "Smoked pancetta", quantity: 200, unit: "g", note: "", isDone: false },
        ]
    },
    {
        id: "2",
        title: "Grill",
        owner: "Petr",
        members: ["you", "Kevin"],
        archived: false,
        items: [
            { id: "i1", name: "Milk", quantity: 1, unit: "l", note: "", isDone: false },
            { id: "i2", name: "Bread", quantity: 1, unit: "pc", note: "rye", isDone: true },
            { id: "i3", name: "Eggs", quantity: 10, unit: "pcs", note: "", isDone: false },
        ]
    }
];

function ShoppingListWrapper() {
    const { id } = useParams();
    const selected = list.find(l => l.id === id);

    if (!selected) return <p style={{ padding: 20 }}>Seznam s ID "{id}" nebyl nalezen.</p>;

    return <ShoppingListDetail list={selected} />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/:id" element={<ShoppingListWrapper />} />
        </Routes>
    );
}