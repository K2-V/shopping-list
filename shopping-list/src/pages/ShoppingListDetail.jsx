import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Plus, ArrowLeft, MoreVertical } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

import { useShoppingLists } from "../hooks/useShoppingLists.js";
import { useListActions } from "../hooks/useListActions.js";
import { useListItems } from "../hooks/useListItems.js";

export default function ShoppingListDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const listsCtx = useShoppingLists();
    const { lists, updateList } = listsCtx;

    const actions = useListActions(listsCtx);
    const {
        handleRename,
        handleArchive,
        handleDelete,
        handleLeave,
        handleInvite,
        handleRemoveMemberClick,
    } = actions;

    const [list, setList] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!Array.isArray(lists) || lists.length === 0) return;
        const found = lists.find((l) => String(l.id) === id);
        if (found) setList(found);
        else navigate("/");
    }, [id, lists, navigate]);

    const {
        items,
        adding,
        setAdding,
        handleAddItem,
        deleteItem,
        toggleDone,
    } = useListItems(list, setList, updateList);

    if (!list) {
        return (
            <p className="text-gray-600 p-10 text-center">
                {t("loading")}
            </p>
        );
    }

    const visibleItems = showCompleted ? items : items.filter((i) => !i.isDone);

    const totalCount = items.length;
    const doneCount = items.filter((i) => i.isDone).length;

    const pieData = [
        { name: t("completed"), value: doneCount },
        { name: t("pending"), value: totalCount - doneCount },
    ];

    const COLORS = ["#007535", "#ccc"];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <header className="bg-[#007535] dark:bg-[#004d2c] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="hover:opacity-80">
                    <ArrowLeft size={26} />
                </button>
                <h1 className="text-3xl font-semibold flex-1">{list.title}</h1>
            </header>

            <main className="px-6 max-w-4xl mx-auto space-y-6">

                {/* Menu */}
                <div className="flex justify-between items-center relative">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showCompleted}
                            onChange={(e) => setShowCompleted(e.target.checked)}
                        />
                        {t("showCompleted")}
                    </label>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                            {visibleItems.length} {t("items")}
                        </span>

                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-10">
                                {list.owner === "you" ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                handleRename(list.id);
                                            }}
                                            className=" w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                                            {t("rename")}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                handleArchive(list.id);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                                            {t("archive")}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleInvite(list.id, prompt(t("enterMemberName") + ":"))
                                            }
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {t("invite")}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                handleDelete(list.id);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                        >
                                            {t("delete")}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            setShowMenu(false);
                                            await handleLeave(list.id);
                                            navigate("/");
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {t("leave")}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow">
                        {visibleItems.length === 0 ? (
                            <p className="text-gray-500 text-center">{t("noItems")}</p>
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
                                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                                {item.name}{" "}
                                                {item.quantity &&
                                                    `(${item.quantity}${item.unit ? ` ${item.unit}` : ""})`}
                                            </p>
                                            {item.note && (
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="text-gray-400 dark:text-gray-300 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Graf */}
                    <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow flex flex-col items-center justify-center">
                        <h2 className="font-semibold mb-3">{t("taskStatus")}</h2>
                        <div className="relative w-52 h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                        cornerRadius={0}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-3xl font-bold text-[#007535]">
                                    {totalCount > 0
                                        ? ((doneCount / totalCount) * 100).toFixed(0)
                                        : 0}
                                    %
                                </p>
                                <p className="text-gray-500 text-sm">{t("completed")}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#007535] dark:bg-[#22c55e]" />
                                <span className="text-sm text-gray-700 dark:text-gray-100">{t("completed")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-gray-100 dark:bg-gray-100" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t("pending")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add item */}
                <form
                    onSubmit={handleAddItem}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow p-4 flex flex-wrap gap-3 mt-6"
                >
                    <input
                        placeholder={t("itemName") + " *"}
                        value={adding.name}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, name: e.target.value }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                        required
                    />

                    <input
                        placeholder={t("qty")}
                        type="number"
                        value={adding.quantity}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, quantity: e.target.value }))
                        }
                        className="w-24 border border-gray-300 rounded-lg p-2"
                    />

                    <input
                        placeholder={t("unit")}
                        value={adding.unit}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, unit: e.target.value }))
                        }
                        className="w-24 border border-gray-300 rounded-lg p-2"
                    />

                    <input
                        placeholder={t("note")}
                        value={adding.note}
                        onChange={(e) =>
                            setAdding((a) => ({ ...a, note: e.target.value }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                    />

                    <button
                        type="submit"
                        className="bg-[#007535] text-white px-4 py-2 rounded-lg hover:bg-[#008f47] flex items-center gap-2"
                    >
                        <Plus size={18} /> {t("add")}
                    </button>
                </form>

                {/* Members */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                        {t("members")}
                    </h2>

                    <ul className="space-y-1">
                        {Array.isArray(list.members) && list.members.length > 0 ? (
                            list.members.map((member) => (
                                <li
                                    key={member}
                                    className="flex justify-between items-center border-b border-gray-200 py-1"
                                >
                                    <span>{member}</span>

                                    {list.owner === "you" && member !== "you" && (
                                        <button
                                            onClick={() =>
                                                handleRemoveMemberClick(list.id, member)
                                            }
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            {t("remove")}
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("noMembers")}
                            </p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
}