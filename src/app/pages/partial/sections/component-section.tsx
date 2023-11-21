import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import { Link, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ComponentSection() {
    const sections = useSelector((state: any) => state.sectionItems.sections);
    const [existScrollBar, setScroll] = useState(false);
    const timerRef = React.useRef<any>();

    const existScollBarV = () => {
        return document.documentElement.scrollHeight > window.innerHeight;
    };

    const showOnlyIfScroll = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (existScollBarV()) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        }, 200);
    };

    useEffect(() => {
        showOnlyIfScroll();
        window.addEventListener('resize', showOnlyIfScroll);
        return () => {
            window.removeEventListener('resize', showOnlyIfScroll);
        };
    }, []);

    if (!existScrollBar) {
        return <></>;
    }

    return (
        <div className="submenu-section">
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Sections
                    </ListSubheader>
                }
            >
                {Object.keys(sections).map((name: any) => {
                    const section = sections[name];
                    if (name.length > 15) {
                        name = name.substring(0, 15) + '...';
                    }
                    return (
                        <ListItem
                            key={section.id}
                            className="list-item-section"
                        >
                            <ListItemText
                                className="section-item"
                                primary={
                                    <Link
                                        className="section-link"
                                        href={`#${section.id}`}
                                    >
                                        {name}
                                    </Link>
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
