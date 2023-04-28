import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Menu } from './components/menu';
import './base.scss';
import { BaseAction } from './actions/base.actions';
import { ComponentService } from './services/component.service';

interface MainComponentProps {
    documentationName: string;
}

const App: React.FC<MainComponentProps> = ({ documentationName }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        var cs = new ComponentService();
        var components = cs.getComponents('./src/scope');
        console.log(components);
    }, []);

    return (
        <ApolloProvider client={BaseAction.client()}>
            <div className={`main-component ${isDarkMode ? 'dark-mode' : ''}`}>
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
            </div>
        </ApolloProvider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App documentationName="Compass" />);
