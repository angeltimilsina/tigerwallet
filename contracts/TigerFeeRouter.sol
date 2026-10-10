// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IERC20 { function balanceOf(address) external view returns(uint256); }
contract TigerFeeRouter {
    address payable public immutable collector;
    uint256 public constant basisPoints=30;
    bool private entered;
    event TransferWithFee(address indexed sender,address indexed token,address indexed recipient,uint256 amount,uint256 fee);
    constructor(address payable receiver){require(receiver!=address(0),"zero collector");collector=receiver;}
    modifier guard(){require(!entered,"reentrant");entered=true;_;entered=false;}
    function fee(uint256 amount) public pure returns(uint256){require(amount>0,"zero amount");return (amount*30+9999)/10000;}
    function sendNative(address payable recipient,uint256 amount) external payable guard {
        require(recipient!=address(0)&&recipient!=address(this),"invalid recipient");uint256 charge=fee(amount);require(msg.value==amount+charge,"incorrect total");
        (bool sent,)=recipient.call{value:amount}("");require(sent,"recipient failed");
        (bool paid,)=collector.call{value:charge}("");require(paid,"fee failed");
        emit TransferWithFee(msg.sender,address(0),recipient,amount,charge);
    }
    function sendToken(address token,address recipient,uint256 amount) external guard {
        require(token.code.length>0&&recipient!=address(0)&&recipient!=address(this),"invalid address");uint256 charge=fee(amount);
        uint256 beforeBalance=IERC20(token).balanceOf(recipient);
        transferFrom(token,msg.sender,recipient,amount);
        require(IERC20(token).balanceOf(recipient)==beforeBalance+amount,"unsupported taxed token");
        uint256 beforeFee=IERC20(token).balanceOf(collector);
        transferFrom(token,msg.sender,collector,charge);
        require(IERC20(token).balanceOf(collector)==beforeFee+(collector==msg.sender?0:charge),"unsupported taxed token");
        emit TransferWithFee(msg.sender,token,recipient,amount,charge);
    }
    function transferFrom(address token,address from,address to,uint256 amount) private {
        (bool success,bytes memory result)=token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)",from,to,amount));
        require(success&&(result.length==0||(result.length==32&&abi.decode(result,(bool)))),"token transfer failed");
    }
}
