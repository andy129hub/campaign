import React,{Component} from 'react';

import {Button,Icon} from 'semantic-ui-react';

import Copy from 'copy-to-clipboard';

class AddressCopy extends Component {

  onCopy = ()=> {

    const address = this.props.address;
    // console.log("copy address : ", address);

    if(Copy(address)){
       console.log("复制成功");
    }else{
        console.log("复制失败")
    }
  }

  render() {

    return (
      <p>
        {this.props.address}

        <Button animated='fade' as='h4' onClick={this.onCopy}>
          <Button.Content visible>
              <Icon name='copy' />
          </Button.Content>
          <Button.Content hidden>复制</Button.Content>
        </Button>
      </p>
    );
  }
}


export default AddressCopy;
