import React from 'react';

function ConfirmModalComponent({ title, message, onConfirm, onCancel, confirmText, cancelText }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#202124] p-6 rounded-lg text-center text-zinc-50 shadow-lg">
                <h2 className="text-lg font-bold mb-3">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-around">
                    <button
                        onClick={onCancel}
                        className="bg-[#6d2b2b] text-zinc-50 py-2 px-4 rounded hover:brightness-105"
                    >
                        {cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-[#5c5470] text-zinc-50 py-2 px-4 rounded hover:brightness-105"
                    >
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModalComponent;
