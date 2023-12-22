import React, { useEffect, useMemo, useState } from 'react';
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
    opened: boolean;
    handleClick: () => void;
} & Pick<MenuItemsProp, 'level' | 'path'>;

const MenuItem = ({
    component,
    submenus,
    name,
    selected,
    opened,
    handleClick,
    path,
    level = 1,
}: MenuItemProp) => {
    const [open, setOpen] = useState(opened);

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
            {open ? (
                <MenuItems menus={submenus} level={level + 1} path={path} />
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
    level?: number;
    path?: string;
};

const MenuItems = ({ menus, level, path = '' }: MenuItemsProp) => {
    var menuNames = Object.keys(menus ?? {});
    const urlPath = useParams();
    const navigate = useNavigate();
    if (!menuNames) {
        return null;
    }
    let opened = level === 1;
    return (
        <>
            {menuNames.map((name, i) => {
                const menu = menus[name];
                if (urlPath['*']) {
                    if (!menu?.component) {
                        opened =
                            `/${urlPath['*']}`.indexOf(`${path}/${name}`) === 0;
                    }
                }
                return (
                    <MenuItem
                        key={name}
                        submenus={menu.childs}
                        component={menu.component}
                        name={name}
                        opened={opened}
                        selected={
                            `/${urlPath['*']}` === menu?.component?.basePath
                        }
                        handleClick={() => {
                            if (menu?.component?.basePath) {
                                navigate(
                                    `/component${menu?.component?.basePath}`
                                );
                            }
                        }}
                        level={level}
                        path={`${path}/${name}`}
                    />
                );
            })}
        </>
    );
};

export const Menu = () => {
    const { loading, error, data } = useQuery(ComponentAction.menuItems());
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!data?.components || !data?.components.length) {
                navigate(`how-to-configure`);
            }
        }
    }, [loading]);

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

    var items = useMemo(() => normalizeMenu(), [loading]);

    if (loading) return <MenuLoading />;
    return (
        <List>
            <MenuItems menus={items} />
        </List>
    );
};
