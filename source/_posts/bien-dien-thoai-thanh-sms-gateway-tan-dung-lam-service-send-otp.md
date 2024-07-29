---
title: Biến điện thoại thành SMS Gateway để tận dùng làm Send OTP Service
cover_image: >-
  /images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/thumbnail.jpg
tags:
  - backend
wordCount: 501
charCount: 3558
imgCount: 6
vidCount: 0
wsCount: 1
cbCount: 4
readTime: About 3 minutes
date: 2024-05-01 08:55:23
description: "Không phải mất tiền thuê dịch vụ sms bên thứ 3 nữa => Biến điện thoại cá nhân thành SMS Gateway - GET TIPS 200 OK"
---

![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/thumbnail.jpg)

Bạn đang làm đồ án, và đang làm chức năng gửi mã xác thực OTP cho user, ok dễ thôi, vậy chỉ cần tìm một dịch vụ send OTP nào đó, gọi API đến là xong!

Có rất nhiều dịch vụ send SMS như:
- Twilio SMS API
- Vonage SMS API
- TextBetter SMS API

...

Quá vui sướng, bạn đang ký tài khoản, mà không biết rằng bảng giá cho dịch vụ send sms như sau:

![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/pricing.png)

Ngoài ra bạn phải trả tiền thuê số điện thoại, nói chung là mức giá này bỏ ra để làm đồ án thì không đáng, tất nhiên nếu đưa vào thực tế thì các dịch vụ này sẽ hợp lý, vì khi đó mua theo gói sẽ có giảm giá.

Bài viết ngày hôm nay tôi sẽ giới thiệu một tips nhỏ giúp biến điện thoại cá nhân thành SMS Gateway để gửi tin nhắn xác thực OTP cho ứng dụng backend.

Lướt qua các store thì tôi thấy có các app sau:

#### Android:
- [Android sms gateway](https://github.com/capcom6/android-sms-gateway?fbclid=IwAR39GFLWx8LXw0hw298CutX5Hgi1CBVACQkIaBwJ69kKGqCgdkcz4AqzSVQ)

#### IOS:
[SMSGateway](https://apps.apple.com/us/app/smsgateway/id6443902592)

Tất nhiên trong bài viết này, tôi sẽ dùng app Android sms gateway, vì tôi không có iPhone.

## Setup SMS Gateway

![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/photo_2024-05-01_09-15-01.jpg)

Nhìn sơ qua ta có 2 tùy chọn:
- Local Server: cho phép reques trong mạng cục bộ
- Cloud Server: nhận request toàn cục, vì bản chất request sẽ gửi đến một cloud server, sau đó bắn qua bên điện thoại của chúng ta.

Vậy bạn chọn Cloud server, sau đó tích vào nút "Offline"

Lúc này, trên máy tính bạn có gõ lệnh curl sau để test thử:

```
curl -X POST -u <username>:<password> \
  -H "Content-Type: application/json" \
  -d '{ "message": "Hello, world!", "phoneNumbers": ["79990001234", "79995556677"] }' \
  https://sms.capcom.me/api/3rdparty/v1/message
```

Trong đó: 
- username:password chính là dòng sau:


 ![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/username-password.jpg)

- message: Nội dung tin nhắn
- phoneNumbers: list số điện thoại nhận, điền dưới dạng kèm mã quốc gia ví dụ +84972818472

```
curl -X POST -u DASJDA:cxncziasadas   -H "Content-Type: application/json"   -d '{ "message": "Hello, world!", "phoneNumbers": ["+84972818472"] }'   https://sms.capcom.me/api/3rdparty/v1/message
```

 ![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/result.jpg)

## Setup backend server

Đơn giản là ta có thể dùng axios để gọi api. Ngoài ra, phía app trên cũng cung cấp thư viện riêng để giao tiếp: https://github.com/capcom6/android-sms-gateway-ts
Nhưng tốt hơn tôi nghĩ nên dùng axios gọi api thuần, vì lỡ sau này app dead còn dễ thay.

Tôi sẽ tạo một server express đơn giản như sau:

```
import 'dotenv/config'
import express from 'express'
import axios from "axios";
import { StatusCodes } from "http-status-codes";
const sms_api = process.env.SMS_API || 'https://api.sms.com';
const sms_username = process.env.SMS_USERNAME || 'none';
const sms_password = process.env.SMS_PASSWORD || 'none';

const app = express()
async function sendSms(content: string, phoneNumbers: Array<string>) : Promise<any>{        
        const send_payload = JSON.stringify({
            message: content,
            phoneNumbers: phoneNumbers
        })
        const {data} = await axios.post(`${sms_api}`, send_payload, {
            headers: {
                "Content-Type": "application/json",
            },
            auth:{
                username: sms_username,
                password: sms_password
            }
        });
        console.log(data);
}

app.post('send-sms', async (req, res) => {
    const {content, phoneNumbers} = req.body
    try{
        sendSms(content, phoneNumbers);
        res.status(StatusCodes.OK).send("SMS sent successfully");
    }catch(e){
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed to send SMS");
    }
})
```

Các bạn setup file env như thế này:
```
SMS_USERNAME="SMS USER NAME"
SMS_PASSWORD="SMS PASSWORD"
SMS_API="https://sms.capcom.me/api/3rdparty/v1/message"
```
Link repo github: https://github.com/chabuuuu/sms-gateway-demo

Sau đó ta test thử:

 ![alt text](/images/bien-dien-thoai-thanh-sms-gateway-tan-dung-lam-service-send-otp/POSTMAN.png)

Vậy là thành công, còn lại là code logic tạo và xử lý mã OTP, tôi sẽ có một bài viết sau.