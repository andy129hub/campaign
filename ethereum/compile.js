const path = require('path');
// fs-extra  强化版 fs
const fs = require('fs-extra');

const solc = require('solc');

const buildpath = path.resolve(__dirname,'build');

// 每次编译之前，先移除 旧的 编译文件
fs.removeSync(buildpath);

// __dirname 表示当前项目根路径  (不同平台下的目录 都能打印)
const filepath = path.resolve(__dirname,"contract","campaign.sol");
console.log("__dirname : "+__dirname);  // E:\我的工作\区块链课程\以太坊技术\dapp学习\myproject
console.log("filepath : "+filepath);

// 读取 .sol 文件
const source = fs.readFileSync(filepath, "utf-8");
// console.log("file content : "+source);

// 使用 solc 包编译 .sol 文件， 解析.sol 所有内容（合约，接口，库 等）
// console.log(solc.compile(source,1));    // 1 代表只有一个 .sol 文件

// 从 sol 解析文件中 获取指定合约的内容
// console.log(solc.compile(source,1).contracts[':HelloWorld']);

// 导出合约 （其他文件 通过 const {bytecode,interface} = require("../compile"); 获取合约的二进制文件以及接口）
// // 注意：require("../compile");  导入 compile.js 文件(js 后缀可省略，但名字要名字要一致)
const output = solc.compile(source,1).contracts;
console.log(output);

// buildpath 不存在则创建。
fs.ensureDirSync(buildpath);

for(let contract in output) {
  // fs.outputJsonSync  输出 json 格式的文件
  fs.outputJsonSync(path.resolve(buildpath,contract.replace(":","")+'.json'),output[contract]);
}

/*
  contract 的值为 ':Campaign', ':CampaignFactory'
  output[contract], 则获取 合约对应的 二进制文件等信息
*/
