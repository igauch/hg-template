/*
 * 描述：updateHG
 * 作者：twj94
 * 创建时间：2018/1/18
 * 版权：Copyright 2017 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

let path = require('path');
let exec = require('child_process').exec;
let fs = require('fs');
let chalk = require('chalk');

let checkoutHG = `svn checkout https://howsodev.igauch.cn:8443/svn/howso/howso-element/element/HG 
                  ${path.resolve(__dirname, '../HG')}`;
let updateHG = `svn update ${path.resolve(__dirname, '../HG')}`;
let checkExist = fs.existsSync(path.resolve(__dirname, '../HG'));

if (checkExist) {
  fs.rename('./HG/.svn1', './HG/.svn', error => {
    if (error) {
      console.error(`exec error: ${error}`);
      return false;
    }
    exec(updateHG, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      fs.rename('./HG/.svn', './HG/.svn1', error => {
        if (error) {
          console.error(`exec error: ${error}`);
          return false;
        }
        console.log(chalk.green(`${'更新 ' + chalk.blue('HG')} 成功`));
      });
    });
  });
} else {
  exec(checkoutHG, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    fs.rename('./HG/.svn', './HG/.svn1', error => {
      if (error) {
        console.error(`exec error: ${error}`);
        return false;
      }
      exec(`svn add --non-recursive ./ && svn add components styles`, {cwd: path.resolve(__dirname, '../HG')}, error => {
        if (error) {
          console.error(`exec error: ${error}`);
          return false;
        }
      });
    });
    console.log(chalk.green(`${(checkExist ? '更新 ' : '检出 ') + chalk.blue('HG')} 成功`));
  });
}
