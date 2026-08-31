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
  if(valid) return;
  if(document.getElementById("nameCards")) return;
  var wrap=document.createElement("div");
  wrap.id="nameCards";
  wrap.innerHTML='<style>.ncard{background:#fff;border:1px solid #d7dee4;border-radius:10px;padding:1.05rem 1.15rem;margin:1rem 0;position:relative}.ncard h3{margin:.05rem 3.2rem .3rem 0;color:#003153}.ncard .teal{color:#1b8d88;font-weight:700}.nmark{position:absolute;top:.75rem;right:.75rem;width:44px;height:44px;border-radius:11px;background:#3aa39a;color:#e9fffc;display:flex;align-items:center;justify-content:center;transform:rotate(14deg);font-size:.6rem;box-shadow:0 4px 10px rgba(16,80,76,.18)}</style><article class="ncard"><div class="nmark">OSCC</div><h3>潘家健醫生　眼科專科醫生</h3><p>香港中文大學內外全科醫學士　香港眼科醫學院院士<br>英國愛丁堡皇家外科醫學院院員　香港醫學專科學院院士（眼科）</p><p class="teal">預約電話：23634268　　WhatsApp：66102363</p><p>茄灣青山公路189號百萬行一樓（地鐵B出口天橋直行）<br>九龍彌敦道688號旺角中心第一期17樓1708室</p><p>診症時間：星期一至六（敬請預約）</p><p>電郵：drkkpoon@gmail.com　　傳真：23634618</p></article><article class="ncard"><div class="nmark">OSCC</div><h3>DR. POON KA KIN</h3><p>Specialist in Ophthalmology<br>MB ChB(CUHK) MRCSEd FCOphth HK FHKAM(Ophthalmology)</p><p class="teal">BOOKING: 23634268　　WhatsApp: 66102363</p><p>NEW TERRITORIES　1/F, Park Tsuen Commercial Building, 189 Castle Peak Road, Tsuen Wan<br>KOWLOON　Suite 1708, 17/F, Phase 1 Argyle Centre, 688 Nathan Road, Mong Kok</p><p>Consultation by Appointment: Monday to Saturday</p><p>Email: drkkpoon@gmail.com　　Fax: 23634618</p></article>';
  if(img&&img.parentNode) img.parentNode.parentNode.insertBefore(wrap, img.parentNode.nextSibling);
})();
