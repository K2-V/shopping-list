import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, ArrowLeft, MoreVertical } from "lucide-react";

export default function ShoppingListDetail({ list: initialList }) {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [list, setList] = useState(initialList);
    const [items, setItems] = useState(initialList.items || []);
    const [showCompleted, setShowCompleted] = useState(false);
    const [adding, setAdding] = useState({ name: "", quantity: "", unit: "", note: "" });

    useEffect(() => {
        setList({ ...list, items });
    }, [items]);

    const visibleItems = showCompleted ? items : items.filter((i) => !i.isDone);

    function toggleDone(itemId) {
        setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, isDone: !i.isDone } : i))
        );
    }

    function deleteItem(itemId) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
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
        setItems((prev) => [newItem, ...prev]);
        setAdding({ name: "", quantity: "", unit: "", note: "" });
    }

    const handleInvite = () => {
        const newMember = prompt("Zadej jméno člena k pozvání:");
        if (!newMember || !newMember.trim()) return;

        const updatedMembers = list.members
            ? [...new Set([...list.members, newMember.trim()])]
            : [newMember.trim()];

        setList((prev) => ({ ...prev, members: updatedMembers }));
    };

    const handleRename = () => {
        const newName = prompt("Zadej nový název seznamu:", list.title);
        if (!newName || !newName.trim()) return;
        setList((prev) => ({ ...prev, title: newName.trim() }));
    };

    const handleArchive = () => setList((prev) => ({ ...prev, archived: true }));
    const handleUnarchive = () => setList((prev) => ({ ...prev, archived: false }));

    const handleDelete = () => {
        if (!confirm(`Opravdu chceš smazat seznam "${list.title}"?`)) return;
        navigate("/");
    };

    const handleRemoveMember = (memberToRemove) => {
        const updatedMembers = list.members.filter((m) => m !== memberToRemove);
        setList((prev) => ({ ...prev, members: updatedMembers }));
    };

    return (
        <div className="min-h-screen w-full bg-[#ededed]">
            <header className="w-full bg-[#007535] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="hover:opacity-80">
                    <ArrowLeft size={26} />
                </button>
                <h1 className="text-3xl font-semibold flex-1">{list.title || list.name}</h1>
            </header>

            <main className="px-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4 relative">
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="checkbox"
                            checked={showCompleted}
                            onChange={(e) => setShowCompleted(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>Show completed</span>
                    </label>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{visibleItems.length} items</span>
                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="text-gray-500 hover:text-gray-800"
                            title="More"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                {list.owner === "you" ? (
                                    <>
                                        <button onClick={() => { setShowMenu(false); handleRename(); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Rename</button>
                                        <button onClick={() => { setShowMenu(false); list.archived ? handleUnarchive() : handleArchive(); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">{list.archived ? "Unarchive" : "Archive"}</button>
                                        <button onClick={() => { setShowMenu(false); handleInvite(); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Invite</button>
                                        <button onClick={() => { setShowMenu(false); handleDelete(); }} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">Delete</button>
                                    </>
                                ) : (
                                    <button onClick={() => navigate("/")} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Leave</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow space-y-3">
                    {visibleItems.length === 0 ? (
                        <p className="text-gray-500 text-center">No items</p>
                    ) : (
                        visibleItems.map((item) => (
                            <div key={item.id} className={`flex items-center justify-between border-b text-base p-3 transition ${item.isDone ? "bg-gray-100 line-through opacity-70" : "bg-white"}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={item.isDone}
                                        onChange={() => toggleDone(item.id)}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.name}{" "}
                                            {item.quantity &&
                                                `(${item.quantity}${item.unit ? ` ${item.unit}` : ""})`}
                                        </p>
                                        {item.note && <p className="text-gray-500 text-sm">{item.note}</p>}
                                    </div>
                                </div>
                                <button onClick={() => deleteItem(item.id)} className="text-gray-500 hover:text-red-600" title="Smazat položku">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={addItem} className="bg-white mt-6 rounded-3xl shadow p-4 flex flex-wrap gap-3 items-center">
                    <input
                        placeholder="Name *"
                        value={adding.name}
                        onChange={(e) => setAdding((a) => ({ ...a, name: e.target.value }))}
                        className="flex-1 text-gray-500 border rounded-xl p-2"
                        required
                    />
                    <input
                        placeholder="Qty"
                        type="number"
                        value={adding.quantity}
                        onChange={(e) => setAdding((a) => ({ ...a, quantity: e.target.value }))}
                        className="w-24 text-gray-500 border rounded-xl p-2"
                    />
                    <input
                        placeholder="Unit"
                        value={adding.unit}
                        onChange={(e) => setAdding((a) => ({ ...a, unit: e.target.value }))}
                        className="w-24 text-gray-500 border rounded-xl p-2"
                    />
                    <input
                        placeholder="Note"
                        value={adding.note}
                        onChange={(e) => setAdding((a) => ({ ...a, note: e.target.value }))}
                        className="flex-1 text-gray-500 border rounded-xl p-2"
                    />
                    <button type="submit" className="bg-[#007535] text-white px-4 py-2 rounded-xl hover:bg-[#005a28] flex items-center gap-2">
                        <Plus size={18} /> Add
                    </button>
                </form>

                <div className="mt-6 bg-white rounded-xl p-4 shadow">
                    <h2 className="text-lg font-semibold mb-2">Members</h2>
                    <ul className="space-y-1">
                        {list.members?.map((member) => (
                            <li key={member} className="flex justify-between items-center border-b py-1">
                                <span>{member}</span>
                                {list.owner === "you" && member !== "you" && (
                                    <button onClick={() => handleRemoveMember(member)} className="text-red-600 text-sm hover:underline">
                                        Odebrat
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}