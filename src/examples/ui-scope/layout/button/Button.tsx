export interface ButtonProps {
    //this property is a name
    name: string;
}

export const Button = ({ name }: ButtonProps) => {
    return (
        <div>
            <p>Button {name} works!</p>
        </div>
    );
};
