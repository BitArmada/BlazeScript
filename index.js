import fs from "node:fs";

(async () => {
    var src = fs.readFileSync("src/main.c", "utf8");
    var wastreq = await fetch("https://wasmexplorer-service.herokuapp.com/service.php", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": `input=${encodeURIComponent(src)}&action=c2wast&version=1&options=-O3%20-std%3DC99`,
      "method": "POST"
    });

    const wast = await wastreq.text();
    
    var wasmreq = await fetch("https://wasmexplorer-service.herokuapp.com/service.php", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": `input=${encodeURIComponent(wast)}&action=wast2wasm&options=-O3%20-std%3DC99`,
      "method": "POST"
    });

    const wasmb64 = (await wasmreq.text()).replace(/^.*?\n/, "");

    
    fs.writeFileSync("./wasm/main.wasm", wasmb64, {
        encoding: "base64"
    })
})();