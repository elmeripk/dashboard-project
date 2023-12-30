const fs = require('fs');

function serveStatic(filePath, res){
    const wholePath = '../public/' + filePath
    fs.readFile(wholePath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            serveMissing(res);
          }else {
            res.statusCode = 500;
            res.write("There was an error serving your request");
          }
          return res.end();
        }
        
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      });
}

function getContentType(filePath){
    let extension = "";

    if(filePath.endsWith(".css")){
        extension = "text/css";
    }
    else if(filePath.endsWith(".js")){
        extension = "text/javascript";
    }
    else if(filePath.endsWith(".png")){
        extension = "image/png";
    }
    else if(filePath.endsWith(".jpg")){
        extension = "image/jpg";
    } else if (filePath.endsWith(".ico")){
        extension = "image/x-icon";
    }else{
        extension = "text/html";
    }
    return extension;
}

function serveMissing(res){
    res.writeHead(404, { 'Content-Type': 'text/html' })
    const missing_content = fs.readFileSync('../public/404.html');
    res.write(missing_content);
    res.end();
}


module.exports = {serveStatic, getContentType};