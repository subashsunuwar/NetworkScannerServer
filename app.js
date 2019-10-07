var express    = require('express');
var exec = require('child_process').exec;

var app = express()

var deviceList = [];

exec("sudo fping -a -q -g 10.42.0.0/24", function(error, stdout, stderr){
  //console.log(stdout);
  var tmp = stdout.split('\n');
  deviceList=[];
  for(i in tmp){
    console.log(i+" : "+tmp[i]);
    if(tmp[i]!=""){
      deviceList.push({ip:tmp[i]});
    }
  }
});

app.get('/devices',function(req,res){
        res.status(200).send(deviceList);
})

app.get('/portscan',function(req,res){
  console.log(req.query);
  exec("sudo nmap "+req.query.ip +" -Pn", function(error, stdout, stderr){
    //console.log(stdout);
      var temp= stdout.split('\n');
      var data="";
      for(var i=5;i<temp.length-2;i++){
        data+=temp[i]+"\n";
      }
      res.status(200).send(data);
  });
});

app.get('/traceroute',function(req,res){
  console.log(req.query);
  exec("traceroute "+req.query.ip, function(error, stdout, stderr){
    res.status(200).send(stdout);
  });
});

app.get('/refresh',function(req,res){
  exec("sudo fping -a -q -g 10.42.0.0/24", function(error, stdout, stderr){
    //console.log(stdout);
    var tmp = stdout.split('\n');
    deviceList=[];
    for(i in tmp){
      console.log(i+" : "+tmp[i]);
      if(tmp[i]!=""){
        deviceList.push({ip:tmp[i]});
      }
    }
    res.status(200).send(deviceList);
  });
});


var server = app.listen(8089,function(){
        console.log("Server Listening on Port 8089");
})