import { useEffect } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/Documentation.action';
import { CircularProgress } from '@mui/material';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/CodePreview';
import './component.scss';
import { ComponentProperties } from './ComponentProperties';

declare type ComponentDetailsProps = {
    component: any;
};

export const ComponentDetails = ({ component }: ComponentDetailsProps) => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDocumentation(),
        {
            variables: { path: component?.docPath },
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
                    <ComponentProperties component={component} />
                </div>
            )}
        </>
    );
};
