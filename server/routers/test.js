const express = require("express");
const router = express.Router();
require('dotenv').config();

var client_id = process.env.NAVER_LOGIN_CLIENT_ID;
var client_secret = process.env.NAVER_LOGIN_CLIENT_SECRET;
var state = process.env.NAVER_STATE;
var loginRedirectURI = encodeURI(process.env.NAVER_CALLBACK_REDIRECT_URL);
var callbackRedirectURI = encodeURI(process.env.NAVER_CALLBACK_REDIRECT_URL);
var api_url = "";

router.get("/naverlogin", function (req, res) {
  api_url = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + loginRedirectURI + "&state=" + state;
  
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  
  res.end(
    "<a href='" + api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  );
});

router.get("/callback", function (req, res) {
  code = req.query.code;
  state = req.query.state;
  console.log("code, state: ", code, state);
  
  api_url = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + callbackRedirectURI + "&code=" + code + "&state=" + state;
  
  var request = require("request");
  
  var options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      res.end(body);
      //여기서 쿠키 설정해주기?
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

router.get('/member', function (req, res) {
  var token = req.query.access_token;
  var header = "Bearer " + token; // Bearer 다음에 공백 추가

  var api_url = 'https://openapi.naver.com/v1/nid/me';
  var request = require('request');
  var options = {
      url: api_url,
      headers: {'Authorization': header}
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      console.log('error');
      if(response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });
});

module.exports = router;