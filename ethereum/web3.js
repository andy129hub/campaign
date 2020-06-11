// 导入在本地下载好的 web3 包
import Web3 from 'web3';

/*  在 next 框架中， window is not defined 的问题
    出错代码： const web3 = new Web3(window.web3.currentProvider);

  首先为什么会报出以上问题？
  next 框架解析.js 的原理如下：
    our code --> next server --> HTML doc --later...--> our code

  报错就出现在 next server 这里， next 框架不包含 window 对象，window 对象是 浏览器中内置的对象
    -- 在终端中输入 node 命令
    -- 再输入 typeof window    ---> 结果输出：'undefined'

    -- 在谷歌浏览器中，打开开发者工具， 终端上输入:  typeof window   ---> 结果输出：object   (说明是内置对象)


  解决办法：

  var web3;

  if(typeof window !='undefined' && window.web3 != 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  }else {
    const provider = new Web3.providers.HttpProvider(
      'https://ropsten.infura.io/v3/4d2fe19ec56d48dcb2fea4cf8b193416'
    );

    web3 = new Web3(provider);
  }
*/
// 当前浏览器 web3 中的provider (metamask 内置web3，与 本地下载的 web3 版本不同)
var web3;

if(typeof window !='undefined' && window.web3 != 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
}else {
  const provider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/4d2fe19ec56d48dcb2fea4cf8b193416'
  );

  web3 = new Web3(provider);
}

// 导出 web3 实例，让其他文件获取 web3
export default web3;
