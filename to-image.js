const fs = require('fs');

const result = '';

const resultArray = JSON.parse(result);

resultArray.forEach((body, i) => {
    base64Data = body.replace(/^data:image\/png;base64,/,"");
    binaryData = Buffer.from(base64Data, 'base64').toString('binary');

  fs.writeFileSync(`gif/out-${i + 1}.png`, binaryData, "binary", function(err) {
    console.error(err);
  })
})
