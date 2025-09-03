import React from 'react'

function InputTextLabel({ name, value, setValue, text, width='full' }) {
    return (
        <div>
            <label htmlFor="homehubName" className="ml-3 absolute text-[#9A9A9A]">{text}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={e => setValue(e.target.value)}
                className={`pt-5 border-[#9A9A9A] rounded-md w-${width}`}
            />
        </div>
    )
}

export default InputTextLabel
