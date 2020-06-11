import React,{Component} from 'react';
import Layout from '../../../components/Layout';
import {Card,Button,Grid,Table} from 'semantic-ui-react';
import RequestRow from '../../../components/RequestRow'

import {Link} from '../../../routes';

import Campaign from '../../../ethereum/campaign';

import web3 from '../../../ethereum/web3';
import Web3 from 'web3';

class CampaignRequest extends Component {

  static async getInitialProps(props){

    const {address} = props.query;
    // return {address};

    const campaign = Campaign(address);

    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element,index)=>{
          return campaign.methods.requests(index).call();
      })
    );

    // console.log(requests);
    return {address,approversCount,requests};

  }

  renderRow() {
    return this.props.requests.map((request,index)=>{
        return (
              <RequestRow
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
                >
              </RequestRow>
        );
    });
  }

  render() {
    return (
        <Layout>
          <Link route={`/campaigns/${this.props.address}`}>
            <a>返回</a>
          </Link>
          <h1>请求列表</h1>

          <Link route={`/campaigns/${this.props.address}/requests/new`}>
            <a><Button primary>增加投资请求</Button></a>
          </Link>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>描述</Table.HeaderCell>
                <Table.HeaderCell>所需金额(ether)</Table.HeaderCell>
                <Table.HeaderCell>受益人地址</Table.HeaderCell>
                <Table.HeaderCell>同意数量</Table.HeaderCell>
                <Table.HeaderCell>是否同意</Table.HeaderCell>
                <Table.HeaderCell>是否已完成</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.renderRow()}
            </Table.Body>


          </Table>

        </Layout>

    );
  }
}

export default CampaignRequest;
