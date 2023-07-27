import React from 'react';

declare type BreadcrumbProps = {
    teste?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    teste = 'default value for teste',
}) => {
    return (
        <div>
            <p>Breadcrumb works!</p>
        </div>
    );
};
