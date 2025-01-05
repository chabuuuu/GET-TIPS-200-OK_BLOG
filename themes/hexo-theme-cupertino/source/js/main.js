(() => {
  const BASE_URL = "https://eduhub.io.vn/gettips200ok-api/api/v1";
  // const BASE_URL = "http://localhost:3000/api/v1";
  // const BASE_URL = "http://152.42.232.101:9302/api/v1";

  var navEl = document.getElementById("theme-nav");
  navEl.addEventListener("click", (e) => {
    if (window.innerWidth <= 600) {
      if (navEl.classList.contains("open")) {
        navEl.style.height = "";
      } else {
        navEl.style.height =
          48 +
          document.querySelector("#theme-nav .nav-items").clientHeight +
          "px";
      }
      navEl.classList.toggle("open");
    } else {
      if (navEl.classList.contains("open")) {
        navEl.style.height = "";
        navEl.classList.remove("open");
      }
    }
  });
  window.addEventListener("resize", (e) => {
    if (navEl.classList.contains("open")) {
      navEl.style.height =
        48 +
        document.querySelector("#theme-nav .nav-items").clientHeight +
        "px";
    }
    if (window.innerWidth > 600) {
      if (navEl.classList.contains("open")) {
        navEl.style.height = "";
        navEl.classList.remove("open");
      }
    }
  });

  // a simple solution for managing cookies
  const Cookies = new (class {
    get(key, fallback) {
      const temp = document.cookie
        .split("; ")
        .find((row) => row.startsWith(key + "="));
      if (temp) {
        return temp.split("=")[1];
      } else {
        return fallback;
      }
    }
    set(key, value) {
      document.cookie =
        key +
        "=" +
        value +
        "; path=" +
        document.body.getAttribute("data-config-root");
    }
  })();

  const ColorScheme = new (class {
    constructor() {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          this.updateCurrent(Cookies.get("color-scheme", "auto"));
        });
    }
    get() {
      const stored = Cookies.get("color-scheme", "auto");
      var current = "light";
      if (stored == "auto") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          current = "dark";
        }
      } else {
        current = stored;
      }
      let theme = "github-dark";
      if (current == "light") {
        theme = "xcode";
      }
      // Thêm đường link đến theme phù hợp
      const themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
      document.head.appendChild(themeLink);
      this.updateCurrent(stored);
      return stored;
    }
    set(value) {
      bodyEl.setAttribute("data-color-scheme", value);
      Cookies.set("color-scheme", value);
      let theme = "github-dark";
      if (value == "light") {
        theme = "xcode";
      }
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const themeCookie = prefersDarkMode ? "github-dark" : "xcode";

      if (value == themeCookie) {
      }
      const themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
      document.head.appendChild(themeLink);
      this.updateCurrent(value);

      return value;
    }
    updateCurrent(value) {
      var current = "light";
      if (value == "auto") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          current = "dark";
        }
      } else {
        current = value;
      }
      document.body.setAttribute("data-current-color-scheme", current);
    }
  })();

  if (document.getElementById("theme-color-scheme-toggle")) {
    var bodyEl = document.body;
    var themeColorSchemeToggleEl = document.getElementById(
      "theme-color-scheme-toggle"
    );
    var options = themeColorSchemeToggleEl.getElementsByTagName("input");

    if (ColorScheme.get()) {
      bodyEl.setAttribute("data-color-scheme", ColorScheme.get());
    }

    for (const option of options) {
      if (option.value == bodyEl.getAttribute("data-color-scheme")) {
        option.checked = true;
      }
      option.addEventListener("change", (ev) => {
        var value = ev.target.value;
        ColorScheme.set(value);
        for (const o of options) {
          if (o.value != value) {
            o.checked = false;
          }
        }
      });
    }
  }

  if (document.body.attributes["data-rainbow-banner"]) {
    var shown = false;
    switch (document.body.attributes["data-rainbow-banner-shown"].value) {
      case "always":
        shown = true;
        break;
      case "auto":
        shown =
          new Date().getMonth() + 1 ==
          parseInt(
            document.body.attributes["data-rainbow-banner-month"].value,
            10
          );
        break;
      default:
        break;
    }
    if (shown) {
      var banner = document.createElement("div");

      banner.style.setProperty(
        "--gradient",
        `linear-gradient(90deg, ${document.body.attributes["data-rainbow-banner-colors"].value})`
      );
      banner.classList.add("rainbow-banner");

      navEl.after(banner);
    }
  }

  if (document.body.attributes["data-toc"]) {
    const content = document.getElementsByClassName("content")[0];
    const maxDepth = document.body.attributes["data-toc-max-depth"].value;

    var headingSelector = "";
    for (var i = 1; i <= maxDepth; i++) {
      headingSelector += "h" + i + ",";
    }
    headingSelector = headingSelector.slice(0, -1);
    const headings = content.querySelectorAll(headingSelector);

    var source = [];
    headings.forEach((heading) => {
      source.push({
        html: heading.innerHTML,
        href: heading.getElementsByClassName("headerlink")[0].attributes["href"]
          .value,
      });
    });

    const toc = document.createElement("div");
    toc.classList.add("toc");
    for (const i in source) {
      const item = document.createElement("p");
      const link = document.createElement("a");
      link.href = source[i].href;
      link.innerHTML = source[i].html;
      link.removeChild(link.getElementsByClassName("headerlink")[0]);
      item.appendChild(link);
      toc.appendChild(item);
    }

    if (toc.children.length != 0) {
      document
        .getElementsByClassName("post")[0]
        .getElementsByClassName("divider")[0]
        .after(toc);
      const divider = document.createElement("div");
      divider.classList.add("divider");
      toc.after(divider);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const carousel = document.getElementById("recommend-posts-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    async function getSessionKey() {
      let sessionKey = localStorage.getItem("sessionKey");
      if (!sessionKey) {
        try {
          const response = await fetch(`${BASE_URL}/session/key`);
          if (response.ok) {
            const data = await response.json();
            sessionKey = data.data.sessionKey;
            localStorage.setItem("sessionKey", sessionKey);
            console.log("Session key:", sessionKey);
          } else {
            console.error("Failed to fetch session key");
          }
        } catch (error) {
          console.error("Error fetching session key:", error);
        }
      }
      return sessionKey;
    }

    try {
      const sessionKey = await getSessionKey();

      const response = await fetch(`${BASE_URL}/posts/recommend?topN=10`, {
        method: "GET", // Phương thức HTTP (GET, POST, PUT, DELETE, ...)
        headers: {
          "x-session-key": sessionKey,
        },
      });
      const responseInJson = await response.json();
      const recommendPosts = responseInJson.data;
      const basePath = window.location.origin;

      // Render các bài viết gợi ý
      recommendPosts.slice(0, 10).forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "recommend-post";
        postElement.innerHTML = `
        <a href="${basePath}${post.id}">
          <img src="${post.thumbnail}" alt="${post.title}" class="thumbnail">
          <h4 class="recommend-title">${post.title}</h4>
        </a>
      `;

        const linkElement = postElement.querySelector("a");
        if (linkElement) {
          linkElement.addEventListener("click", async (event) => {
            event.preventDefault(); // Ngăn điều hướng mặc định
            console.log(`Clicked post ID: ${post.id}`);
            await sendTrackingData(`${BASE_URL}/session/tracking`, {
              type: "click",
              post_id: post.id, // href của bài viết được click
            });
            window.location.href = linkElement.href; // Tiến hành điều hướng
          });
        }

        carousel.appendChild(postElement);
      });

      // Xử lý điều hướng
      prevBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: -200, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: 200, behavior: "smooth" });
      });
    } catch (error) {
      console.error("Failed to fetch recommend posts:", error);
      carousel.innerHTML = "<p>Failed to load recommendations.</p>";
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
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value); // Lưu giá trị sao
        stars.forEach((s) => s.classList.remove("active")); // Bỏ active cũ
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
        const response = await fetch("/api/recommend-post-rating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: selectedPostId,
            rating: selectedRating,
          }),
        });

        if (response.ok) {
          alert("Cảm ơn bạn đã đánh giá!");
          // Có thể reset trạng thái nếu cần
          selectedRating = 0;
          stars.forEach((s) => s.classList.remove("active"));
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

  //For you posts

  document.addEventListener("DOMContentLoaded", async () => {
    const forYouPostsContainer = document.getElementById("for-you-posts");

    async function getSessionKey() {
      let sessionKey = localStorage.getItem("sessionKey");
      if (!sessionKey) {
        try {
          const response = await fetch(`${BASE_URL}/session/key`);
          if (response.ok) {
            const data = await response.json();
            sessionKey = data.data.sessionKey;
            localStorage.setItem("sessionKey", sessionKey);
            console.log("Session key:", sessionKey);
          } else {
            console.error("Failed to fetch session key");
          }
        } catch (error) {
          console.error("Error fetching session key:", error);
        }
      }
      return sessionKey;
    }

    try {
      const sessionKey = await getSessionKey();
      const response = await fetch(`${BASE_URL}/posts/recommend?topN=10`, {
        method: "GET", // Phương thức HTTP (GET, POST, PUT, DELETE, ...)
        headers: {
          "x-session-key": sessionKey,
        },
      });
      const responseInJson = await response.json();
      const recommendPosts = responseInJson.data;
      const basePath = window.location.origin;

      recommendPosts.forEach((post) => {
        const article = document.createElement("article");
        article.className = "post-list-item";
        article.innerHTML = `
                    <a href="${basePath}${post.id}">
                        ${
                          post.thumbnail
                            ? `<div class="cover-img">
                            <img src="${post.thumbnail}" alt="${post.thumbnail_alt}">
                        </div>`
                            : ""
                        }
                        <div class="content">
                            ${
                              post.categories && post.categories.length
                                ? `<div class="categories">
                                ${post.categories
                                  .map(
                                    (category) =>
                                      `<span>${category.toUpperCase()}</span>`
                                  )
                                  .join("")}
                            </div>`
                                : ""
                            }
                            <div class="title">
                                ${post.title}
                            </div>
                            ${
                              post.excerpt
                                ? `<div class="excerpt">
                                ${post.excerpt}
                            </div>`
                                : ""
                            }
                            ${
                              post.date
                                ? `<div class="time">
                                <span>${
                                  [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                  ][new Date(post.date).getMonth()]
                                }</span>
                                <span>&nbsp;${new Date(
                                  post.date
                                ).getDate()},&nbsp;</span>
                                <span>${new Date(
                                  post.date
                                ).getFullYear()}</span>
                            </div>`
                                : ""
                            }
                        </div>
                    </a>
                `;

        // Add click event listener
        const linkElement = article.querySelector("a");
        if (linkElement) {
          linkElement.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default navigation
            console.log(`Clicked post ID: ${post.id}`);
            await sendTrackingData(`${BASE_URL}/session/tracking`, {
              type: "click",
              post_id: post.id, // href của bài viết được click
            });
            window.location.href = linkElement.href; // Navigate to the URL
          });
        }

        forYouPostsContainer.appendChild(article);
      });
    } catch (error) {
      console.error("Failed to fetch recommended posts:", error);
      forYouPostsContainer.innerHTML =
        "<p>Unable to load recommended posts at this time.</p>";
    }
  });

  // Xử lý click vào bài viết gợi ý

  document.querySelectorAll("post-list-item a").forEach((anchor) => {
    anchor.addEventListener("click", async function (event) {
      // Lấy href của thẻ a được click
      const href = anchor.getAttribute("href");
      console.log("Href của bài viết đã click:", href);

      await sendTrackingData(`${BASE_URL}/session/tracking`, {
        type: "click",
        post_id: href, // href của bài viết được click
      });
    });
  });

  async function getSessionKey() {
    let sessionKey = localStorage.getItem("sessionKey");
    if (!sessionKey) {
      try {
        const response = await fetch(`${BASE_URL}/session/key`);
        if (response.ok) {
          const data = await response.json();
          sessionKey = data.data.sessionKey;
          localStorage.setItem("sessionKey", sessionKey);
          console.log("Session key:", sessionKey);
        } else {
          console.error("Failed to fetch session key");
        }
      } catch (error) {
        console.error("Error fetching session key:", error);
      }
    }
    return sessionKey;
  }

  // Function to send tracking data
  async function sendTrackingData(endpoint, body) {
    const sessionKey = await getSessionKey();
    if (!sessionKey) return; // Abort if no session key

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-key": sessionKey,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error(`Failed to send tracking data to ${endpoint}`);
      }
    } catch (error) {
      console.error(`Error sending tracking data to ${endpoint}:`, error);
    }
  }

  //Trackig events
  document.addEventListener("DOMContentLoaded", function () {
    const posts = document.querySelectorAll(".post-list-item");

    console.log("posts", posts);

    // Function to get or fetch session key
    async function getSessionKey() {
      let sessionKey = localStorage.getItem("sessionKey");
      if (!sessionKey) {
        try {
          const response = await fetch(`${BASE_URL}/session/key`);
          if (response.ok) {
            const data = await response.json();
            sessionKey = data.data.sessionKey;
            localStorage.setItem("sessionKey", sessionKey);
            console.log("Session key:", sessionKey);
          } else {
            console.error("Failed to fetch session key");
          }
        } catch (error) {
          console.error("Error fetching session key:", error);
        }
      }
      return sessionKey;
    }

    // Function to send tracking data
    async function sendTrackingData(endpoint, body) {
      const sessionKey = await getSessionKey();
      if (!sessionKey) return; // Abort if no session key

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-session-key": sessionKey,
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          console.error(`Failed to send tracking data to ${endpoint}`);
        }
      } catch (error) {
        console.error(`Error sending tracking data to ${endpoint}:`, error);
      }
    }

    // Tracking Clicks with Navigation Handling
    posts.forEach((post) => {
      post.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default navigation behavior
        const anchor = post.querySelector("a");
        if (anchor) {
          const href = anchor.getAttribute("href"); // Get the href value of the <a> tag
          console.log("Clicked post URL:", href);

          try {
            // Send tracking data and wait for completion
            await sendTrackingData(`${BASE_URL}/session/tracking`, {
              type: "click",
              post_id: href, // Use href as the identifier for tracking
            });

            // After the tracking data is sent, navigate to the URL
            window.location.href = href;
          } catch (error) {
            console.error("Error during tracking or navigation:", error);
          }
        }
      });
    });

    // Xử lý click vào Next/Previous post
    const nextPostLink = document.querySelector("a.next");
    const prevPostLink = document.querySelector("a.prev");

    if (nextPostLink) {
      nextPostLink.addEventListener("click", async function (event) {
        const href = nextPostLink.getAttribute("href");

        await sendTrackingData(`${BASE_URL}/session/tracking`, {
          type: "click",
          post_id: href, // href của bài viết được click
        });
      });
    }

    if (prevPostLink) {
      prevPostLink.addEventListener("click", async function (event) {
        const href = prevPostLink.getAttribute("href");

        await sendTrackingData(`${BASE_URL}/session/tracking`, {
          type: "click",
          post_id: href, // href của bài viết được click
        });
      });
    }

    // const recommendPosts = document.querySelectorAll(
    //   ".recommend-posts-carousel a"
    // );
    // recommendPosts.forEach((link) => {
    //   link.addEventListener("click", function (event) {
    //     const href = event.target.getAttribute("href");

    //     sendTrackingData(`${BASE_URL}/session/tracking`, {
    //       type: "click",
    //       post_id: href, // href của bài viết được click
    //     });
    //   });
    // });
    // Tracking Views
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting) {
    //         const postId = entry.target.getAttribute("data-post-id");
    //         const viewStartTime = Date.now();

    //         // Save the start time for the visible post
    //         entry.target.dataset.viewStartTime = viewStartTime;

    //         // Track when user stops viewing
    //         entry.target.addEventListener("mouseleave", () => {
    //           const viewEndTime = Date.now();
    //           const duration = viewEndTime - viewStartTime;

    //           sendTrackingData(`${BASE_URL}/session/tracking`, {
    //             type: "view",
    //             post_id: postId,
    //             viewTime: duration, // milliseconds
    //           });
    //         });
    //       }
    //     });
    //   },
    //   { threshold: 0.5 } // Trigger when 50% of the element is visible
    // );

    // posts.forEach((post) => observer.observe(post));

    // Tracking Scroll
    // window.addEventListener("scroll", () => {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const viewportHeight = window.innerHeight;
    //   const sectionOffsetTop = forYouSection.offsetTop;
    //   const postId = entry.target.getAttribute("data-post-id");

    //   if (scrollTop + viewportHeight >= sectionOffsetTop) {
    //     sendTrackingData(`${BASE_URL}/session/tracking`, {
    //       type: "scroll",
    //       post_id: postId,
    //       scrollDepth: Math.round(
    //         ((scrollTop + viewportHeight - sectionOffsetTop) /
    //           forYouSection.clientHeight) *
    //           100
    //       ),
    //     });

    //     // Remove event listener after tracking once
    //     window.removeEventListener("scroll", this);
    //   }
    // });

    const startTime = Date.now();
    const postId = window.location.pathname;

    async function sendTrackingViewData() {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);

      await sendTrackingData(`${BASE_URL}/session/tracking`, {
        type: "view",
        post_id: postId, // Use href as the identifier for tracking
        viewTime: duration, // seconds
      });

      // fetch(`${BASE_URL}/session/tracking`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ postId, duration }),
      // }).catch(console.error);
    }

    async function increaseView(id) {
      fetch(`${BASE_URL}/posts/view/increase?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(console.error);
    }

    if (postId !== "/") {
      increaseView(postId);
      //window.addEventListener("beforeunload", sendTrackingViewData);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") sendTrackingViewData();
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    // Fetch the current page's path (this is usually available in `window.location.pathname`)
    const postId = window.location.pathname;

    if (postId !== "/") {
      // Fetch read time from API
      fetch(`${BASE_URL}/posts/view?id=${postId}`)
        .then((response) => response.json())
        .then((data) => {
          // Assuming the API returns a JSON object with a 'readTime' property
          const readTime = data.data.view;

          // Update the readtime element
          document.getElementById("views-count").textContent = readTime;
        })
        .catch((error) => {
          console.error("Error fetching read time:", error);
          document.getElementById("views-count").textContent = "Error";
        });
    }
  });
})();
