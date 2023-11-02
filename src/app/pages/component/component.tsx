import React, { useEffect } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/Documentation.action';
import { CircularProgress, Typography } from '@mui/material';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/Component.code';
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
    console.log(component);
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
                                field: 'flowType?.flowType',
                                valueGetter: (params) =>
                                    params.row.flowType?.name,
                                headerName: 'Type',
                            },
                            {
                                field: 'description',
                                headerName: 'Description',
                            },
                            {
                                field: 'required',
                                headerName: 'Required',
                            },
                            {
                                field: 'defaultValue.value',
                                valueGetter: (params) =>
                                    params.row.defaultValue?.value,
                                headerName: 'Default',
                            },
                        ]}
                        rows={
                            Object.keys(component.props).map((name) => ({
                                ...component.props[name],
                                name,
                            })) ?? []
                        }
                    />
                </div>
            )}
        </>
    );
};
