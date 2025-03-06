"use strict";var B=Object.create;var d=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty;var f=(e,o)=>{for(var n in o)d(e,n,{get:o[n],enumerable:!0})},R=(e,o,n,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let t of S(o))!O.call(e,t)&&t!==n&&d(e,t,{get:()=>o[t],enumerable:!(a=I(o,t))||a.enumerable});return e};var P=(e,o,n)=>(n=e!=null?B(T(e)):{},R(o||!e||!e.__esModule?d(n,"default",{value:e,enumerable:!0}):n,e));var E=require("discord.js");var g=P(require("dotenv"));g.default.config();var{TOKEN:w,BOT_ID:C}=process.env;if(!w||!C)throw new Error("Missing environment variables");var r={TOKEN:w,BOT_ID:C};var i=require("discord.js");var p={};f(p,{data:()=>N,execute:()=>q});var v=require("discord.js"),N=new v.SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!");async function q(e){let o=Date.now();await e.reply("Pong!");let n=Date.now()-o;await e.editReply(`Pong! ${n}ms`)}var l={};f(l,{data:()=>_,execute:()=>j});var s=require("discord.js");var y=`# Sistema de Den\xFAncias

> Utilize o sistema de den\xFAncias apenas para casos com provas v\xE1lidas. A abertura de tickets sem necessidade pode resultar em puni\xE7\xF5es.

## O que \xE9 necess\xE1rio?

> *Para realizar uma den\xFAncia, voc\xEA deve coletar:*
- ID do denunciado  
- Data estimada do ocorrido  
- O m\xE1ximo de provas poss\xEDveis (imagens ou v\xEDdeos; apenas transa\xE7\xF5es n\xE3o ser\xE3o suficientes para aplicar uma puni\xE7\xE3o)

## Como fazer uma den\xFAncia?

- Clique no bot\xE3o abaixo para gerar uma thread e acesse-a.  
- Dentro da thread, responda \xE0s perguntas do bot.  
- Ap\xF3s responder todas as perguntas, sua den\xFAncia ser\xE1 enviada para an\xE1lise.  
- Quando a equipe da staff responder, voc\xEA ser\xE1 notificado pelo canal.
 `;var _=new s.SlashCommandBuilder().setName("repport").setDescription("Send the report message");async function j(e){await e.deferReply({flags:"Ephemeral"});let o=e.channel;if(!o){await e.followUp({content:"N\xE3o consegui encontrar o canal!",flags:"Ephemeral"});return}let n=new s.ButtonBuilder().setCustomId("complaint_button").setLabel("Realizar den\xFAncia").setEmoji("1129509892785447096").setStyle(s.ButtonStyle.Secondary),a=new s.ActionRowBuilder().addComponents(n);await o.send({embeds:[new s.EmbedBuilder().setColor("Yellow").setAuthor({name:"Seus dados n\xE3o ser\xE3o exibidos na den\xFAncia"}).setDescription(y)],components:[a]}),await e.deleteReply()}var h={ping:p,repport:l};var z=Object.values(h).map(e=>e.data),A=new i.REST({version:"10"}).setToken(r.TOKEN);async function x({guildId:e}){try{await A.put(i.Routes.applicationGuildCommands(r.BOT_ID,e),{body:z})}catch(o){console.error(o)}}var D=require("fs"),u=require("path");function b(e){let o=(0,u.join)(__dirname,"../events"),n=(0,D.readdirSync)(o).filter(a=>a.endsWith(".ts")||a.endsWith(".js"));for(let a of n){let t=require((0,u.join)(o,a));if(!t.name||!t.execute){console.warn(`\u26A0\uFE0F O arquivo ${a} n\xE3o possui um nome ou fun\xE7\xE3o execute.`);continue}t.once?e.once(t.name,(...c)=>t.execute(...c)):e.on(t.name,(...c)=>t.execute(...c))}}var m=new E.Client({intents:["Guilds","GuildMessages","DirectMessages","MessageContent"]});m.once("ready",()=>{m.guilds.cache.forEach(async e=>{await x({guildId:e.id})})});b(m);m.login(r.TOKEN);
