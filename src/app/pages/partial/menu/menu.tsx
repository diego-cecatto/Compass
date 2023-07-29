import React, { Component, useState } from 'react';
import { useQuery } from '@apollo/client';
import { MenuActions } from '../../../actions/menu.action';
import './menu.scss';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SchoolIcon from '@mui/icons-material/School';
//todo replace any for correct usages
declare type MenuItemProp = {
    component: any;
    handleMenuClick: () => void;
    isActive: boolean;
};

// const MenuItem: React.FC<MenuItemProp> = ({
//     component,
//     handleMenuClick,
//     isActive,
// }) => (
//     <li>
//         <div
//             className={`menu-item${isActive ? ' active' : ''}`}
//             onClick={handleMenuClick}
//         >
//             {component.name}
//         </div>
//         {component.childs && (
//             <ul className="menu-sublist">
//                 {component.childs.map((child: any) => (
//                     <MenuItem
//                         key={child.name}
//                         component={child}
//                         handleMenuClick={handleMenuClick}
//                         isActive={isActive}
//                     />
//                 ))}
//             </ul>
//         )}
//     </li>
// );

const MenuItem = ({ component, handleMenuClick, isActive }: MenuItemProp) => (
    <ListItem disablePadding>
        <ListItemButton>
            <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {component.submenu ? <KeyboardArrowRightIcon /> : <></>}
            </ListItemIcon>
            <ListItemText primary={component.name} />
        </ListItemButton>
    </ListItem>
);

export const Menu = () => {
    const [activeMenu, setActiveMenu] = useState<any>(null);
    const { loading, error, data } = useQuery(MenuActions.all(), {
        variables: { scope: 'src/scope' },
    });

    const handleMenuClick = (componentName: any) => {
        setActiveMenu(activeMenu === componentName ? null : componentName);
    };

    if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :( </p>;
    console.log(data);
    return (
        <>
            {data.components?.map((menu: any) => (
                <MenuItem
                    key={menu.name}
                    component={menu}
                    handleMenuClick={() => handleMenuClick(menu.name)}
                    isActive={activeMenu === menu.name}
                />
            ))}
        </>
    );
};
