---
title: Tổng hợp các phương pháp bảo mật API NodeJS chống hacker lỏ
wordCount: 2812
charCount: 16905
imgCount: 8
vidCount: 1
wsCount: 41
cbCount: 43
readTime: About 15 minutes
cover_image: /images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/photo_2024-03-06_20-32-41.jpg
tags:
  - api security
  - backend
  - base
categories:
  - backend
  - nodejs
date: 2024-02-28 09:34:09
description: "Những thứ nên setup ngay trước khi start mọi dự án backend - GET TIPS 200 OK"
---
Hôm nay tôi sẽ làm một bài viết tổng hợp các phương pháp, các package thường dùng để bảo mật API NodeJS trong thực tế.

## [1. Helmet](https://www.npmjs.com/package/helmet)
Đây là một npm package vô cùng phổ biến, và chắc chắn nên được tích hợp vào source code ngay khi bắt đầu dự án. Vậy package này làm gì?
Bây giờ, bạn hãy thử build một express api đơn giản như sau:
```
const express = require('express');
const app = express();
app.use('', (req, res, next)=>
{
    res.send('Hello World');
})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```
Bây giờ, từ terminal bạn hãy gõ lệnh curl sau để lấy ra header trả về từ api:
```
curl http://localhost:3000 --head
```
Và đây là kết quả trả về:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"
Date: Wed, 28 Feb 2024 02:43:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

Hãy chú ý phần X-Powerd-By, ta có thể thấy được chính xác backend server của chúng ta đang được viết bằng ExpressJS. Trong thực tế, việc này đã vi phạm tính bảo mật nghiêm trọng của một backend server, bởi lẽ, nếu hacker biết được chính xác phía backend chúng ta viết bằng gì, sử dụng những công nghệ nào,... Thì rõ ràng điều đó là quá dễ dàng để khoanh vùng các phương pháp để đánh sập, dễ dàng tìm kiếm các lỗ hổng trong kiến trúc backend của chúng ta.

May mắn thay, chúng ta có thể sử dụng package [helmet](https://www.npmjs.com/package/helmet) để giải quyết vấn đề này, đó cũng là lý do ta nên tích hợp package này vào mọi dự án backend của chúng ta.

Để cài đặt, ta gõ lệnh sau:
```
npm i helmet
```

Tôi sẽ sửa đoạn code lại như sau:

```
const express = require('express');
const helmet = require('helmet');
const app = express();

//Dùng helmet ở đây:
app.use(helmet());

app.use('', (req, res, next)=>
{
    res.send('Hello World');
})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```

Và đây là header server trả về sau khi dùng thêm helmet:

```
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"
Date: Sun, 03 Mar 2024 13:38:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

Vậy là ta đã che giấu đi được những thông tin quan trọng từ phía server!
Không hề có tag nào chứa cụm từ "Express" ở đây cả.

## [2. Rate Limit](https://www.npmjs.com/package/express-rate-limit)
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/Screenshot_20240303_212419.png)
### Vấn đề
{% blockquote %}
Vừa qua thì dân tình trên reddit nói chung và ae IT nói riêng đã phải ngơ ngác ngã ngửa vì có một bác nọ bị Netlify charge của ông ấy hết 104k Biden.
<strong>Lý do</strong>: web của ông ấy đã bị DDOS một cách nhiệt tình và tàn bạo 
Link bài viết: [reddit](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/?onetap_auto=true&one_tap=true)
{% endblockquote %}

Vậy đặt vấn đề đối với người làm backend như chúng ta, giả dụ như có một hacker nào đó liên tục thực hiện thử đi thử lại password, để mò pass (Brute Force) bằng cách gửi request liên tục tới api /login của bạn, hoặc là có ai đó cố tình request liên tục tới để làm sập server (DDOS như bác kia bị), thì bạn tính sao?

Một package khác không thể thiếu để phòng chống [Brute Force](https://viblo.asia/p/tan-cong-brute-force-la-gi-oOVlYbz458W), [DDOS Attack](https://www.microsoft.com/vi-vn/security/business/security-101/what-is-a-ddos-attack), đó là sử dụng thư viện [Rate limit](https://www.npmjs.com/package/express-rate-limit)

### Cơ chế
Đây là một thư viện sẽ giúp giới hạn số lượng request của user trong một khoảng thời gian cụ thể.
Cơ chế hoạt động có thể tóm gọn như sau: Mỗi khi một request gửi đến, nó sẽ lưu lại cặp key-value như sau:
```
type Client = {
	totalHits: number
	resetTime: Date
}
previous = new Map<string, Client>()
```
Trong đó, key là địa chỉ IP, còn value sẽ là Client gồm 2 property:
- totalHits: số lần IP đã truy cập
- resetTime: thời điểm mà ta sẽ reset lại toTalHits và gán lại resetTimes mới

Cặp key-value này mặc định sẽ được "Rate limit" lưu vào RAM cục bộ của máy, ngoài ra, ta còn có thể config cho nó lưu trên Redis, MongoDB,.. nhờ đó có ta có thể áp dụng cho hệ thống có nhiều máy chủ (load balancing)
Chi tiết các bạn xem tại: https://express-rate-limit.mintlify.app/reference/stores

### Cài đặt
```
npm i express-rate-limit
```

Sau đó các bạn thêm middleware vào code như sau:
```
const express = require('express');
const rateLimit = require('express-rate-limit')
const app = express();

//Setup rate limit
const limiter = rateLimit({
    message: 'Too many requests, please try again later.', //Message trả về khi vượt limit
	windowMs: 15 * 60 * 1000, // 15 phút
	limit: 3, // Limit mỗi IP 3 request mỗi 15 phút
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

//Apply rate limit cho tất cả các route
app.use(limiter)
app.use('', (req, res, next)=>
{
    res.send('Hello World');
})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```

Giờ bạn hãy thử request 3 lần tới api xem như nào nhé:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/image.png)

## [3. toobusy-js](https://www.npmjs.com/package/toobusy-js)
Cũng là giải pháp cho vấn đề DDOS, package này sẽ track liên tục xem server của bạn có đang rơi vào tình trạng quá tải hay không, nếu có, server sẽ báo về cho client là "Server is too busy!"

### Cài đặt

```
npm i toobusy-js
```

```
const express = require('express');
let toobusy = require('toobusy-js')
const app = express();
toobusy.maxLag(10); //Độ trễ tối đa được chấp nhận: 10ms
toobusy.interval(40); //Kiểm tra lag cứ mỗi 40ms
app.use('', async (req, res, next)=>
{
    if (toobusy()){
        res.send(503, "Server Too Busy");
    }
    res.send('Hello World');

})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```

Với config như trên, thì nếu server chạy khoảng 60-70% thì giá trị của toobusy() sẽ là true, việc sẽ handle tiếp theo như nào (dừng server, trả về lỗi,..) là do bạn quyết định.

## [4. CORS](https://www.npmjs.com/package/cors)
### CORS là gì?
Nếu là một lập trình viên frontend thì có lẽ bạn sẽ không xa lạ với khái niệm này. Cụ thể, nếu là dev front end ta sẽ dễ gặp lỗi như sau khi call tới api:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/Screenshot_20240303_220426.png)
Thật ra tôi dự định sẽ viết hẳn một bài riêng về vấn đề CORS này, nên trong post này tôi sẽ chỉ tóm gọn khái niệm và cách cài đặt package cors trong nodejs.

Nói nôm na, CORS có liên quan đến Same-origin policy, đây là một policy quy định rằng bất cứ request nào không từ cùng "origin" của server thì đều không được chấp nhận. Tôi lấy ví dụ: giả dụ như web https://hackfacebook.com gửi một request tới https://facebook.com thì sẽ không được chấp nhận và gây ra lỗi trên.
Sở dĩ có policy này là vì để tăng tính bảo mật, tránh trường hợp một website bên thứ 3 có thể ăn cắp thông tin facebook, tài khoản ngân hàng của bạn,...

Nhưng trong mô hình client-server, backend có thể được đặt ở một server khác frontend, điều đó sẽ vi phạm Same-origin policy.

Đó là lý do ta phải config CORS (Cross Origin Resource Sharing) cho backend bằng package: [cors](https://www.npmjs.com/package/cors)

### Test thử
Để xem thử lỗi do không cài đặt CORS là như nào, bạn hãy tạo một file index.html có nội dung như sau:
```index.html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>CORS in Node.js</title>
</head>
<body>
 <h1> Cors in Node.js</h1>
 <h1>This is the front-end page</h1>
 <h2>We will send a request from this front-end page to the back-end Express server</h2>
 <script>

     fetch("http://localhost:3000")
         .then(res => res.json())
         .then(data => console.log(data))

 </script>
</body>
</html>
```
Trong vscode, bạn hãy cài extension sau: [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Sau đó, bạn hãy bấm vào icon này:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/image2.png)
Lúc này, browser sẽ được mở lên, chuột phải chọn Inspect, sau đó chọn Tab Console bạn sẽ thấy lỗi như hình:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/image3.png)

### Cài đặt package cors
```
npm i cors
```

```
const express = require('express');
const cors = require('cors')
const app = express();


const corsOptions = {
    origin: 'http://127.0.0.1:5500', //URL của frontend
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

app.use(helmet());


app.use('', async (req, res, next)=>
{
    res.send('Hello World');

})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```

Trong corsOptions, ta có thể liệt kê các origin được phép truy cập tới Express Server này.

Bây giờ thử test lại request từ frontend, bạn sẽ không thấy lỗi nữa.

## 5. XSS Attack
Cross Site Scripting (XSS) là một dạng tấn công mã độc mà hacker sẽ chèn mã độc thông qua các đoạn script để thực thi chúng ở phía Client.
Chi tiết bạn có thể xem qua video sau:
  {% youtuber video 3_BfecB1Dqk %}
    height: 300
    width: 100%
  {% endyoutuber %}

Một trong những cách phổ biến để ngăn chặn loại tấn công trên đó là validate lại dữ liệu được gửi lên từ client.
Tôi giới thiệu package sau: [Express XSS Sanitizer](https://www.npmjs.com/package/express-xss-sanitizer?activeTab=readme)
Package này thực chất dựa trên [sanitize-html](https://www.npmjs.com/package/sanitize-html)

### Cài đặt
```
npm i express-xss-sanitizer
```

```
const express = require('express');
const {xss} = require("express-xss-sanitizer");
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(xss())
app.post('/data', (req, res) => {
    console.log('Data received', req.body);
    res.json({ message: 'Data received successfully', data: req.body });
  });

app.use('', async (req, res, next)=>
{
    res.send('Hello World');

})


app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```
Bây giờ, bạn hãy thử dùng Postman hoặc curl gửi request như sau:
```
curl --location 'localhost:3000/data' \
--data-urlencode 'test="<script>alert('\''XSS Attack!'\'');</script>"' \
--data-urlencode 'normal=hello'
```
Kết quả trả về sẽ là:
```
{
"message":"Data received successfully",
"data":
    {
    "test":"\"\"",
    "normal":"hello"
    }
}
```
Vậy là phần script bị chèn vào trường test đã bị loại bỏ, và ngăn chặn được XSS Attack!

## 6. Chống SQL Injection
Lại là vấn đề SQL Injection, nếu chưa biết SQL Injection là gì, hãy tham khảo tại [đây](https://gettips200ok.netlify.app/comming-soon/)

Phương pháp chống SQL Injection hiệu quả đó chính là sử dụng ORM

ORM (Object Relational Mapping) nói nôm na là kỹ thuật giúp chuyển dữ liệu trong CSDL quan hệ sang đối tượng.

Các ORM phổ biến trong NodeJS đó là [TypeORM](https://typeorm.io/), [Sequelize](https://sequelize.org/), [Prisma](https://www.prisma.io/), [Mongoose]()...

Mặc định, các ORM này sẽ giúp chống SQL Injection, hơn thế nữa còn giúp code dễ nhìn và dễ tái sử dụng, vì bạn không phải gõ thẳng SQL vào trong source nữa.

## 7. Giới hạn kích thước request
Cũng là một giải pháp để chống DDOS và DOS bằng cách giới hạn kích thước request giúp bảo vệ server khỏi việc bị quá tải bởi các request lớn và gửi liên tục. Ngoài ra còn giảm áp lực cho server, những request lớn có thể chiếm nhiều tài nguyên hơn và làm giảm khả năng xử lý của server

Để giới hạn kích thước body của request gửi lên server Nodejs, ta có thể dùng package [body-parser](https://www.npmjs.com/package/body-parser)

```
npm i body-parser
```

```
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

//Dùng tại đây:
app.use(bodyParser.json({ limit: "10kb" }));  //giới hạn request.body có size tối đa là 10kb
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use('', async (req, res, next)=>
{
    res.send('Hello World');
})
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```
## 8. Sử dụng Linter
Linter là gì? Linter là một công cụ dùng để phân tích source để phát hiện những lỗi sai, bug, vi phạm lỗi sai viết code.
Hầu như ngôn ngữ lập trình nào cũng có linter đi kèm: Python có Pylint, C# có FxCop hoặc StyleCop. JavaScript thì có JSHint, JSLint, ESLint.
[Danh sách các linter ứng với ngôn ngữ lập trình](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis)
Ở đây tôi sẽ sử dụng ESLint. Chi tiết sâu hơn cách sử dụng tôi sẽ để riêng trong bài viết [này](https://gettips200ok.netlify.app/comming-soon/)

### Cài đặt ESLint
```
npm install eslint --save-dev
```

Tạo file cấu hình:
```
npx eslint --init
```

Giờ, để chạy ESLint kiểm tra toàn bộ source code của bạn, hãy gõ:
```
npx eslint .
```

Hãy lưu script này vào package.json để sau này tiện dùng:
```
"scripts": {
  "lint": "eslint .",
  "lint-fix": "eslint . --fix"
}
```
Bây giờ bạn có thể chạy npm run lint để kiểm tra mã nguồn và npm run lint-fix để tự động sửa một số lỗi có thể tự động sửa được.

Quay lại vấn đề chính, tôi sẽ giới thiệu cho bạn một plugin eslint tên là [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security)
Trước hết, ta cài đặt package:
```
npm install --save-dev eslint-plugin-security
```
Sau đó, để cài plugin này vào ESLint, ta thực hiện tạo một file tên "eslint.config.js'
```
touch eslint.config.js
```
Các bạn bỏ code này vào:
```
const pluginSecurity = require('eslint-plugin-security');

module.exports = [pluginSecurity.configs.recommended];
```
Đã xong, các bạn hãy chạy lại eslint để test thử:
```
npm run lint
```

Giờ tôi sẽ thử tạo source code vi phạm security rule của nó xem sẽ bị thông báo như nào nhé:
```
const express = require('express');

const app = express();
app.post('/data', (req, res) => {
    console.log('Data received', req.body);
    eval(req.body) //Vi phạm security rule, vì dùng eval như này sẽ rất dễ bị XSS Attack!
    res.json({ message: 'Data received successfully', data: req.body });
  });

app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```
Chạy thử eslint:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/Screenshot_20240304_220811.png)

## 9. Bắt buộc client truy cập bằng HTTPS
HTTPS (HyperText Transfer Protocol Secure) là một dạng của giao thức HTTP sử dụng thêm tiêu chuẩn công nghệ có tên gọi là SSL (Secure Sockets Layer). Mục đích điều này là để mã hóa dữ liệu nhằm gia tăng tính an toàn và bảo mật trong việc truyền thông dữ liệu giữa máy chủ Web server và trình duyệt Web.
Nói đơn giản, dùng HTTP là không an toàn, và dữ liệu người dùng có thể dễ bị rò rĩ!

Vậy nên, ta sẽ sử dụng package [express-enforces-ssl](https://www.npmjs.com/package/express-enforces-ssl), package này sẽ buộc client phải truy cập bằng HTTPS
```
npm install express-enforces-ssl --save
```

```
const express = require('express');
const express_enforces_ssl = require('express-enforces-ssl');
const app = express();

app.use(express_enforces_ssl());

app.use('', async (req, res, next)=>
{
    res.send('Hello World');

})

app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
```

## 10. Ngăn chặn CSRF Attack
CSRF là gì? Hãy xem ở [đây](https://viblo.asia/p/ky-thuat-tan-cong-csrf-va-cach-phong-chong-amoG84bOGz8P)
Tóm tắt: CSRF là kiểu tấn công mà web hacker sẽ ăn cắp cookie từ một web T của bạn, và web hacker đó sẽ dùng cookie đó để tự do múa may quay cuồng trong web T đó bằng cookie của bạn.
Giải pháp: dùng package [csurf](https://www.npmjs.com/package/csurf/v/1.7.0?activeTab=readme)
Cài đặt:
```
npm i csurf
```

```
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
```
## 11. Validate Input
Rất quan trọng, ví dụ như validate password, validate email,...
Tôi sẽ giới thiệu một package tuyệt vời để làm điểu này, đó là [class-validator
](https://www.npmjs.com/package/class-validator)
```
npm i class-validator
```

```
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export class Post {
  @Length(10, 20)
  title: string;

  @Contains('hello')
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;

  @IsFQDN()
  site: string;

  @IsDate()
  createDate: Date;
}
```

Cách dùng chi tiết bạn hãy xem blog [này](https://gettips200ok.netlify.app/comming-soon/) của tôi.

## 12. Validate Output
Có validate output rồi thì phải có validate output, mục đích chủ yếu cũng là để tránh XSS,.. bằng cách validate lại output xem có script tào lao nào được trả về cho client hay không.
Một số package hữu dụng:

## 13. Hash Password, và những thứ quan trọng
Sẽ ra sao nếu một ngày nào đó hacker nắm được db của bạn? Đó là lý do ta nên mã hóa những dữ liệu quan trọng của người dùng trước khi đưa vào db.

Một package nổi tiếng để làm điều này đó là [Bcrypt](https://www.npmjs.com/package/bcrypt)
Chi tiết hơn về hashing các bạn hãy xem bài post [này](https://gettips200ok.netlify.app/comming-soon/)

### Cài đặt 
```
npm i bcrypt
```

```
const express = require("express");
const app = express();

//Bcrypt
const bcrypt = require('bcrypt');

app.post("/login", async (req, res) => {
  const password = req.body.password;
  const saltRounds = 10;
  await bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        res.send(hash);
    });
});
});

app.listen(3000, () =>
  console.log("Server running on port http://localhost:3000")
);

```

Giờ hãy gõ lệnh curl sau:
```
curl --location 'http://localhost:3000/login' \
--data-urlencode 'password=hello'
```

Các bạn sẽ thấy password đã được hashing:
```
$2b$10$cX/iW7kWYlDwJmmZQbbVbO/LrHVSCCG2perZD8KPh0whBVPnYCoy.
```

Giờ hãy lưu password đã hash này vào db, và bạn không phải lo nếu ai đó nắm db làm lộ pass.

## 14. Luôn handle error trước khi trả về người dùng
Điều cơ bản và luôn luôn phải làm, chẳng ai lại show ra cả dòng lỗi của sql ra màn hình cả! Vì như vậy rất dễ lộ những thông tin quan trọng.

Để làm điều này, bạn hãy chú ý đọc doc của các ORM, xem các mã lỗi như thế nào để biết cách handle error.

Đối với các lỗi về validate, luôn phải hanlde và trả về đúng cách message lỗi.

Bài viết về handle error bạn hãy xem blog [này](https://gettips200ok.netlify.app/comming-soon/)

## 15. Sử dụng file .env

File .env là gì? Đó là một file mà NodeJS sẽ load mỗi khi chạy, và tất nhiên nó không bị set cứng trong source code.

Hãy bỏ những <strong>secret key</strong>, ví dụ như SecretKey của VNPAY, SecretKey của JWT, hãy đưa vào file .env như này:

```
JWT_SECRET = "dasdasfadfds" //Your JWT Secret Key
JWT_EXPIRES_IN="120h"   //JWT Expire Time

DATABASE_URL="" //Your database connection string

EMAIL_USERNAME=""  //Your email address for sending verify email feature
EMAIL_PASSWORD="sadcxzc"  //Your google password, get by going to google setting and get 3rd app password

ROOT="http://localhost:3000/root" //Your root url

EMAIL_TOKEN_EXPIRE="120000"   //Expire time of email verify token (in ms)
```

Và đừng quên thêm .env vào .gitignore, vì lỡ như bạn public repo github thì việc bạn bỏ secret key vào .env cũng như không:
```
#.gitignore
/.env
```

## 16. Compression
Compression: nén file, là một kĩ thuật làm giảm size của các file lớn, ví dụ như ảnh, video,.. và có thể là cả JSON Response nếu nó quá nhiều.
 Một package tuyệt vời với hơn 19M lượt down mỗi tuần: [compression](https://www.npmjs.com/package/compression)

### Cài đặt
```
npm i compression
```

Sử dụng rất đơn giản:
```
const compression = require('compression')
app.use(compression())
```

### Kết quả
Trước khi compression:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/Screenshot_20240305_220235.png) 
Và boom, sau đó:
![alt text](/images/Tong-hop-phuong-phap-bao-mat-api-nodejs-chong-hacker/Screenshot_20240305_220321.png)

Từ 100mb xuống còn 100b, quá tuyệt vời!

Trên đây là list các package nên đưa vào mọi dự án NodeJS, có thể nhiều cái bạn không cần, nhưng đã dính đến vấn để security thì thà thừa còn hơn bỏ sót.

Github repo: https://github.com/chabuuuu/NodeJS-API-Security
