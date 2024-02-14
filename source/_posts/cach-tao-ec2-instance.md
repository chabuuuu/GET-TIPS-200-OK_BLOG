---
title: 'AWS: Tạo EC2 Instace an toàn không mất tiền với Free Tier'
cover_image: ./thumbnail.png
readTime: About 4 minutes
wordCount: 419
charCount: 1780
imgCount: 12
vidCount: 0
wsCount: 2
cbCount: 0
date: 2024-02-14 20:21:14
tags:
---
Bài post hôm nay tôi sẽ tạo một EC2 Instance bằng Free Tier, không mất đồng nào nhé
## 1. Chuẩn bị
- [Tài khoản AWS Free Tier](https://aws.amazon.com/free)
Các bạn có thể đăng ký bằng thẻ Visa nhé, rất dễ thôi.
## 2. Tạo EC2 Instance
Vào luôn vấn đề, ta sẽ vào [AWS Console](https://console.aws.amazon.com/console/home) 
![alt text](image.png)
Sau đó các bạn tìm "EC2" trên search bar.
![alt text](<Screenshot from 2024-02-14 20-48-07.png>)
Ta vào tab Instances như trên hình, sau đó chọn "Lauch Instance"

### Application and OS Images
![alt text](image-2.png)
Ở đây các bạn có thể chọn bất cứ Linux Distro nào các bạn muốn, ở đây tôi sẽ chọn Ubuntu Server cho dễ dùng nhé
![alt text](image-3.png)
Việc chọn Ubuntu phiên bản mấy thì các bạn chọn những cái có chữ "Free Tier eligible nhé

### Instance type
![alt text](image-5.png)
Tiếp đến là chọn Instance Type, các bạn chọn cho mình con t2.micro nhé (bắt buộc nếu muốn free)

### Key pair (login) 
Key pair này sau khi tạo xong các bạn nhớ lưu lại để sau này có thể ssh connect từ máy chúng ta
![alt text](image-4.png)
Phần Key Pair này các bạn chọn "Create Key pair"

![alt text](image-6.png)
Ở đây các bạn đặt tên cho key, các option còn lại để như mình.

![alt text](image-7.png)
Key sẽ tự down về sau khi bạn tạo xong, hãy nhớ chỗ lưu key này để sau chúng ta sẽ ssh connect sau nhé

### Network settings 
Đây sẽ là nơi thiết lập các security rule cho các traffic in out của con EC2, các bạn có thể cài như sau:
![alt text](image-8.png)
- Allow SSH traffic from: Anywhere - Cài như này để có thể SSH từ máy chúng ta
- Allow HTTPS traffic from the internet - Cài như này để khi các bạn deploy web service lên trên con EC2 này thì có thể truy cập từ các client bên ngoài
- Allow HTTP traffic from the internet - Cũng tương tự, nhưng đây là HTTP traffic
Vì đây là tutorial nên tôi tạm thời sẽ để như vậy, trong thực tế, sau khi tạo xong con EC2 này các bạn nên tạo một Security Group riêng để tăng bảo mật cho web service của mình.

### Configure storage 
![alt text](image-9.png)
Đây là tùy chỉnh kích thước storage của con EC2, với Free Tier ta có thể tạo tối đa lên 30GB (loại EBS General Purpose (SSD) )

Cơ bản là đã xong, các tùy chỉnh còn lại các bạn có thể để mặc định
![alt text](image-10.png)
Ta chọn Lauch Instance và đợi một chút để AWS tạo một EC2 Instance
## 3. Kết nối qua SSH 
![alt text](image-11.png)