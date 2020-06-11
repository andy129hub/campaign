import React,{Component} from 'react';
import {Form,Input,Button,Message} from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import Web3 from 'web3';

import {Router} from '../routes';
import Campaign from '../ethereum/campaign'

class ContributeForm extends Component {

  state = {
    value:'',
    errorMessage:'',
    loading:false,
  }

  onSubmit = async ()=>{
    event.preventDefault();

    console.log("from address : ", this.props.address);
    console.log("minimum : ", this.props.minimum);

    this.setState({errorMessage:''});
    this.setState({loading:false});

    var desObj = Object.keys(this.state.value);
    if (desObj.length == 0) {
      this.setState({errorMessage:'请输入！'});
      return ;
    }

    if (Number.parseInt(this.state.value) < 0) {
        this.setState({errorMessage:'输入错误！'});
        return;
    }

    const valueWei = web3.utils.toWei(this.state.value,'ether');
    // console.log("valueWei : ", valueWei);

    // parseFloat()  --->  parseFloat(0.0001) ---> 0.0001
    if (Number.parseFloat(this.state.value) > 0 && Number.parseInt(valueWei) < Number.parseInt(this.props.minimum)) {
        this.setState({errorMessage:'最小贡献量不能小于'+this.props.minimum+'wei'});
        return;
    }

    var web3Provider;
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            // 请求 账户授权
            await window.ethereum.enable();
            console.log('account access success.');
        } catch (error) {
            // 用户不授权时
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {   // 老版本 metamask 账户信息是公开的，2018-11之后，需要授权才能获取账户信息
        web3Provider = window.web3.currentProvider;
        console.log('!!!!!!!!!!!!!!!!!');
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    web3 = new Web3(web3Provider);

    this.setState({loading:true});

    try
    {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from:accounts[0],
        value:web3.utils.toWei(this.state.value,'ether')
      });

      this.setState({loading:false});

      // 刷新该页面
      Router.replaceRoute(`/campaigns/${this.props.address}`);

    }catch(error) {
      this.setState({errorMessage:error.message});
    }

    this.setState({loading:false});

  }

  render() {
      return (
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field >
              <label>贡献一下</label>
              <Input type='number' label='ether' labelPosition='right'
                value={this.state.value}
                onChange={event=>this.setState({value:event.target.value})}
                />
            </Form.Field>
            <Message error header="错误" content={this.state.errorMessage}/>
            <Button loading={this.state.loading} primary>投资</Button>
          </Form>

      );
  }
}

export default ContributeForm;
