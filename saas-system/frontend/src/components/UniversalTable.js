import React from 'react';

const UniversalTable = ({ headers, data, renderRow }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                        {renderRow(item)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UniversalTable;