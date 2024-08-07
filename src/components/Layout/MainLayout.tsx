import React from 'react';
import Header from "@/components/Layout/Header";

type Props = {
    children: React.ReactNode;
}
const MainLayout = ({children}: Props) => {
    return (
        <div>
            <Header/>
            <div>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
