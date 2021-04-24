import React from 'react';
import Example1 from '../src/example1/Example1';
import Example2 from '../src/example2/Example2';
import Example3 from '../src/example3/Example3';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: 1,
            cbInstance: null,
        }

        this.setExample = this.setExample.bind(this)
    }

    componentDidMount() {
        window.Chargebee.init({
            site: "honeycomics-v3-test",
            publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
        })

        this.setState({
            cbInstance: window.Chargebee.getInstance()
        })
    }

    setExample(show_number) {
        this.setState({
            show: show_number
        })
    };

    render() {
        return (
            <>
                <script src="https://js.chargebee.com/v2/chargebee.js" ></script>
                <div >
                    <ul className="base_page_ul">
                        <li className="base_page_li" onClick={() => this.setExample(1)}>Example 1</li>
                        <li className="base_page_li" onClick={() => this.setExample(2)}>Example 2</li>
                        <li className="base_page_li" onClick={() => this.setExample(3)}>Example 3</li>
                    </ul>
                    <div>
                        { this.state.show == 1 ? 
                          <Example1 cbInstance={this.state.cbInstance}/> : 
                          this.state.show == 2 ? 
                          <Example2 cbInstance={this.state.cbInstance}/> : 
                          this.state.show == 3 ? 
                          <Example3 cbInstance={this.state.cbInstance}/> :
                          null 
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default App;
