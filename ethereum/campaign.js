// 导入同级目录下的 web3.js
import web3 from './web3';

import Campaign from './build/Campaign.json';

// 通过传入的地址，导出合约实例
export default (address)=>{
    return new web3.eth.Contract(JSON.parse(Campaign.interface),address);
}
