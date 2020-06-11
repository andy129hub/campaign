import React,{Component} from 'react';
import {Table,Button} from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import Web3 from 'web3';
import Campaign from '../ethereum/campaign'
import {Router} from '../routes';

class RequestRow extends Component {


  state = {
    loading1:false,
    loading2:false,
  }

  async verify() {
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
  }

  onApprove = async()=> {

    /*
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

    */

      this.verify();

      this.setState({loading1:true});

      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approvalRequest(this.props.id).send({from:accounts[0]});

      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);

      this.setState({loading1:false});

  }

  onFinalize = async()=> {
      this.verify();

      this.setState({loading2:true});

      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.id).send({from:accounts[0]});

      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);

      this.setState({loading2:false});
  }

  render(){

    const {Row,Cell} = Table;
    const {id,request,approversCount} = this.props;

    return (

      <Row disabled= {request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
        <Cell>{request.recipients}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          {
            (request.complete || request.approvalCount == approversCount)?'通过':(<Button color='green' onClick={this.onApprove} loading={this.state.loading1}>同意</Button>)
          }
        </Cell>
        <Cell>
          {
            request.complete?('已完成'):(<Button color='teal' onClick={this.onFinalize} loading={this.state.loading2}>完成</Button>)
          }
        </Cell>
      </Row>

    );
  }

}

export default RequestRow;
