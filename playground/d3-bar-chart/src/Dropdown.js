import React from 'react';

const Dropdown = ({ options, selected, onChange }) => {
    return (
        <select value={selected} onChange={(e) => onChange(e.target.value)}>
            <option value="">-- Select an Attribute --</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );
};

export default Dropdown;
