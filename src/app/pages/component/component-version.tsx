import Chip from '@mui/material/Chip';
import CloudDoneIcon from '@mui/icons-material/CloudDoneOutlined';
import PublishIcon from '@mui/icons-material/PublishOutlined';
import { SvgIconComponent } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

declare type ComponentVersionProps = {
    online: string;
    local: string;
};

export const ComponentVersion = ({ online, local }: ComponentVersionProps) => {
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
                icon={<Icon />}
                label={`V ${version}`}
            />
        </Tooltip>
    );
};
