// Botão "Salvar": envia o resultado para a planilha (Apps Script). Comum a todos os exercícios.
(function(){
const css=document.createElement("style");
css.textContent=`#hsavebox{background:var(--card,#fff);border:1px solid var(--line,#ddd);border-radius:14px;padding:14px;margin:18px 0;text-align:center}
#hsavebox .hrow{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
#hsavebox input{min-height:42px;border-radius:10px;border:1.5px solid var(--line,#ddd);background:var(--card,#fff);color:var(--ink,#222);padding:0 10px;font-size:.95rem;width:130px}
#hsavebox button{min-height:42px;border-radius:10px;border:0;background:var(--accent,#1d5fa8);color:#fff;font-weight:700;padding:0 22px;cursor:pointer;font-size:1rem}
#hsavebox button:disabled{opacity:.5;cursor:default}#hsavebox .hmsg{display:block;font-size:.85rem;color:var(--muted,#666);margin-top:6px}
#hsavebox .voltar{display:block;margin-top:10px;font-size:.9rem;color:var(--accent,#1d5fa8)}`;
document.head.appendChild(css);
const $=s=>document.querySelector(s);
const txt=s=>{const e=$(s);return e?e.textContent.trim():""};const num=s=>parseFloat(txt(s).replace(",","."))||0;
let nome="Malu";try{nome=localStorage.getItem("hist_nome")||"Malu"}catch(e){}
const box=document.createElement("section");box.id="hsavebox";
box.innerHTML='<div class="hrow"><input id="hnome" aria-label="Nome"><button id="hsave">Salvar</button></div><span class="hmsg" id="hmsg"></span><a class="voltar" href="./">← Todos os exercícios</a>';
(document.querySelector("main")||document.body).appendChild(box);box.querySelector("#hnome").value=nome;
function resultado(){const items=[...document.querySelectorAll(".item")];const erradas=[],brancos=[];
 items.forEach(w=>{const fb=w.querySelector(".fb");if(!fb)return;const blk=w.closest(".block");
  const y=blk&&blk.querySelector(".bh span")?blk.querySelector(".bh span").textContent.replace("PAS 1 · Edital ","")+" · ":"";
  const lab=y+(w.querySelector(".ih b")?w.querySelector(".ih b").textContent:"");
  if(fb.classList.contains("no"))erradas.push(lab);else if(fb.classList.contains("bl"))brancos.push(lab);});
 const f=$(".filters .on");
 return {quando:new Date().toISOString(),nome:($("#hnome").value||"").trim().slice(0,40),pagina:document.title,filtro:f?f.textContent.trim():"",
  total:items.length,respondidos:num("#done"),acertos:num("#nok"),erros:num("#nno"),brancos:num("#nbl"),pontos:num("#pts"),
  erradas:erradas.slice(0,200),em_branco:brancos.slice(0,200)};}
const btn=$("#hsave");
btn.onclick=async()=>{const d=resultado();if(!d.respondidos){$("#hmsg").textContent="Responda pelo menos um item antes de salvar.";return}
 try{localStorage.setItem("hist_nome",d.nome)}catch(e){}
 const url=window.PLANILHA_URL;
 if(!url){$("#hmsg").textContent="Planilha ainda não configurada (config.js).";return}
 btn.disabled=true;$("#hmsg").textContent="Salvando…";
 try{await fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
   $("#hmsg").textContent="✅ Resultado salvo.";}
 catch(e){$("#hmsg").textContent="Não foi possível salvar. Verifique a internet e tente de novo."}
 btn.disabled=false;};
})();
