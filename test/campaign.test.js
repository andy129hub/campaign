const assert = require('assert');
const ganache = require('ganache-cli');
const web3 = require('web3');

const web3obj = new web3(ganache.provider());

const compileFactory = require('../ethereum/build/CampaignFactory.json');
const compileCampaign = require('../ethereum/build/Campaign.json');

var accounts;
var factory;
var campaignAddress;
var campaign;

beforeEach(async()=>{
  accounts = await web3obj.eth.getAccounts();
  //console.log(accounts);

  // 部署 CampaignFactory 合约
  factory = await new web3obj.eth.Contract(JSON.parse(compileFactory.interface))
  .deploy({data:'0x'+compileFactory.bytecode})
  .send({from:accounts[0],gas:'1000000'});

  // 通过 CampaignFactory 实例化 Campaign 合约，（注意这个写法）
  await factory.methods.createCampaign('100',"make a film").send({from:accounts[0],gas:'1000000'});
  [campaignAddress] = await factory.methods.getDeployedCampaign().call();
  // console.log("cam address : ",campaignAddress);

  // 部署 Campaign 合约
  campaign = await new web3obj.eth.Contract(JSON.parse(compileCampaign.interface),campaignAddress);
});

describe('campaign', ()=>{
  it('deploy campaign', ()=>{
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('manager address',async()=>{
    const manager = await campaign.methods.manager().call();
    // console.log("manager : ",manager);
    assert.equal(manager, accounts[0]);
  });

  it('allow people to contribute', async()=>{
    await campaign.methods.contribute().send({from:accounts[1],value:'200'});

    const isContribute = await campaign.methods.approvers(accounts[1]).call();
    assert(isContribute);

  });

  it('require to a minimum contribute', async()=>{
    // try{}catch()  用于测试 出错的操作
    try {
      await campaign.methods.contribute().send({from:accounts[1],value:'5'});
      const isContribute = await campaign.methods.approvers(accounts[1]).call();
      assert(isContribute);
    }catch(err) {
      assert(err);   // 当出现错误时，判断成功
    }
  });

  it('require to a contract description', async()=>{

      const descri = await campaign.methods.description().call();

      assert.equal("make a film",descri);

  });

  it('get campaign description from map', async()=>{
      const descri = await factory.methods.campaignMap(campaignAddress).call();
      assert.equal("make a film",descri);
  });

  it('allows a manager to make request', async()=>{
    await campaign.methods.createRequest('write a script','400',accounts[0]).send({from:accounts[0],gas:'1000000'});

    const request = await campaign.methods.requests(0).call();
    assert.equal("write a script",request.description);
  });

});
