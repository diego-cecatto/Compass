import React, { Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import BaseLayout from './app/pages/partial/base';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ComponentPage } from './app/pages/component/component-page';
import NotFoundPage from './app/pages/states/404';
import Error500 from './app/pages/states/500';
import { EmptyState } from './app/pages/states/empty-state';
import { Provider } from 'react-redux';
import store from './app/config/store';

interface MainComponentProps {
    documentationName: string;
}

const App: React.FC<MainComponentProps> = ({ documentationName }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <React.StrictMode>
            <Provider store={store}>
                <ApolloProvider
                    client={
                        new ApolloClient({
                            uri: 'http://localhost:5000/graphql',
                            cache: new InMemoryCache(),
                        })
                    }
                >
                    <BrowserRouter>
                        <Suspense fallback={<BaseLayout />}>
                            <Routes>
                                <Route path="/" element={<BaseLayout />}>
                                    <Route index={true} />
                                    <Route
                                        path="/component/*"
                                        Component={ComponentPage}
                                    />
                                </Route>
                                <Route
                                    path="/how-to-configure"
                                    element={<EmptyState />}
                                />
                                <Route path="/500" element={<Error500 />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </ApolloProvider>
            </Provider>
        </React.StrictMode>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App documentationName="Docmate" />);
