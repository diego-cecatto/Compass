import React, { Suspense, SyntheticEvent, useEffect, useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { Box, CircularProgress, Tab } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { ComponentProperties } from './component.properties';
import CodeIcon from '@mui/icons-material/Code';
import PreviewIcon from '@mui/icons-material/Preview';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

declare type ComponentDetailsProps = {
    component: any;
};

export const CustomCodeBlock = (props: any) => {
    console.log(props);
    const [tab, setTab] = useState('1');

    const handleChangeTab = (
        event: SyntheticEvent<Element, Event>,
        newTab: string
    ) => {
        setTab(newTab);
        console.log(event);
    };

    const getCode = () => {
        var imports: any = {};
        var code: string = props.children[0].trim();
        code.split('\n').map((line) => {
            // if ('import')
        });
        return '<Button />';
    };
    const scope: any = { React };

    useEffect(() => {
        (async () => {
            const { Button } = await import('../../../scope/button/Button');
            scope.Button = Button;
        })();
    }, []);

    return (
        <>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChangeTab}
                        aria-label="lab API tabs example"
                    >
                        <Tab value="1" icon={<PreviewIcon />} />
                        <Tab value="2" icon={<CodeIcon />} />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Suspense fallback="Loading...">
                        <LiveProvider
                            code={getCode()}
                            scope={scope}
                            // noInline
                            enableTypeScript
                            language="tsx"
                        >
                            <LiveEditor language="tsx" />
                            <LiveError />
                            <LivePreview language="tsx" />
                        </LiveProvider>
                    </Suspense>
                </TabPanel>
                <TabPanel value="2"></TabPanel>
            </TabContext>
        </>
    );

    return <pre>{props.children}</pre>;
};
