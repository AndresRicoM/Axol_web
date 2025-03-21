import React from 'react'

function ChartCard({children, title}) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-5 h-full">
            <div className="p-2">
                <h2 className="text-2xl font-semibold mb-4 text-text">
                    {title}
                </h2>

                {children}
            </div>
        </div>
    )
}

export default ChartCard
