"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUsers, FiPlus, FiFileText, FiMenu, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';


export default function Error({error}) {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 relative"
                >
                    <button
                        onClick={() => setError(null)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                    <p className="text-sm">{error}</p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}