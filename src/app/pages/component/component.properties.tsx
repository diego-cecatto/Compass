import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type ComponentPropertiesProps = {
    component: any;
};

export const ComponentProperties = ({
    component,
}: ComponentPropertiesProps) => {
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'NAME',
        },
        {
            field: 'type',
            headerName: 'TYPE',
        },
        {
            field: 'default',
            headerName: 'DEFAULT',
        },
        {
            field: 'description',
            headerName: 'DESCRIPTION',
            width: 220,
        },
    ];
    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={component?.prop?.properties ?? []}
                columns={columns}
                getRowId={(row) => row.name}
                hideFooter
                showColumnVerticalBorder={false}
                showCellVerticalBorder={false}
                sx={{ border: 0 }}
                autoHeight
                disableRowSelectionOnClick
            />
        </Box>
    );
};
