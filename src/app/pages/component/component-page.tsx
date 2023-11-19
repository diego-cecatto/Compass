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
import { useNavigate, useParams } from 'react-router-dom';
import { ComponentAction } from '../../actions/component.action';
import { LoadingPage } from './loading-page';

declare type ComponentPageProps = {
    // component: any;
};

export const ComponentPage = ({}: ComponentPageProps) => {
    const navigate = useNavigate();
    //todo find componenent and if not found redirect to 404 page
    const path = useParams();
    const { loading, error, data } = useQuery(ComponentAction.get(), {
        variables: { path: path['*'] },
    });

    if (loading) return <CircularProgress />;
    if (error) {
        navigate('/500');
        return <p>Error :(</p>;
    }
    if (!data?.component) {
        navigate('/404');
    }
    return <ComponentDetails component={data?.component} />;
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
                <LoadingPage />
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
