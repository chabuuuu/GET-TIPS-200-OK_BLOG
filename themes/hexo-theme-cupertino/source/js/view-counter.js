"use strict";
const server = 'https://gettips200ok.netlify.app/'
function TOTP(t, e = 6) {
  this.key = t;
  this.digits = e;
}
TOTP.prototype = {
  gen: async function (t = 30, e = 0) {
    const n = this._base32tohex(this.key);
    const o = BigInt("0x" + n);
    const a = this._bigIntToByteArray(o);
    const r = Math.floor((Date.now() / 1e3 - e) / t);
    const i = this._int32ToByteArray(r);
    if (typeof window !== "undefined") {
      const s = await window.crypto.subtle.importKey(
        "raw",
        a,
        { name: "HMAC", hash: { name: "SHA-1" } },
        false,
        ["sign"]
      );
      const u = await window.crypto.subtle.sign("HMAC", s, i);
      return this._truncate(new Uint8Array(u));
    } else {
      const u = require("crypto")
        .createHmac("sha1", a)
        .update(new Uint8Array(i))
        .digest();
      return this._truncate(u);
    }
  },
  _int32ToByteArray: function (t) {
    const e = new ArrayBuffer(8);
    const n = new DataView(e);
    n.setUint32(4, t, false);
    return e;
  },
  _bigIntToByteArray: function (t) {
    let e = new Uint8Array(16);
    let n = 0;
    while (t > 0) {
      e[n++] = Number(t % BigInt(256));
      t = t / BigInt(256);
    }
    return e.reverse();
  },
  _truncate: function (t) {
    const e = t[t.length - 1] & 15;
    const n =
      ((t[e + 0] & 127) << 24) |
      ((t[e + 1] & 255) << 16) |
      ((t[e + 2] & 255) << 8) |
      (t[e + 3] & 255);
    let o = (n % Math.pow(10, this.digits)).toString().padStart(6, "0");
    return o;
  },
  verify: async function (t, e = 30) {
    return t === (await this.gen(e));
  },
  _base32tohex: function (t) {
    for (
      var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", n = "", o = "", a = 0;
      a < t.length;
      a++
    ) {
      var r = e.indexOf(t.charAt(a).toUpperCase());
      n += r.toString(2).padStart(5, "0");
    }
    for (a = 0; a + 4 <= n.length; a += 4) {
      var i = n.substr(a, 4);
      o += parseInt(i, 2).toString(16);
    }
    return o;
  },
};
function SITESCANSENSE(t) {
  this.moduleId = t;
}
SITESCANSENSE.prototype = {
  payload: {
    id: encodeURI(`${server}/${home_post_counter_path}`),
    uid: (function () {
      var e = "sitescansense_visitorid";
      var t = "localStorage";
      var n = {
        localStorage: {
          set: function (t) {
            localStorage.setItem(e, t);
          },
          get: function () {
            return localStorage.getItem(e);
          },
        },
      }[t];
      return function () {
        var t = n.get();
        if (!t) {
          t = o();
          n.set(t);
        }
        return t;
      };
      function o() {
        function t() {
          return Math.floor((1 + Math.random()) * 65536)
            .toString(16)
            .substring(1);
        }
        return (
          t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
        );
      }
    })()(),
    title: home_post_counter_title,
    href: `${server}/${home_post_counter_path}`,
    origin: window.location.origin,
    host: window.location.host,
    hostname: window.location.hostname,
    pathname: `/${home_post_counter_path}`,
    search: window.location.search,
    port: window.location.port,
    protocol: window.location.protocol,
    platform: navigator.platform,
    language: navigator.language,
    product: navigator.product,
    appCodeName: navigator.appCodeName,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    vendor: navigator.vendor,
    platform: navigator.platform,
    product: navigator.product,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referer: document.referrer,
    userAgentData: JSON.stringify(navigator.userAgentData),
  },
  endpoint: (function () {
    if (
      window.location.hostname == "localhost" ||
      window.location.hostname == "127.0.0.1"
    ) {
      return "http://127.0.0.1:5001/sitescansense/asia-northeast3/s3module";
    } else {
      return "https://s3module-vev5d5srwq-du.a.run.app";
    }
  })(),
  getPayload: async function () {
    let t = "5DX78IeRDPhG8qQj4LFlhy";
    const e = new TOTP(t);
    const n = await e.gen();
    this.payload.otp = n;
    this.payload.moduleId = this.moduleId;
    console.log('payload::: ',this.payload);
    return JSON.stringify(this.payload);
  },
  fetch: async function (t) {
    if (this.gate) {
      return;
    }
    this.gate = true;
    if (t) {
      this.payload.latitude = t.latitude;
      this.payload.longitude = t.longitude;
    }
    fetch(this.endpoint + this.payload.search, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: await this.getPayload(),
    })
      .then((t) => t.json())
      .then((t) => this.setbpcounter(t))
      .catch((t) => console.log(t));
  },
  setbpcounter: function (e) {
    console.log('views::: ',e);
    let t = document.querySelectorAll(".s3_pv");
    let n = document.querySelectorAll(".s3_uv");
    let o = document.querySelectorAll(".s3_total_pv");
    let a = document.querySelectorAll(".s3_total_uv");
    if (t !== undefined) {
      t.forEach((t) => {
        t.setAttribute("value", e.page_pv);
        t.innerHTML = e.page_pv;
      });
    }
    if (n !== undefined) {
      n.forEach((t) => {
        t.setAttribute("value", e.page_uv);
        t.innerHTML = e.page_uv || "unsupported version";
      });
    }
    if (o !== undefined) {
      o.forEach((t) => {
        t.setAttribute("value", e.host_pv);
        t.innerHTML = e.host_pv;
      });
    }
    if (a !== undefined) {
      a.forEach((t) => {
        t.setAttribute("value", e.host_uv);
        t.innerHTML = e.host_uv || "unsupported version";
      });
    }
    if (e.message) {
      console.log("s3 module : " + e.message);
    }
  },
};
window.addEventListener("DOMContentLoaded", async function () {
  let t = document.querySelectorAll('script[src*="s3module"]');
  let e = t.length > 0 ? t[0].getAttribute("moduleId") : null;
  const n = new SITESCANSENSE(e);
  n.fetch();
});
