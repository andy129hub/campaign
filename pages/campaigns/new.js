import React,{Component} from 'react';

import Layout from '../../components/Layout';
import {Form,Button,Input,Message} from 'semantic-ui-react';

import web3 from '../../ethereum/web3';
import Web3 from 'web3';

import factory from '../../ethereum/factory';

import {Router} from '../../routes';   // 注意，{Router}  不能使用Routes , 难道 Routes 是关键字还是保留的包名

class CampaignNew extends Component {

  state = {
    minimum:'',
    description:'',
    errorMessage:'',
    loading:false,
  }

  onSubmit = async()=>{
    event.preventDefault();

    this.setState({errorMessage:''});
    this.setState({loading:true});

    var desObj = Object.keys(this.state.description);
    if (desObj.length == 0) {
      console.log("return 1");
      this.setState({errorMessage:'项目名称 输入错误！'});
      return ;
    }

    if (Number.parseInt(this.state.minimum) < 0) {
        console.log("return 2");
        this.setState({errorMessage:'最小贡献量 输入错误！'});
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
    console.log('+++++++++++++++++');
    web3 = new Web3(web3Provider);

    try {
      // 请求账户授权，授权完成之后才可以通过  web3.eth.getAccounts() 获取到账户信息
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      await factory.methods.createCampaign(this.state.minimum,this.state.description).send({from:accounts[0]});

      Router.pushRoute('/');   // 跳转到主页

    }catch(error) {
      this.setState({errorMessage:error.message});
    }

    this.setState({loading:false});

  }

  render() {
    return (
      <Layout>
        <h1>创建众筹项目</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>   {/* 不能写成  this.onSubmit() */}

          <Form.Field>
            <label>众筹项目名称</label>
            <Input labelPosition='right'
              type="text"
              value={this.state.description}
              onChange={event=>this.setState({description:event.target.value})}/>
          </Form.Field>

          <Form.Field>
            <label>最小的贡献量</label>
            <Input label='wei' labelPosition='right'
              type="number"
              placeholder="请输入数字"
              value={this.state.minimum}
              onChange={event=>this.setState({minimum:event.target.value})}/>
          </Form.Field>
          <Message error header="错误" content={this.state.errorMessage}/>
            <Button loading={this.state.loading} primary>创建众筹</Button>
        </Form>

      </Layout>
    );
  }
}

export default CampaignNew;
