import React, { useEffect } from 'react';
// @ts-ignore
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/Documentation.action';
import { CircularProgress, Grid } from '@mui/material';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import { CodePreview } from './live-editor/code-preview';
import './component.scss';
import { ComponentProperties } from './properties/component-properties';
import { useNavigate, useParams } from 'react-router-dom';
import { ComponentAction } from '../../actions/component.action';
import { LoadingPage } from './loading-page';
import { ComponentVersion } from './version/component-version';
import { ComponentInstall } from './install/component-install';
import { useDispatch, useSelector } from 'react-redux';
import { add, clear } from '../partial/sections/component-section.slice';
import ComponentSection from '../partial/sections/component-section';

declare type ComponentPageProps = {
    // component: any;
};

export const ComponentPage = ({}: ComponentPageProps) => {
    const navigate = useNavigate();
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
    const dispatch = useDispatch();
    const sections = useSelector((state: any) => state.sectionItems.sections);
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDocumentation(),
        {
            variables: { path: component?.docPath },
        }
    );

    useEffect(() => {
        refetch({ path: component?.docPath });
        dispatch(clear());
    }, [component?.docPath]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 242px' }}>
            <div
                className="documentation"
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    minWidth: '0',
                }}
            >
                <div>
                    <Grid container className="headerInfo">
                        <Grid item xs="auto" id="version">
                            <ComponentVersion local={component.version} />
                        </Grid>
                        <Grid xs item id="install-command">
                            <ComponentInstall name="@scope/component" />
                        </Grid>
                    </Grid>
                    <ReactMarkdown
                        // rehypePlugins={[rehypeReact]}
                        components={{
                            code: (props) => (
                                <CodePreview
                                    component={component}
                                    code={props}
                                />
                            ),
                            h1: (props) => {
                                dispatch(add(props.children as string));
                                return (
                                    <h1
                                        id={
                                            sections[props.children as string]
                                                ?.id || null
                                        }
                                    >
                                        {props.children}
                                    </h1>
                                );
                            },
                            h2: (props) => {
                                dispatch(add(props.children as string));
                                return (
                                    <h2
                                        id={
                                            sections[props.children as string]
                                                ?.id || null
                                        }
                                    >
                                        {props.children}
                                    </h2>
                                );
                            },
                        }}
                    >
                        {data?.documentation}
                    </ReactMarkdown>
                </div>
                {component.props ? (
                    <ComponentProperties component={component} />
                ) : null}
            </div>
            <ComponentSection />
        </div>
    );
};
