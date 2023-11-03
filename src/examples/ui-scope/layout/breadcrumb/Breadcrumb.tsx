export type BreadcrumbProps = {
    /** Property test */
    test?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    test = 'Default value to test',
}) => {
    return (
        <div>
            <p>Breadcrumb {test} works!</p>
        </div>
    );
};
