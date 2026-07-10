import React, { useState } from 'react'
import Navbar from '../componant/navbar.jsx'
import Select from 'react-select'
import { BsStars } from 'react-icons/bs'
import { HiOutlineCode } from 'react-icons/hi'
import { Editor } from '@monaco-editor/react'
import { IoCopy } from 'react-icons/io5'
import { PiExportBold } from 'react-icons/pi'
import { ImNewTab } from 'react-icons/im'
import { FiRefreshCcw, FiRefreshCw } from 'react-icons/fi'
import { GoogleGenAI } from '@google/genai'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { MdClose } from 'react-icons/md'
import { IoCloseSharp } from 'react-icons/io5'


const Home = () => {

  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" }, 
    { value: "html-js", label: "HTML + JS" },
    { value: "html-react", label: "HTML + React"}
  ]

  const [outputScreen, setOutputScreen] = useState(false)
  const [tab, setTab] = useState(1)
  const ai = new GoogleGenAI({ apiKey: "AIzaSyAhPwArvViqja2RNAygTVAbF7naHJEvV2k" })
  const [promt, setPromt] = useState("")
  const [framwork, setFramwork] = useState(options[0])
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [newTabOpen, setNewTabOpen] = useState(false)

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#09090B',
      borderColor: '#27272A',
      color: '#FFFFFF',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#09090B',
      border: '1px solid #27272A',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272A' : '#09090B',
      color: '#FFFFFF',
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      color: '#FFFFFF',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#FFFFFF',
    }),
  };

  function extractCode(response) {
    const match = response.match(/```(?:\w+)\n?([\s\S]*)```/)
    return match ? match[1].trim() : response.trim()
  }

  async function getResponse() {
    setLoading(true)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${promt}  
Framework to use: ${framwork.value}  

Requirements:  
-The code must be clean, well-structured, and easy to understand.  
-Optimize for SEO where applicable.  
-Focus on creating a modern, animated, and responsive UI design.  
-Include high-quality hover effects, shadows, animations, colors, and typography.  
-Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
-Do NOT include explanations, text, comments, or anything else besides the code.  
-And give the whole code in a single HTML file.
        `,
    });
    console.log(response.text);
    setOutputScreen(true)
    setCode(extractCode(response.text))
    setLoading(false)
  };

  const copyCode = async () => {
    try{
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast.error('Failed to copy code.');
    }
  }

  const downloadFile = () => {
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: "text/html" })
    let url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
   link.remove()
   window.URL.revokeObjectURL(url)
    toast.success("File Downloaded Successfully")
  }

  return (
    <>
      <Navbar />
      <div className="flex item-center px-[100px] justify-between gap-[30px] bg-black min-h-screen">
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-[gray] mt-2 text-[16px]'>Describe your component and let AI code for you.</p>
          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            styles={customSelectStyles}
            options={options}
            onChange={(e) => {
              setFramwork(e)
            }}

          />
          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea onChange={(e) => { setPromt(e.target.value) }} value={promt} className='w-full min-h-[200px] bg-[#09090B] rounded-xl mt-3 p-[10px] text-white' placeholder="Describe your component in detail and let AI code it for you."></textarea>
          <div className="flex items-center justify-between">
            <p className='text-[gray]'>Click on Generate Button to generate your code</p>
            <button onClick={getResponse} className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 mt-3 ml-auto px-[20px] gap-[10px] transition-all hover:opacity-[.8] text-white"><i><BsStars /></i>Generate</button>
          </div>
        </div>
        <div className="right relative mt-5 left w-[50%] h-[80vh] bg-[#141319] rounded-xl">
          {
            outputScreen === false ?
              <>
              {
                loading === true ?
                <>
                 <div className="loader absolute left-0 top-0 w-full h-full flex items-center justify-center bg-[rgb(0,0,0,0.5)]">
                <ClipLoader />
              </div>
                </> : ""
              }
             
                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div className="circle p-[20px] w-[70px] h-[70px] flex items-center justify-center text-[30px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600"><HiOutlineCode /></div>
                  <p className='text-[16px] text-[gray] mt-3'>Your componenat & code appear here.</p>
                </div>
              </> : <>
                <div className="top w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-[20px]">
                  <button onClick={() => { setTab(1) }} className={` btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""}`}>Code</button>
                  <button onClick={() => { setTab(2) }} className={` btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</button>
                </div>
                <div className="top-2 top w-full h-[60px] bg-[#17171C] flex items-center justify-between gap-[15px] px-[20px]">
                  <div className="left">
                    <p className='font-bold'>Code Editor</p>
                  </div>
                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                        </>
                        :
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => {setNewTabOpen(true)}}><ImNewTab /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                        </>

                    }
                  </div>
                </div>
                <div className="editor h-full">
                  {
                    tab === 1 ?
                      <>
                        <Editor value={code} height="100%" language="html" theme='vs-dark' options={{readOnly: true}} />
                      </> :
                      <>
                        <iframe srcDoc={code} className='preview w-full h-full bg-white text-black flex items-center justify-center'>

                        </iframe>
                      </>
                  }
                </div>
              </>
          }
        </div>
      </div>

          {
            newTabOpen === true ?
            <>
            <div className="container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
              <div className='top text-black w-full  h-[60px] flex items-center justify-between px-[20px]'>
                <div className='left'>
                <p className='font-bold'>Preview</p>
                </div>
                <div className='right flex items-center gap-[10px]'>
                  <button className='copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]' onClick={() => {setNewTabOpen(false) }}> <IoCloseSharp /> </button>
                </div>
              </div>
            <iframe srcDoc={code} className="w-full h-full container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto"></iframe>
            </div>
            
            </>
            : ""
          }

    </>
  )
}

export default Home
