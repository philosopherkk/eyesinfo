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
  var QR_SRC='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAFeUlEQVR42u3dMY7bMBBA0VWgq2yTQybIJdPkDi4M994mRbDIWrDH4xmS7/X2yrLxQ4UitZ3Ol+sbsKRvTgEIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAQFd79A3ef36f8sT8+fX74c999NrMcx457uxjj/7tzM896+/UCAAQgEy2VEIAFrY5BQgAIACAAAD97Zlvnj0dFvGMaaHrF9f/mdNdR6/PnuaLTMV1nqKc/bdqBJDAf/7hEgAQAEAAAAEABAAQAKCnvfKPZ85vjjyvGzn2znPtmeetcgn2yL9VIwBwCQAIwHTcqwcLB8BWHeASABAAQACAv3an4DGrrsmPvDb6uTvfo2AEAAgAIACAAAACAAgAIABAE+4DSJA5z3/0/jPPxVfuB1DqqwdQGAH0Yd0hI/64BOCJkQb/BwAIACAAgAAAHZVOA448dZO5TXTkb8+8HXrlOZ91mtEIAGawCQCs6yoAgAAAAgAIACAAwH+k3gdQOW9bKfsR3ZVbd8+6JHfV36oRALgEAAQAXsw+CgLAwuykJACAAAACALzuEux0vvh/mAdkzhtH5tMr7zHw+G4jAEAAAAEABAAQAEAAAAEAypU+F6ByLj37Mdpdz1vnvQg6y7w3o+q4jADAJQAgAMBctgUCYCEDfsOPv/HwAbChBH7DLgGAR+ITXQ5cuXw0c4vqzM/VeVqo8/ddddzZKrdiNwKAhQkACAAgAIAAAAIACAAwq9bLgTPnjaPzwreOLfO9q7+TyHFXLkWOqlwOnPl7MAIAlwCAAAACAAgAIACAAADTKb0PYNZ189mfK3Ouvuv210fHVnmPQPb9De4DAAQAEABAAAABAAQAEADgDuHnAtzSef32yMfWdT585GcSZM7Fezw4dPzXzykQANblwbICAAIACAAgAMAqhl4OHJkCmXVaqPI767ztd+WxdZ6SNgIAlwCAAAACAAgAIACAAMDU1lwa1Ho5cGT+dOQtxzOXA1c+erzy99R5a24jAEAAAAEABAAQAEAAAAEAnii8H0DXufgjsx5b9nx35G9X6rwfgBEAr2dLXARgYTbFRwBAAAABAFa7fhMAGM5VAIC48H0AmXOclXvzV773yM8NyFQ5nx7Zg8HjwYGWBAAEABAAQAAAAQAml7oc+Ej29tlVf3vVrbcrt4HvzOPBAZcAgAAAAgAIACAAgAAAL7Rnvnn2fHjlEk3LhZ9/zkZd/n3T9vb2/qPvo8eNACBT8+3XBQD8HwAgAIAAAAIACAAwq33kg+/6yObsef7I/Q9RmXPxkddn7y0ROeeV9z8YAQACAAgAIACAAIAAAAIALGc7nS+hBYuRudnKxyZnzt1W/u3OfK7HXm8EAAgAIACAAAACAAgAcL/wNOCquj4evHLKqfLx4NnnPHPpeeWydiOAf2voFOASYF2GQggAIACAAAACAAgAMJXwtuCjLuE8cjS/mrk1t/nw1x935LxFz7nlwIAAAAIACAAgAIAAAAIAPFHq48Er5zePdN6SvPM20qN+350fBx95f/sBAAIACAAgAIAAAAIACADwiceDJ7x+1ecCVH+2WWV+Z0YA4BIAEABAAAABAAQAmNXuFIyn6xRk5LizZU4LZ28DbwQACAAgAIAAAAIACAAgAMAd3AfQUOacdOV8eOfHg2e/PuucGwEAAgAIACAAgAAAAgAIAPBJ6X0AI29RHTn2yjnpyu3QR96yPHMPhsp9EowAwCUAIACAAAACAAgAIAATuzoFLCr1PoBRHue8NTueyrn4WR8vXvm5Op9TIwBwCQAIACAAgAAAAgDMajudL6bBwQgAEIBpxzq+bFg3AC50wCUAIACAAIAAAAIACAAgAIAAAAIACAAgAIAAAIP7AKpfWeH5KpPtAAAAAElFTkSuQmCC';

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
