"use client";
import React, { useState, useEffect } from "react";
import { FiHome, FiUsers, FiSettings, FiFileText, FiMenu, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';



export default function Header({ menuItems, setMobileMenuOpen, mobileMenuOpen, userId, project }) {
    const handle = (funcion)=>{
        setMobileMenuOpen(false);
        funcion()
    }
    return (
        <>
            <header className="bg-white border-b border-[#E5E7EB] p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        className="md:hidden text-[#212529] mr-3"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <h1 className="text-xl font-semibold text-[#212529]">{project?.name}</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center">
                        {userId?.charAt(0) || 'V'}
                    </div>
                </div>
            </header>

            {/* Menú móvil */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] z-10">
                    <nav className="py-2">
                        <ul>
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    {item.path ? (
                                        <a
                                            href={item.path}
                                            className="flex items-center px-4 py-3 text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#007AFF] transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.icon} {item.label}
                                        </a>
                                    ) : (
                                        <button
                                            onClick={()=> handle(item.onClick)}
                                            className="flex items-center px-4 py-3 w-full text-left text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#007AFF] transition-colors"
                                        >
                                            {item.icon} {item.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                            <li>
                                <button className="flex items-center w-full px-4 py-3 text-[#6C757D] hover:text-[#EF4444] transition-colors">
                                    <FiLogOut className="mr-3" />
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

        </>
    )
}