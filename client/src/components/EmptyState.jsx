import React from 'react';

const EmptyState = ({ message, icon: Icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {Icon && (
                <div className="text-gray-300 text-6xl mb-6 opacity-50">
                    <Icon />
                </div>
            )}
            <p className="text-xl md:text-2xl text-gray-400 italic font-light max-w-lg">
                "{message}"
            </p>
        </div>
    );
};

export default EmptyState;
