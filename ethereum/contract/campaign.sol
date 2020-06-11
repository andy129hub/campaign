pragma solidity ^0.4.24;

// 合约工厂
contract CampaignFactory {

  // 部署成功的 众筹合约集合
  address[] public deployedCampaign;
  // 众筹合约地址 => 众筹项目描述   映射表
  mapping(address => string) public campaignMap;

  // 实例化 众筹合约
  function createCampaign(uint _minimum,string _description) public {
    // new Campaign
    address newCampaign = new Campaign(_minimum,_description,msg.sender);
    deployedCampaign.push(newCampaign);
    campaignMap[newCampaign] = _description;
  }
  // 获取部署成功的  众筹合约集合
  function getDeployedCampaign() public view returns(address[]) {
    return deployedCampaign;
  }
}

contract Campaign {

  // 由管理者发起的 投资请求（将众筹的资金用于某些项目的投资）
  struct Request {
    // 请求的描述信息
    string description;
    // 申请总金额
    uint value;
    // 受益人地址
    address recipients;
    // 请求是否完成
    bool complete;
    // 同意的投资人数量
    uint approvalCount;
    // 投资人的意见(true or false)
    mapping(address=>bool) approvers;
  }

  // 投资请求集合
  Request[] public requests;
  // 合约描述信息
  string public description;
  // 管理者地址
  address public manager;
  // 最小贡献量
  uint public minimumContribute;
  // 投资者
  mapping(address=>bool) public approvers;
  // 支持者数量
  uint public approversCount;

  // 合约构造函数
  constructor(uint minimum, string _description,address _address) public {
    manager = _address;
    minimumContribute = minimum;
    description = _description;
  }

  // 权限控制
  modifier Restricted {
    require(manager == msg.sender);
    _;
  }

  // 投资者 贡献金额
  function contribute() public payable {
    require(msg.value > minimumContribute);
    approvers[msg.sender] = true;
    approversCount++;
  }

  // 管理者创建一个投资请求 (将众筹的钱用于 某个项目的投资)
  function createRequest(string _description,uint _value,address _addr) public Restricted{
    // 创建新的请求 实例
    Request memory req = Request({
      description:_description,
      value:_value,
      recipients:_addr,
      complete:false,
      approvalCount:0
    });
    // 将新的请求加入 requests 集合中
    requests.push(req);
  }

  // 支持管理者提出的某个投资请求
  function approvalRequest(uint index) public {
    // 先获取到 该请求
    Request storage req = requests[index];
    // 判断 msg.sender 是否为投资者
    require(approvers[msg.sender]);
    // 并且还没有 支持过这个请求
    require(!req.approvers[msg.sender]);

    req.approvers[msg.sender] = true;
    req.approvalCount ++;  // 同意人数加 1
  }

  // 管理者最后处理 投资请求 (投资人同意的个数 大于所有投资人的1/2，则为成功，进行资金转账)
  function finalizeRequest(uint index) public Restricted payable{
    Request storage req = requests[index];
    // 确保 投资请求是未完成的请求。
    require(!req.complete);
    // 支持人数大于投资人数的 1/2
    require(req.approvalCount > approversCount/2);
    // 进行转账
    req.recipients.transfer(req.value);
    req.complete = true;
  }

  // 获取合约的基本信息
  function getSummay() public view returns(uint,uint,uint,uint,string,address){
    return (minimumContribute,address(this).balance,requests.length,approversCount,description,manager);
  }

  // 获取投资请求的数量
  function getRequestCount() public view returns(uint) {
    return requests.length;
  }

}
