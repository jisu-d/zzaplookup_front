const { exec } = require('child_process');

console.log(3)

function getPrinterList(callback) {
  const command = 'wmic printer get name';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      callback(error, null);
      return;
    }

    const printers = stdout.split('\n')
      .map(printer => printer.trim())
      .filter(printer => printer !== 'Name' && printer !== '');

    callback(null, printers);
  });
}

// 사용법
getPrinterList((error, printers) => {
  if (error) {
    console.error(`프린터 목록을 가져오는 중 오류 발생: ${error}`);
  } else {
    console.log('프린터 목록:', printers);
  }
});
