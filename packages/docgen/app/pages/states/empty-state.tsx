import React from 'react';
//@ts-ignore
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { LoadingPage } from '../component/loading-page';

export const EmptyState = () => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDefaultDocumentation()
    );
    if (loading) {
        return <LoadingPage />;
    }
    const indexQuickStart = data?.documentationDefault.indexOf('## Quikstart');
    let readme = data?.documentationDefault;
    const indexOfNextBlock = readme.indexOf('## What the stage to be ready ?');
    if (indexQuickStart !== -1 && indexOfNextBlock !== -1) {
        readme = readme.substr(
            indexQuickStart,
            indexOfNextBlock - indexQuickStart
        );
    }
    return (
        <>
            <div className="documentation">
                <div>
                    <ReactMarkdown>
                        {`# Something is wrong\r\n\r\nWe not found any component in your path configured, see bellow how configure rightly\r\n\r\n` +
                            readme}
                    </ReactMarkdown>
                </div>
            </div>
        </>
    );
};
