"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Edit, Trash } from "lucide-react";
import Loader from "@/components/ui/loader";
import { FiHome, FiUsers, FiSettings, FiFileText, FiMenu, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';


export default function Aside({menuItems}) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB]">
                <h2 className="text-xl font-semibold text-[#212529]">Proyecto</h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.path}
                                className="flex items-center px-4 py-3 text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#007AFF] transition-colors"
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-[#E5E7EB]">
                <button className="flex items-center w-full px-4 py-2 text-[#6C757D] hover:text-[#EF4444] transition-colors">
                    <FiLogOut className="mr-3" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}