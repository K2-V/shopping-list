export function useListActions(shoppingListsContext) {
    const {
        lists,
        updateList,
        removeList,
        inviteMember,
        removeMember,
    } = shoppingListsContext;


    const handleRename = (id) => {
        const list = lists.find((l) => l.id === id);
        if (!list) return;

        const newName = prompt("Enter new name:", list.title);
        if (!newName || !newName.trim()) return;

        updateList(id, { title: newName.trim() });
    };

    const handleArchive = (id) => {
        updateList(id, { archived: true });
    };

    const handleUnarchive = (id) => {
        updateList(id, { archived: false });
    };

    const handleDelete = async (id) => {
        const sure = confirm("Do you really want to delete this list?");
        if (!sure) return;
        await removeList(id);
    };

    const handleLeave = async (id) => {
        const list = lists.find((l) => l.id === id);
        if (!list) return;

        const sure = confirm("Do you want to leave this list?");
        if (!sure) return;

        const newMembers = (list.members || []).filter((m) => m !== "you");
        await updateList(id, { members: newMembers });
    };

    const handleInvite = async (id) => {
        const name = prompt("Enter new member:");
        if (!name) return;
        await inviteMember(id, name);
    };

    const handleRemoveMemberClick = async (id, member) => {
        const sure = confirm(`Remove user "${member}" from this list?`);
        if (!sure) return;
        await removeMember(id, member);
    };

    return {
        handleRename,
        handleArchive,
        handleUnarchive,
        handleDelete,
        handleLeave,
        handleInvite,
        handleRemoveMemberClick,
    };
}