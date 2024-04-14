import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import React from 'react';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(240, 240, 240, 0.99)',
        color: 'rgba(0, 0, 0, 0.99)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}));

function defineTarget(openInNewTab: boolean) {
    return openInNewTab ? '_blank' : '_self';
}

export function HyperLink(props: HyperLinkProps) {
    const buildHyperlink = (
        children: string | React.ReactNode,
        style: any = {
            fill: 'inherit',
            fontSize: '2.2rem',
            textDecoration: 'none',
            color: 'inherit',
        }
    ) => (
        <a
            href={props.link}
            target={defineTarget(props.openInNewTab)}
            style={style}
        >
            {children}
        </a>
    );
    const hyperlink = buildHyperlink(props.children);
    return (
        <>
            {props.showTooltip ? (
                <LightTooltip
                    title={buildHyperlink(props.tooltipTitle, {
                        fill: 'inherit',
                        textDecoration: 'none',
                        color: 'inherit',
                    })}
                    placement={'right-start'}
                >
                    {hyperlink}
                </LightTooltip>
            ) : (
                hyperlink
            )}
        </>
    );
}

export declare type HyperLinkProps = {
    children: React.ReactNode | string;
    link: string;
    openInNewTab: boolean;
    showTooltip: boolean;
    tooltipTitle?: any;
};
