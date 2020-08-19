const fs = require('fs');
const http = require('http');
// 引入koa-router
const axios = require('axios')
const Router = require('koa-router');
const Koa = require('koa');
const static = require('koa-static')
const path = require('path') //路径管理
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const router = new Router();
// app.use(bodyParser()) 
let httpOpiton = {
    timeout: 120 * 1000,
}; //请求配置
// 配置静态资源
const staticPath = './static'
app.use(static(
    path.join(__dirname, staticPath)
))
// koa-router 中间件
router.get('/tiles/:z/:x/:y', async (ctx, next) => {
    let url = ctx.request.url
    const {
        x,
        y,
        z
    } = ctx.params
    let _path = path.join(__dirname, url)
    if (fs.existsSync(_path)) { //判断是否存在该文件
        let result = fs.readFileSync(_path);
        ctx.type = 'img'
        ctx.body = result
    } else {
      let isError = false;
        let errorHandler = () => {
            if (!isError) {
                isError = true;
            }
        };
        setTimeout(() => {
            let src = `http://api0.map.bdimg.com/customimage/tile?&qt=tile&x=${x}&y=${y}&z=${z}`;
            console.log('timeout:' + src)
            let req = http.get(src, httpOpiton, (res) => {
                    var buffer = null
                    res.on("data", function (chunk) {
                            if (!buffer) {
                                buffer = Buffer.from(chunk);
                            } else {
                                buffer = Buffer.concat([buffer, chunk]);
                            }
                        })
                        .on("end", async function () {
                            if (!isError) {
                                if (buffer && res.complete) {

                                    const pathAry = _path.split('/');
                                    const p = path.join(__dirname, pathAry[pathAry.length - 4] + '/' + pathAry[pathAry.length - 3])
                                    const p2 = path.join(__dirname, pathAry[pathAry.length - 4] + '/' + pathAry[pathAry.length - 3] + '/' + pathAry[pathAry.length - 2])
                                    // const fileExisted = await isFileExisted(path.join(__dirname, pathAry[pathAry.length - 4] + '/' + pathAry[pathAry.length - 3]))
                                    console.info(p)
                                    if (!fs.existsSync(p)) {
                                        fs.mkdirSync(p, {
                                            recursive: true
                                        });
                                    }
                                    if (!fs.existsSync(p2)) {
                                        fs.mkdirSync(p2, {
                                            recursive: true
                                        });
                                    }
                                    let stream = fs.createWriteStream(path.join(p2, pathAry[pathAry.length - 1]));
                                    stream.write(buffer);
                                    stream.end();
                                    stream.on('close', () => {
                                        console.log('\033[42;30m 成功 \033[40;32m ---' + src + '-- \033[0m')
                                    })
                                }
                            } else {
                                errorHandler();
                            }
                        })
                        .on('aborted', (err) => {
                            errorHandler();
                        });
                })
                .on('error', (e) => {
                    // console.log('\x1B[36m'+'error--->'+ src+'\x1B[39m')
                    errorHandler();
                })
                .on('timeout', () => {
                    console.log('timeout:' + src)
                    req.abort();
                });
        }, 0)
    }
});
router.get('/index.html', async (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./index.html');
    next()
});
// 将 router 挂载到app上
app.use(router.routes());

app.listen(3000);
console.log('koa project is starting at port 3000');

async function mkdirPath(pathStr) {
    var projectPath = path.join(process.cwd());
    var tempDirArray = pathStr.split('\\');
    for (var i = 0; i < tempDirArray.length; i++) {
        projectPath = projectPath + '/' + tempDirArray[i];
        if (await isFileExisted(projectPath)) {
            var tempstats = fs.statSync(projectPath);
            if (!(tempstats.isDirectory())) {
                fs.unlinkSync(projectPath);
                fs.mkdirSync(projectPath);
            }
        } else {
            fs.mkdirSync(projectPath);
        }
    }
    return projectPath;
};

/* 判断文件存在 */
function isFileExisted(path_way) {
    return new Promise((resolve, reject) => {
        fs.access(path_way, (err) => {
            if (err) {
                reject(false); //"不存在"
            } else {
                resolve(true); //"存在"
            }
        })
    })
};