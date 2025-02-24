---
title: Vì sao 1.222 - 1.111 != 0.111 ?
tags:
  - javascript
  - java
  - c++
  - c#
categories:
  - fun
cover_image: >-
  /images/van-de-0-1-0-2-voi-ngon-ngu-lap-trinh/480982231_644509411593741_1384364252427062325_n.jpg
wordCount: 291
charCount: 3491
imgCount: 5
vidCount: 0
wsCount: 2
cbCount: 0
readTime: About 2 minutes
date: 2025-02-24 18:12:39
---

Vì sao 1.222 - 1.111 != 0.111 ?
Ngay bây giờ, bạn hãy thử mở IDE yêu thích của bạn ra, và code kiểm tra ngay đi, xem 1.222 - 1.111 được bao nhiêu.
Bất ngờ chưa, phép toán 1.222 - 1.111 mà đáng ra vozer cũng làm được thì đưa vào mỗi ngôn ngữ lập trình lại ra một đáp án SAI khác nhau, cụ thể với Javascript, Java, Python,... sẽ ra các đáp án khác kết quả đúng là 0.111
Vì sao lại như vậy?

Đây là Java, và nó không ra đúng kết quả như mong đợi:

![](https://scontent-cgk2-1.xx.fbcdn.net/v/t39.30808-6/479022594_122180905532292262_2292533194516805855_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFT8E31xOGfBj-41nUwQrXt87EQ_0yY6QzzsRD_TJjpDNReMtLXmgyBoMAbec32S3DixhdYcjPKs3k8vGDh9Vjy&_nc_ohc=TItDkuBKJ8QQ7kNvgGigsvR&_nc_oc=AdjFcLDS8kjs0PdKI9oLkYK6c0OnfL-wq6hkVwn1ssZjpdlloUTI2Z25v9vx3n2Qp0EHaTV6w3QTWBMSwKsb07Bm&_nc_zt=23&_nc_ht=scontent-cgk2-1.xx&_nc_gid=A1iq99coTeSd8Jhi0HJlmWo&oh=00_AYDIeqiGZ-WVwyeHrlktLrS71_SkGwLhdfAJsodhtqHE7A&oe=67C21FD0)

Cũng như Java, "thằng em" của nó là JavaScript cũng y hệt, mà số lại ra khác Java luôn

![](https://scontent-cgk1-1.xx.fbcdn.net/v/t39.30808-6/480071041_122180905484292262_7503860684223111877_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF1o8CKT6TjFIgq9ZNm1PkGAMZHmtmb9LIAxkea2Zv0ssGh_4EqIqdkW4S0PyMMYif8X-GUPnEO-9mA5dUvfYOF&_nc_ohc=GZa2AR7B3ngQ7kNvgFLlbM1&_nc_oc=AdjLYG4TNyznqEJ0tldvRy0Ywzkm9E7OK-Qt5aHWUgeG1eIGUTNgD7YBe5qX5NXlwpPNMWhGajZRmOERcHF_ixPL&_nc_zt=23&_nc_ht=scontent-cgk1-1.xx&_nc_gid=AEP4Xn-XOwIGCesc2F2rHkV&oh=00_AYDDPg0XUww1NphVb3Cm-dMwPfaOxsBMB8XHiI-OgMAVGg&oe=67C241D9)

Một đáp án khác từ Python...

![](https://scontent-cgk1-2.xx.fbcdn.net/v/t39.30808-6/480244850_122180905508292262_6047572368449734109_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH7B3lYHrSRVb1VlPjjc9emSjd0SxZU4dJKN3RLFlTh0klyiaBVq7eN9qfE7kcGa7xNndrKwMxO3qit16xbWc5J&_nc_ohc=bo7KCoEI2EAQ7kNvgGmaYbz&_nc_oc=Adh9R8d_FRpNSs1-RXKnynTcY7HwBgd-zb1FxBEGjy-fYxp71SnSMpU4uMZXuM6-xZ-TpT_4jKKmrNOftHhdspZy&_nc_zt=23&_nc_ht=scontent-cgk1-2.xx&_nc_gid=AI-MZ3ViVt2VgowNmyZv0DV&oh=00_AYCVkKayzOzSyk7wYNAQpjvICkkK6k_wEp-OAyHjDYFefA&oe=67C214AB)

C# gần đúng rồi nè

![](https://scontent-cgk1-2.xx.fbcdn.net/v/t39.30808-6/480230779_122180906000292262_8358778125855776571_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGizkI-mMkZhpjLLvmLWeMd79ThWK-sp5bv1OFYr6ynlqJpyYk8LeT7vjnIyupmn2bHbOCsAj75KgovAPS4Un6k&_nc_ohc=KX9u9jRsxQYQ7kNvgGlcx8w&_nc_oc=Adhd8bgHWpFld6JMJXtyDGSnfK5zejePkNgVBOuHZ916jKZY_7MQiVsM4x0esUnfnXsCbZQcPmwMrthh1BVcVl3L&_nc_zt=23&_nc_ht=scontent-cgk1-2.xx&_nc_gid=APRhEhwMmxKhLL1YF2udrIL&oh=00_AYCOk-LjEb71GtYkIV60EK7gcwhbqmG6WWP9t35opwyjkw&oe=67C21A5F)

Quá đỉnh, đó là C++, và nó là đứa duy nhất không sai trong cả đám, đúng là anh cả có khác

![](https://scontent-cgk2-1.xx.fbcdn.net/v/t39.30808-6/479725548_122180907152292262_1589297965903183514_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGq7QYsLD9MCCXHMIZOCka2_WGE_JJYHGH9YYT8klgcYW4qnopm7kvkZOMn61urSelxNnmasYk7js2f3qHeqcWb&_nc_ohc=13eLGZteFacQ7kNvgFLERi7&_nc_oc=AdhhbSoc2hE9kMJGPF9KRRenuYjhH8ODV83dSeOkuK5dLjdukPttK5FoRvPy3pxO5ivAxOiJjdEbGTaIr5B8gJm1&_nc_zt=23&_nc_ht=scontent-cgk2-1.xx&_nc_gid=A6Z0NNjjUtfzHstLafcPofG&oh=00_AYAx60Rkisjyga5woTTuh0eHXhImfJ_G2bqjM90TZ5wGCA&oe=67C22ACA)

Giải thích, đó là vì số dấu phẩy động floating point trước giờ luôn là vấn đề chung trong khoa học máy tính, chứ không riêng gì các ngôn ngữ kể trên. Lỗi này xảy ra do sai số của số dấu phẩy động (floating-point precision error) khi sử dụng chuẩn IEEE 754 (double-precision floating-point).
Để giải thích cụ thể lý do, có một trang rất hay nói về vấn đề này: https://floating-point-gui.de/basic
Nói sơ sơ, thì đó là vì bản chất ngôn ngữ lập trình đã làm tròn các số 1.222 và 1.111 ngay từ trước khi thực hiện phép tính rồi, và boom, số kết quả sau cùng sẽ có sai số. Vậy tại sao nó phải làm tròn các số 1.222 và 1.111? Vì số dấu phẩy động là số rất khó để thể hiện dưới số nhị phân, nên, quyết định làm tròn.
