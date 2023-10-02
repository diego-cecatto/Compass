import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BaseAction } from './app/actions/base.actions';
import { ComponentService } from './services/component.service';
import BaseLayout from './app/pages/partial/base';

interface MainComponentProps {
    documentationName: string;
}

const App: React.FC<MainComponentProps> = ({ documentationName }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        // var cs = new ComponentService();
        // var components = cs.getComponents('./src/example');
        // console.log(components);
    }, []);

    return (
        <React.StrictMode>
            <ApolloProvider
                client={
                    new ApolloClient({
                        uri: 'http://localhost:5000/graphql',
                        cache: new InMemoryCache(),
                    })
                }
            >
                {/* <div className={`main-component ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="header">
                    <div className="title">
                        <i className="material-icons">menu</i>
                        <span>{documentationName}</span>
                    </div>
                    <div
                        className="theme-toggle"
                        onClick={handleDarkModeToggle}
                    >
                        {isDarkMode ? (
                            <i className="material-icons">brightness_high</i>
                        ) : (
                            <i className="material-icons">brightness_4</i>
                        )}
                    </div>
                </div>
                <div className="content">
                    <Menu />
                </div>
            </div> */}
                <BaseLayout />
            </ApolloProvider>
        </React.StrictMode>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App documentationName="Compass" />);
