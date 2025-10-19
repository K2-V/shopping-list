import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
// import { Link } from 'react-router-dom';

const Home = () => {
    const [lists, setLists] = useState([
        { id: 1, name: 'Tesco', owner: 'you', items: [] },
        { id: 2, name: 'Grill', owner: 'Petr', items: ['Maso', 'Uhlí', 'Chléb'] },
        { id: 3, name: 'Birthday party', owner: 'Jane', items: [] },
    ]);

    // Načíst seznamy z localStorage
    useEffect(() => {
        const savedLists = JSON.parse(localStorage.getItem('shoppingLists'));
        if (savedLists) setLists(savedLists);
    }, []);

    // Uložit seznamy při změně
    useEffect(() => {
        localStorage.setItem('shoppingLists', JSON.stringify(lists));
    }, [lists]);

    const handleAdd = () => {
        const name = prompt('Zadej název seznamu:');
        if (!name) return;

        const owner = prompt('Zadej jméno vlastníka:', 'you');
        const newList = {
            id: Date.now(),
            name: name.trim(),
            owner: (owner || 'you').trim(),
            items: [],
        };
        setLists([...lists, newList]);
    };

    return (
        <div className="min-h-screen bg-[#ededed]">
            {/* Horní lišta */}
            <header className="w-full bg-[#007535] text-white px-6 py-4 rounded-b-3xl mb-6 flex items-center space-x-4">
                <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                <h1 className="text-3xl font-normal">Shopping List</h1>
            </header>

            {/* Obsah */}
            <main className="px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lists.map((list) => (
                        <div
                            key={list.id}
                            className="bg-white rounded-2xl p-6 text-left"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">{list.name}</h2>
                            <p className="text-gray-500">Owner: {list.owner}</p>
                            <p className="text-gray-500">{list.items.length} items</p>
                        </div>
                    ))}

                    {/* Přidávací box */}
                    <button
                        onClick={handleAdd}
                        className="bg-white rounded-2xl text-gray-500 flex items-center justify-center text-4xl hover:bg-gray-100 transition text-center"
                    >
                        <Plus size={60} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;