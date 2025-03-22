import React from 'react';

const Project = ({ project}) => {
    const { name, updatedAt } = project;
    return (
        <div className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-textTwo text-sm">Última actualización: {updatedAt}</p>
        </div>
    );
};

export default Project;
