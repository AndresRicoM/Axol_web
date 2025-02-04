import React from "react";
import { Dropdown } from 'primereact/dropdown';

const DropdownD = () => {
    return (
        <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={cities}
            optionLabel="name"
            placeholder="Select a City"
            className="w-full md:w-14rem"
            checkmark={true}
            highlightOnSelect={false}
        />
    );
};

export default DropdownD;
