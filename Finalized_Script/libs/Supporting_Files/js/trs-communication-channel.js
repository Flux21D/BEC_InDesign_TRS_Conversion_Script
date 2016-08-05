/* 	TRS Communication Channel
*
*	A javascript library that allows for parsed html products to be communicate to the
* 	parent Content Display Application.
*
*	This channel helps to facilitate:
*		- The launching of ebooks
*		- The launching of other digital products
*
*	@author Kevin Valentine
*/

(function(window){
	'use strict'

	function define_channel(){

		function CommunicationChannel(){
			var self = this;

			if(window.frameElement && window.frameElement.localName == "iframe"){
			    window.removeEventListener('message',_receivedMessage);
			    window.addEventListener('message',_receivedMessage);
			    this.parentApplicationAvailable = true;
			}else{
				alert('This file is a local file and was not loaded by the iTRS/Content Display engine. The TRS Communications Channel will launch all links locally. You can view that this is working correctly opening up your browsers console.');
			    this.parentApplicationAvailable = false;
			}

			/* Wait 5 seconds before we set up value. Gives the page time to do any other rendering it needs */
			setTimeout(function(){
				self.container = document.querySelector("body");
				self.elementsArray = document.querySelectorAll('[data-extLink]');
				self.init();
			},5000);
		}

		/*	init
		*	
		*	The initialize function for the Communication Channel.
		*	Adds an event listener to all elements with the property of [data-extlink]
		*
		*/
		CommunicationChannel.prototype.init = function(){
			var self = this;

			for(var k = 0; k < this.elementsArray.length; k++){
				this.elementsArray[k].addEventListener("click", function(e){
					e.preventDefault();

					var dataset = e.currentTarget.dataset;
					if(self.parentApplicationAvailable){

						window.parent.postMessage({
		                    type:dataset.type,
		                    operation:'changePage',
		                    data:{
		                        extlink:dataset.extlink
		                    }
		                },window.location.origin);

					}else{
						console.log('TRS Communications Channel is launching '+ dataset.extlink +' locally.');
						window.open(dataset.extlink,'_parent');

					}
				});
			}
		}

		return new CommunicationChannel();
		
	}

	if(typeof CommunicationChannel === "undefined"){
		window.CommunicationChannel = define_channel();
	}else{
		 console.log("A TRS Communications Channel is already defined.");
	}
})(window);


