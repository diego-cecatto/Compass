import React, { useMemo, useState } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { ComponentAction } from './../../../actions/component.action';
import './menu.scss';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MenuLoading } from './menu-loading';

//todo replace any for correct usages
declare type MenuItemProp = {
    component?: any;
    submenus: NormalizedMenu;
    selected: boolean;
    name: string;
    handleClick: () => void;
} & Pick<MenuItemsProp, 'level'>;

const MenuItem = ({
    component,
    submenus,
    name,
    selected,
    handleClick,
    level = 1,
}: MenuItemProp) => {
    const [open, setOpen] = useState(level === 1);

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
                    onClick={() => {
                        Object.keys(submenus || {})?.length && setOpen(!open);
                        handleClick();
                    }}
                    selected={selected}
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
                        {addSpacesBetweenCapitalLetters(
                            component?.name || name
                        )}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
            {open ? <MenuItems menus={submenus} level={level + 1} /> : null}
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
    level?: number;
};

const MenuItems = ({ menus, level }: MenuItemsProp) => {
    var menuNames = Object.keys(menus ?? {});
    const path = useParams();
    const navigate = useNavigate();
    if (!menuNames) {
        return null;
    }
    return (
        <>
            {menuNames.map((name, i) => {
                const menu = menus[name];
                return (
                    <MenuItem
                        key={name}
                        submenus={menu.childs}
                        component={menu.component}
                        name={name}
                        selected={`/${path['*']}` === menu?.component?.basePath}
                        handleClick={() => {
                            if (menu?.component?.basePath) {
                                navigate(
                                    `/component${menu?.component?.basePath}`
                                );
                            }
                        }}
                        level={level}
                    />
                );
            })}
        </>
    );
};

export const Menu = () => {
    const { loading, error, data } = useQuery(ComponentAction.menuItems());

    const normalizeMenu = () => {
        const structure: NormalizedMenu = {};
        data?.components.forEach((component: any) => {
            var submenus: string[] = component.basePath.split('/');
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

    if (loading) return <MenuLoading />;
    // var items = useMemo(normalizeMenu, []);`
    const items = normalizeMenu();
    return (
        <List>
            <MenuItems menus={items} />
        </List>
    );
};
