import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/component.code';

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
                                code: (props) => <CodePreview />,
                            }}
                        >
                            {data?.documentation}
                        </ReactMarkdown>
                    </div>
                    <div></div>
                </>
            )}
        </>
    );
};
