import { useState } from "react";
import NewListModal from "../components/NewListModal.jsx";
import { Plus, ChevronDown, ChevronUp, MoreVertical, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

import { useShoppingLists } from "../hooks/useShoppingLists.js";
import { useListActions } from "../hooks/useListActions.js";
import { useTheme } from "../hooks/useTheme.js";
import { useI18n } from "../hooks/useI18n.js";

export default function Home() {
    const listsCtx = useShoppingLists();
    const { t, i18n, changeLanguage } = useI18n();
    const { lists, loading, error, addList, removeList } = listsCtx;

    // Language switch handler
    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
    };

    const {
        handleRename,
        handleArchive,
        handleUnarchive,
        handleDelete,
        handleLeave,
        handleInvite,
    } = useListActions(listsCtx);

    const { theme, setTheme } = useTheme();

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
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">

            {/* HEADER */}
            <header className="w-full bg-[#007535] dark:bg-[#004d2c] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                    <h1 className="text-3xl font-normal">{t("title")}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Přepínač jazyka */}
                    <select
                        value={i18n.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                        <option value="cs">CZ</option>
                        <option value="en">EN</option>
                        <option value="de">DE</option>
                    </select>

                    {/* Přepínač dark/light */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        title="Toggle light/dark mode"
                    >
                        {theme === "dark" ? (
                            <Sun size={22} className="transition-transform duration-500" />
                        ) : (
                            <Moon size={22} className="transition-transform duration-500" />
                        )}
                    </button>
                </div>
            </header>

            <main className="px-6 max-w-6xl mx-auto space-y-10">

                {/* ACTIVE LISTS */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeLists.map((list) => (
                        <div
                            key={list.id}
                            className="rounded-2xl p-6 text-left relative group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition"
                        >
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={() =>
                                        setShowMenuId(showMenuId === list.id ? null : list.id)
                                    }
                                    className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {/* MENU */}
                                {showMenuId === list.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md z-10">

                                        {list.owner === "you" ? (
                                            <>
                                                <button onClick={() => { setShowMenuId(null); handleRename(list.id); }}
                                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    {t("rename")}
                                                </button>

                                                <button onClick={() => { setShowMenuId(null); handleArchive(list.id); }}
                                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    {t("archive")}
                                                </button>

                                                <button onClick={() => handleInvite(list.id)}
                                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    {t("invite")}
                                                </button>

                                                <button onClick={() => { setShowMenuId(null); handleDelete(list.id); }}
                                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40">
                                                    {t("delete")}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => { setShowMenuId(null); handleLeave(list.id); }}
                                                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                {t("leave")}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link to={`/list/${list.id}`} className="block">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                    {list.title}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{t("owner")}: {list.owner}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {t("members")}: {list.members?.join(", ") || "None"}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{list.items.length} {t("items")}</p>
                            </Link>
                        </div>
                    ))}

                    {/* ADD NEW LIST */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-500 dark:text-gray-300 flex items-center justify-center text-4xl hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[150px]"
                    >
                        <Plus size={60} />
                    </button>
                </div>

                {/* MODAL */}
                {showModal && (
                    <NewListModal
                        onClose={() => setShowModal(false)}
                        onSubmit={addList}
                        existingLists={lists}
                    />
                )}

                {/* ARCHIVED LISTS */}
                <section>
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setShowArchive(!showArchive)}
                    >
                        <h2 className="text-xl font-semibold">{t("archived")}</h2>
                        {showArchive ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {showArchive && (
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {archivedLists.map((list) => (
                                <div
                                    key={list.id}
                                    className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition relative"
                                >
                                    <h2 className="text-lg font-semibold">{list.title}</h2>
                                    <p className="text-gray-500">{t("owner")}: {list.owner}</p>
                                    <p className="text-gray-500">{list.items.length} {t("items")}</p>

                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={() =>
                                                setShowMenuId(showMenuId === list.id ? null : list.id)
                                            }
                                            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {showMenuId === list.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md">
                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        handleUnarchive(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    {t("unarchive")}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowMenuId(null);
                                                        removeList(list.id);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                                                >
                                                    {t("delete")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {archivedLists.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                                    {t("noarchlists")}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}