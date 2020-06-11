import React,{Component} from 'react';
import Layout from '../../../components/Layout';
import {Form,Input,Card,Button,Message} from 'semantic-ui-react';

import web3 from '../../../ethereum/web3';
import Web3 from 'web3';

import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import {Router} from '../../../routes';

class RequestNew extends Component {

  static async getInitialProps(props){

    const {address} = props.query;
    return {address};
  }

  state = {
    description:'',
    value:'',
    recipients:'',
    errorMessage:'',
    loading:false,
  }

  onSubmit = async()=>{
    event.preventDefault();

    this.setState({errorMessage:''});
    this.setState({loading:false});

    var desObj = Object.keys(this.state.description);
    if (desObj.length == 0) {
      this.setState({errorMessage:'请输入投资请求'});
      return ;
    }

    if (Number.parseFloat(this.state.value) <= 0) {
        this.setState({errorMessage:'投资金额输入错误'});
        return;
    }

    var reci = Object.keys(this.state.recipients);
    if (reci.length == 0) {
      this.setState({errorMessage:'请输入受益人地址'});
      return ;
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

    try {
      // 请求账户授权，授权完成之后才可以通过  web3.eth.getAccounts() 获取到账户信息
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      // console.log(accounts);

      await campaign.methods.createRequest(this.state.description,web3.utils.toWei(this.state.value,'ether'),this.state.recipients).send({from:accounts[0]});
      this.setState({loading:false});

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    }catch(error) {
      this.setState({errorMessage:error.message});
    }

    this.setState({loading:false});

  }

  render() {
    return (
        <Layout>

          <Link route={`/campaigns/${this.props.address}/requests/`}>
            <a>返回</a>
          </Link>
          <h1>增加投资请求</h1>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>   {/* 不能写成  this.onSubmit() */}

            <Form.Field>
              <label>投资请求描述</label>
              <Input labelPosition='right'
                type="text"
                value={this.state.description}
                onChange={event=>this.setState({description:event.target.value})}/>
            </Form.Field>

            <Form.Field>
              <label>投资金额</label>
              <Input label='ether'labelPosition='right'
                type="number"
                placeholder="请输入数字"
                value={this.state.value}
                onChange={event=>this.setState({value:event.target.value})}/>
            </Form.Field>

            <Form.Field>
              <label>受益人地址</label>
              <Input
                value={this.state.recipients}
                onChange={event=>this.setState({recipients:event.target.value})}/>
            </Form.Field>

            <Message error header="错误" content={this.state.errorMessage}/>
              <Button loading={this.state.loading} primary>提交投资请求</Button>
          </Form>

        </Layout>
    );
  }
}

export default RequestNew;
