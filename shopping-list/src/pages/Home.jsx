import { useState } from "react";
import NewListModal from "../components/NewListModal.jsx";
import { Plus, ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

import { useShoppingLists } from "../hooks/useShoppingLists.js";
import { useListActions } from "../hooks/useListActions.js";

export default function Home() {
    const listsCtx = useShoppingLists();
    const { lists, loading, error, addList, removeList } = listsCtx;

    const {
        handleRename,
        handleArchive,
        handleUnarchive,
        handleDelete,
        handleLeave,
        handleInvite,
    } = useListActions(listsCtx);

    const [showModal, setShowModal] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [showMenuId, setShowMenuId] = useState(null);

    const visibleLists = lists.filter(
        (l) =>
            l.owner === "you" ||
            (Array.isArray(l.members) && l.members.includes("you"))
    );

    const activeLists = visibleLists.filter((l) => !l.archived);
    const archivedLists = visibleLists.filter((l) => l.archived);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen w-full bg-gray-100 text-gray-900">
            <header className="w-full bg-[#007535] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                    <h1 className="text-3xl font-normal">Shopping Lists</h1>
                </div>
            </header>

            <main className="px-6 max-w-6xl mx-auto space-y-10">
                {/* ACTIVE LISTS */}
                <div className="bg-white rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeLists.map((list) => (
                        <div
                            key={list.id}
                            className="rounded-2xl p-6 text-left relative group border border-gray-200 bg-white hover:shadow-lg transition"
                        >
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={() =>
                                        setShowMenuId(showMenuId === list.id ? null : list.id)
                                    }
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showMenuId === list.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                        {list.owner === "you" ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        handleRename(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                                >
                                                    Rename
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        handleArchive(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                                >
                                                    Archive
                                                </button>

                                                <button
                                                    onClick={() => handleInvite(list.id)}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                                >
                                                    Invite member
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        handleDelete(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    setShowMenuId(null);
                                                    await handleLeave(list.id);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                            >
                                                Leave
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link to={`/list/${list.id}`} className="block">
                                <h2 className="text-xl font-semibold mb-1">{list.title}</h2>
                                <p className="text-gray-500 text-sm">Owner: {list.owner}</p>
                                <p className="text-gray-500 text-sm">
                                    Members: {list.members?.join(", ") || "None"}
                                </p>
                                <p className="text-gray-500 text-sm">{list.items.length} items</p>
                            </Link>
                        </div>
                    ))}

                    {/* Add new list */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 flex items-center justify-center text-4xl hover:bg-gray-200 transition min-h-[150px]"
                    >
                        <Plus size={60} />
                    </button>
                </div>

                {/* Modal */}
                {showModal && (
                    <NewListModal
                        onClose={() => setShowModal(false)}
                        onSubmit={addList}
                        existingLists={lists}
                    />
                )}

                {/* ARCHIVE SECTION */}
                <section>
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setShowArchive(!showArchive)}
                    >
                        <h2 className="text-xl font-semibold">Archived lists</h2>
                        {showArchive ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {showArchive && (
                        <div className="mt-6 bg-white rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {archivedLists.map((list) => (
                                <div
                                    key={list.id}
                                    className="rounded-2xl p-6 border border-gray-200 bg-white hover:shadow-md transition relative"
                                >
                                    <h2 className="text-lg font-semibold">{list.title}</h2>
                                    <p className="text-gray-500">Owner: {list.owner}</p>
                                    <p className="text-gray-500">{list.items.length} items</p>

                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={() =>
                                                setShowMenuId(showMenuId === list.id ? null : list.id)
                                            }
                                            className="text-gray-500 hover:text-gray-800"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {showMenuId === list.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        handleUnarchive(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                                >
                                                    Unarchive
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        removeList(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {archivedLists.length === 0 && (
                                <p className="text-gray-500 col-span-full">No archived lists</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}