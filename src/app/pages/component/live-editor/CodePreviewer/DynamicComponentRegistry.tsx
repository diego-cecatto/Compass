import React, { ReactNode } from 'react';

type ComponentRegistry = {
    [componentName: string]: ReactNode;
};

const DynamicComponentRegistry: ComponentRegistry = {};

export default DynamicComponentRegistry;
