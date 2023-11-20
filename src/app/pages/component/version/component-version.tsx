import Chip from '@mui/material/Chip';
import CloudDoneIcon from '@mui/icons-material/CloudDoneRounded';
import PublishIcon from '@mui/icons-material/PublishRounded';
import { SvgIconComponent } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

declare type ComponentVersionProps = {
    local: string;
};

export const ComponentVersion = ({ local }: ComponentVersionProps) => {
    if (!local) {
        return <></>;
    }

    let online = local;
    if (!online) {
        online = 'New';
    }

    return (
        <>
            <ComponentVersionItem
                version={online}
                icon={CloudDoneIcon}
                label="Version online"
            />
            &nbsp;<span className="separator">/</span>
            &nbsp;
            <ComponentVersionItem
                version={local}
                icon={PublishIcon}
                label="Version local"
            />
        </>
    );
};
declare type ComponentVersionItemProps = {
    version: string;
    icon: SvgIconComponent;
    label: string;
};
const ComponentVersionItem = ({
    version,
    icon: Icon,
    label,
}: ComponentVersionItemProps) => {
    return (
        <Tooltip title={label}>
            <Chip
                className="component-version"
                icon={<Icon sx={{ width: '19px' }} />}
                label={`V ${version}`}
            />
        </Tooltip>
    );
};
