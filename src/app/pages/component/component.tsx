import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { CircularProgress, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/component.code';
import { DataGrid } from '@mui/x-data-grid';
import './component.scss';

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
                <div className="documentation">
                    <div>
                        <ReactMarkdown
                            // rehypePlugins={[rehypeReact]}
                            components={{
                                code: (props) => (
                                    <CodePreview
                                        component={component}
                                        code={props}
                                    />
                                ),
                            }}
                        >
                            {data?.documentation}
                        </ReactMarkdown>
                    </div>
                    <Typography
                        variant="h1"
                        component="h2"
                        className="sub-title"
                    >
                        Properties
                    </Typography>
                    <DataGrid
                        getRowId={(data) => data.name}
                        columns={[
                            {
                                field: 'name',
                                headerName: 'Name',
                            },
                            {
                                field: 'type',
                                headerName: 'Type',
                            },
                            {
                                field: 'description',
                                headerName: 'Description',
                            },
                        ]}
                        rows={component.prop.properties ?? []}
                    />
                </div>
            )}
        </>
    );
};
