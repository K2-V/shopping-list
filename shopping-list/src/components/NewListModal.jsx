import { useEffect, useRef } from "react";

export default function NewListModal({ onClose, onSubmit, existingLists }) {
    const dialogRef = useRef(null);

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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-list-title"
        >
            <div
                ref={dialogRef}
                className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg transition-colors duration-300"
            >
                <h2 id="new-list-title" className="text-xl font-semibold mb-4">
                    New Shopping List
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const title = e.target.elements.title?.value.trim() || "";
                        const owner = "you";
                        if (!title) return alert("List name is required");
                        if (existingLists?.some((l) => l.title.toLowerCase() === title.toLowerCase())) {
                            alert("A list with this name already exists");
                            return;
                        }
                        onSubmit(title, owner);
                        onClose();
                    }}
                    className="space-y-4"
                >
                    <input
                        name="title"
                        placeholder="List Name"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                        >Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-[#007535] hover:bg-[#008f47] text-white transition"
                        >Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}