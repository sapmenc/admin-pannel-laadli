import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main style={{ padding: '20px' }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
