import React, { Component, useState } from 'react';
import { useQuery } from '@apollo/client';
import { MenuActions } from '../../../actions/menu.action';
import './menu.scss';
import {
    CircularProgress,
    LinearProgress,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

const MenuItem = ({ component, handleMenuClick, isActive }: MenuItemProp) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
        handleMenuClick();
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={handleClick} selected={isActive}>
                <ListItemIcon>
                    {component.submenu ? (
                        open ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowRightIcon />
                        )
                    ) : (
                        <></>
                    )}
                </ListItemIcon>
                <ListItemText primary={component.name} />
            </ListItemButton>
        </ListItem>
    );
};

declare type MenuProps = {
    onChange: (component: any) => void;
    active?: any;
};

export const Menu = ({ onChange, active }: MenuProps) => {
    const { loading, error, data } = useQuery(MenuActions.all());

    const handleMenuClick = (component: any) => {
        onChange(component);
    };

    if (loading) return <LinearProgress />;
    // if (error) return <p>Error :( </p>;
    return (
        <>
            {data.components?.map((component: any) => (
                <MenuItem
                    key={component.name}
                    component={component}
                    handleMenuClick={() => handleMenuClick(component)}
                    isActive={active?.name === component.name}
                />
            ))}
        </>
    );
};
