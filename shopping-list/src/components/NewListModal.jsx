import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function NewListModal({ onClose, onSubmit, existingLists }) {
    const dialogRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-list-title"
        >
            <div
                ref={dialogRef}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl p-6 w-full max-w-md shadow-lg transition-colors duration-300"
            >
                <h2 id="new-list-title" className="text-xl font-semibold mb-4">
                    {t("NewShopList")}
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const title = e.target.elements.title?.value.trim() || "";
                        const owner = "you";

                        if (!title) return alert(t("ListNameRequired"));
                        if (existingLists?.some((l) => l.title.toLowerCase() === title.toLowerCase())) {
                            alert(t("ListAlreadyExists"));
                            return;
                        }

                        onSubmit(title, owner);
                        onClose();
                    }}
                    className="space-y-4"
                >
                    <input
                        name="title"
                        placeholder={t("ListName")}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2"
                        required
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition"
                        >
                            {t("cancel")}
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-[#007535] hover:bg-[#008f47] text-white transition dark:bg-[#005f2a] dark:hover:bg-[#007a37]"
                        >
                            {t("add")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}