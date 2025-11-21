import React, { useEffect, useState } from 'react';
import Api from '../Api';

function CategoryDropdown({ value, onChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        Api.get('/api/categories')
            .then((res) => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    return (
        <select
            value={value}
            onChange={onChange}
            className="p-2 border rounded bg-white shadow"
        >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                    {cat.name}
                </option>
            ))}
        </select>
    );
}

export default CategoryDropdown;
