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
import { CustomCodeBlock } from './omponent.code';

declare type ComponentDetailsProps = {
    component: any;
};

export const ComponentDetails = ({ component }: ComponentDetailsProps) => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDocumentation(),
        {
            variables: { path: component?.path },
        }
    );

    useEffect(() => {
        refetch({ path: component?.path });
    }, [component?.path]);

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <div>
                        <ReactMarkdown
                            // rehypePlugins={[rehypeReact]}
                            components={{
                                code: CustomCodeBlock,
                            }}
                        >
                            {data?.documentation}
                        </ReactMarkdown>
                    </div>
                    <div>
                        <ComponentProperties component={component} />
                    </div>
                </>
            )}
        </>
    );
};
