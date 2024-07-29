---
title: >-
  Giải ngố cùng anh Liêm: Vì sao lại phải dùng backend? Sao không connect thẳng
  từ frontend tới database đi?
tags:
  - backend
  - beginner-questions
categories:
  - backend
readTime: About 9 minutes
cover_image: /images/Tai-sao-lai-dung-backend/WHY.png
license: all_rights_reserved
wordCount: 1714
charCount: 6591
imgCount: 8
vidCount: 0
wsCount: 0
cbCount: 2
date: 2024-01-22 18:50:26
description: "Giải ngố cùng anh Liên #1 - GET TIPS 200 OK"
---
![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/WHY.png)

{% blockquote %}
  Chuyện là khoảng 6h50 hôm qua tôi sang Ả rập ăn chè thì gặp anh Liêm. Rót cho anh miếng chè thì anh tâm sự với tôi thế này, chuyện là ngoài nghề sân cỏ, anh còn học thêm lập trình front end ở nhà. Anh kể tôi rằng cái nghề sân cỏ này nó không đủ thứ thách mạo hiểm nên anh mới dấn thân vào con đường Ai Ti để thử sức. Vốn bản tính chăm chỉ cần cù, anh cày xong combo html css js react trong 6 tháng và hiện thành thạo mọi kĩ năng front end trên đời. Nhưng đối với anh như thế là chưa đủ, anh cặm cụi tìm hiểu thêm backend. Vốn là một tay ngang sang IT, nên sau một hồi tìm hiểu, anh mới đặt ra câu hỏi cho tôi thế này: 
  
  <em>"Tại sao lại phải dùng backend làm gì vậy? Sao không connect thẳng từ frontend tới database đi? Database có connectstring mà thì connect thẳng tới xong CRUD bằng front end luôn là được mà?" </em> - anh Liêm bộc bạch. Tôi nghe xong, nghĩ một lúc, tôi mới trả lời anh thế này:

   <strong>"Để em viết hẳn một bài trên Get Tips 200 Ok xong anh lên đọc nhé, vì có vẻ có nhiều bạn cũng thắc mắc như anh đấy"</strong>

{% endblockquote %}
 

Vâng, tin hay không thì tùy, và chào mừng bạn đến với series Anh Liêm và muôn vàn câu hỏi vì sao, hôm nay chúng ta sẽ đi giải đáp thắc mắc thường gặp của người mới tìm hiểu backend, người không làm backend và non IT đó là "Tại sao ta cần dùng backend trong phát triển web? Tại sao không connect trực tiếp đến database từ front end?"

Để giải đáp cho câu hỏi trên, tôi chỉ gói gọn trong 1 từ: Bảo mật, Code Simplicity và Performance (à 3 từ lận)

## 1. Vấn đề về bảo mật
![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/security.png)

 Bảo mật chính là vấn đề lớn nhất khiến ta không thể connect thẳng từ front end đến database. Thông thường, nếu muốn access đến database ta sẽ cần một connection string ví dụ như này:

 ``````postgresql
 User ID=root;Password=myPassword;Host=localhost;Port=5432;Database=myDataBase;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;
 ``````
 Vậy thì vô tình, nếu ta kết nối thẳng từ front end đến database, sẽ dễ làm lộ ra connection string này. Giả dụ bạn code 1 app android, và bạn đưa thẳng connection string này vào trong <strong>source code</strong> thì sẽ thế nào nếu hacker tìm ra được nó? 

 Việc dịch ngược file apk thành source code là một điều khả thi chứ không phải không, bạn có thể tìm hiểu tại đây về khái niệm gọi là APK Decompilation tại [đây](https://hackernoon.com/apk-decompilation-a-beginners-guide-for-reverse-engineers), tương tự với app Windows viết bằng c# tại [đây](https://www.jetbrains.com/decompiler/) 
 
  Bằng cách này hay cách khác, việc để lộ connection string là một vấn đề bảo mật hết sức nghiêm trọng, có trong tay connection string, hacker có thể có toàn quyền múa máy quay cuồng với database của bạn, và thế là coi như xong, RIP your db.

![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/sql-injection.svg)

  Mà cứ cho là bằng một cách nào đó bạn có thể giấu được connection string khỏi bị decompile ra, thì vẫn còn tiềm ẩn rất nhiều rủi ro, ví dụ như là SQL Injection, bạn có thể tìm hiểu tại [đây](https://portswigger.net/web-security/sql-injection#:~:text=SQL%20injection%20(SQLi)%20is%20a,not%20normally%20able%20to%20retrieve.) và tôi hứa sẽ có một bài riêng về topic thú vị này sau.


  Một điều quan trọng nữa, việc bạn connect thẳng từ front end đến database đồng nghĩa với việc bạn cho phép trình duyệt/app của client <strong>truy cập thẳng</strong> tới database của bạn. Và tất nhiên nếu làm vậy, bạn không thể biết được là ai đang dùng trình duyệt/app đó, cũng không biết được các trình duyệt đó đang sử dụng extension nào và các extension đó có thể can thiệp vào code của bạn ra sao.
 
 * Tóm lại, nếu bạn thật sự xem dữ liệu trong database của bạn là <strong>quan trọng</strong>, thì việc connect thẳng từ front end đến database là điều không nên chút nào.
## 2. Vấn đề về Code Simplicity
![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/compare.png)
 * Code Simplicity, nói nôm na là sự đơn giản hóa coding. Về vấn đề này ta phải quay về và đặt câu hỏi vì sao ta lại tách code thành 2 phần là front end và backend. Một trong những lý do chính đó là để đơn giản hóa, tránh làm phức tạp code. Thử nghĩ xem, sẽ thế nào nếu frontend ngoài viết logic giao diện, bạn còn nhét thêm một đống logic backend như các câu SQL, các validate, service, lập lịch, phân quyền,...

 * Việc tách backend và frontend khiến cho phát triển phần mềm dễ dàng hơn rất nhiều, client gửi request tới server, server trả về cho client, Đồng thời, việc chia role cho dev cũng rạch ròi hơn, frontend dev thì chỉ có nhiệm vụ code logic giao diện, còn khi mà bạn đụng tới việc xử lý các HTTP, WebSockets, hoặc UDP datagrams gọi tới, xử lý các logic tương tác với database, thì đó là công việc của một backend developer.

 * Đối với những trang web hay ứng dụng đơn giản, việc kết nối thẳng tới db mà không thông qua backend thì vẫn ổn, nhưng giả sử nếu trang web, ứng dụng của tôi trở nên nổi tiếng hơn và ngày càng có nhiều user sử dụng web, nên tôi quyết định chuyển cơ sở dữ liệu lên cloud, hay đơn giản là đổi sang một máy chủ khác để đáp ứng được cho lượng user ngày càng lớn. Vậy thì rõ ràng khi đó tôi phải viết lại toàn bộ trang web để có thể kết nối đến cơ sở dữ liệu mới, và việc này tốn khá nhiều thời gian.
 Vì vậy, đó là lý do ta cần thêm một tầng nữa để xử lý tất cả các request đến cơ sở dữ liệu v.v., để frontend của bạn không phải thay đổi mỗi khi cơ sở dữ liệu thay đổi, đó chính là backend.

## 3. Vấn đề về Performance
Đến đây có thể bạn sẽ đặt câu hỏi là "Ủa? Tại sao backend lại giúp tối ưu performance? Ví dụ nhé, bây giờ tôi kết nối thẳng từ client tới database, bỏ qua thằng trung gian là backend, vậy có phải sẽ rút ngắn được đường đi, và gửi/nhận dữ liệu sẽ nhanh hơn, không phải vậy sao?".

Thực tế, điều đó chỉ đúng khi ứng dụng bạn làm ra chỉ để dành cho duy nhất 1 người xài, hoặc là với số lượng người dùng cùng lúc cực ít. Nhưng, nếu lượng người dùng truy cập quá mức vào giờ cao điểm, thì kết quả là db sẽ tạch ngay.

![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/ddos.png)

 Ngoài ra, việc bỏ backend đi cũng sẽ tiềm ẩn rất lớn nguy cơ bị DoS và DDos Attack (DoS, DDos là loại tấn công của hacker nhằm làm sập mạng hoặc server. Để thực hiện một cuộc tấn công DoS hay DDoS, hacker sẽ gửi thông tin có thể khiến cho mạng, máy chủ gặp sự cố hoặc gửi một đống traffic tới đó một cách ồ ạt. Từ đó những người dùng hợp pháp như admin, nhân viên hay khách hàng đều không thể truy cập được tài nguyên và các dịch vụ của hệ thống.) Do đó, ta cần có backend để áp dụng các cơ chế giảm thiểu truy cập gọi là Rate Limit, ví dụ: 
- Mỗi địa chỉ IP chỉ có thể tạo được 3 account trong 1 ngày.
- Mỗi người dùng chúng ta chỉ cho phép gửi 200 request/s. Nếu vượt quá thì sẽ trả về response lỗi.
- Mỗi người dùng chỉ cho phép nhập sai thẻ credit 3 lần trong 1 ngày.
Hơn thế nữa, với những nguồn dữ liệu thường xuyên được nhiều user truy vấn lặp đi lặp lại, hay còn gọi là hot data thì việc liên tục gọi tới db để truy vấn là quá lãng phí.

![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/ronaldo_shopee.jpeg)

Tôi lấy ví dụ như hệ thống bán hàng online như Shopee, một hôm nọ vào 12h00 thì có sự kiện flash sale một sản phẩm A nào đó, thế là hàng trăm hàng nghìn user đổ xô vào xem thông tin sản phẩm A đó cùng lúc vào đúng 12h00, và rõ ràng ứng với mỗi request thông tin của sản phẩm A là sẽ ứng với một query vào database, mỗi query đều trả về một kết quả y hệt nhau. Thật sự quá lãng phí!

![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/cache.png)

Vậy nên, lúc này là lập trình viên backend, chúng ta sẽ xây dựng nên một cơ chế Cache cho hệ thống, tức là những dữ liệu thường xuyên được request lặp đi lặp lại như vậy sẽ được cho lưu một bản sao vào trong các loại bộ nhớ có tốc đó truy xuất cao, ví dụ như RAM. Nhờ đó, tốc độ truy vấn sẽ gia tăng vô cùng đáng kể bởi vì dữ liệu db thường sẽ được lưu trong ổ cứng (tốc độ truy xuất chậm hơn RAM rất nhiều)

![Mang lag qua khong load duoc anh nay, sorry](/images/Tai-sao-lai-dung-backend/redis-cache.png)

Đó được gọi là xây dựng cache cho hệ thống, có nhiều công nghệ khác nhau có thể được sử dụng để xây dựng cache như Redis, Memcached,.. Đặc biệt là Redis, chắc chắn tôi sẽ có bài viết chuyên sâu về cách build, cách ứng dụng của nó vào hệ thống như thế nào.
Ngoài cache, rate-limit thì nhờ vào backend, ta còn có thể giảm tải cho server bằng cách xây dựng các cơ chế validate ngay từ middleware của backend (tức là chưa đụng tới vào db), ví dụ request đến có body không đúng theo schema mà backend quy định => Bỏ qua request, request đến không chứa header Authorization => Bỏ qua request,...

Rõ ràng, có quá nhiều lý do để ta không nên hiện thức hóa ý tưởng của anh Liêm mà tôi đã trình bày phía trên. Vậy nên bài viết của tôi xin được kết thúc tại đây, vì giờ đã là 6h50, cũng tới giờ tôi cưỡi lạc đà về Việt Nam rồi. Tạm biệt và hẹn gặp lại các bạn trong các post sau!
