import React from 'react';
import Layout from '../../components/Layout';
import {Card,Button,Grid} from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';

import {Link} from '../../routes';

import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';

class CampaignShow extends React.Component {

  static async getInitialProps(props) {
    // console.log("address :  ",props.query.address);

    // 创建合约实例
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummay().call();
    /*
      // 获取合约的基本信息
      function getSummay() public view returns(uint,uint,uint,uint,string,address){
        return (minimumContribute,address(this).balance,requests.length,approversCount,description,manager);
      }
    */

    return {
        address:props.query.address,
        minimumContribute:summary[0],
        balance:summary[1],
        requestCount:summary[2],
        approvalCount:summary[3],
        description:summary[4],
        manager:summary[5]
    };
  }

  renderCards(){
    const {
      address,
      minimumContribute,
      balance,
      requestCount,
      approvalCount,
      description,
      manager
    }=this.props;

    const items = [
      {
        header:description,
        meta:'众筹项目名称',
        description:'当前管理者创建的众筹项目名称',
        style:{overflowWrap:'break-word'}
      },
      {
        header:address,
        meta:'众筹项目地址',
        description:'每个众筹项目地址唯一',
        style:{overflowWrap:'break-word'}
      },
      {
        header:manager,
        meta:'管理者的地址',
        description:'当前管理者的地址',
        style:{overflowWrap:'break-word'}
      },
      {
        header:minimumContribute,
        meta:'最小贡献量',
        description:'用户最小贡献金额(wei)',
        style:{overflowWrap:'break-word'}
      },
      {
        header:web3.utils.fromWei(balance,'ether'),
        meta:'当前众筹金额(ether)',
        description:'已众筹总金额',
        style:{overflowWrap:'break-word'}
      },
      {
        header:requestCount,
        meta:'投资请求的数量',
        description:'管理者使用众筹的钱发起的 投资请求',
        style:{overflowWrap:'break-word'}
      },
      {
        header:approvalCount,
        meta:'投资人的数量',
        description:'有多少人参与了此项众筹',
        style:{overflowWrap:'break-word'}
      }
    ]

    return <Card.Group items={items} />;

  }

  render() {
    return (
        <Layout>
        <h1>{this.props.description}</h1>
          <Grid>

            <Grid.Row>

              <Grid.Column width={10}>
                {this.renderCards()}
              </Grid.Column>

              <Grid.Column width={6}>
                <ContributeForm address={this.props.address} minimum={this.props.minimumContribute}/>
              </Grid.Column>

            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                  <Button primary>查看投资请求</Button>
                </Link>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Layout>
    );
  }
}

export default CampaignShow;
