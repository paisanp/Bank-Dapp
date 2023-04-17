// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Bank {

    mapping(address => uint) _balances;
    event Deposit(address indexed owner, uint amount, uint timestamp);
    event Withdraw(address indexed owner, uint amount, uint timestamp);
    event Transfer(address indexed from, address indexed to, uint amount, uint timestamp);

    function deposit() public payable {
        require(msg.value > 0, "deposit money is zero");
        
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
    
    function withdraw(uint amount) public {
        require(amount > 0 && amount <= _balances[msg.sender], "not enought money");

        payable(msg.sender).transfer(amount);
        _balances[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount, block.timestamp);
    }

    function transfer(address to, uint amount) public {
        require(amount > 0 && amount <= _balances[msg.sender], "not enought money");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount, block.timestamp);
    }

    function balance() public view  returns(uint){
        return _balances[msg.sender];
    }

    function balanceOf(address owner) public view  returns(uint){
        return _balances[owner];
    }
}
