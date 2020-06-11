// 导入同级目录下的 web3.js
import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

// 合约部署成功后的 地址
const contractAddress = '0xC154c2b9B153a83f46e244a212F019208De4cA98';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),contractAddress);
// 导出合约实例
export default instance;
