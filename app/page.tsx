"use client"

import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {

  const [image, setImage] = useState<string>("");
  const [aiRes, setAiRes] = useState<string>("")



  function handleFileChanged(event:ChangeEvent<HTMLInputElement>){
    if(event.target.files == null){
      window.alert("No files selected !");
      return
    }
    const file = event.target.files[0]

    //convert base64
    const reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onload = () => {
      //reader .result
      if(typeof(reader.result) === "string"){
        console.log(reader.result)
        setImage(reader.result)
      }
    }

    reader.onerror = (error) => {
      console.log(error)
    }

  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();

    

    console.log("submit")

    if(image === ""){
      alert("Upload Image")
      return;
    }

    console.log("handling submit")

    await fetch("api/analyzeimage", {
      method: "POST",
      headers: {
        "Content-type":"application/json"
      },
      body: JSON.stringify({
        image: image
      })
    }).then(async (response:any)=>{
      const reader = response.body?.getReader();
      setAiRes("");
      while(true){
        const {done, value} = await reader?.read();
        if(done){
          break;
        }

        //value uint8array

        var chunk = new TextDecoder().decode(value);
        setAiRes((prev) => prev + chunk);
      }
    })

  }

  return (
    <div className="min-h-screen flex items-center justify-center text-md">
      <div className="bg-slate-800 w-full max-w-2xl rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold mb-4">Uploaded Image</h2>
        
        {image !== "" ?
        <div className="mb-4 overflow-hidden">
          <img src={image} alt="" className="w-full object-contain max-h-72" />
        </div>
        :
        <div className="mb-4 p-8 text-center">
          <p>Once you upload an image, you will see it here</p>
        </div>
        } 
        
        

        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-sm font-medium">Upload Image</label>
            <input onChange={(e)=> handleFileChanged(e)} type="file" className="text-sm border rounded-lg cursor-pointer" />
          </div>

          <div className="flex justify-center">
            <button type="submit" className="p-2 bg-sky-600 rounded-md mb-4">
              Analyze your image
            </button>
          </div>


        </form>

        {aiRes && ( <div className="border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold mb-2">AI Respone</h2>
          <p>{aiRes}</p>
        </div>)}

      </div>
    </div>
  );
}
