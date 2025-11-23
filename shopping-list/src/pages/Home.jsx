import { useState } from "react";
import NewListModal from "../components/NewListModal.jsx";
import { Plus, ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_DATA } from "../data/listsDetail.js";

export default function Home() {
  const [lists, setLists] = useState(MOCK_DATA);
  const [showModal, setShowModal] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);

  const activeLists = lists.filter((l) => !l.archived);
  const archivedLists = lists.filter((l) => l.archived);

  function handleAddList(title, owner) {
    const newList = {
      id: String(Date.now()),
      title,
      owner: owner || "you",
      members: [],
      archived: false,
      items: []
    };
    setLists((prev) => [newList, ...prev]);
  }

  function handleDelete(id) {
    if (!confirm("Delete this list?")) return;
    setLists((prev) => prev.filter((l) => l.id !== id));
  }

  function handleLeave(id) {
      if (!confirm("Do you want to leave this list?")) return;
      setLists((prev) => prev.filter((l) => l.id !== id));
  }


  function handleRename(id) {
    const list = lists.find((l) => l.id === id);
    if (!list) return;
    const newName = prompt("Enter new list name:", list.title);
    if (!newName || !newName.trim()) return;
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, title: newName.trim() } : l))
    );
  }

  function handleArchive(id) {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, archived: true } : l))
    );
  }

  function handleUnarchive(id) {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, archived: false } : l))
    );
  }

  function handleInvite(id) {
    const mem = prompt("Enter new member:");
    if (!mem || !mem.trim()) return;
    setLists((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, members: [...(l.members || []), mem.trim()] }
          : l
      )
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900">
      <header className="w-full bg-[#007535] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center space-between">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" className="h-10 w-10" />
          <h1 className="text-3xl font-normal">ShoppingList</h1>
        </div>
      </header>

      <main className="px-6 max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeLists.map((list) => (
            <div
              key={list.id}
              className="rounded-2xl p-6 border border-gray-200 hover:shadow-lg relative"
            >
                {/*Vertical Menu*/}
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
                          Invite
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
                        onClick={() => {
                          setShowMenuId(null);
                          handleLeave(list.id);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                )}
              </div>

              <Link to={`/list/${list.id}`}>
                <h2 className="text-xl font-semibold mb-1">{list.title}</h2>
                <p className="text-gray-500 text-sm">Owner: {list.owner}</p>
                <p className="text-gray-500 text-sm">
                  Members: {Array.isArray(list.members) ? list.members.join(", ") : ""}
                </p>
                <p className="text-gray-500 text-sm">{list.items.length} Items</p>
              </Link>
            </div>
          ))}
            {/*Create new List with Modal Window*/}
          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 flex justify-center items-center text-4xl hover:bg-gray-200 min-h-[150px]"
          > <Plus size={60} />
          </button>
        </div>

        {showModal && (
          <NewListModal
            existingLists={lists}
            onClose={() => setShowModal(false)}
            onSubmit={(title) => {
              handleAddList(title, "You");
              setShowModal(false);
            }}
          />
        )}

        <section>
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => setShowArchive(!showArchive)}
          >
            <h2 className="text-xl font-semibold">Archived</h2>
            {showArchive ? <ChevronUp /> : <ChevronDown />}
          </div>

          {showArchive && (
            <div className="mt-6 bg-white rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedLists.map((list) => (
                <div
                  key={list.id}
                  className="rounded-2xl p-6 border border-gray-200 hover:shadow-md relative"
                >
                  <h2 className="text-lg font-semibold">{list.title}</h2>
                  <p className="text-gray-500">Owner: {list.owner}</p>
                  <p className="text-gray-500">{list.items.length} Items</p>

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
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
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
                                handleDelete(list.id);
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
