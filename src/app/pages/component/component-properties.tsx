import React from 'react';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

type ComponentPropertiesProps = {
    component: any;
};

export const ComponentProperties = ({
    component,
}: ComponentPropertiesProps) => {
    return (
        <>
            <Typography variant="h1" component="h2" className="sub-title">
                Properties
            </Typography>
            <div style={{ width: '100%' }}>
                <DataGrid
                    getRowId={(data) => data.name}
                    hideFooter
                    columns={[
                        {
                            field: 'name',
                            headerName: 'Name',
                            width: 100,
                        },
                        {
                            field: 'flowType?.flowType',
                            valueGetter: (params) => params.row.flowType?.name,
                            headerName: 'Type',
                            flex: 0.1,
                        },

                        {
                            field: 'required',
                            headerName: 'Required',
                            width: 30,
                        },
                        {
                            field: 'defaultValue.value',
                            valueGetter: (params) =>
                                params.row.defaultValue?.value,
                            headerName: 'Default',
                            flex: 0.1,
                        },
                        {
                            field: 'description',
                            headerName: 'Description',
                            flex: 0.5,
                        },
                    ]}
                    rows={
                        Object.keys(component.props || {})?.map((name) => ({
                            ...component.props[name],
                            name,
                        })) ?? []
                    }
                    hideFooterPagination
                />
            </div>
        </>
    );
};
