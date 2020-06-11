import React,{Component} from 'react';
import factory from '../ethereum/factory';
import {Card,Button} from 'semantic-ui-react';

import Layout from '../components/Layout';
import AddressCopy from '../components/AddressCopy';
import web3 from '../ethereum/web3';

import {Link} from '../routes';

import Web3 from 'web3';
// export default()=> {
//   return <h1>next index页面</h1>;
// }


class CampaignIndex extends Component {

  state = {
    account:'',
  }

  // next 框架中预处理函数(在服务器端预处理，返回结果，供前端调用)
  // 缺点：无法使用 window 对象
  // 注意：console.log() 既然是 服务器端处理，所以打印信息是在服务器端的 终端窗口，而不是 浏览器终端
  static async getInitialProps() {

    // const address = await factory.options.address;
    // console.log(address);

    const campaigns = await factory.methods.getDeployedCampaign().call();
    // console.log("========cam0 : ",campaigns[0]);

    // 注意Array().fill() 的用法： https://blog.csdn.net/adley_app/article/details/83817759
    const camDesc = await Promise.all (
      Array(campaigns.length).fill().map(async (element,index)=>{

        const desc = await factory.methods.campaignMap(campaigns[index]).call();
        // console.log("desc : ", desc);
        var item = {
          address : campaigns[index],
          desc: desc,
        }
        return item;
      })
    )

    /*
    const camDesc = await Promise.all (
        Array(campaigns.length).fill().map((element,index)=>{

      //  console.log("--------",this.props.address);

        return factory.methods.campaignMap("0x98fFC345da842d88134C29A5400fd85De438Bb55").call();
      })
    )
    */

    /*
    const campaigns = await Promise.all (
      Array(campaignsCount).fill().map((element,index)=>{
        return factory.methods.deployedCampaign(index).call();
      })
    )
    console.log(campaigns);
    */

    return {campaigns,camDesc};   // {} 一定要有

  }

  // 既然在服务器端无法获取 以太坊账户信息，那么依然可以使用 componentDidMount() 在里面使用 window对象 请求账户授权
  // 缺点，一旦 浏览器禁止了 javascript, 那么该方法就无法使用了
  /*
  async componentDidMount() {

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

    // 请求账户授权，授权完成之后才可以通过  web3.eth.getAccounts() 获取到账户信息
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    this.setState({account:accounts[0]});
  }
  */


/*  当浏览器禁止 javascript 之后，console.log() 不会被执行
  async componentDidMount() {

    // 请求 账户授权
    window.addEventListener('load', async () => {
      var web3Provider;
       // Modern dapp browsers...
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
    });

    const address = await factory.options.address;
    console.log(address);

    // 请求账户授权，授权完成之后才可以通过  web3.eth.getAccounts() 获取到账户信息
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const campaign = await factory.methods.getDeployedCampaign().call();
    console.log(campaign);


    <Link route={`/campaigns/${item.address}`} ><a>查看众筹</a></Link>,
  }
*/

/*  <Link> 传参 示例

  // 路由配置
  routes.js
    routes.add('campaigns_show','/campaigns/:address/:desc','/campaigns/show')

  // 根据路由配置，传入参数
  index.js
    <Link route='campaigns_show' params={{address:item.address, desc: item.desc}}><a>查看众筹</a></Link>,

  // 获取参数值
  show.js

  static async getInitialProps(props) {
    console.log("address :  ",props.query.address);
    console.log("desc :  ",props.query.desc);

          ......
  }

  render() {
    // console.log("match : ",this.props.params)
    return (
        <Layout>
          <h1>hello show, desc : {this.props.url.query.desc}</h1>
        </Layout>
    );
  }

*/


  onCopy() {

    console.log("event : ", event);
      console.log('onCopy .... address : ');
      // console.log("address : ",address);

      // <p>{item.address} <Button icon='copy' onClick={this.onCopy}></Button> </p>
  }

  renderCampaigns(){

    if (this.props.campaigns.length > 0 ){
      const items = this.props.camDesc.map((item,index) => {
        return {
          header: item.desc,
          meta: <Link route={`/campaigns/${item.address}`} ><a>查看众筹</a></Link>,
          description :<AddressCopy address={item.address} />,
          fluid:true,
        }
      });

      return <Card.Group items={items} />;
    }else {
      console.log("no campaign");
      const items = [
        {
          header: '无众筹项目',
        },
      ]
      return <Card.Group color='red' items={items} />;
    }

  }

  render() {
    return (
      <Layout>
      <div>
        <h3>众筹列表</h3>
        <Link route='/campaigns/new'>
          <Button floated='right' content='创建众筹' icon='add circle' labelPosition='left' primary/>
        </Link>
        {this.renderCampaigns()}
      </div>
      </Layout>
    );
  }
}
// 导出
export default CampaignIndex;
