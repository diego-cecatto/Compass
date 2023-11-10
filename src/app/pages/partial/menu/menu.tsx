import React, { Component, useMemo, useState } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { ComponentAction } from './../../../actions/component.action';
import './menu.scss';
import {
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SchoolIcon from '@mui/icons-material/School';
import { Link, useParams } from 'react-router-dom';

//todo replace any for correct usages
declare type MenuItemProp = {
    component?: any;
    submenus: NormalizedMenu;
    name: string;
} & Pick<MenuItemsProp, 'level' | 'active' | 'handleMenuClick'>;

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

const MenuItem = ({
    component,
    handleMenuClick,
    active,
    submenus,
    name,
    level = 1,
}: MenuItemProp) => {
    const [open, setOpen] = useState(level === 1);
    const path = useParams();
    const handleClick = () => {
        Object.keys(submenus || {})?.length && setOpen(!open);
        // // component && handleMenuClick(component);
    };

    function addSpacesBetweenCapitalLetters(inputString: string): string {
        var name = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
        name = name.replace(new RegExp('-', 'g'), ' ');
        return name;
    }
    return (
        <>
            <ListItem
                disablePadding
                className={`level-${level}`}
                sx={{ paddingLeft: `${8 * level}px` }}
            >
                <ListItemButton
                    onClick={handleClick}
                    selected={`/${path['*']}` === component?.basePath}
                >
                    <ListItemIcon>
                        {Object.keys(submenus ?? {}).length ? (
                            open ? (
                                <KeyboardArrowDownIcon />
                            ) : (
                                <KeyboardArrowRightIcon />
                            )
                        ) : null}
                    </ListItemIcon>

                    <ListItemText>
                        {component?.basePath ? (
                            <Link
                                to={`/component${component?.basePath}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                {addSpacesBetweenCapitalLetters(
                                    component?.name || name
                                )}
                            </Link>
                        ) : (
                            addSpacesBetweenCapitalLetters(
                                component?.name || name
                            )
                        )}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
            {open ? (
                <MenuItems
                    handleMenuClick={handleMenuClick}
                    active={active}
                    menus={submenus}
                    level={level + 1}
                />
            ) : null}
        </>
    );
};

declare type NormalizedMenu = {
    [key: string]: {
        childs: NormalizedMenu;
        component?: any;
    };
};

declare type MenuItemsProp = {
    menus: NormalizedMenu;
    handleMenuClick: (component: any) => void;
    level?: number;
} & Pick<MenuProps, 'active'>;

const MenuItems = ({
    menus,
    handleMenuClick,
    active,
    level,
}: MenuItemsProp) => {
    var menuNames = Object.keys(menus ?? {});
    if (!menuNames) {
        return <></>;
    }
    return (
        <>
            {menuNames.map((name, i) => {
                const menu = menus[name];
                return (
                    <MenuItem
                        key={name}
                        submenus={menu.childs}
                        handleMenuClick={handleMenuClick}
                        active={active}
                        component={menu.component}
                        name={name}
                        level={level}
                    />
                );
            })}
        </>
    );
};

declare type MenuProps = {
    onChange: (component: any) => void;
    active?: any;
};

export const Menu = ({ onChange, active }: MenuProps) => {
    const { loading, error, data } = useQuery(ComponentAction.menuItems());

    const normalizeMenu = () => {
        const structure: NormalizedMenu = {};
        data?.components.forEach((component: any) => {
            var submenus: string[] = component.basePath.split('/');
            // console.log(submenus[submenus.length - 1], component);
            // if (
            //     submenus[submenus.length - 1]
            //         .toLowerCase()
            //         .replace(/-/g, '')
            //         .replace(/ /g, '') ===
            //     component.name.toLowerCase().replace(/ /g, '')
            // ) {
            //     submenus = submenus.slice(0, submenus.length - 1);
            // }
            var currStructure = structure;
            var parent: any = currStructure;
            submenus.forEach((submenu) => {
                if (!submenu) {
                    return;
                }
                currStructure[submenu] = currStructure[submenu] || {
                    childs: {},
                };
                parent = currStructure[submenu];
                currStructure = currStructure[submenu].childs;
            });
            parent.component = component;
        });
        return structure;
    };

    const handleMenuClick = (component: any) => {
        onChange(component);
    };

    if (loading) return <LinearProgress />;
    // var items = useMemo(normalizeMenu, []);`
    const items = normalizeMenu();
    return (
        <List>
            <MenuItems
                menus={items}
                handleMenuClick={handleMenuClick}
                active={active}
            />
        </List>
        // <>
        //     {data.components?.map((component: any) => (
        //         <MenuItem
        //             key={component.name}
        //             component={component}
        //             handleMenuClick={() => handleMenuClick(component)}
        //             isActive={active?.name === component.name}
        //         />
        //     ))}
        // </>
    );
};
