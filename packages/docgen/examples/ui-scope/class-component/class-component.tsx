import { Component } from 'react';

export type MyProps = {
    // using `interface` is also ok
    message: string;
};
type MyState = {
    count: number; // like this
};

export class ClassComponent extends Component<MyProps, MyState> {
    state: MyState = {
        // optional second annotation for better type inference
        count: 0,
    };
    render() {
        return (
            <div>
                {this.props.message ?? 'total:'} {this.state.count}
            </div>
        );
    }
}
