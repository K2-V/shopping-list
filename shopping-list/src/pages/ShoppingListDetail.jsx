import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Trash2, Plus, ArrowLeft, MoreVertical} from "lucide-react";
import { MOCK_DATA } from "../data/listsDetail.js";

export default function ShoppingList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    const [lists, setLists] = useState(MOCK_DATA);
    const [list, setList] = useState(null);
    useEffect(() => {
        const found = lists.find(l => String(l.id) === id);
        if (found) setList(found);
        else navigate("/");
    }, [id, lists, navigate]);

    // Minimal listItems logic for mock data
    const [adding, setAdding] = useState({ name: "", quantity: "", unit: "", note: "" });
    const items = list?.items || [];
    const [localItems, setLocalItems] = useState([]);
    useEffect(() => {
        if (list) setLocalItems(list.items || []);
    }, [list]);
    const visibleItems = showCompleted ? localItems : localItems.filter((i) => !i.isDone);

    function handleAddItem(e) {
        e.preventDefault();
        if (!adding.name) return;
        const newItem = {
            id: Date.now(),
            name: adding.name,
            quantity: adding.quantity,
            unit: adding.unit,
            note: adding.note,
            isDone: false,
        };
        setLocalItems(prev => [...prev, newItem]);
        setAdding({ name: "", quantity: "", unit: "", note: "" });
    }
    function deleteItem(id) {
        setLocalItems(prev => prev.filter(i => i.id !== id));
    }
    function toggleDone(id) {
        setLocalItems(prev => prev.map(i => i.id === id ? { ...i, isDone: !i.isDone } : i));
    }

    function handleDelete(id) {
      if (!confirm("Delete this list?")) return;
      setLists(prev => prev.filter(l => l.id !== id));
    }

    function handleRename(id) {
      const listObj = lists.find(l => l.id === id);
      if (!listObj) return;
      const newName = prompt("Enter new name:", listObj.title);
      if (!newName) return;
      setLists(prev => prev.map(l => l.id === id ? { ...l, title: newName } : l));
    }

    function handleArchive(id) {
      setLists(prev => prev.map(l => l.id === id ? { ...l, archived: true } : l));
    }

    function handleRemoveMember(id, member) {
      setLists(prev =>
        prev.map(l =>
          l.id === id
            ? { ...l, members: l.members.filter(m => m !== member) }
            : l
        )
      );
    }

    function handleLeave(id) {
      if (!confirm("Leave this list?")) return;
      setLists(prev => prev.filter(l => l.id !== id));
      navigate("/");
    }

    function inviteMember(id, member) {
      if (!member) return;
      setLists(prev =>
        prev.map(l =>
          l.id === id ? { ...l, members: [...l.members, member] } : l
        )
      );
    }

    if (!list)
        return (
            <p className="text-gray-600 p-10 text-center">Loading...</p>
        );

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 transition">
            {/* Header */}
            <header className="bg-[#007535] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="hover:opacity-80">
                    <ArrowLeft size={26} />
                </button>
                <h1 className="text-3xl font-semibold flex-1">{list.title}</h1>
            </header>

            <main className="px-6 max-w-4xl mx-auto space-y-6">
                {/*Filte and Vertical Menu*/}
                <div className="flex justify-between items-center relative">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showCompleted}
                            onChange={(e) => setShowCompleted(e.target.checked)}
                        />
                        Show Completed
                    </label>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{visibleItems.length} Items</span>
                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="text-gray-500 hover:text-gray-800"
                            title="More"
                        ><MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                {list.owner === "you" ? (
                                    <>
                                        <button onClick={() => { setShowMenu(false); handleRename(list.id); }}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Rename</button>
                                        <button onClick={() => { setShowMenu(false); handleArchive(list.id); }}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Archive</button>
                                        <button onClick={() => inviteMember(list.id, prompt("Enter the name of the new member:"))}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">Invite</button>
                                        <button onClick={() => { setShowMenu(false); handleDelete(list.id); }}
                                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">Delete</button>
                                    </>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            setShowMenu(false);
                                            await handleLeave(list.id);
                                            navigate("/");
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/*Items*/}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-3xl p-6 shadow">
                        {visibleItems.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                No items
                            </p>
                        ) : (
                            visibleItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex justify-between items-center border-b border-gray-200 py-2 ${
                                        item.isDone ? "opacity-70 line-through" : ""
                                    }`}
                                >
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
                                            {item.note && (
                                                <p className="text-gray-600 text-sm">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="text-gray-400 hover:text-red-600"
                                    ><Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/*Adding Items*/}
                <form
                    onSubmit={handleAddItem}
                    className="bg-white rounded-3xl shadow p-4 flex flex-wrap gap-3 mt-6"
                >
                    <input
                        placeholder="Name *"
                        value={adding.name}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, name: e.target.value }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                        required
                    />
                    <input
                        placeholder="Qty"
                        type="number"
                        value={adding.quantity}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, quantity: e.target.value }))
                        }
                        className="w-24 border border-gray-300 rounded-lg p-2"/>
                    <input
                        placeholder="Unit"
                        value={adding.unit}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, unit: e.target.value }))
                        }
                        className="w-24 border border-gray-300 rounded-lg p-2"/>
                    <input
                        placeholder="Note"
                        value={adding.note}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, note: e.target.value }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"/>
                    <button
                        type="submit"
                        className="bg-[#007535] text-white px-4 py-2 rounded-lg hover:bg-[#008f47] flex items-center gap-2"
                    ><Plus size={18} /> Add
                    </button>
                </form>

                {/*Members*/}
                <div className="mt-6 bg-white rounded-xl p-4 shadow">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Members</h2>
                    <ul className="space-y-1">
                        {Array.isArray(list.members) && list.members.length > 0 ? (
                            list.members.map((member) => (
                                <li key={member}
                                    className="flex justify-between items-center border-b border-gray-200 py-1"
                                >
                                    <span>{member}</span>
                                    {list.owner === "you" && member !== "you" && (
                                        <button
                                            onClick={() => handleRemoveMember(list.id, member)}
                                            className="text-red-600 text-sm hover:underline"
                                        >Remove
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No members</p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
}