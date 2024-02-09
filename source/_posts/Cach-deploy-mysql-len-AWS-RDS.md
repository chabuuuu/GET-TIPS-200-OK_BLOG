---
title: "Cách deploy MySQL, PostgreSQL, SQL Server lên AWS RDS MIỄN PHÍ mà không mất tiền oan bằng tài khoản Free Tier"
date: 2024-02-09 19:33:15
tags:
- backend
- deploy
- aws
categories:
- cloud service
- aws
thumbnail: "/images/Cach-deploy-mysql-len-AWS-RDS/thumbnail.png"
license: all_rights_reserved
---

Trong bài viết này tôi sẽ hướng dẫn mọi người cách deploy MySQL (hoặc kể cả PostgreSQL, SQL Server) lên AWS RDS một cách an toàn (không bị charge phí tào lao). 

## 1. Chuẩn bị

- Tài khoản AWS Free Tier: Đại khái là AWS sẽ miễn phí MỘT SỐ dịch vụ của họ cho các tài khoản mới đăng ký trong vòng 1 NĂM. Để đăng ký tài khoản này các bạn cần có 1 thẻ Visa để liên kết với AWS (cái này lúc đăng ký họ sẽ không lấy của bạn 1 đồng nào đâu, do vài chính sách của họ thôi). Và vấn đề của chúng ta phát sinh từ đây, và cũng là lý do bài viết này tồn tại: 2 chữ "FREE TIER".
Vấn đề tôi muốn nói đó là dù là "FREE TIER" nhưng không hẳn tất cả đều miễn phí, bạn phải nắm thật rõ quy định charge phí của từng dịch vụ trong tài liệu [này](https://aws.amazon.com/free/?trk=f42fef03-b1e6-4841-b001-c44b4eccaf41&sc_channel=ps&ef_id=CjwKCAiAt5euBhB9EiwAdkXWO_DO0lp_HAMY8KPz_MNpq9wk5nIR_jhC_3bI5gmwskIozHrDahdxXhoCaIAQAvD_BwE:G:s&s_kwcid=AL!4422!3!637354294245!e!!g!!aws%20free%20tier!19044205571!139090166770&gclid=CjwKCAiAt5euBhB9EiwAdkXWO_DO0lp_HAMY8KPz_MNpq9wk5nIR_jhC_3bI5gmwskIozHrDahdxXhoCaIAQAvD_BwE&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all)
Mặt khác, trong bài viết này tôi sẽ hướng dẫn các bạn để không bị mắc phải các ngách bị tính phí

Chi tiết cách đăng ký tài khoản AWS các bạn xem hướng dẫn [này](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html)

## 2. Bắt đầu
Để deploy các Relational Database lên AWS, tôi sẽ sử dụng dịch vụ AWS RDS (Amazon Relational Database Service)
### Deploy MySQL

#### 1. Tạo RDS Instance
![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image123.png)
Trước hết, các bạn hãy đăng nhập vào AWS Management Console tại [đây](https://console.aws.amazon.com/console/home?nc2=h_ct&src=header-signin)

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-1.png)

Trên thanh tìm kiếm các bạn tìm từ khóa "RDS", và chọn service RDS như trên

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/Untitled-1.png)

Ở góc trên này các bạn nên chọn là Singapore, đái khái đây là nơi mà database của bạn sẽ được đặt tại đó

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/Untitled.png)

Sau đó các bạn hãy chọn "Database" ở góc bên trái này

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image.png)

Nhấn vào "Create database"

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-2.png)

Bắt đầu từ giờ là phần để tùy chỉnh các thông số quan trọng cho RDS của bạn, việc có bị charge phí phát sinh hay không là do phần này quyết định

Chúng ta sẽ setup lần lượt như sau, ở mục này tôi không nhắc đến thì các bạn cứ để mặc định nhé

##### 1. Đầu tiên là Engine Option, các bạn chọn loại các bạn muốn nhé, ở đây tôi sẽ chọn MySQL

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-4.png)

##### 2. Chọn phiên bản MySQL mong muốn, ở đây tôi sẽ chọn bản 8.0.36 là bản mới nhất

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-5.png)

##### 3. Phần "Template" này, chúng ta sẽ chọn "Free Tier"

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-6.png)

##### 4. Trong phần setting, ta đặt DB instance identifier, tức sẽ là tên của RDS Instance mà sẽ hiện trên AWS

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-7.png)

##### 5. Credentials Settings: đây là phần để tạo tài khoản master đăng nhập vào MySQL, username và password ở phần này các bạn hãy ghi nhớ để lát nữa ta có thể truy cập vào Database từ máy của chúng ta

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-8.png)

##### 6. Instance configuration: đây là phần CỰC KÌ quan trọng, đối với những người mới sử dụng AWS ta sẽ dễ dàng bị charge phí ngoài ý muốn nhất là do cài đặt ở phần này, cụ thể là sao?

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-9.png)

Mục này là mục để các bạn chọn CPU sẽ chạy Database của các bạn, mặc định, AWS theo Free Tier Template (đã thực hiện bước 3) sẽ chọn cho bạn là cpu db.t3.micro như hình, nhưng đây là loại cpu CÓ PHÁT SINH PHÍ khi bạn sử dụng, kể cả bạn đang có Free Tier, và chính AWS cũng khuyến khích bạn sử dụng loại này :V


![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-11.png)

Vậy thì ta phải chọn cái nào mới đúng, ở đây tôi khuyến khích bạn chọn db.t2.micro như sau:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-10.png)

Tại sao? 
Trong danh sách các service được free của tài khoản Free Tier mà tôi đã cung cấp ở đầu bài viết cũng có ghi rõ ràng "750 Hours of Amazon RDS Single-AZ db.t2.micro, db.t3.micro, and db.t4g.micro".

Lý do là vì, db.t3.micro là một loại CPU thuộc họ CPU T3, đây là một loại CPU có thêm chức năng BURST MODE, có nghĩa là nếu cpu bị tải cao đến một mức nào đó, thì AWS sẽ charge thêm phí của bạn. Bạn có thể đọc ảnh dưới đây. 

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-12.png)

Theo đó, AWS sẽ tính phí sử dụng CPU theo concept sau: họ sử dụng một đơn vị riêng gọi là "CPU Credit", CPU sẽ tiêu thụ các CPU Credit này tùy theo tải CPU, còn CPU Credit sẽ được cộng thêm sau mỗi 1h theo bảng dưới đây:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-13.png)

Và tất nhiên, nếu đi theo concept như vậy sẽ rất khó quản lý phí phát sinh đặc biệt là với người mới, và vì chúng ta đang dùng Free Tier nên tất nhiên cũng sẽ không muốn mất thêm một khoảng phí nào. Thế nhưng nếu đưa vào production thì chức năng này sẽ rất hay, vì nó sẽ giúp handle được lưu lượng truy cập cao của sản phẩm dưới dạng production.

Nghía qua db.t2.micro, đây là một loại CPU thuộc họ T2, concept của loại này cũng sẽ tiêu thụ CPU Credit, nhưng nó sẽ không sử dụng Burst Mode để "mua thêm" CPU Credit từ AWS nếu sử dụng hết, thay vào đó CPU sẽ nghẽn đi nếu dùng quá CPU Credit. Vì vậy, nếu sử dụng loại này, ta yên tâm là sẽ không có bất kì chi phí phát sinh nào khác ngoài ý muốn.

##### 7. Phần Storage này các bạn cứ để nguyên 20GB nhé, tuyệt đối không để hơn vì AWS Free Tier quy định RDS chỉ được dùng Free có 20GB thôi

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-14.png)

##### 8. Tiếp đến là mục Connectivity, các bạn chỉnh một số chỗ như sau:
![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-16.png)

Chỗ Public Access này các bạn cho nó "YES" để có thể truy cập được từ xa

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-17.png)

Chỗ VPC Group này các bạn chọn Create New VPC và đặt một cái tên cho nó, cái này sau khi chúng ta tạo xong RDS Instance thì sẽ tùy chỉnh sâu hơn

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-18.png)

##### 9. Xong rồi các bạn kéo xuống dưới cùng, chọn Create Database

Vậy là đã xong! Ta chờ tí để AWS tạo mới một RDS Instance

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image(1).png)

Sau khi tạo xong ta sẽ thấy Instance chúng ta vừa tạo ở danh sách như trên, hãy click vào instance vừa tạo, (ở đây tôi sẽ click vào dòng chữ tutorial-rds)

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-1(1).png)

Tại trang này các bạn có thể theo dõi các trạng thái, cấu hình của RDS Instance, giờ chúng ta sẽ thực hiện config lại VPC Security.

Kéo xuống dưới cùng bạn sẽ thấy phần Security group rules

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-2(1).png)

Chú ý vào cái có Type ghi là "CIDR/IP - Inbound", click vào đó (trong trường hợp của tôi là rds-tutorial-security (sg-08df3636a1f1ffbb1))

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-3(1).png)

Ta sẽ được chuyển đến trang sau, click vào cái security group duy nhất hiện trong danh sách (của tôi là sg-08df3636a1f1ffbb1)

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-4(1).png)

Ta click vào Edit Inbound Rules

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-5(1).png)

Tại mục Source này các bạn chọn là Anywhere IPV4, sau đó các bạn chọn save

Các cài đặt ở đây có nghĩa là ta đang cho phép mọi IP có quyền truy cập vào database của bạn, vì đây là bài hướng dẫn nên tôi sẽ làm vậy cho nhanh, nhưng trong thực tế bạn chỉ nên cho phép IP từ server backend của bạn thôi, vì mục đích bảo mật.
Vậy là các bước tạo một RDS Instance đã xong, tiếp đến ta sẽ kết nối với MySQL trên con RDS này.

#### 2. Kết nối Database từ MySQL Workbench

Các bạn hãy quay trở lại trang sau:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-7(1).png)

Chú ý ở mục "Endpoint", đây sẽ chính là cái ta sẽ điền vào phần "hostname" trong MySQL Workbench:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-8(1).png)

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-10(1).png)
Username, Password: chính là username, password mà ta đã tạo ở bước 5 bên trên

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-11(1).png)

Tiếp tục bạn điền tên của connection sẽ hiển thị trên MySQL theo ý bạn

Nhấn OK

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-13(1).png)

Vậy là đã kết nối thành công!

### Deploy PostgreSQL

Các bước y như tạo MySQL, chỉ khác ở các bước sau:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-14(1).png)

Ở đây bạn chọn PostgreSQL nhé

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-15(1).png)

Phần Engine Version này các bạn chọn từ 12.17-R2 đổ xuống nhé, vì các bản Postgresql mới hơn đều không còn chạy được trên cpu db.t2.micro nữa, mà chỉ hỗ trợ db.t3.micro (có chi phí phát sinh)

### Deploy SQL Server

Các bước y như tạo MySQL, chỉ khác ở các bước sau:

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-16(1).png)

Ở đây bạn chọn Microsoft SQL Server nhé

Cũng giống như PostgreSQL, các phiên bản SQL Server mới đều không còn hỗ trợ db.t2.micro, do đó bạn hãy chọn Engine Version từ 2017 trở xuống

![alt text](/images/Cach-deploy-mysql-len-AWS-RDS/image-17(1).png)


Vậy là bài post của tôi kết thúc ở đây, chúc bạn không bị AWS charge hết tiền nhé, thân ái và quyết thắng.