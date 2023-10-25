---
title: Typescript trong Nodejs - Tại sao lại dùng và cách set up
date: 2023-10-22 17:54:57
tags:
thumbnail: "/images/typescriptsetup/typescript-nodejs.png"
license: all_rights_reserved
---

## 1. Về Typescript

![Mang lag qua khong load duoc anh nay, sorry](/images/typescriptsetup/thumbnail.png)

 TypeScript là một ngôn ngữ lập trình hướng đối tượng được phát triển và duy trì bởi Microsoft. Nó là một tập hợp siêu cú pháp nghiêm ngặt của JavaScript và thêm tính năng kiểu tĩnh tùy chọn vào ngôn ngữ.

TypeScript ra đời bắt nguồn từ những thiếu sót của JavaScript đối với việc phát triển các ứng dụng quy mô lớn. Cụ thể là như nào? Ta cùng xem xét qua vấn đề tôi đặt ra ngay dưới đây.

Tôi học UIT, và ở đó tôi được học qua một môn có tên là Nhập môn lập trình, thì ở đó họ dạy tôi C++, cả sau này khi học các môn OOP hay DSA, ngôn ngữ sử dụng mà trường minh họa vẫn là C++. Và có vẻ như cũng có nhiều trường đại học giảng dạy C++ cho sinh viên như là một ngôn ngữ nền tảng, cho nên các bạn sẽ khá quen thuộc với cú pháp C++ như sau:

```c++
int age;
string name;
float score;
```
Các bạn có thể thấy kiểu syntax trên tạo nên một cấu trúc rất rõ ràng, kiểu dữ liệu được viết tường minh ra giúp cho việc đọc hiểu code dễ dàng hơn.

Nhưng quay trở lại với Javascript, tôi ngỡ ngàng vì kiểu syntax đặc biệt của nó (và cả Python nữa, nhưng đây là một trường hợp đặc biệt mà tôi sẽ trình bày trong 1 post khác).

![Mang lag qua khong load duoc anh nay, sorry](/images/typescriptsetup/python&js.png)

Cụ thể như sau:

``````javascript
var age
var name
var score
``````

Wait, rõ ràng là viết như thế mọi thứ sẽ vô cùng đơn giản và nhẹ đầu cho lập trình viên trong quá trình phát triển mà? Thế thì có gì đáng nói chứ? 

Đồng ý là kiểu syntax như trên giúp việc code đỡ lằng nhằng hơn, nhưng chờ đã, trong 1 dự án lớn không phải chỉ có mình bạn làm việc, có thể là một người nào đó sau này xem code của bạn, hoặc chính bạn tự xem lại code của mình và...cái hỗn độn gì đây? Việc bạn khai báo biến như vậy thì bạn sẽ không hề biết kiểu dữ liệu của nó, bạn phải đọc toàn bộ logic bên dưới, xem biến đó được dùng vào việc gì, dùng như thế nào để đoán ra kiểu dữ liệu của nó. Khá mất thời gian.

Thêm một vấn đề nữa mà ta sẽ hay gặp phải, tôi lấy ví dụ như sau: 
 Lúc đầu, trong quá trình phát triển tôi khai báo biến Year, và dù cho Javascript không cần ghi rõ ra kiểu dữ liệu của biến này, nhưng trong đầu tất cả mọi người đều hiển nhiên cho rằng đó là kiểu number, đúng chữ? (rõ ràng là vậy), nhưng xuống phía dưới, qua một vài function thì có thể vô tình làm biến Year ban đầu bị đổi kiểu dữ liệu, như thành string chẳng hạn, điều đó dẫn tới những lỗi logic sau này mà chỉ khi thực thi ta mới thấy được.

Ví dụ: Tôi có 1 function tính năm hết hạn của 1 hợp đồng, biết các hợp đồng đều sẽ hết hạn sau 5 năm, đầu vào là 1 file csv chứa năm bắt đầu hợp đồng có nội dung như sau: 
``````contract.csv
start
2011
2023
2013
``````
Và code của tôi như sau: 

``````javascript
const fs = require('fs');
const csv = require('csv-parser');

//Hàm đọc file contract.csv, trả về là một mảng các object như sau: [ { start: '2011' }, { start: '2023' }, { start: '2013' } ]
function readCSV(filename) {
    return new Promise((resolve, reject) => {
        const resultArray = [];
        const stream = fs.createReadStream(filename)
            .pipe(csv())
            .on('data', (data) => resultArray.push(data))
            .on('end', () => {
                resolve(resultArray);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

//Hàm in ra mảng các năm kết thúc hợp đồng
async function printEndYear(contractTerm){
    const contractEndArray = []
    const contractStartArray = await readCSV('contract.csv');
    for (var contract of contractStartArray) {
        contractEndArray.push(contract.start + contractTerm);
    }
    console.log(contractEndArray);
}

printEndYear(5);
``````

Từ file csv trên, tôi có thể dự đoán được kết quả in ra màn hình phải là:
``````
[ 2016, 2028, 2018 ]
``````
Nhưng không, trên thực tế kết quả trên màn hình lại là: 
``````
[ '20115', '20235', '20135' ]
``````
Vì sao lại có kết quả này? Đó là vì:
`````` javascript
        contractEndArray.push(contract.start + contractTerm);
``````
Dòng contract.start sẽ trả về giá trị là kiểu string, chứ không phải number, cho nên lúc này javascript sẽ thực hiện nối chuỗi và cho ra kết quả ngoài ý muốn.

Đến đây thì bạn sẽ bảo là ồ, thế thì chỉ cần parseInt(contract.start) là xong mà, cần gì thằng làm blog phải trình bày dài dòng thế nhỉ? 

Nhưng mà, vấn đề ở đây là, bạn không hề biết về lỗi xảy ra do đoạn code sai phía trên vẫn có thể chạy được bình thường mà không gặp chút vấn đề gì. Và trong 1 dự án lớn, với hàng đống các function thì việc debug được một lỗi như vậy sẽ hết sức khó khăn.

Đó cũng chính là lúc mà Typescript thực sự tỏa sáng.

Tôi yêu Typescript, tôi yêu sự tường minh và rõ ràng rành mạch của nó như cái cách mà Java hay C++ đang làm. Cụ thể, với cùng đoạn code trên khi dùng Typescript sẽ như sau: 

![Mang lag qua khong load duoc anh nay, sorry](/images/typescriptsetup/exampleWithTS1.png)

Bạn có thể thấy screenshot đỏ chót phía trên, khác hẳn với anh js im phăng phắc thì code bằng Typescript sẽ đầy cảnh báo la làng báo lỗi trong khi tôi còn chưa chạy chương trình, điều đó giúp phát hiện rất sớm các lỗi không đáng có trong quá trình phát triển

Các ưu điểm khác của Typescript mà tôi sẽ liệt kê ra như sau:

- Dễ dàng hơn trong phát triển các dự án lớn, được hỗ trợ bởi các Javascript Framework lớn.
- Hầu hết các cú pháp hướng đối tượng đều được hỗ trợ bởi Typescript như kế thừa, đóng gói, constructor, abstract, interface, implement, override…v.v
- Cách tổ chức code rõ ràng hơn, hỗ trợ cơ chế giúp kiến trúc hệ thống code hướng module, hỗ trợ namespace, giúp xây dựng các hệ thống lớn nơi mà nhiều lập trình viên có thể làm việc cùng nhau một cách dễ dàng hơn.
- Hỗ trợ các tính năng mới nhất của Javascript. TypeScript luôn đảm bảo việc sử dụng đầy đủ các kỹ thuật mới nhất của Javascript, ví dụ như version hiện tại là ECMAScript 2015 (ES6).
- Một lợi thế của Typescript nữa là mã nguồn mở vì vậy nó miễn phí và có cộng đồng hỗ trợ rất lớn.
- Với static typing (kiểm tra lỗi lúc compile time) như ví dụ trên, code viết bằng TypeScript dễ dự đoán hơn, và dễ debug hơn.

# 2. Cách set up Typescript trong Nodejs
Với quá nhiều ưu điểm như vậy, thì không chân chờ gì nữa mà ta không lao vào set up và dùng luôn Typescript nhỉ?

Dưới đây là một cách cơ bản để set up Typescript trong Nodejs

- Đầu tiên tôi sẽ khởi tạo 1 dự án Nodejs
``````shell
npm init -y
``````

- Tiếp đến ta cài đặt Typescript Package vào Dev dependencies:
``````shell
npm install typescript --save-dev
``````

- Ta khởi tạo file tsconfig.json bằng lệnh sau:
``````shell
npx tsc --init
``````

Ta sẽ cùng tìm hiểu qua về file tsconfig.json
Bỏ qua các dòng comment, khi mới khởi tạo ta sẽ có file tsconfig như sau:

``````json
{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    /* Type Checking */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

``````

Bạn hãy config file tsconfig thành thế này:

``````json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "esModuleInterop":true,
    "outDir"    : "js",
  },
  "include": [
    "src/**/*.ts"
],
"exclude": [
    "node_modules"
]

}
``````
Giải thích qua một chút, "include" chính là path dẫn đến các file Typescript nơi bạn muốn Typescript compile thành Javascript
"outDir" : "js", nghĩa là, Typescript sẽ được biên dịch thành file Javascript và đưa vào thư mục "js".
"exclude" chứa những thứ mà bạn không muốn Typescript compile.

Phần config trong file tsconfig này tôi sẽ viết chi tiết hơn trong 1 post khác.

Tôi sẽ cài Express bằng lệnh sau:

``````shell
npm i express @types/express 
``````

Vậy là cơ bản đã xong, giờ tôi sẽ thử giải quyết vấn đề năm hết hạn hợp đồng mà đã ví dụ ở trên bằng Typescript và Nodejs. Giả dụ tôi tạo 1 dự án có cấu trúc như sau:

![Mang lag qua khong load duoc anh nay, sorry](/images/typescriptsetup/structure-tree.png)

Bây giờ tôi sẽ cài các thư việc cần thiết để đọc file csv:

``````shell
npm i csv-parser fs
``````

Trong contract.service.ts, tôi chuyển từ javascript thành typescript như sau:
``````typescript
import * as fs from 'fs';
import csv = require('csv-parser');
type ContractData = {
  start: string;
};
export class ContractService{
  readCSV(filename: string): Promise<ContractData[]> {
    return new Promise((resolve, reject) => {
      const resultArray: ContractData[] = [];
      const stream = fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (data: ContractData) => resultArray.push(data))
        .on('end', () => {
          resolve(resultArray);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }
  
  async getEndYear(contractTerm: number) {
    const contractEndArray: number[] = [];
    const contractStartArray: ContractData[] = await this.readCSV('contract.csv');
    for (const contract of contractStartArray) {
      contractEndArray.push(parseInt(contract.start) + contractTerm);
    }
    return contractEndArray;
  }
}
``````
Trong server.ts, tôi viết như 1 dự án dùng Express như bình thường:
``````typescript
import express from 'express';
import { ContractService } from './service/contract.service';
const contractService = new ContractService();
const app = express();
const port = 3000;
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use('/', async (req, res, next) => {
    const result = await contractService.getEndYear(5);
    res.json(result);
})
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
``````

Và BOOM!, khi GET / thì ta sẽ được trả về file json như sau: 

![Mang lag qua khong load duoc anh nay, sorry](/images/typescriptsetup/json_result.png)

Vậy là ta đã không gặp phải bất kì lỗi nào như khi dùng Javascript, chỉ bằng cách khai báo rõ ràng kiểu dữ liệu ngay từ đầu bằng Typescript!

Bài viết của tôi cũng đã khá dài, hy vọng sẽ giúp ích được cho các bạn. Tạm biệt.

