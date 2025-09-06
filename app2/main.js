// (setq js-indent-level 1)  # for Emacs

function makelink(indexobj,txt) {
 let href = window.location.href;
 let base = href.replace(/app2.*$/,'');
 let ipage = indexobj.ipage;
 let newsearch = `app0?${ipage}`;
 let newhref = base + newsearch;
 let html = `<a class="nppage" href="${newhref}"><span class="nppage">${txt}</span></a>`;
 return html;
}
function display_ipage_id(indexes) {
 //console.log('display_ipage_id: indexes=',indexes);
 [indexprev,indexcur,indexnext] = indexes;
 let prevlink = makelink(indexprev,'<');
 let nextlink = makelink(indexnext,'>');

 let vp = indexcur['vp']; 
 let ipage = indexcur['ipage']
 let html = `<p>${prevlink} <span class="nppage">Page ${ipage}</span> ${nextlink}</p>`;
 let elt = document.getElementById('ipageid');
 elt.innerHTML = html;
}

function get_pdfpage_from_index(indexobj) {
/* indexobj assumed an element of indexdata
 return name of file with the given page
*/
 let vp = indexobj['vp'];
 let pdf = `nirukta_${vp}.pdf`;
 return pdf;
}

function get_ipage_html(indexcur) {
 let html = null;
 if (indexcur == null) {return html;}
 let pdfcur = get_pdfpage_from_index(indexcur);
 //console.log('pdfcur=',pdfcur);
 let urlcur = `../pdfpages/${pdfcur}`;
 let android = ` <a href='${urlcur}' style='position:relative; left:100px;'>Click to load pdf</a>`;
 let imageElt = `<object id='servepdf' type='application/pdf' data='${urlcur}' 
              style='width: 98%; height:98%'> ${android} </object>`;
 //console.log('get_ipage_html. imageElt=',imageElt);
 return imageElt;
}

function display_ipage_html(indexes) {
 display_ipage_id(indexes);
 let html = get_ipage_html(indexes[1]);
 let elt=document.getElementById('ipage');
 elt.innerHTML = html;
}

function prev_vp_obj(icur) {
 let defaultobj = indexdata[0];
 if (icur <= 0) {
  return defaultobj;
 }
 if (icur >= indexdata.length) {
  return defaultobj;
 }
 let curobj = indexdata[icur];
 let vpold = curobj['vp'];
 let iprev = icur - 1;
 while (true) {
  if (iprev <= 0) {
   return defaultobj;
   break;
  }
  newobj = indexdata[iprev];
  let vpnew = newobj['vp'];
  if (vpnew != vpold) {
   return newobj;
  }
  iprev = iprev - 1;
 }
}

function next_vp_obj(icur) {
 let defaultobj = indexdata[0];
 if (icur < 0) {
  return defaultobj;
 }
 if (icur >= indexdata.length) {
  return defaultobj;
 }
 let curobj = indexdata[icur];
 let vpold = curobj['vp'];
 let inext = icur + 1;
 while (true) {
  if (inext >= indexdata.length) {
   return defaultobj;
   break;
  }
  newobj = indexdata[inext];
  let vpnew = newobj['vp'];
  if (vpnew != vpold) {
   return newobj;
  }
  inext = inext + 1;
 }
}

function get_indexobjs_from_verse(verse) {
 // uses indexdata from index.js
 // verse is a 1-tuple (ipage)
 //console.log('get_indexobjs_from_verse:',verse);
 let icur = -1;
 for (let i=0; i < indexdata.length; i++ ) {
  let obj = indexdata[i];
  if (verse[0] != obj.adhy) {continue;}
  if (verse[1] < obj.v1) {continue;}
  if (verse[1] > obj.v2) {continue;}
  icur = i;
  break;
 }
 let ans, prevobj, curobj, nextobj
 if (icur == -1) {
  // default
  prevobj = indexdata[0];
  curobj = indexdata[0];
  nextobj = indexdata[1];
 } else {
  prevobj = prev_vp_obj(icur);
  curobj = indexdata[icur];
  nextobj = next_vp_obj(icur);
 }
 ans = [prevobj,curobj,nextobj];
 return ans;
}

function get_verse_from_url() {
 /* return 1-tuple of int numbers derived from url search string.
    Returns [0] on error
*/
 let href = window.location.href;
 let url = new URL(href);
 // url = http://xyz.com?X ,
 // search = ?X
 let search = url.search;  // a string, possibly empty
 let defaultval = [0]; // default value
 let x = search.match(/^[?]([0-9]+),([0-9]+)$/);
 //console.log('search=',search);
 //console.log('x=',x);
 if (x == null) {
  return defaultval;
 }
 let nparm = 2;
 iverse = [];
 for(let i=0;i<nparm;i++) {
  //iverse.push(parseInt(x[i+1]));
  iverse.push(x[i+1]);
 }
 return iverse;
}

function display_ipage_url() {
 let url_verse = get_verse_from_url();
 //console.log('url_verse=',url_verse);
 let indexobjs = get_indexobjs_from_verse(url_verse);
 //console.log('indexobjs=',indexobjs);
 display_ipage_html(indexobjs);
}

document.getElementsByTagName("BODY")[0].onload = display_ipage_url;

