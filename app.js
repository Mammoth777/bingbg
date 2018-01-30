const http = require('http');
const fs = require('fs');
const path = require('path');
const wallpaper = require('wallpaper');
const bingurl = 'http://cn.bing.com';

http.get(bingurl, res => {
  res.setEncoding('utf-8');
  let html = '';
  res.on('data', chunk => {
    html += chunk;
  })
  res.on('end', err => {
    if (err) console.log(err);
    let imgarr = html.match(/\/az.+?1920x1080\.jpg/g);
    imgarr.forEach((ele, index) => {
      imgarr[index] = ele.replace(/\\/g, '');
    });
    // 已得到图片链接数组, 只用第一个吧
    if (!imgarr.length) {
      console.warn('img not found');
      return;
    }
    const imgurl = bingurl + imgarr[0];
    // down img
    http.get(imgurl, res => {
      let img = '';
      res.setEncoding('binary');
      res.on('data', chunk => {
        img += chunk;
      })
      res.on('end', err => {
        if (err) throw err;
        const Today = new Date();
        const name = path.join('./bgimgs', 'today' + Today.getFullYear() + (Today.getMonth() + 1) + Today.getDate() + '.jpg');
        console.log(name);
        fs.writeFile(name, img, 'binary', err => {
          if (err) console.log(err);
          console.log('down img ok');
          wallpaper.set(name).then( () => {
            console.log(name);
          }, err => {
            console.log(err); // 莫名其妙的错... 
          })
        })
      })
    })
  })
})