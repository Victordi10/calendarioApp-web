import React, { useState } from 'react';
import { Calendar, Clock, Hash, FileText, Award, LayoutGrid } from 'lucide-react';

const EventDisplay = ({ event }) => {
    const [view, setView] = useState('grid');

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('default', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Get appropriate badge color based on status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'published': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get icon based on social media
    const getSocialMediaIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'facebook':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
                return (
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                        <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                        <circle cx="18.406" cy="5.594" r="1.44" />
                    </svg>
                );
            case 'twitter':
                return (
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                );
            case 'linkedin':
                return (
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                );
            case 'tiktok':
                return (
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                );
            default:
                return <LayoutGrid className="w-5 h-5 text-gray-600" />;
        }
    };

    // Get icon based on format
    const getFormatIcon = (format) => {
        switch (format.toLowerCase()) {
            case 'image': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
            case 'video': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>;
            case 'carousel': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>;
            case 'text': return <FileText className="w-4 h-4" />;
            case 'story': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
            default: return <LayoutGrid className="w-4 h-4" />;
        }
    };

    // If event is not provided, show placeholder
    if (!event) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first content piece</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Only keep view toggle controls */}
            <div className="p-4 md:p-6 bg-gray-50 border-b">
                <div className="flex justify-end">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 text-sm font-medium rounded-l-md border ${view === 'grid' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 text-sm font-medium rounded-r-md border ${view === 'list' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {view === 'grid' ? (
                <div className="p-4 md:p-6">
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex-shrink-0">
                                    {getSocialMediaIcon(event.socialMedia)}
                                </div>
                                <div className="ml-2 flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 capitalize">{event.socialMedia}</p>
                                </div>
                                <div className="ml-2 flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 capitalize">{event.objective}</p>category
                                </div>
                                <div className="ml-2 flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 capitalize">{event.category}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {formatDate(event.time)}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                                <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-500 uppercase mr-1">Tipo:</span>
                                    <span className="capitalize">{event.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-500 uppercase mr-1">formato:</span>
                                    <div className="flex items-center">
                                        {getFormatIcon(event.format)}
                                        <span className="ml-1 capitalize">{event.format}</span>
                                    </div>
                                </div>
                            </div>

                            {event.text && (
                                <div className="mt-2 mb-3">
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.text}</p>
                                </div>
                            )}

                            {event.hashtags && (
                                <div className="flex items-center text-xs text-blue-600 mt-2">
                                    <Hash className="h-3 w-3 mr-1" />
                                    <p className="truncate">{event.hashtags}</p>
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right">
                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-sm text-gray-500 capitalize">Tipo: {event.cycle}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {getSocialMediaIcon(event.socialMedia)}
                                        <span className="ml-2 text-sm text-gray-900 capitalize">{event.socialMedia}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{event.category}</div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        {getFormatIcon(event.format)}
                                        <span className="ml-1 capitalize">{event.format}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(event.time)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventDisplay;