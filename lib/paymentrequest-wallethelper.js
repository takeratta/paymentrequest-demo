"use strict";

function PaymentRequestWalletHelper() {
	var _id = 0;
	var _messageHandler = onMessage.bind(this);
	window.addEventListener("message",_messageHandler,false);

	this.dispose = function() {
		window.removeEventListener("message",_messageHandler,false);
	}

	this.acceptPayment = function(response) {
		post("accept",response);
	}

	this.rejectPromise = function(data) {
		post("reject",data);
	}

	this.setShippingAddress = function(address) {
		post("shippingaddresschange",address);
	}

	this.setShippingOption = function(optionid,fireEvent) {
		post("shippingoptionchange",{id:optionid,fireEvent:fireEvent});
	}

	this.oninit = function() {};
	this.onupdate = function() {};
    this.onupdating = function() {};

	function post(name,data) {
		window.parent.postMessage({name:name,id:_id,data:data},"*");
	}

	function onMessage(msg) {
		var cmd = msg.data;
		if(!cmd.id || !cmd.name || (_id!=0 && cmd.id!=_id)) return; // message is not for us
		switch(cmd.name) {
			case "init":
				_id = cmd.id;
				this.oninit(cmd.data);
				break;
			case "update":
				this.onupdate(cmd.data);
				break;
            case "updating":
                this.onupdating(cmd.data);
                break;
			default:
				throw { name: "InvalidAccessError" };
		}
	}

	this.acceptedMethodIntersection = function(methodData,accepted) {
		var results = [];
        for(var c=0; c<methodData.length; c++) {
            var supported = methodData[c].supportedMethods;
    		for(var i=0; i<supported.length; i++) {
    			if(accepted.indexOf(supported[i])>=0) {
    				results.push(supported[i]);
    			}
    		}
        }
		return results;
	}
}
