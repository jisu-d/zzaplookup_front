const fs = require('fs');
const { exec } = require('child_process');

// 텍스트 파일 생성
const content = '인쇄할 내용';
fs.writeFileSync('print.txt', content);

// 'print' 명령어 사용
const printCommand = 'print /D:"Canon SELPHY CP1300" print.txt';

// 명령어 실행
console.log(3)

export function print(){
    exec(printCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`인쇄 중 오류 발생: ${stderr}`);
        return `인쇄 중 오류 발생: ${stderr}`
      } else {
        console.log(`프린트 성공: ${stdout}`);
        return `프린트 성공: ${stdout}`
      }
    });
}
