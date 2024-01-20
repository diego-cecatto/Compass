import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Skeleton,
} from '@mui/material';

declare type MenuLoadingProps = {};

export const MenuLoading = () => {
    return (
        <List>
            {Array.from(Array(10).keys()).map((i) => (
                <ListItem
                    key={i}
                    disablePadding
                    // className={`level-${level}`}
                    // sx={{ paddingLeft: `${8 * level}px` }}
                >
                    <ListItemButton>
                        <ListItemText>
                            <Skeleton />
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
