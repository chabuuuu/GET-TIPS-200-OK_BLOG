---
title: Tổng hợp các phương pháp bảo mật API NodeJS chống hacker lỏ
wordCount: 1317
charCount: 7898
imgCount: 5
vidCount: 0
wsCount: 27
cbCount: 14
readTime: About 7 minutes
date: 2024-02-28 09:34:09
tags:
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

