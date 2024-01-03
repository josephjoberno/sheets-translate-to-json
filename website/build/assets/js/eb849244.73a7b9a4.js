"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[310],{2836:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>a,default:()=>l,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var s=n(5893),i=n(1151);const r={id:"usage",title:"Usage",sidebar_position:3},a=void 0,d={id:"Getting Started/usage",title:"Usage",description:"Initialization",source:"@site/docs/Getting Started/usage.md",sourceDirName:"Getting Started",slug:"/Getting Started/usage",permalink:"/sheets-translate-to-json/docs/Getting Started/usage",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"usage",title:"Usage",sidebar_position:3},sidebar:"GettingStarted",previous:{title:"Sheets",permalink:"/sheets-translate-to-json/docs/Getting Started/sheets"}},h={},c=[{value:"Initialization",id:"initialization",level:2},{value:"Import esm &amp; commonJs",id:"import-esm--commonjs",level:3},{value:"Constructor",id:"constructor",level:3},{value:"Methods",id:"methods",level:2},{value:"init",id:"init",level:3},{value:"read (async)",id:"read-async",level:3},{value:"write (async)",id:"write-async",level:3},{value:"Examples of Using SheetManager",id:"examples-of-using-sheetmanager",level:2},{value:"Using the <code>init</code> Method",id:"using-the-init-method",level:3},{value:"Separately Using the <code>read</code> and <code>write</code> Methods",id:"separately-using-the-read-and-write-methods",level:3},{value:"Result of Executing the SheetManager Script",id:"result-of-executing-the-sheetmanager-script",level:3}];function o(e){const t={code:"code",h2:"h2",h3:"h3",hr:"hr",img:"img",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h2,{id:"initialization",children:"Initialization"}),"\n",(0,s.jsxs)(t.p,{children:["To start using ",(0,s.jsx)(t.code,{children:"sheets-translate-to-json"}),", you first need to create an instance of the ",(0,s.jsx)(t.code,{children:"SheetManager"})," class."]}),"\n",(0,s.jsx)(t.h3,{id:"import-esm--commonjs",children:"Import esm & commonJs"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"//CommonJs\nconst SheetManager = require('sheets-translate-to-json').SheetManager;\nor\n//ES6(ESM)\nimport { SheetManager } from 'sheets-translate-to-json';\n"})}),"\n",(0,s.jsx)(t.h3,{id:"constructor",children:"Constructor"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"const manager = new SheetManager(privateKey, clientEmail, sheetId);\n"})}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Parameter"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"privateKey"}),(0,s.jsx)(t.td,{children:"String"}),(0,s.jsx)(t.td,{children:"The private key of your service account."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"clientEmail"}),(0,s.jsx)(t.td,{children:"String"}),(0,s.jsx)(t.td,{children:"The email associated with your service account."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"sheetId"}),(0,s.jsx)(t.td,{children:"String"}),(0,s.jsx)(t.td,{children:"The ID of your Google Sheets sheet."})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"methods",children:"Methods"}),"\n",(0,s.jsx)(t.h3,{id:"init",children:"init"}),"\n",(0,s.jsx)(t.p,{children:"Initializes the connection to the spreadsheet and writes data to a specified path."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"manager.init(userPath);\n"})}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Parameter"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"userPath"}),(0,s.jsx)(t.td,{children:"String"}),(0,s.jsx)(t.td,{children:"The path of the folder where to write data."})]})})]}),"\n",(0,s.jsx)(t.h3,{id:"read-async",children:"read (async)"}),"\n",(0,s.jsx)(t.p,{children:"Reads data from the specified spreadsheet."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"manager.read(sheetPosition).then(data => {\n  // Use the data here\n});\n"})}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Parameter"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"sheetPosition"}),(0,s.jsx)(t.td,{children:"Number"}),(0,s.jsx)(t.td,{children:"The position of the sheet in the workbook (0-index)."})]})})]}),"\n",(0,s.jsx)(t.h3,{id:"write-async",children:"write (async)"}),"\n",(0,s.jsx)(t.p,{children:"Writes data to a JSON file in the specified path."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"manager.write(data, directoryPath);\n"})}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Parameter"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"data"}),(0,s.jsx)(t.td,{children:"Object"}),(0,s.jsx)(t.td,{children:"The data to write."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"directoryPath"}),(0,s.jsx)(t.td,{children:"String"}),(0,s.jsx)(t.td,{children:"The path of the folder where to write JSON files."})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"examples-of-using-sheetmanager",children:"Examples of Using SheetManager"}),"\n",(0,s.jsxs)(t.h3,{id:"using-the-init-method",children:["Using the ",(0,s.jsx)(t.code,{children:"init"})," Method"]}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"init"})," method of ",(0,s.jsx)(t.code,{children:"SheetManager"})," automates the process of reading data from the Google Sheets spreadsheet and writing this data into JSON files."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"const manager = new SheetManager(privateKey, clientEmail, sheetId);\n\n// Path where JSON files will be saved\nconst userPath = './translations';\n\n// Initialization and automatic processing\nmanager.init(userPath)\n  .then(() => console.log('Data successfully read and written.'))\n  .catch(err => console.error('Error during initialization:', err));\n"})}),"\n",(0,s.jsxs)(t.p,{children:["In this example, ",(0,s.jsx)(t.code,{children:"init"})," takes care of the entire process: it establishes the connection, reads the data from the specified spreadsheet, and writes this data to the ",(0,s.jsx)(t.code,{children:"./translations"})," directory."]}),"\n",(0,s.jsxs)(t.h3,{id:"separately-using-the-read-and-write-methods",children:["Separately Using the ",(0,s.jsx)(t.code,{children:"read"})," and ",(0,s.jsx)(t.code,{children:"write"})," Methods"]}),"\n",(0,s.jsxs)(t.p,{children:["If you prefer more control over the process, you can use the ",(0,s.jsx)(t.code,{children:"read"})," and ",(0,s.jsx)(t.code,{children:"write"})," methods separately. This allows you to manipulate the data between reading and writing if necessary."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:"const manager = new SheetManager(privateKey, clientEmail, sheetId);\n\n// Reading data from the first spreadsheet\nmanager.read()\n  .then(data => {\n    console.log('Data successfully read.');\n    // Data processing or manipulation here if needed\n\n    // Path where JSON files will be saved\n    const directoryPath = './translations';\n    // Writing data into JSON files\n    manager.write(data, directoryPath);\n    console.log('Data written into JSON files.');\n  })\n  .catch(err => console.error('Error during reading:', err));\n"})}),"\n",(0,s.jsxs)(t.p,{children:["In this scenario, ",(0,s.jsx)(t.code,{children:"read"})," is used to retrieve the data from the spreadsheet, and after any potential data processing, ",(0,s.jsx)(t.code,{children:"write"})," is used to write this data into local JSON files."]}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"result-of-executing-the-sheetmanager-script",children:"Result of Executing the SheetManager Script"}),"\n",(0,s.jsxs)(t.p,{children:["After running the ",(0,s.jsx)(t.code,{children:"SheetManager"})," script, the following folder is created with the generated JSON files:"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Folder with JSON files",src:n(6508).Z+"",width:"270",height:"127"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"exemple translate json ",src:n(8860).Z+"",width:"413",height:"406"})}),"\n",(0,s.jsx)(t.hr,{})]})}function l(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},8860:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/exemple-translate-json-9c549788e07ed767b9714ec2f380f04d.png"},6508:(e,t,n)=>{n.d(t,{Z:()=>s});const s=n.p+"assets/images/result-translations-84b0b10bb389f896d96e3daab3fdddd4.png"},1151:(e,t,n)=>{n.d(t,{Z:()=>d,a:()=>a});var s=n(7294);const i={},r=s.createContext(i);function a(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);