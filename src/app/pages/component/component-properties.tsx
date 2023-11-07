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
            <DataGrid
                getRowId={(data) => data.name}
                columns={[
                    {
                        field: 'name',
                        headerName: 'Name',
                        flex: 0.5,
                    },
                    {
                        field: 'flowType?.flowType',
                        valueGetter: (params) => params.row.flowType?.name,
                        headerName: 'Type',
                        flex: 0.3,
                    },

                    {
                        field: 'required',
                        headerName: 'Required',
                        flex: 0.2,
                    },
                    {
                        field: 'defaultValue.value',
                        valueGetter: (params) => params.row.defaultValue?.value,
                        headerName: 'Default',
                        flex: 0.3,
                    },
                    {
                        field: 'description',
                        headerName: 'Description',
                        flex: 1,
                    },
                ]}
                rows={
                    Object.keys(component.props).map((name) => ({
                        ...component.props[name],
                        name,
                    })) ?? []
                }
                hideFooterPagination
            />
        </>
    );
};
