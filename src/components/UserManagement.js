import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [editFormValues, setEditFormValues] = useState({
        id: null,
        name: '',
        email: '',
        city: '',
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormValues, setCreateFormValues] = useState({
        name: '',
        email: '',
        city: '',
    });

    useEffect(() => {
        getUsers();
    }, []);

    const baseURL = 'https://jsonplaceholder.typicode.com/users';

    const getUsers = async () => {
        try {
            const response = await axios.get(baseURL);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const searchUsers = async () => {
        try {
            const response = await axios.get(baseURL);
            const filteredUsers = response.data.filter(user =>
                user.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`${baseURL}/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditFormValues({
            id: user.id,
            name: user.name,
            email: user.email,
            city: user.address?.city || '', 
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${baseURL}/${editFormValues.id}`, editFormValues);
            const updatedUsers = users.map(user =>
                user.id === editFormValues.id ? { ...user, name: editFormValues.name, email: editFormValues.email, address: { ...user.address, city: editFormValues.city } } : user
            );
            setUsers(updatedUsers);
            setShowEditForm(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                name: createFormValues.name,
                email: createFormValues.email,
                address: {
                    city: createFormValues.city,
                },
            };
            const response = await axios.post(baseURL, newUser);
            const createdUser = response.data;
            setUsers([...users, createdUser]); // Add the new user to the existing users list
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleChange = (e) => {
        setEditFormValues({
            ...editFormValues,
            [e.target.name]: e.target.value,
        });
        setCreateFormValues({
            ...createFormValues,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold my-4">User Management System</h1>

            <div className="flex items-center space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
                />
                <button onClick={searchUsers} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Search
                </button>
                <button onClick={() => setShowCreateForm(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Create New User
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreateSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md w-96 mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={createFormValues.name}
                        onChange={(e) => handleChange(e, 'create')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={createFormValues.email}
                        onChange={(e) => handleChange(e, 'create')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={createFormValues.city}
                        onChange={(e) => handleChange(e, 'create')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Save
                        </button>
                    </div>
                </form>
            )}

            {showEditForm && (
                <form onSubmit={handleEditSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md w-96 mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editFormValues.name}
                        onChange={(e) => handleChange(e, 'edit')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={editFormValues.email}
                        onChange={(e) => handleChange(e, 'edit')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={editFormValues.city}
                        onChange={(e) => handleChange(e, 'edit')}
                        className="block w-full border border-gray-300 px-4 py-2 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Save
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-4 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-4 transform transition duration-300 hover:scale-105">
                        <h3 className="text-xl font-bold mb-2">{user.name}</h3>
                        <p className="text-gray-700 mb-2">Email: {user.email}</p>
                        <p className="text-gray-700 mb-4">City: {user.address.city}</p>
                        <div className="flex justify-between">
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => deleteUser(user.id)}>
                                Delete
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => handleEdit(user)}>
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
