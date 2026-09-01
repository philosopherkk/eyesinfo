window.DRPOON_PHOTOS=window.DRPOON_PHOTOS||{};
if(window.DRPOON_CARD_PARTS&&window.DRPOON_CARD_PARTS.length){
  window.DRPOON_PHOTOS.card="data:image/jpeg;base64,"+window.DRPOON_CARD_PARTS.join("");
}
(function(){
  var P=window.DRPOON_PHOTOS||{};
  var img=document.getElementById("cardImg");
  var valid=P.card&&P.card.indexOf("PLACEHOLDER")===-1;
  if(img){
    img.removeAttribute("width");
    img.removeAttribute("height");
    if(valid){img.src=P.card;img.style.maxWidth="640px";img.style.margin="0 auto";}
    else{img.removeAttribute("src");img.style.display="none";}
  }
  if(!valid && !document.getElementById("nameCards")){
    var wrap=document.createElement("div");
    wrap.id="nameCards";
    wrap.innerHTML='<style>.ncard{background:#fff;border:1px solid #d7dee4;border-radius:10px;padding:1.05rem 1.15rem;margin:1rem 0;position:relative}.ncard h3{margin:.05rem 3.2rem .3rem 0;color:#003153}.ncard .teal{color:#1b8d88;font-weight:700}.nmark{position:absolute;top:.75rem;right:.75rem;width:44px;height:44px;border-radius:11px;background:#3aa39a;color:#e9fffc;display:flex;align-items:center;justify-content:center;transform:rotate(14deg);font-size:.6rem;box-shadow:0 4px 10px rgba(16,80,76,.18)}</style><article class="ncard"><div class="nmark">OSCC</div><h3>潘家健醫生　眼科專科醫生</h3><p>香港中文大學內外全科醫學士　香港眼科醫學院院士<br>英國愛丁堡皇家外科醫學院院士　香港醫學專科學院院士（眼科）</p><p class="teal">預約電話：23634268　　WhatsApp：66102363</p><p>荃灣青山公路189號百萬行一樓（地鐵B出口天橋直行）<br>九龍彌敦道688號旺角中心第一期17樓1708室</p><p>診症時間：星期一至六（敬請預約）</p><p>電郵：drkkpoon@gmail.com　　傳真：23634618</p></article><article class="ncard"><div class="nmark">OSCC</div><h3>DR. POON KA KIN</h3><p>Specialist in Ophthalmology<br>MB ChB(CUHK) MRCSEd FCOphth HK FHKAM(Ophthalmology)</p><p class="teal">BOOKING: 23634268　　WhatsApp: 66102363</p><p>NEW TERRITORIES　1/F, Park Tsuen Commercial Building, 189 Castle Peak Road, Tsuen Wan<br>KOWLOON　Suite 1708, 17/F, Phase 1 Argyle Centre, 688 Nathan Road, Mong Kok</p><p>Consultation by Appointment: Monday to Saturday</p><p>Email: drkkpoon@gmail.com　　Fax: 23634618</p></article>';
    if(img&&img.parentNode) img.parentNode.parentNode.insertBefore(wrap, img.parentNode.nextSibling);
  }

  var EDU="https://eyesinfo.vercel.app";
  var QR_SRC='data:image/png;base64,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';

  if(!document.getElementById("eduWeb")){
    var sec=document.createElement("section");
    sec.id="eduWeb";
    sec.innerHTML='<style>.edu-box{display:flex;flex-wrap:wrap;gap:1.15rem 1.5rem;align-items:center;background:#fff;border:1px solid #d7dee4;border-radius:12px;padding:1rem 1.15rem;margin-top:.55rem}.edu-qr{flex:0 0 auto;width:168px;height:168px;display:block;border-radius:8px;background:#eef3f1;image-rendering:pixelated}.edu-meta{min-width:220px;flex:1}.edu-meta h3{margin:.1rem 0 .35rem;color:#003153}.edu-url{display:inline-block;margin-top:.4rem;background:#0B6A24;color:#fff;text-decoration:none;padding:.5rem .95rem;border-radius:8px}.edu-url:hover{opacity:.92}.edu-note{margin:.2rem 0;font-size:.95rem}</style><h2>護眼學堂</h2><p class="edu-note">公眾眼科教育網站。掃描綠色二維碼或按連結開啟。<br>Public patient-education site. Scan the green QR code or open the link.</p><div class="edu-box"><a href="'+EDU+'" target="_blank" rel="noopener" title="護眼學堂"><img class="edu-qr" src="'+QR_SRC+'" width="168" height="168" alt="QR 護眼學堂 eyesinfo.vercel.app"></a><div class="edu-meta"><h3>護眼學堂　Eyesinfo</h3><p class="edu-note">常見眼疾、專題單張、求醫時機。<br>Common eye conditions and when to seek care.</p><p><a class="edu-url" href="'+EDU+'" target="_blank" rel="noopener">eyesinfo.vercel.app</a></p></div></div>';
    var main=document.querySelector("main")||document.body;
    var part=null;
    var heads=main.querySelectorAll("h2");
    for(var i=0;i<heads.length;i++){
      var t=heads[i].textContent||"";
      if(/執業資料|practice particulars|開業/i.test(t)){
        part=heads[i].closest("section")||heads[i].parentNode;
        break;
      }
    }
    if(part&&part.parentNode) part.parentNode.insertBefore(sec, part.nextSibling);
    else{
      var placed=false;
      for(var j=0;j<heads.length;j++){
        if(/公開教育|educational/i.test(heads[j].textContent||"")){
          var parent=heads[j].closest("section")||heads[j].parentNode;
          parent.parentNode.insertBefore(sec, parent);
          placed=true;
          break;
        }
      }
      if(!placed) main.insertBefore(sec, main.firstChild);
    }
  }

  var bar=document.querySelector("header .row > div:last-child")||document.querySelector("header .row");
  if(bar && !document.getElementById("eduNav")){
    var a=document.createElement("a");
    a.id="eduNav";
    a.href=EDU;
    a.target="_blank";
    a.rel="noopener";
    a.textContent="護眼學堂";
    a.style.cssText="display:inline-block;margin:2px;padding:.28rem .7rem;border:1px solid rgba(255,255,255,.45);border-radius:8px;color:#fff;text-decoration:none;font-size:.88rem";
    bar.appendChild(a);
  }
})();
