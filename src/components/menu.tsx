import React, { Component, useState } from 'react';
import { useQuery } from '@apollo/client';
import { MenuActions } from './../actions/menu.action';
import './menu.scss';

//todo replace any for correct usages
declare type MenuItemProp = {
    component: any;
    handleMenuClick: () => void;
    isActive: boolean;
};

const MenuItem: React.FC<MenuItemProp> = ({
    component,
    handleMenuClick,
    isActive,
}) => (
    <li>
        <div
            className={`menu-item${isActive ? ' active' : ''}`}
            onClick={handleMenuClick}
        >
            {component.name}
        </div>
        {component.childs && (
            <ul className="menu-sublist">
                {component.childs.map((child: any) => (
                    <MenuItem
                        key={child.name}
                        component={child}
                        handleMenuClick={handleMenuClick}
                        isActive={isActive}
                    />
                ))}
            </ul>
        )}
    </li>
);

export const Menu = () => {
    const [activeMenu, setActiveMenu] = useState<any>(null);
    // const { loading, error, data } = useQuery(MenuActions.all());

    return <>menu</>;
    // const handleMenuClick = (componentName: any) => {
    //     setActiveMenu(activeMenu === componentName ? null : componentName);
    // };

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :( </p>;

    // return (
    //     <div className="menu">
    //         <ul className="menu-list">
    //             <MenuItem
    //                 key={data.component.name}
    //                 component={data.component}
    //                 handleMenuClick={() => handleMenuClick(data.component.name)}
    //                 isActive={activeMenu === data.component.name}
    //             />
    //         </ul>
    //     </div>
    // );
};
