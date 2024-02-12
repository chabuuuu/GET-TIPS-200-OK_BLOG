---
title: >-
  Cách kết nối SQL Server với VSCode để tận dụng AI nhắc lệnh SQL và vô vàn món
  ăn chơi khác
tags:
  - sqlserver
  - vscode
categories:
  - database
cover_image: /images/setup-mysql-vscode/thumbnail.png
readTime: About 4 minutes
license: all_rights_reserved
wordCount: 533
charCount: 2650
imgCount: 12
vidCount: 0
wsCount: 0
cbCount: 0
date: 2023-10-23 08:51:43
---

Bạn mệt mỏi vì phải viết đi viết lại các câu lệnh SQL tương tự nhau rất nhiều lần? 

Vậy thì xin chào, hôm nay tôi sẽ hướng dẫn bạn cách kết nối MySQL với VSCode để tận dụng Extension Tabnine giúp nhắc lệnh vô cùng hiệu quả như thế này:

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/tabnine_example.png)

## 1. Cài đặt Extension SQL Server (mssql)

- Đầu tiên, các bạn mở VS Code, vào phần Extension (Ctrl+Shilf+X), tìm "mssql" và cái Extension SQL Server (mssql):

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/search_extension.png)

- Sau khi cài xong, bạn nhấn tổ hợp Ctrl+Shilf+P và tìm MS SQL: Add connection

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/ctrl_shif_p.png)

- Nhấn enter, sau đó nhập tên server host sql server của bạn, ở đây tôi đã cài đặt SQL server trên local, nên tôi sẽ gõ "localhost" và Enter.

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/localhost.png)


- Tiếp đến nó sẽ hỏi bạn Database name bạn muốn connect, nếu bạn chưa từng tạo Database nào thì cứ bỏ trống và Enter, nếu có hãy nhập tên Database mà bạn muốn connect, ở đây tôi đã tạo trước Database tên QLBH nên tôi sẽ nhập như sau:

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/enter_database_name.png)

- Tiếp đến nó sẽ hỏi bạn kiểu xác thực, ở đây tôi chọn Integrated, nó sẽ tương tự với option Windows Authentication trong phần mềm Microsoft SQL Server Management Studio.

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/authentication-type.png)


- Cái này bạn muốn thì đặt, không thì bỏ qua cũng không sao:

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/display_name.png)

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/alert.png)

- Sau đó thông báo trên sẽ hiện lên, bạn hãy chọn Enable Trust Server Certificate

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/done_mssql.png)

Done! Vậy là xong, nhìn sang bên tay trái bạn sẽ thấy một giao diện giống Object Explorer như trong Microsoft SQL Server Management Studio. Bạn có thể chuột phải vào Database và Create Query để test thử (nhấn Ctrl + Shilf + E để Execute Query)

## 2. Tabnine Extension
### Tabnine là gì?

Tabnine thực chất là một công cụ được xây dựng dựa trên thuật toán học sâu. Hiện tại thì plugin Tabnine hỗ trợ khoảng hơn 30 ngôn ngữ lập trình, 21 IDES khác nhau. Bạn hãy xem [Ở đây](https://www.tabnine.com/install)

### Tabnine giúp gì cho bạn?
Tabnine là nền tảng dành cho tất cả các công cụ giúp bạn hoàn thành mã nguồn một cách nhanh nhất (bên cạnh Github Copilot, but thằng này mất phí). Trước bạn code mất 15 phút để xong một task. Với Tabnine bạn sẽ tiết kiệm khá nhiều thời gian nhanh hơn dự tính của bạn.
Vậy nên ta sẽ tận dụng nó để viết lệnh SQL nhanh hơn "bình thường"

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/tabnine_install.png)

Hãy tìm Extension Tabnine và Install về.

## 3. Các Extension khác

### Error Lens 

Giúp hiện lỗi đỏ chót thẳng lên code space giống như sau:

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/codelens.png)

### TabOut

Giúp Tab để thoát khoải quotes, brackets,...

![Mang lag qua khong load duoc anh nay, sorry](/images/setup-mysql-vscode/tabout.png)


Bài viết của tôi chỉ vậy thôi, xin chào và hẹn gặp lại.