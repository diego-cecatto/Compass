import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { useEffect } from 'react';
declare type ComponentDetailsProps = {
    component: any;
};
export const ComponentDetails = ({ component }: ComponentDetailsProps) => {
    const { loading, error, data, refetch, updateQuery } = useQuery(
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
                <div>
                    <ReactMarkdown>{data?.documentation}</ReactMarkdown>
                </div>
            )}
        </>
    );
};
