<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>公众号Pro</title>

<style>
body{
margin:0;
background:#111;
font-family:"Microsoft YaHei",sans-serif;
color:#fff;
}
.container{
display:flex;
height:100vh;
}
.left{
width:40%;
padding:30px;
background:#181818;
overflow:auto;
}
.right{
width:60%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background:#000;
}
textarea,input{
width:100%;
margin-bottom:10px;
padding:10px;
background:#222;
border:1px solid #444;
border-radius:6px;
color:#fff;
}
button{
padding:8px 14px;
margin:5px 5px 5px 0;
background:#4a90e2;
border:none;
border-radius:6px;
color:#fff;
cursor:pointer;
}
.template-btn{ background:#333; }
.active-template{ background:#5cb85c !important; }
.counter{
font-size:12px;
margin-bottom:10px;
color:#aaa;
}
canvas{display:none;}
.preview-img{
width:360px;
border-radius:16px;
margin-bottom:20px;
}
.cover-img{
width:360px;
border-radius:10px;
}
</style>
</head>
<body>

<div class="container">

<div class="left">

<h3>风格模板</h3>
<button class="template-btn active-template" onclick="setTemplate(1,this)">奶油米白</button>
<button class="template-btn" onclick="setTemplate(2,this)">雾感浅蓝</button>
<button class="template-btn" onclick="setTemplate(3,this)">象牙纸感</button>
<button class="template-btn" onclick="setTemplate(4,this)">青灰书页</button>
<button class="template-btn" onclick="setTemplate(5,this)">鼠尾草雾绿</button>
<button class="template-btn" onclick="setTemplate(6,this)">灰紫薄雾</button>
<button class="template-btn" onclick="setTemplate(7,this)">深灰蓝调</button>
<button class="template-btn" onclick="setTemplate(8,this)">暖咖纸张</button>

<hr>

<h3>标题</h3>
<textarea id="titleInput" rows="3">为什么越努力，
反而越焦虑？</textarea>
<div id="titleCount" class="counter"></div>

<h3>品牌</h3>
<input id="brandInput" value="公众号：是小奈啊">

<h3>二维码</h3>
<input id="qrInput" value="https://pic.088878.xyz/file/1758866609097_image_1758866589043.jpg">

<br>
<button onclick="downloadPoster()">下载竖版高清</button>
<button onclick="downloadCover()">下载封面</button>

</div>

<div class="right">
<img id="preview" class="preview-img">
<img id="coverPreview" class="cover-img">
</div>

</div>

<canvas id="canvas" width="1080" height="1440"></canvas>
<canvas id="coverCanvas" width="900" height="383"></canvas>

<script>

let currentTemplate=1;

function setTemplate(id,btn){
currentTemplate=id;
document.querySelectorAll(".template-btn")
.forEach(b=>b.classList.remove("active-template"));
btn.classList.add("active-template");
generatePoster();
}

const titleInput=document.getElementById("titleInput");
const brandInput=document.getElementById("brandInput");
const qrInput=document.getElementById("qrInput");

titleInput.oninput=generatePoster;
brandInput.oninput=generatePoster;
qrInput.oninput=generatePoster;

function generatePoster(){
updateCounter();
generateVertical();
generateCover();
}

/* ✅ 八种温和高级风格 */

function getTheme(){
switch(currentTemplate){
case 1: return {bg1:"#F7F4EE", bg2:"#ECE6DC"};
case 2: return {bg1:"#EAF1F6", bg2:"#DCE6EE"};
case 3: return {bg1:"#FBFAF7", bg2:"#F1EFE9"};
case 4: return {bg1:"#E6EBED", bg2:"#D7DEE2"};
case 5: return {bg1:"#E8F0EA", bg2:"#D7E3DC"};
case 6: return {bg1:"#F0ECF4", bg2:"#E1DAEA"};
case 7: return {bg1:"#38424A", bg2:"#2F373E"};
case 8: return {bg1:"#EFE7DD", bg2:"#E2D7CA"};
default: return {bg1:"#F7F4EE", bg2:"#ECE6DC"};
}
}

function getContrastColor(hex){
hex=hex.replace("#","");
let r=parseInt(hex.substr(0,2),16);
let g=parseInt(hex.substr(2,2),16);
let b=parseInt(hex.substr(4,2),16);
let brightness=(r*299+g*587+b*114)/1000;
return brightness>150?"#2C2C2C":"#ffffff";
}

function getSmartFontSize(text){
let len=text.replace(/\n/g,"").length;
if(len<=10) return 130;
if(len<=20) return 110;
return 90;
}

function addGrainOverlay(ctx,width,height){
ctx.save();
for(let i=0;i<2000;i++){
ctx.fillStyle="rgba(0,0,0,0.02)";
ctx.fillRect(Math.random()*width,Math.random()*height,1,1);
}
ctx.restore();
}

/* ✅ 竖版 */

function generateVertical(){

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
ctx.clearRect(0,0,1080,1440);

let theme=getTheme();
let g=ctx.createLinearGradient(0,0,1080,1440);
g.addColorStop(0,theme.bg1);
g.addColorStop(1,theme.bg2);
ctx.fillStyle=g;
ctx.fillRect(0,0,1080,1440);

addGrainOverlay(ctx,1080,1440);

let textColor=getContrastColor(theme.bg1);
ctx.fillStyle=textColor;
ctx.textAlign="center";

/* ✅ 标题视觉居中 */

let fontSize=getSmartFontSize(titleInput.value);
ctx.font="bold "+fontSize+"px Microsoft YaHei";

let titleLines=getWrappedLines(ctx,titleInput.value,900,3);

let lineHeight=fontSize+25;
let totalHeight=titleLines.length*lineHeight;
let startY=1440*0.38-totalHeight/2;

titleLines.forEach(line=>{
ctx.fillText(line,540,startY);
startY+=lineHeight;
});

/* ✅ 柔和玻璃页脚 */

let footerHeight=180;
let footerY=1440-footerHeight-90;

ctx.save();
ctx.beginPath();
ctx.roundRect(60,footerY,960,footerHeight,40);

let glass=ctx.createLinearGradient(0,footerY,0,footerY+footerHeight);
glass.addColorStop(0,"rgba(255,255,255,0.45)");
glass.addColorStop(1,"rgba(255,255,255,0.25)");

ctx.fillStyle=glass;
ctx.shadowColor="rgba(0,0,0,0.05)";
ctx.shadowBlur=30;
ctx.fill();
ctx.restore();

ctx.strokeStyle="rgba(255,255,255,0.4)";
ctx.stroke();

ctx.fillStyle="#2C2C2C";
ctx.textAlign="left";
ctx.font="bold 42px Microsoft YaHei";
ctx.fillText(brandInput.value,140,footerY+105);

const qr=new Image();
qr.crossOrigin="anonymous";
qr.src=qrInput.value;

qr.onload=function(){
ctx.drawImage(qr,850,footerY+20,140,140);
document.getElementById("preview").src=canvas.toDataURL();
};

}

/* ✅ 封面 */

function generateCover(){
const canvas=document.getElementById("coverCanvas");
const ctx=canvas.getContext("2d");
ctx.clearRect(0,0,900,383);

let theme=getTheme();
let g=ctx.createLinearGradient(0,0,900,383);
g.addColorStop(0,theme.bg1);
g.addColorStop(1,theme.bg2);
ctx.fillStyle=g;
ctx.fillRect(0,0,900,383);

let textColor=getContrastColor(theme.bg1);
ctx.fillStyle=textColor;
ctx.textAlign="center";
ctx.font="bold 60px Microsoft YaHei";

let lines=getWrappedLines(ctx,titleInput.value,760,2);

let lineHeight=70;
let totalHeight=lines.length*lineHeight;
let startY=383/2-totalHeight/2+20;

lines.forEach(line=>{
ctx.fillText(line,450,startY);
startY+=lineHeight;
});

document.getElementById("coverPreview").src=canvas.toDataURL();
}

function getWrappedLines(ctx,text,maxWidth,maxLines){
let lines=[];
let paragraphs=text.split("\n");
paragraphs.forEach(p=>{
let line="";
for(let i=0;i<p.length;i++){
let test=line+p[i];
if(ctx.measureText(test).width>maxWidth){
lines.push(line);
line=p[i];
}else{
line=test;
}
}
if(line) lines.push(line);
});
if(lines.length>maxLines){
lines=lines.slice(0,maxLines);
lines[maxLines-1]=lines[maxLines-1].slice(0,-1)+"...";
}
return lines;
}

function updateCounter(){
document.getElementById("titleCount").innerText="标题字数："+titleInput.value.length;
}

function downloadPoster(){
let link=document.createElement("a");
link.download="竖版海报.png";
link.href=document.getElementById("canvas").toDataURL();
link.click();
}

function downloadCover(){
let link=document.createElement("a");
link.download="公众号封面.png";
link.href=document.getElementById("coverCanvas").toDataURL();
link.click();
}

generatePoster();

</script>
</body>
</html>
