import React from 'react';
import {Menu,Input,Grid,Header,Form,Button,Segment} from 'semantic-ui-react';
import {Link} from '../routes';

import {Router} from '../routes';

class Header2 extends React.Component {

  state = {
    inputAddress:''
  }

  onSearch = ()=> {
      var inputObj = Object.keys(this.state.inputAddress);
      if (inputObj.length == 0) {
        return ;
      }

      Router.pushRoute(`/campaigns/${this.state.inputAddress}`);

      /*
            <Link route={`/campaigns/${this.state.inputAddress}`}>
            </Link>
      */
  }

  render() {
    return (
      <Header as='h4' style={{marginTop:'10px'}} block>
        <Grid divided>
          <Grid.Row columns={3}>
              <Grid.Column width={2}>
                  <Header as='h3' block textAlign='center'>
                      <Link route='/'>
                        <a>首页</a>
                      </Link>
                  </Header>
              </Grid.Column>

              <Grid.Column width={12}>
                  <Button floated='right' onClick={this.onSearch} primary>查询</Button>

                  <Input fluid placeholder='输入合约地址查询...'
                    value={this.state.inputAddress}
                    onChange={event=>this.setState({inputAddress:event.target.value})}
                  />
              </Grid.Column>

              <Grid.Column width={2}>

                <Header as='h3' block textAlign='center'>
                      <Link route='/campaigns/new'>
                        <a>众筹 +</a>
                      </Link>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>

      </Header>
    );
  }

}

export default Header2;
