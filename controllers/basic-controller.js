// blah1 is the column name/ name attr in html
"use strict";
(function() {

  const express = require("express");
	const router = express.Router();
	

//================================================== 

//================================================== 
router.get("/", function(req, res) {
 res.json({
	 status: '200'
 })
});


//==================================================
module.exports = router; // Export routes for server.js to use.
////////////////////////////////////////////////////
})();
