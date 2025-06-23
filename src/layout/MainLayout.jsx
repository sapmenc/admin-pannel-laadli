import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div>
            <main style={{ padding: '0px' }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
