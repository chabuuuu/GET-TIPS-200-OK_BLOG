(() => {
    var navEl = document.getElementById('theme-nav');
    navEl.addEventListener('click', (e) => {
        if (window.innerWidth <= 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
            } else {
                navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
            }
            navEl.classList.toggle('open')
        } else {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })
    window.addEventListener('resize', (e) => {
        if (navEl.classList.contains('open')) {
            navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
        }
        if (window.innerWidth > 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })

    // a simple solution for managing cookies
    const Cookies = new class {
        get(key, fallback) {
            const temp = document.cookie.split('; ').find(row => row.startsWith(key + '='))
            if (temp) {
                return temp.split('=')[1];
            } else {
                return fallback
            }
        }
        set(key, value) {
            document.cookie = key + '=' + value + '; path=' + document.body.getAttribute('data-config-root')
        }
    }

    const ColorScheme = new class {
        constructor() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { this.updateCurrent(Cookies.get('color-scheme', 'auto')) })
        }
        get() {            
            const stored = Cookies.get('color-scheme', 'auto')
            var current = 'light'
            if (stored == 'auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    current = 'dark'
                }
            } else {
                current = stored
            }
            let theme = 'github-dark'
            if (current == 'light'){
                theme = 'xcode'
            }
            // Thêm đường link đến theme phù hợp
            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
            document.head.appendChild(themeLink);
            this.updateCurrent(stored)
            return stored
        }
        set(value) {
            bodyEl.setAttribute('data-color-scheme', value)
            Cookies.set('color-scheme', value)
            let theme = 'github-dark'
            if (value == 'light'){
                theme = 'xcode'
            }
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const themeCookie = prefersDarkMode ? 'github-dark' : 'xcode';

            if (value == themeCookie){

            }
            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
            document.head.appendChild(themeLink);
            this.updateCurrent(value)

            return value
        }
        updateCurrent(value) {
            var current = 'light'
            if (value == 'auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    current = 'dark'
                }
            } else {
                current = value
            }
            document.body.setAttribute('data-current-color-scheme', current)
        }
    }

    if (document.getElementById('theme-color-scheme-toggle')) {
        var bodyEl = document.body
        var themeColorSchemeToggleEl = document.getElementById('theme-color-scheme-toggle')
        var options = themeColorSchemeToggleEl.getElementsByTagName('input')

        if (ColorScheme.get()) {
            bodyEl.setAttribute('data-color-scheme', ColorScheme.get())
        }

        for (const option of options) {
            if (option.value == bodyEl.getAttribute('data-color-scheme')) {
                option.checked = true
            }
            option.addEventListener('change', (ev) => {
                var value = ev.target.value
                ColorScheme.set(value)
                for (const o of options) {
                    if (o.value != value) {
                        o.checked = false
                    }
                }
            })
        }
    }

    if (document.body.attributes['data-rainbow-banner']) {
        var shown = false
        switch (document.body.attributes['data-rainbow-banner-shown'].value) {
            case 'always':
                shown = true
                break;
            case 'auto':
                shown = new Date().getMonth() + 1 == parseInt(document.body.attributes['data-rainbow-banner-month'].value, 10)
                break;
            default:
                break;
        }
        if (shown) {
            var banner = document.createElement('div')

            banner.style.setProperty('--gradient', `linear-gradient(90deg, ${document.body.attributes['data-rainbow-banner-colors'].value})`)
            banner.classList.add('rainbow-banner')

            navEl.after(banner)
        }
    }

    if (document.body.attributes['data-toc']) {
        const content = document.getElementsByClassName('content')[0]
        const maxDepth = document.body.attributes['data-toc-max-depth'].value

        var headingSelector = ''
        for (var i = 1; i <= maxDepth; i++) {
            headingSelector += 'h' + i + ','
        }
        headingSelector = headingSelector.slice(0, -1)
        const headings = content.querySelectorAll(headingSelector)

        var source = []
        headings.forEach((heading) => {
            source.push({
                html: heading.innerHTML,
                href: heading.getElementsByClassName('headerlink')[0].attributes['href'].value
            })
        })

        const toc = document.createElement('div')
        toc.classList.add('toc')
        for (const i in source) {
            const item = document.createElement('p')
            const link = document.createElement('a')
            link.href = source[i].href
            link.innerHTML = source[i].html
            link.removeChild(link.getElementsByClassName('headerlink')[0])
            item.appendChild(link)
            toc.appendChild(item)
        }

        if (toc.children.length != 0) {
            document.getElementsByClassName('post')[0].getElementsByClassName('divider')[0].after(toc)
            const divider = document.createElement('div')
            divider.classList.add('divider')
            toc.after(divider)
        }
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const carousel = document.getElementById("recommend-posts-carousel");
        const prevBtn = document.getElementById("carousel-prev");
        const nextBtn = document.getElementById("carousel-next");
    
        try {
            // const response = await fetch('http://localhost:8080/api/recommend-posts');
            // const recommendPosts = await response.json();

            //Data mẫu tạm thời
            const recommendPosts = [
                {
                  title: "Post 1",
                  thumbnail: "https://gettips200ok.netlify.app/images/wal-g-backup-database/thumbnail.png",
                  url: "/post/1"
                },
                {
                  title: "Post 2",
                  thumbnail: "https://gettips200ok.netlify.app/images/so-sanh-orm-nodejs/image.png",
                  url: "/post/2"
                },
                {
                  title: "Post 2",
                  thumbnail: "https://gettips200ok.netlify.app/images/so-sanh-orm-nodejs/image.png",
                  url: "/post/2"
                },
                {
                  title: "Post 2",
                  thumbnail: "https://gettips200ok.netlify.app/images/so-sanh-orm-nodejs/image.png",
                  url: "/post/2"
                },
                {
                  title: "Post 2",
                  thumbnail: "https://gettips200ok.netlify.app/images/so-sanh-orm-nodejs/image.png",
                  url: "/post/2"
                },
                {
                  title: "Post 2",
                  thumbnail: "https://gettips200ok.netlify.app/images/so-sanh-orm-nodejs/image.png",
                  url: "/post/2"
                },
                // Thêm các post gợi ý khác...
              ];
    
            // Render các bài viết gợi ý
            recommendPosts.slice(0, 10).forEach(post => {
                const postElement = `
                    <div class="recommend-post">
                        <a href="${post.url}">
                            <img src="${post.thumbnail}" alt="${post.title}" class="thumbnail">
                            <h4 class="title">${post.title}</h4>
                        </a>
                    </div>
                `;
                carousel.innerHTML += postElement;
            });
    
            // Xử lý điều hướng
            prevBtn.addEventListener("click", () => {
                carousel.scrollBy({ left: -200, behavior: "smooth" });
            });
    
            nextBtn.addEventListener("click", () => {
                carousel.scrollBy({ left: 200, behavior: "smooth" });
            });
        } catch (error) {
            console.error('Failed to fetch recommend posts:', error);
            carousel.innerHTML = '<p>Failed to load recommendations.</p>';
        }
    });


    //Gọi api đánh giá recommend hữu ích không
    document.addEventListener("DOMContentLoaded", () => {
        const stars = document.querySelectorAll("#rating-stars span");
        const submitBtn = document.getElementById("submit-rating");
        const postTitle = document.getElementById("selected-post-title");
        let selectedPostId = null;
        let selectedRating = 0;
    
        // // Khi người dùng nhấn vào một bài viết
        // document.querySelectorAll(".post").forEach(post => {
        //     post.addEventListener("click", () => {
        //         selectedPostId = post.dataset.postId; // Lấy ID bài viết
        //         const title = post.querySelector("p").textContent;
        //         postTitle.textContent = `Bạn đang đánh giá bài viết: "${title}"`;
        //         selectedRating = 0; // Reset đánh giá
        //         stars.forEach(s => s.classList.remove("active")); // Reset trạng thái sao
        //     });
        // });
    
        // Xử lý chọn sao
        stars.forEach(star => {
            star.addEventListener("click", () => {
                selectedRating = parseInt(star.dataset.value); // Lưu giá trị sao
                stars.forEach(s => s.classList.remove("active")); // Bỏ active cũ
                for (let i = 0; i < selectedRating; i++) {
                    stars[i].classList.add("active"); // Kích hoạt sao được chọn
                }
            });
        });
    
        // Gửi đánh giá
        submitBtn.addEventListener("click", async () => {
            // if (selectedRating === 0 || !selectedPostId) {
            //     alert("Vui lòng chọn bài viết và số sao trước khi gửi!");
            //     return;
            // }
    
            try {
                const response = await fetch('/api/recommend-post-rating', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postId: selectedPostId,
                        rating: selectedRating
                    })
                });
    
                if (response.ok) {
                    alert("Cảm ơn bạn đã đánh giá!");
                    // Có thể reset trạng thái nếu cần
                    selectedRating = 0;
                    stars.forEach(s => s.classList.remove("active"));
                    postTitle.textContent = "Chọn một bài viết để đánh giá";
                } else {
                    alert("Gửi đánh giá thất bại. Vui lòng thử lại!");
                }
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
                alert("Không thể gửi đánh giá. Vui lòng thử lại!");
            }
        });
    });
    
    
})()