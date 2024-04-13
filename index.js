const fs = require('fs');
const readline = require('readline');
const ipterate = require('ipterate');
var https = require('https');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;



async function CheckProxmox() {
  const fileStream = fs.createReadStream('IPs.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    console.log(`--- Processing: ${line} ---`);
    ipterate.range(line).iterateAsync(ip => {
        let request = https.get(`https://${ip}:8006/pve2/images/logo-128.png`, (res) => {
            if (res.statusCode == 200) {
                console.log(`${ip} has a open proxmox install: https://${ip}:8006)`);
                res.resume();
                return;
            }
        }).on('error', (err) => { 
        });
    });
  }
}

CheckProxmox();