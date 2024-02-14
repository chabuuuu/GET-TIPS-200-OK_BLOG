---
title: 'AWS: Tạo EC2 Instace an toàn không mất tiền với Free Tier'
cover_image: /images/cach-tao-ec2-instance/thumbnail.png
readTime: About 10 minutes
wordCount: 1162
charCount: 5572
imgCount: 32
vidCount: 0
wsCount: 2
cbCount: 2
date: 2024-02-14 20:21:14
tags:
---
Bài post hôm nay tôi sẽ tạo một EC2 Instance bằng Free Tier, không mất đồng nào nhé
## 1. Chuẩn bị
- [Tài khoản AWS Free Tier](https://aws.amazon.com/free)
Các bạn có thể đăng ký bằng thẻ Visa nhé, rất dễ thôi.
## 2. Tạo EC2 Instance
Vào luôn vấn đề, ta sẽ vào [AWS Console](https://console.aws.amazon.com/console/home) 

![alt text](/images/cach-tao-ec2-instance/1image.png)
Sau đó các bạn tìm "EC2" trên search bar.
<br>
![alt text](</images/cach-tao-ec2-instance/Screenshot from 2024-02-14 20-48-07.png>)
Ta vào tab Instances như trên hình, sau đó chọn "Lauch Instance"
<br>
### Name and tags

![alt text](/images/cach-tao-ec2-instance/image.png)
Các bạn chọn Add new Tag

<br>


![alt text](/images/cach-tao-ec2-instance/image-1.png)
- Chỗ value các bạn điền tên của EC2 Instance sẽ hiện trên AWS
- Resources type các bạn có thể chọn như mình
<br>

### Application and OS /images/cach-tao-ec2-instance/1Images
![alt text](/images/cach-tao-ec2-instance/1image-2.png)
Ở đây các bạn có thể chọn bất cứ Linux Distro nào các bạn muốn, ở đây tôi sẽ chọn Ubuntu Server cho dễ dùng nhé
<br>

![alt text](/images/cach-tao-ec2-instance/1image-3.png)
Việc chọn Ubuntu phiên bản mấy thì các bạn chọn những cái có chữ "Free Tier eligible nhé
<br>

### Instance type
![alt text](/images/cach-tao-ec2-instance/1image-5.png)
Tiếp đến là chọn Instance Type, các bạn chọn cho mình con t2.micro nhé (bắt buộc nếu muốn free)
<br>

### Key pair (login) 
Key pair này sau khi tạo xong các bạn nhớ lưu lại để sau này có thể ssh connect từ máy chúng ta
![alt text](/images/cach-tao-ec2-instance/1image-4.png)
Phần Key Pair này các bạn chọn "Create Key pair"
<br>

![alt text](/images/cach-tao-ec2-instance/1image-6.png)
Ở đây các bạn đặt tên cho key, các option còn lại để như mình.
<br>

![alt text](/images/cach-tao-ec2-instance/1image-7.png)
Key sẽ tự down về sau khi bạn tạo xong, hãy nhớ chỗ lưu key này để sau chúng ta sẽ ssh connect sau nhé
<br>

### Network settings 
Đây sẽ là nơi thiết lập các security rule cho các traffic in out của con EC2, các bạn có thể cài như sau:
![alt text](/images/cach-tao-ec2-instance/1image-8.png)
- Allow SSH traffic from: Anywhere - Cài như này để có thể SSH từ máy chúng ta
- Allow HTTPS traffic from the internet - Cài như này để khi các bạn deploy web service lên trên con EC2 này thì có thể truy cập từ các client bên ngoài
- Allow HTTP traffic from the internet - Cũng tương tự, nhưng đây là HTTP traffic
Vì đây là tutorial nên tôi tạm thời sẽ để như vậy, trong thực tế, sau khi tạo xong con EC2 này các bạn nên tạo một Security Group riêng để tăng bảo mật cho web service của mình.
<br>

![alt text](/images/cach-tao-ec2-instance/image-2.png)
Chỗ subnet này các bạn chọn Create new subnet
<br>

![alt text](/images/cach-tao-ec2-instance/image-3.png)
Chỗ VPC này các bạn chọn VPC mà hiện ở bên trang tạo EC2, trong mục Network setting vừa nãy
<br>

![alt text](/images/cach-tao-ec2-instance/image-6.png)
Đây là nơi bạn sẽ thực hiện chia Subnet cho con EC2 của mình. Phần này cần bạn có kiến thức căn bản về chia Subnet, ở đây tôi sẽ giải thích dễ hiểu như sau:
<br>

![alt text](/images/cach-tao-ec2-instance/image-7.png)
Chỗ này các bạn cứ để mặc định theo AWS, nôm na thì đây là một dãy các địa chỉ IP, /16 có nghĩa là 16 bit sẽ dành cho địa chỉ mạng + host, các bạn sẽ lấy 32 - 16 = 16, có nghĩa là sẽ có 6 bit dành cho địa chỉ subnet, tiếp đến ta lấy 2^16 - 2 sẽ bằng 65534 mạng con. (trừ 2 đi bởi vì mỗi mạng con đều có 1 địa chỉ broadcast - và địa chỉ mạng, vậy nên chỉ còn lại các địa chỉ còn lại là xài được).
Vậy theo hình ta thấy AWS cho ta một IPv4 VPC CIDR block là 172.31.0.0/16, có nghĩa phần IPv4 subnet CIDR block sau đây ta sẽ thiết lập bắt buộc phải nằm trong dãy 65534 mạng con của IPv4 VPC CIDR block 172.31.0.0/16, tức là trong dãy 172.31.0.1 - 172.31.255.254
![alt text](/images/cach-tao-ec2-instance/image-9.png)
![alt text](/images/cach-tao-ec2-instance/image-8.png)
Sau đó, bạn hãy xuống dưới này:
![alt text](/images/cach-tao-ec2-instance/image-10.png)
Bắt đầu từ đây bạn sẽ tự chia subnet cho EC2, như tôi giải thích ở trên thì dãy IP ta có thể được chọn sẽ nằm trong dãy 172.31.0.1 - 172.31.255.254, dựa vào đó, bạn có thể chia subnet mask sao cho phù hợp, ở đây ví dụ tôi chia là 172.31.255.192/28, vậy tức là dãy IP sẽ chạy từ 172.31.255.192 - 172.31.255.207 (hợp lệ với IPv4 VPC CIDR block AWS cho ta). Và vì số sau dấu / là 28, nên ta lấy công thức 32 - 28 = 4, sau đó lấy 2^4 lên sẽ ra 16 IP. AWS họ cũng tính dùm và để số nhỏ nhỏ kế bên như hình dưới:
![alt text](/images/cach-tao-ec2-instance/image-11.png)
Vì vậy, bạn hãy tự quyết định số lượng địa chỉ IP sẽ được dùng cho con EC2 của bạn trước khi tạo subnet mask, điều này liên quan đến khả năng mở rộng của dự án sau này.
Nếu nãy giờ tôi giải thích quá ngu và bạn không hiểu gì cả, hãy xem video [này](https://www.youtube.com/watch?v=AKQ7FdEuWz4)
Các option còn lại các bạn có thể để mặc định, sau đó chọn Create Subnet

Quay trở lại với trang tạo EC2 Instance, nhấn vào nút này và bạn sẽ thấy con subnet bạn mới vừa tạo:
![alt text](/images/cach-tao-ec2-instance/image-12.png)


![alt text](/images/cach-tao-ec2-instance/image-13.png)
Auto-assign public IP: Các bạn hãy chọn Enable, để AWS sẽ tự tạo Public IP Adress cho bạn (Nếu bạn không hiểu IP Adress này ở đây khác gì với mấy cái IP Address bạn chia subnet phía trên, thì nôm na là địa chỉ IP có 2 loại chính là địa chỉ public và địa chỉ riêng, địa chỉ mà bạn chọn Enable ở đây là địa chỉ public - địa chỉ mà nó tồn tại trên thế giới bên ngoài, và thế giới bên ngoài sẽ giao tiếp với con EC2 của bạn thông qua địa chỉ này, còn địa chỉ IP mà bạn chia subnet là địa chỉ riêng, tức địa chỉ chỉ dùng trong LAN của bạn mà thôi)

### Configure storage 
![alt text](/images/cach-tao-ec2-instance/1image-9.png)
Đây là tùy chỉnh kích thước storage của con EC2, với Free Tier ta có thể tạo tối đa lên 30GB (loại EBS General Purpose (SSD) )

Cơ bản là đã xong, các tùy chỉnh còn lại các bạn có thể để mặc định
![alt text](/images/cach-tao-ec2-instance/1image-10.png)
Ta chọn Lauch Instance và đợi một chút để AWS tạo một EC2 Instance


## 3. Kết nối qua SSH 
![alt text](/images/cach-tao-ec2-instance/image-14.png)
Sau khi tạo xong thì bạn sẽ thấy danh sách Instance sẽ có con EC2 Instance bạn vừa tạo như trên, click vào nó.

![alt text](/images/cach-tao-ec2-instance/image-15.png)
Các bạn nhấn nút "Connect"

![alt text](/images/cach-tao-ec2-instance/image-16.png)
Chọn kiểu kết nối là "SSH Client" (khuyến khích)

Bây giờ, các bạn hãy lục lại thư mục chứa cái key mà lúc đầu tôi nhờ các bạn nhớ chỗ lưu:
![alt text](/images/cach-tao-ec2-instance/image-17.png)
Các bạn mở terminal trong thư mục chứa key đó, và gõ lệnh sau:
```
chmod 400 "ten-key.pem"
```
![alt text](/images/cach-tao-ec2-instance/image-18.png)

Bây giờ, các bạn quay lại trang của AWS ban nãy, copy dòng "example" này và paste vào terminal:
![alt text](/images/cach-tao-ec2-instance/image-19.png)

![alt text](/images/cach-tao-ec2-instance/image-20.png)
Nó có hỏi thì gõ yes

![alt text](/images/cach-tao-ec2-instance/image-21.png)
Hiện vậy là đã thành công

Các bạn gõ lệnh sau để vào root:
```
sudo su -
```

![alt text](/images/cach-tao-ec2-instance/image-22.png)
Vậy là ổn rồi, bây giờ các bạn có thể dùng bình thường.

