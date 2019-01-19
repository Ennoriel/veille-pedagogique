import * as React from "react";

export interface Props {
}

class Home extends React.Component<Props> {

    render(): JSX.Element {
        return (
            <div>
                <h1>Home Page</h1>
            </div>
        );
    }
}

export default Home;