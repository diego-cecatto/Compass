import React, { useEffect } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/Documentation.action';
import { CircularProgress } from '@mui/material';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/code-preview';
import './component.scss';
import { ComponentProperties } from './component-properties';
import { useParams } from 'react-router-dom';
import { ComponentAction } from '../../actions/component.action';

declare type ComponentPageProps = {
    // component: any;
};

export const ComponentPage = ({}: ComponentPageProps) => {
    //todo find componenent and if not found redirect to 404 page
    const path = useParams();
    const {
        loading,
        error,
        data: component,
    } = useQuery(ComponentAction.get(), {
        variables: { path: path['*'] },
    });

    if (loading) return <CircularProgress />;
    return <ComponentDetails component={component?.component} />;
};

const ComponentDetails = ({ component }: any) => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDocumentation(),
        {
            variables: { path: component?.docPath },
        }
    );
    useEffect(() => {
        refetch({ path: component?.docPath });
    }, [component?.docPath]);

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
                    {component.props ? (
                        <ComponentProperties component={component} />
                    ) : null}
                </div>
            )}
        </>
    );
};
