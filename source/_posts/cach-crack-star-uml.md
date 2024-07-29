---
title: Cách crack Star UML và các app viết bằng ElectronJS nói chung
cover_image: /images/cach-crack-star-uml/image.png
categories: 'small tips'
wordCount: 299
charCount: 1642
imgCount: 5
vidCount: 0
wsCount: 4
cbCount: 8
readTime: About 2 minutes
date: 2024-03-16 13:20:56
tags:
description: "Xem liền để làm đồ án môn công nghệ phần mềm nè - GET TIPS 200 OK"
---
![alt text](/images/cach-crack-star-uml/image.png)
Star UML là một app dùng để vẽ UML rất tiện, nhưng tất nhiên là tốn phí.
May mắn thay, con app này viết bằng ElectronJS, nên việc crack là rất dễ đối với chúng ta.

## Cài đặt StarUML
Trươc hết các bạn cài bản chính chủ tại đây: https://staruml.io/

## Sửa lại source code của StarUML
Đầu tiên các bạn cần cài đặt một npm package có tên là asar
```
npm i -g asar
```
Đây là package chuyên dùng để đóng gói source code của app ElectronJS
Giờ bạn hãy tìm thư mục chứa các file của StarUML
Đường dẫn sẽ thường ở:

 - Mac OS: <strong>/Applications/StarUML/resources/</strong> 
 - Linux: <strong>/opt/StarUML/resources/</strong>
 - Windows:  <strong>C:\Program Files\StarUML\resources</strong>

Lúc này bạn sẽ thấy file có tên app.asar ở đây:
![alt text](/images/cach-crack-star-uml/Screenshot_20240316_132748.png)
Nhiệm vụ của chúng ta bây giờ là dùng asar npm pakage để mở bung file app.asar này thành source code ban đầu.
Các bạn gõ:
Đăng nhập quyền root:
```
su
```
Bung file app.asar:
```
asar extract app.asar app
```
![alt text](/images/cach-crack-star-uml/Screenshot_20240316_133239.png)
Lúc này bạn sẽ thấy xuất hiện folder app, đây chính là source code ban đầu của StarUML, và tất nhiên, nó được viết bằng Javascript.
Giờ bạn hãy vào /src/engine
Gõ lệnh sau:
```
sudo vim license-manager.js 
```
Bây giờ tìm đến dòng này:
![alt text](/images/cach-crack-star-uml/Screenshot_20240316_134255.png)
Sửa phần được tô đen thành:
```
var status = true;
var licenseInfo = {licenseType: "PRO"}
```
Tiếp đến hãy tìm hàm này:
![alt text](/images/cach-crack-star-uml/Screenshot_20240316_134455.png)
Và sửa lại thành:
```
checkLicenseValidity () {
this.validate().then(() => {
setStatus(this, true)
}, () => {
setStatus(this, true)
})
}
```
Vậy là xong!
Các bạn hãy save lại file, nếu dùng vim hãy gõ :x
Bây giờ, quay trở về folder resources, hãy gõ lệnh sau:
```
su
```

```
asar pack app app.asar
```

Hoàn tất, giờ hãy mở thử app Star UML lên và xem thử.

Các app electronJS khác cũng sẽ có cách crack tương tự như vậy. Cảm ơn bạn đã xem post.