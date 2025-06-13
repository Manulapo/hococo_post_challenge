/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export function Modal({ isOpen, onClose, children }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) setShow(true);
        else {
            const timeout = setTimeout(() => setShow(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    const handleBackgroundClick = (e: any) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen && !show) return null;

    return (
        // backdrop
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={handleBackgroundClick}
        >
            {/* modal content */}
            <div
                ref={modalRef}
                className={`bg-white rounded-lg relative w-[90%] md:w-lg transition-all shadow-md duration-200 p-2 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X className="w-5 h-5 cursor-pointer" />
                </button>
                {children}
            </div>
        </div>
    );
}