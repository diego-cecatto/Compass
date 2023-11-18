//@ts-ignore
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/Documentation.action';
import { CircularProgress } from '@mui/material';

export const EmptyState = () => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDefaultDocumentation()
    );
    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <div className="documentation">
                    <div>
                        <ReactMarkdown>
                            {`# Something is wrong\r\n\r\nWe not found any component in your path configured, see bellow how configure rightly` +
                                data?.documentationDefault}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </>
    );
};
